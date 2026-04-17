import { spawn } from "node:child_process";
import { rmSync, watch } from "node:fs";
import { dirname, join } from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const mode = process.argv[2];
const scriptDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = dirname(scriptDir);
const apiDir = join(repoRoot, "apps", "api");
const isWindows = process.platform === "win32";
const npmExecPath = process.env.npm_execpath;
const packageManagerCommand = npmExecPath ? process.execPath : isWindows ? "pnpm.cmd" : "pnpm";
const packageManagerCommandPrefix = npmExecPath ? [npmExecPath] : [];
const tscBin = join(repoRoot, "node_modules", ".bin", isWindows ? "tsc.cmd" : "tsc");
const runtimePackages = ["@gold-shop/types", "@gold-shop/constants", "@gold-shop/validation", "@gold-shop/utils"];
const runtimePackageDirs = runtimePackages.map((packageName) => join(repoRoot, "packages", packageName.split("/")[1]));
const watchedExtensions = [".js", ".js.map", ".json"];

const managedChildren = new Set();
const distWatchers = [];
let apiCompilerProcess;
let apiRuntimeProcess;
let restartTimer;
let runtimeRestartInFlight = false;
let isShuttingDown = false;

function usage() {
  console.error("Usage: node scripts/api-workspace.mjs <build|dev|workspace-dev>");
  process.exit(1);
}

function spawnManagedProcess(command, args, options) {
  const child = spawn(command, args, {
    cwd: options.cwd,
    env: process.env,
    stdio: "inherit"
  });

  managedChildren.add(child);

  child.on("error", (error) => {
    console.error(`[api-workspace] Failed to start ${options.label}: ${error.message}`);
    shutdown(1);
  });

  child.on("exit", (code, signal) => {
    managedChildren.delete(child);
    options.onExit?.(code, signal);
  });

  return child;
}

function runCommand(command, args, cwd, label) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd,
      env: process.env,
      stdio: "inherit"
    });

    child.on("error", (error) => {
      reject(new Error(`[api-workspace] Failed to start ${label}: ${error.message}`));
    });

    child.on("exit", (code) => {
      if (code === 0) {
        resolve(undefined);
        return;
      }

      reject(new Error(`[api-workspace] ${label} exited with code ${code ?? "unknown"}`));
    });
  });
}

async function buildRuntimePackages() {
  for (const packageName of runtimePackages) {
    await runCommand(
      packageManagerCommand,
      [...packageManagerCommandPrefix, "--filter", packageName, "build"],
      repoRoot,
      `build ${packageName}`
    );
  }
}

async function buildApi() {
  rmSync(join(apiDir, "dist"), {
    recursive: true,
    force: true
  });
  rmSync(join(apiDir, "tsconfig.build.tsbuildinfo"), {
    force: true
  });

  await runCommand(tscBin, ["-p", "tsconfig.build.json"], apiDir, "build @gold-shop/api");
}

function startPackageWatchers() {
  for (const packageName of runtimePackages) {
    spawnManagedProcess(packageManagerCommand, [...packageManagerCommandPrefix, "--filter", packageName, "dev"], {
      cwd: repoRoot,
      label: `watch ${packageName}`,
      onExit(code, signal) {
        if (isShuttingDown || signal === "SIGTERM" || signal === "SIGINT" || code === 0) {
          return;
        }

        console.error(`[api-workspace] ${packageName} watcher exited unexpectedly with code ${code ?? "unknown"}.`);
        shutdown(code ?? 1);
      }
    });
  }
}

function killChildProcess(child, next) {
  const forceKillTimer = setTimeout(() => {
    if (!child.killed) {
      child.kill("SIGKILL");
    }
  }, 2000);

  forceKillTimer.unref();

  child.once("exit", () => {
    clearTimeout(forceKillTimer);
    next();
  });

  child.kill("SIGTERM");
}

function startApiCompilerWatch() {
  apiCompilerProcess = spawnManagedProcess(tscBin, ["-p", "tsconfig.build.json", "--watch", "--preserveWatchOutput"], {
    cwd: apiDir,
    label: "compile @gold-shop/api",
    onExit(code, signal) {
      apiCompilerProcess = undefined;

      if (isShuttingDown || signal === "SIGTERM" || signal === "SIGINT" || code === 0) {
        return;
      }

      console.error(`[api-workspace] API compiler watcher exited unexpectedly with code ${code ?? "unknown"}.`);
      shutdown(code ?? 1);
    }
  });
}

function startApiRuntime() {
  apiRuntimeProcess = spawnManagedProcess(process.execPath, [join(apiDir, "dist", "main.js")], {
    cwd: apiDir,
    label: "run @gold-shop/api",
    onExit(code, signal) {
      apiRuntimeProcess = undefined;

      if (runtimeRestartInFlight || isShuttingDown || signal === "SIGTERM" || signal === "SIGINT") {
        return;
      }

      if (code && code !== 0) {
        console.error(`[api-workspace] API runtime exited with code ${code}. Waiting for the next rebuild to retry.`);
      }
    }
  });
}

function restartApiRuntime(reason) {
  if (isShuttingDown) {
    return;
  }

  if (!apiRuntimeProcess) {
    console.log(`[api-workspace] Starting API runtime after ${reason}.`);
    startApiRuntime();
    return;
  }

  runtimeRestartInFlight = true;
  console.log(`[api-workspace] Restarting API runtime after ${reason}.`);

  const currentApiRuntime = apiRuntimeProcess;
  killChildProcess(currentApiRuntime, () => {
    runtimeRestartInFlight = false;

    if (!isShuttingDown) {
      startApiRuntime();
    }
  });
}

function registerDistWatcher(distDir) {
    const watcher = watch(distDir, (eventType, filename) => {
      if (!filename || (eventType !== "change" && eventType !== "rename")) {
        return;
      }

      const fileName = String(filename);

      if (!watchedExtensions.some((extension) => fileName.endsWith(extension))) {
        return;
      }

      clearTimeout(restartTimer);
      restartTimer = setTimeout(() => {
        restartApiRuntime(`build output update (${fileName})`);
      }, 250);
    });

    watcher.on("error", (error) => {
      if (isShuttingDown) {
        return;
      }

      console.error(`[api-workspace] Failed to watch ${distDir}: ${error.message}`);
      shutdown(1);
    });

  distWatchers.push(watcher);
}

function watchRuntimeOutputs() {
  runtimePackageDirs.forEach((packageDir) => {
    registerDistWatcher(join(packageDir, "dist"));
  });

  registerDistWatcher(join(apiDir, "dist"));
}

function shutdown(exitCode = 0) {
  if (isShuttingDown) {
    process.exit(exitCode);
    return;
  }

  isShuttingDown = true;
  clearTimeout(restartTimer);

  distWatchers.forEach((watcher) => watcher.close());

  const remainingChildren = Array.from(managedChildren);

  if (remainingChildren.length === 0) {
    process.exit(exitCode);
    return;
  }

  let pending = remainingChildren.length;

  remainingChildren.forEach((child) => {
    killChildProcess(child, () => {
      pending -= 1;

      if (pending === 0) {
        process.exit(exitCode);
      }
    });
  });
}

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));
process.on("uncaughtException", (error) => {
  console.error(error);
  shutdown(1);
});
process.on("unhandledRejection", (error) => {
  console.error(error);
  shutdown(1);
});

if (!mode || !["build", "dev", "workspace-dev"].includes(mode)) {
  usage();
}

if (mode === "build") {
  await buildRuntimePackages();
  await buildApi();
  process.exit(0);
}

if (mode === "dev") {
  await buildRuntimePackages();
}

await buildApi();
watchRuntimeOutputs();

if (mode === "dev") {
  startPackageWatchers();
}

startApiCompilerWatch();
startApiRuntime();

await new Promise(() => {});

import { Injectable } from "@nestjs/common";

@Injectable()
export class ReportsService {
  getOverview() {
    return {
      status: "starter",
      note: "Reports module is ready for daily, weekly, and monthly reporting endpoints."
    };
  }
}


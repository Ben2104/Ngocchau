import { Injectable } from "@nestjs/common";

import type { DashboardRangeQueryInput } from "@gold-shop/validation";

import { DashboardRepository } from "../../database/repositories/dashboard.repository";
import { resolveDateRange } from "../../common/utils/date-range.util";

@Injectable()
export class DashboardService {
  constructor(private readonly dashboardRepository: DashboardRepository) {}

  getSummary(query: DashboardRangeQueryInput) {
    return this.dashboardRepository.getSummary(resolveDateRange(query.from, query.to));
  }

  getSalesTrend(query: DashboardRangeQueryInput) {
    return this.dashboardRepository.getSalesTrend(resolveDateRange(query.from, query.to));
  }

  getCashOverview(query: DashboardRangeQueryInput) {
    return this.dashboardRepository.getCashOverview(resolveDateRange(query.from, query.to));
  }
}


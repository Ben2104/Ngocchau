import type { DashboardActivityItem, DashboardProductInsight, DashboardTopStrip } from "@gold-shop/types";
import { getInitials } from "@gold-shop/utils";

const activityPeople = [
  { id: "activity-actor-1", fullName: "Nguyễn Văn A" },
  { id: "activity-actor-2", fullName: "Trần Thị B" },
  { id: "activity-actor-3", fullName: "Lê Văn C" },
  { id: "activity-actor-4", fullName: "Phạm Thị D" }
];

export const dashboardActivityMock: DashboardActivityItem[] = [
  {
    id: "activity-1",
    actor: {
      ...activityPeople[0],
      initials: getInitials(activityPeople[0].fullName)
    },
    occurredAt: "2026-04-15T10:30:00.000Z",
    status: "success",
    statusLabel: "Thành công"
  },
  {
    id: "activity-2",
    actor: {
      ...activityPeople[1],
      initials: getInitials(activityPeople[1].fullName)
    },
    occurredAt: "2026-04-15T09:45:00.000Z",
    status: "success",
    statusLabel: "Thành công"
  },
  {
    id: "activity-3",
    actor: {
      ...activityPeople[2],
      initials: getInitials(activityPeople[2].fullName)
    },
    occurredAt: "2026-04-15T08:15:00.000Z",
    status: "failure",
    statusLabel: "Thất bại"
  },
  {
    id: "activity-4",
    actor: {
      ...activityPeople[3],
      initials: getInitials(activityPeople[3].fullName)
    },
    occurredAt: "2026-04-14T17:30:00.000Z",
    status: "success",
    statusLabel: "Thành công"
  }
];

export const dashboardProductInsightsMock: DashboardProductInsight[] = [
  {
    id: "product-1",
    name: "Vàng 9999 (SJC)",
    description: "Lượng vàng miếng",
    price: 68_500_000,
    trendLabel: "+0.4%",
    trendTone: "success",
    accentTone: "gold"
  },
  {
    id: "product-2",
    name: "Vàng 24K",
    description: "Trang sức gia công",
    price: 54_200_000,
    trendLabel: "Ổn định",
    trendTone: "neutral",
    accentTone: "blue"
  }
];

export function buildDashboardTopStrip(date = new Date()): DashboardTopStrip {
  const dateLabel = new Intl.DateTimeFormat("vi-VN", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit"
  }).format(date);

  return {
    dateLabel: dateLabel.charAt(0).toUpperCase() + dateLabel.slice(1),
    goldPriceLabel: `GIÁ VÀNG: ${new Intl.NumberFormat("vi-VN", {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2
    }).format(dashboardProductInsightsMock[0].price / 1_000_000)}tr`,
    unreadCount: 1
  };
}

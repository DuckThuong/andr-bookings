import type { ProfileBookingStatus, ProfileTabKey } from "@/modules/profile/types";

export const PROFILE_TABS: Array<{ key: ProfileTabKey; label: string }> = [
  { key: "overview", label: "Tổng quan" },
  { key: "account", label: "Thông tin" },
  { key: "trips", label: "Lịch sử vé" },
  { key: "tracking", label: "Theo dõi" },
  { key: "settings", label: "Cài đặt" },
];

export const STATUS_COLORS: Record<
  ProfileBookingStatus,
  { color: string; bg: string }
> = {
  "Đã xác nhận": { color: "#15803d", bg: "#dcfce7" },
  "Chờ khởi hành": { color: "#854d0e", bg: "#fef9c3" },
  "Chờ xác nhận": { color: "#1d4ed8", bg: "#dbeafe" },
  "Chưa thanh toán": { color: "#9a3412", bg: "#ffedd5" },
  "Đã hủy": { color: "#991b1b", bg: "#fee2e2" },
};

export const PICKUP_OPTIONS = [
  { value: "mydinh", label: "Bến xe Mỹ Đình" },
  { value: "giapbat", label: "Bến xe Giáp Bát" },
  { value: "nuocngam", label: "Bến xe Nước Ngầm" },
];

export const DROPOFF_OPTIONS = [
  { value: "mienDong", label: "Bến xe Miền Đông" },
  { value: "mienTay", label: "Bến xe Miền Tây" },
  { value: "binhTrieu", label: "Bến xe Bình Triệu" },
];

export const TRACKING_STEP_LABELS = [
  "Đã đặt vé",
  "Đã xác nhận",
  "Chuẩn bị khởi hành",
  "Đang di chuyển",
  "Hoàn thành",
] as const;

export const ACTIVE_TRACKING_STATUSES: ProfileBookingStatus[] = [
  "Chờ khởi hành",
  "Đã xác nhận",
  "Chờ xác nhận",
];

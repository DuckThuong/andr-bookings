import type { Notification, NotifType, NotifGroup } from "./types";

export const NOTIF_TYPE_ICONS: Record<NotifType, string> = {
  ticket: "🎫",
  promo: "🏷️",
  system: "⚙️",
  cancel: "🔄",
  payment: "💳",
  update: "🔔",
};

export const NOTIF_GROUP_LABELS: Record<NotifGroup, string> = {
  today: "Hôm nay",
  yesterday: "Hôm qua",
  week: "Tuần trước",
};

export const NOTIF_BADGE_CLASS_COLORS: Record<
  Notification["badgeClass"],
  { bg: string; text: string }
> = {
  blue: { bg: "#dbeafe", text: "#1d4ed8" },
  green: { bg: "#dcfce7", text: "#15803d" },
  amber: { bg: "#fef9c3", text: "#854d0e" },
  red: { bg: "#fee2e2", text: "#991b1b" },
  purple: { bg: "#ede9fe", text: "#7c3aed" },
};

// Mock initial notifications for development
export const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    type: "ticket",
    title: "Vé xác nhận – Hà Nội → Đà Nẵng",
    sub: "Chuyến 14:30 ngày 18/07 · Nhà xe Phương Trang · Ghế 12A",
    badge: "Xác nhận",
    badgeClass: "blue",
    link: "Xem vé",
    linkHref: "/profile",
    time: "5 phút trước",
    group: "today",
    unread: true,
  },
  {
    id: "2",
    type: "payment",
    title: "Thanh toán thành công",
    sub: "Đơn #BG-20480 · 320.000 VNĐ · Thẻ Visa *4242",
    badge: "Hoàn tất",
    badgeClass: "green",
    link: "Xem đơn",
    time: "1 giờ trước",
    group: "today",
    unread: true,
  },
  {
    id: "3",
    type: "promo",
    title: "Flash sale – Giảm 35% mọi tuyến",
    sub: "Chỉ còn 4 giờ! Áp dụng mã FLASH35 cho tuyến Hà Nội – TP.HCM",
    badge: "Hot",
    badgeClass: "red",
    link: "Đặt ngay",
    linkHref: "/search",
    time: "3 giờ trước",
    group: "today",
    unread: true,
  },
  {
    id: "4",
    type: "ticket",
    title: "Nhắc nhở khởi hành – ngày mai",
    sub: "Chuyến Hà Nội → Hải Phòng · 07:00 sáng · Bến xe Giáp Bát",
    badge: "Sắp đến",
    badgeClass: "amber",
    link: "Xem vé",
    time: "6 giờ trước",
    group: "today",
    unread: false,
  },
  {
    id: "5",
    type: "cancel",
    title: "Hoàn tiền đã xử lý",
    sub: "180.000 VNĐ hoàn về PayOS ví của bạn · Đơn #BG-20399",
    badge: "Hoàn tiền",
    badgeClass: "red",
    link: "Chi tiết",
    time: "Hôm qua 14:22",
    group: "yesterday",
    unread: true,
  },
  {
    id: "6",
    type: "promo",
    title: "Ưu đãi thành viên – Giảm thêm 10%",
    sub: "Đặc quyền tài khoản thường. Áp dụng tuyến liên tỉnh đến 31/07",
    badge: "Thành viên",
    badgeClass: "purple",
    link: "Khám phá",
    linkHref: "/promos",
    time: "Hôm qua 09:05",
    group: "yesterday",
    unread: false,
  },
  {
    id: "7",
    type: "system",
    title: "Cập nhật ứng dụng mới – v2.4.1",
    sub: "Trải nghiệm mua vé nhanh hơn, sửa lỗi hiển thị sơ đồ ghế",
    badge: "Cập nhật",
    badgeClass: "purple",
    time: "3 ngày trước",
    group: "week",
    unread: false,
  },
  {
    id: "8",
    type: "ticket",
    title: "Đánh giá chuyến đi của bạn",
    sub: "Nhà xe Hùng Cường · Hà Nội → Nghệ An · Hãy chia sẻ trải nghiệm",
    badge: "Mời đánh giá",
    badgeClass: "amber",
    link: "Đánh giá ngay",
    time: "5 ngày trước",
    group: "week",
    unread: false,
  },
];

export const NOTIFICATION_FILTERS = [
  { key: "all", label: "Tất cả" },
  { key: "unread", label: "Chưa đọc" },
  { key: "ticket", label: "Vé & đặt chỗ" },
  { key: "promo", label: "Khuyến mãi" },
  { key: "system", label: "Hệ thống" },
] as const;

export type NotificationFilterKey =
  (typeof NOTIFICATION_FILTERS)[number]["key"];

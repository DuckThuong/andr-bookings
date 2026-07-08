export type NotifType =
  | "ticket"
  | "promo"
  | "system"
  | "cancel"
  | "payment"
  | "update";

export type NotifGroup = "today" | "yesterday" | "week";

export type Notification = {
  id: string;
  type: NotifType;
  title: string;
  sub: string;
  badge: string;
  badgeClass: "blue" | "green" | "amber" | "red" | "purple";
  link?: string;
  linkHref?: string;
  time: string;
  group: NotifGroup;
  unread: boolean;
};

export type NotificationSettings = {
  email: boolean;
  sms: boolean;
  push: boolean;
  promotions: boolean;
  bookingUpdates: boolean;
  paymentReminders: boolean;
  travelAlerts: boolean;
  preferredContact: "email" | "sms" | "phone";
};

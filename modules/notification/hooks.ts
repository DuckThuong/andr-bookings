import { useState, useCallback, useMemo } from "react";
import type {
  Notification,
  NotificationSettings,
  NotifGroup,
} from "./types";
import {
  INITIAL_NOTIFICATIONS,
  NOTIFICATION_FILTERS,
  NOTIF_GROUP_LABELS,
} from "./constants";

const INITIAL_SETTINGS: NotificationSettings = {
  email: true,
  sms: false,
  push: true,
  promotions: false,
  bookingUpdates: true,
  paymentReminders: true,
  travelAlerts: false,
  preferredContact: "email",
};

export function useNotifications() {
  const [notifications, setNotifications] =
    useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [settings, setSettings] = useState<NotificationSettings>(INITIAL_SETTINGS);

  const unreadCount = useMemo(
    () => notifications.filter((n) => n.unread).length,
    [notifications],
  );

  const todayCount = useMemo(
    () => notifications.filter((n) => n.group === "today").length,
    [notifications],
  );

  const filterCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: notifications.length,
      unread: unreadCount,
      ticket: notifications.filter(
        (n) => n.type === "ticket" || n.type === "cancel",
      ).length,
      promo: notifications.filter((n) => n.type === "promo").length,
      system: notifications.filter(
        (n) => n.type === "system" || n.type === "update" || n.type === "payment",
      ).length,
    };
    return counts;
  }, [notifications, unreadCount]);

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n)),
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  }, []);

  const deleteNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const updateSettings = useCallback((newSettings: NotificationSettings) => {
    setSettings(newSettings);
  }, []);

  const toggleSetting = useCallback((key: keyof NotificationSettings) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  }, []);

  const getFilteredNotifications = useCallback(
    (filterKey: string) => {
      return notifications.filter((n) => {
        if (filterKey === "unread") return n.unread;
        if (filterKey === "ticket")
          return n.type === "ticket" || n.type === "cancel";
        if (filterKey === "promo") return n.type === "promo";
        if (filterKey === "system")
          return (
            n.type === "system" ||
            n.type === "update" ||
            n.type === "payment"
          );
        return true;
      });
    },
    [notifications],
  );

  const getGroupedNotifications = useCallback(
    (filtered: Notification[]) => {
      const groups: Record<NotifGroup, Notification[]> = {
        today: [],
        yesterday: [],
        week: [],
      };

      filtered.forEach((n) => {
        groups[n.group].push(n);
      });

      return groups;
    },
    [],
  );

  return {
    notifications,
    settings,
    unreadCount,
    todayCount,
    filterCounts,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    updateSettings,
    toggleSetting,
    getFilteredNotifications,
    getGroupedNotifications,
    groupLabels: NOTIF_GROUP_LABELS,
    filters: NOTIFICATION_FILTERS,
  };
}

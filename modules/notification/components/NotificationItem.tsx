import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { Notification } from "@/modules/notification/types";
import {
  NOTIF_BADGE_CLASS_COLORS,
  NOTIF_TYPE_ICONS,
} from "@/modules/notification/constants";

type NotificationItemProps = {
  item: Notification;
  onMarkRead: (id: string) => void;
  onDelete: (id: string) => void;
};

const TYPE_ICON_NAMES: Record<string, keyof typeof Ionicons.glyphMap> = {
  ticket: "ticket-outline",
  promo: "pricetag-outline",
  system: "settings-outline",
  cancel: "refresh-circle-outline",
  payment: "card-outline",
  update: "notifications-outline",
};

export function NotificationItem({
  item,
  onMarkRead,
  onDelete,
}: NotificationItemProps) {
  const badgeColors =
    NOTIF_BADGE_CLASS_COLORS[item.badgeClass] ||
    NOTIF_BADGE_CLASS_COLORS.blue;

  const handlePress = () => {
    if (item.unread) {
      onMarkRead(item.id);
    }

    if (item.linkHref) {
      router.push(item.linkHref as any);
    }
  };

  return (
    <Pressable
      className={`mb-3 flex-row items-start gap-3 rounded-[20px] px-4 py-4 ${
        item.unread ? "bg-[#fef3e2]" : "bg-white_color"
      }`}
      onPress={handlePress}
    >
      {/* Unread indicator */}
      {item.unread && (
        <View className="absolute left-2 top-1/2 h-2 w-2 rounded-full bg-secondary_color" />
      )}

      {/* Icon */}
      <View className="h-10 w-10 items-center justify-center rounded-2xl bg-background_color">
        <Ionicons
          name={TYPE_ICON_NAMES[item.type] || "notification-outline"}
          size={20}
          color="#f97316"
        />
      </View>

      {/* Content */}
      <View className="flex-1">
        <View className="flex-row items-start justify-between gap-2">
          <Text
            className="flex-1 font-semibold text-base text-primary_color"
            numberOfLines={2}
          >
            {item.title}
          </Text>
          <View
            className="rounded-full px-2 py-1"
            style={{ backgroundColor: badgeColors.bg }}
          >
            <Text
              className="text-xs font-medium"
              style={{ color: badgeColors.text }}
            >
              {item.badge}
            </Text>
          </View>
        </View>

        <Text
          className="mt-1 text-sm text-text_color_4"
          numberOfLines={2}
        >
          {item.sub}
        </Text>

        <View className="mt-2 flex-row items-center justify-between">
          <View className="flex-row items-center gap-1">
            <Ionicons name="time-outline" size={12} color="#9ca3af" />
            <Text className="text-xs text-text_color_4">{item.time}</Text>
          </View>

          {item.link && (
            <Text className="text-xs font-medium text-secondary_color">
              {item.link} →
            </Text>
          )}
        </View>
      </View>

      {/* Actions */}
      <View className="flex-col items-center gap-2">
        {item.unread && (
          <Pressable
            className="h-8 w-8 items-center justify-center rounded-full bg-[#dcfce7]"
            onPress={() => onMarkRead(item.id)}
          >
            <Ionicons name="checkmark" size={16} color="#15803d" />
          </Pressable>
        )}
        <Pressable
          className="h-8 w-8 items-center justify-center rounded-full bg-background_color"
          onPress={() => onDelete(item.id)}
        >
          <Ionicons name="trash-outline" size={16} color="#ef4444" />
        </Pressable>
      </View>
    </Pressable>
  );
}

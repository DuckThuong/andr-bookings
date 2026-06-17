import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { BookingSuccessNotification, NextAction } from "../types";

interface NotificationsCardProps {
  notifications: BookingSuccessNotification[];
}

const COLOR_MAP = {
  green: { bg: "bg-green-50", border: "border-green-200", icon: "checkmark-circle", text: "text-green-700" },
  amber: { bg: "bg-amber-50", border: "border-amber-200", icon: "warning", text: "text-amber-700" },
  blue: { bg: "bg-blue-50", border: "border-blue-200", icon: "information-circle", text: "text-blue-700" },
};

export function NotificationsCard({ notifications }: NotificationsCardProps) {
  if (!notifications.length) return null;

  return (
    <View className="mb-4 rounded-2xl bg-white p-4">
      <Text className="mb-3 font-semibold text-primary_color">
        Thông báo quan trọng
      </Text>
      {notifications.map((notif) => {
        const colors = COLOR_MAP[notif.colorClass] || COLOR_MAP.blue;
        return (
          <View
            key={notif.id}
            className={`mb-2 flex-row items-start rounded-xl ${colors.bg} p-3`}
          >
            <Ionicons
              name={colors.icon as any}
              size={20}
              color={notif.colorClass === "green" ? "#16a34a" : notif.colorClass === "amber" ? "#d97706" : "#2563eb"}
            />
            <View className="ml-3 flex-1">
              <Text className={`font-medium ${colors.text}`}>{notif.title}</Text>
              <Text className="mt-1 text-sm text-gray-600">{notif.desc}</Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

interface NextActionsCardProps {
  actions: NextAction[];
  onAction: (prompt: string) => void;
}

export function NextActionsCard({ actions, onAction }: NextActionsCardProps) {
  return (
    <View className="mb-4 rounded-2xl bg-white p-4">
      <Text className="mb-3 font-semibold text-primary_color">
        Hành động tiếp theo
      </Text>
      <View className="flex-row flex-wrap gap-3">
        {actions.map((action) => (
          <Pressable
            key={action.id}
            className="flex-row items-center rounded-full border border-gray-200 bg-gray-50 px-4 py-2"
            onPress={() => onAction(action.prompt)}
          >
            <Ionicons name={action.icon as any} size={16} color="#00609c" />
            <Text className="ml-2 text-sm font-medium text-primary_color">
              {action.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

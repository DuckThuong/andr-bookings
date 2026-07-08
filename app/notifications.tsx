import { useState } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { NotificationItem } from "@/modules/notification/components";
import { useNotifications } from "@/modules/notification/hooks";

export default function NotificationsScreen() {
  const [filter, setFilter] = useState("all");
  const [showSettings, setShowSettings] = useState(false);

  const {
    unreadCount,
    todayCount,
    filterCounts,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    getFilteredNotifications,
    getGroupedNotifications,
    groupLabels,
    filters,
  } = useNotifications();

  const filtered = getFilteredNotifications(filter);
  const grouped = getGroupedNotifications(filtered);

  const totalCount = filterCounts.all;

  return (
    <SafeAreaView className="flex-1 bg-background_color">
      {/* Header */}
      <View className="px-5 pt-3">
        <View className="flex-row items-center justify-between">
          <Text className="font-bold text-[28px] text-primary_color">
            Thông báo
          </Text>
          <Pressable
            className="rounded-full bg-white_color p-2"
            onPress={() => setShowSettings(!showSettings)}
          >
            <Ionicons name="settings-outline" size={22} color="#f97316" />
          </Pressable>
        </View>

        {/* Stats */}
        <View className="mt-4 flex-row gap-3">
          <View className="flex-1 flex-row items-center gap-2 rounded-[20px] bg-white_color px-4 py-3">
            <View className="h-10 w-10 items-center justify-center rounded-2xl bg-[#fef3e2]">
              <Text className="text-lg">🔔</Text>
            </View>
            <View>
              <Text className="font-bold text-lg text-primary_color">
                {totalCount}
              </Text>
              <Text className="text-xs text-text_color_4">Tổng thông báo</Text>
            </View>
          </View>

          <View className="flex-1 flex-row items-center gap-2 rounded-[20px] bg-white_color px-4 py-3">
            <View className="h-10 w-10 items-center justify-center rounded-2xl bg-[#fef9c3]">
              <Text className="text-lg">📬</Text>
            </View>
            <View>
              <Text className="font-bold text-lg text-[#854d0e]">
                {unreadCount}
              </Text>
              <Text className="text-xs text-text_color_4">Chưa đọc</Text>
            </View>
          </View>

          <View className="flex-1 flex-row items-center gap-2 rounded-[20px] bg-white_color px-4 py-3">
            <View className="h-10 w-10 items-center justify-center rounded-2xl bg-[#dcfce7]">
              <Text className="text-lg">📅</Text>
            </View>
            <View>
              <Text className="font-bold text-lg text-[#15803d]">
                {todayCount}
              </Text>
              <Text className="text-xs text-text_color_4">Hôm nay</Text>
            </View>
          </View>
        </View>

        {/* Settings panel */}
        {showSettings && (
          <View className="mt-4 rounded-[20px] bg-white_color p-4">
            <View className="mb-3 flex-row items-center justify-between">
              <Text className="font-semibold text-base text-primary_color">
                Tuỳ chỉnh thông báo
              </Text>
              <Pressable onPress={() => setShowSettings(false)}>
                <Ionicons name="close" size={20} color="#6b7280" />
              </Pressable>
            </View>

            <View className="gap-3">
              {[
                { label: "Vé & đặt chỗ", icon: "🎫", key: "bookingUpdates" },
                { label: "Khuyến mãi", icon: "🏷️", key: "promotions" },
                { label: "Thanh toán", icon: "💳", key: "paymentReminders" },
                { label: "Hệ thống", icon: "⚙️", key: "push" },
                { label: "Email", icon: "📧", key: "email" },
                { label: "Push", icon: "📱", key: "sms" },
              ].map((setting) => (
                <View
                  key={setting.key}
                  className="flex-row items-center justify-between"
                >
                  <View className="flex-row items-center gap-2">
                    <Text>{setting.icon}</Text>
                    <Text className="text-sm text-primary_color">
                      {setting.label}
                    </Text>
                  </View>
                  <View className="h-6 w-12 rounded-full bg-secondary_color" />
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Filter tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mt-4"
          contentContainerStyle="gap-2"
        >
          {filters.map((f) => (
            <Pressable
              key={f.key}
              className={`rounded-full px-4 py-2 ${
                filter === f.key ? "bg-secondary_color" : "bg-white_color"
              }`}
              onPress={() => setFilter(f.key)}
            >
              <Text
                className={`text-sm font-medium ${
                  filter === f.key ? "text-white_color" : "text-primary_color"
                }`}
              >
                {f.label}
              </Text>
              <View
                className={`absolute -right-1 -top-1 h-5 w-5 items-center justify-center rounded-full ${
                  filter === f.key ? "bg-white_color" : "bg-secondary_color"
                }`}
              >
                <Text
                  className={`text-xs font-bold ${
                    filter === f.key ? "text-secondary_color" : "text-white_color"
                  }`}
                >
                  {filterCounts[f.key]}
                </Text>
              </View>
            </Pressable>
          ))}
        </ScrollView>

        {/* Mark all read button */}
        {unreadCount > 0 && (
          <Pressable
            className="mt-4 flex-row items-center justify-center gap-2 rounded-full bg-[#dcfce7] py-3"
            onPress={markAllAsRead}
          >
            <Ionicons name="checkmark-done" size={18} color="#15803d" />
            <Text className="font-medium text-sm text-[#15803d]">
              Đánh dấu đã đọc tất cả
            </Text>
          </Pressable>
        )}
      </View>

      {/* Notification list */}
      <ScrollView
        className="mt-4 flex-1"
        contentContainerStyle="px-5 pb-10"
        showsVerticalScrollIndicator={false}
      >
        {(["today", "yesterday", "week"] as const).map((group) => {
          const items = grouped[group];
          if (!items.length) return null;

          return (
            <View key={group} className="mb-4">
              <Text className="mb-3 font-semibold text-base text-text_color_4">
                {groupLabels[group]}
              </Text>
              {items.map((item) => (
                <NotificationItem
                  key={item.id}
                  item={item}
                  onMarkRead={markAsRead}
                  onDelete={deleteNotification}
                />
              ))}
            </View>
          );
        })}

        {/* Empty state */}
        {filtered.length === 0 && (
          <View className="items-center py-20">
            <Ionicons name="notifications-off-outline" size={64} color="#d1d5db" />
            <Text className="mt-4 font-medium text-lg text-primary_color">
              Không có thông báo
            </Text>
            <Text className="mt-2 text-center text-sm text-text_color_4">
              Thử thay đổi bộ lọc hoặc từ khoá tìm kiếm
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

import { Pressable, Text, View } from "react-native";
import { AppButton } from "@/shared/components";
import type { ProfileBooking, UserProfile } from "@/modules/profile/types";

type ProfileOverviewProps = {
  user?: UserProfile;
  bookings: ProfileBooking[];
  onEditProfile: () => void;
  onViewTrips: () => void;
  onViewTracking: () => void;
};

const REMINDERS = [
  "Hoàn tất thông tin thanh toán",
  "Kiểm tra lại chuyến đi sắp tới",
  "Nhận ưu đãi khi đặt tiếp",
];

export function ProfileOverview({
  user,
  bookings,
  onEditProfile,
  onViewTrips,
  onViewTracking,
}: ProfileOverviewProps) {
  const initials = user?.userName?.trim().charAt(0).toUpperCase() || "K";
  const activeTrips = bookings.filter(
    (booking) =>
      booking.status === "Chờ khởi hành" ||
      booking.status === "Đã xác nhận" ||
      booking.status === "Chờ xác nhận",
  );
  const recentTrips = bookings.slice(0, 2);

  return (
    <View className="gap-4">
      <View className="rounded-[28px] bg-white_color px-4 py-5">
        <View className="flex-row items-center gap-4">
          <View className="h-16 w-16 items-center justify-center rounded-2xl bg-[#fdf1d8]">
            <Text className="font-bold text-2xl text-primary_color">{initials}</Text>
          </View>
          <View className="flex-1">
            <Text className="text-sm text-text_color_4">Tổng quan tài khoản</Text>
            <Text className="mt-1 font-bold text-xl text-primary_color">
              {user?.userName || "Khách"}
            </Text>
            <View className="mt-2 self-start rounded-full bg-[#fef9c3] px-3 py-1">
              <Text className="font-medium text-xs text-[#854d0e]">
                Thành viên Vàng
              </Text>
            </View>
          </View>
        </View>
        <View className="mt-4">
          <AppButton label="Cập nhật hồ sơ" onPress={onEditProfile} />
        </View>
      </View>

      <View className="flex-row gap-3">
        {[
          {
            label: "Số chuyến đã đặt",
            value: String(bookings.length),
            sub: "chuyến xe",
          },
          {
            label: "Điểm thưởng",
            value: "2.560",
            sub: "điểm tích lũy",
          },
          {
            label: "Đang theo dõi",
            value: String(activeTrips.length),
            sub: "chuyến active",
          },
        ].map((stat) => (
          <View
            key={stat.label}
            className="flex-1 rounded-[24px] bg-white_color px-3 py-4"
          >
            <Text className="text-xs text-text_color_4">{stat.label}</Text>
            <Text className="mt-2 font-bold text-lg text-primary_color">
              {stat.value}
            </Text>
            <Text className="mt-1 text-xs text-text_color_4">{stat.sub}</Text>
          </View>
        ))}
      </View>

      <View className="rounded-[28px] bg-white_color px-4 py-5">
        <View className="mb-4 flex-row items-center justify-between">
          <Text className="font-semibold text-lg text-primary_color">
            Hoạt động gần đây
          </Text>
          <Pressable onPress={onViewTrips}>
            <Text className="font-medium text-sm text-secondary_color">
              Xem tất cả
            </Text>
          </Pressable>
        </View>

        {recentTrips.length ? (
          recentTrips.map((trip) => (
            <View
              key={trip.id}
              className="mb-3 rounded-[20px] bg-background_color px-4 py-4"
            >
              <Text className="font-semibold text-base text-primary_color">
                {trip.route}
              </Text>
              <Text className="mt-1 text-sm text-text_color_4">
                {trip.date} · Ghế {trip.seat}
              </Text>
              <Text className="mt-2 text-sm text-secondary_color">
                {trip.status}
              </Text>
            </View>
          ))
        ) : (
          <Text className="text-sm text-text_color_4">Chưa có chuyến nào.</Text>
        )}
      </View>

      <View className="rounded-[28px] bg-white_color px-4 py-5">
        <Text className="font-semibold text-lg text-primary_color">
          Tiến độ hạng thành viên
        </Text>
        <Text className="mt-1 text-sm text-text_color_4">
          Gold → Kim Cương (68%)
        </Text>
        <View className="mt-4 h-2 overflow-hidden rounded-full bg-background_color">
          <View className="h-full w-[68%] rounded-full bg-[#f5a623]" />
        </View>
        <Text className="mt-2 text-xs text-text_color_4">
          Còn 32% nữa để lên Kim Cương
        </Text>
      </View>

      <View className="rounded-[28px] bg-white_color px-4 py-5">
        <Text className="mb-3 font-semibold text-lg text-primary_color">
          Lời nhắc
        </Text>
        {REMINDERS.map((item) => (
          <View
            key={item}
            className="mb-2 flex-row items-center gap-3 rounded-[16px] bg-background_color px-3 py-3"
          >
            <View className="h-2 w-2 rounded-full bg-secondary_color" />
            <Text className="flex-1 text-sm text-primary_color">{item}</Text>
          </View>
        ))}
        {activeTrips.length ? (
          <View className="mt-3">
            <AppButton
              label="Theo dõi chuyến đang active"
              onPress={onViewTracking}
              variant="secondary"
            />
          </View>
        ) : null}
      </View>
    </View>
  );
}

import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { StateBlock } from "@/shared/components";
import { ProfileStatusBadge } from "@/modules/profile/components/ProfileStatusBadge";
import { ACTIVE_TRACKING_STATUSES } from "@/modules/profile/constants";
import {
  buildTrackingSteps,
  getTrackingProgress,
} from "@/modules/profile/mappers";
import type { ProfileBooking } from "@/modules/profile/types";

type ProfileTrackingProps = {
  bookings: ProfileBooking[];
};

export function ProfileTracking({ bookings }: ProfileTrackingProps) {
  const trackableBookings = bookings.filter((booking) =>
    ACTIVE_TRACKING_STATUSES.includes(booking.status),
  );
  const [selectedId, setSelectedId] = useState<string | null>(
    trackableBookings[0]?.id ?? null,
  );

  const selectedBooking =
    trackableBookings.find((booking) => booking.id === selectedId) ??
    trackableBookings[0] ??
    null;

  if (!trackableBookings.length) {
    return (
      <StateBlock
        description="Hiện không có chuyến nào đang chờ khởi hành hoặc đang xử lý."
        title="Chưa có hành trình để theo dõi"
      />
    );
  }

  const progress = selectedBooking
    ? getTrackingProgress(selectedBooking.status)
    : 0;
  const steps = selectedBooking
    ? buildTrackingSteps(selectedBooking.status)
    : [];

  return (
    <View className="gap-4">
      <View className="rounded-[28px] bg-primary_color px-4 py-5">
        <Text className="text-sm uppercase tracking-[1px] text-[#8dc7e3]">
          Theo dõi hành trình
        </Text>
        <Text className="mt-2 font-bold text-[24px] leading-8 text-white_color">
          Tiến độ chuyến xe theo thời gian thực
        </Text>
        <Text className="mt-2 text-sm leading-6 text-text_color_2">
          Theo dõi trạng thái đặt vé, xác nhận và khởi hành của từng chuyến.
        </Text>
      </View>

      <View className="gap-3">
        {trackableBookings.map((booking) => {
          const isActive = booking.id === selectedBooking?.id;

          return (
            <Pressable
              key={booking.id}
              className={`rounded-[24px] px-4 py-4 ${
                isActive ? "bg-[#e7f0f5]" : "bg-white_color"
              }`}
              onPress={() => setSelectedId(booking.id)}
            >
              <View className="flex-row items-start justify-between gap-3">
                <Text className="flex-1 font-semibold text-base text-primary_color">
                  {booking.route}
                </Text>
                <ProfileStatusBadge status={booking.status} />
              </View>
              <Text className="mt-2 text-sm text-text_color_4">
                Khởi hành {booking.date} · {booking.time}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {selectedBooking ? (
        <View className="rounded-[28px] bg-white_color px-4 py-5">
          <Text className="font-semibold text-lg text-primary_color">
            {selectedBooking.route}
          </Text>
          <Text className="mt-1 text-sm text-text_color_4">
            Mã vé #{selectedBooking.bookingCode}
          </Text>

          <View className="mt-5">
            <View className="mb-2 flex-row items-center justify-between">
              <Text className="text-sm text-text_color_4">Tiến độ chuyến</Text>
              <Text className="font-semibold text-sm text-secondary_color">
                {progress}%
              </Text>
            </View>
            <View className="h-3 overflow-hidden rounded-full bg-background_color">
              <View
                className="h-full rounded-full bg-[#f5a623]"
                style={{ width: `${progress}%` }}
              />
            </View>
          </View>

          <View className="mt-5 gap-4">
            {steps.map((step, index) => (
              <View key={step.key} className="flex-row items-start gap-3">
                <View className="items-center">
                  <View
                    className={`h-8 w-8 items-center justify-center rounded-full ${
                      step.done
                        ? "bg-[#22c55e]"
                        : step.active
                          ? "bg-[#f5a623]"
                          : "bg-background_color"
                    }`}
                  >
                    <Text
                      className={`font-bold text-xs ${
                        step.done || step.active
                          ? "text-white_color"
                          : "text-text_color_4"
                      }`}
                    >
                      {index + 1}
                    </Text>
                  </View>
                  {index < steps.length - 1 ? (
                    <View
                      className={`mt-1 h-8 w-0.5 ${
                        step.done ? "bg-[#22c55e]" : "bg-color_border"
                      }`}
                    />
                  ) : null}
                </View>
                <View className="flex-1 pt-1">
                  <Text
                    className={`font-medium text-sm ${
                      step.done || step.active
                        ? "text-primary_color"
                        : "text-text_color_4"
                    }`}
                  >
                    {step.label}
                  </Text>
                  {step.active ? (
                    <Text className="mt-1 text-xs text-secondary_color">
                      Đang diễn ra
                    </Text>
                  ) : null}
                </View>
              </View>
            ))}
          </View>

          <View className="mt-5 gap-3 rounded-[20px] bg-background_color px-4 py-4">
            <InfoRow label="Điểm lên" value={selectedBooking.pickup} />
            <InfoRow label="Điểm xuống" value={selectedBooking.dropoff} />
            <InfoRow label="Ghế" value={selectedBooking.seat} />
            <InfoRow label="Hành khách" value={selectedBooking.passengerName} />
            <InfoRow
              label="Dự kiến"
              value={`${selectedBooking.date} · ${selectedBooking.time}`}
            />
          </View>
        </View>
      ) : null}
    </View>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row items-start justify-between gap-4">
      <Text className="text-sm text-text_color_4">{label}</Text>
      <Text className="flex-1 text-right font-medium text-sm text-primary_color">
        {value}
      </Text>
    </View>
  );
}

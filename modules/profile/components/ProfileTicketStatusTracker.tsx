import { Pressable, Text, View } from "react-native";
import { ProfileStatusBadge } from "@/modules/profile/components/ProfileStatusBadge";
import type { ProfileBooking, ProfileBookingStatus } from "@/modules/profile/types";

type ProfileTicketStatusTrackerProps = {
  booking: ProfileBooking;
};

type TrackerStep = {
  key: string;
  label: string;
  description: string;
  icon: string;
};

const APPROVED_STATUSES: ProfileBookingStatus[] = ["Đã xác nhận", "Chờ khởi hành"];

const STEP_BY_STATUS: Record<ProfileBookingStatus, TrackerStep[]> = {
  "Đã xác nhận": [
    {
      key: "approved",
      label: "Nhà xe đã duyệt vé",
      description: "Đơn đặt vé đã được nhà xe xác nhận thành công.",
      icon: "✓",
    },
    {
      key: "preparing",
      label: "Chuẩn bị khởi hành",
      description: "Hệ thống đang sắp xếp lịch trình và phương tiện.",
      icon: "⋯",
    },
    {
      key: "departure",
      label: "Đến giờ khởi hành",
      description: "Có mặt tại điểm hẹn trước 15 phút để lên xe.",
      icon: "→",
    },
  ],
  "Chờ khởi hành": [
    {
      key: "approved",
      label: "Nhà xe đã duyệt vé",
      description: "Đơn đặt vé đã được nhà xe xác nhận thành công.",
      icon: "✓",
    },
    {
      key: "preparing",
      label: "Chuẩn bị khởi hành",
      description: "Phương tiện đã sẵn sàng tại điểm xuất phát.",
      icon: "✓",
    },
    {
      key: "departure",
      label: "Sẵn sàng khởi hành",
      description: "Chuyến xe sắp lăn bánh. Theo dõi cập nhật realtime.",
      icon: "→",
    },
  ],
  "Chờ xác nhận": [],
  "Chưa thanh toán": [],
  "Đã hủy": [],
};

const ACTIVE_STEP_INDEX: Record<ProfileBookingStatus, number> = {
  "Đã xác nhận": 1,
  "Chờ khởi hành": 2,
  "Chờ xác nhận": 0,
  "Chưa thanh toán": 0,
  "Đã hủy": 0,
};

export function ProfileTicketStatusTracker({
  booking,
}: ProfileTicketStatusTrackerProps) {
  if (!APPROVED_STATUSES.includes(booking.status)) {
    return null;
  }

  const steps = STEP_BY_STATUS[booking.status];
  const activeIndex = ACTIVE_STEP_INDEX[booking.status];

  return (
    <View className="mt-4 rounded-[24px] bg-[#f0f9ff] px-4 py-5">
      <View className="flex-row items-center justify-between">
        <View className="flex-1 pr-3">
          <Text className="text-xs uppercase tracking-[1px] text-secondary_color">
            Theo dõi tình trạng vé
          </Text>
          <Text className="mt-1 font-semibold text-base text-primary_color">
            {booking.status === "Đã xác nhận"
              ? "Vé đã được duyệt"
              : "Sẵn sàng khởi hành"}
          </Text>
        </View>
        <ProfileStatusBadge status={booking.status} />
      </View>

      <View className="mt-2 rounded-[16px] bg-white_color px-3 py-2">
        <Text className="text-xs text-text_color_4">
          Cập nhật lần cuối: vừa xong
        </Text>
      </View>

      <View className="mt-4">
        {steps.map((step, index) => {
          const isDone = index < activeIndex;
          const isActive = index === activeIndex;
          const isLast = index === steps.length - 1;

          const dotBg = isActive
            ? "bg-[#f5a623]"
            : isDone
              ? "bg-[#22c55e]"
              : "bg-white_color border-2 border-color_border";
          const dotText = isActive || isDone ? "text-white_color" : "text-text_color_4";
          const labelColor =
            isActive || isDone ? "text-primary_color" : "text-text_color_4";
          const lineColor = isDone ? "bg-[#22c55e]" : "bg-color_border";

          return (
            <View key={step.key} className="flex-row items-start gap-3">
              <View className="items-center">
                <View
                  className={`h-9 w-9 items-center justify-center rounded-full ${dotBg}`}
                >
                  <Text className={`font-bold text-sm ${dotText}`}>
                    {isDone ? "✓" : step.icon}
                  </Text>
                </View>
                {isLast ? null : (
                  <View className={`my-1 h-9 w-0.5 ${lineColor}`} />
                )}
              </View>

              <View className="flex-1 pb-4">
                <View className="flex-row items-center gap-2">
                  <Text className={`font-semibold text-sm ${labelColor}`}>
                    {step.label}
                  </Text>
                  {isActive ? (
                    <View className="rounded-full bg-[#fef9c3] px-2 py-0.5">
                      <Text className="text-[10px] font-medium text-[#854d0e]">
                        ĐANG DIỄN RA
                      </Text>
                    </View>
                  ) : null}
                </View>
                <Text
                  className={`mt-1 text-xs leading-5 ${
                    isActive || isDone ? "text-text_color_4" : "text-text_color_4/70"
                  }`}
                >
                  {step.description}
                </Text>
                {isActive ? (
                  <View className="mt-2 flex-row items-center gap-2 self-start rounded-full bg-secondary_color px-3 py-1">
                    <View className="h-1.5 w-1.5 rounded-full bg-white_color" />
                    <Text className="text-[11px] font-medium text-white_color">
                      Đang xử lý
                    </Text>
                  </View>
                ) : null}
              </View>
            </View>
          );
        })}
      </View>

      <View className="mt-3 flex-row gap-2">
        <Pressable
          className="flex-1 items-center justify-center rounded-[16px] bg-white_color px-3 py-3"
          onPress={() => undefined}
        >
          <Text className="font-semibold text-xs text-secondary_color">
            Xem chi tiết chuyến
          </Text>
        </Pressable>
        <Pressable
          className="flex-1 items-center justify-center rounded-[16px] bg-secondary_color px-3 py-3"
          onPress={() => undefined}
        >
          <Text className="font-semibold text-xs text-white_color">
            Liên hệ nhà xe
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

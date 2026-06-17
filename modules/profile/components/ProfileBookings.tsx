import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { AppButton, FormText, StateBlock } from "@/shared/components";
import { ProfileStatusBadge } from "@/modules/profile/components/ProfileStatusBadge";
import { ProfileTicketStatusTracker } from "@/modules/profile/components/ProfileTicketStatusTracker";
import type { ProfileBooking } from "@/modules/profile/types";

type ProfileBookingsProps = {
  bookings: ProfileBooking[];
  selectedBooking?: ProfileBooking | null;
  isLoading: boolean;
  isDetailLoading: boolean;
  saving: boolean;
  onSelect: (id: string) => void;
  onSave: (values: Partial<ProfileBooking>) => void;
  onContactOperator?: (operatorCode?: string, operatorName?: string, operatorUserId?: number) => void;
};

export function ProfileBookings({
  bookings,
  selectedBooking,
  isLoading,
  isDetailLoading,
  saving,
  onSelect,
  onSave,
  onContactOperator,
}: ProfileBookingsProps) {
  const [passengerName, setPassengerName] = useState("");
  const [contactPhone, setContactPhone] = useState("");

  const selectedId = selectedBooking?.id ?? null;

  useEffect(() => {
    if (!selectedBooking) return;
    setPassengerName(selectedBooking.passengerName);
    setContactPhone(selectedBooking.contactPhone);
  }, [selectedBooking]);

  if (isLoading) {
    return (
      <View className="items-center rounded-[28px] bg-white_color px-5 py-10">
        <ActivityIndicator color="#f5a623" />
        <Text className="mt-3 text-sm text-text_color_4">Đang tải vé...</Text>
      </View>
    );
  }

  if (!bookings.length) {
    return (
      <StateBlock
        description="Bạn chưa đặt chuyến nào. Hãy tìm và đặt vé ngay."
        title="Chưa có vé nào"
      />
    );
  }

  return (
    <View className="gap-4">
      <View className="rounded-[28px] bg-white_color px-4 py-4">
        <Text className="font-semibold text-lg text-primary_color">Vé đã đặt</Text>
        <Text className="mt-1 text-sm text-text_color_4">
          Xem và cập nhật thông tin cho từng chuyến xe.
        </Text>
        <Text className="mt-2 font-medium text-sm text-secondary_color">
          {bookings.length} vé
        </Text>
      </View>

      {bookings.map((booking) => {
        const isActive = booking.id === selectedId;

        return (
          <Pressable
            key={booking.id}
            className={`rounded-[24px] px-4 py-4 ${
              isActive ? "bg-[#e7f0f5]" : "bg-white_color"
            }`}
            onPress={() => onSelect(booking.id)}
          >
            <View className="flex-row items-start justify-between gap-3">
              <Text className="flex-1 font-semibold text-base text-primary_color">
                {booking.route}
              </Text>
              <ProfileStatusBadge status={booking.status} />
            </View>
            <Text className="mt-2 text-sm text-text_color_4">
              {booking.date} · {booking.time} · Ghế {booking.seat}
            </Text>
            <Text className="mt-1 text-sm text-text_color_4">
              #{booking.bookingCode}
            </Text>
          </Pressable>
        );
      })}

      {selectedBooking ? (
        <View className="rounded-[28px] bg-white_color px-4 py-5">
          {isDetailLoading ? (
            <ActivityIndicator color="#f5a623" />
          ) : (
            <>
              <View className="mb-4 flex-row items-start justify-between gap-3">
                <View className="flex-1">
                  <Text className="text-sm text-text_color_4">
                    #{selectedBooking.bookingCode}
                  </Text>
                  <Text className="mt-1 font-bold text-xl text-primary_color">
                    {selectedBooking.route}
                  </Text>
                  <Text className="mt-1 text-sm text-text_color_4">
                    {selectedBooking.date} · {selectedBooking.time}
                  </Text>
                </View>
                <ProfileStatusBadge status={selectedBooking.status} />
              </View>

              <View className="gap-3 rounded-[20px] bg-background_color px-4 py-4">
                <DetailRow label="Hành khách" value={selectedBooking.passengerName} />
                <DetailRow label="Số ghế" value={selectedBooking.seat} />
                <DetailRow label="Điểm lên xe" value={selectedBooking.pickup} />
                <DetailRow label="Điểm xuống xe" value={selectedBooking.dropoff} />
                <DetailRow
                  label="Phương thức TT"
                  value={selectedBooking.paymentMethod}
                />
                <DetailRow label="Liên hệ" value={selectedBooking.contactPhone} />
              </View>

              <ProfileTicketStatusTracker
                booking={selectedBooking}
                onContactOperator={onContactOperator}
              />

              {selectedBooking.canEdit ? (
                <View className="mt-4 gap-4">
                  <Text className="font-semibold text-base text-primary_color">
                    Cập nhật thông tin
                  </Text>
                  <FormText
                    label="Tên hành khách"
                    onChangeText={setPassengerName}
                    placeholder="Nguyễn Văn An"
                    value={passengerName}
                  />
                  <FormText
                    keyboardType="phone-pad"
                    label="Số điện thoại"
                    onChangeText={setContactPhone}
                    placeholder="0987654321"
                    value={contactPhone}
                  />
                  <AppButton
                    label="Lưu cập nhật"
                    loading={saving}
                    onPress={() =>
                      onSave({
                        passengerName,
                        contactPhone,
                        pickupValue: selectedBooking.pickupValue,
                        dropoffValue: selectedBooking.dropoffValue,
                      })
                    }
                  />
                </View>
              ) : selectedBooking.status === "Đã xác nhận" ||
                selectedBooking.status === "Chờ khởi hành" ? null : (
                <View className="mt-4 rounded-[16px] bg-[#fef9c3] px-4 py-3">
                  <Text className="text-sm text-[#854d0e]">
                    {selectedBooking.status === "Chờ xác nhận"
                      ? "Đơn đang chờ nhà xe xác nhận — không thể chỉnh sửa."
                      : selectedBooking.status === "Đã hủy"
                        ? "Đơn đặt vé đã bị hủy — không thể chỉnh sửa."
                        : "Chỉ có thể chỉnh sửa khi đơn đang giữ chỗ và chưa hết hạn."}
                  </Text>
                </View>
              )}
            </>
          )}
        </View>
      ) : null}
    </View>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row items-start justify-between gap-4">
      <Text className="text-sm text-text_color_4">{label}</Text>
      <Text className="flex-1 text-right font-medium text-sm text-primary_color">
        {value}
      </Text>
    </View>
  );
}

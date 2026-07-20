import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";

import { usePaymentStatusQuery, useBookingByPaymentLinkQuery, useBookingQuery } from "@/modules/booking/hooks";
import { formatCurrencyVND } from "@/shared/utils/format";
import { AppButton } from "@/shared/components";

export default function PaymentSuccessScreen() {
  const searchParams = useLocalSearchParams<{
    id?: string;
    orderCode?: string;
  }>();

  const paymentLinkId = searchParams.id;
  const orderCode = searchParams.orderCode;

  // Step 1: Get payment status
  const paymentStatusQuery = usePaymentStatusQuery(paymentLinkId);
  const paymentStatus = paymentStatusQuery.data?.status;
  const isPaid = paymentStatus === "paid";

  // Step 2: Get booking by payment link (only if paid)
  const bookingByPaymentQuery = useBookingByPaymentLinkQuery(
    isPaid ? paymentLinkId : undefined,
  );
  const bookingId = bookingByPaymentQuery.data?.bookingId;

  // Step 3: Get full booking details
  const bookingQuery = useBookingQuery(bookingId);

  const isLoading =
    paymentStatusQuery.isLoading ||
    bookingByPaymentQuery.isLoading ||
    bookingQuery.isLoading;

  const displayData = useMemo(() => {
    if (!bookingQuery.data) return null;

    const booking = bookingQuery.data;
    const trip = booking.trip as any;

    return {
      bookingId: booking.bookingId,
      status: booking.status,
      route: trip
        ? `${trip.departCity || ""} → ${trip.arriveCity || ""}`
        : "Chuyến xe",
      date: trip?.date || "",
      time: trip?.departTime || "",
      operatorName: trip?.operatorName || "",
      seats: booking.seats || [],
      total: booking.pricing?.total || 0,
      phone: bookingByPaymentQuery.data?.passengerPhone || "",
    };
  }, [bookingQuery.data, bookingByPaymentQuery.data]);

  const handleGoHome = () => {
    router.replace("/(tabs)/home");
  };

  const handleViewHistory = () => {
    router.replace("/(tabs)/profile");
  };

  const handleDownloadTicket = () => {
  };

  if (!paymentLinkId) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-background_color px-5">
        <Ionicons name="alert-circle-outline" size={64} color="#ef4444" />
        <Text className="mt-4 text-center font-bold text-xl text-primary_color">
          Không tìm thấy thông tin thanh toán
        </Text>
        <Text className="mt-2 text-center text-sm text-text_color_4">
          Vui lòng kiểm tra lại đường link thanh toán.
        </Text>
        <View className="mt-8">
          <AppButton label="Về trang chủ" onPress={handleGoHome} />
        </View>
      </SafeAreaView>
    );
  }

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-background_color px-5">
        <ActivityIndicator size="large" color="#f97316" />
        <Text className="mt-4 text-sm text-text_color_4">
          Đang kiểm tra trạng thái thanh toán...
        </Text>
      </SafeAreaView>
    );
  }

  // Payment failed or cancelled
  if (!isPaid) {
    return (
      <SafeAreaView className="flex-1 bg-background_color">
        <View className="flex-1 px-5 pt-10">
          {/* Header */}
          <View className="mb-6 flex-row items-center gap-3">
            <Pressable
              className="rounded-full bg-white_color p-2"
              onPress={handleGoHome}
            >
              <Ionicons name="arrow-back" size={24} color="#f97316" />
            </Pressable>
            <Text className="font-bold text-xl text-primary_color">
              Thanh toán
            </Text>
          </View>

          {/* Failed state */}
          <View className="flex-1 items-center justify-center">
            <View className="h-24 w-24 items-center justify-center rounded-full bg-[#fee2e2]">
              <Ionicons name="close-circle" size={64} color="#ef4444" />
            </View>
            <Text className="mt-6 font-bold text-2xl text-[#dc2626]">
              Thanh toán không thành công
            </Text>
            <Text className="mt-3 text-center text-base text-text_color_4">
              {orderCode
                ? `Mã đơn hàng: ${orderCode}`
                : "Thanh toán đã bị hủy bỏ."}
            </Text>

            <View className="mt-4 rounded-[16px] bg-[#fef3c7] p-4">
              <Text className="text-center text-sm text-[#92400e]">
                Nếu bạn đã thanh toán nhưng vẫn thấy thông báo này, vui
                lòng đợi 5-10 phút để hệ thống cập nhật.
              </Text>
            </View>
          </View>

          {/* Actions */}
          <View className="gap-3 pb-8">
            <AppButton label="Về trang chủ" onPress={handleGoHome} />
            <AppButton
              label="Liên hệ hỗ trợ"
              variant="secondary"
              onPress={() => router.push("/support")}
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // Payment successful
  return (
    <SafeAreaView className="flex-1 bg-background_color">
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 40, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="mb-6 flex-row items-center gap-3">
          <Pressable
            className="rounded-full bg-white_color p-2"
            onPress={handleGoHome}
          >
            <Ionicons name="arrow-back" size={24} color="#f97316" />
          </Pressable>
          <Text className="font-bold text-xl text-primary_color">
            Thanh toán
          </Text>
        </View>

        {/* Success Hero */}
        <View className="items-center rounded-[24px] bg-[#dcfce7] px-5 py-8">
          <View className="h-20 w-20 items-center justify-center rounded-full bg-[#15803d]">
            <Ionicons name="checkmark" size={48} color="#ffffff" />
          </View>
          <Text className="mt-4 font-bold text-2xl text-[#15803d]">
            Đặt vé thành công!
          </Text>
          <Text className="mt-2 text-center text-base text-text_color_4">
            Cảm ơn bạn đã đặt vé. Mã đặt vé của bạn là:
          </Text>
          <View className="mt-3 flex-row items-center gap-2 rounded-full bg-white px-4 py-2">
            <Text className="font-mono font-bold text-lg text-primary_color">
              #{displayData?.bookingId || orderCode}
            </Text>
            <Ionicons name="copy" size={18} color="#f97316" />
          </View>
        </View>

        {/* Ticket Card */}
        {displayData && (
          <View className="mt-4 rounded-[24px] bg-white_color px-5 py-5">
            <Text className="font-bold text-lg text-primary_color">
              Thông tin vé
            </Text>

            <View className="mt-4 gap-3 rounded-[16px] bg-background_color p-4">
              <InfoRow label="Tuyến xe" value={displayData.route} />
              <InfoRow label="Ngày" value={displayData.date} />
              <InfoRow label="Giờ khởi hành" value={displayData.time} />
              <InfoRow label="Nhà xe" value={displayData.operatorName} />
              <InfoRow
                label="Số ghế"
                value={displayData.seats.map((s: any) => s.name || s.code).join(", ") || "-"}
              />
              <InfoRow label="Số điện thoại" value={displayData.phone} />
            </View>
          </View>
        )}

        {/* Payment Summary */}
        {displayData && (
          <View className="mt-4 rounded-[24px] bg-white_color px-5 py-5">
            <Text className="font-bold text-lg text-primary_color">
              Thanh toán
            </Text>
            <View className="mt-3 flex-row items-center justify-between">
              <Text className="text-base text-text_color_4">
                Phương thức
              </Text>
              <View className="flex-row items-center gap-2">
                <Ionicons name="card-outline" size={18} color="#f97316" />
                <Text className="font-medium text-base text-primary_color">
                  PayOS
                </Text>
              </View>
            </View>
            <View className="mt-3 flex-row items-center justify-between border-t border-dashed border-gray-200 pt-3">
              <Text className="font-bold text-lg text-primary_color">
                Tổng thanh toán
              </Text>
              <Text className="font-bold text-xl text-[#dc2626]">
                {formatCurrencyVND(displayData.total)}
              </Text>
            </View>
          </View>
        )}

        {/* Notifications */}
        <View className="mt-4 rounded-[24px] bg-[#fef3c7] px-5 py-5">
          <View className="flex-row items-start gap-3">
            <Ionicons name="information-circle" size={24} color="#92400e" />
            <View className="flex-1">
              <Text className="font-semibold text-base text-[#92400e]">
                Lưu ý
              </Text>
              <Text className="mt-1 text-sm text-[#92400e]">
                • Mang theo mã vé hoặc CMND/CCCD khi lên xe{"\n"}
                • Có mặt tại điểm đón trước 15 phút{"\n"}
                • Liên hệ hotline 1900 1234 nếu cần hỗ trợ
              </Text>
            </View>
          </View>
        </View>

        {/* Next Actions */}
        <View className="mt-6 gap-3">
          <AppButton label="Về trang chủ" onPress={handleGoHome} />
          <AppButton
            label="Xem lịch sử đặt vé"
            variant="secondary"
            onPress={handleViewHistory}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row items-start justify-between">
      <Text className="text-sm text-text_color_4">{label}</Text>
      <Text className="max-w-[60%] text-right font-medium text-sm text-primary_color">
        {value || "-"}
      </Text>
    </View>
  );
}

import { useState, useEffect } from "react";
import { router, useLocalSearchParams } from "expo-router";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { ProgressSteps, TicketCard, PaymentSelector } from "@/modules/booking/components";
import { useConfirmPaymentMutation } from "@/modules/booking/hooks";
import type {
  BookingPricing,
  BookingSuccessSeat,
  PaymentMethod,
} from "@/modules/booking/types";
import { AppButton } from "@/shared/components";

const PAYMENT_METHODS: PaymentMethod[] = [
  { id: "payos", label: "PayOS", icon: "card" },
  { id: "cash", label: "Tiền mặt", icon: "wallet" },
];

export default function BookingConfirmScreen() {
  const params = useLocalSearchParams<{
    holdId?: string;
    seats?: string;
    addons?: string;
    pricing?: string;
    holdSeconds?: string;
    pageData?: string;
  }>();

  const [payMethod, setPayMethod] = useState("card");
  const [countdown, setCountdown] = useState(600);

  const confirmMutation = useConfirmPaymentMutation();

  const seats: BookingSuccessSeat[] = params.seats
    ? JSON.parse(params.seats)
    : [];
  const pricing: BookingPricing = params.pricing
    ? JSON.parse(params.pricing)
    : { subTotal: 0, addonsTotal: 0, fee: 0, promoDiscount: 0, total: 0 };
  const pageData = params.pageData ? JSON.parse(params.pageData) : null;
  const holdSeconds = Number(params.holdSeconds) || 600;

  const trip = pageData?.trip || {};
  const passenger = pageData?.passenger || {};

  useEffect(() => {
    setCountdown(holdSeconds);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          Alert.alert("Hết giờ", "Phiên giữ ghế đã hết. Vui lòng đặt lại.", [
            { text: "OK", onPress: () => router.replace("/(tabs)/search") },
          ]);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [holdSeconds]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const handleConfirm = async () => {
    if (!params.holdId) return;

    try {
      const result = await confirmMutation.mutateAsync({
        holdId: params.holdId,
        payload: { paymentMethodId: payMethod },
      });

      router.replace({
        pathname: "/booking/success",
        params: {
          bookingId: result.bookingId,
          seats: params.seats,
          pricing: JSON.stringify(result.pricing),
          holdSeconds: String(holdSeconds),
          pageData: params.pageData,
          status: result.status,
        },
      });
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? "Lỗi thanh toán";
      Alert.alert("Lỗi", Array.isArray(msg) ? msg[0] : msg);
    }
  };

  const tripData = {
    from: trip.from,
    to: trip.to,
    departTime: trip.departTime,
    arriveTime: trip.arriveTime,
    arriveNote: trip.arriveNote,
    date: trip.date,
    durationLabel: trip.durationLabel,
    operatorName: trip.operatorName,
  };

  return (
    <SafeAreaView className="flex-1 bg-background_color">
      <ProgressSteps activeIdx={2} />

      <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
        {/* Countdown */}
        <View className="flex-row items-center justify-center rounded-2xl bg-amber-50 p-4">
          <Ionicons name="time" size={24} color="#d97706" />
          <View className="ml-3">
            <Text className="text-2xl font-bold text-amber-600">
              {formatTime(countdown)}
            </Text>
            <Text className="text-xs text-amber-600">
              Giữ ghế của bạn. Hoàn tất trước khi hết giờ.
            </Text>
          </View>
        </View>

        {/* Ticket Card */}
        <TicketCard trip={tripData} seats={seats} pricing={pricing} />

        {/* Passenger Info */}
        <View className="rounded-2xl bg-white p-4">
          <View className="mb-3 flex-row items-center justify-between">
            <Text className="font-semibold text-primary_color">
              Thông tin hành khách
            </Text>
            <Pressable onPress={() => router.back()}>
              <Text className="text-sm font-medium text-secondary_color">
                Chỉnh sửa
              </Text>
            </Pressable>
          </View>
          <View className="gap-2">
            <View className="flex-row">
              <Text className="w-24 text-sm text-gray-500">Họ tên</Text>
              <Text className="flex-1 text-sm font-medium">
                {passenger.fullName || "Chưa có"}
              </Text>
            </View>
            <View className="flex-row">
              <Text className="w-24 text-sm text-gray-500">Điện thoại</Text>
              <Text className="flex-1 text-sm font-medium">
                {passenger.phone || "Chưa có"}
              </Text>
            </View>
            <View className="flex-row">
              <Text className="w-24 text-sm text-gray-500">Điểm lên</Text>
              <Text className="flex-1 text-sm font-medium">
                {passenger.pickupPointDefault || "Chưa có"}
              </Text>
            </View>
            <View className="flex-row">
              <Text className="w-24 text-sm text-gray-500">Điểm xuống</Text>
              <Text className="flex-1 text-sm font-medium">
                {passenger.dropoffPointDefault || "Chưa có"}
              </Text>
            </View>
          </View>
        </View>

        {/* Price Breakdown */}
        <View className="rounded-2xl bg-white p-4">
          <Text className="mb-3 font-semibold text-primary_color">
            Chi tiết thanh toán
          </Text>
          <View className="gap-2">
            <View className="flex-row justify-between">
              <Text className="text-gray-500">Giá vé ({seats.length} ghế)</Text>
              <Text className="font-medium">
                {pricing.subTotal.toLocaleString()}đ
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-500">Phí dịch vụ (5%)</Text>
              <Text className="font-medium">
                {pricing.fee.toLocaleString()}đ
              </Text>
            </View>
            {pricing.promoDiscount > 0 && (
              <View className="flex-row justify-between">
                <Text className="text-green-600">
                  Giảm giá ({pricing.promoCode})
                </Text>
                <Text className="font-medium text-green-600">
                  −{pricing.promoDiscount.toLocaleString()}đ
                </Text>
              </View>
            )}
            <View className="flex-row justify-between border-t border-gray-200 pt-2">
              <Text className="font-semibold text-primary_color">Tổng cộng</Text>
              <Text className="text-xl font-bold text-secondary_color">
                {pricing.total.toLocaleString()}đ
              </Text>
            </View>
          </View>
        </View>

        {/* Payment Method */}
        <View className="rounded-2xl bg-white p-4">
          <Text className="mb-3 font-semibold text-primary_color">
            Phương thức thanh toán
          </Text>
          <PaymentSelector
            methods={PAYMENT_METHODS}
            selected={payMethod}
            onChange={setPayMethod}
          />
        </View>

        {/* Policy Note */}
        <View className="flex-row items-start rounded-xl bg-blue-50 p-3">
          <Ionicons name="information-circle" size={20} color="#2563eb" />
          <View className="ml-2 flex-1">
            <Text className="text-sm font-medium text-blue-700">
              Chính sách huỷ vé
            </Text>
            <Text className="mt-1 text-xs text-blue-600">
              Hoàn 80% nếu huỷ trước 24h · Hoàn 50% nếu huỷ trước 6h · Không
              hoàn nếu huỷ dưới 6h.
            </Text>
          </View>
        </View>

        {/* Confirm Button */}
        <AppButton
          label={`Thanh toán ngay — ${pricing.total.toLocaleString()}đ`}
          onPress={handleConfirm}
          loading={confirmMutation.isPending}
        />

        <View className="flex-row items-center justify-center">
          <Ionicons name="lock-closed" size={14} color="#6b7280" />
          <Text className="ml-1 text-xs text-gray-500">
            Thanh toán được bảo mật bởi SSL 256-bit
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

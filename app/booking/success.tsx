import { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Share,
  Alert,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { ProgressSteps, NotificationsCard, NextActionsCard } from "@/modules/booking/components";
import { useBookingQuery } from "@/modules/booking/hooks";
import type {
  BookingPricing,
  BookingSuccessSeat,
  BookingSuccessNotification,
  NextAction,
} from "@/modules/booking/types";

export default function BookingSuccessScreen() {
  const params = useLocalSearchParams<{
    bookingId?: string;
    seats?: string;
    pricing?: string;
    pageData?: string;
    status?: string;
  }>();

  const { data: freshBooking, isLoading } = useBookingQuery(params.bookingId);

  const seats: BookingSuccessSeat[] = params.seats
    ? JSON.parse(params.seats)
    : freshBooking?.seats || [];
  const pricing: BookingPricing = params.pricing
    ? JSON.parse(params.pricing)
    : freshBooking?.pricing || {
        subTotal: 0,
        addonsTotal: 0,
        fee: 0,
        promoDiscount: 0,
        total: 0,
      };
  const pageData = params.pageData ? JSON.parse(params.pageData) : null;
  const status = params.status || freshBooking?.status || "confirmed";

  const trip = pageData?.trip || freshBooking?.trip || {};
  const isPending = status === "pending_approval";

  const tripData = {
    from: trip.from || trip.departCity,
    to: trip.to || trip.arriveCity,
    departTime: trip.departTime || trip.departTime,
    arriveTime: trip.arriveTime,
    arriveNote: trip.arriveTimeNote,
    date: trip.date,
    durationLabel: trip.durationLabel,
    operatorName: trip.operatorName,
  };

  const notifications: BookingSuccessNotification[] =
    freshBooking?.notifications || [];
  const nextActions: NextAction[] = freshBooking?.nextActions || [
    { id: "1", icon: "home", label: "Về trang chủ", prompt: "go_home" },
    {
      id: "2",
      icon: "ticket",
      label: "Xem lịch sử",
      prompt: "view_history",
    },
  ];

  const handleAction = async (prompt: string) => {
    switch (prompt) {
      case "go_home":
        router.replace("/(tabs)/home");
        break;
      case "view_history":
        router.replace("/(tabs)/profile");
        break;
      case "share_ticket":
        try {
          await Share.share({
            title: "Vé xe của tôi",
            message: `Mã đặt vé: ${params.bookingId}`,
          });
        } catch {
          Alert.alert("Đã sao chép", "Mã đặt vé đã được sao chép");
        }
        break;
      default:
        break;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background_color">
      <ProgressSteps activeIdx={3} />

      <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
        {/* Success Hero */}
        <View className="items-center rounded-3xl bg-gradient-to-br from-green-500 to-green-600 p-6">
          <View className="mb-4 h-20 w-20 items-center justify-center rounded-full bg-white/20">
            <Ionicons
              name={isPending ? "time" : "checkmark-circle"}
              size={48}
              color="white"
            />
          </View>
          {isPending ? (
            <>
              <Text className="text-xl font-bold text-white">
                Đang chờ xác nhận
              </Text>
              <Text className="mt-2 text-center text-sm text-green-100">
                Yêu cầu của bạn đang được nhà xe xử lý. Vui lòng chờ trong
                giây lát.
              </Text>
            </>
          ) : (
            <>
              <Text className="text-xl font-bold text-white">Đặt vé thành công!</Text>
              <Text className="mt-2 text-center text-sm text-green-100">
                Cảm ơn bạn đã đặt vé. Chúc bạn có chuyến đi vui vẻ!
              </Text>
            </>
          )}
          <View className="mt-4 rounded-full bg-white/20 px-6 py-2">
            <Text className="text-sm font-medium text-white">
              Mã đặt vé: {params.bookingId}
            </Text>
          </View>
        </View>

        {/* Ticket Card */}
        <View className="rounded-2xl bg-white p-4">
          <View className="mb-4 flex-row items-center justify-between">
            <Text className="font-bold text-lg text-primary_color">Vé của bạn</Text>
            <View className="rounded-full bg-green-100 px-3 py-1">
              <Text className="text-xs font-medium text-green-700">
                {seats.length} ghế
              </Text>
            </View>
          </View>

          <View className="mb-4 flex-row">
            <View className="flex-1">
              <Text className="text-2xl font-bold text-primary_color">
                {tripData.departTime || "00:00"}
              </Text>
              <Text className="text-sm text-gray-500">{tripData.from}</Text>
            </View>
            <View className="items-center px-4">
              <Text className="text-xs text-gray-400">
                {tripData.durationLabel}
              </Text>
              <View className="my-1 flex-row items-center">
                <View className="h-2 w-2 rounded-full bg-primary_color" />
                <View className="h-0.5 w-8 bg-gray-300" />
                <Ionicons name="bus" size={16} color="#00609c" />
                <View className="h-0.5 w-8 bg-gray-300" />
                <View className="h-2 w-2 rounded-full bg-secondary_color" />
              </View>
              <Text className="text-xs text-gray-400">{tripData.date}</Text>
            </View>
            <View className="flex-1 items-end">
              <Text className="text-2xl font-bold text-primary_color">
                {tripData.arriveTime}
                {tripData.arriveNote && (
                  <Text className="text-sm font-normal"> ({tripData.arriveNote})</Text>
                )}
              </Text>
              <Text className="text-sm text-gray-500">{tripData.to}</Text>
            </View>
          </View>

          <View className="mb-4 flex-row items-center border-t border-gray-100 pt-4">
            <Ionicons name="business" size={16} color="#6b7280" />
            <Text className="ml-2 text-sm text-gray-600">
              {tripData.operatorName}
            </Text>
            <View className="ml-auto flex-row">
              {seats.slice(0, 3).map((seat) => (
                <View
                  key={seat.id}
                  className="ml-1 rounded-lg bg-gray-100 px-2 py-1"
                >
                  <Text className="text-xs font-medium">{seat.id}</Text>
                </View>
              ))}
              {seats.length > 3 && (
                <Text className="ml-2 text-xs text-gray-400">
                  +{seats.length - 3}
                </Text>
              )}
            </View>
          </View>

          <View className="flex-row justify-between border-t border-gray-100 pt-3">
            <Text className="text-gray-500">Tổng cộng</Text>
            <Text className="text-lg font-bold text-secondary_color">
              {pricing.total.toLocaleString()}đ
            </Text>
          </View>
        </View>

        {/* Payment Summary */}
        <View className="rounded-2xl bg-white p-4">
          <Text className="mb-3 font-semibold text-primary_color">
            Thông tin thanh toán
          </Text>
          <View className="gap-2">
            <View className="flex-row justify-between">
              <Text className="text-gray-500">Giá vé</Text>
              <Text className="font-medium">
                {pricing.subTotal.toLocaleString()}đ
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-500">Phí dịch vụ</Text>
              <Text className="font-medium">{pricing.fee.toLocaleString()}đ</Text>
            </View>
            {pricing.promoDiscount > 0 && (
              <View className="flex-row justify-between">
                <Text className="text-green-600">Giảm giá</Text>
                <Text className="font-medium text-green-600">
                  −{pricing.promoDiscount.toLocaleString()}đ
                </Text>
              </View>
            )}
            <View className="flex-row justify-between border-t border-gray-200 pt-2">
              <Text className="font-semibold text-primary_color">Đã thanh toán</Text>
              <Text className="font-bold text-green-600">
                {pricing.total.toLocaleString()}đ
              </Text>
            </View>
          </View>
        </View>

        {/* Notifications */}
        {notifications.length > 0 && (
          <NotificationsCard notifications={notifications} />
        )}

        {/* Next Actions */}
        <NextActionsCard actions={nextActions} onAction={handleAction} />
      </ScrollView>
    </SafeAreaView>
  );
}

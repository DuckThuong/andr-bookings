import { useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { ProgressSteps } from "@/modules/booking/components";
import { useUpdatePassengerMutation } from "@/modules/booking/hooks";
import type { BookingPricing, BookingSuccessSeat } from "@/modules/booking/types";
import { AppButton } from "@/shared/components";

export default function BookingInfoScreen() {
  const params = useLocalSearchParams<{
    holdId?: string;
    tripId?: string;
    seats?: string;
    addons?: string;
    pricing?: string;
    holdSeconds?: string;
    pageData?: string;
  }>();

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

  const [fullName, setFullName] = useState(passenger.fullName || "");
  const [phone, setPhone] = useState(passenger.phone || "");
  const [pickupPoint, setPickupPoint] = useState(
    passenger.pickupPointDefault || passenger.pickupPoint || ""
  );
  const [dropoffPoint, setDropoffPoint] = useState(
    passenger.dropoffPointDefault || passenger.dropoffPoint || ""
  );

  const updateMutation = useUpdatePassengerMutation();

  const handleContinue = async () => {
    if (!params.holdId) return;

    if (!fullName.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập họ và tên");
      return;
    }
    if (!phone.trim() || !/^\d{10}$/.test(phone)) {
      Alert.alert("Lỗi", "Số điện thoại phải gồm 10 chữ số");
      return;
    }
    if (!pickupPoint) {
      Alert.alert("Lỗi", "Vui lòng chọn điểm lên xe");
      return;
    }
    if (!dropoffPoint) {
      Alert.alert("Lỗi", "Vui lòng chọn điểm xuống xe");
      return;
    }

    try {
      const result = await updateMutation.mutateAsync({
        holdId: params.holdId,
        passenger: {
          fullName: fullName.trim(),
          phone: phone.trim(),
          pickupPoint,
          dropoffPoint,
        },
      });

      router.push({
        pathname: "/booking/confirm",
        params: {
          holdId: params.holdId,
          seats: params.seats,
          addons: params.addons,
          pricing: JSON.stringify(result.pricing),
          holdSeconds: String(result.holdSeconds),
          pageData: JSON.stringify({
            ...pageData,
            passenger: {
              ...passenger,
              fullName: fullName.trim(),
              phone: phone.trim(),
              pickupPointDefault: pickupPoint,
              dropoffPointDefault: dropoffPoint,
            },
          }),
        },
      });
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? "Lỗi cập nhật";
      Alert.alert("Lỗi", Array.isArray(msg) ? msg[0] : msg);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background_color">
      <ProgressSteps activeIdx={1} />

      <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
        {/* Trip Summary */}
        <View className="rounded-2xl bg-white p-4">
          <Text className="mb-3 font-semibold text-primary_color">
            Tóm tắt chuyến đi
          </Text>

          <View className="mb-4 flex-row">
            <View className="flex-1">
              <Text className="text-2xl font-bold text-primary_color">
                {trip.departTime || "00:00"}
              </Text>
              <Text className="text-sm text-gray-500">{trip.from}</Text>
            </View>
            <View className="items-center px-4">
              <Ionicons name="arrow-forward" size={20} color="#6b7280" />
            </View>
            <View className="flex-1 items-end">
              <Text className="text-2xl font-bold text-primary_color">
                {trip.arriveTime || "00:00"}
              </Text>
              <Text className="text-sm text-gray-500">{trip.to}</Text>
            </View>
          </View>

          <View className="mb-3 flex-row flex-wrap gap-2">
            {seats.map((seat) => (
              <View
                key={seat.id}
                className="rounded-lg bg-secondary_color px-3 py-1"
              >
                <Text className="text-sm font-medium text-white">{seat.id}</Text>
              </View>
            ))}
          </View>

          <View className="flex-row justify-between border-t border-gray-100 pt-3">
            <Text className="text-gray-500">Tổng cộng</Text>
            <Text className="text-lg font-bold text-secondary_color">
              {pricing.total.toLocaleString()}đ
            </Text>
          </View>
        </View>

        {/* Passenger Form */}
        <View className="rounded-2xl bg-white p-4">
          <Text className="mb-4 font-semibold text-primary_color">
            Thông tin hành khách
          </Text>

          <View className="mb-4">
            <Text className="mb-2 text-sm font-medium text-gray-600">
              Họ và tên
            </Text>
            <TextInput
              className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3"
              placeholder="Nhập họ và tên"
              value={fullName}
              onChangeText={setFullName}
              defaultValue={passenger.fullName || ""}
            />
          </View>

          <View className="mb-4">
            <Text className="mb-2 text-sm font-medium text-gray-600">
              Số điện thoại
            </Text>
            <TextInput
              className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3"
              placeholder="Nhập số điện thoại"
              keyboardType="numeric"
              maxLength={10}
              value={phone}
              onChangeText={setPhone}
              defaultValue={passenger.phone || ""}
            />
          </View>

          <View className="mb-4">
            <Text className="mb-2 text-sm font-medium text-gray-600">
              Điểm lên xe
            </Text>
            <TextInput
              className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3"
              placeholder="Nhập điểm lên xe"
              value={pickupPoint}
              onChangeText={setPickupPoint}
            />
          </View>

          <View className="mb-4">
            <Text className="mb-2 text-sm font-medium text-gray-600">
              Điểm xuống xe
            </Text>
            <TextInput
              className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3"
              placeholder="Nhập điểm xuống xe"
              value={dropoffPoint}
              onChangeText={setDropoffPoint}
            />
          </View>
        </View>

        {/* Actions */}
        <View className="gap-3">
          <AppButton
            label="Tiếp tục"
            onPress={handleContinue}
            loading={updateMutation.isPending}
          />
          <Pressable
            className="rounded-xl border border-gray-200 bg-white py-4"
            onPress={() => router.back()}
          >
            <Text className="text-center font-medium text-gray-600">
              Quay lại
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

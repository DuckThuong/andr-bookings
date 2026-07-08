import { router, useLocalSearchParams } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { AppButton } from "@/shared/components";

export default function PaymentCancelScreen() {
  const searchParams = useLocalSearchParams<{
    orderCode?: string;
  }>();

  const orderCode = searchParams.orderCode;

  return (
    <SafeAreaView className="flex-1 bg-background_color">
      <View className="flex-1 px-5 pt-10">
        {/* Header */}
        <View className="mb-6 flex-row items-center gap-3">
          <Pressable
            className="rounded-full bg-white_color p-2"
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#f97316" />
          </Pressable>
          <Text className="font-bold text-xl text-primary_color">
            Thanh toán
          </Text>
        </View>

        {/* Cancel state */}
        <View className="flex-1 items-center justify-center">
          <View className="h-24 w-24 items-center justify-center rounded-full bg-[#fef3c7]">
            <Ionicons name="warning" size={64} color="#f59e0b" />
          </View>
          <Text className="mt-6 font-bold text-2xl text-[#d97706]">
            Đã hủy thanh toán
          </Text>
          <Text className="mt-3 text-center text-base text-text_color_4">
            {orderCode
              ? `Mã đơn hàng: ${orderCode}`
              : "Thanh toán đã bị hủy bỏ."}
          </Text>

          <View className="mt-6 rounded-[16px] bg-white_color p-4">
            <View className="flex-row items-start gap-3">
              <Ionicons name="information-circle" size={20} color="#3b82f6" />
              <View className="flex-1">
                <Text className="font-medium text-sm text-primary_color">
                  Thông tin
                </Text>
                <Text className="mt-1 text-sm text-text_color_4">
                  Nếu bạn đã thanh toán nhưng vẫn thấy thông báo này, vui
                  lòng đợi 5-10 phút để hệ thống cập nhật. Hoặc liên hệ
                  hotline để được hỗ trợ.
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Actions */}
        <View className="gap-3 pb-8">
          <AppButton
            label="Về trang chủ"
            onPress={() => router.replace("/(tabs)/home")}
          />
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

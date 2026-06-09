import { router, useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";
import { AppButton, AuthScreenShell } from "@/shared/components";

export default function FinishScreen() {
  const params = useLocalSearchParams<{ name?: string; phone?: string }>();
  const name = params.name?.trim() || "bạn";
  const phone = params.phone?.trim() || "";

  return (
    <AuthScreenShell
      description={
        phone
          ? `Xác minh thành công số điện thoại ${phone}. GoRide đã sẵn sàng để sử dụng.`
          : "Tài khoản của bạn đã được tạo thành công. GoRide đã sẵn sàng để sử dụng."
      }
      eyebrow="Đăng ký thành công"
      title={`Chào mừng ${name}!`}
    >
      <View className="gap-4">
        <View className="items-center rounded-[28px] bg-background_color px-4 py-8">
          <View className="h-20 w-20 items-center justify-center rounded-full bg-[#dcfce7]">
            <Text className="text-4xl">✓</Text>
          </View>
          <Text className="mt-4 text-center font-semibold text-lg text-primary_color">
            Tài khoản đã kích hoạt
          </Text>
          <Text className="mt-2 text-center text-sm leading-6 text-text_color_4">
            Phiên đăng nhập an toàn. Bạn có thể bắt đầu tìm và đặt vé ngay.
          </Text>
        </View>

        <View className="flex-row gap-3">
          <View className="flex-1 rounded-[20px] bg-background_color px-3 py-3">
            <Text className="text-xs text-text_color_4">Trạng thái</Text>
            <Text className="mt-1 font-medium text-sm text-[#15803d]">
              Đã kích hoạt
            </Text>
          </View>
          <View className="flex-1 rounded-[20px] bg-background_color px-3 py-3">
            <Text className="text-xs text-text_color_4">Bảo mật</Text>
            <Text className="mt-1 font-medium text-sm text-primary_color">
              SSL 256-bit
            </Text>
          </View>
        </View>

        <AppButton
          label="Bắt đầu ngay"
          onPress={() => router.replace("/(tabs)/home" as never)}
        />
      </View>
    </AuthScreenShell>
  );
}

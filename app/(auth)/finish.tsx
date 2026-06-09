import { router } from "expo-router";
import { Text, View } from "react-native";
import { AppButton, AuthScreenShell } from "@/shared/components";

export default function FinishShellScreen() {
  return (
    <AuthScreenShell
      description="Màn hình hoàn tất sẵn sàng cho luồng đăng ký đầy đủ. Hiện tại chỉ đóng vòng điều hướng tạm."
      eyebrow="Tài khoản sẵn sàng"
      title="Hoàn tất thiết lập"
    >
      <View className="gap-4">
        <View className="rounded-[24px] bg-background_color px-4 py-5">
          <Text className="text-sm leading-6 text-primary_color">
            Ứng dụng đã kết nối đăng nhập, trang chủ và tìm kiếm. Đăng ký, OTP
            và hoàn tất vẫn là màn hình tạm thời.
          </Text>
        </View>
        <AppButton
          label="Về trang đăng nhập"
          onPress={() => router.replace("/(auth)/login" as never)}
        />
      </View>
    </AuthScreenShell>
  );
}

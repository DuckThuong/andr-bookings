import { router } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import { AppButton, AuthScreenShell, FormNumber } from "@/shared/components";

export default function OtpConfirmShellScreen() {
  const [otp, setOtp] = useState("");

  return (
    <AuthScreenShell
      description="Xác thực OTP tạm thời, màn hình này giữ liên thông luồng điều hướng."
      eyebrow="Xác thực OTP"
      title="Nhập mã xác thực"
    >
      <View className="gap-4">
        <FormNumber
          helperText="Nhập mã 6 chữ số bất kỳ để tiếp tục (màn hình tạm)."
          label="Mã xác thực"
          onChangeText={setOtp}
          placeholder="Mã OTP 6 số"
          value={otp}
        />
        <AppButton
          label="Tiếp tục"
          onPress={() => router.push("/(auth)/finish" as never)}
        />
        <AppButton
          label="Quay lại đăng nhập"
          onPress={() => router.replace("/(auth)/login" as never)}
          variant="secondary"
        />
      </View>
    </AuthScreenShell>
  );
}

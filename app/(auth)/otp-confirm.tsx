import { router } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import { AppButton, AuthScreenShell, FormNumber } from "@/shared/components";

export default function OtpConfirmShellScreen() {
  const [otp, setOtp] = useState("");

  return (
    <AuthScreenShell
      description="OTP confirmation remains a shell in this base, but the screen is available for navigation continuity."
      eyebrow="OTP confirmation"
      title="Enter the verification code"
    >
      <View className="gap-4">
        <FormNumber
          helperText="Use any 6-digit code during shell navigation."
          label="Verification code"
          onChangeText={setOtp}
          placeholder="6-digit OTP"
          value={otp}
        />
        <AppButton
          label="Continue"
          onPress={() => router.push("/(auth)/finish" as never)}
        />
        <AppButton
          label="Back to login"
          onPress={() => router.replace("/(auth)/login" as never)}
          variant="secondary"
        />
      </View>
    </AuthScreenShell>
  );
}

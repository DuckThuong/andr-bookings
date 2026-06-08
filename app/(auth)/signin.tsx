import { router } from "expo-router";
import { Text, View } from "react-native";
import { AppButton, AuthScreenShell } from "@/shared/components";
import React from "react";

export default function SignInShellScreen() {
  return (
    <AuthScreenShell
      description="This shell keeps the fe-bookings auth flow connected while the full multi-step registration is still being implemented."
      eyebrow="3-step signup"
      title="Create your rider account"
    >
      <View className="gap-4">
        {[
          "Step 1: account details and password",
          "Step 2: personal details and date of birth",
          "Step 3: final confirmation",
        ].map((item) => (
          <View
            key={item}
            className="rounded-[22px] bg-background_color px-4 py-4"
          >
            <Text className="text-sm leading-6 text-primary_color">{item}</Text>
          </View>
        ))}

        <AppButton
          label="Continue to OTP shell"
          onPress={() => router.push("/(auth)/otp-confirm" as never)}
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

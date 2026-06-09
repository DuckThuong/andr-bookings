import { router } from "expo-router";
import { Text, View } from "react-native";
import { AppButton, AuthScreenShell } from "@/shared/components";
import React from "react";

export default function SignInShellScreen() {
  return (
    <AuthScreenShell
      description="Màn hình đăng ký tạm thời, giữ luồng xác thực kết nối trong khi chờ hoàn thiện đăng ký đầy đủ."
      eyebrow="Đăng ký 3 bước"
      title="Tạo tài khoản hành khách"
    >
      <View className="gap-4">
        {[
          "Bước 1: Thông tin tài khoản và mật khẩu",
          "Bước 2: Thông tin cá nhân và ngày sinh",
          "Bước 3: Xác nhận hoàn tất",
        ].map((item) => (
          <View
            key={item}
            className="rounded-[22px] bg-background_color px-4 py-4"
          >
            <Text className="text-sm leading-6 text-primary_color">{item}</Text>
          </View>
        ))}

        <AppButton
          label="Tiếp tục xác thực OTP"
          onPress={() => router.push("/(auth)/otp-confirm" as never)}
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

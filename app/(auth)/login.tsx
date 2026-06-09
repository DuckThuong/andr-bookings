import { useAuth } from "@/modules/auth";
import {
  AppButton,
  AuthScreenShell,
  FormPassword,
  FormText,
} from "@/shared/components";
import { getApiErrorMessage } from "@/shared/utils/api";
import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Pressable, Text, View } from "react-native";

type LoginFormValues = {
  phoneNumber: string;
  password: string;
};

export default function LoginScreen() {
  const { signIn } = useAuth();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { control, handleSubmit } = useForm<LoginFormValues>({
    defaultValues: {
      phoneNumber: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationKey: ["auth", "login"],
    mutationFn: (values: LoginFormValues) => signIn(values),
    onSuccess: () => {
      setSubmitError(null);
      router.replace("/(tabs)/home" as never);
    },
    onError: (error) => {
      setSubmitError(getApiErrorMessage(error));
    },
  });

  return (
    <AuthScreenShell
      description="Dùng số điện thoại và mật khẩu để tiếp tục. Tìm kiếm, so sánh và đặt vé với một tài khoản duy nhất."
      eyebrow="Xác thực tài khoản"
      footer={
        <View className="rounded-[28px] bg-[#00293a] px-4 py-5">
          <View className="flex-row items-center justify-between">
            {[
              { value: "2M+", label: "Chuyến đi" },
              { value: "500K", label: "Người dùng" },
              { value: "4.9", label: "Đánh giá" },
            ].map((item) => (
              <View key={item.label} className="flex-1 items-center">
                <Text className="font-bold text-lg text-white_color">
                  {item.value}
                </Text>
                <Text className="mt-1 text-xs text-text_color_2">
                  {item.label}
                </Text>
              </View>
            ))}
          </View>
        </View>
      }
      title="Đăng nhập tài khoản đặt vé"
    >
      <View className="gap-4">
        <Controller
          control={control}
          name="phoneNumber"
          rules={{
            required: "Vui lòng nhập số điện thoại.",
            minLength: {
              value: 9,
              message: "Số điện thoại quá ngắn.",
            },
          }}
          render={({ field: { onChange, value }, fieldState }) => (
            <FormText
              error={fieldState.error?.message}
              keyboardType="phone-pad"
              label="Số điện thoại"
              onChangeText={onChange}
              placeholder="Nhập số điện thoại"
              value={value}
            />
          )}
        />

        <Controller
          control={control}
          name="password"
          rules={{
            required: "Vui lòng nhập mật khẩu.",
            minLength: {
              value: 6,
              message: "Mật khẩu phải có ít nhất 6 ký tự.",
            },
          }}
          render={({ field: { onChange, value }, fieldState }) => (
            <FormPassword
              actionText="Trợ giúp"
              error={fieldState.error?.message}
              label="Mật khẩu"
              onActionPress={() => router.push("/(auth)/otp-confirm" as never)}
              onChangeText={onChange}
              placeholder="Nhập mật khẩu"
              value={value}
            />
          )}
        />

        {submitError ? (
          <Text className="text-sm text-text_alert_1">{submitError}</Text>
        ) : null}

        <AppButton
          label="Đăng nhập"
          loading={loginMutation.isPending}
          onPress={handleSubmit((values) => loginMutation.mutate(values))}
        />

        <View className="flex-row items-center gap-3 py-2">
          <View className="h-px flex-1 bg-color_border" />
          <Text className="text-xs uppercase tracking-[1px] text-text_color_4">
            Hoặc tiếp tục với
          </Text>
          <View className="h-px flex-1 bg-color_border" />
        </View>

        <View className="flex-row gap-3">
          {[
            { icon: "logo-google", label: "Google" },
            { icon: "logo-facebook", label: "Facebook" },
            { icon: "logo-apple", label: "Apple" },
          ].map((item) => (
            <Pressable
              key={item.label}
              className="flex-1 flex-row items-center justify-center gap-2 rounded-[20px] border border-color_border bg-background_color px-3 py-3"
            >
              <Ionicons color="#00293a" name={item.icon as never} size={16} />
              <Text className="font-medium text-sm text-primary_color">
                {item.label}
              </Text>
            </Pressable>
          ))}
        </View>

        <View className="mt-2 flex-row items-center justify-center gap-1">
          <Text className="text-sm text-text_color_4">Chưa có tài khoản?</Text>
          <Pressable onPress={() => router.push("/(auth)/signin" as never)}>
            <Text className="font-semibold text-sm text-secondary_color">
              Tạo tài khoản
            </Text>
          </Pressable>
        </View>
      </View>
    </AuthScreenShell>
  );
}

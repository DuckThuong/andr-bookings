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
      description="Use your phone number and password to continue. Search, compare and book trips with one account."
      eyebrow="Account verification"
      footer={
        <View className="rounded-[28px] bg-[#00293a] px-4 py-5">
          <View className="flex-row items-center justify-between">
            {[
              { value: "2M+", label: "Trips" },
              { value: "500K", label: "Users" },
              { value: "4.9", label: "Rating" },
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
      title="Sign in to your booking account"
    >
      <View className="gap-4">
        <Controller
          control={control}
          name="phoneNumber"
          rules={{
            required: "Phone number is required.",
            minLength: {
              value: 9,
              message: "Phone number looks too short.",
            },
          }}
          render={({ field: { onChange, value }, fieldState }) => (
            <FormText
              error={fieldState.error?.message}
              keyboardType="phone-pad"
              label="Phone number"
              onChangeText={onChange}
              placeholder="Enter your phone number"
              value={value}
            />
          )}
        />

        <Controller
          control={control}
          name="password"
          rules={{
            required: "Password is required.",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters.",
            },
          }}
          render={({ field: { onChange, value }, fieldState }) => (
            <FormPassword
              actionText="Help"
              error={fieldState.error?.message}
              label="Password"
              onActionPress={() => router.push("/(auth)/otp-confirm" as never)}
              onChangeText={onChange}
              placeholder="Enter your password"
              value={value}
            />
          )}
        />

        {submitError ? (
          <Text className="text-sm text-text_alert_1">{submitError}</Text>
        ) : null}

        <AppButton
          label="Sign in"
          loading={loginMutation.isPending}
          onPress={handleSubmit((values) => loginMutation.mutate(values))}
        />

        <View className="flex-row items-center gap-3 py-2">
          <View className="h-px flex-1 bg-color_border" />
          <Text className="text-xs uppercase tracking-[1px] text-text_color_4">
            Or continue with
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
          <Text className="text-sm text-text_color_4">New here?</Text>
          <Pressable onPress={() => router.push("/(auth)/signin" as never)}>
            <Text className="font-semibold text-sm text-secondary_color">
              Create account
            </Text>
          </Pressable>
        </View>
      </View>
    </AuthScreenShell>
  );
}

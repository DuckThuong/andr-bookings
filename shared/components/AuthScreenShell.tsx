import { PropsWithChildren, ReactNode } from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type AuthScreenShellProps = PropsWithChildren<{
  eyebrow: string;
  title: string;
  description: string;
  footer?: ReactNode;
}>;

export function AuthScreenShell({
  eyebrow,
  title,
  description,
  children,
  footer,
}: AuthScreenShellProps) {
  return (
    <SafeAreaView className="flex-1 bg-background_color">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 px-5 py-6">
          <View className="mb-6">
            <Text className="font-bold text-2xl text-primary_color">Go Ride</Text>
            <Text className="mt-1 text-sm text-text_color_4">
              Đặt vé thông minh cho mọi hành trình
            </Text>
          </View>

          <View className="rounded-[32px] bg-white_color px-5 py-6">
            <View className="mb-6 gap-3">
              <View className="h-12 w-12 items-center justify-center rounded-2xl bg-[#fdf1d8]">
                <Text className="text-xl">🚌</Text>
              </View>
              <Text className="font-medium text-sm uppercase tracking-[1px] text-secondary_color">
                {eyebrow}
              </Text>
              <Text className="font-bold text-[28px] leading-9 text-primary_color">
                {title}
              </Text>
              <Text className="text-sm leading-6 text-text_color_4">
                {description}
              </Text>
            </View>

            {children}
          </View>

          {footer ? <View className="mt-5">{footer}</View> : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

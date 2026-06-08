import { router } from "expo-router";
import { Text, View } from "react-native";
import { AppButton, AuthScreenShell } from "@/shared/components";

export default function FinishShellScreen() {
  return (
    <AuthScreenShell
      description="This finish screen is ready for the full auth flow to plug in later. For now it closes the shell loop."
      eyebrow="Account ready"
      title="Setup shell completed"
    >
      <View className="gap-4">
        <View className="rounded-[24px] bg-background_color px-4 py-5">
          <Text className="text-sm leading-6 text-primary_color">
            The app base now has login, home, and search connected. Signup, OTP,
            and finish remain intentionally lightweight shells.
          </Text>
        </View>
        <AppButton
          label="Go to login"
          onPress={() => router.replace("/(auth)/login" as never)}
        />
      </View>
    </AuthScreenShell>
  );
}

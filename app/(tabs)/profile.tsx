import { router } from "expo-router";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/modules/auth";
import { AppButton } from "@/shared/components";

export default function ProfileTab() {
  const { signOut } = useAuth();

  return (
    <SafeAreaView className="flex-1 bg-background_color">
      <View className="flex-1 px-5 py-6">
        <View className="rounded-[32px] bg-primary_color px-5 py-6">
          <Text className="text-sm uppercase tracking-[1px] text-[#8dc7e3]">
            Account
          </Text>
          <Text className="mt-2 font-bold text-[28px] leading-9 text-white_color">
            Manage your session
          </Text>
          <Text className="mt-3 text-sm leading-6 text-text_color_2">
            You are signed in and can continue searching and booking trips.
            Sign out here when you want to end the current session.
          </Text>
        </View>

        <View className="mt-5 rounded-[28px] bg-white_color px-5 py-5">
          <Text className="font-semibold text-lg text-primary_color">
            Session controls
          </Text>
          <Text className="mt-2 text-sm leading-6 text-text_color_4">
            Signing out clears the saved access token on this device and returns
            you to the login flow.
          </Text>

          <View className="mt-5">
            <AppButton
              label="Sign out"
              onPress={() =>
                void signOut().then(() => router.replace("/(auth)/login" as never))
              }
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

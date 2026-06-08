import { useAuth } from "@/modules/auth";
import { router } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  const { isAuthenticated, isHydrated } = useAuth();

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    router.replace((isAuthenticated ? "/(tabs)/home" : "/(auth)/login") as never);
  }, [isAuthenticated, isHydrated]);

  return (
    <View className="flex-1 items-center justify-center bg-background_color">
      <ActivityIndicator color="#f5a623" size="large" />
    </View>
  );
}

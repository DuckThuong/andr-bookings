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
            Tài khoản
          </Text>
          <Text className="mt-2 font-bold text-[28px] leading-9 text-white_color">
            Quản lý phiên đăng nhập
          </Text>
          <Text className="mt-3 text-sm leading-6 text-text_color_2">
            Bạn đã đăng nhập và có thể tiếp tục tìm kiếm, đặt vé. Đăng xuất tại
            đây khi muốn kết thúc phiên hiện tại.
          </Text>
        </View>

        <View className="mt-5 rounded-[28px] bg-white_color px-5 py-5">
          <Text className="font-semibold text-lg text-primary_color">
            Điều khiển phiên
          </Text>
          <Text className="mt-2 text-sm leading-6 text-text_color_4">
            Đăng xuất sẽ xóa token đã lưu trên thiết bị và đưa bạn về màn hình
            đăng nhập.
          </Text>

          <View className="mt-5">
            <AppButton
              label="Đăng xuất"
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

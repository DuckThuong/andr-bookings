import { ReactNode, useState } from "react";
import { Switch, Text, View, Pressable } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { AppButton } from "@/shared/components";

type ProfileSettingsProps = {
  onSignOut: () => void;
};

export function ProfileSettings({ onSignOut }: ProfileSettingsProps) {
  const [settings, setSettings] = useState({
    email: true,
    sms: false,
    push: true,
    promotions: false,
    bookingUpdates: true,
    paymentReminders: true,
    travelAlerts: true,
  });

  const toggle = (key: keyof typeof settings) => {
    setSettings((current) => ({ ...current, [key]: !current[key] }));
  };

  return (
    <View className="gap-4">
      <View className="rounded-[28px] bg-white_color px-4 py-5">
        <Text className="font-semibold text-lg text-primary_color">Cài đặt</Text>
        <Text className="mt-1 text-sm text-text_color_4">
          Quản lý thông báo và tùy chọn liên hệ.
        </Text>
      </View>

      <SettingsGroup title="Kênh thông báo">
        <SettingRow
          description="Thông báo gửi đến hộp thư của bạn"
          enabled={settings.email}
          label="Email"
          onToggle={() => toggle("email")}
        />
        <SettingRow
          description="Tin nhắn thông báo đến số điện thoại"
          enabled={settings.sms}
          label="SMS"
          onToggle={() => toggle("sms")}
        />
        <SettingRow
          description="Thông báo trong ứng dụng GoRide"
          enabled={settings.push}
          label="Thông báo đẩy"
          onToggle={() => toggle("push")}
        />
        <SettingRow
          description="Ưu đãi, voucher và tin tức mới nhất"
          enabled={settings.promotions}
          label="Khuyến mãi"
          onToggle={() => toggle("promotions")}
        />
      </SettingsGroup>

      <SettingsGroup title="Cảnh báo chuyến đi">
        <SettingRow
          description="Xác nhận, huỷ hoặc thay đổi chuyến"
          enabled={settings.bookingUpdates}
          label="Cập nhật đặt vé"
          onToggle={() => toggle("bookingUpdates")}
        />
        <SettingRow
          description="Nhắc thanh toán trước giờ khởi hành"
          enabled={settings.paymentReminders}
          label="Nhắc thanh toán"
          onToggle={() => toggle("paymentReminders")}
        />
        <SettingRow
          description="Cảnh báo tiến độ và thay đổi lịch trình"
          enabled={settings.travelAlerts}
          label="Cảnh báo hành trình"
          onToggle={() => toggle("travelAlerts")}
        />
      </SettingsGroup>

      <View className="rounded-[28px] bg-white_color px-4 py-5">
        {/* Quick links */}
        <View className="mb-4 flex-row items-center justify-between">
          <Text className="font-semibold text-base text-primary_color">
            Liên kết nhanh
          </Text>
        </View>
        
        <Pressable
          className="mb-3 flex-row items-center justify-between rounded-[16px] bg-background_color px-4 py-4"
          onPress={() => router.push("/profile/payment-history")}
        >
          <View className="flex-row items-center gap-3">
            <View className="h-10 w-10 items-center justify-center rounded-full bg-[#dbeafe]">
              <Ionicons name="receipt-outline" size={20} color="#3b82f6" />
            </View>
            <Text className="font-medium text-base text-primary_color">
              Hóa đơn thanh toán
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
        </Pressable>

        <Pressable
          className="mb-4 flex-row items-center justify-between rounded-[16px] bg-background_color px-4 py-4"
          onPress={() => router.push("/profile/refund-history")}
        >
          <View className="flex-row items-center gap-3">
            <View className="h-10 w-10 items-center justify-center rounded-full bg-[#fef3c7]">
              <Ionicons name="refresh-circle-outline" size={20} color="#d97706" />
            </View>
            <Text className="font-medium text-base text-primary_color">
              Hóa đơn hoàn tiền
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
        </Pressable>

        <AppButton label="Lưu cài đặt" onPress={() => undefined} />
        <View className="mt-3">
          <Pressable
            className="mb-3 flex-row items-center justify-center rounded-full border border-primary_color py-3"
            onPress={() => router.push("/company-registration")}
          >
            <Ionicons name="business" size={18} color="#f97316" />
            <Text className="ml-2 font-semibold text-primary_color">Đăng ký nhà xe</Text>
          </Pressable>
        </View>
        <View className="mt-1">
          <AppButton label="Đăng xuất" onPress={onSignOut} variant="secondary" />
        </View>
      </View>
    </View>
  );
}

function SettingsGroup({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <View className="rounded-[28px] bg-white_color px-4 py-4">
      <Text className="mb-3 font-semibold text-base text-primary_color">
        {title}
      </Text>
      <View className="gap-3">{children}</View>
    </View>
  );
}

function SettingRow({
  label,
  description,
  enabled,
  onToggle,
}: {
  label: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <View className="flex-row items-center justify-between gap-4 rounded-[16px] bg-background_color px-3 py-3">
      <View className="flex-1">
        <Text className="font-medium text-sm text-primary_color">{label}</Text>
        <Text className="mt-1 text-xs text-text_color_4">{description}</Text>
      </View>
      <Switch
        onValueChange={onToggle}
        thumbColor="#ffffff"
        trackColor={{ false: "#d9d9d9", true: "#00609c" }}
        value={enabled}
      />
    </View>
  );
}

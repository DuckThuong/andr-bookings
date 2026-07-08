import { router } from "expo-router";
import { useState, useEffect } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import * as Clipboard from "expo-clipboard";

import { axiosClient } from "@/shared/services/axiosClient";

type Promo = {
  id: string;
  title: string;
  subtitle: string;
  discount: string;
  code: string;
  expiry: string;
  imageUrl?: string;
};

const MOCK_PROMOS: Promo[] = [
  {
    id: "1",
    title: "Flash Sale - Giảm 35%",
    subtitle: "Áp dụng cho mọi tuyến đường dài. Số lượng có hạn!",
    discount: "35%",
    code: "FLASH35",
    expiry: "31/07/2026",
  },
  {
    id: "2",
    title: "Ưu đãi thành viên Gold",
    subtitle: "Giảm thêm 15% cho thành viên Gold vào ngày thường.",
    discount: "15%",
    code: "GOLD15",
    expiry: "31/08/2026",
  },
  {
    id: "3",
    title: "Giảm 50K cho đơn từ 200K",
    subtitle: "Mã giảm 50K cho đơn hàng từ 200K trở lên.",
    discount: "50K",
    code: "SAVE50K",
    expiry: "15/08/2026",
  },
  {
    id: "4",
    title: "Miễn phí phí tiện ích",
    subtitle: "Miễn phí phí tiện ích cho chuyến đầu tiên.",
    discount: "MIỄN PHÍ",
    code: "FIRSTFREE",
    expiry: "31/12/2026",
  },
  {
    id: "5",
    title: "Giảm 20% - Tuyến phổ biến",
    subtitle: "Áp dụng cho tuyến Hà Nội - TP.HCM, Đà Nẵng - Hội An.",
    discount: "20%",
    code: "POPULAR20",
    expiry: "31/07/2026",
  },
];

const TYPE_PROMO = "PROMOTION";

export default function PromosScreen() {
  const [promos, setPromos] = useState<Promo[]>(MOCK_PROMOS);

  // Fetch promos from API (commented out for now - use mock data)
  // const { data, isLoading } = useQuery({
  //   queryKey: ["promos", TYPE_PROMO],
  //   queryFn: async () => {
  //     const response = await axiosClient.get(`/master-data/find-by-type`, {
  //       params: { type: TYPE_PROMO, code: "" },
  //     });
  //     return response.data;
  //   },
  // });

  // useEffect(() => {
  //   if (data) {
  //     // Map API data to Promo type
  //     setPromos(data);
  //   }
  // }, [data]);

  const handleCopyCode = async (code: string) => {
    await Clipboard.setStringAsync(code);
    Alert.alert("Đã sao chép!", `Mã ${code} đã được sao chép vào bộ nhớ tạm.`);
  };

  return (
    <SafeAreaView className="flex-1 bg-background_color">
      {/* Header */}
      <View className="px-5 pt-3">
        <View className="flex-row items-center gap-3">
          <Pressable
            className="rounded-full bg-white_color p-2"
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#f97316" />
          </Pressable>
          <Text className="font-bold text-xl text-primary_color">
            Khuyến mãi
          </Text>
        </View>
      </View>

      {/* Hero */}
      <View className="mx-5 mt-4 rounded-[24px] bg-gradient-to-r from-[#f97316] to-[#ea580c] px-5 py-6">
        <Text className="text-sm uppercase tracking-wider text-white/80">
          Ưu đãi mới nhất
        </Text>
        <Text className="mt-2 font-bold text-2xl text-white_color">
          Khuyến mãi dành cho bạn
        </Text>
        <Text className="mt-2 text-sm text-white/90">
          Cập nhật mã giảm giá mỗi ngày. Săn ưu đãi để đặt vé tiết kiệm hơn.
        </Text>
      </View>

      {/* Promo list */}
      <ScrollView
        className="mt-4 flex-1"
        contentContainerStyle="px-5 pb-10"
        showsVerticalScrollIndicator={false}
      >
        {promos.map((promo) => (
          <View
            key={promo.id}
            className="mb-4 rounded-[24px] bg-white_color px-5 py-5"
          >
            <View className="flex-row items-start justify-between">
              <View className="flex-1">
                <View className="flex-row items-center gap-2">
                  <View className="rounded-full bg-[#fee2e2] px-3 py-1">
                    <Text className="font-bold text-xl text-[#991b1b]">
                      {promo.discount}
                    </Text>
                  </View>
                  {promo.expiry && (
                    <View className="flex-row items-center gap-1">
                      <Ionicons
                        name="time-outline"
                        size={12}
                        color="#9ca3af"
                      />
                      <Text className="text-xs text-text_color_4">
                        HSD: {promo.expiry}
                      </Text>
                    </View>
                  )}
                </View>

                <Text className="mt-3 font-bold text-lg text-primary_color">
                  {promo.title}
                </Text>
                <Text className="mt-1 text-sm text-text_color_4">
                  {promo.subtitle}
                </Text>
              </View>
            </View>

            {/* Promo code */}
            <View className="mt-4 flex-row items-center justify-between rounded-[16px] bg-background_color px-4 py-3">
              <View className="flex-row items-center gap-2">
                <Ionicons
                  name="pricetag-outline"
                  size={18}
                  color="#f97316"
                />
                <Text className="font-mono font-bold text-lg text-primary_color">
                  {promo.code}
                </Text>
              </View>
              <Pressable
                className="rounded-full bg-secondary_color px-4 py-2"
                onPress={() => handleCopyCode(promo.code)}
              >
                <Text className="text-sm font-medium text-white_color">
                  Sao chép
                </Text>
              </Pressable>
            </View>

            {/* Action button */}
            <Pressable
              className="mt-4 flex-row items-center justify-center gap-2 rounded-full border border-secondary_color py-3"
              onPress={() => router.push("/(tabs)/search")}
            >
              <Ionicons name="search" size={18} color="#f97316" />
              <Text className="font-semibold text-secondary_color">
                Áp dụng ngay
              </Text>
            </Pressable>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

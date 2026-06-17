import { router, useFocusEffect } from "expo-router";
import { useCallback } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Pressable,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useHomeSections } from "@/modules/home";
import { AppButton, StateBlock } from "@/shared/components";
import { getApiErrorMessage } from "@/shared/utils/api";

export default function HomeTab() {
  const {
    services,
    promos,
    operators,
    trips,
    isLoading,
    isError,
    error,
    refetchAll,
  } = useHomeSections();

  useFocusEffect(
    useCallback(() => {
      let ignore = false;

      const doFetch = async () => {
        if (!ignore) {
          await refetchAll();
        }
      };

      void doFetch();

      return () => {
        ignore = true;
      };
    }, []),
  );

  return (
    <SafeAreaView className="flex-1 bg-background_color">
      <ScrollView contentContainerStyle={{ padding: 20, gap: 20 }}>
        <View className="rounded-[32px] bg-primary_color px-5 py-6">
          <View className="flex-1 pr-4">
            <Text className="text-sm uppercase tracking-[1px] text-[#8dc7e3]">
              Go Ride
            </Text>
            <Text className="mt-2 font-bold text-[28px] leading-9 text-white_color">
              Đặt vé thông minh cho mọi chuyến đi
            </Text>
            <Text className="mt-3 text-sm leading-6 text-text_color_2">
              Khám phá dịch vụ, ưu đãi, nhà xe và các tuyến phổ biến từ dữ liệu
              thực tế.
            </Text>
          </View>

          <View className="mt-6 flex-row gap-3">
            <View className="flex-1 rounded-[24px] bg-white/10 px-4 py-4">
              <Text className="text-xs uppercase tracking-[1px] text-[#b9d9e8]">
                Mục nội dung
              </Text>
              <Text className="mt-2 font-semibold text-xl text-white_color">
                4
              </Text>
            </View>
            <View className="flex-1 rounded-[24px] bg-[#f5a623] px-4 py-4">
              <Text className="text-xs uppercase tracking-[1px] text-primary_color">
                Tìm kiếm
              </Text>
              <Text className="mt-2 font-semibold text-xl text-primary_color">
                Sẵn sàng
              </Text>
            </View>
          </View>

          <View className="mt-5">
            <AppButton
              label="Tìm chuyến"
              onPress={() => router.push("/(tabs)/search" as never)}
            />
          </View>
        </View>

        {isLoading ? (
          <View className="items-center rounded-[28px] bg-white_color px-5 py-10">
            <ActivityIndicator color="#f5a623" size="large" />
            <Text className="mt-3 text-sm text-text_color_4">
              Đang tải dữ liệu trang chủ...
            </Text>
          </View>
        ) : null}

        {isError ? (
          <StateBlock
            actionLabel="Thử lại"
            description={getApiErrorMessage(error)}
            onActionPress={() => {
              void refetchAll();
            }}
            title="Không thể tải dữ liệu trang chủ"
          />
        ) : null}

        {!isLoading && !isError ? (
          <>
            <SectionTitle
              actionLabel="Tìm chuyến"
              onPress={() => router.push("/(tabs)/search" as never)}
              title="Dịch vụ"
            />
            {services.length ? (
              <View className="flex-row flex-wrap gap-3">
                {services.map((service) => (
                  <View
                    key={service.id}
                    className="w-[48%] rounded-[24px] bg-white_color px-4 py-4"
                  >
                    <Text className="text-2xl">{service.icon || "✨"}</Text>
                    <Text className="mt-3 font-semibold text-base text-primary_color">
                      {service.label}
                    </Text>
                    <Text className="mt-2 text-sm leading-5 text-text_color_4">
                      {service.desc}
                    </Text>
                  </View>
                ))}
              </View>
            ) : (
              <StateBlock
                description="Chưa có dữ liệu dịch vụ từ hệ thống."
                title="Chưa có dịch vụ"
              />
            )}

            <SectionTitle title="Ưu đãi" />
            {promos.length ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View className="flex-row gap-3">
                  {promos.map((promo) => (
                    <View
                      key={promo.id}
                      className="w-72 rounded-[28px] px-5 py-5"
                      style={{ backgroundColor: promo.bg || "#dff2ff" }}
                    >
                      <Text
                        className="font-semibold text-lg"
                        style={{ color: promo.textColor || "#00293a" }}
                      >
                        {promo.title}
                      </Text>
                      <Text
                        className="mt-2 text-sm leading-5"
                        style={{ color: promo.textColor || "#335364" }}
                      >
                        {promo.subtitle}
                      </Text>
                      <View className="mt-4 self-start rounded-full bg-white/70 px-3 py-2">
                        <Text className="font-semibold text-sm text-primary_color">
                          {promo.code} · {promo.discount}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              </ScrollView>
            ) : null}

            <SectionTitle title="Nhà xe" />
            <View className="gap-3">
              {operators.map((operator) => (
                <View
                  key={operator.id}
                  className="flex-row items-center rounded-[24px] bg-white_color px-4 py-4"
                >
                  <View className="mr-4 h-12 w-12 items-center justify-center rounded-2xl bg-background_color">
                    <Text className="font-bold text-base text-primary_color">
                      {operator.logo || operator.name.slice(0, 2).toUpperCase()}
                    </Text>
                  </View>
                  <View className="flex-1">
                    <Text className="font-semibold text-base text-primary_color">
                      {operator.name}
                    </Text>
                    <Text className="mt-1 text-sm text-text_color_4">
                      {operator.routes}
                    </Text>
                  </View>
                  <Text className="font-medium text-sm text-secondary_color">
                    {operator.rating.toFixed(1)}
                  </Text>
                </View>
              ))}
            </View>

            <SectionTitle title="Chuyến phổ biến" />
            <View className="gap-3">
              {trips.map((trip) => (
                <View
                  key={trip.id}
                  className="rounded-[24px] bg-white_color px-4 py-4"
                >
                  <Text className="font-semibold text-base text-primary_color">
                    {trip.from} → {trip.to}
                  </Text>
                  <Text className="mt-1 text-sm text-text_color_4">
                    {trip.operator} · {trip.departure} · {trip.duration}
                  </Text>
                  <View className="mt-4 flex-row items-center justify-between">
                    <Text className="font-semibold text-base text-secondary_color">
                      {trip.price.toLocaleString()} VND
                    </Text>
                    <Pressable
                      onPress={() => router.push("/(tabs)/search" as never)}
                    >
                      <Text className="font-medium text-sm text-secondary_color">
                        Tìm tương tự
                      </Text>
                    </Pressable>
                  </View>
                </View>
              ))}
            </View>
          </>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

function SectionTitle({
  title,
  actionLabel,
  onPress,
}: {
  title: string;
  actionLabel?: string;
  onPress?: () => void;
}) {
  return (
    <View className="flex-row items-center justify-between">
      <Text className="font-bold text-xl text-primary_color">{title}</Text>
      {actionLabel && onPress ? (
        <Pressable onPress={onPress}>
          <Text className="font-medium text-sm text-secondary_color">
            {actionLabel}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

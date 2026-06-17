import { useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTripSearchQuery } from "@/modules/search";
import type { SearchTrip } from "@/modules/search/types";
import { AppButton, StateBlock } from "@/shared/components";
import { getApiErrorMessage } from "@/shared/utils/api";

export default function SearchScreen() {
  const [fromCity, setFromCity] = useState("");
  const [toCity, setToCity] = useState("");
  const [date, setDate] = useState("");

  const searchQuery = useTripSearchQuery({
    fromCity,
    toCity,
    date,
  });

  useFocusEffect(
    useCallback(() => {
      let ignore = false;

      const doFetch = async () => {
        if (!ignore) {
          await searchQuery.refetch();
        }
      };

      void doFetch();

      return () => {
        ignore = true;
      };
    }, []),
  );

  const trips: SearchTrip[] = searchQuery.data?.trips ?? [];

  return (
    <SafeAreaView className="flex-1 bg-background_color" edges={["top"]}>
      <ScrollView contentContainerStyle={{ padding: 20, gap: 20 }}>
        <View className="rounded-[32px] bg-white_color px-5 py-6">
          <View className="flex-1 pr-4">
            <Text className="text-sm uppercase tracking-[1px] text-[#8dc7e3]">
              Tìm chuyến
            </Text>
            <Text className="mt-2 font-bold text-[28px] leading-9 text-primary_color">
              Tìm kiếm chuyến đi
            </Text>
            <Text className="mt-3 text-sm leading-6 text-text_color_4">
              Nhập điểm đi, điểm đến và ngày khởi hành để tìm chuyến phù hợp nhất.
            </Text>
          </View>

          <View className="mt-6 gap-3">
            <View className="flex-row items-center bg-background_color rounded-2xl px-3 py-2.5">
              <Ionicons name="location" size={18} color="#6b7280" />
              <TextInput
                className="flex-1 text-sm text-primary_color ml-2"
                placeholder="Điểm đi"
                placeholderTextColor="#9ca3af"
                value={fromCity}
                onChangeText={setFromCity}
              />
            </View>
            <View className="flex-row items-center bg-background_color rounded-2xl px-3 py-2.5">
              <Ionicons name="location" size={18} color="#6b7280" />
              <TextInput
                className="flex-1 text-sm text-primary_color ml-2"
                placeholder="Điểm đến"
                placeholderTextColor="#9ca3af"
                value={toCity}
                onChangeText={setToCity}
              />
            </View>
            <View className="flex-row items-center bg-background_color rounded-2xl px-3 py-2.5">
              <Ionicons name="calendar" size={18} color="#6b7280" />
              <TextInput
                className="flex-1 text-sm text-primary_color ml-2"
                placeholder="Ngày khởi hành"
                placeholderTextColor="#9ca3af"
                value={date}
                onChangeText={setDate}
              />
            </View>
          </View>

          <View className="mt-6">
            <AppButton
              label="Tìm chuyến"
              onPress={() => {
                if (fromCity.trim() && toCity.trim() && date.trim()) {
                  void searchQuery.refetch();
                }
              }}
            />
          </View>
        </View>

        {searchQuery.isFetching && !searchQuery.isLoading ? (
          <View className="items-center py-4">
            <ActivityIndicator color="#00609c" />
          </View>
        ) : null}

        {searchQuery.isError ? (
          <StateBlock
            actionLabel="Thử lại"
            description={getApiErrorMessage(searchQuery.error)}
            onActionPress={() => void searchQuery.refetch()}
            title="Không thể tìm chuyến"
          />
        ) : null}

        {!searchQuery.isLoading && !searchQuery.isError ? (
          <View className="gap-3">
            {trips.length ? (
              trips.map((trip) => (
                <View
                  key={trip.id}
                  className="rounded-[24px] bg-white_color px-4 py-4"
                >
                  <Text className="font-semibold text-base text-primary_color">
                    {trip.departure.city} → {trip.arrival.city}
                  </Text>
                  <Text className="mt-1 text-sm text-text_color_4">
                    {trip.operator.name} · {trip.departure.time} · {trip.duration}
                  </Text>
                  <View className="mt-4 flex-row items-center justify-between">
                    <Text className="font-semibold text-base text-secondary_color">
                      {trip.price.toLocaleString()} VND
                    </Text>
                    <Pressable onPress={() => router.push("/(tabs)/search" as never)}>
                      <Text className="font-medium text-sm text-secondary_color">
                        Tìm tương tự
                      </Text>
                    </Pressable>
                  </View>
                </View>
              ))
            ) : (
              <View className="items-center justify-center py-16 px-6">
                <View className="h-20 w-20 rounded-full bg-[#fff8ec] items-center justify-center mb-3">
                  <Ionicons name="search" size={36} color="#f5a623" />
                </View>
                <Text className="text-base font-bold text-primary_color">
                  Chưa có chuyến phù hợp
                </Text>
                <Text className="text-sm text-text_color_4 text-center mt-1.5">
                  Thử điều chỉnh điểm đi, điểm đến hoặc ngày khởi hành.
                </Text>
              </View>
            )}
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

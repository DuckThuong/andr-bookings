import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { BookingPricing, BookingSuccessSeat } from "../types";

interface TicketCardProps {
  trip: {
    from: string;
    to: string;
    departTime: string;
    arriveTime: string;
    arriveNote?: string;
    date: string;
    durationLabel: string;
    operatorName: string;
  };
  seats: BookingSuccessSeat[];
  pricing: BookingPricing;
}

export function TicketCard({ trip, seats, pricing }: TicketCardProps) {
  return (
    <View className="mb-4 rounded-2xl bg-white p-4">
      <View className="mb-4 flex-row items-center justify-between">
        <Text className="font-bold text-lg text-primary_color">Vé của bạn</Text>
        <View className="rounded-full bg-green-100 px-3 py-1">
          <Text className="text-xs font-medium text-green-700">
            {seats.length} ghế
          </Text>
        </View>
      </View>

      <View className="mb-4 flex-row">
        <View className="flex-1">
          <Text className="text-2xl font-bold text-primary_color">
            {trip.departTime}
          </Text>
          <Text className="text-sm text-gray-500">{trip.from}</Text>
        </View>
        <View className="items-center px-4">
          <Text className="text-xs text-gray-400">{trip.durationLabel}</Text>
          <View className="my-1 flex-row items-center">
            <View className="h-2 w-2 rounded-full bg-primary_color" />
            <View className="h-0.5 w-8 bg-gray-300" />
            <Ionicons name="bus" size={16} color="#00609c" />
            <View className="h-0.5 w-8 bg-gray-300" />
            <View className="h-2 w-2 rounded-full bg-secondary_color" />
          </View>
          <Text className="text-xs text-gray-400">{trip.date}</Text>
        </View>
        <View className="flex-1 items-end">
          <Text className="text-2xl font-bold text-primary_color">
            {trip.arriveTime}
            {trip.arriveNote && (
              <Text className="text-sm font-normal"> {trip.arriveNote}</Text>
            )}
          </Text>
          <Text className="text-sm text-gray-500">{trip.to}</Text>
        </View>
      </View>

      <View className="mb-4 flex-row items-center border-t border-gray-100 pt-4">
        <Ionicons name="business" size={16} color="#6b7280" />
        <Text className="ml-2 text-sm text-gray-600">{trip.operatorName}</Text>
        <View className="ml-auto flex-row">
          {seats.slice(0, 3).map((seat) => (
            <View
              key={seat.id}
              className="ml-1 rounded-lg bg-gray-100 px-2 py-1"
            >
              <Text className="text-xs font-medium">{seat.id}</Text>
            </View>
          ))}
          {seats.length > 3 && (
            <Text className="ml-2 text-xs text-gray-400">
              +{seats.length - 3} ghế
            </Text>
          )}
        </View>
      </View>

      <View className="flex-row justify-between border-t border-gray-100 pt-3">
        <Text className="text-gray-500">Tổng cộng</Text>
        <Text className="text-lg font-bold text-secondary_color">
          {pricing.total.toLocaleString()}đ
        </Text>
      </View>
    </View>
  );
}

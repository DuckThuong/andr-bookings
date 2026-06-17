import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { SeatSelectionOperator } from "../types";

const AMENITY_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  wifi: "wifi",
  ac: "snow",
  "air-conditioner": "snow",
  water: "water",
  blanket: "bed",
  pillow: "bed-outline",
  tv: "tv",
  usb: "link",
  charger: "battery-charging",
  toilet: "man",
  "curtain": "flag",
  "sleeping": "moon",
  "double-bed": "bed",
  "limousine": "car",
  "vip": "star",
};

function getAmenityIcon(iconName: string): keyof typeof Ionicons.glyphMap {
  if (!iconName) return "checkmark-circle";
  const normalized = iconName.toLowerCase().replace(/[\s_-]/g, "");

  if (AMENITY_ICONS[normalized]) return AMENITY_ICONS[normalized];

  if (normalized.includes("wifi")) return "wifi";
  if (normalized.includes("ac") || normalized.includes("condition")) return "snow";
  if (normalized.includes("water")) return "water";
  if (normalized.includes("blanket")) return "bed";
  if (normalized.includes("pillow")) return "bed-outline";
  if (normalized.includes("tv")) return "tv";
  if (normalized.includes("usb")) return "link";
  if (normalized.includes("toilet") || normalized.includes("wc")) return "man";
  if (normalized.includes("curtain")) return "flag";
  if (normalized.includes("sleep")) return "moon";
  if (normalized.includes("vip")) return "star";

  return "checkmark-circle";
}

interface OperatorCardProps {
  operator: SeatSelectionOperator;
}

export function OperatorCard({ operator }: OperatorCardProps) {
  return (
    <View className="mb-3 rounded-xl bg-white p-4">
      <View className="flex-row items-center">
        <View className="mr-3 h-12 w-12 items-center justify-center rounded-xl bg-primary_color">
          <Text className="text-lg font-bold text-white">
            {operator.name.slice(0, 2).toUpperCase()}
          </Text>
        </View>
        <View className="flex-1">
          <Text className="font-semibold text-primary_color">{operator.name}</Text>
          <Text className="text-sm text-gray-500">{operator.routeLabel}</Text>
          <View className="mt-1 flex-row items-center">
            <Ionicons name="star" size={14} color="#f5a623" />
            <Text className="ml-1 text-sm font-medium text-gray-700">
              {operator.rating.toFixed(1)}
            </Text>
            <Text className="ml-1 text-sm text-gray-400">
              ({operator.reviewCount} đánh giá)
            </Text>
          </View>
        </View>
      </View>

      {operator.amenities.length > 0 && (
        <View className="mt-3 flex-row flex-wrap gap-2">
          {operator.amenities.map((amenity, idx) => (
            <View
              key={`${amenity.label}-${idx}`}
              className="flex-row items-center rounded-full bg-gray-100 px-3 py-1"
            >
              <Ionicons
                name={getAmenityIcon(amenity.icon)}
                size={14}
                color="#6b7280"
              />
              <Text className="ml-1 text-xs text-gray-600">{amenity.label}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

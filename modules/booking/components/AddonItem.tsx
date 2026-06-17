import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { AddonService } from "../types";

const ICON_MAP: Record<string, keyof typeof Ionicons.glyphMap> = {
  // Wifi variants
  wifi: "wifi",
  "wifi-5g": "wifi",
  "wifi5g": "wifi",
  "wifi-24g": "wifi",
  "wifi24g": "wifi",
  // Air condition variants
  ac: "snow",
  "air-conditioner": "snow",
  "air-conditionning": "snow",
  "air_conditioner": "snow",
  // Water variants
  water: "water",
  "drinking-water": "water",
  "drinkingwater": "water",
  "nuoc-uong": "water",
  // Blanket
  blanket: "bed",
  // Pillow
  pillow: "bed-outline",
  // Snacks/meals
  snack: "pizza",
  "snacks": "pizza",
  "meal": "restaurant",
  "light-meal": "restaurant",
  "bua-an": "restaurant",
  "bua-an-nhe": "restaurant",
  // TV
  tv: "tv",
  // USB
  // USB - use link icon
  usb: "link",
  // Charger
  charger: "battery-charging",
  // Insurance
  insurance: "shield-checkmark",
  "bao-hiem": "shield-checkmark",
  // Pickup/Drop
  "pickup-drop": "car",
  "pickup": "car",
  "drop": "car",
  "taxi": "car",
};

function getAddonIcon(iconName: string): keyof typeof Ionicons.glyphMap {
  if (!iconName) return "pricetag";

  const normalized = iconName.toLowerCase().replace(/[\s_-]/g, "");

  // Try exact match first
  if (ICON_MAP[normalized]) return ICON_MAP[normalized];

  // Try partial match (icon name contains key)
  for (const [key, value] of Object.entries(ICON_MAP)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return value;
    }
  }

  // Check for keywords
  if (normalized.includes("wifi")) return "wifi";
  if (normalized.includes("ac") || normalized.includes("condition")) return "snow";
  if (normalized.includes("water") || normalized.includes("nuoc")) return "water";
  if (normalized.includes("blanket")) return "bed";
  if (normalized.includes("pillow")) return "bed-outline";
  if (normalized.includes("snack") || normalized.includes("meal") || normalized.includes("bua")) return "pizza";
  if (normalized.includes("tv")) return "tv";
  if (normalized.includes("usb")) return "link";
  if (normalized.includes("charger")) return "battery-charging";
  if (normalized.includes("insurance") || normalized.includes("bao")) return "shield-checkmark";
  if (normalized.includes("pickup") || normalized.includes("drop") || normalized.includes("taxi") || normalized.includes("car")) return "car";

  return "pricetag";
}

interface AddonItemProps {
  addon: AddonService;
  selected: boolean;
  qty?: number;
  onToggle: (id: string) => void;
  onChangeQty?: (d: number) => void;
}

export function AddonItem({
  addon,
  selected,
  qty,
  onToggle,
  onChangeQty,
}: AddonItemProps) {
  const iconName = getAddonIcon(addon.icon);

  return (
    <Pressable
      className={`mb-3 flex-row items-center rounded-xl border-2 p-3 ${
        selected ? "border-secondary_color bg-orange-50" : "border-gray-200 bg-white"
      }`}
      onPress={() => onToggle(addon.id)}
    >
      <View className="mr-3 h-10 w-10 items-center justify-center rounded-lg bg-secondary_color">
        <Ionicons name={iconName} size={20} color="white" />
      </View>
      <View className="flex-1">
        <Text className="font-semibold text-primary_color">{addon.name}</Text>
        <Text className="text-sm text-secondary_color">
          {addon.price.toLocaleString()}đ
        </Text>
      </View>
      {addon.hasQty && selected && onChangeQty ? (
        <View className="flex-row items-center">
          <Pressable
            className="h-8 w-8 items-center justify-center rounded-full bg-gray-200"
            onPress={() => onChangeQty(-1)}
          >
            <Text className="text-lg font-bold">−</Text>
          </Pressable>
          <Text className="mx-3 text-lg font-bold">{qty ?? 0}</Text>
          <Pressable
            className="h-8 w-8 items-center justify-center rounded-full bg-secondary_color"
            onPress={() => onChangeQty(1)}
          >
            <Text className="text-lg font-bold text-white">+</Text>
          </Pressable>
        </View>
      ) : (
        <View
          className={`h-6 w-6 items-center justify-center rounded-full ${
            selected ? "bg-secondary_color" : "border-2 border-gray-300"
          }`}
        >
          {selected && <Ionicons name="checkmark" size={14} color="white" />}
        </View>
      )}
    </Pressable>
  );
}

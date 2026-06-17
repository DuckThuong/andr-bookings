import { View, Text, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { Policy } from "../types";

const POLICY_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  refund: "refresh",
  cancel: "close-circle",
  delay: "time",
  insurance: "shield-checkmark",
  "seat-change": "swap-horizontal",
  food: "restaurant",
  "rest-stop": "cafe",
};

interface PolicyCardProps {
  policies: Policy[];
}

export function PolicyCard({ policies }: PolicyCardProps) {
  if (!policies.length) return null;

  return (
    <View className="mb-3 rounded-xl bg-white p-4">
      <View className="mb-3 flex-row items-center">
        <Ionicons name="shield-checkmark" size={18} color="#00609c" />
        <Text className="ml-2 font-semibold text-primary_color">Chính sách</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View className="flex-row gap-3">
          {policies.map((policy, idx) => (
            <View
              key={idx}
              className="w-40 rounded-xl border border-gray-100 bg-gray-50 p-3"
            >
              <View className="mb-2 h-8 w-8 items-center justify-center rounded-full bg-blue-50">
                <Ionicons
                  name={POLICY_ICONS[policy.icon] ?? "information-circle"}
                  size={18}
                  color="#00609c"
                />
              </View>
              <Text className="font-medium text-sm text-primary_color">
                {policy.title}
              </Text>
              <Text className="mt-1 text-xs text-gray-500">{policy.description}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

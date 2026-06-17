import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { PaymentMethod } from "../types";

interface PaymentSelectorProps {
  methods: PaymentMethod[];
  selected: string;
  onChange: (id: string) => void;
}

const ICON_MAP: Record<string, string> = {
  "credit-card": "card",
  wallet: "wallet",
  "wallet-outline": "wallet-outline",
  qrcode: "qr-code",
};

export function PaymentSelector({
  methods,
  selected,
  onChange,
}: PaymentSelectorProps) {
  return (
    <View className="gap-3">
      {methods.map((method) => {
        const isSelected = selected === method.id;
        return (
          <Pressable
            key={method.id}
            className={`flex-row items-center rounded-xl border-2 p-4 ${
              isSelected
                ? "border-secondary_color bg-orange-50"
                : "border-gray-200 bg-white"
            }`}
            onPress={() => onChange(method.id)}
          >
            <View
              className={`h-6 w-6 items-center justify-center rounded-full border-2 ${
                isSelected
                  ? "border-secondary_color bg-secondary_color"
                  : "border-gray-300"
              }`}
            >
              {isSelected && (
                <Ionicons name="checkmark" size={14} color="white" />
              )}
            </View>
            <View className="ml-3 flex-1 flex-row items-center">
              <View className="mr-3 h-10 w-10 items-center justify-center rounded-xl bg-gray-100">
                <Ionicons
                  name={ICON_MAP[method.icon] as any || "card"}
                  size={20}
                  color="#00609c"
                />
              </View>
              <Text className="font-medium text-primary_color">
                {method.label}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

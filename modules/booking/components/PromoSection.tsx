import { View, Text, TextInput, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { PromoCode } from "../types";

interface PromoSectionProps {
  promoCodes: PromoCode[];
  applied: string | null;
  validating: boolean;
  onApplyCode: (code: string) => void;
}

export function PromoSection({
  promoCodes,
  applied,
  validating,
  onApplyCode,
}: PromoSectionProps) {
  const [inputCode, setInputCode] = React.useState("");

  const handleApply = () => {
    if (inputCode.trim()) {
      onApplyCode(inputCode.trim());
    }
  };

  if (applied) {
    return (
      <View className="mb-3 rounded-xl border-2 border-green-500 bg-green-50 p-4">
        <View className="flex-row items-center">
          <Ionicons name="checkmark-circle" size={24} color="#16a34a" />
          <View className="ml-3 flex-1">
            <Text className="font-semibold text-green-700">Mã đã áp dụng</Text>
            <Text className="text-sm text-green-600">{applied}</Text>
          </View>
          <Pressable onPress={() => onApplyCode("")}>
            <Text className="text-sm font-medium text-red-500">Xoá</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View className="mb-3 rounded-xl bg-white p-4">
      <View className="mb-2 flex-row items-center">
        <Ionicons name="pricetag" size={18} color="#f5a623" />
        <Text className="ml-2 font-semibold text-primary_color">Mã khuyến mãi</Text>
      </View>

      <View className="flex-row gap-2">
        <TextInput
          className="flex-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm"
          placeholder="Nhập mã..."
          value={inputCode}
          onChangeText={setInputCode}
        />
        <Pressable
          className="rounded-lg bg-secondary_color px-4 py-2"
          onPress={handleApply}
          disabled={validating}
        >
          <Text className="font-medium text-white">
            {validating ? "..." : "Áp dụng"}
          </Text>
        </Pressable>
      </View>

      {promoCodes.length > 0 && (
        <View className="mt-3 flex-row flex-wrap gap-2">
          {promoCodes.map((promo) => (
            <Pressable
              key={promo.code}
              className="rounded-full border border-dashed border-secondary_color bg-orange-50 px-3 py-1"
              onPress={() => {
                setInputCode(promo.code);
                onApplyCode(promo.code);
              }}
            >
              <Text className="text-xs font-medium text-secondary_color">
                {promo.code}
              </Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

import React from "react";

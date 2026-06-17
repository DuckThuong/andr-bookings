import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const STEPS = [
  { label: "Chọn ghế", icon: "chair" },
  { label: "Thông tin", icon: "person" },
  { label: "Thanh toán", icon: "card" },
  { label: "Hoàn tất", icon: "checkmark-circle" },
];

interface ProgressStepsProps {
  activeIdx: number;
}

export function ProgressSteps({ activeIdx }: ProgressStepsProps) {
  return (
    <View className="mx-5 my-4 flex-row items-center justify-center">
      {STEPS.map((step, index) => {
        const isActive = index === activeIdx;
        const isCompleted = index < activeIdx;
        const isLast = index === STEPS.length - 1;

        return (
          <View key={step.label} className="flex-row items-center">
            <View className="items-center">
              <View
                className={`h-10 w-10 items-center justify-center rounded-full ${
                  isActive
                    ? "bg-secondary_color"
                    : isCompleted
                      ? "bg-green-500"
                      : "bg-gray-200"
                }`}
              >
                {isCompleted ? (
                  <Ionicons name="checkmark" size={20} color="white" />
                ) : (
                  <Ionicons
                    name={step.icon as any}
                    size={18}
                    color={isActive ? "white" : "#9ca3af"}
                  />
                )}
              </View>
              <Text
                className={`mt-1 text-xs font-medium ${
                  isActive ? "text-secondary_color" : "text-gray-500"
                }`}
              >
                {step.label}
              </Text>
            </View>
            {!isLast && (
              <View
                className={`mx-1 h-0.5 w-8 ${
                  isCompleted ? "bg-green-500" : "bg-gray-200"
                }`}
              />
            )}
          </View>
        );
      })}
    </View>
  );
}

import { ActivityIndicator, Pressable, Text } from "react-native";

type AppButtonProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: "primary" | "secondary";
};

export function AppButton({
  label,
  onPress,
  disabled = false,
  loading = false,
  variant = "primary",
}: AppButtonProps) {
  const isPrimary = variant === "primary";

  return (
    <Pressable
      className={`min-h-14 items-center justify-center rounded-[22px] px-5 ${
        isPrimary ? "bg-[#f5a623]" : "bg-white_color"
      } ${disabled || loading ? "opacity-60" : ""}`}
      disabled={disabled || loading}
      onPress={onPress}
    >
      {loading ? (
        <ActivityIndicator color={isPrimary ? "#00293a" : "#00609c"} />
      ) : (
        <Text
          className={`font-semibold text-base ${
            isPrimary ? "text-primary_color" : "text-secondary_color"
          }`}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
}

import { ReactNode } from "react";
import { Text, View } from "react-native";

type FormFieldProps = {
  label?: string;
  error?: string;
  helperText?: string;
  children: ReactNode;
};

export function FormField({
  label,
  error,
  helperText,
  children,
}: FormFieldProps) {
  return (
    <View className="gap-2">
      {label ? (
        <Text className="px-1 font-medium text-sm text-primary_color">
          {label}
        </Text>
      ) : null}

      {children}

      {error ? (
        <Text className="px-1 text-xs text-text_alert_1">{error}</Text>
      ) : helperText ? (
        <Text className="px-1 text-xs text-text_color_4">{helperText}</Text>
      ) : null}
    </View>
  );
}

import { forwardRef, ReactNode, useState } from "react";
import {
  KeyboardTypeOptions,
  Pressable,
  Text,
  TextInput,
  TextInputProps,
  View,
} from "react-native";
import { FormField } from "@/shared/components/FormField";

type FormTextProps = Omit<TextInputProps, "value" | "onChangeText"> & {
  label?: string;
  value: string;
  onChangeText: (value: string) => void;
  error?: string;
  helperText?: string;
  leftSlot?: ReactNode;
  rightSlot?: ReactNode;
  keyboardType?: KeyboardTypeOptions;
};

export const FormText = forwardRef<TextInput, FormTextProps>(
  (
    {
      label,
      value,
      onChangeText,
      error,
      helperText,
      leftSlot,
      rightSlot,
      keyboardType = "default",
      editable = true,
      ...props
    },
    ref,
  ) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
      <FormField error={error} helperText={helperText} label={label}>
        <View
          className={`min-h-14 flex-row items-center rounded-[22px] border px-4 ${
            error
              ? "border-text_alert_1 bg-white_color"
              : isFocused
                ? "border-secondary_color bg-white_color"
                : "border-color_border bg-white_color"
          } ${editable ? "" : "bg-color_gray_2"}`}
        >
          {leftSlot ? <View className="mr-3">{leftSlot}</View> : null}

          <TextInput
            ref={ref}
            className="flex-1 font-sans text-base text-primary_color"
            cursorColor="#00609c"
            editable={editable}
            keyboardType={keyboardType}
            onBlur={() => setIsFocused(false)}
            onChangeText={onChangeText}
            onFocus={() => setIsFocused(true)}
            placeholderTextColor="#7b8a94"
            value={value}
            {...props}
          />

          {rightSlot ? <View className="ml-3">{rightSlot}</View> : null}
        </View>
      </FormField>
    );
  },
);

FormText.displayName = "FormText";

type StaticAffixProps = {
  text: string;
  onPress?: () => void;
};

export function FormAffix({ text, onPress }: StaticAffixProps) {
  if (!onPress) {
    return <Text className="font-medium text-sm text-secondary_color">{text}</Text>;
  }

  return (
    <Pressable onPress={onPress}>
      <Text className="font-medium text-sm text-secondary_color">{text}</Text>
    </Pressable>
  );
}

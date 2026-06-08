import { Ionicons } from "@expo/vector-icons";
import { ComponentProps, forwardRef, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { FormText } from "@/shared/components/FormText";

type FormPasswordProps = Omit<
  ComponentProps<typeof FormText>,
  "secureTextEntry" | "rightSlot"
> & {
  actionText?: string;
  onActionPress?: () => void;
};

export const FormPassword = forwardRef<TextInput, FormPasswordProps>(
  ({ actionText, onActionPress, ...props }, ref) => {
    const [isVisible, setIsVisible] = useState(false);

    return (
      <FormText
        ref={ref}
        {...props}
        secureTextEntry={!isVisible}
        rightSlot={
          <View className="flex-row items-center gap-2">
            {actionText && onActionPress ? (
              <Pressable onPress={onActionPress}>
                <Text className="font-medium text-sm text-secondary_color">
                  {actionText}
                </Text>
              </Pressable>
            ) : null}
            <Pressable onPress={() => setIsVisible((current) => !current)}>
              <Ionicons
                color="#6f7f89"
                name={isVisible ? "eye-outline" : "eye-off-outline"}
                size={20}
              />
            </Pressable>
          </View>
        }
      />
    );
  },
);

FormPassword.displayName = "FormPassword";

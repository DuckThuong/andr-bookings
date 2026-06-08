import { ComponentProps, forwardRef } from "react";
import { TextInput } from "react-native";
import { FormText } from "@/shared/components/FormText";

type FormNumberProps = Omit<
  ComponentProps<typeof FormText>,
  "keyboardType" | "onChangeText"
> & {
  onChangeText: (value: string) => void;
};

export const FormNumber = forwardRef<TextInput, FormNumberProps>(
  ({ onChangeText, ...props }, ref) => (
    <FormText
      ref={ref}
      {...props}
      keyboardType="number-pad"
      onChangeText={(value) => onChangeText(value.replace(/[^\d]/g, ""))}
    />
  ),
);

FormNumber.displayName = "FormNumber";

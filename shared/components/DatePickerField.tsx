import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Modal,
  Platform,
  Pressable,
  Text,
  View,
} from "react-native";
import { FormField } from "@/shared/components/FormField";
import { formatDateValue } from "@/shared/utils/date";

type DatePickerFieldProps = {
  label?: string;
  value: Date | null;
  onChange: (value: Date | null) => void;
  placeholder?: string;
  minimumDate?: Date;
  error?: string;
  helperText?: string;
};

export function DatePickerField({
  label,
  value,
  onChange,
  placeholder = "Select date",
  minimumDate,
  error,
  helperText,
}: DatePickerFieldProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [draftValue, setDraftValue] = useState(value ?? new Date());

  const close = () => {
    setIsOpen(false);
  };

  const open = () => {
    setDraftValue(value ?? new Date());
    setIsOpen(true);
  };

  const handleChange = (event: DateTimePickerEvent, nextValue?: Date) => {
    if (Platform.OS === "android") {
      setIsOpen(false);

      if (event.type === "set" && nextValue) {
        onChange(nextValue);
      }

      return;
    }

    if (nextValue) {
      setDraftValue(nextValue);
    }
  };

  return (
    <FormField error={error} helperText={helperText} label={label}>
      <Pressable
        className={`min-h-14 flex-row items-center justify-between rounded-[22px] border px-4 ${
          error ? "border-text_alert_1" : "border-color_border"
        } bg-white_color`}
        onPress={open}
      >
        <Text
          className={`font-sans text-base ${
            value ? "text-primary_color" : "text-text_color_4"
          }`}
        >
          {value ? formatDateValue(value) : placeholder}
        </Text>
        <Ionicons color="#6f7f89" name="calendar-outline" size={20} />
      </Pressable>

      {isOpen && Platform.OS === "android" ? (
        <DateTimePicker
          minimumDate={minimumDate}
          mode="date"
          onChange={handleChange}
          value={value ?? new Date()}
        />
      ) : null}

      {Platform.OS === "ios" ? (
        <Modal animationType="slide" transparent visible={isOpen}>
          <View className="flex-1 justify-end bg-black/30">
            <View className="rounded-t-[28px] bg-white_color p-5">
              <View className="mb-4 flex-row items-center justify-between">
                <Pressable onPress={close}>
                  <Text className="font-medium text-base text-text_color_4">
                    Cancel
                  </Text>
                </Pressable>
                <Text className="font-semibold text-base text-primary_color">
                  Pick date
                </Text>
                <Pressable
                  onPress={() => {
                    onChange(draftValue);
                    close();
                  }}
                >
                  <Text className="font-semibold text-base text-secondary_color">
                    Done
                  </Text>
                </Pressable>
              </View>
              <DateTimePicker
                display="spinner"
                minimumDate={minimumDate}
                mode="date"
                onChange={handleChange}
                value={draftValue}
              />
            </View>
          </View>
        </Modal>
      ) : null}
    </FormField>
  );
}

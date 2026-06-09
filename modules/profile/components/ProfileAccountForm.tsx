import { Controller, useForm } from "react-hook-form";
import { useEffect } from "react";
import { Text, View } from "react-native";
import { AppButton, DatePickerField, FormText } from "@/shared/components";
import type { UpdateUserProfilePayload, UserProfile } from "@/modules/profile/types";

type AccountFormValues = {
  userName: string;
  userPhone: string;
  userEmail: string;
  birthday: Date | null;
};

type ProfileAccountFormProps = {
  user?: UserProfile;
  loading?: boolean;
  onSave: (payload: UpdateUserProfilePayload) => void;
};

function parseBirthday(value?: string): Date | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function ProfileAccountForm({
  user,
  loading,
  onSave,
}: ProfileAccountFormProps) {
  const { control, handleSubmit, reset } = useForm<AccountFormValues>({
    defaultValues: {
      userName: "",
      userPhone: "",
      userEmail: "",
      birthday: null,
    },
  });

  useEffect(() => {
    reset({
      userName: user?.userName ?? "",
      userPhone: user?.userPhone ?? "",
      userEmail: user?.userEmail ?? "",
      birthday: parseBirthday(user?.userDob),
    });
  }, [reset, user]);

  return (
    <View className="gap-4">
      <View className="rounded-[28px] bg-white_color px-4 py-5">
        <Text className="font-semibold text-lg text-primary_color">
          Thông tin cá nhân
        </Text>
        <Text className="mt-1 text-sm text-text_color_4">
          Cập nhật thông tin để hồ sơ của bạn luôn chính xác.
        </Text>

        <View className="mt-4 items-center">
          <View className="h-20 w-20 items-center justify-center rounded-full bg-[#fdf1d8]">
            <Text className="font-bold text-3xl text-primary_color">
              {user?.userName?.trim().charAt(0).toUpperCase() || "K"}
            </Text>
          </View>
          <View className="mt-2 rounded-full bg-[#dcfce7] px-3 py-1">
            <Text className="text-xs text-[#15803d]">Đã xác minh</Text>
          </View>
        </View>

        <View className="mt-5 gap-4">
          <Controller
            control={control}
            name="userName"
            rules={{ required: "Vui lòng nhập họ và tên." }}
            render={({ field: { onChange, value }, fieldState }) => (
              <FormText
                error={fieldState.error?.message}
                label="Họ và tên"
                onChangeText={onChange}
                placeholder="Nguyễn Văn A"
                value={value}
              />
            )}
          />

          <Controller
            control={control}
            name="userPhone"
            rules={{
              required: "Vui lòng nhập số điện thoại.",
              pattern: {
                value: /^\d{9,12}$/,
                message: "Số điện thoại phải gồm 9–12 chữ số.",
              },
            }}
            render={({ field: { onChange, value }, fieldState }) => (
              <FormText
                error={fieldState.error?.message}
                keyboardType="phone-pad"
                label="Số điện thoại"
                onChangeText={onChange}
                placeholder="0987654321"
                value={value}
              />
            )}
          />

          <Controller
            control={control}
            name="userEmail"
            rules={{
              required: "Vui lòng nhập email.",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Email không đúng định dạng.",
              },
            }}
            render={({ field: { onChange, value }, fieldState }) => (
              <FormText
                error={fieldState.error?.message}
                keyboardType="email-address"
                label="Email"
                onChangeText={onChange}
                placeholder="example@email.com"
                value={value}
              />
            )}
          />

          <Controller
            control={control}
            name="birthday"
            render={({ field: { onChange, value } }) => (
              <DatePickerField
                label="Ngày sinh"
                onChange={onChange}
                placeholder="Chọn ngày sinh"
                value={value}
              />
            )}
          />

          <AppButton
            label="Lưu thay đổi"
            loading={loading}
            onPress={handleSubmit((values) =>
              onSave({
                userName: values.userName,
                userPhone: values.userPhone,
                userEmail: values.userEmail,
                userDob: values.birthday
                  ? `${values.birthday.getFullYear()}-${String(values.birthday.getMonth() + 1).padStart(2, "0")}-${String(values.birthday.getDate()).padStart(2, "0")}`
                  : undefined,
              }),
            )}
          />
        </View>
      </View>

      <View className="rounded-[28px] bg-primary_color px-4 py-5">
        <Text className="font-semibold text-base text-white_color">
          Phương thức thanh toán
        </Text>
        <Text className="mt-2 text-sm text-text_color_2">
          Quản lý thẻ để đặt vé nhanh và an toàn hơn.
        </Text>
        <Text className="mt-4 font-bold text-lg tracking-widest text-white_color">
          •••• •••• •••• 1234
        </Text>
        <Text className="mt-2 text-sm text-text_color_2">VISA · Thẻ tín dụng</Text>
      </View>
    </View>
  );
}

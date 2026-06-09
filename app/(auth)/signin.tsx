import { useAuth } from "@/modules/auth";
import {
  buildSignUpPayload,
  formatSignupPhone,
  GENDER_LABELS,
  GENDER_OPTIONS,
  SIGNUP_STEP_LABELS,
  SIGNUP_SUBTITLES,
} from "@/modules/auth/signup";
import type { SignUpFormValues } from "@/modules/auth/types";
import {
  AppButton,
  AuthScreenShell,
  DatePickerField,
  FormPassword,
  FormText,
} from "@/shared/components";
import { getApiErrorMessage } from "@/shared/utils/api";
import { formatDateValue } from "@/shared/utils/date";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Pressable, Text, View } from "react-native";

const DEFAULT_VALUES: SignUpFormValues = {
  name: "",
  phone: "",
  password: "",
  confirm_password: "",
  acceptRole: false,
  email: "",
  dateOfBirth: null,
  gender: "",
};

export default function SignUpScreen() {
  const { signUp } = useAuth();
  const [step, setStep] = useState(0);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { control, handleSubmit, trigger, watch, setValue } = useForm<SignUpFormValues>({
    defaultValues: DEFAULT_VALUES,
    mode: "onChange",
  });

  const formValues = watch();

  const goNext = async () => {
    setSubmitError(null);

    if (step === 0) {
      const valid = await trigger([
        "name",
        "phone",
        "password",
        "confirm_password",
        "acceptRole",
      ]);
      if (!valid) return;
      setStep(1);
      return;
    }

    if (step === 1) {
      const valid = await trigger(["email", "dateOfBirth", "gender"]);
      if (!valid) return;
      setStep(2);
    }
  };

  const handleCreateAccount = handleSubmit(async (values) => {
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      await signUp(buildSignUpPayload(values));
      router.replace({
        pathname: "/(auth)/finish",
        params: {
          name: values.name,
          phone: formatSignupPhone(values.phone),
        },
      } as never);
    } catch (error) {
      setSubmitError(getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <AuthScreenShell
      description={SIGNUP_SUBTITLES[step]}
      eyebrow={`Bước ${step + 1} / 3 — ${SIGNUP_STEP_LABELS[step]}`}
      title="Cho chúng tôi biết về bạn"
    >
      <View className="gap-4">
        <View className="flex-row items-center justify-between">
          {step > 0 ? (
            <Pressable
              className="flex-row items-center gap-1 rounded-full bg-background_color px-3 py-2"
              onPress={() => setStep((current) => current - 1)}
            >
              <Ionicons color="#00609c" name="arrow-back" size={16} />
              <Text className="font-medium text-sm text-secondary_color">Quay lại</Text>
            </Pressable>
          ) : (
            <View />
          )}

          <View className="flex-row gap-2">
            {SIGNUP_STEP_LABELS.map((label, index) => (
              <View
                key={label}
                className={`h-2 w-8 rounded-full ${
                  index <= step ? "bg-secondary_color" : "bg-color_border"
                }`}
              />
            ))}
          </View>
        </View>

        {step === 0 ? (
          <View className="gap-4">
            <Controller
              control={control}
              name="name"
              rules={{
                required: "Vui lòng nhập họ và tên.",
                minLength: { value: 3, message: "Họ tên phải có ít nhất 3 ký tự." },
              }}
              render={({ field: { onChange, value }, fieldState }) => (
                <FormText
                  error={fieldState.error?.message}
                  label="Họ và tên"
                  onChangeText={onChange}
                  placeholder="Nhập họ và tên của bạn"
                  value={value}
                />
              )}
            />

            <Controller
              control={control}
              name="phone"
              rules={{
                required: "Vui lòng nhập số điện thoại.",
                validate: (value) =>
                  formatSignupPhone(value).length === 10 ||
                  "Số điện thoại phải gồm 10 chữ số.",
              }}
              render={({ field: { onChange, value }, fieldState }) => (
                <FormText
                  error={fieldState.error?.message}
                  keyboardType="phone-pad"
                  label="Số điện thoại"
                  onChangeText={(text) => onChange(formatSignupPhone(text))}
                  placeholder="0812345678"
                  value={value}
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              rules={{
                required: "Vui lòng nhập mật khẩu.",
                minLength: {
                  value: 6,
                  message: "Mật khẩu phải có ít nhất 6 ký tự.",
                },
              }}
              render={({ field: { onChange, value }, fieldState }) => (
                <FormPassword
                  error={fieldState.error?.message}
                  label="Mật khẩu"
                  onChangeText={onChange}
                  placeholder="Nhập mật khẩu"
                  value={value}
                />
              )}
            />

            <Controller
              control={control}
              name="confirm_password"
              rules={{
                required: "Vui lòng xác nhận mật khẩu.",
                validate: (value) =>
                  value === watch("password") || "Mật khẩu xác nhận không khớp.",
              }}
              render={({ field: { onChange, value }, fieldState }) => (
                <FormPassword
                  error={fieldState.error?.message}
                  label="Xác nhận mật khẩu"
                  onChangeText={onChange}
                  placeholder="Nhập lại mật khẩu"
                  value={value}
                />
              )}
            />

            <Controller
              control={control}
              name="acceptRole"
              rules={{
                validate: (value) =>
                  value || "Bạn cần đồng ý điều khoản sử dụng.",
              }}
              render={({ field: { onChange, value }, fieldState }) => (
                <View>
                  <Pressable
                    className="flex-row items-start gap-3 rounded-[20px] bg-background_color px-4 py-4"
                    onPress={() => onChange(!value)}
                  >
                    <View
                      className={`mt-0.5 h-5 w-5 items-center justify-center rounded-md border ${
                        value
                          ? "border-secondary_color bg-secondary_color"
                          : "border-color_border bg-white_color"
                      }`}
                    >
                      {value ? (
                        <Ionicons color="#ffffff" name="checkmark" size={14} />
                      ) : null}
                    </View>
                    <Text className="flex-1 text-sm leading-6 text-primary_color">
                      Tôi đồng ý với Điều khoản sử dụng và Chính sách bảo mật của
                      GoRide.
                    </Text>
                  </Pressable>
                  {fieldState.error?.message ? (
                    <Text className="mt-2 text-sm text-text_alert_1">
                      {fieldState.error.message}
                    </Text>
                  ) : null}
                </View>
              )}
            />
          </View>
        ) : null}

        {step === 1 ? (
          <View className="gap-4">
            <Controller
              control={control}
              name="email"
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
              name="dateOfBirth"
              rules={{ required: "Vui lòng chọn ngày sinh." }}
              render={({ field: { onChange, value }, fieldState }) => (
                <DatePickerField
                  error={fieldState.error?.message}
                  label="Ngày sinh"
                  onChange={onChange}
                  placeholder="Chọn ngày sinh"
                  value={value}
                />
              )}
            />

            <Controller
              control={control}
              name="gender"
              rules={{ required: "Vui lòng chọn giới tính." }}
              render={({ field: { onChange, value }, fieldState }) => (
                <View className="gap-2">
                  <Text className="px-1 font-medium text-sm text-primary_color">
                    Giới tính
                  </Text>
                  <View className="flex-row flex-wrap gap-2">
                    {GENDER_OPTIONS.map((option) => {
                      const isActive = value === option.value;

                      return (
                        <Pressable
                          key={option.value}
                          className={`rounded-full px-4 py-3 ${
                            isActive ? "bg-secondary_color" : "bg-background_color"
                          }`}
                          onPress={() => {
                            onChange(option.value);
                            setValue("gender", option.value, { shouldValidate: true });
                          }}
                        >
                          <Text
                            className={`font-medium text-sm ${
                              isActive ? "text-white_color" : "text-primary_color"
                            }`}
                          >
                            {option.emoji} {option.label}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                  {fieldState.error?.message ? (
                    <Text className="px-1 text-sm text-text_alert_1">
                      {fieldState.error.message}
                    </Text>
                  ) : null}
                </View>
              )}
            />
          </View>
        ) : null}

        {step === 2 ? (
          <View className="gap-4">
            <ConfirmSection
              onEdit={() => setStep(0)}
              rows={[
                { label: "Họ và tên", value: formValues.name },
                { label: "Số điện thoại", value: formValues.phone },
              ]}
              title="Tài khoản"
            />

            <ConfirmSection
              onEdit={() => setStep(1)}
              rows={[
                { label: "Email", value: formValues.email },
                {
                  label: "Ngày sinh",
                  value: formValues.dateOfBirth
                    ? formatDateValue(formValues.dateOfBirth)
                    : "—",
                },
                {
                  label: "Giới tính",
                  value: GENDER_LABELS[formValues.gender] ?? "—",
                },
              ]}
              title="Thông tin cá nhân"
            />

            <Text className="text-sm leading-6 text-text_color_4">
              Vui lòng kiểm tra lại thông tin trước khi tạo tài khoản.
            </Text>
          </View>
        ) : null}

        {submitError ? (
          <Text className="text-sm text-text_alert_1">{submitError}</Text>
        ) : null}

        {step < 2 ? (
          <AppButton label="Tiếp tục" onPress={() => void goNext()} />
        ) : (
          <AppButton
            label="Tạo tài khoản"
            loading={isSubmitting}
            onPress={() => void handleCreateAccount()}
          />
        )}

        <View className="flex-row items-center justify-center gap-1">
          <Text className="text-sm text-text_color_4">Đã có tài khoản?</Text>
          <Pressable onPress={() => router.replace("/(auth)/login" as never)}>
            <Text className="font-semibold text-sm text-secondary_color">
              Đăng nhập ngay
            </Text>
          </Pressable>
        </View>
      </View>
    </AuthScreenShell>
  );
}

function ConfirmSection({
  title,
  rows,
  onEdit,
}: {
  title: string;
  rows: Array<{ label: string; value: string }>;
  onEdit: () => void;
}) {
  return (
    <View className="rounded-[22px] bg-background_color px-4 py-4">
      <View className="mb-3 flex-row items-center justify-between">
        <Text className="font-semibold text-base text-primary_color">{title}</Text>
        <Pressable onPress={onEdit}>
          <Text className="font-medium text-sm text-secondary_color">Sửa</Text>
        </Pressable>
      </View>
      {rows.map((row) => (
        <View
          key={row.label}
          className="mb-2 flex-row items-start justify-between gap-4"
        >
          <Text className="text-sm text-text_color_4">{row.label}</Text>
          <Text className="flex-1 text-right font-medium text-sm text-primary_color">
            {row.value || "—"}
          </Text>
        </View>
      ))}
    </View>
  );
}

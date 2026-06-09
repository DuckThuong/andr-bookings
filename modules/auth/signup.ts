import type { SignUpFormValues, SignUpPayload } from "@/modules/auth/types";

export const SIGNUP_STEP_LABELS = [
  "Tài khoản",
  "Thông tin cá nhân",
  "Xác nhận",
] as const;

export const SIGNUP_SUBTITLES: Record<number, string> = {
  0: "Thông tin của bạn sẽ được bảo mật và chỉ sử dụng để tạo tài khoản GoRide.",
  1: "Vui lòng cung cấp thông tin cá nhân chính xác để trải nghiệm dịch vụ tốt nhất.",
  2: "Kiểm tra lại thông tin trước khi tạo tài khoản. Bấm Sửa để quay lại bước tương ứng.",
};

export const GENDER_OPTIONS = [
  { value: "1", label: "Nam", emoji: "👨" },
  { value: "2", label: "Nữ", emoji: "👩" },
  { value: "3", label: "Khác", emoji: "🧑" },
] as const;

export const GENDER_LABELS: Record<string, string> = {
  "1": "Nam",
  "2": "Nữ",
  "3": "Khác",
};

export function formatSignupPhone(raw: string): string {
  let digits = raw.replace(/\D/g, "");

  if (digits.startsWith("84")) {
    digits = `0${digits.slice(2)}`;
  }

  if (digits.length > 10) {
    digits = digits.slice(0, 10);
  }

  return digits;
}

export function buildSignUpPayload(values: SignUpFormValues): SignUpPayload {
  const phone = formatSignupPhone(values.phone);

  return {
    name: values.name.trim(),
    phone,
    password: values.password,
    confirm_password: values.confirm_password,
    acceptRole: values.acceptRole ? 1 : 0,
    email: values.email.trim(),
    dateOfBirth: values.dateOfBirth
      ? `${values.dateOfBirth.getFullYear()}-${String(values.dateOfBirth.getMonth() + 1).padStart(2, "0")}-${String(values.dateOfBirth.getDate()).padStart(2, "0")}`
      : "",
    gender: Number(values.gender || 0),
  };
}

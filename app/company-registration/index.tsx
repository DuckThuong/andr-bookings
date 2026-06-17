import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  Alert,
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "@/modules/auth/storage";
import {
  createCompanyRegistration,
  getMyCompanyRegistration,
  uploadImage,
} from "@/modules/company-registration/api";
import type {
  CompanyRegistrationResponseDto,
  RegistrationStatus,
} from "@/modules/company-registration/types";

const STATUS_CONFIG: Record<
  RegistrationStatus,
  { label: string; icon: string; color: string; bgColor: string }
> = {
  PENDING: {
    label: "Đang chờ phê duyệt",
    icon: "time-outline",
    color: "#f5a623",
    bgColor: "#fef3cd",
  },
  APPROVED: {
    label: "Đã được phê duyệt",
    icon: "checkmark-circle",
    color: "#28a745",
    bgColor: "#d4edda",
  },
  REJECTED: {
    label: "Đã bị từ chối",
    icon: "close-circle",
    color: "#dc3545",
    bgColor: "#f8d7da",
  },
};

const NOTE_MESSAGES: Record<RegistrationStatus, string> = {
  PENDING:
    "Yêu cầu của bạn đang được admin xem xét. Bạn sẽ nhận được thông báo khi có kết quả.",
  APPROVED:
    "Chúc mừng! Bạn đã trở thành nhà xe. Vui lòng đăng nhập lại để sử dụng các chức năng dành cho nhà xe.",
  REJECTED: "Vui lòng kiểm tra lại thông tin và gửi yêu cầu mới.",
};

export default function CompanyRegistrationScreen() {
  const { user } = useAuthStore();
  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isReapplying, setIsReapplying] = useState(false);
  const [existingRegistration, setExistingRegistration] =
    useState<CompanyRegistrationResponseDto | null>(null);

  const [formData, setFormData] = useState({
    companyName: "",
    address: "",
    representativePhone: "",
    representativeName: "",
    representativePosition: "",
    taxCode: "",
    businessAddress: "",
    businessLicenseDate: "",
    businessLicenseUrl: "",
    idCardUrl: "",
    description: "",
  });

  useEffect(() => {
    loadRegistration();
  }, []);

  const loadRegistration = async () => {
    try {
      const data = await getMyCompanyRegistration();
      setExistingRegistration(data);
    } catch (error) {
      console.error("Failed to load registration:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.companyName.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập tên nhà xe");
      return;
    }
    if (!formData.representativeName.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập tên người đại diện");
      return;
    }
    if (!formData.representativePhone.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập số điện thoại");
      return;
    }

    setIsSubmitting(true);
    try {
      await createCompanyRegistration(formData);
      Alert.alert("Thành công", "Gửi yêu cầu đăng ký nhà xe thành công", [
        { text: "OK", onPress: () => loadRegistration() },
      ]);
      setIsReapplying(false);
    } catch (error: any) {
      Alert.alert(
        "Lỗi",
        error.response?.data?.message || "Gửi yêu cầu thất bại"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    if (step === 0) {
      if (!formData.companyName.trim()) {
        Alert.alert("Lỗi", "Vui lòng nhập tên nhà xe");
        return;
      }
      if (!formData.representativeName.trim()) {
        Alert.alert("Lỗi", "Vui lòng nhập tên người đại diện");
        return;
      }
      if (!formData.representativePhone.trim()) {
        Alert.alert("Lỗi", "Vui lòng nhập số điện thoại");
        return;
      }
    }
    setStep(step + 1);
  };

  const handlePrev = () => setStep(step - 1);

  const handleReapply = () => {
    setStep(0);
    setFormData({
      companyName: "",
      address: "",
      representativePhone: "",
      representativeName: "",
      representativePosition: "",
      taxCode: "",
      businessAddress: "",
      businessLicenseDate: "",
      businessLicenseUrl: "",
      idCardUrl: "",
      description: "",
    });
    setIsReapplying(true);
  };

  const handleUploadImage = async (
    type: "businessLicense" | "idCard"
  ): Promise<string | null> => {
    // Simulated - in production would use image picker
    Alert.alert("Thông báo", "Tính năng upload ảnh đang phát triển");
    return null;
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#f97316" />
        <Text className="mt-3 text-gray-500">Đang tải...</Text>
      </View>
    );
  }

  if (existingRegistration && !isReapplying) {
    const status = existingRegistration.status as RegistrationStatus;
    const config = STATUS_CONFIG[status];

    return (
      <ScrollView className="flex-1 bg-gray-50 p-4">
        <View className="rounded-xl bg-white p-4">
          <View
            className="mb-4 flex-row items-center rounded-full px-4 py-2"
            style={{ backgroundColor: config.bgColor }}
          >
            <Ionicons name={config.icon as any} size={20} color={config.color} />
            <Text
              className="ml-2 font-medium"
              style={{ color: config.color }}
            >
              {config.label}
            </Text>
          </View>

          <View className="mb-3 flex-row items-center">
            <Ionicons name="business" size={20} color="#6b7280" />
            <Text className="ml-2 text-gray-600">
              Thông tin nhà xe: {existingRegistration.companyName}
            </Text>
          </View>

          {existingRegistration.rejectionReason && (
            <View className="mb-3 rounded-lg bg-red-50 p-3">
              <Text className="text-sm text-red-700">
                <Text className="font-semibold">Lý do: </Text>
                {existingRegistration.rejectionReason}
              </Text>
            </View>
          )}

          <Text className="text-sm text-gray-500">{NOTE_MESSAGES[status]}</Text>

          {status === RegistrationStatus.REJECTED && (
            <Pressable
              className="mt-4 items-center rounded-lg bg-primary_color py-3"
              onPress={handleReapply}
            >
              <Text className="font-semibold text-white">Đăng ký lại</Text>
            </Pressable>
          )}
        </View>
      </ScrollView>
    );
  }

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView className="flex-1 bg-gray-50">
        {/* Hero Banner */}
        <View className="bg-primary_color p-4">
          <View className="flex-row items-center">
            <View className="mr-3 h-12 w-12 items-center justify-center rounded-full bg-white/20">
              <Ionicons name="business" size={24} color="white" />
            </View>
            <View className="flex-1">
              <Text className="text-sm text-white/80">Trở thành đối tác</Text>
              <Text className="text-xl font-bold text-white">Đăng ký nhà xe</Text>
              <Text className="mt-1 text-sm text-white/80">
                Cung cấp dịch vụ vận tải hành khách trên nền tảng GoRide
              </Text>
            </View>
          </View>
        </View>

        {/* Steps Indicator */}
        <View className="flex-row justify-around bg-white p-4">
          {[0, 1, 2].map((s) => (
            <View key={s} className="items-center">
              <View
                className={`h-8 w-8 items-center justify-center rounded-full ${
                  step >= s ? "bg-primary_color" : "bg-gray-200"
                }`}
              >
                {step > s ? (
                  <Ionicons name="checkmark" size={16} color="white" />
                ) : (
                  <Text className={`font-bold ${step >= s ? "text-white" : "text-gray-500"}`}>
                    {s + 1}
                  </Text>
                )}
              </View>
              <Text
                className={`mt-1 text-xs ${step >= s ? "text-primary_color font-medium" : "text-gray-400"}`}
              >
                {s === 0 ? "Thông tin" : s === 1 ? "Giấy tờ" : "Xác nhận"}
              </Text>
            </View>
          ))}
        </View>

        {/* Form Card */}
        <View className="m-4 rounded-xl bg-white p-4">
          {step === 0 && (
            <>
              <Text className="mb-4 text-lg font-semibold text-primary_color">
                Thông tin nhà xe
              </Text>

              <Text className="mb-1 text-sm text-gray-600">Tên nhà xe *</Text>
              <TextInput
                className="mb-3 rounded-lg border border-gray-200 bg-gray-50 p-3"
                placeholder="Nhập tên nhà xe"
                value={formData.companyName}
                onChangeText={(text) => setFormData({ ...formData, companyName: text })}
              />

              <Text className="mb-1 text-sm text-gray-600">Địa chỉ trụ sở</Text>
              <TextInput
                className="mb-3 rounded-lg border border-gray-200 bg-gray-50 p-3"
                placeholder="Nhập địa chỉ trụ sở"
                value={formData.address}
                onChangeText={(text) => setFormData({ ...formData, address: text })}
              />

              <Text className="mb-1 text-sm text-gray-600">Tên người đại diện pháp lý *</Text>
              <TextInput
                className="mb-3 rounded-lg border border-gray-200 bg-gray-50 p-3"
                placeholder="Nhập tên người đại diện"
                value={formData.representativeName}
                onChangeText={(text) => setFormData({ ...formData, representativeName: text })}
              />

              <Text className="mb-1 text-sm text-gray-600">Chức vụ *</Text>
              <TextInput
                className="mb-3 rounded-lg border border-gray-200 bg-gray-50 p-3"
                placeholder="Nhập chức vụ"
                value={formData.representativePosition}
                onChangeText={(text) => setFormData({ ...formData, representativePosition: text })}
              />

              <Text className="mb-1 text-sm text-gray-600">Số điện thoại đại diện *</Text>
              <TextInput
                className="mb-3 rounded-lg border border-gray-200 bg-gray-50 p-3"
                placeholder="Nhập số điện thoại"
                keyboardType="phone-pad"
                value={formData.representativePhone}
                onChangeText={(text) => setFormData({ ...formData, representativePhone: text })}
              />

              <Text className="mb-1 text-sm text-gray-600">Mã số thuế</Text>
              <TextInput
                className="mb-3 rounded-lg border border-gray-200 bg-gray-50 p-3"
                placeholder="Nhập mã số thuế"
                value={formData.taxCode}
                onChangeText={(text) => setFormData({ ...formData, taxCode: text })}
              />

              <Text className="mb-1 text-sm text-gray-600">Địa chỉ theo GPKD</Text>
              <TextInput
                className="rounded-lg border border-gray-200 bg-gray-50 p-3"
                placeholder="Nhập địa chỉ theo giấy phép kinh doanh"
                value={formData.businessAddress}
                onChangeText={(text) => setFormData({ ...formData, businessAddress: text })}
              />
            </>
          )}

          {step === 1 && (
            <>
              <Text className="mb-4 text-lg font-semibold text-primary_color">
                Giấy tờ pháp lý
              </Text>

              <Text className="mb-1 text-sm text-gray-600">Ngày cấp GPKD</Text>
              <TextInput
                className="mb-3 rounded-lg border border-gray-200 bg-gray-50 p-3"
                placeholder="YYYY-MM-DD"
                value={formData.businessLicenseDate}
                onChangeText={(text) =>
                  setFormData({ ...formData, businessLicenseDate: text })
                }
              />

              <Text className="mb-2 text-sm text-gray-600">Giấy phép kinh doanh</Text>
              <Pressable
                className="mb-3 flex-row items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-4"
                onPress={() => handleUploadImage("businessLicense")}
              >
                {formData.businessLicenseUrl ? (
                  <Image
                    source={{ uri: formData.businessLicenseUrl }}
                    className="h-24 w-32 rounded-lg"
                  />
                ) : (
                  <>
                    <Ionicons name="cloud-upload-outline" size={24} color="#6b7280" />
                    <Text className="ml-2 text-gray-500">Chọn file GPKD</Text>
                  </>
                )}
              </Pressable>

              <Text className="mb-2 text-sm text-gray-600">CMND/CCCD người đại diện</Text>
              <Pressable
                className="flex-row items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-4"
                onPress={() => handleUploadImage("idCard")}
              >
                {formData.idCardUrl ? (
                  <Image
                    source={{ uri: formData.idCardUrl }}
                    className="h-24 w-32 rounded-lg"
                  />
                ) : (
                  <>
                    <Ionicons name="cloud-upload-outline" size={24} color="#6b7280" />
                    <Text className="ml-2 text-gray-500">Chọn file CMND/CCCD</Text>
                  </>
                )}
              </Pressable>
            </>
          )}

          {step === 2 && (
            <>
              <Text className="mb-4 text-lg font-semibold text-primary_color">
                Xác nhận thông tin
              </Text>

              <Text className="mb-1 text-sm text-gray-600">Mô tả thêm</Text>
              <TextInput
                className="mb-4 rounded-lg border border-gray-200 bg-gray-50 p-3"
                placeholder="Nhập mô tả thêm về nhà xe..."
                multiline
                numberOfLines={4}
                value={formData.description}
                onChangeText={(text) => setFormData({ ...formData, description: text })}
              />

              <View className="rounded-lg bg-blue-50 p-4">
                <Text className="text-sm font-medium text-blue-800">Xác nhận thông tin</Text>
                <Text className="mt-1 text-sm text-blue-600">
                  Vui lòng kiểm tra lại thông tin trước khi gửi yêu cầu. Sau khi gửi, admin sẽ
                  xem xét và phê duyệt hồ sơ của bạn trong vòng 24h.
                </Text>
              </View>
            </>
          )}

          {/* Actions */}
          <View className="mt-6 flex-row justify-between">
            {step > 0 && (
              <Pressable
                className="flex-1 items-center justify-center rounded-lg border border-gray-300 py-3"
                onPress={handlePrev}
              >
                <Text className="font-semibold text-gray-600">Quay lại</Text>
              </Pressable>
            )}
            {step < 2 ? (
              <Pressable
                className={`flex-1 items-center justify-center rounded-lg py-3 ${
                  step > 0 ? "ml-3" : ""
                } bg-primary_color`}
                onPress={handleNext}
              >
                <Text className="font-semibold text-white">Tiếp tục</Text>
              </Pressable>
            ) : (
              <Pressable
                className="ml-3 flex-1 items-center justify-center rounded-lg bg-primary_color py-3"
                onPress={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="font-semibold text-white">Gửi yêu cầu</Text>
                )}
              </Pressable>
            )}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

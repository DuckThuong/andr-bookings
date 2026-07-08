import { router } from "expo-router";
import { useState } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  View,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

type Faq = {
  id: string;
  question: string;
  answer: string;
};

type Contact = {
  id: string;
  label: string;
  value: string;
  note?: string;
};

const MOCK_FAQS: Faq[] = [
  {
    id: "1",
    question: "Làm sao để đặt vé xe?",
    answer:
      "Bạn có thể đặt vé qua ứng dụng GoRide bằng cách: 1) Chọn tuyến xe và ngày đi. 2) Chọn ghế ngồi. 3) Điền thông tin hành khách. 4) Thanh toán qua PayOS hoặc tiền mặt.",
  },
  {
    id: "2",
    question: "Tôi có thể hủy vé không?",
    answer:
      "Bạn có thể yêu cầu hủy vé trong phần 'Lịch sử đặt vé'. Phí hủy tùy thuộc vào thời điểm hủy: Hủy trước 24h được hoàn 80%, trước 12h được hoàn 50%, sau không được hoàn.",
  },
  {
    id: "3",
    question: "Thanh toán bằng cách nào?",
    answer:
      "GoRide hỗ trợ thanh toán qua: 1) PayOS (thẻ ATM, Visa, Mastercard). 2) Thanh toán tiền mặt tại quầy. 3) Ví điện tử MoMo, ZaloPay.",
  },
  {
    id: "4",
    question: "Làm sao để nhận hoàn tiền?",
    answer:
      "Sau khi yêu cầu hủy được chấp nhận, tiền sẽ được hoàn trong vòng 3-7 ngày làm việc. Đối với PayOS, tiền sẽ được hoàn vào tài khoản thanh toán.",
  },
  {
    id: "5",
    question: "Tôi quên mã đặt vé, làm sao?",
    answer:
      "Bạn có thể xem lại mã đặt vé trong mục 'Lịch sử đặt vé' hoặc kiểm tra email/xem tin nhắn SMS đã nhận được sau khi đặt vé thành công.",
  },
  {
    id: "6",
    question: "Làm sao liên hệ với nhà xe?",
    answer:
      "Bạn có thể liên hệ nhà xe trực tiếp qua tính năng 'Tin nhắn' trong ứng dụng hoặc gọi hotline được hiển thị trên vé của bạn.",
  },
];

const MOCK_CONTACTS: Contact[] = [
  {
    id: "1",
    label: "Hotline",
    value: "1900 1234",
    note: "Hỗ trợ 24/7",
  },
  {
    id: "2",
    label: "Email",
    value: "hotro@goride.vn",
    note: "Phản hồi trong 24h",
  },
  {
    id: "3",
    label: "Zalo OA",
    value: "GoRide Support",
    note: "Hỗ trợ nhanh qua Zalo",
  },
  {
    id: "4",
    label: "Facebook",
    value: "fb.com/goride.vn",
    note: "Cập nhật tin tức và ưu đãi",
  },
];

export default function SupportScreen() {
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  const toggleFaq = (id: string) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  const handleCall = (phoneNumber: string) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleEmail = (email: string) => {
    Linking.openURL(`mailto:${email}`);
  };

  return (
    <SafeAreaView className="flex-1 bg-background_color">
      {/* Header */}
      <View className="px-5 pt-3">
        <View className="flex-row items-center gap-3">
          <Pressable
            className="rounded-full bg-white_color p-2"
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#f97316" />
          </Pressable>
          <Text className="font-bold text-xl text-primary_color">
            Hỗ trợ
          </Text>
        </View>
      </View>

      {/* Hero */}
      <View className="mx-5 mt-4 rounded-[24px] bg-gradient-to-r from-[#3b82f6] to-[#2563eb] px-5 py-6">
        <Text className="text-sm uppercase tracking-wider text-white/80">
          Trung tâm hỗ trợ
        </Text>
        <Text className="mt-2 font-bold text-2xl text-white_color">
          Chúng tôi luôn sẵn sàng giúp bạn
        </Text>
        <Text className="mt-2 text-sm text-white/90">
          Tìm nhanh các câu hỏi thường gặp hoặc liên hệ trực tiếp với đội ngũ CSKH.
        </Text>
      </View>

      <ScrollView
        className="mt-4 flex-1"
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* FAQs */}
        <View className="mb-6 rounded-[24px] bg-white_color px-5 py-5">
          <View className="mb-4 flex-row items-center gap-2">
            <Ionicons name="help-circle" size={24} color="#3b82f6" />
            <Text className="font-bold text-lg text-primary_color">
              Câu hỏi thường gặp
            </Text>
          </View>

          {MOCK_FAQS.map((faq) => (
            <View key={faq.id} className="mb-3">
              <Pressable
                className="flex-row items-center justify-between rounded-[16px] bg-background_color px-4 py-4"
                onPress={() => toggleFaq(faq.id)}
              >
                <Text className="flex-1 pr-4 font-medium text-base text-primary_color">
                  {faq.question}
                </Text>
                <Ionicons
                  name={
                    expandedFaq === faq.id
                      ? "chevron-up"
                      : "chevron-down"
                  }
                  size={20}
                  color="#6b7280"
                />
              </Pressable>

              {expandedFaq === faq.id && (
                <View className="mt-2 rounded-[16px] bg-[#f3f4f6] px-4 py-4">
                  <Text className="text-sm leading-relaxed text-text_color_4">
                    {faq.answer}
                  </Text>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Contact channels */}
        <View className="rounded-[24px] bg-white_color px-5 py-5">
          <View className="mb-4 flex-row items-center gap-2">
            <Ionicons name="call" size={24} color="#16a34a" />
            <Text className="font-bold text-lg text-primary_color">
              Kênh liên hệ
            </Text>
          </View>

          {MOCK_CONTACTS.map((contact) => (
            <Pressable
              key={contact.id}
              className="mb-3 flex-row items-center justify-between rounded-[16px] bg-background_color px-4 py-4"
              onPress={() => {
                if (contact.label === "Hotline") {
                  handleCall(contact.value);
                } else if (contact.label === "Email") {
                  handleEmail(contact.value);
                }
              }}
            >
              <View>
                <Text className="font-medium text-base text-primary_color">
                  {contact.label}
                </Text>
                <Text className="mt-1 text-sm text-secondary_color">
                  {contact.value}
                </Text>
                {contact.note && (
                  <Text className="mt-1 text-xs text-text_color_4">
                    {contact.note}
                  </Text>
                )}
              </View>
              <View className="h-10 w-10 items-center justify-center rounded-full bg-[#dcfce7]">
                <Ionicons name="chevron-forward" size={20} color="#16a34a" />
              </View>
            </Pressable>
          ))}
        </View>

        {/* Quick actions */}
        <View className="mt-6 rounded-[24px] bg-white_color px-5 py-5">
          <View className="mb-4 flex-row items-center gap-2">
            <Ionicons name="flash" size={24} color="#f97316" />
            <Text className="font-bold text-lg text-primary_color">
              Thao tác nhanh
            </Text>
          </View>

          <View className="gap-3">
            <Pressable
              className="flex-row items-center gap-3 rounded-[16px] bg-background_color px-4 py-4"
              onPress={() => router.push("/(tabs)/profile")}
            >
              <View className="h-10 w-10 items-center justify-center rounded-full bg-[#fef3e2]">
                <Ionicons name="ticket-outline" size={20} color="#f97316" />
              </View>
              <View className="flex-1">
                <Text className="font-medium text-base text-primary_color">
                  Xem vé đã đặt
                </Text>
                <Text className="mt-1 text-xs text-text_color_4">
                  Kiểm tra trạng thái vé và thông tin chuyến đi
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </Pressable>

            <Pressable
              className="flex-row items-center gap-3 rounded-[16px] bg-background_color px-4 py-4"
              onPress={() => router.push("/promos")}
            >
              <View className="h-10 w-10 items-center justify-center rounded-full bg-[#fee2e2]">
                <Ionicons name="pricetag-outline" size={20} color="#dc2626" />
              </View>
              <View className="flex-1">
                <Text className="font-medium text-base text-primary_color">
                  Xem khuyến mãi
                </Text>
                <Text className="mt-1 text-xs text-text_color_4">
                  Cập nhật mã giảm giá và ưu đãi mới nhất
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </Pressable>

            <Pressable
              className="flex-row items-center gap-3 rounded-[16px] bg-background_color px-4 py-4"
              onPress={() => router.push("/(tabs)/messages")}
            >
              <View className="h-10 w-10 items-center justify-center rounded-full bg-[#dbeafe]">
                <Ionicons name="chatbubble-outline" size={20} color="#3b82f6" />
              </View>
              <View className="flex-1">
                <Text className="font-medium text-base text-primary_color">
                  Gửi tin nhắn hỗ trợ
                </Text>
                <Text className="mt-1 text-xs text-text_color_4">
                  Liên hệ trực tiếp với đội ngũ CSKH
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

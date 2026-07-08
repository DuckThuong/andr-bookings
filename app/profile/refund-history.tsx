import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRefundInvoicesQuery } from "@/modules/profile/hooks";
import { StateBlock } from "@/shared/components";
import { formatCurrencyVND } from "@/shared/utils/format";

const STATUS_CONFIG = {
  SUCCESS: {
    color: "#15803d",
    bg: "#dcfce7",
    label: "Hoàn tiền thành công",
  },
  PENDING: {
    color: "#854d0e",
    bg: "#fef9c3",
    label: "Đang xử lý",
  },
  REJECTED: {
    color: "#991b1b",
    bg: "#fee2e2",
    label: "Từ chối hoàn tiền",
  },
} as const;

const REFUND_STATUS_CONFIG: Record<string, (typeof STATUS_CONFIG)[keyof typeof STATUS_CONFIG]> = STATUS_CONFIG;

export default function RefundHistoryScreen() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<string>("");

  const queryParams = {
    page,
    limit: 10,
    status: status || undefined,
  };

  const query = useRefundInvoicesQuery(queryParams);

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "-";
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  const handleCopyCode = (code: string) => {
    // In a real app, use Clipboard API
    console.log("Copy code:", code);
  };

  const renderItem = ({ item }: { item: any }) => {
    const config =
      REFUND_STATUS_CONFIG[item.status] || REFUND_STATUS_CONFIG.PENDING;

    return (
      <View className="mb-3 rounded-[20px] bg-white_color px-4 py-4">
        <View className="flex-row items-start justify-between gap-3">
          <View className="flex-1">
            <Text className="font-semibold text-base text-primary_color">
              {item.trip?.departure && item.trip?.arrival
                ? `${item.trip.departure} → ${item.trip.arrival}`
                : "Chuyến xe"}
            </Text>
            {item.trip?.date && (
              <Text className="mt-1 text-sm text-text_color_4">
                {item.trip.date}
                {item.trip?.time && ` • ${item.trip.time}`}
              </Text>
            )}
          </View>
          <View
            className="rounded-full px-3 py-1"
            style={{ backgroundColor: config.bg }}
          >
            <Text
              className="text-xs font-medium"
              style={{ color: config.color }}
            >
              {config.label}
            </Text>
          </View>
        </View>

        <View className="mt-3 flex-row items-center justify-between">
          <View>
            <Text className="text-xs text-text_color_4">Mã hoàn tiền</Text>
            <View className="flex-row items-center gap-2">
              <Text className="font-medium text-sm text-primary_color">
                #{item.code}
              </Text>
              <Pressable onPress={() => handleCopyCode(item.code)}>
                <Ionicons
                  name="copy-outline"
                  size={14}
                  color="#f97316"
                />
              </Pressable>
            </View>
          </View>
          <View className="items-end">
            <Text className="text-xs text-text_color_4">Số tiền hoàn</Text>
            <Text className="font-bold text-lg text-[#dc2626]">
              -{formatCurrencyVND(item.amount)}
            </Text>
          </View>
        </View>

        {item.reason && (
          <View className="mt-3 rounded-[12px] bg-background_color px-3 py-2">
            <Text className="text-xs text-text_color_4">Lý do</Text>
            <Text className="mt-1 text-sm text-primary_color">
              {item.reason}
            </Text>
          </View>
        )}

        <View className="mt-3 flex-row items-center justify-between">
          <View>
            <Text className="text-xs text-text_color_4">Ngày hoàn tiền</Text>
            <Text className="text-sm text-primary_color">
              {formatDate(item.refundedAt)}
            </Text>
          </View>
          {item.company?.companyName && (
            <View className="items-end">
              <Text className="text-xs text-text_color_4">Nhà xe</Text>
              <Text className="text-sm text-primary_color">
                {item.company.companyName}
              </Text>
            </View>
          )}
        </View>

        {item.payment && (
          <View className="mt-2 flex-row items-center gap-2">
            <Text className="text-xs text-text_color_4">
              Mã thanh toán gốc:
            </Text>
            <Text className="text-xs text-secondary_color">
              #{item.payment.code}
            </Text>
          </View>
        )}
      </View>
    );
  };

  const renderHeader = () => (
    <View className="mb-4">
      <View className="flex-row items-center justify-between">
        <Text className="font-semibold text-lg text-primary_color">
          Hóa đơn hoàn tiền
        </Text>
        <Text className="text-sm text-text_color_4">
          {query.data?.total ?? 0} yêu cầu
        </Text>
      </View>
      <Text className="mt-1 text-sm text-text_color_4">
        Theo dõi trạng thái hoàn tiền cho các giao dịch đã hủy.
      </Text>

      {/* Filter tabs */}
      <View className="mt-4 flex-row gap-2">
        {[
          { value: "", label: "Tất cả" },
          { value: "SUCCESS", label: "Thành công" },
          { value: "PENDING", label: "Đang xử lý" },
          { value: "REJECTED", label: "Từ chối" },
        ].map((filter) => (
          <Pressable
            key={filter.value}
            className={`rounded-full px-3 py-2 ${
              status === filter.value
                ? "bg-secondary_color"
                : "bg-white_color"
            }`}
            onPress={() => {
              setStatus(filter.value);
              setPage(1);
            }}
          >
            <Text
              className={`text-xs font-medium ${
                status === filter.value
                  ? "text-white_color"
                  : "text-primary_color"
              }`}
            >
              {filter.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );

  const renderFooter = () => {
    if (!query.data || query.data.totalPages <= 1) return null;

    return (
      <View className="flex-row items-center justify-center gap-4 py-4">
        <Pressable
          className={`rounded-full bg-white_color px-4 py-2 ${
            page <= 1 ? "opacity-50" : ""
          }`}
          onPress={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page <= 1}
        >
          <Ionicons name="chevron-back" size={20} color="#f97316" />
        </Pressable>
        <Text className="text-sm text-text_color_4">
          Trang {page} / {query.data.totalPages}
        </Text>
        <Pressable
          className={`rounded-full bg-white_color px-4 py-2 ${
            page >= (query.data.totalPages ?? 1) ? "opacity-50" : ""
          }`}
          onPress={() => setPage((p) => p + 1)}
          disabled={page >= (query.data.totalPages ?? 1)}
        >
          <Ionicons name="chevron-forward" size={20} color="#f97316" />
        </Pressable>
      </View>
    );
  };

  const renderEmpty = () => (
    <View className="items-center py-10">
      <Ionicons name="receipt-outline" size={48} color="#d1d5db" />
      <Text className="mt-3 font-medium text-base text-primary_color">
        Không có yêu cầu hoàn tiền nào
      </Text>
      <Text className="mt-1 text-sm text-text_color_4">
        Các yêu cầu hoàn tiền sẽ hiển thị tại đây
      </Text>
    </View>
  );

  if (query.isLoading && !query.data) {
    return (
      <View className="flex-1 items-center justify-center bg-background_color">
        <ActivityIndicator color="#f5a623" />
        <Text className="mt-3 text-sm text-text_color_4">
          Đang tải lịch sử hoàn tiền...
        </Text>
      </View>
    );
  }

  if (query.isError) {
    return (
      <View className="flex-1 bg-background_color px-5 pt-10">
        <StateBlock
          actionLabel="Thử lại"
          description="Không thể tải lịch sử hoàn tiền. Vui lòng thử lại."
          onActionPress={() => void query.refetch()}
          title="Lỗi tải dữ liệu"
        />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background_color px-5 pt-10">
      {/* Header */}
      <View className="mb-4 flex-row items-center gap-3">
        <Pressable
          className="rounded-full bg-white_color p-2"
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#f97316" />
        </Pressable>
        <Text className="font-bold text-xl text-primary_color">
          Hóa đơn hoàn tiền
        </Text>
      </View>

      <FlatList
        data={query.data?.items ?? []}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      />

      {/* Info note */}
      <View className="mb-5 rounded-[16px] bg-[#fef3c7] p-4">
        <View className="flex-row items-start gap-3">
          <Ionicons name="information-circle" size={20} color="#92400e" />
          <View className="flex-1">
            <Text className="font-medium text-sm text-[#92400e]">
              Lưu ý về hoàn tiền
            </Text>
            <Text className="mt-1 text-xs text-[#92400e]">
              Thời gian xử lý hoàn tiền thông thường từ 3-7 ngày làm việc.
              Đối với thanh toán qua PayOS, tiền sẽ được hoàn vào tài khoản
              thanh toán trong vòng 3-5 ngày làm việc.
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

import { router } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useInvoiceSummaryQuery, usePaymentInvoicesQuery } from "@/modules/profile/hooks";
import type { PaymentInvoice } from "@/modules/profile/types";
import { StateBlock } from "@/shared/components";

const formatCurrency = (value?: number | string) => {
  const numValue = typeof value === "string" ? parseFloat(value) : (value ?? 0);
  return new Intl.NumberFormat("vi-VN").format(numValue);
};

const STATUS_CONFIG: Record<string, { color: string; bg: string; label: string }> = {
  SUCCESS: { color: "#15803d", bg: "#dcfce7", label: "Thành công" },
  PENDING: { color: "#854d0e", bg: "#fef9c3", label: "Đang xử lý" },
  FAILED: { color: "#991b1b", bg: "#fee2e2", label: "Thất bại" },
};

const METHOD_DISPLAY: Record<string, string> = {
  PAYYOS: "PayOS (VietQR)",
  MOMO: "MoMo",
  ZALOPAY: "ZaloPay",
  BANK_TRANSFER: "Chuyển khoản",
  CASH: "Tiền mặt",
  Card: "Thẻ",
};

export function ProfilePaymentHistory() {
  const [page, setPage] = useState(1);
  const limit = 20;

  const summaryQuery = useInvoiceSummaryQuery();
  const invoicesQuery = usePaymentInvoicesQuery({ page, limit });

  const summary = summaryQuery.data;
  const invoices = invoicesQuery.data?.items ?? [];
  const total = invoicesQuery.data?.total ?? 0;
  const totalPages = invoicesQuery.data?.totalPages ?? 1;

  const handleGoBack = useCallback(() => {
    router.back();
  }, []);

  const renderHeader = () => (
    <View className="mb-4">
      <View className="rounded-2xl bg-primary_color p-5">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-sm uppercase tracking-wide text-[#8dc7e3]">
              Hồ sơ
            </Text>
            <Text className="mt-1 text-xl font-bold text-white_color">
              Hóa đơn thanh toán
            </Text>
            <Text className="mt-1 text-sm text-white/60">
              {total} hóa đơn
            </Text>
          </View>
          <View className="rounded-full bg-amber/20 px-3 py-1">
            <Text className="text-sm font-semibold text-amber">
              {total} vé
            </Text>
          </View>
        </View>
      </View>

      <View className="mt-4 flex-row gap-3">
        <View className="flex-1 rounded-2xl bg-white_color p-4">
          <View className="mb-3 h-10 w-10 items-center justify-center rounded-xl bg-green-100">
            <Ionicons name="wallet" size={20} color="#15803d" />
          </View>
          <Text className="text-xs font-medium uppercase tracking-wide text-text_color_4">
            Tổng chi tiêu
          </Text>
          <Text className="mt-1 text-lg font-bold text-primary_color">
            {summaryQuery.isLoading ? (
              <ActivityIndicator size="small" color="#f5a623" />
            ) : (
              formatCurrency(summary?.totalSpent ?? 0)
            )}
          </Text>
        </View>

        <View className="flex-1 rounded-2xl bg-white_color p-4">
          <View className="mb-3 h-10 w-10 items-center justify-center rounded-xl bg-secondary_color/10">
            <Ionicons name="receipt" size={20} color="#f5a623" />
          </View>
          <Text className="text-xs font-medium uppercase tracking-wide text-text_color_4">
            Tổng thanh toán
          </Text>
          <Text className="mt-1 text-lg font-bold text-primary_color">
            {summaryQuery.isLoading ? (
              <ActivityIndicator size="small" color="#f5a623" />
            ) : (
              `${summary?.totalPayments ?? 0} giao dịch`
            )}
          </Text>
        </View>

        <View className="flex-1 rounded-2xl bg-white_color p-4">
          <View className="mb-3 h-10 w-10 items-center justify-center rounded-xl bg-amber/10">
            <Ionicons name="time" size={20} color="#b45309" />
          </View>
          <Text className="text-xs font-medium uppercase tracking-wide text-text_color_4">
            Chờ hoàn tiền
          </Text>
          <Text className="mt-1 text-lg font-bold text-primary_color">
            {summaryQuery.isLoading ? (
              <ActivityIndicator size="small" color="#f5a623" />
            ) : (
              `${summary?.pendingRefunds ?? 0} yêu cầu`
            )}
          </Text>
        </View>
      </View>
    </View>
  );

  const renderInvoiceItem = ({ item }: { item: PaymentInvoice }) => {
    const statusConfig = STATUS_CONFIG[item.status] ?? STATUS_CONFIG.PENDING;
    const methodDisplay = METHOD_DISPLAY[item.method] ?? item.methodDisplay ?? item.method;

    return (
      <TouchableOpacity
        className="mb-3 rounded-2xl bg-white_color p-4"
        activeOpacity={0.7}
      >
        <View className="mb-3 flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <Text className="font-mono text-sm font-semibold text-primary_color">
              {item.code}
            </Text>
            <TouchableOpacity onPress={() => {}}>
              <Ionicons name="copy-outline" size={14} color="#6b7280" />
            </TouchableOpacity>
          </View>
          <View
            className="rounded-full px-3 py-1"
            style={{ backgroundColor: statusConfig.bg }}
          >
            <Text
              className="text-xs font-semibold"
              style={{ color: statusConfig.color }}
            >
              {statusConfig.label}
            </Text>
          </View>
        </View>

        <View className="mb-3 flex-row items-center gap-2">
          {item.trip?.departure && item.trip?.arrival ? (
            <>
              <Text className="text-sm font-semibold text-primary_color">
                {item.trip.departure}
              </Text>
              <Text className="text-sm text-amber">→</Text>
              <Text className="text-sm font-semibold text-primary_color">
                {item.trip.arrival}
              </Text>
            </>
          ) : (
            <Text className="text-sm text-text_color_4">-</Text>
          )}
        </View>

        {item.trip?.date && (
          <Text className="mb-3 text-xs text-text_color_4">
            {item.trip.date}
            {item.trip?.time && ` • ${item.trip.time}`}
          </Text>
        )}

        <View className="flex-row items-center justify-between border-t border-border_color pt-3">
          <View className="flex-row items-center gap-2">
            <Text className="rounded-full bg-secondary_color/10 px-2 py-1 text-xs font-semibold text-secondary_color">
              {methodDisplay}
            </Text>
            {item.company?.companyName && (
              <Text className="text-xs text-text_color_4">
                • {item.company.companyName}
              </Text>
            )}
          </View>
          <Text className="text-base font-bold text-primary_color">
            {formatCurrency(item.amount)}
          </Text>
        </View>

        {item.paidAt && (
          <Text className="mt-2 text-xs text-text_color_4">
            Thanh toán: {new Date(item.paidAt).toLocaleDateString("vi-VN", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  const renderEmpty = () => (
    <View className="mt-8 items-center">
      <Ionicons name="receipt-outline" size={64} color="#d1d5db" />
      <Text className="mt-4 text-center text-base font-semibold text-text_color_4">
        Không có hóa đơn thanh toán nào
      </Text>
    </View>
  );

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    return (
      <View className="mt-4 flex-row items-center justify-between pb-4">
        <Text className="text-sm text-text_color_4">
          Trang {page} / {totalPages}
        </Text>
        <View className="flex-row gap-2">
          <TouchableOpacity
            className={`rounded-full px-4 py-2 ${page <= 1 ? "bg-border_color" : "bg-secondary_color"}`}
            onPress={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
          >
            <Text className={`font-medium ${page <= 1 ? "text-text_color_4" : "text-white_color"}`}>
              ← Trước
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`rounded-full px-4 py-2 ${page >= totalPages ? "bg-border_color" : "bg-secondary_color"}`}
            onPress={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
          >
            <Text className={`font-medium ${page >= totalPages ? "text-text_color_4" : "text-white_color"}`}>
              Sau →
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (invoicesQuery.isError) {
    return (
      <SafeAreaView className="flex-1 bg-background_color">
        <View className="flex-1 p-4">
          <StateBlock
            actionLabel="Thử lại"
            description="Không thể tải danh sách hóa đơn. Vui lòng thử lại."
            onActionPress={() => void invoicesQuery.refetch()}
            title="Lỗi tải hóa đơn"
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background_color">
      <View className="flex-1 p-4">
        <ScrollView showsVerticalScrollIndicator={false}>
          {renderHeader()}

          {invoicesQuery.isLoading ? (
            <View className="items-center py-10">
              <ActivityIndicator size="large" color="#f5a623" />
            </View>
          ) : invoices.length === 0 ? (
            renderEmpty()
          ) : (
            <>
              <FlatList
                data={invoices}
                keyExtractor={(item) => String(item.id)}
                renderItem={renderInvoiceItem}
                scrollEnabled={false}
                contentContainerStyle={{ paddingBottom: 16 }}
              />
              {renderPagination()}
            </>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

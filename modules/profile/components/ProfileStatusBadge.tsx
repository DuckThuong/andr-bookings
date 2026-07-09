import { Text, View } from "react-native";
import { useBookingStatuses } from "@/modules/profile/useBookingStatuses";

export function ProfileStatusBadge({ status }: { status: string }) {
  const { getBookingStatusMeta } = useBookingStatuses();
  const meta = getBookingStatusMeta(status);
  const colors = meta ?? { bg: "#f1f5f9", color: "#64748b", label: status };

  return (
    <View
      className="rounded-full px-3 py-1"
      style={{ backgroundColor: colors.bg }}
    >
      <Text className="font-medium text-xs" style={{ color: colors.color }}>
        {colors.label}
      </Text>
    </View>
  );
}

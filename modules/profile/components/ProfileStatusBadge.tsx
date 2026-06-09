import { Text, View } from "react-native";
import { STATUS_COLORS } from "@/modules/profile/constants";
import type { ProfileBookingStatus } from "@/modules/profile/types";

export function ProfileStatusBadge({ status }: { status: ProfileBookingStatus }) {
  const colors = STATUS_COLORS[status];

  return (
    <View
      className="rounded-full px-3 py-1"
      style={{ backgroundColor: colors.bg }}
    >
      <Text className="font-medium text-xs" style={{ color: colors.color }}>
        {status}
      </Text>
    </View>
  );
}

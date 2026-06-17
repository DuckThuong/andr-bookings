import { router, useFocusEffect, Link } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/modules/auth";
import {
  ProfileAccountForm,
  ProfileBookings,
  ProfileOverview,
  ProfileSettings,
  ProfileTracking,
} from "@/modules/profile/components";
import { PROFILE_TABS } from "@/modules/profile/constants";
import {
  mergeBookingUpdate,
  useMyBookingQuery,
  useMyBookingsQuery,
  useProfileQuery,
  useUpdateBookingPassengerMutation,
  useUpdateProfileMutation,
} from "@/modules/profile/hooks";
import type { ProfileTabKey } from "@/modules/profile/types";
import { StateBlock } from "@/shared/components";

export default function ProfileTab() {
  const { signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<ProfileTabKey>("overview");
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);

  const profileQuery = useProfileQuery();
  const user = profileQuery.data;
  const contactEmail = user?.userEmail ?? "";

  const bookingsQuery = useMyBookingsQuery(contactEmail);
  const bookings = bookingsQuery.data ?? [];

  const selectedNumericId = selectedBookingId ? Number(selectedBookingId) : null;
  const bookingDetailQuery = useMyBookingQuery(selectedNumericId, contactEmail);

  const updateProfileMutation = useUpdateProfileMutation();
  const updateBookingMutation = useUpdateBookingPassengerMutation();

  useFocusEffect(
    useCallback(() => {
      let ignore = false;

      const doFetch = async () => {
        if (!ignore) {
          await Promise.all([
            profileQuery.refetch(),
            bookingsQuery.refetch(),
          ]);
        }
      };

      void doFetch();

      return () => {
        ignore = true;
      };
    }, []),
  );

  useEffect(() => {
    if (!bookings.length) {
      setSelectedBookingId(null);
      return;
    }

    if (
      !selectedBookingId ||
      !bookings.some((booking) => booking.id === selectedBookingId)
    ) {
      setSelectedBookingId(bookings[0].id);
    }
  }, [bookings, selectedBookingId]);

  const activeBooking =
    bookingDetailQuery.data ??
    bookings.find((booking) => booking.id === selectedBookingId) ??
    null;

  const handleSignOut = () => {
    void signOut().then(() => router.replace("/(auth)/login" as never));
  };

  const renderContent = () => {
    if (profileQuery.isLoading && activeTab !== "settings") {
      return (
        <View className="items-center rounded-[28px] bg-white_color px-5 py-10">
          <ActivityIndicator color="#f5a623" />
          <Text className="mt-3 text-sm text-text_color_4">
            Đang tải hồ sơ...
          </Text>
        </View>
      );
    }

    if (profileQuery.isError && activeTab !== "settings") {
      return (
        <StateBlock
          actionLabel="Thử lại"
          description="Không thể tải thông tin tài khoản. Vui lòng thử lại."
          onActionPress={() => void profileQuery.refetch()}
          title="Lỗi tải hồ sơ"
        />
      );
    }

    switch (activeTab) {
      case "overview":
        return (
          <ProfileOverview
            bookings={bookings}
            onEditProfile={() => setActiveTab("account")}
            onViewTracking={() => setActiveTab("tracking")}
            onViewTrips={() => setActiveTab("trips")}
            user={user}
          />
        );
      case "account":
        return (
          <ProfileAccountForm
            loading={updateProfileMutation.isPending}
            onSave={(payload) => updateProfileMutation.mutate(payload)}
            user={user}
          />
        );
      case "trips":
        return (
          <ProfileBookings
            bookings={bookings}
            isDetailLoading={bookingDetailQuery.isFetching}
            isLoading={bookingsQuery.isLoading}
            onSave={(values) => {
              if (!activeBooking?.canEdit) return;
              updateBookingMutation.mutate({
                holdCode: activeBooking.holdCode,
                passenger: mergeBookingUpdate(activeBooking, values),
              });
            }}
            onSelect={setSelectedBookingId}
            saving={updateBookingMutation.isPending}
            selectedBooking={activeBooking}
          />
        );
      case "tracking":
        return <ProfileTracking bookings={bookings} />;
      case "settings":
        return <ProfileSettings onSignOut={handleSignOut} />;
      default:
        return null;
    }
  };

  const initials = user?.userName?.trim().charAt(0).toUpperCase() || "K";

  return (
    <SafeAreaView className="flex-1 bg-background_color">
      <ScrollView contentContainerStyle={{ padding: 20, gap: 16 }}>
        <View className="rounded-[32px] bg-primary_color px-5 py-6">
          <View className="flex-row items-center gap-4">
            <View className="h-16 w-16 items-center justify-center rounded-2xl bg-white/15">
              <Text className="font-bold text-2xl text-white_color">{initials}</Text>
            </View>
            <View className="flex-1">
              <Text className="text-sm uppercase tracking-[1px] text-[#8dc7e3]">
                Tài khoản
              </Text>
              <Text className="mt-1 font-bold text-[24px] text-white_color">
                {user?.userName || "Khách"}
              </Text>
              <Text className="mt-1 text-sm text-text_color_2">
                {user?.userPhone || "Chưa cập nhật"}
              </Text>
              <View className="mt-2 self-start rounded-full bg-[#fef9c3] px-3 py-1">
                <Text className="font-medium text-xs text-[#854d0e]">
                  {`Thành viên ${user?.rank || "Chưa xếp hạng"}`}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row gap-2">
            {PROFILE_TABS.map((tab) => {
              const isActive = activeTab === tab.key;

              return (
                <Pressable
                  key={tab.key}
                  className={`rounded-full px-4 py-3 ${isActive ? "bg-secondary_color" : "bg-white_color"
                    }`}
                  onPress={() => setActiveTab(tab.key)}
                >
                  <Text
                    className={`font-medium text-sm ${isActive ? "text-white_color" : "text-primary_color"
                      }`}
                  >
                    {tab.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>

        {renderContent()}
      </ScrollView>
    </SafeAreaView>
  );
}

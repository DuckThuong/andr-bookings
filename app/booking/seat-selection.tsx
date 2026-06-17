import { useState, useEffect, useMemo, useCallback } from "react";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import {
  ProgressSteps,
  SeatMap,
  AddonItem,
  PromoSection,
  PolicyCard,
  OperatorCard,
} from "@/modules/booking/components";
import {
  useSeatSelectionQuery,
  useValidatePromoMutation,
  useCreateHoldMutation,
} from "@/modules/booking/hooks";
import type {
  VehicleType,
  CreateHoldAddonLine,
} from "@/modules/booking/types";
import { AppButton } from "@/shared/components";

function buildHoldAddons(
  addonServices: any[],
  addons: Set<string>,
  pickupQty: number,
): CreateHoldAddonLine[] {
  return addonServices
    .filter((a) => addons.has(a.id) && (!a.hasQty || pickupQty > 0))
    .map((a) => ({
      id: a.id,
      name: a.name,
      price: a.price,
      ...(a.hasQty ? { qty: pickupQty } : {}),
    }));
}

function calcAddonsTotal(
  addonServices: any[],
  addons: Set<string>,
  pickupQty: number,
  pickupPrice: number,
): number {
  return (
    addonServices
      .filter((a) => !a.hasQty && addons.has(a.id))
      .reduce((s, a) => s + a.price, 0) +
    pickupQty * pickupPrice
  );
}

export default function SeatSelectionScreen() {
  const navigation = useNavigation();
  const params = useLocalSearchParams<{
    tripId?: string;
    date?: string;
    from?: string;
    to?: string;
  }>();

  const tripId = params.tripId;
  const searchDate = params.date;

  const [vehicleType, setVehicleType] = useState<VehicleType>("16");
  const [floor, setFloor] = useState<1 | 2>(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [addons, setAddons] = useState<Set<string>>(new Set());
  const [pickupQty, setPickupQty] = useState(0);
  const [promoCode, setPromoCode] = useState<string | null>(null);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [defaultsApplied, setDefaultsApplied] = useState(false);

  const { data, isLoading, isError, error } = useSeatSelectionQuery(tripId, searchDate);
  const validatePromoMutation = useValidatePromoMutation();
  const holdMutation = useCreateHoldMutation();

  useEffect(() => {
    if (!data || defaultsApplied) return;
    setVehicleType(data.defaultVehicleType || "16");
    setFloor(data.defaultFloor === 2 ? 2 : 1);
    setDefaultsApplied(true);
  }, [data, defaultsApplied]);

  const pageData = data?.pageData;
  const catalog = data?.catalog;
  const vehicles = data?.vehicles;
  const cfg = vehicles?.[vehicleType];
  const maxSeats = data?.meta?.maxSeatsPerBooking ?? 4;
  const unitPrice = data?.meta?.unitPrice ?? 0;
  const feeRate = data?.meta?.feeRate ?? 0.05;
  const pickupPrice = data?.meta?.pickupAddonUnitPrice ?? 50000;
  const holdSeconds = data?.meta?.holdSecondsDefault ?? 600;

  const addonServices = catalog?.addonServices ?? [];
  const promoCodes = catalog?.promoCodes ?? [];
  const policies = catalog?.policies ?? [];

  const seatLayout = useMemo(
    () => cfg?.layouts?.[String(floor)] ?? [],
    [cfg, floor],
  );

  const toggleSeat = useCallback(
    (id: string) => {
      setSelected((prev) => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else if (next.size < maxSeats) next.add(id);
        return next;
      });
    },
    [maxSeats],
  );

  const handleVehicleChange = (v: VehicleType) => {
    setVehicleType(v);
    setFloor(1);
    setSelected(new Set());
  };

  const toggleAddon = (id: string) =>
    setAddons((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const changePickupQty = (d: number) =>
    setPickupQty((q) => Math.max(0, Math.min(maxSeats, q + d)));

  const handleApplyPromo = useCallback(
    async (code: string) => {
      if (!code) {
        setPromoCode(null);
        setPromoDiscount(0);
        return;
      }

      const subTotal = selected.size * unitPrice;
      const addonsTotal = calcAddonsTotal(addonServices, addons, pickupQty, pickupPrice);

      try {
        const res = await validatePromoMutation.mutateAsync({
          promoCode: code,
          subTotal,
          addonsTotal,
          tripId: pageData?.trip?.tripId ?? tripId,
        });

        if (res.valid) {
          setPromoCode(res.promoCode);
          setPromoDiscount(res.promoDiscount);
        } else {
          setPromoCode(null);
          setPromoDiscount(0);
          Alert.alert("Lỗi", res.message ?? "Mã khuyến mãi không hợp lệ");
        }
      } catch (err: any) {
        setPromoCode(null);
        setPromoDiscount(0);
        const msg = err?.response?.data?.message ?? "Lỗi xác thực mã";
        Alert.alert("Lỗi", Array.isArray(msg) ? msg[0] : msg);
      }
    },
    [selected.size, unitPrice, addonServices, addons, pickupQty, pickupPrice, pageData, tripId, validatePromoMutation],
  );

  const handleProceedToConfirm = async () => {
    const seatIds = [...selected];
    if (!pageData || seatIds.length === 0) return;

    const confirmSeats = seatIds.map((id) => ({ id, label: id }));
    const confirmAddons = addonServices
      .filter((addon) => addons.has(addon.id) && (!addon.hasQty || pickupQty > 0))
      .map((addon) => ({
        id: addon.id,
        icon: addon.icon,
        name: addon.name,
        price: addon.hasQty ? addon.price * pickupQty : addon.price,
      }));

    try {
      const result = await holdMutation.mutateAsync({
        tripId: pageData.trip?.tripId ?? tripId!,
        vehicleType,
        floor,
        seatIds,
        addons: buildHoldAddons(addonServices, addons, pickupQty),
        promoCode: promoCode ?? undefined,
        holdDurationSeconds: holdSeconds,
      });

      router.push({
        pathname: "/booking/info",
        params: {
          holdId: result.holdId,
          tripId: pageData.trip?.tripId ?? tripId!,
          seats: JSON.stringify(confirmSeats),
          addons: JSON.stringify(confirmAddons),
          pricing: JSON.stringify(result.pricing),
          holdSeconds: String(result.holdSeconds),
          pageData: JSON.stringify(pageData),
        },
      });
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? "Lỗi giữ ghế";
      const conflictSeats = err?.response?.data?.conflictSeats;
      Alert.alert("Lỗi", Array.isArray(msg) ? msg[0] : msg);

      if (conflictSeats?.length) {
        setSelected((prev) => {
          const next = new Set(prev);
          for (const id of conflictSeats) next.delete(id);
          return next;
        });
      }
    }
  };

  if (!tripId) {
    return (
      <SafeAreaView className="flex-1 bg-background_color items-center justify-center">
        <Text className="text-gray-500">Không có thông tin chuyến</Text>
        <Pressable className="mt-4" onPress={() => router.back()}>
          <Text className="text-secondary_color">Quay lại</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-background_color items-center justify-center">
        <ActivityIndicator size="large" color="#f5a623" />
        <Text className="mt-3 text-sm text-gray-500">Đang tải...</Text>
      </SafeAreaView>
    );
  }

  if (isError || !pageData || !cfg) {
    return (
      <SafeAreaView className="flex-1 bg-background_color items-center justify-center">
        <Ionicons name="alert-circle" size={48} color="#ef4444" />
        <Text className="mt-3 text-gray-600">Không thể tải thông tin</Text>
        <Pressable className="mt-4" onPress={() => router.back()}>
          <Text className="text-secondary_color">Quay lại</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const seats = [...selected];
  const subTotal = seats.length * unitPrice;
  const fee = Math.round(subTotal * feeRate);
  const addonsTotal = calcAddonsTotal(addonServices, addons, pickupQty, pickupPrice);
  const total = Math.max(0, subTotal + fee + addonsTotal - promoDiscount);

  const vehicleEntries = Object.entries(vehicles ?? {}) as [VehicleType, any][];

  return (
    <SafeAreaView className="flex-1 bg-background_color">
      <ProgressSteps activeIdx={0} />

      <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
        {/* Trip Info Bar */}
        <View className="rounded-2xl bg-white p-4">
          <View className="mb-2 flex-row items-center justify-between">
            <Text className="font-bold text-lg text-primary_color">
              {pageData.trip?.from} → {pageData.trip?.to}
            </Text>
            <Text className="font-semibold text-secondary_color">
              {unitPrice.toLocaleString()}đ/ghế
            </Text>
          </View>
          <View className="flex-row gap-4">
            <Text className="text-sm text-gray-500">
              {pageData.trip?.operatorName}
            </Text>
            <Text className="text-sm text-gray-500">
              {pageData.trip?.departTime} → {pageData.trip?.arriveTime}
            </Text>
          </View>
        </View>

        {/* Vehicle Tabs */}
        {vehicleEntries.length > 1 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row gap-2">
              {vehicleEntries.map(([key, v]) => (
                <Pressable
                  key={key}
                  className={`rounded-full px-4 py-2 ${
                    vehicleType === key ? "bg-secondary_color" : "bg-white"
                  }`}
                  onPress={() => handleVehicleChange(key)}
                >
                  <Text
                    className={`font-medium ${
                      vehicleType === key ? "text-white" : "text-primary_color"
                    }`}
                  >
                    {v.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </ScrollView>
        )}

        {/* Floor Tabs */}
        {cfg.floors > 1 && (
          <View className="flex-row gap-2">
            {([1, 2] as const).map((f) => (
              <Pressable
                key={f}
                className={`flex-1 rounded-xl py-3 ${
                  floor === f ? "bg-secondary_color" : "bg-white"
                }`}
                onPress={() => {
                  setFloor(f);
                  setSelected(new Set());
                }}
              >
                <Text
                  className={`text-center font-medium ${
                    floor === f ? "text-white" : "text-primary_color"
                  }`}
                >
                  {f === 1 ? "Tầng dưới" : "Tầng trên"}
                </Text>
              </Pressable>
            ))}
          </View>
        )}

        {/* Seat Map */}
        <SeatMap
          layout={seatLayout}
          selected={selected}
          isSleeper={cfg.isSleeper}
          onToggle={toggleSeat}
        />

        {/* Operator Card */}
        {data.operator && <OperatorCard operator={data.operator} />}

        {/* Addons */}
        {addonServices.length > 0 && (
          <View className="rounded-2xl bg-white p-4">
            <Text className="mb-3 font-semibold text-primary_color">
              Dịch vụ đi kèm
            </Text>
            {addonServices.map((addon) => (
              <AddonItem
                key={addon.id}
                addon={addon}
                selected={addons.has(addon.id)}
                qty={addon.hasQty ? pickupQty : undefined}
                onToggle={toggleAddon}
                onChangeQty={addon.hasQty ? changePickupQty : undefined}
              />
            ))}
          </View>
        )}

        {/* Promo */}
        <PromoSection
          promoCodes={promoCodes}
          applied={promoCode}
          validating={validatePromoMutation.isPending}
          onApplyCode={handleApplyPromo}
        />

        {/* Policies */}
        <PolicyCard policies={policies} />

        {/* Summary Card */}
        <View className="rounded-2xl bg-white p-4">
          <Text className="mb-3 font-semibold text-primary_color">
            Thông tin đặt vé
          </Text>

          {/* Selected Seats */}
          <View className="mb-3">
            <Text className="mb-2 text-sm text-gray-500">Ghế đã chọn</Text>
            {seats.length === 0 ? (
              <Text className="text-sm text-gray-400">Chưa chọn ghế nào</Text>
            ) : (
              <View className="flex-row flex-wrap gap-2">
                {seats.map((id, idx) => (
                  <Pressable
                    key={`selected-seat-${idx}-${id}`}
                    className="rounded-lg bg-secondary_color px-3 py-1"
                    onPress={() => toggleSeat(id)}
                  >
                    <Text className="text-sm font-medium text-white">{id}</Text>
                  </Pressable>
                ))}
              </View>
            )}
          </View>

          {/* Price Breakdown */}
          <View className="border-t border-gray-100 pt-3">
            <View className="mb-2 flex-row justify-between">
              <Text className="text-gray-500">Giá vé ({seats.length} ghế)</Text>
              <Text className="font-medium">
                {seats.length ? subTotal.toLocaleString() : 0}đ
              </Text>
            </View>
            {addonsTotal > 0 && (
              <View className="mb-2 flex-row justify-between">
                <Text className="text-gray-500">Dịch vụ bổ sung</Text>
                <Text className="font-medium">
                  {addonsTotal.toLocaleString()}đ
                </Text>
              </View>
            )}
            <View className="mb-2 flex-row justify-between">
              <Text className="text-gray-500">Phí dịch vụ (5%)</Text>
              <Text className="font-medium">{fee.toLocaleString()}đ</Text>
            </View>
            {promoDiscount > 0 && (
              <View className="mb-2 flex-row justify-between">
                <Text className="text-green-600">
                  Giảm giá ({promoCode})
                </Text>
                <Text className="font-medium text-green-600">
                  −{promoDiscount.toLocaleString()}đ
                </Text>
              </View>
            )}
            <View className="flex-row justify-between border-t border-gray-200 pt-3">
              <Text className="font-semibold text-primary_color">Tổng cộng</Text>
              <Text className="text-xl font-bold text-secondary_color">
                {seats.length ? total.toLocaleString() : 0}đ
              </Text>
            </View>
          </View>

          <AppButton
            label={holdMutation.isPending ? "Đang giữ ghế..." : "Xác nhận đặt vé"}
            onPress={handleProceedToConfirm}
            disabled={seats.length === 0 || holdMutation.isPending}
            className="mt-4"
          />
          <Text className="mt-2 text-center text-xs text-gray-400">
            Bạn có {Math.round(holdSeconds / 60)} phút để hoàn tất thanh toán
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

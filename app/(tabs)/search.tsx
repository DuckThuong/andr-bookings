import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  filterOptions,
  seatTypeOptions,
  sortOptions,
  type FilterKey,
  type SearchTrip,
  type SearchTripsParams,
  type SeatType,
  type SortKey,
  useTripSearchQuery,
} from "@/modules/search";
import {
  AppButton,
  DatePickerField,
  FormNumber,
  FormText,
  StateBlock,
} from "@/shared/components";
import { getApiErrorMessage } from "@/shared/utils/api";
import { formatDateValue } from "@/shared/utils/date";

type SearchFormValues = {
  fromCity: string;
  toCity: string;
  passengers: string;
  date: Date | null;
  seatType: SeatType;
};

const PAGE_SIZE = 10;

export default function SearchTab() {
  const { control, handleSubmit, setValue, watch } = useForm<SearchFormValues>({
    defaultValues: {
      fromCity: "",
      toCity: "",
      passengers: "1",
      date: null,
      seatType: "all",
    },
  });
  const [submittedState, setSubmittedState] = useState<SearchFormValues | null>(
    null,
  );
  const [activeFilters, setActiveFilters] = useState<FilterKey[]>(["all"]);
  const [sortKey, setSortKey] = useState<SortKey>("price");
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const seatType = watch("seatType");

  const queryParams = useMemo<SearchTripsParams | null>(() => {
    if (!submittedState) {
      return null;
    }

    return {
      fromCity: submittedState.fromCity,
      toCity: submittedState.toCity,
      date: submittedState.date
        ? formatDateValue(submittedState.date)
        : undefined,
      passengers: Number(submittedState.passengers || "1"),
      seatType: submittedState.seatType,
      filters:
        activeFilters.includes("all") ? undefined : activeFilters.join(","),
      sortKey,
      page: 1,
      pageSize,
    };
  }, [activeFilters, pageSize, sortKey, submittedState]);

  const tripSearch = useTripSearchQuery(queryParams);
  const results = tripSearch.data?.trips ?? [];
  const hasMore = tripSearch.data?.meta.hasMore ?? false;
  const resultCount = tripSearch.data?.meta.resultCount ?? 0;

  const toggleFilter = (filter: FilterKey) => {
    setPageSize(PAGE_SIZE);

    if (filter === "all") {
      setActiveFilters(["all"]);
      return;
    }

    setActiveFilters((current) => {
      const next = current.filter((item) => item !== "all");

      if (next.includes(filter)) {
        const reduced = next.filter((item) => item !== filter);
        return reduced.length ? reduced : ["all"];
      }

      return [...next, filter];
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-background_color">
      <FlatList
        ListEmptyComponent={
          !submittedState && !tripSearch.isLoading ? (
            <StateBlock
              description="Fill the route details and submit to load live trip results."
              title="Search is ready"
            />
          ) : submittedState && !tripSearch.isLoading && !results.length ? (
            <StateBlock
              actionLabel="Retry"
              description="No trips matched the current filters."
              onActionPress={() => void tripSearch.refetch()}
              title="No trips found"
            />
          ) : null
        }
        ListFooterComponent={
          submittedState ? (
            <View className="gap-3 py-4">
              {tripSearch.isFetching ? (
                <View className="items-center">
                  <ActivityIndicator color="#f5a623" />
                </View>
              ) : null}

              {hasMore ? (
                <AppButton
                  label="Load more trips"
                  onPress={() => setPageSize((current) => current + PAGE_SIZE)}
                />
              ) : null}
            </View>
          ) : null
        }
        ListHeaderComponent={
          <View className="gap-5 px-5 py-5">
            <View className="rounded-[32px] bg-primary_color px-5 py-6">
              <Text className="text-sm uppercase tracking-[1px] text-[#8dc7e3]">
                Trip search
              </Text>
              <Text className="mt-2 font-bold text-[28px] leading-9 text-white_color">
                Search live routes in one tab
              </Text>
              <Text className="mt-3 text-sm leading-6 text-text_color_2">
                This tab owns the full search flow, filters, sorting, and result
                states.
              </Text>
            </View>

            <View className="rounded-[28px] bg-white_color px-4 py-5">
              <Text className="mb-4 font-semibold text-lg text-primary_color">
                Search routes
              </Text>

              <View className="gap-4">
                <Controller
                  control={control}
                  name="fromCity"
                  rules={{ required: "Departure city is required." }}
                  render={({ field: { onChange, value }, fieldState }) => (
                    <FormText
                      error={fieldState.error?.message}
                      label="From"
                      onChangeText={onChange}
                      placeholder="Ha Noi"
                      value={value}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="toCity"
                  rules={{ required: "Arrival city is required." }}
                  render={({ field: { onChange, value }, fieldState }) => (
                    <FormText
                      error={fieldState.error?.message}
                      label="To"
                      onChangeText={onChange}
                      placeholder="Da Nang"
                      value={value}
                    />
                  )}
                />

                <Pressable
                  className="self-end rounded-full bg-background_color px-4 py-2"
                  onPress={() => {
                    const fromCity = watch("fromCity");
                    const toCity = watch("toCity");
                    setValue("fromCity", toCity);
                    setValue("toCity", fromCity);
                  }}
                >
                  <Text className="font-medium text-sm text-secondary_color">
                    Swap route
                  </Text>
                </Pressable>

                <Controller
                  control={control}
                  name="date"
                  rules={{ required: "Departure date is required." }}
                  render={({ field: { onChange, value }, fieldState }) => (
                    <DatePickerField
                      error={fieldState.error?.message}
                      label="Departure date"
                      minimumDate={new Date()}
                      onChange={onChange}
                      placeholder="Select departure date"
                      value={value}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="passengers"
                  rules={{ required: "Passenger count is required." }}
                  render={({ field: { onChange, value }, fieldState }) => (
                    <FormNumber
                      error={fieldState.error?.message}
                      label="Passengers"
                      onChangeText={onChange}
                      placeholder="1"
                      value={value}
                    />
                  )}
                />

                <View className="gap-2">
                  <Text className="px-1 font-medium text-sm text-primary_color">
                    Seat type
                  </Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View className="flex-row gap-2">
                      {seatTypeOptions.map((option) => {
                        const isActive = seatType === option.key;

                        return (
                          <Pressable
                            key={option.key}
                            className={`rounded-full px-4 py-3 ${
                              isActive
                                ? "bg-secondary_color"
                                : "bg-background_color"
                            }`}
                            onPress={() => setValue("seatType", option.key)}
                          >
                            <Text
                              className={`font-medium text-sm ${
                                isActive
                                  ? "text-white_color"
                                  : "text-primary_color"
                              }`}
                            >
                              {option.label}
                            </Text>
                          </Pressable>
                        );
                      })}
                    </View>
                  </ScrollView>
                </View>

                <AppButton
                  label="Search trips"
                  onPress={handleSubmit((values) => {
                    setPageSize(PAGE_SIZE);
                    setSortKey("price");
                    setActiveFilters(["all"]);
                    setSubmittedState(values);
                  })}
                />
              </View>
            </View>

            {submittedState ? (
              <View className="gap-4">
                <View className="rounded-[24px] bg-white_color px-4 py-4">
                  <Text className="font-semibold text-base text-primary_color">
                    {resultCount} trips found
                  </Text>
                  <Text className="mt-1 text-sm text-text_color_4">
                    {submittedState.fromCity} to {submittedState.toCity}
                  </Text>
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View className="flex-row gap-2">
                    {filterOptions.map((option) => {
                      const isActive = activeFilters.includes(option.key);

                      return (
                        <Pressable
                          key={option.key}
                          className={`rounded-full px-4 py-3 ${
                            isActive ? "bg-primary_color" : "bg-white_color"
                          }`}
                          onPress={() => toggleFilter(option.key)}
                        >
                          <Text
                            className={`font-medium text-sm ${
                              isActive
                                ? "text-white_color"
                                : "text-primary_color"
                            }`}
                          >
                            {option.label}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </ScrollView>

                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View className="flex-row gap-2">
                    {sortOptions.map((option) => {
                      const isActive = sortKey === option.key;

                      return (
                        <Pressable
                          key={option.key}
                          className={`rounded-full border px-4 py-3 ${
                            isActive
                              ? "border-secondary_color bg-white_color"
                              : "border-color_border bg-white_color"
                          }`}
                          onPress={() => {
                            setPageSize(PAGE_SIZE);
                            setSortKey(option.key);
                          }}
                        >
                          <Text className="font-medium text-sm text-primary_color">
                            {option.label}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </ScrollView>
              </View>
            ) : null}

            {tripSearch.isError ? (
              <StateBlock
                actionLabel="Retry"
                description={getApiErrorMessage(tripSearch.error)}
                onActionPress={() => void tripSearch.refetch()}
                title="Unable to load trips"
              />
            ) : null}
          </View>
        }
        contentContainerStyle={{ paddingBottom: 20 }}
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TripCard item={item} />}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

function TripCard({ item }: { item: SearchTrip }) {
  return (
    <View className="mx-5 mb-4 rounded-[28px] bg-white_color px-4 py-4">
      <View className="flex-row items-center justify-between">
        <View
          className="rounded-2xl px-3 py-2"
          style={{ backgroundColor: item.operator.logoColor || "#e7f0f5" }}
        >
          <Text className="font-bold text-sm text-primary_color">
            {item.operator.code}
          </Text>
        </View>
        <Text className="font-semibold text-base text-secondary_color">
          {item.price.toLocaleString()} VND
        </Text>
      </View>

      <Text className="mt-4 font-semibold text-lg text-primary_color">
        {item.departure.city} to {item.arrival.city}
      </Text>
      <Text className="mt-1 text-sm text-text_color_4">
        {item.operator.name} · {item.operator.vehicleType}
      </Text>

      <View className="mt-4 flex-row items-center justify-between">
        <View>
          <Text className="font-semibold text-base text-primary_color">
            {item.departure.time}
          </Text>
          <Text className="mt-1 text-xs text-text_color_4">
            {item.departure.station}
          </Text>
        </View>
        <View className="items-center px-3">
          <Text className="text-xs text-text_color_4">{item.duration}</Text>
          <Text className="mt-1 text-xs text-text_color_4">{item.stopLabel}</Text>
        </View>
        <View className="items-end">
          <Text className="font-semibold text-base text-primary_color">
            {item.arrival.time}
          </Text>
          <Text className="mt-1 text-right text-xs text-text_color_4">
            {item.arrival.station}
          </Text>
        </View>
      </View>

      <View className="mt-4 flex-row flex-wrap gap-2">
        {item.badges.map((badge) => (
          <View
            key={`${item.id}-${badge.label}`}
            className="rounded-full bg-background_color px-3 py-2"
          >
            <Text className="text-xs text-primary_color">{badge.label}</Text>
          </View>
        ))}
      </View>

      <View className="mt-4 flex-row items-center justify-between">
        <Text className="text-sm text-text_color_4">
          {item.seatsLeft} seats left · Rating {item.operator.rating}
        </Text>
        <View className="rounded-full bg-[#fdf1d8] px-4 py-2">
          <Text className="font-medium text-sm text-primary_color">Choose</Text>
        </View>
      </View>
    </View>
  );
}

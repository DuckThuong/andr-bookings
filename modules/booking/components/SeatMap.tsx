import { View, Text, ScrollView, Pressable } from "react-native";
import type { RowDef, SeatCellDef, SeatDef } from "../types";

interface SeatMapProps {
  layout: RowDef[];
  selected: Set<string>;
  isSleeper: boolean;
  onToggle: (id: string) => void;
}

function getSeatBgColor(seat: SeatDef, selected: boolean): string {
  if (selected) return "bg-secondary_color";
  if (seat.status === "booked") return "bg-gray-300";
  if (seat.status === "vip") return "bg-amber-400";
  return "bg-white border-2 border-gray-200";
}

function getSeatTextColor(seat: SeatDef, selected: boolean): string {
  if (selected) return "text-white";
  if (seat.status === "vip") return "text-amber-900";
  return "text-gray-700";
}

function SeatCell({
  cell,
  selected,
  onToggle,
}: {
  cell: SeatCellDef;
  selected: boolean;
  onToggle: () => void;
}) {
  if (cell.type === "aisle") {
    return (
      <View className="w-8 items-center justify-center">
        <Text className="text-xs text-gray-400">Lối đi</Text>
      </View>
    );
  }

  if (cell.type === "empty") {
    return <View className="w-12" />;
  }

  const seat = cell;
  const isBooked = seat.status === "booked";

  return (
    <Pressable
      className={`mx-1 h-12 w-12 items-center justify-center rounded-lg ${getSeatBgColor(seat, selected)}`}
      onPress={onToggle}
      disabled={isBooked}
    >
      <Text className={`text-sm font-bold ${getSeatTextColor(seat, selected)}`}>
        {seat.id}
      </Text>
    </Pressable>
  );
}

export function SeatMap({ layout, selected, isSleeper, onToggle }: SeatMapProps) {
  return (
    <View className="rounded-2xl bg-gray-50 p-4">
      {/* Legend */}
      <View className="mb-3 flex-row items-center justify-center gap-4 flex-wrap">
        <View className="flex-row items-center gap-1">
          <View className="h-4 w-4 rounded border-2 border-gray-200 bg-white" />
          <Text className="text-xs text-gray-600">Còn trống</Text>
        </View>
        <View className="flex-row items-center gap-1">
          <View className="h-4 w-4 rounded bg-secondary_color" />
          <Text className="text-xs text-gray-600">Đã chọn</Text>
        </View>
        <View className="flex-row items-center gap-1">
          <View className="h-4 w-4 rounded bg-gray-300" />
          <Text className="text-xs text-gray-600">Đã đặt</Text>
        </View>
        <View className="flex-row items-center gap-1">
          <View className="h-4 w-4 rounded bg-amber-400" />
          <Text className="text-xs text-gray-600">VIP</Text>
        </View>
      </View>

      {/* Bus layout */}
      <View className="rounded-xl border-2 border-gray-200 bg-white overflow-hidden">
        {/* Driver / Door row */}
        <View className="flex-row items-center justify-between border-b border-gray-200 bg-gray-100 px-4 py-2">
          <View className="flex-row items-center gap-2">
            <Text className="text-sm">Tài xế</Text>
          </View>
          <View className="flex-row items-center gap-2">
            <Text className="text-sm text-gray-500">Cửa lên/xuống</Text>
          </View>
        </View>

        {/* Seat rows */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="p-3">
            {layout.map((rowDef) => {
              const cells = rowDef.cells ?? [];

              return (
                <View key={rowDef.row} className="flex-row items-center mb-2">
                  {/* Row number */}
                  <Text className="w-6 text-center text-sm text-gray-400">
                    {rowDef.row}
                  </Text>

                  {/* Cells */}
                  <View className="flex-row items-center">
                    {cells.map((cell, ci) => {
                      if (cell.type === "aisle") {
                        return (
                          <View key={`aisle-${ci}`} className="w-6 items-center justify-center">
                            <Text className="text-xs text-gray-300">|</Text>
                          </View>
                        );
                      }
                      if (cell.type === "empty") {
                        return <View key={`empty-${ci}`} className="w-12" />;
                      }
                      return (
                        <SeatCell
                          key={cell.id}
                          cell={cell}
                          selected={selected.has(cell.id)}
                          onToggle={() => onToggle(cell.id)}
                        />
                      );
                    })}
                  </View>
                </View>
              );
            })}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

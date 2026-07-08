export const formatCurrencyVND = (value?: number | string): string => {
  const numValue = typeof value === "string" ? parseFloat(value) : (value ?? 0);
  return new Intl.NumberFormat("vi-VN").format(numValue);
};

export const formatDate = (
  dateString: string | null | undefined,
  options?: Intl.DateTimeFormatOptions,
): string => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    ...options,
  });
};

export const formatDateTime = (dateString: string | null | undefined): string => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

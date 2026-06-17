import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PropsWithChildren, useState, useEffect } from "react";
import { AppState, AppStateStatus } from "react-native";
import { AuthProvider } from "@/modules/auth";

export function AppProviders({ children }: PropsWithChildren) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            staleTime: 30_000,
            gcTime: 5 * 60 * 1000,
          },
        },
      }),
  );

  useEffect(() => {
    let subscription: ReturnType<typeof AppState.addEventListener> | null = null;

    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === "active") {
        void queryClient.invalidateQueries();
      }
    };

    subscription = AppState.addEventListener("change", handleAppStateChange);

    return () => {
      subscription?.remove();
    };
  }, [queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>{children}</AuthProvider>
    </QueryClientProvider>
  );
}

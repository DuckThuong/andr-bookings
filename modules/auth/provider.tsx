import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from "react";
import { login, signUp as signUpRequest } from "@/modules/auth/api";
import { authStorageService } from "@/modules/auth/storage";
import type {
  AuthContextValue,
  LoginPayload,
  SignUpPayload,
} from "@/modules/auth/types";

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    let active = true;

    const hydrate = async () => {
      const token = await authStorageService.getAccessToken();

      if (!active) {
        return;
      }

      setAccessToken(token);
      setIsHydrated(true);
    };

    void hydrate();

    const unsubscribe = authStorageService.subscribe((token) => {
      setAccessToken(token);
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      accessToken,
      isAuthenticated: Boolean(accessToken),
      isHydrated,
      async signIn(payload: LoginPayload) {
        const response = await login(payload);
        await authStorageService.setAccessToken(response.accessToken);
      },
      async signUp(payload: SignUpPayload) {
        const response = await signUpRequest(payload);
        await authStorageService.setAccessToken(response.accessToken);
      },
      async signOut() {
        await authStorageService.clearAccessToken();
      },
    }),
    [accessToken, isHydrated],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}

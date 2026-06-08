export type LoginPayload = {
  phoneNumber: string;
  password: string;
};

export type AuthResponse = {
  accessToken: string;
};

export type AuthContextValue = {
  accessToken: string | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  signIn: (payload: LoginPayload) => Promise<void>;
  signOut: () => Promise<void>;
};

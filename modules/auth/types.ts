export type LoginPayload = {
  phoneNumber: string;
  password: string;
};

export type SignUpPayload = {
  name: string;
  phone: string;
  password: string;
  confirm_password: string;
  acceptRole: number;
  email: string;
  dateOfBirth: string;
  gender: number;
};

export type SignUpFormValues = {
  name: string;
  phone: string;
  password: string;
  confirm_password: string;
  acceptRole: boolean;
  email: string;
  dateOfBirth: Date | null;
  gender: string;
};

export type AuthResponse = {
  accessToken: string;
};

export type AuthContextValue = {
  accessToken: string | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  signIn: (payload: LoginPayload) => Promise<void>;
  signUp: (payload: SignUpPayload) => Promise<void>;
  signOut: () => Promise<void>;
};

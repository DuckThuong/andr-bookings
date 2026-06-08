export type MasterPayload = {
  type: string;
  code: string;
};

export type MasterItem = {
  id: number;
  name: string;
  rule: string;
  sort: number;
  type: string;
  code: string;
};

export type HomeService = {
  id: string;
  icon: string;
  label: string;
  desc: string;
  tag?: string;
};

export type HomePromo = {
  id: string;
  title: string;
  subtitle: string;
  code: string;
  discount: string;
  expiry: string;
  bg: string;
  textColor?: string;
};

export type HomeOperator = {
  id: string;
  name: string;
  logo: string;
  rating: number;
  reviews: number;
  routes: string;
  badge?: string;
};

export type HomeTrip = {
  id: string;
  from: string;
  to: string;
  operator: string;
  operatorLogo: string;
  departure: string;
  duration: string;
  seats: number;
  price: number;
  type: string;
  rating: number;
};

export interface UserAddress {
  address: string;
  city: string;
  state?: string;
  stateCode?: string;
  postalCode: string;
  country?: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender?: string;
  image?: string;
  phone?: string;
  address?: UserAddress;
  accessToken?: string;
  refreshToken?: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  fullName: string;
  email: string;
  username?: string;
  password: string;
}

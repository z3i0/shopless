import { fetchClient } from './client';
import { User, LoginCredentials } from '@/types/user';

export interface LoginResponse {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender?: string;
  image?: string;
  accessToken: string;
  refreshToken: string;
}

export async function loginUser(credentials: LoginCredentials): Promise<User> {
  const data = await fetchClient<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      username: credentials.username.trim(),
      password: credentials.password,
      expiresInMins: 120,
    }),
  });

  // Fetch complete profile including address and phone
  let fullUser: Partial<User> = {};
  try {
    fullUser = await getCurrentUser(data.accessToken);
  } catch (err) {
    console.warn('Could not fetch full user profile, using login response:', err);
  }

  return {
    id: data.id,
    username: data.username,
    email: data.email,
    firstName: data.firstName,
    lastName: data.lastName,
    gender: data.gender,
    image: data.image,
    phone: fullUser.phone,
    address: fullUser.address,
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
  };
}

export async function getCurrentUser(token: string): Promise<User> {
  return fetchClient<User>('/auth/me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// Preset demo users for instant one-click login in the UI
export const DEMO_USERS = [
  {
    name: 'Emily Johnson',
    username: 'emilys',
    password: 'emilyspass',
    role: 'VIP Shopper',
    avatar: 'https://dummyjson.com/icon/emilys/128',
  },
  {
    name: 'Michael Williams',
    username: 'michaelw',
    password: 'michaelwpass',
    role: 'Regular Customer',
    avatar: 'https://dummyjson.com/icon/michaelw/128',
  },
];

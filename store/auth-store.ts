import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User, LoginCredentials, RegisterData } from '@/types/user';
import { loginUser } from '@/lib/api/auth';
import { toast } from 'sonner';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  login: (credentials: LoginCredentials) => Promise<boolean>;
  registerSimulated: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  updateUser: (partial: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (credentials) => {
        set({ isLoading: true });
        try {
          const user = await loginUser(credentials);
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          });
          toast.success(`Welcome back, ${user.firstName}!`);
          return true;
        } catch (error: any) {
          set({ isLoading: false });
          toast.error(error.message || 'Login failed. Please verify your credentials.');
          return false;
        }
      },

      registerSimulated: async (data) => {
        set({ isLoading: true });
        // Realistic simulated registration
        await new Promise((r) => setTimeout(r, 600));

        const newUser: User = {
          id: Math.floor(Math.random() * 9000) + 1000,
          username: data.username || data.email.split('@')[0],
          email: data.email,
          firstName: data.fullName.split(' ')[0] || data.fullName,
          lastName: data.fullName.split(' ').slice(1).join(' ') || 'Customer',
          image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(data.email)}`,
          address: {
            address: '123 Market Boulevard',
            city: 'San Francisco',
            state: 'California',
            stateCode: 'CA',
            postalCode: '94103',
            country: 'United States',
          },
          phone: '+1 (555) 019-2834',
        };

        set({
          user: newUser,
          isAuthenticated: true,
          isLoading: false,
        });

        toast.success(`Account created successfully! Welcome, ${newUser.firstName}.`);
        return true;
      },

      logout: () => {
        const currentUser = get().user;
        set({ user: null, isAuthenticated: false });
        if (currentUser) {
          toast.info(`Goodbye, ${currentUser.firstName}. You have been logged out.`);
        }
      },

      updateUser: (partial) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ user: { ...currentUser, ...partial } });
          toast.success('Profile updated successfully');
        }
      },
    }),
    {
      name: 'shopless-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

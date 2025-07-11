/* eslint-disable no-unused-vars */
import axios, { AxiosError, AxiosResponse } from 'axios';
import {
  createContext,
  type Dispatch,
  type PropsWithChildren,
  type SetStateAction,
  useEffect,
  useState
} from 'react';

import * as authHelper from '../_helpers';
import { type AuthModel, type UserModel } from '@/auth';
import { api } from '@/api/axios';

const API_URL = import.meta.env.VITE_APP_API_URL;
export const LOGIN_URL = `${API_URL}/auth/jwt/login`;
export const REGISTER_URL = `${API_URL}/auth/register`;
export const FORGOT_PASSWORD_URL = `${API_URL}/auth/forgot-password`;
export const RESET_PASSWORD_URL = `${API_URL}/auth/reset-password`;
export const GET_USER_URL = `${API_URL}/users/me`;

interface AuthContextProps {
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  auth: AuthModel | undefined;
  saveAuth: (auth: AuthModel | undefined) => void;
  currentUser: UserModel | undefined;
  setCurrentUser: Dispatch<SetStateAction<UserModel | undefined>>;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle?: () => Promise<void>;
  loginWithFacebook?: () => Promise<void>;
  loginWithGithub?: () => Promise<void>;
  register: (email: string, password: string, password_confirmation: string, full_name: string) => Promise<boolean>;
  requestPasswordResetLink: (email: string) => Promise<void>;
  changePassword: (
    email: string,
    token: string,
    password: string,
    password_confirmation: string
  ) => Promise<void>;
  getUser: () => Promise<AxiosResponse<any>>;
  logout: () => void;
  verify: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | null>(null);

const AuthProvider = ({ children }: PropsWithChildren) => {
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState<AuthModel | undefined>(authHelper.getAuth());
  const [currentUser, setCurrentUser] = useState<UserModel | undefined>();

  const verify = async () => {
    if (auth) {
      try {
        const { data: user } = await getUser();
        setCurrentUser(user);
      } catch {
        saveAuth(undefined);
        setCurrentUser(undefined);
      }
    }
  };

  const saveAuth = (auth: AuthModel | undefined) => {
    setAuth(auth);
    if (auth) {
      authHelper.setAuth(auth);
    } else {
      authHelper.removeAuth();
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const formData = new URLSearchParams();
      formData.append('username', email);
      formData.append('password', password);

      const { data } = await api.post<{ access_token: string; token_type: string }>(
        '/auth/jwt/login',
        formData,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      const auth: AuthModel = {
        access_token: data.access_token,
        token_type: data.token_type
      };

      saveAuth(auth);
      
      try {
        const { data: user } = await api.get<UserModel>('/users/me');
        setCurrentUser(user);
      } catch (error) {
        console.error('Error fetching user data:', error);
        saveAuth(undefined);
        throw new Error('Не удалось получить данные пользователя');
      }
    } catch (error) {
      console.error('Login error:', error);
      saveAuth(undefined);
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          throw new Error('Неверный email или пароль');
        } else if (error.response?.status === 422) {
          throw new Error('Неверный формат данных');
        }
      }
      throw new Error(`Ошибка авторизации: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const register = async (email: string, password: string, password_confirmation: string, full_name: string) => {
    try {
      await api.post('/auth/register', {
        email,
        password,
        full_name,
        is_active: true,
        is_superuser: false,
        is_verified: false
      });
      
      return true;
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 422) {
          throw new Error('Неверный формат данных');
        }
      }
      throw error;
    }
  };

  const requestPasswordResetLink = async (email: string) => {
    const params = new URLSearchParams();
    params.append('email', email);

    await api.post(FORGOT_PASSWORD_URL, params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
  };

  const changePassword = async (
    email: string,
    token: string,
    password: string,
    password_confirmation: string
  ) => {
    const params = new URLSearchParams();
    params.append('email', email);
    params.append('token', token);
    params.append('password', password);
    params.append('password_confirmation', password_confirmation);

    await api.post(RESET_PASSWORD_URL, params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
  };

  const getUser = async () => {
    const token = auth?.access_token;
    if (!token) {
      throw new Error('Нет токена авторизации');
    }

    return await api.get<UserModel>('/users/me');
  };

  const logout = () => {
    saveAuth(undefined);
    setCurrentUser(undefined);
  };

  return (
    <AuthContext.Provider
      value={{
        loading,
        setLoading,
        auth,
        saveAuth,
        currentUser,
        setCurrentUser,
        login,
        register,
        requestPasswordResetLink,
        changePassword,
        getUser,
        logout,
        verify
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };

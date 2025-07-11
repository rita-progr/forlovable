import { type TLanguageCode } from '@/i18n';

export interface AuthModel {
  access_token: string;
  token_type: string;
  refreshToken?: string;
  api_token?: string;
}

export interface UserModel {
  id: number;
  username: string;
  password: string | undefined;
  email: string;
  full_name?: string;
  occupation?: string;
  companyName?: string;
  phone?: string;
  roles?: number[];
  pic?: string;
  language?: TLanguageCode;
  auth?: AuthModel;
}

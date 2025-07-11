import { User as Auth0UserModel } from '@auth0/auth0-spa-js';
import { type AuthModel } from './_models';

const AUTH_LOCAL_STORAGE_KEY = 'auth';

export const getAuth = (): AuthModel | undefined => {
  try {
    const auth = localStorage.getItem(AUTH_LOCAL_STORAGE_KEY);
    return auth ? JSON.parse(auth) : undefined;
  } catch (error) {
    console.error('AUTH LOCAL STORAGE PARSE ERROR', error);
    return undefined;
  }
};

export const setAuth = (auth: AuthModel | Auth0UserModel) => {
  localStorage.setItem(AUTH_LOCAL_STORAGE_KEY, JSON.stringify(auth));
};

export const removeAuth = () => {
  localStorage.removeItem(AUTH_LOCAL_STORAGE_KEY);
};

export { AUTH_LOCAL_STORAGE_KEY };

export function setupAxios(axios: any) {
  axios.defaults.headers.Accept = 'application/json';
  axios.interceptors.request.use(
    (config: { headers: { Authorization: string } }) => {
      const auth = getAuth();

      if (auth?.access_token) {
        config.headers.Authorization = `Bearer ${auth.access_token}`;
      }

      return config;
    },
    async (err: any) => await Promise.reject(err)
  );
}

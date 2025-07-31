import axios from "axios";
import {
  AUTH_STORAGE_KEY,
  REFRESH_TOKEN_STORAGE_KEY,
  Routes,
} from "~/constants/consts";
import { LaunchScreen } from "~/components/launch-screen";
import { type IUserProfileDto } from "~/interfaces/IUserProfileDto";
import { useProfile } from "~/hooks/tanstack-hooks/use-profile";
import { useSignOut } from "~/hooks/tanstack-hooks/use-sign-out";
import { useSignIn } from "~/hooks/tanstack-hooks/use-sign-in";
import { queryClient } from "~/lib/tanstack-query";
import { handleError } from "~/utils/handle-error";
import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useCallback,
  useState,
  type PropsWithChildren,
} from "react";
import httpClient from "~/lib/http-client";

type AuthState = {
  isFetching: boolean;
  hasSession: boolean;
  isFetchingSignin: boolean;
  applicationUser: IUserProfileDto | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  refetchUser: () => void;
};

export const AuthContext = createContext<AuthState>({
  isFetching: false,
  hasSession: false,
  isFetchingSignin: false,
  applicationUser: null,
  signIn: async () => {},
  refetchUser: () => {},
  signOut: () => {},
});

export function SessionProvider({ children }: PropsWithChildren) {
  const { signInAsync, loading: isFetchingSignin } = useSignIn();
  const { signOutAsync } = useSignOut();

  const [signedIn, setSignedIn] = useState<boolean>(() => {
    const jwt = localStorage.getItem(AUTH_STORAGE_KEY);
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);
    return !!jwt && !!refreshToken;
  });

  const hasSession = signedIn;

  const {
    loading: isFetching,
    refetch: refetchUser,
    data,
    error: isError,
  } = useProfile({
    enabled: hasSession,
    staleTime: Infinity,
  });

  async function getRefreshToken(refreshToken: string): Promise<any> {
    const result = await httpClient.post(Routes.Authentication.RefreshJwt, {
      refreshToken,
    });

    return result?.data;
  }

  useLayoutEffect(() => {
    console.log("Add request interceptor");

    const interceptorId = httpClient.interceptors.request.use((config) => {
      const accessToken = localStorage.getItem(AUTH_STORAGE_KEY);

      if (accessToken) {
        config.headers.set("Authorization", `Bearer ${accessToken}`);
      }

      return config;
    });

    return () => {
      httpClient.interceptors.request.eject(interceptorId);
    };
  }, []);

  useLayoutEffect(() => {
    console.log("Add response interceptor");

    const interceptorId = httpClient.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        const refreshToken = localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);

        if (originalRequest.url === Routes.Authentication.RefreshJwt) {
          setSignedIn(false);
          localStorage.clear();
          return Promise.reject(error);
        }

        if (error.response?.status !== 401 || !refreshToken) {
          return Promise.reject(error);
        }

        const result = await getRefreshToken(refreshToken);
        console.log("result", result);

        localStorage.setItem(AUTH_STORAGE_KEY, result.data.accessToken);
        localStorage.setItem(
          REFRESH_TOKEN_STORAGE_KEY,
          result.data.refreshToken
        );

        return httpClient(originalRequest);
      }
    );

    return () => {
      httpClient.interceptors.response.eject(interceptorId);
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const { data: result } = await signInAsync({
        email,
        password,
      });

      const { accessToken, refreshToken } = result!;

      localStorage.setItem(AUTH_STORAGE_KEY, accessToken);
      localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, refreshToken);

      setSignedIn(true);
    } catch (error) {
      handleError(error);
    }
  }, []);

  const signOut = useCallback(() => {
    try {
      const refreshToken = localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);
      if (refreshToken) {
        signOutAsync({ refreshToken });
      }
    } finally {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
      queryClient.clear();
      setSignedIn(false);
    }
  }, []);

  useEffect(() => {
    if (isError) {
      const token = localStorage.getItem(AUTH_STORAGE_KEY);
      if (!token) {
        signOut();
      }
    }
  }, [isError, signOut]);

  return (
    <AuthContext.Provider
      value={{
        isFetching,
        applicationUser: data ?? null,
        hasSession,
        refetchUser,
        signIn,
        isFetchingSignin,
        signOut,
      }}
    >
      <LaunchScreen isLoading={isFetching} />
      {!isFetching && children}
    </AuthContext.Provider>
  );
}

export function useSession() {
  return useContext(AuthContext);
}

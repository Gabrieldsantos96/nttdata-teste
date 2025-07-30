import { LaunchScreen } from "~/components/launch-screen";
import {
  AUTH_STORAGE_KEY,
  REFRESH_TOKEN_STORAGE_KEY,
} from "~/constants/consts";
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
  useState,
  type PropsWithChildren,
} from "react";
import { useRouter } from "@tanstack/react-router";

type AuthState = {
  isFetching: boolean;
  hasSession: boolean;
  isFetchingSignin: boolean;
  applicationUser: IUserProfileDto | null;
  signIn: (email: string, password: string) => void;
  signOut: () => void;
  refetchUser: () => void;
};

export const AuthContext = createContext<AuthState>({
  isFetching: false,
  hasSession: false,
  isFetchingSignin: false,
  applicationUser: null,
  signIn: () => {},
  refetchUser: () => {},
  signOut: () => {},
});

export function SessionProvider({ children }: PropsWithChildren) {
  const router = useRouter();
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

  async function signIn(email: string, password: string) {
    try {
      console.log(email, password);
      const { data: result } = await signInAsync({
        email,
        password,
      });

      const { accessToken, refreshToken } = result!;

      localStorage.setItem(AUTH_STORAGE_KEY, accessToken);
      localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, refreshToken);

      setSignedIn(true);

      router.navigate({ to: "/" });
    } catch (error) {
      console.log(error);
      handleError(error);
    }
  }

  function signOut() {
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
  }

  useEffect(() => {
    if (isError) {
      const token = localStorage.getItem(AUTH_STORAGE_KEY);
      if (!token) {
        signOut();
      }
    }
  }, [isError]);

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

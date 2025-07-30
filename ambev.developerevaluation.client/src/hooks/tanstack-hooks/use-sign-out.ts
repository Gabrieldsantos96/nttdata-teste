"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import {
  AUTH_STORAGE_KEY,
  REFRESH_TOKEN_STORAGE_KEY,
  Routes,
} from "~/constants/consts";
import httpClient from "~/lib/http-client";

interface SignOutInput {
  refreshToken: string;
}

interface SignOutResult {
  success: boolean;
  message?: string;
}

async function signOutRequest(input: SignOutInput): Promise<SignOutResult> {
  const { data } = await httpClient.post(Routes.Authentication.SignOut, input);

  return data;
}

export function useSignOut() {
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: signOutRequest,
    onSettled: () => {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
      router.navigate({ to: "/sign-in" });
    },
  });

  return {
    signOutAsync: mutation.mutateAsync,
    loading: mutation.isPending,
    refetch: mutation.reset,
    error: mutation.isError,
  };
}

"use client";

import { useMutation } from "@tanstack/react-query";
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
  const mutation = useMutation({
    mutationFn: signOutRequest,
    onSettled: () => {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
    },
  });

  return {
    signOutAsync: mutation.mutateAsync,
    loading: mutation.isPending,
    refetch: mutation.reset,
    error: mutation.isError,
  };
}

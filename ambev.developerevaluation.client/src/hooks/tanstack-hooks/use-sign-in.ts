"use client";

import { useMutation } from "@tanstack/react-query";
import { Routes } from "~/constants/consts";
import httpClient from "~/lib/http-client";

interface SignInInput {
  email: string;
  password: string;
}

interface SignInResult {
  success: boolean;
  data?: {
    accessToken: string;
    refreshToken: string;
  };
  message?: string;
}

async function signInRequest(input: SignInInput): Promise<SignInResult> {
  const { status, data } = await httpClient.post(
    Routes.Authentication.SignIn,
    input
  );

  if (!data.success) {
    throw new Error(
      data?.message || `${Routes.Authentication.SignIn}: ${status}`
    );
  }

  return data;
}

export function useSignIn() {
  const mutation = useMutation({
    mutationFn: signInRequest,
  });

  return {
    signInAsync: mutation.mutateAsync,
    loading: mutation.isPending,
    refetch: mutation.reset,
    error: mutation.isError,
  };
}

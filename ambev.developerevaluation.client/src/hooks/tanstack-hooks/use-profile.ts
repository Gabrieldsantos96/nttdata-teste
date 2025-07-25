"use client";

import { useQuery } from "@tanstack/react-query";
import type { IUserProfileDto } from "@/interfaces/IUserProfileDto";
import httpClient from "@/lib/http-client";
import { Routes } from "@/constants/consts";
import { isSuccessStatus } from "@/lib/http-.status";

interface UseProfileOptions {
  enabled?: boolean;
  staleTime?: number;
  retry?: boolean | number;
}

async function fetchUserProfile(): Promise<IUserProfileDto> {
  const { status, data } = await httpClient.post(Routes.Authentication.PROFILE);

  if (!isSuccessStatus(status)) {
    throw new Error(`${Routes.Authentication.PROFILE}: ${status}`);
  }

  return data;
}

export function useProfile(options: UseProfileOptions = {}) {
  const query = useQuery({
    queryKey: ["profile"],
    queryFn: fetchUserProfile,
    enabled: options.enabled ?? true,
    staleTime: options.staleTime ?? 5 * 60 * 1000,
    retry: options.retry ?? 3,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  return {
    loading: query.isLoading,
    data: query.data,
    error: query.error,
    refetch: query.refetch,
  };
}

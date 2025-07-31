"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { Routes } from "~/constants/consts";
import httpClient from "~/lib/http-client";
import { IPaginationResponse } from "~/interfaces/IPagination";
import { IUserProfileDto } from "~/interfaces/IUserProfileDto";
import { queryClient } from "~/lib/tanstack-query";
import { SignupFormData } from "~/validations/sign-up-schema";

export function useUsers(page: number = 1, pageSize: number = 10) {
  return useQuery({
    queryKey: ["users", page, pageSize],
    queryFn: async () => {
      const result = await httpClient.get<IPaginationResponse<IUserProfileDto>>(
        `/${Routes.Users.GetPaginatedUsers}?skip=${page}&take=${pageSize}`
      );

      return result?.data;
    },
  });
}

export function useUser(id?: string) {
  return useQuery({
    queryKey: ["user", id],
    queryFn: async () => {
      const { data } = await httpClient.get<any>(
        `${Routes.Users.GetUserById.replace("{id}", id!)}`
      );

      return data;
    },
    enabled: !!id,
  });
}

export function useUpdateUser() {
  return useMutation({
    mutationFn: async (data: SignupFormData) => {
      const result = await httpClient.put<IUserProfileDto>(
        `${Routes.Users.UpdateUser.replace("{id}", data.id!)}`,
        data
      );
      return result?.data;
    },
    onSuccess: (_) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

export function useDeleteUser() {
  return useMutation({
    mutationFn: async (id: string) => {
      const result = await httpClient.delete<string>(
        `${Routes.Users.DeleteUser.replace("{id}", id)}`
      );

      return result?.data;
    },
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.setQueryData(["user", id], undefined);
    },
  });
}

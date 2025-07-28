"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { Routes } from "~/constants/consts";
import httpClient from "~/lib/http-client";
import { IPaginationResponse } from "~/interfaces/IPagination";
import { IUserProfileDto } from "~/interfaces/IUserProfileDto";
import { queryClient } from "~/lib/tanstack-query";

export function useUsers(page: number = 1, pageSize: number = 10) {
  return useQuery({
    queryKey: ["users", page, pageSize],
    queryFn: async () => {
      const result = await httpClient.get<IPaginationResponse<IUserProfileDto>>(
        `/${Routes.User.LIST}?page=${page}&pageSize=${pageSize}`
      );

      return result?.data;
    },
  });
}

export function useUser(id?: string) {
  return useQuery({
    queryKey: ["user", id],
    queryFn: async () => {
      const { data } = await httpClient.get<IUserProfileDto>(
        `${Routes.User.GET.replace("{id}", id!)}`
      );

      return data;
    },
    enabled: !!id,
  });
}

export function useCreateUser(page: number = 1, pageSize: number = 10) {
  return useMutation({
    mutationFn: async (
      data: Omit<IUserProfileDto, "id" | "createdAt" | "updatedAt">
    ) => {
      const result = await httpClient.post<IUserProfileDto>(
        Routes.User.CREATE,
        data
      );

      return result?.data;
    },
    onSuccess: (_data) => {
      queryClient.invalidateQueries({ queryKey: ["users", page, pageSize] });
    },
  });
}

export function useUpdateUser(page: number = 1, pageSize: number = 10) {
  return useMutation({
    mutationFn: async ({ id, ...data }: IUserProfileDto) => {
      const result = await httpClient.put<IUserProfileDto>(
        `${Routes.User.UPDATE.replace("{id}", id)}`,
        data
      );
      return result?.data;
    },
    onSuccess: (_, variables) => {
      queryClient.setQueryData<IPaginationResponse<IUserProfileDto>>(
        ["users", page, pageSize],
        (prevState) =>
          prevState
            ? {
                items: prevState.items.map((user) =>
                  user.id === variables.id ? { ...user, ...variables } : user
                ),
                pagination: {
                  currentPage: prevState.pagination.currentPage,
                  hasNext: prevState.pagination.hasNext,
                  pageSize: prevState.pagination.pageSize,
                  totalCount: prevState.pagination.totalCount,
                },
              }
            : prevState
      );
    },
  });
}

export function useDeleteUser(page: number = 1, pageSize: number = 10) {
  return useMutation({
    mutationFn: async (id: string) => {
      const result = await httpClient.delete<string>(
        `${Routes.User.DELETE.replace("{id}", id)}`
      );

      return result?.data;
    },
    onSuccess: (_data, id) => {
      queryClient.setQueryData<IPaginationResponse<IUserProfileDto>>(
        ["users", page, pageSize],
        (prevState) =>
          prevState
            ? {
                items: prevState.items.filter((user) => user.id !== id),
                pagination: {
                  currentPage: prevState.pagination.currentPage,
                  hasNext: prevState.pagination.hasNext,
                  pageSize: prevState.pagination.pageSize,
                  totalCount: prevState.pagination.totalCount - 1,
                },
              }
            : prevState
      );
      queryClient.setQueryData(["user", id], undefined);
    },
  });
}

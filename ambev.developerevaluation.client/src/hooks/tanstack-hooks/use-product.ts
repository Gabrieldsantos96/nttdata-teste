"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { Routes } from "~/constants/consts";
import httpClient from "~/lib/http-client";
import { IPaginationResponse } from "~/interfaces/IPagination";
import { IProduct } from "~/interfaces/IProduct";
import { queryClient } from "~/lib/tanstack-query";

export function useProducts(page: number = 1, pageSize: number = 10) {
  return useQuery({
    queryKey: ["products", page, pageSize],
    queryFn: async () => {
      const { data } = await httpClient.get<IPaginationResponse<IProduct>>(
        `/${Routes.Product.LIST}?page=${page}&pageSize=${pageSize}`
      );
      return data;
    },
  });
}

export function useProduct(id?: string) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const { data } = await httpClient.get<IProduct>(
        `${Routes.Product.GET.replace("{id}", id!)}`
      );
      return data;
    },
    enabled: !!id,
  });
}

export function useCreateProduct(page: number = 1, pageSize: number = 10) {
  return useMutation({
    mutationFn: async (
      data: Omit<IProduct, "id" | "createdAt" | "updatedAt">
    ) => {
      const result = await httpClient.post<IProduct>(
        Routes.Product.CREATE,
        data
      );
      return result?.data;
    },
    onSuccess: (_) => {
      queryClient.invalidateQueries({ queryKey: ["products", page, pageSize] });
    },
  });
}

export function useUpdateProduct(page: number = 1, pageSize: number = 10) {
  return useMutation({
    mutationFn: async ({ id, ...data }: IProduct) => {
      const result = await httpClient.put<IProduct>(
        `${Routes.Product.UPDATE.replace("{id}", id)}`,
        data
      );
      return result?.data;
    },
    onSuccess: (_, variables) => {
      queryClient.setQueryData<IPaginationResponse<IProduct>>(
        ["products", page, pageSize],
        (prevState) =>
          prevState
            ? {
                items: prevState.items.map((product) =>
                  product.id === variables.id
                    ? { ...product, ...variables }
                    : product
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

export function useDeleteProduct(page: number = 1, pageSize: number = 10) {
  return useMutation({
    mutationFn: async (id: string) => {
      const result = await httpClient.delete<string>(
        `${Routes.Product.DELETE.replace("{id}", id)}`
      );
      return result?.data;
    },
    onSuccess: (_data, id) => {
      queryClient.setQueryData<IPaginationResponse<IProduct>>(
        ["products", page, pageSize],
        (prevState) =>
          prevState
            ? {
                items: prevState.items.filter((product) => product.id !== id),
                pagination: {
                  currentPage: prevState.pagination.currentPage,
                  hasNext: prevState.pagination.hasNext,
                  pageSize: prevState.pagination.pageSize,
                  totalCount: prevState.pagination.totalCount - 1,
                },
              }
            : prevState
      );
      queryClient.setQueryData(["product", id], undefined);
    },
  });
}

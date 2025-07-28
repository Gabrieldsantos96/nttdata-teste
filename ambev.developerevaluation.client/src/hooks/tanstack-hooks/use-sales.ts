"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { Routes } from "~/constants/consts";
import httpClient from "~/lib/http-client";
import { IPaginationResponse } from "~/interfaces/IPagination";
import { Sale, SALE_ITEM_STATUS } from "~/interfaces/ISale";
import { queryClient } from "~/lib/tanstack-query";

export function useSales(page: number = 1, pageSize: number = 10) {
  return useQuery({
    queryKey: ["sales", page, pageSize],
    queryFn: async () => {
      const { data } = await httpClient.get<IPaginationResponse<Sale>>(
        `/${Routes.Sale.LIST}?page=${page}&pageSize=${pageSize}`
      );
      return data;
    },
  });
}

export function useSale(id: string) {
  return useQuery({
    queryKey: ["sale", id],
    queryFn: async () => {
      return httpClient.get<Sale>(`${Routes.Sale.GET.replace("{id}", id!)}`);
    },
    enabled: !!id,
  });
}

export function useCreateSale(page: number = 1, pageSize: number = 10) {
  return useMutation({
    mutationFn: async (data: Omit<Sale, "id" | "createdAt" | "updatedAt">) => {
      const result = await httpClient.post<Sale>(Routes.Sale.CREATE, data);

      return result?.data;
    },
    onSuccess: (_data) => {
      queryClient.invalidateQueries({ queryKey: ["sales", page, pageSize] });
    },
  });
}

export function useDeleteSale(page: number = 1, pageSize: number = 10) {
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await httpClient.delete<string>(
        `${Routes.Sale.DELETE.replace("{id}", id)}`
      );
      return data;
    },
    onSuccess: (_data, id) => {
      queryClient.setQueryData<IPaginationResponse<Sale>>(
        ["sales", page, pageSize],
        (prevState) =>
          prevState
            ? {
                items: prevState.items.filter((sale) => sale.id !== id),
                pagination: {
                  currentPage: prevState.pagination.currentPage,
                  hasNext: prevState.pagination.hasNext,
                  pageSize: prevState.pagination.pageSize,
                  totalCount: prevState.pagination.totalCount - 1,
                },
              }
            : prevState
      );
      queryClient.setQueryData(["sale", id], undefined);
    },
  });
}

export function useCancelSaleItem(page: number = 1, pageSize: number = 10) {
  return useMutation({
    mutationFn: async ({
      saleId,
      itemId,
    }: {
      saleId: string;
      itemId: string;
    }) => {
      const { data } = await httpClient.post<Sale>(
        Routes.Sale.CANCEL_ITEM.replace("{saleId}", saleId).replace(
          "{productId}",
          itemId
        )
      );
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.setQueryData<IPaginationResponse<Sale>>(
        ["sales", page, pageSize],
        (prevState: IPaginationResponse<Sale>) =>
          prevState
            ? ({
                ...prevState,
                status: data?.status,
                totalAmount: data?.totalAmount,
                items: prevState.items.map((sale) =>
                  sale.id === variables.saleId
                    ? {
                        ...sale,
                        status: SALE_ITEM_STATUS.Cancelled,
                      }
                    : sale
                ),
                pagination: {
                  currentPage: prevState.pagination.currentPage,
                  hasNext: prevState.pagination.hasNext,
                  pageSize: prevState.pagination.pageSize,
                  totalCount: prevState.pagination.totalCount,
                },
              } as IPaginationResponse<Sale>)
            : prevState
      );
    },
  });
}

export function useUpdateSaleItem(page: number = 1, pageSize: number = 10) {
  return useMutation({
    mutationFn: async ({
      saleId,
      itemId,
    }: {
      saleId: string;
      itemId: string;
    }) => {
      const { data } = await httpClient.post<Sale>(
        Routes.Sale.CANCEL_ITEM.replace("{saleId}", saleId).replace(
          "{productId}",
          itemId
        )
      );
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.setQueryData<IPaginationResponse<Sale>>(
        ["sales", page, pageSize],
        (prevState: IPaginationResponse<Sale>) =>
          prevState
            ? ({
                ...prevState,
                status: data?.status,
                totalAmount: data?.totalAmount,
                items: prevState.items.map((sale) =>
                  sale.id === variables.saleId
                    ? {
                        ...sale,
                        ...sale.items.find((s) => s.id !== variables.itemId),
                      }
                    : sale
                ),
                pagination: {
                  currentPage: prevState.pagination.currentPage,
                  hasNext: prevState.pagination.hasNext,
                  pageSize: prevState.pagination.pageSize,
                  totalCount: prevState.pagination.totalCount,
                },
              } as IPaginationResponse<Sale>)
            : prevState
      );
    },
  });
}

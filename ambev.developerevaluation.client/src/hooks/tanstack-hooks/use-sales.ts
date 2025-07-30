"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { Routes } from "~/constants/consts";
import httpClient from "~/lib/http-client";
import { IPaginationResponse } from "~/interfaces/IPagination";
import { Sale } from "~/interfaces/ISale";
import { queryClient } from "~/lib/tanstack-query";

export function useSales(page: number = 1, pageSize: number = 10) {
  return useQuery({
    queryKey: ["sales", page, pageSize],
    queryFn: async () => {
      const { data } = await httpClient.get<IPaginationResponse<Sale>>(
        `/${Routes.Sales.GetPaginatedSales}?page=${page}&pageSize=${pageSize}`
      );
      return data;
    },
  });
}

export function useSale(id: string) {
  return useQuery({
    queryKey: ["sale", id],
    queryFn: async () => {
      return httpClient.get<Sale>(
        `${Routes.Sales.GetSaleById.replace("{id}", id!)}`
      );
    },
    enabled: !!id,
  });
}

export function useCreateSale(page: number = 1, pageSize: number = 10) {
  return useMutation({
    mutationFn: async (id: string) => {
      const result = await httpClient.post<Sale>(
        Routes.Sales.CreateSale.replace("{cartId}", id)
      );

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
        `${Routes.Sales.DeleteSale.replace("{id}", id)}`
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
        Routes.Sales.UpdateSale.replace("{id}", saleId).replace(
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

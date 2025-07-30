"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { Routes } from "~/constants/consts";
import httpClient from "~/lib/http-client";
import { Sale } from "~/interfaces/ISale";
import { queryClient } from "~/lib/tanstack-query";
import { IPaginationResponse } from "~/interfaces/IPagination";

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
      const { data } = await httpClient.get<Sale>(
        `${Routes.Sales.GetSaleById.replace("{id}", id!)}`
      );
      return data;
    },
    enabled: !!id,
  });
}

export function useCreateSale() {
  return useMutation({
    mutationFn: async (id: string) => {
      const result = await httpClient.post<Sale>(
        Routes.Sales.CreateSale.replace("{cartId}", id)
      );

      return result?.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales"] });
    },
  });
}

export function useDeleteSale() {
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await httpClient.delete<string>(
        `${Routes.Sales.DeleteSale.replace("{id}", id)}`
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales"] });
    },
  });
}

export function useUpdateSaleItem() {
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales"] });
    },
  });
}

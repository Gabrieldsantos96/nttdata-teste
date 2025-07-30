import { Money } from "./IProduct";

export const enum ISaleItemStatus {
  Active = "Active",
  Cancelled = "Cancelled",
}

export const SALE_ITEM_STATUS = {
  Active: "Ativo",
  Cancelled: "Cancelado",
};

export const enum ISaleStatus {
  Pending = "Pending",
  Completed = "Completed",
  Cancelled = "Cancelled",
}

export const SALE_STATUS = {
  Pending: "Pendente",
  Completed: "Finalizada",
  Cancelled: "Cancelada",
};

export interface SaleItem {
  createdBy?: string;
  updatedBy?: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: Money;
  status: ISaleItemStatus;
  discountPercentage: string;
  totalPriceWithDiscount: Money;
}

export interface Sale {
  id: string;
  createdBy?: string;
  updatedBy?: string;
  saleNumber: string;
  customerId: string;
  customerName: string;
  branchId: string;
  saleDate: string;
  status: ISaleStatus;
  items: SaleItem[];
  totalAmount: Money;
}

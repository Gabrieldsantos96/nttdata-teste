export interface CartItem {
  id: string;
  productName: string;
  quantity: number;
}

export interface Cart {
  id: string;
  createdBy?: string;
  updatedBy?: string;
  userId: string;
  userName: string;
  products: CartItem[];
}

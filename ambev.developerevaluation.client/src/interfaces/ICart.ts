export interface CartItem {
  productId: string;
  productName?: string;
  quantity: number;
  image?: string;
}

export interface Cart {
  id: string;
  createdBy?: string;
  updatedBy?: string;
  userId: string;
  userName: string;
  products: CartItem[];
}

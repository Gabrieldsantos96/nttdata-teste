export interface IProduct {
  id: string;
  title: string;
  price: Money;
  description: string;
  category: string;
  image: string;
  rating: { rate: number; count: number };
  createdAt: string;
  updatedAt?: string;
}

export type Money = {
  amount: number;
  currency: "BRL";
};

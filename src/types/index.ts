export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  createdAt: number;
}

export type TabType = 'add' | 'view';

export interface SearchState {
  query: string;
  useContextual: boolean;
}
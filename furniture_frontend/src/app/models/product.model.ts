export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url?: string | null;
}

export interface ProductListResponse {
  items: Product[];
  total: number;
  page: number;
  page_size: number;
}

export interface ProductQuery {
  q?: string | null;
  category?: string | null;
  min_price?: number | null;
  max_price?: number | null;
  page?: number;
  page_size?: number;
}

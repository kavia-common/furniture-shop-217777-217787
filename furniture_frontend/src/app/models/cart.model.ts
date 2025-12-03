export interface CartItem {
  product_id: number;
  name: string;
  image_url: string | null;
  price: number;
  quantity: number;
}
export interface CartResponse {
  items: CartItem[];
  total: number;
}

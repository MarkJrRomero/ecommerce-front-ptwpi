export interface Product {
  id: number;
  name: string;
  color: string;
  price: number;
  image: string;
  alt: string;
  description?: string;
  stock: number;
}

export interface CartItem {
  productId: number;
  name: string;
  color: string;
  price: number;
  image: string;
  quantity: number;
  size?: string;
}


interface ApiProduct {
  id: number;
  name: string;
  description: string;
  price: string;
  stock: number;
  imageUrl: string;
}

export const fetchProducts = async (): Promise<ApiProduct[]> => {
  const baseUrl = import.meta.env.VITE_BASE_URL || 'http://localhost:3000';
  const response = await fetch(`${baseUrl}/products`);
  
  if (!response.ok) {
    throw new Error(`Error al obtener productos: ${response.statusText}`);
  }
  
  return response.json();
};


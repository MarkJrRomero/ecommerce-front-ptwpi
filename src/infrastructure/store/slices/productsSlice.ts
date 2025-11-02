import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { Product } from "../../../domain/types/product.types";
import { fetchProducts as fetchProductsApi } from "../../api/productsApi";

interface ProductsState {
  products: Product[];
  selectedProduct: Product | null;
  isLoading: boolean;
  error: string | null;
}

interface ApiProduct {
  id: number;
  name: string;
  description: string;
  price: string;
  stock: number;
  imageUrl: string;
}

const mapApiProductToProduct = (apiProduct: ApiProduct): Product => {
  return {
    id: apiProduct.id,
    name: apiProduct.name,
    color: "Estándar",
    price: parseFloat(apiProduct.price),
    image: apiProduct.imageUrl,
    alt: apiProduct.description || apiProduct.name,
    description: apiProduct.description,
    stock: apiProduct.stock
  };
};

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const apiProducts = await fetchProductsApi();
      return apiProducts.map(mapApiProductToProduct);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Error desconocido');
    }
  }
);

const initialState: ProductsState = {
  products: [],
  selectedProduct: null,
  isLoading: false,
  error: null
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload;
    },
    setProducts: (state, action) => {
      state.products = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload;
        state.error = null;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  }
});

export const { setSelectedProduct, setProducts } = productsSlice.actions;
export default productsSlice.reducer;


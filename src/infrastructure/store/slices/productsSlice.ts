import { createSlice } from "@reduxjs/toolkit";
import type { Product } from "../../../domain/types/product.types";

interface ProductsState {
  products: Product[];
  selectedProduct: Product | null;
  isLoading: boolean;
}

const initialState: ProductsState = {
  products: [
    {
      id: 1,
      name: "Basic Tee",
      color: "Black",
      price: 35,
      image: "https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-related-product-01.jpg",
      alt: "Front of men's Basic Tee in black.",
      description: "Basic Tee 6-Pack"
    },
    {
      id: 2,
      name: "Basic Tee",
      color: "Aspen White",
      price: 35,
      image: "https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-related-product-02.jpg",
      alt: "Front of men's Basic Tee in white.",
      description: "Basic Tee 6-Pack"
    },
    {
      id: 3,
      name: "Basic Tee",
      color: "Charcoal",
      price: 35,
      image: "https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-related-product-03.jpg",
      alt: "Front of men's Basic Tee in dark gray.",
      description: "Basic Tee 6-Pack"
    },
    {
      id: 4,
      name: "Artwork Tee",
      color: "Iso Dots",
      price: 35,
      image: "https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-related-product-04.jpg",
      alt: "Front of men's Artwork Tee in peach with white and brown dots forming an isometric cube.",
      description: "Artwork Tee 6-Pack"
    }
  ],
  selectedProduct: null,
  isLoading: false
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
  }
});

export const { setSelectedProduct, setProducts } = productsSlice.actions;
export default productsSlice.reducer;


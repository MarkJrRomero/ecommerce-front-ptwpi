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
      name: "Camiseta Básica",
      color: "Negro",
      price: 35,
      image: "https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-related-product-01.jpg",
      alt: "Frente de camiseta básica para hombre en color negro.",
      description: "Pack de 6 Camisetas Básicas"
    },
    {
      id: 2,
      name: "Camiseta Básica",
      color: "Blanco Aspen",
      price: 35,
      image: "https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-related-product-02.jpg",
      alt: "Frente de camiseta básica para hombre en color blanco.",
      description: "Pack de 6 Camisetas Básicas"
    },
    {
      id: 3,
      name: "Camiseta Básica",
      color: "Carbón",
      price: 35,
      image: "https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-related-product-03.jpg",
      alt: "Frente de camiseta básica para hombre en gris oscuro.",
      description: "Pack de 6 Camisetas Básicas"
    },
    {
      id: 4,
      name: "Camiseta con Diseño",
      color: "Puntos Isométricos",
      price: 35,
      image: "https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-related-product-04.jpg",
      alt: "Frente de camiseta con diseño para hombre en melocotón con puntos blancos y marrones formando un cubo isométrico.",
      description: "Pack de 6 Camisetas con Diseño"
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


import { createSlice } from "@reduxjs/toolkit";
import type { CartItem } from "../../../domain/types/product.types";

interface CartState {
  items: CartItem[];
  isCartOpen: boolean;
}

const CART_STORAGE_KEY = "cart_items";

const loadCartFromStorage = (): CartItem[] => {
  try {
    const serializedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (serializedCart === null) {
      return [];
    }
    return JSON.parse(serializedCart);
  } catch (err) {
    console.error("Error loading cart from localStorage:", err);
    return [];
  }
};

const saveCartToStorage = (items: CartItem[]) => {
  try {
    const serializedCart = JSON.stringify(items);
    localStorage.setItem(CART_STORAGE_KEY, serializedCart);
  } catch (err) {
    console.error("Error saving cart to localStorage:", err);
  }
};

const initialState: CartState = {
  items: loadCartFromStorage(),
  isCartOpen: false
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const existingItem = state.items.find(
        (item) =>
          item.productId === action.payload.productId &&
          item.color === action.payload.color &&
          (item.size === action.payload.size || (!item.size && !action.payload.size))
      );

      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
      saveCartToStorage(state.items);
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(
        (item) =>
          !(
            item.productId === action.payload.productId &&
            item.color === action.payload.color &&
            (item.size === action.payload.size || (!item.size && !action.payload.size))
          )
      );
      saveCartToStorage(state.items);
    },
    updateQuantity: (state, action) => {
      const item = state.items.find(
        (item) =>
          item.productId === action.payload.productId &&
          item.color === action.payload.color &&
          (item.size === action.payload.size || (!item.size && !action.payload.size))
      );

      if (item) {
        if (action.payload.quantity <= 0) {
          state.items = state.items.filter(
            (i) =>
              !(
                i.productId === action.payload.productId &&
                i.color === action.payload.color &&
                (i.size === action.payload.size || (!i.size && !action.payload.size))
              )
          );
        } else {
          item.quantity = action.payload.quantity;
        }
      }
      saveCartToStorage(state.items);
    },
    clearCart: (state) => {
      state.items = [];
      saveCartToStorage(state.items);
    },
    openCart: (state) => {
      state.isCartOpen = true;
    },
    closeCart: (state) => {
      state.isCartOpen = false;
    }
  }
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, openCart, closeCart } = cartSlice.actions;
export default cartSlice.reducer;


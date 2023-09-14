import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchInitialProducts = createAsyncThunk(
  "cart/fetchInitialProducts",
  async () => {
    try {
      const { data } = await axios.get("https://fakestoreapi.com/products");
      return data;
    } catch (error) {
      throw error;
    }
  }
);

const items = localStorage.getItem("cartItems")
  ? JSON.parse(localStorage.getItem("cartItems"))
  : [];

const totalAmount = localStorage.getItem("totalAmount")
  ? JSON.parse(localStorage.getItem("totalAmount"))
  : 0;

const totalQuantity = localStorage.getItem("totalQuantity")
  ? JSON.parse(localStorage.getItem("totalQuantity"))
  : 0;

const initialState = {
  cart: items,
  items: [],
  totalQuantity: totalQuantity,
  totalPrice: totalAmount,
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const itemToAdd = { ...action.payload, quantity: 1 }; 
      let find = state.cart.findIndex((item) => item.id === action.payload.id);
      if (find >= 0) {
        state.cart[find].quantity += 1;
      } else {
        state.cart.push(itemToAdd);
      }
      localStorage.setItem("cartItems", JSON.stringify(state.cart));
    },

    getCartTotal: (state) => {
      let { totalQuantity, totalPrice } = state.cart.reduce(
        (cartTotal, cartItem) => {
          const { price, quantity } = cartItem;
          const itemTotal = price * quantity;
          cartTotal.totalPrice += itemTotal;
          cartTotal.totalQuantity += quantity;
          return cartTotal;
        },
        {
          totalPrice: 0,
          totalQuantity: 0,
        }
      );
      state.totalPrice = parseFloat(totalPrice.toFixed(2));
      state.totalQuantity = totalQuantity;
      localStorage.setItem("totalQuantity", JSON.stringify(state.totalQuantity));
      localStorage.setItem("totalAmount", JSON.stringify(state.totalPrice));
    },
    removeItem: (state, action) => {
      state.cart = state.cart.filter((item) => item.id !== action.payload);
      localStorage.setItem("cartItems", JSON.stringify(state.cart));
    },
    increaseItemQuantity: (state, action) => {
      state.cart = state.cart.map((item) => {
        if (item.id === action.payload) {
          return { ...item, quantity: item.quantity + 1 };
        }
        return item;
      });
      localStorage.setItem("cartItems", JSON.stringify(state.cart));
    },
    decreaseItemQuantity: (state, action) => {
      state.cart = state.cart.map((item) => {
        if (item.id === action.payload) {
          return { ...item, quantity: item.quantity - 1 };
        }
        return item;
      });
      localStorage.setItem("cartItems", JSON.stringify(state.cart));
    },
    clearCart: (state) => {
      state.cart = []; 
    },
  },
    
  extraReducers: (builder) => {
    builder.addCase(fetchInitialProducts.fulfilled, (state, action) => {
      state.items = action.payload;
    });
  },
});

export const {
  addToCart,
  getCartTotal,
  removeItem,
  increaseItemQuantity,
  decreaseItemQuantity,
  clearCart
} = cartSlice.actions;

export default cartSlice.reducer;

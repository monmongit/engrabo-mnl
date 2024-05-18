import { createReducer } from '@reduxjs/toolkit';

const initialState = {
  cart: localStorage.getItem('cartItems')
    ? JSON.parse(localStorage.getItem('cartItems'))
    : [],
};

export const cartReducer = createReducer(initialState, (builder) => {
  builder
    .addCase('addToCart', (state, action) => {
      const item = action.payload;
      console.log("add to cart items: ", item)
      const existingItem = state.cart.find((i) => i._id === item._id);
      if (existingItem) {
        state.cart = state.cart.map((i) =>
          i._id === existingItem._id ? item : i
        );
      } else {
        state.cart.push(item);
      }
    })
    .addCase('removeFromCart', (state, action) => {
      state.cart = state.cart.filter((i) => i._id !== action.payload);
    });
});

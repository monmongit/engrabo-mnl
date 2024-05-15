import { createReducer } from '@reduxjs/toolkit';

const initialState = {
  products: [],
  orders: [],
  isLoading: false,
  error: null,
  product: null,
  message: null,
  success: false,
};

export const orderReducer = createReducer(initialState, (builder) => {
  builder

    // Search Products
    .addCase('searchProductsRequest', (state) => {
      state.isLoading = true;
    })
    .addCase('searchProductsSuccess', (state, action) => {
      state.isLoading = false;
      state.products = action.payload;
    })
    .addCase('searchProductsFail', (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })

    // Get all order of the user
    .addCase('getAllOrdersUserRequest', (state) => {
      state.isLoading = true;
    })
    .addCase('getAllOrdersUserSuccess', (state, action) => {
      state.isLoading = false;
      state.orders = action.payload; // Ensure this structure matches your state
    })
    .addCase('getAllOrdersUserFailed', (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })

    // Get all order of user on admin
    .addCase('getAllOrdersAdminRequest', (state) => {
      state.isLoading = true;
    })

    .addCase('getAllOrdersAdminSuccess', (state, action) => {
      state.isLoading = false;
      state.orders = action.payload;
    })
    .addCase('getAllOrdersAdminFailed', (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })

    // Clear Errors
    .addCase('clearErrors', (state) => {
      state.error = null;
    });
});

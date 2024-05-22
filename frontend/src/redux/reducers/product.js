import { createReducer } from '@reduxjs/toolkit';

const initialState = {
  products: [],
  isLoading: false,
  error: null,
  product: null,
  message: null,
  success: false,
};

export const productReducer = createReducer(initialState, (builder) => {
  builder
    // Create Product
    .addCase('productCreateRequest', (state) => {
      state.isLoading = true;
    })
    .addCase('productCreateSuccess', (state, action) => {
      state.isLoading = false;
      state.product = action.payload;
      state.success = true;
    })
    .addCase('productCreateFail', (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.success = false;
    })

    // Get All Product
    .addCase('getAllProductsAdminRequest', (state) => {
      state.isLoading = true;
    })
    .addCase('getAllProductsAdminSuccess', (state, action) => {
      state.isLoading = false;
      state.products = action.payload;
    })
    .addCase('getAllProductsAdminFailed', (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })

    // Delete Product
    .addCase('deleteProductRequest', (state) => {
      state.isLoading = true;
    })
    .addCase('deleteProductSuccess', (state, action) => {
      state.isLoading = false;
      state.products = state.products.filter(
        (product) => product._id !== action.payload.id
      ); // Remove the product from the state
      state.message = action.payload.message;
    })
    .addCase('deleteProductFailed', (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })

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

    // Get All User Product
    .addCase('getAllProductsRequest', (state) => {
      state.isLoading = true;
    })
    .addCase('getAllProductsSuccess', (state, action) => {
      state.isLoading = false;
      state.allProducts = action.payload; // Ensure this structure matches your state
    })
    .addCase('getAllProductsFailed', (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })
    // Update Product
    .addCase('updateProductRequest', (state) => {
      state.isLoading = true;
    })
    .addCase('updateProductSuccess', (state, action) => {
      state.isLoading = false;
      state.product = action.payload;
      state.success = true;
    })
    .addCase('updateProductFail', (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.success = false;
    })

    // Get Product Details
    .addCase('getProductDetailsRequest', (state) => {
      state.isLoading = true;
    })
    .addCase('getProductDetailsSuccess', (state, action) => {
      state.isLoading = false;
      state.product = action.payload;
    })
    .addCase('getProductDetailsFail', (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })

    // Clear Errors
    .addCase('clearErrors', (state) => {
      state.error = null;
    });
});

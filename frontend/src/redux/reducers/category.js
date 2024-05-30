import { createReducer } from '@reduxjs/toolkit';

const initialState = {
  categories: [], // Holds all categories
  isLoading: false,
  error: null,
  category: null, // Holds a single category or the category details
  message: null,
  success: false,
};

export const categoryReducer = createReducer(initialState, (builder) => {
  builder
    // Create Category
    .addCase('createCategoryRequest', (state) => {
      state.isLoading = true;
    })
    .addCase('createCategorySuccess', (state, action) => {
      state.isLoading = false;
      state.categories.push(action.payload);
      state.success = true;
    })
    .addCase('createCategoryFail', (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.success = false;
    })

    // Get Categories
    .addCase('fetchCategoriesRequest', (state) => {
      state.isLoading = true;
    })
    .addCase('fetchCategoriesSuccess', (state, action) => {
      state.isLoading = false;
      state.categories = action.payload;
    })
    .addCase('fetchCategoriesFail', (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })

    // Get Category Details
    .addCase('categoryDetailsRequest', (state) => {
      state.isLoading = true;
    })
    .addCase('categoryDetailsSuccess', (state, action) => {
      state.isLoading = false;
      state.category = action.payload;
    })
    .addCase('categoryDetailsFail', (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })

    // Update Category
    .addCase('updateCategoryRequest', (state) => {
      state.isLoading = true;
    })
    .addCase('updateCategorySuccess', (state, action) => {
      state.isLoading = false;
      const index = state.categories.findIndex(
        (cat) => cat._id === action.payload._id
      );
      if (index !== -1) {
        state.categories[index] = action.payload;
      }
      state.success = true;
    })
    .addCase('updateCategoryFail', (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.success = false;
    })

    // Delete Category
    .addCase('deleteCategoryRequest', (state) => {
      state.isLoading = true;
    })
    .addCase('deleteCategorySuccess', (state, action) => {
      state.isLoading = false;
      state.categories = state.categories.filter(
        (cat) => cat._id !== action.payload
      );
      state.message = 'Category deleted successfully';
    })
    .addCase('deleteCategoryFail', (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })

    // Clear Errors
    .addCase('clearErrors', (state) => {
      state.error = null;
    });
});

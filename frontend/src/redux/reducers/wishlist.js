import { createReducer } from '@reduxjs/toolkit';

const initialState = {
  wishlist: localStorage.getItem('wishlistItems')
    ? JSON.parse(localStorage.getItem('wishlistItems'))
    : [],
  loading: false,
  error: null,
};

export const wishlistReducer = createReducer(initialState, (builder) => {
  builder
    .addCase('addToWishlistRequest', (state) => {
      state.loading = true;
    })
    .addCase('addToWishlistSuccess', (state, action) => {
      state.loading = false;
      state.wishlist = action.payload;
    })
    .addCase('addToWishlistFail', (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    .addCase('addToWishlist', (state, action) => {
      const item = action.payload;
      const existingItem = state.wishlist.find((i) => i._id === item._id);
      if (existingItem) {
        state.wishlist = state.wishlist.map((i) =>
          i._id === existingItem._id ? item : i
        );
      } else {
        state.wishlist.push(item);
      }
    })
    .addCase('removeFromWishlistRequest', (state) => {
      state.loading = true;
    })
    .addCase('removeFromWishlistSuccess', (state, action) => {
      state.loading = false;
      state.wishlist = action.payload;
    })
    .addCase('removeFromWishlistFail', (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    .addCase('removeFromWishlist', (state, action) => {
      state.wishlist = state.wishlist.filter((i) => i._id !== action.payload);
    });
});

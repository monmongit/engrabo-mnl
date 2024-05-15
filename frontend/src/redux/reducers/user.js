import { createReducer } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: false,
  loading: false, // Ensure all initial state properties are defined here
  user: null,
  error: null,
  usersList: []
};

export const userReducer = createReducer(initialState, (builder) => {
  builder
    .addCase('LoadUserRequest', (state) => {
      state.loading = true;
    })
    .addCase('LoadUserSuccess', (state, action) => {
      state.isAuthenticated = true;
      state.loading = false;
      state.user = action.payload;
    })
    .addCase('LoadUserFail', (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
    })

    // Update user information
    .addCase('updateUserInfoRequest', (state) => {
      state.loading = true;
    })
    .addCase('updateUserInfoSuccess', (state, action) => {
      state.loading = false;
      state.user = action.payload;
    })
    .addCase('updateUserInfoFailed', (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })

    // Update User Address
    .addCase('updateUserAddressRequest', (state) => {
      state.addressloading = true;
    })
    .addCase('updateUserAddressSuccess', (state, action) => {
      state.addressloading = false;
      state.successMessage = action.payload;
      if (state.user) {
        state.user = action.payload.user;
      }
    })
    .addCase('updateUserAddressFailed', (state, action) => {
      state.addressloading = false;
      state.error = action.payload;
    })

    // Delete User Address
    .addCase('deleteUserAddressRequest', (state) => {
      state.addressloading = true;
    })
    .addCase('deleteUserAddressSuccess', (state, action) => {
      state.addressloading = false;
      state.successMessage = action.payload;
      if (state.user) {
        state.user = action.payload.user;
      }
    })
    .addCase('deleteUserAddressFailed', (state, action) => {
      state.addressloading = false;
      state.error = action.payload;
    })

    //  Get all user by admin
    .addCase('getAllUsersRequest', (state) => {
      state.addressloading = true;
    })
    .addCase('getAllUsersSuccess', (state, action) => {
      state.loading = false;
      state.usersList = action.payload.users;
    })
    .addCase('getAllUsersFailed', (state, action) => {
      state.addressloading = false;
      state.error = action.payload;
    })

    // Clear Error
    .addCase('clearError', (state) => {
      state.error = null;
    })

    // Clear Error
    .addCase('clearMessages', (state) => {
      state.successMessage = null;
    });
});

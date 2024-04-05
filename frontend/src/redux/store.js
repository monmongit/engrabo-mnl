import { configureStore } from '@reduxjs/toolkit';
import { userReducer } from './reducers/user';
import { adminReducer } from './reducers/admin';

const Store = configureStore({
  reducer: {
    user: userReducer,
    admin: adminReducer,
  },
});

export default Store;

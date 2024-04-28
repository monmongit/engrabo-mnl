import axios from 'axios';
import { server } from '../../server';

// load user
export const loadUser = () => async (dispatch) => {
  try {
    dispatch({
      type: 'LoadUserRequest',
    });
    const { data } = await axios.get(`${server}/user/getuser`, {
      withCredentials: true,
    });
    dispatch({
      type: 'LoadUserSuccess',
      payload: data.user,
    });
  } catch (error) {
    dispatch({
      type: 'LoadUserFail',
      payload: error.response.data.message,
    });
  }
};

// load Admin
export const loadAdmin = () => async (dispatch) => {
  try {
    dispatch({
      type: 'LoadAdminRequest',
    });
    const { data } = await axios.get(`${server}/admin/getAdmin`, {
      withCredentials: true,
    });
    dispatch({
      type: 'LoadAdminSuccess',
      payload: data.admin,
    });
  } catch (error) {
    dispatch({
      type: 'LoadAdminFail',
      payload: error.response.data.message,
    });
  }
};

// user update information
export const updateUserInformation =
  (name, email, phoneNumber, password) => async (dispatch) => {
    try {
      dispatch({
        type: 'updateUserInfoRequest',
      });

      const { data } = await axios.put(
        `${server}/user/update-user-info`,
        {
          email,
          password,
          phoneNumber,
          name,
        },
        {
          withCredentials: true,
          headers: {
            'Access-Control-Allow-Credentials': true,
          },
        }
      );

      dispatch({
        type: 'updateUserInfoSuccess',
        payload: data.user,
      });
    } catch (error) {
      dispatch({
        type: 'updateUserInfoFailed',
        payload: error.response.data.message,
      });
    }
  };

// get all users --- admin
export const getAllUsers = () => async (dispatch) => {
  try {
    dispatch({
      type: 'getAllUsersRequest',
    });

    const { data } = await axios.get(`${server}/user/admin-all-users`, {
      withCredentials: true,
    });

    dispatch({
      type: 'getAllUsersSuccess',
      payload: data.users,
    });
  } catch (error) {
    dispatch({
      type: 'getAllUsersFailed',
      payload: error.response.data.message,
    });
  }
};

// Update user address
export const updateUserAddress =
  (country, state, city, address1, address2, addressType) =>
  async (dispatch) => {
    try {
      dispatch({
        type: 'updateUserAddressRequest',
      });

      const { data } = await axios.put(
        `${server}/user/update-user-addresses`,
        {
          country,
          state,
          city,
          address1,
          address2,
          addressType,
        },
        { withCredentials: true }
      );

      dispatch({
        type: 'updateUserAddressSuccess',
        payload: {
          successMessage: 'User address updated successfully!',
          user: data.user,
        },
      });
    } catch (error) {
      dispatch({
        type: 'updateUserAddressFailed',
        payload: error.response.data.message,
      });
    }
  };

// Delete User Address
export const deleteUserAddress = (id) => async (dispatch) => {
  dispatch({ type: 'deleteUserAddressRequest' });
  try {
    const { data } = await axios.delete(
      `${server}/user/delete-user-address/${id}`,
      { withCredentials: true }
    );
    dispatch({
      type: 'deleteUserAddressSuccess',
      payload: {
        successMessage: 'Address deleted successfully!',
        user: data.user,
      },
    });
  } catch (error) {
    dispatch({
      type: 'deleteUserAddressFailed',
      payload: error.response.data.message,
    });
  }
};

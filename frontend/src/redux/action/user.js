import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";

// load user
export const loadUser = () => async (dispatch) => {
  try {
    dispatch({
      type: "LoadUserRequest",
    });
    const { data } = await axios.get(`${server}/user/getuser`, {
      withCredentials: true,
    });
    dispatch({
      type: "LoadUserSuccess",
      payload: data.user,
    });
  } catch (error) {
    dispatch({
      type: "LoadUserFail",
      payload: error.response.data.message,
    });
  }
};

// load Admin
export const loadAdmin = () => async (dispatch) => {
  try {
    dispatch({
      type: "LoadAdminRequest",
    });
    const { data } = await axios.get(`${server}/admin/getAdmin`, {
      withCredentials: true,
    });
    console.log(data);
    dispatch({
      type: "LoadAdminSuccess",
      payload: data.admin,
    });
  } catch (error) {
    dispatch({
      type: "LoadAdminFail",
      payload: error.response.data.message,
    });
  }
};

// user update information
export const updateUserInformation =
  (name, email, phoneNumber, password) => async (dispatch) => {
    try {
      dispatch({
        type: "updateUserInfoRequest",
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
            "Access-Control-Allow-Credentials": true,
          },
        }
      );

      dispatch({
        type: "updateUserInfoSuccess",
        payload: data.user,
      });
      toast.success("Your information updated successfully!");
    } catch (error) {
      dispatch({
        type: "updateUserInfoFailed",
        payload: error.response.data.message,
      });
      toast.error("Please input your correct password!");
    }
  };

// Update user address
export const updateUserAddress =
  (country, state, city, address1, address2, zipCode, addressType) =>
  async (dispatch) => {
    try {
      dispatch({
        type: "updateUserAddressRequest",
      });

      const { data } = await axios.put(
        `${server}/user/update-user-addresses`,
        {
          country,
          state,
          city,
          address1,
          address2,
          zipCode,
          addressType,
        },
        { withCredentials: true }
      );

      dispatch({
        type: "updateUserAddressSuccess",
        payload: {
          successMessage: "User address updated successfully!",
          user: data.user,
        },
      });
    } catch (error) {
      dispatch({
        type: "updateUserAddressFailed",
        payload: error.response.data.message,
      });
    }
  };

// Delete User Address
export const deleteUserAddress = (id) => async (dispatch) => {
  dispatch({ type: "deleteUserAddressRequest" });
  try {
    const { data } = await axios.delete(
      `${server}/user/delete-user-address/${id}`,
      { withCredentials: true }
    );
    dispatch({
      type: "deleteUserAddressSuccess",
      payload: {
        successMessage: "Address deleted successfully!",
        user: data.user,
      },
    });
  } catch (error) {
    dispatch({
      type: "deleteUserAddressFailed",
      payload: error.response.data.message,
    });
  }
};

// Get all user by admin
export const getAllUsers = (adminId) => async (dispatch) => {
  try {
    dispatch({
      type: "getAllUsersRequest",
    });
    console.log("admin id from redux: ", adminId);

    const { data } = await axios.get(
      `${server}/user/admin-all-users/${adminId}`,
      {
        withCredentials: true,
      }
    );

    console.log("data: ", data);

    dispatch({
      type: "getAllUsersSuccess",
      payload: { users: data.users },
    });
  } catch (error) {
    dispatch({
      type: "getAllUsersFailed",
      payload: error.response.data.message,
    });
  }
}; // Delete user
export const deleteUser = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: "deleteUserRequest" });

    const { data } = await axios.delete(`${server}/user/delete-user/${id}`, {
      withCredentials: true,
    });

    dispatch({
      type: "deleteUserSuccess",
      payload: data.message,
    });

    const adminId = getState().admin.admin._id;
    dispatch(getAllUsers(adminId)); // Refresh the user list

    toast.success("User deleted successfully!");
  } catch (error) {
    dispatch({
      type: "deleteUserFailed",
      payload: error.response.data.message,
    });
    toast.error(error.response.data.message);
  }
};

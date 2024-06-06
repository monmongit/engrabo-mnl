import axios from 'axios';
import { server } from '../../server';
import { toast } from 'react-toastify';

// Add to Wishlist
export const addToWishlist = (data) => async (dispatch, getState) => {
  try {
    dispatch({
      type: 'addToWishlistRequest',
    });

    const { user } = getState().user;

    if (user) {
      const { data: response } = await axios.post(
        `${server}/user/add-to-wishlist`,
        { productId: data._id },
        { withCredentials: true }
      );

      dispatch({
        type: 'addToWishlistSuccess',
        payload: response.wishlist,
      });

      toast.success(`${data.name} added to wishlist successfully!`);
    } else {
      dispatch({
        type: 'addToWishlist',
        payload: data,
      });
      localStorage.setItem(
        'wishlistItems',
        JSON.stringify(getState().wishlist.wishlist)
      );
      toast.success(`${data.name} added to wishlist successfully!`);
    }
  } catch (error) {
    dispatch({
      type: 'addToWishlistFail',
      payload: error.response.data.message,
    });
    toast.error(error.response.data.message);
  }
};

// Remove from Wishlist
export const removeFromWishlist = (data) => async (dispatch, getState) => {
  try {
    dispatch({
      type: 'removeFromWishlistRequest',
    });

    const { user } = getState().user;

    if (user) {
      const { data: response } = await axios.post(
        `${server}/user/remove-from-wishlist`,
        { productId: data._id },
        { withCredentials: true }
      );

      dispatch({
        type: 'removeFromWishlistSuccess',
        payload: response.wishlist,
      });

      toast.error(`${data.name} removed from wishlist successfully!`);
    } else {
      dispatch({
        type: 'removeFromWishlist',
        payload: data._id,
      });
      localStorage.setItem(
        'wishlistItems',
        JSON.stringify(getState().wishlist.wishlist)
      );
      toast.error(`${data.name} removed from wishlist successfully!`);
    }
  } catch (error) {
    dispatch({
      type: 'removeFromWishlistFail',
      payload: error.response.data.message,
    });
    toast.error(error.response.data.message);
  }
};

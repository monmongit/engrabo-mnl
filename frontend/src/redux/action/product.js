import axios from 'axios';
import { server } from '../../server';

// Create Product
export const createProduct =
  (
    name,
    description,
    category,
    tags,
    grossPrice,
    originalPrice,
    discountPrice,
    stock,
    adminId,
    images
  ) =>
  async (dispatch) => {
    try {
      dispatch({
        type: 'productCreateRequest',
      });

      const { data } = await axios.post(
        `${server}/product/create-product`,
        name,
        description,
        category,
        tags,
        grossPrice,
        originalPrice,
        discountPrice,
        stock,
        adminId,
        images
      );
      dispatch({
        type: 'productCreateSuccess',
        payload: data.product,
      });
    } catch (error) {
      dispatch({
        type: 'productCreateFail',
        payload: error.response.data.message,
      });
    }
  };

// Get All Products Admin
export const getAllProductsAdmin = (id) => async (dispatch) => {
  try {
    dispatch({
      type: 'getAllProductsAdminRequest',
    });

    const { data } = await axios.get(
      `${server}/product/get-all-products-admin/${id}`
    );
    dispatch({
      type: 'getAllProductsAdminSuccess',
      payload: data.products,
    });
  } catch (error) {
    dispatch({
      type: 'getAllProductsAdminFailed',
      payload: error.response.data.message,
    });
  }
};

// Delete Product
export const deleteProduct = (id) => async (dispatch) => {
  try {
    dispatch({ type: 'deleteProductRequest' });
    const { data } = await axios.delete(
      `${server}/product/delete-admin-product/${id}`,
      {
        withCredentials: true,
      }
    );
    dispatch({
      type: 'deleteProductSuccess',
      payload: data.message,
    });
  } catch (error) {
    dispatch({
      type: 'deleteProductFailed',
      payload: error.response.data.message,
    });
  }
};

// Search Products
export const searchProducts = (searchTerm) => async (dispatch) => {
  try {
    dispatch({ type: 'searchProductsRequest' });

    const { data } = await axios.get(
      `${server}/product/search-products?search=${searchTerm}`
    );

    dispatch({
      type: 'searchProductsSuccess',
      payload: data.products,
    });
  } catch (error) {
    dispatch({
      type: 'searchProductsFail',
      payload: error.response.data.message,
    });
  }
};

// Get All Products for all users
export const getAllProducts = () => async (dispatch) => {
  try {
    dispatch({
      type: 'getAllProductsRequest',
    });

    const { data } = await axios.get(`${server}/product/get-all-products`);
    dispatch({
      type: 'getAllProductsSuccess',
      payload: data.products,
    });
  } catch (error) {
    dispatch({
      type: 'getAllProductsFailed',
      payload: error.response.data.message,
    });
  }
};

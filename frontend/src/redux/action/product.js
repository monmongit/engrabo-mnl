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
    images,
    instructions,
    dropdowns,
    sizes,
<<<<<<< HEAD
    colors,
    mediaType,
    imageOptions,
    textOptions
=======
    packaging
>>>>>>> d39bfceac9eaca282b8a641b4e1ede1fe3f05a3d
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
        images,
        instructions,
        dropdowns,
        sizes,
<<<<<<< HEAD
        colors,
        mediaType,
        imageOptions,
        textOptions
=======
        packaging
>>>>>>> d39bfceac9eaca282b8a641b4e1ede1fe3f05a3d
      );

      console.log('action-create new product data: ', data);
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

// Update Product
export const updateProduct = (productData) => async (dispatch) => {
  try {
    dispatch({ type: 'updateProductRequest' });

    const { data } = await axios.put(
      `${server}/product/update-product/${productData.id}`,
      productData
    );

    dispatch({
      type: 'updateProductSuccess',
      payload: data.product,
    });
  } catch (error) {
    dispatch({
      type: 'updateProductFail',
      payload: error.response.data.message,
    });
  }
};

// Get Product Details
export const getProductDetails = (id) => async (dispatch) => {
  try {
    dispatch({
      type: 'getProductDetailsRequest',
    });

    const { data } = await axios.get(
      `${server}/product/get-product-details/${id}`
    );
    dispatch({
      type: 'getProductDetailsSuccess',
      payload: data.product,
    });
  } catch (error) {
    dispatch({
      type: 'getProductDetailsFail',
      payload: error.response.data.message,
    });
  }
};

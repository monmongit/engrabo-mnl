import axios from 'axios';
import { server } from '../../server';
import { toast } from 'react-toastify';

// Create Category
export const createCategory = (categoryData) => async (dispatch) => {
  try {
    dispatch({
      type: 'createCategoryRequest',
    });

    const config = { headers: { 'Content-Type': 'multipart/form-data' } }; // This ensures proper handling of FormData

    const { data } = await axios.post(
      `${server}/category/create-category`,
      categoryData,
      config
    );

    dispatch({
      type: 'createCategorySuccess',
      payload: data.category,
    });
  } catch (error) {
    dispatch({
      type: 'createCategoryFail',
      payload: error.response ? error.response.data.message : error.message,
    });
    toast.error(error.response ? error.response.data.message : error.message);
  }
};

// Fetch Categories
export const getAllCategories = () => async (dispatch) => {
  try {
    dispatch({ type: 'fetchCategoriesRequest' });
    const { data } = await axios.get(`${server}/category/categories`); // Corrected URL
    dispatch({
      type: 'fetchCategoriesSuccess',
      payload: data.categories,
    });
  } catch (error) {
    dispatch({
      type: 'fetchCategoriesFail',
      payload: error.response.data.message,
    });
  }
};

// Update Category
export const updateCategory = (id, categoryData) => async (dispatch) => {
  try {
    dispatch({ type: 'updateCategoryRequest' });
    const { data } = await axios.put(
      `${server}/update-category/${id}`,
      categoryData
    );
    dispatch({
      type: 'updateCategorySuccess',
      payload: data.category,
    });
  } catch (error) {
    dispatch({
      type: 'updateCategoryFail',
      payload: error.response.data.message,
    });
  }
};

// Delete Category
export const deleteCategory = (id) => async (dispatch) => {
  try {
    dispatch({ type: 'deleteCategoryRequest' });
    // Use `server` which already includes the `/api/v2` prefix
    const { data } = await axios.delete(
      `${server}/category/delete-category/${id}`,
      {
        withCredentials: true,
      }
    );
    dispatch({
      type: 'deleteCategorySuccess',
      payload: data.id,
    });
  } catch (error) {
    dispatch({
      type: 'deleteCategoryFail',
      payload: error.response ? error.response.data.message : error.message,
    });
    toast.error(error.response ? error.response.data.message : error.message);
  }
};

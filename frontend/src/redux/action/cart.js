// Add to Cart
export const addTocart = (data) => async (dispatch, getState) => {
  const { price, qty } = data;
  const subTotal = price * qty;

  const updatedData = { ...data, subTotal };

  dispatch({
    type: 'addToCart',
    payload: updatedData,
  });

  localStorage.setItem('cartItems', JSON.stringify(getState().cart.cart));
  return updatedData;
};

// Remove from Cart
export const removeFromCart = (data) => async (dispatch, getState) => {
  dispatch({
    type: 'removeFromCart',
    payload: data._id,
  });
  localStorage.setItem('cartItems', JSON.stringify(getState().cart.cart));
  return data;
};

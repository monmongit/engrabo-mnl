import React, { useState } from 'react';
import { RxCross1 } from 'react-icons/rx';
import styles from '../../styles/style';
import { HiOutlineMinus, HiPlus } from 'react-icons/hi';
import { IoBagHandleOutline } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { backend_url } from '../../server';
import { addTocart, removeFromCart } from '../../redux/action/cart';
import { toast } from 'react-toastify';
const Cart = ({ setOpenCart }) => {
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const removeFromCartHandler = (data) => {
    dispatch(removeFromCart(data));
    toast.error(`${data.name} removed to cart successfully!`);
  };

  const totalPrice = cart.reduce(
    (acc, item) => acc + item.qty * item.originalPrice,
    0
  );

  const quantityChangeHandler = (data) => {
    dispatch(addTocart(data));
  };

  return (
    <div className="fixed top-0 left-0 w-full bg-[#0000004b] h-screen z-10 ">
      <div className="fixed top-0 right-0 h-[100vh] w-[25%]  bg-gradient-to-r from-[#e9d18e] to-[#fff4d7] flex flex-col justify-between shadow-sm !overflow-y-scroll hide-scrollbar">
        {cart && cart.length === 0 ? (
          <div className="w-full h-screen flex items-center justify-center">
            <div className="flex w-full justify-end pt-5 pr-5 fixed top-3 right-3">
              <RxCross1
                size={25}
                className="cursor-pointer"
                onClick={() => setOpenCart(false)}
              />
            </div>
            <h5> Cart Items is empty!</h5>
          </div>
        ) : (
          <>
            <div>
              <div className="flex w-full justify-end pt-5 pr-5">
                <RxCross1
                  size={20}
                  className="cursor-pointer text-[#171203]"
                  onClick={() => setOpenCart(false)}
                />
              </div>

              {/* Items length */}
              <div className={`${styles.normalFlex} p-4`}>
                <IoBagHandleOutline size={25} />
                <h5 className="pl-2 text-[20px] font-[500] text-[#171203]">
                  {cart && cart.length} items
                </h5>
              </div>

              {/* Cart Single Items */}
              <br />
              <div className="w-full border-t border-[#d8c68f]">
                {cart &&
                  cart.map((i, index) => (
                    <CartSingle
                      key={index}
                      data={i}
                      quantityChangeHandler={quantityChangeHandler}
                      removeFromCartHandler={removeFromCartHandler}
                    />
                  ))}
              </div>
            </div>
            <div className="px-5 mb-3">
              {/* Checkout Button */}
              <Link to="/checkout">
                <div
                  className={`h-[45px] flex items-center justify-center w-[100%] bg-[#171203] rounded-[5px]`}
                >
                  <h1 className="text-[#fff4d7] text-[18px] font-[600]">
                    Checkout Now (₱ {totalPrice})
                  </h1>
                </div>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const CartSingle = ({ data, quantityChangeHandler, removeFromCartHandler }) => {
  const [value, setValue] = useState(data.qty);
  const totalPrice = data.originalPrice * value;

  const increment = (data) => {
    if (data.stock <= value) {
      toast.error(
        `${data.name} stock is limited! Please contact us to reserve your order!`
      );
    } else {
      setValue(value + 1);
      const updateCartData = { ...data, qty: value + 1 };
      quantityChangeHandler(updateCartData);
    }
  };

  const decrement = (data) => {
    setValue(value === 1 ? 1 : value - 1);
    const updateCartData = { ...data, qty: value === 1 ? 1 : value - 1 };
    quantityChangeHandler(updateCartData);
  };
  return (
    <div className="border-b p-4 border-[#d8c68f]">
      <div className="w-full flex items-center">
        <div>
          {/* Button Add and Minus Product */}
          <div
            className={`bg-gradient-to-r from-[#534723] to-[#171203] hover:opacity-80 transition duration-300 ease-in-out rounded-full w-[25px] h-[25px] ${styles.normalFlex} justify-center cursor-pointer`}
            onClick={() => increment(data)}
          >
            <HiPlus size={18} color="#fff" />
          </div>
          <span className="pl-[10px]">{data.qty}</span>
          <div
            className="bg-gradient-to-r from-[#dbcca1] to-[#b5a060] hover:opacity-80 transition duration-300 ease-in-out rounded-full w-[25px] h-[25px] flex items-center justify-center cursor-pointer"
            onClick={() => decrement(data)}
          >
            <HiOutlineMinus size={16} color="#171203" />
          </div>
        </div>

        {/* Image Product */}
        <img
          src={`${backend_url}/${data?.images[0]}`}
          alt=""
          className="w-[130px] h-min ml-2 rounded-[5px] "
        />

        {/* Price and Details of Product */}
        <div className="pl-[10px] w-[50%]">
          <h1 className="text-[15px] flex-grow">
            {data.name.length > 15 ? data.name.slice(0, 15) + '...' : data.name}
          </h1>
          <h4 className="font-[600] text-[17px] text-[#171203]">
            ₱ {data.originalPrice}
          </h4>
          <h4 className="font-[400] text-[14px] pt-[3px] text-[#534723] font-Roboto">
            Stocks: {data.stock}
          </h4>
          <h4 className="font-[400] text-[14px] pt-[3px] text-[#534723] font-Roboto">
            Total: ₱ {totalPrice}
          </h4>
        </div>
        <RxCross1
          className="cursor-pointer "
          onClick={() => removeFromCartHandler(data)}
        />
      </div>
    </div>
  );
};

export default Cart;

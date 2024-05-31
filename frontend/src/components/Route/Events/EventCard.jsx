import React from 'react';
import styles from '../../../styles/style';
import CountDown from './CountDown';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

import { addTocart } from '../../../redux/action/cart';
import { useDispatch, useSelector } from 'react-redux';

const EventCard = ({ active, data }) => {
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const addToCartHandler = (data) => {
    const isItemExists = cart && cart.find((i) => i._id === data._id);
    if (isItemExists) {
      toast.error('Item already in cart!');
    } else {
      if (data.stock < 1) {
        toast.error(
          'Product stock is limited, kindly message us to reserve your order!'
        );
      } else {
        const cartData = { ...data, qty: 1 };
        dispatch(addTocart(cartData));
        toast.success('Item added to cart successfull!');
      }
    }
  };
  return (
    <div
      className={`grid grid-cols-1 lg:grid-cols-2 w-full bg-white rounded-lg ${
        active ? 'unset' : 'mb-12'
      } p-2`}
    >
      {/* Event Images */}
      <div className="w-[60%] m-auto">
        <img src={`${data.images[0]?.url}`} alt="" />
      </div>
      <div className="w-full lg:w-[50%] flex flex-col justify-center">
        <h2 className={`${styles.productTitle}`}>{data.name}</h2>
        <p className="text-[#534723] text-justify text-[17px] leading-8 pb-10 whitespace-pre-line">
          {data.description}
        </p>
        <div className="flex py-2 justify-between">
          <div className="flex">
            <h5 className="font-[500] text-[18px] text-[#d55b45] pr-3 line-through">
              <p>₱ {data.originalPrice}</p>
            </h5>
            <h5 className="font-bold text-[20px] text-[#171203] font-Roboto">
              <p>₱ {data.discountPrice}</p>
            </h5>
          </div>
        </div>
        <div className="flex py-2 pr-2 justify-between">
          {/* Products Stock */}
          <h4 className="font-[400] text-[#534723] font-Roboto">
            Stocks: {data.stock}
          </h4>
          {/* Sold of Product */}
          <span className="font-[400] text-[17px] text-[#b19b56]">
            {data?.sold_out} sold
          </span>
        </div>
        <CountDown data={data} />
        <br />
        <div className="flex items-center">
          <Link to={`/product/${data._id}?isEvent=true`}>
            <div className={`${styles.button} text-[#fff]`}>See Details</div>
          </Link>
          <div
            className={`${styles.button} text-[#fff] ml-5`}
            onClick={() => addToCartHandler(data)}
          >
            Add to cart
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;

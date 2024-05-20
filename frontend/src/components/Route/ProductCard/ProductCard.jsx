import React, { useEffect, useState } from 'react';
import {
  AiFillHeart,
  AiOutlineEye,
  AiOutlineHeart,
  AiOutlineShoppingCart,
} from 'react-icons/ai';
import { Link } from 'react-router-dom';
import styles from '../../../styles/style';
import ProductDetailsCard from '../ProductDetailsCard/ProductDetailsCard';
import { FaRegEdit } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import {
  addToWishlist,
  removeFromWishlist,
} from '../../../redux/action/wishlist';
import { toast } from 'react-toastify';
import { addTocart } from '../../../redux/action/cart';
import Ratings from '../../Products/Ratings';

const ProductCard = ({ data, isEvent }) => {
  const { wishlist } = useSelector((state) => state.wishlist);
  const { cart } = useSelector((state) => state.cart);

  const [click, setClick] = useState(false);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (wishlist && wishlist.find((i) => i._id === data._id)) {
      setClick(true);
    } else {
      setClick(false);
    }
  }, [wishlist, data._id]);

  const removeFromWishlistHandler = (data) => {
    setClick(!click);
    dispatch(removeFromWishlist(data));
    toast.error(`${data.name} removed to wishlist successfully!`);
  };

  const addToWishlistHandler = (data) => {
    setClick(!click);
    dispatch(addToWishlist(data));
    toast.success(`${data.name} added to wishlist successfully!`);
  };

  const addToCartHandler = (id) => {
    const isItemExists = cart && cart.find((i) => i._id === id);
    if (isItemExists) {
      toast.error(`${data.name} already in a cart!`);
    } else {
      if (data.stock < 1) {
        toast.error(
          `${data.name} stock is limited! Please contact us to reserve your order!`
        );
      } else {
        const cartData = { ...data, qty: 1 };
        dispatch(addTocart(cartData));
        toast.success(`${data.name} added to cart successfully!`);
      }
    }
  };

  return (
    <>
      <div className="800px:w-full w-[300px] h-[370px]  bg-white rounded-lg shadow-sm p-3 relative cursor-pointer">
        <Link
          to={`${
            isEvent === true
              ? `/product/${data._id}?isEvent=true`
              : `/product/${data._id}`
          }`}
        >
          <img
            src={`${data.images && data.images[0]?.url} `}
            alt=""
            className="w-full h-[170px] object-contain"
          />
        </Link>

        <Link
          to={`${
            isEvent === true
              ? `/product/${data._id}?isEvent=true`
              : `/product/${data._id}`
          }`}
        >
          {/* Name of Product */}
          <h4 className="pb-1 pt-4 font-[500]">
            {data.name.length > 40 ? data.name.slice(0, 40) + '...' : data.name}
          </h4>

          {/* Product Description */}
          <p className="text-justify pt-1 pb-2 text-[#534723]">
            {data.description.length > 40
              ? data.description.slice(0, 40) + '...'
              : data.description}
          </p>

          {/* Rating of Product */}
          <div className="flex pb-2 pt-1">
            <Ratings rating={data?.ratings} />
          </div>

          {/* Price and Sold of Product */}
          <div className="py-2 flex items-center justify-between">
            {/* Price of Product */}
            <div className="flex">
              <h5 className={`${styles.productDiscountPrice}`}>
                ₱ {data.discountPrice ? data.discountPrice : data.originalPrice}
              </h5>
              <h4 className={`${styles.price}`}>
                {data.discountPrice ? '₱ ' + data.originalPrice : null}
              </h4>
            </div>

            {/* Sold of Product */}
            <span className="font-[400] text-[17px] text-[#b19b56]">
              {data?.sold_out} sold
            </span>
          </div>
        </Link>

        {/* Option of Product */}
        <div>
          {click ? (
            <AiFillHeart
              size={22}
              className="cursor-pointer absolute right-2 top-5"
              onClick={() => removeFromWishlistHandler(data)}
              color={click ? '#171203' : '#171203'}
              title="Removed from Wishlist"
            />
          ) : (
            <AiOutlineHeart
              size={22}
              className="cursor-pointer absolute right-2 top-5"
              onClick={() => addToWishlistHandler(data)}
              color={click ? '#171203' : '#171203'}
              title="Added to Wishlist"
            />
          )}
          <AiOutlineEye
            size={22}
            className="cursor-pointer absolute right-2 top-14"
            onClick={() => setOpen(!open)}
            color="#171203"
            title="Quick View"
          />
          <AiOutlineShoppingCart
            size={25}
            className="cursor-pointer absolute right-2 top-24"
            onClick={() => addToCartHandler(data._id)}
            color="#171203"
            title="Add to Cart"
          />
          <FaRegEdit
            size={23}
            className="cursor-pointer absolute right-2 top-36"
            onClick={() => setOpen(!open)}
            color="#171203"
            title="Edit Product"
          />
          {open ? <ProductDetailsCard setOpen={setOpen} data={data} /> : null}
        </div>
      </div>
    </>
  );
};

export default ProductCard;

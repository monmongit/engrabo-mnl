import React, { useEffect, useState } from "react";
import {
  AiFillHeart,
  AiOutlineEye,
  AiOutlineHeart,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { Link } from "react-router-dom";
import styles from "../../../styles/style";
import ProductDetailsCard from "../ProductDetailsCard/ProductDetailsCard";
import { FaRegEdit } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../../redux/action/wishlist";
import { toast } from "react-toastify";
import { addTocart } from "../../../redux/action/cart";
import Ratings from "../../Products/Ratings";

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
    toast.error(`${data.name} removed from wishlist successfully!`);
  };

  const addToWishlistHandler = (data) => {
    setClick(!click);
    dispatch(addToWishlist(data));
    toast.success(`${data.name} added to wishlist successfully!`);
  };

  const addToCartHandler = (id) => {
    const isItemExists = cart && cart.find((i) => i._id === id);
    if (isItemExists) {
      toast.error(`${data.name} already in cart!`);
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
      <div className="w-60 p-2 bg-white rounded-xl transform transition-all hover:translate-y-2 duration-300 shadow-lg hover:shadow-2xl mt-4 mb-4 lg:mt-0">
        <div className="w-full h-40 overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75">
          <Link
            to={`${
              isEvent === true
                ? `/product/${data._id}?isEvent=true`
                : `/product/${data._id}`
            }`}
          >
            <img
              src={data.images && data.images[0]?.url}
              alt={data.name}
              className="w-full h-full object-cover object-center"
            />
          </Link>
        </div>

        {/* product information */}
        <div className="p-2">
          {/* name and price */}
          <Link
            to={`${
              isEvent === true
                ? `/product/${data._id}?isEvent=true`
                : `/product/${data._id}`
            }`}
          >
            <h2 className="font-bold text-lg mb-2">
              {data.name.length > 40
                ? data.name.slice(0, 40) + "..."
                : data.name}
            </h2>
          </Link>
          <div className="flex gap-1">
            <span className="text-xl font-semibold">
              ₱{data.discountPrice ? data.discountPrice : data.originalPrice}
            </span>
            {data.discountPrice && (
              <div className="flex items-center gap-2">
                <span className="text-sm line-through opacity-75">
                  ₱{data.originalPrice}
                </span>
                <span className="font bold text-sm p-1 bg-yellow-300">
                  Save{" "}
                  {Math.round(
                    (1 - data.discountPrice / data.originalPrice) * 100
                  )}
                  %
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center mt-2 gap-1">
            <Ratings rating={data?.ratings} />
            <p className="font-bold text-xs text-gray-700">
              {data.ratings ? data?.ratings : "0.0"}
            </p>
          </div>

          <p className="text-sm text-gray-600 mt-2 mb-2">
            {data.description.length > 40
              ? data.description.slice(0, 40) + "..."
              : data.description}
          </p>
        </div>

        {/* buttons */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <button
            className="px-3 py-1 rounded-lg bg-gray-300 hover:bg-blue-400"
            onClick={() => setOpen(!open)}
          >
            <AiOutlineEye className="w-6" />
          </button>
          {click ? (
            <button
              className="px-3 py-1 rounded-lg bg-gray-300 hover:bg-yellow-400 hover"
              onClick={() => removeFromWishlistHandler(data)}
            >
              <AiFillHeart className="w-6" color="white" />
            </button>
          ) : (
            <button
              className="px-3 py-1 rounded-lg bg-gray-300 hover:bg-yellow-400"
              onClick={() => addToWishlistHandler(data)}
            >
              <AiOutlineHeart className="w-6" />
            </button>
          )}
          <button
            className="flex items-center gap-2 px-3 py-1 rounded-lg bg-gray-300 hover:bg-green-400"
            onClick={() => addToCartHandler(data._id)}
          >
            <AiOutlineShoppingCart />
          </button>
        </div>
      </div>
      {open ? <ProductDetailsCard setOpen={setOpen} data={data} /> : null}
    </>
  );
};

export default ProductCard;

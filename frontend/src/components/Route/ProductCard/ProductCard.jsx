import React, { useEffect, useState } from "react";
import {
  AiFillHeart,
  AiOutlineEye,
  AiOutlineHeart,
  AiOutlineShoppingCart,
  AiFillStar,
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
      <div className="w-full h-[370px]  bg-white rounded-lg shadow-sm p-3 relative cursor-pointer">
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
            className="w-5/6 h-44 object-contain"
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
            {data.name.length > 40 ? data.name.slice(0, 40) + "..." : data.name}
          </h4>

          {/* Product Description */}
          <p className="text-justify pt-1 pb-2 text-[#534723]">
            {data.description.length > 40
              ? data.description.slice(0, 40) + "..."
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
                ₱{data.discountPrice ? data.discountPrice : data.originalPrice}
              </h5>
              <h4 className={`${styles.price}`}>
                {data.discountPrice ? "₱ " + data.originalPrice : null}
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
              color={click ? "#171203" : "#171203"}
              title="Removed from Wishlist"
            />
          ) : (
            <AiOutlineHeart
              size={22}
              className="cursor-pointer absolute right-2 top-5"
              onClick={() => addToWishlistHandler(data)}
              color={click ? "#171203" : "#171203"}
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

// const ProductCard2 = () => {
//   return (
//     // card
//     <div className="w-60 p-2 bg-white rounded-xl transform transition-all hover:translate-y-2 duration-300 shadow-lg hover:shadow-2xl mt-4 mb-4 lg:mt-0">
//       <Link
//         to={`${
//           isEvent === true
//             ? `/product/${data._id}?isEvent=true`
//             : `/product/${data._id}`
//         }`}
//       >
//         <div class="w-full h-40 overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75">
//           <img
//             src="https://pbs.twimg.com/media/FsjFOdeacAU05Rj.jpg:large"
//             alt="Front of men's Basic Tee in black."
//             class="w-full h-full object-cover object-center"
//           />
//         </div>
//       </Link>

//       <Link
//         to={`${
//           isEvent === true
//             ? `/product/${data._id}?isEvent=true`
//             : `/product/${data._id}`
//         }`}
//       >
//         {/* product information */}
//         <div className="p-2">
//           {/* name and price */}
//           <h2 className="font-bold text-lg mb-2">
//             {data.name.length > 40 ? data.name.slice(0, 40) + "..." : data.name}
//           </h2>
//           <span className="text-xl font-semibold">
//             ₱{data.discountPrice ? data.discountPrice : data.originalPrice}
//           </span>

//           <div className="flex items-center gap-2">
//             <span className="text-sm line-through opacity-75">
//               {" "}
//               {data.discountPrice ? "₱ " + data.originalPrice : null}
//             </span>
//             <span className="font bold text-sm p-2 bg-yellow-300">
//               {data.discountPrice ? "discounted" : ""}
//             </span>
//           </div>

//           <div className="flex items-center mt-2 gap-1">
//             {/* <AiFillStar className="w-5" /> */}
//             <Ratings rating={data?.ratings} />
//             <p className="font-bold text-xs text-gray-700">Ratings</p>
//           </div>

//           <p className="text-sm text-gray-600 mt-2 mb-2">
//             {data.description.length > 40
//               ? data.description.slice(0, 40) + "..."
//               : data.description}
//           </p>
//         </div>
//       </Link>

//       {/* buttons */}
//       <div className="flex items-center justify-center gap-2 mb-3">
//         <button className="px-3 py-1 rounded-lg bg-gray-300 hover:bg-blue-400">
//           <AiOutlineEye className="w-6" />
//         </button>
//         <button className="px-3 py-1 rounded-lg bg-gray-300 hover:bg-blue-400">
//           <AiOutlineHeart className="w-6" />
//         </button>
//         <button className=" flex items-center gap-2 px-3 py-1 rounded-lg bg-gray-300 hover:bg-blue-400">
//           <AiOutlineShoppingCart />
//           {/* <p className="">cart</p>  */}
//         </button>
//       </div>
//     </div>
//   );
// };

export default ProductCard;

import React, { useState } from 'react';
import {
  AiFillHeart,
  AiFillStar,
  AiOutlineEye,
  AiOutlineHeart,
  AiOutlineShoppingCart,
  AiOutlineStar,
} from 'react-icons/ai';
import { Link } from 'react-router-dom';
import styles from '../../../styles/style';
import ProductDetailsCard from '../ProductDetailsCard/ProductDetailsCard';

const ProductCard = ({ data }) => {
  const [click, setClick] = useState(false);
  const [open, setOpen] = useState(false);

  const d = data.name;
  const product_name = d.replace(/\s+/g, '-');

  return (
    <>
      <div className="w-full h-[370px] bg-white rounded-lg shadow-sm p-3 relative cursor-pointer">
        <div className="flex justify-end"></div>

        {/* Image of Product */}
        <Link to={`/product/${product_name}`}>
          <img
            src={data.image_Url[0].url}
            alt=""
            className="w-full h-[170px] object-contain"
          />
        </Link>

        {/* Shop Name of Product */}
        <Link to="/">
          <h5 className="text-[#b19b56]">{data.shop.name}</h5>
        </Link>

        <Link to={`/product/${product_name}`}>
          {/* Name of Product */}
          <h4 className="pb-3 font-[500] text-[#171203]">
            {data.name.length > 40 ? data.name.slice(0, 40) + '...' : data.name}
          </h4>

          {/* Rating of Product */}
          <div className="flex">
            <AiFillStar
              className="mr-2 cursor-pointer"
              size={20}
              color="#F6BA00"
            />
            <AiFillStar
              className="mr-2 cursor-pointer"
              size={20}
              color="#F6BA00"
            />
            <AiFillStar
              className="mr-2 cursor-pointer"
              size={20}
              color="#F6BA00"
            />
            <AiFillStar
              className="mr-2 cursor-pointer"
              size={20}
              color="#F6BA00"
            />
            <AiOutlineStar
              className="mr-2 cursor-pointer"
              size={20}
              color="#F6BA00"
            />
          </div>

          {/* Price and Sold of Product */}
          <div className="py-2 flex items-center justify-between">
            {/* Price of Product */}
            <div className="flex">
              <h5 className={`${styles.productDiscountPrice} text-[#171203]`}>
                ₱ {data.price === 0 ? data.price : data.discount_price}
              </h5>
              <h4 className={`${styles.price}`}>
                {data.price ? '₱ ' + data.price : null}
              </h4>
            </div>

            {/* Sold of Product */}
            <span className="font-[400] text-[17px] text-[#b19b56]">
              {data.total_sell} sold
            </span>
          </div>
        </Link>

        {/* Option of Product */}
        <div>
          {click ? (
            <AiFillHeart
              size={22}
              className="cursor-pointer absolute right-2 top-5"
              onClick={() => setClick(!click)}
              color={click ? '#171203' : '#171203'}
              title="Removed from Wishlist"
            />
          ) : (
            <AiOutlineHeart
              size={22}
              className="cursor-pointer absolute right-2 top-5"
              onClick={() => setClick(!click)}
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
            onClick={() => setOpen(!open)}
            color="#171203"
            title="Add to Cart"
          />
          {open ? <ProductDetailsCard setOpen={setOpen} data={data} /> : null}
        </div>
      </div>
    </>
  );
};

export default ProductCard;

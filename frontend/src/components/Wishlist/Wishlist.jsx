import React, { useState } from 'react';
import { RxCross1 } from 'react-icons/rx';
import styles from '../../styles/style';
import { BsCartPlus } from 'react-icons/bs';
import { AiOutlineHeart } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';
import { removeFromWishlist } from '../../redux/action/wishlist';
import { addTocart } from '../../redux/action/cart';
import { toast } from 'react-toastify';

const Wishlist = ({ setOpenWishlist }) => {
  const { wishlist } = useSelector((state) => state.wishlist);
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const removeFromWishlistHandler = (data) => {
    dispatch(removeFromWishlist(data));
    toast.error(`${data.name} removed to wishlist successfully!`);
  };

  const addToCartHandler = (data) => {
    const itemInCart = cart.find((item) => item._id === data._id);

    if (itemInCart) {
      toast.error(`${data.name} already in the cart!`);
    } else {
      const newData = { ...data, qty: 1 };
      dispatch(addTocart(newData));
      dispatch(removeFromWishlist(data));
      setOpenWishlist(false);
      toast.success(`${data.name} added to cart successfully!`);
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full bg-[#0000004b] h-screen z-10 ">
      <div className="fixed top-0 right-0 h-[100vh] w-[70%] 800px:w-[25%] bg-gradient-to-r from-[#e9d18e] to-[#fff4d7] flex flex-col justify-between shadow-sm overflow-y-scroll hide-scrollbar ">
        {wishlist && wishlist.length === 0 ? (
          <div className="w-full h-screen flex items-center justify-center">
            <div className="flex w-full justify-end pt-5 pr-5 fixed top-3 right-3">
              <RxCross1
                size={25}
                className="cursor-pointer"
                onClick={() => setOpenWishlist(false)}
              />
            </div>
            <h5> Wishlist Items is empty!</h5>
          </div>
        ) : (
          <>
            <div>
              <div className="flex w-full justify-end pt-5 pr-5">
                <RxCross1
                  size={20}
                  className="cursor-pointer text-[#171203]"
                  onClick={() => setOpenWishlist(false)}
                />
              </div>

              {/* Items length */}
              <div className={`${styles.normalFlex} p-4`}>
                <AiOutlineHeart size={25} />
                <h5 className="pl-2 text-[20px] font-[500] text-[#171203]">
                  {wishlist && wishlist.length} items
                </h5>
              </div>

              {/* Cart Single Items */}
              <br />
              <div className="w-full border-t border-[#d8c68f]">
                {wishlist &&
                  wishlist.map((i, index) => (
                    <CartSingle
                      key={index}
                      data={i}
                      removeFromWishlistHandler={removeFromWishlistHandler}
                      addToCartHandler={addToCartHandler}
                    />
                  ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const CartSingle = ({ data, removeFromWishlistHandler, addToCartHandler }) => {
  const [value] = useState(1);
  console.log(data.originalPrice);
  const totalPrice = data.originalPrice * value;
  return (
    <div className="border-b p-4 border-[#d8c68f]">
      <div className="w-full flex items-center">
        <RxCross1
          className="w=full flex items-center cursor-pointer text-[#6b540f]"
          size={12}
          onClick={() => removeFromWishlistHandler(data)}
        />
        {/* Image Product */}
        <img
          src={`${data?.images[0]?.url}`}
          alt=""
          className="w-[130px] h-min ml-2 rounded-[5px]"
        />

        {/* Price and Details of Product */}
        <div className="pl-[10px] w-[50%] ">
          <h1 className="text-[17px]">
            {data.name.length > 15 ? data.name.slice(0, 15) + '...' : data.name}
          </h1>
          <h4 className="font-[600] text-[17px] pt-[3px] text-[#171203] font-Roboto">
            ₱ {totalPrice}
          </h4>
          <h4 className="font-[400] text-[17px] pt-[3px] text-[#534723] font-Roboto">
            Stocks: {data.stock}
          </h4>
        </div>
        <div>
          <BsCartPlus
            size={20}
            className="cursor-pointer"
            title="Add to Cart"
            onClick={() => addToCartHandler(data)}
          />
        </div>
      </div>
    </div>
  );
};

export default Wishlist;

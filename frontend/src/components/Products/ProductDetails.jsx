import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../../styles/style';
import {
  AiFillHeart,
  AiOutlineClose,
  AiOutlineHeart,
  AiOutlineMessage,
  AiOutlineShoppingCart,
  AiOutlineFontSize,
} from 'react-icons/ai';
import { server } from '../../server';
import { useDispatch, useSelector } from 'react-redux';
import { getAllProductsAdmin } from '../../redux/action/product';
import { addToWishlist, removeFromWishlist } from '../../redux/action/wishlist';
import { toast } from 'react-toastify';
import { addTocart } from '../../redux/action/cart';
import Ratings from './Ratings';
import axios from 'axios';
import Modal from 'react-modal';
import UserCreateDesign from '../UserCreateDesign';

const ProductDetails = ({ data }) => {
  const { wishlist } = useSelector((state) => state.wishlist);
  const { cart } = useSelector((state) => state.cart);
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const { products } = useSelector((state) => state.products);

  const [insResponse, setInsResponse] = useState('');
  const [selectedOptions, setSelectedOptions] = useState({});
  const [count, setCount] = useState(1);
  const [click, setClick] = useState(false);
  const [select, setSelect] = useState(0);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllProductsAdmin(data && data?.admin._id));
    if (wishlist && wishlist.find((i) => i._id === data?._id)) {
      setClick(true);
    } else {
      setClick(false);
    }
  }, [dispatch, data, wishlist]);

  const createDesignHandler = () => {
    return <></>;
  };

  const incrementCount = () => {
    if (data?.stock <= count) {
      toast.error(
        `${data?.name} stock is limited! Please contact us to reserve your order!`
      );
      return;
    }
    setCount(count + 1);
  };

  const decrementCount = () => {
    if (count <= 1) {
      toast.error('You cannot order less than 1 item.');
      return;
    }
    setCount(count - 1);
  };

  const handleMessageSubmit = async () => {
    if (isAuthenticated) {
      const groupTitle = data._id + user._id;
      const userId = user._id;
      const adminId = data.admin._id;
      await axios
        .post(`${server}/conversation/create-new-conversation`, {
          groupTitle,
          userId,
          adminId,
        })
        .then((res) => {
          navigate(`/inbox?${res.data.conversation._id}`);
        })
        .catch((error) => {
          toast.error(error.response.data.message);
        });
    } else {
      toast.error('Please login to make an conversation');
    }
  };

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
        const cartData = {
          ...data,
          qty: count,
          response: insResponse,
          options: selectedOptions,
        };
        dispatch(addTocart(cartData));
        toast.success(`${data.name} added to cart successfully!`);
      }
    }
  };

  const handleOptionChange = (dropdownName, value) => {
    setSelectedOptions({
      ...selectedOptions,
      [dropdownName]: value,
    });
  };

  console.log('selected options information: ', selectedOptions);

  const totalReviewsLength =
    products &&
    products.reduce((acc, product) => acc + product.reviews.length, 0);

  const totalRatings =
    products &&
    products.reduce(
      (acc, product) =>
        acc + product.reviews.reduce((sum, review) => sum + review.rating, 0),
      0
    );

  const avg = totalRatings / totalReviewsLength || 0;
  const averageRating = avg.toFixed(2);

  return (
    <div className="bg-[#fff4d7] min-h-screen py-10">
      {data ? (
        <div className={`${styles.section} w-[90%] md:w-[80%] mx-auto`}>
          <div className="py-5 flex flex-col md:flex-row gap-10">
            {/* Images of Product */}
            <div className="w-full md:w-1/2 flex flex-col items-center">
              {/* Image of Product Main */}
              <img
                src={`${data && data.images[select]?.url}`}
                alt=""
                className=" h-[90%] w-[100%] rounded-md shadow-lg"
              />

              <div className="flex mt-4 space-x-2">
                {/* Image of Product Choices */}
                {data &&
                  data.images.map((i, index) => (
                    <div
                      key={index}
                      className={`cursor-pointer p-1 rounded-md ${
                        select === index ? 'border-2 border-gray-500' : ''
                      }`}
                      onClick={() => setSelect(index)}
                    >
                      <img
                        src={`${i?.url}`}
                        alt=""
                        className="h-[100px] w-[100px] object-cover rounded-md"
                      />
                    </div>
                  ))}
              </div>
            </div>

            {/* Description of Product */}
            <div className="w-full md:w-1/2 pt-5 space-y-5">
              {/* Image of Product Description */}
              <h1 className={`${styles.productTitle} text-3xl font-bold`}>
                {data.name}
              </h1>
              <p className="text-justify text-[#534723]">{data.description}</p>

              <div className="py-2 flex items-center justify-between">
                {/* Price of Product */}
                <div className="flex items-center space-x-2">
                  <h5 className={`${styles.productDiscountPrice} text-2xl`}>
                    ₱
                    {data.discountPrice > 0
                      ? data.discountPrice
                      : data.originalPrice}
                  </h5>
                  {data.discountPrice > 0 && (
                    <h4
                      className={`${styles.price} text-xl line-through text-gray-500`}
                    >
                      ₱{data.originalPrice}
                    </h4>
                  )}
                </div>
              </div>
              <div className="flex justify-between items-center">
                {/* Products Stock */}
                <h4 className="font-[400] text-[#534723] font-Roboto">
                  Stocks: {data.stock}
                </h4>
                {/* Sold of Product */}
                <span className="font-[400] text-[17px] text-[#b19b56]">
                  {data?.sold_out} sold
                </span>
              </div>

              <div className="flex items-center mt-6 justify-between">
                {/* Add and Dec number of a Product */}
                <div className="flex items-center space-x-2">
                  <button
                    className="bg-gradient-to-r from-[#534723] to-[#171203] text-white h-11 font-bold rounded px-4 py-2 shadow-lg hover:opacity-80 transition duration-300 ease-in-out"
                    onClick={decrementCount}
                  >
                    -
                  </button>
                  <span className="bg-[#fff4d7] text-[#171203] font-medium px-4 py-[11px]">
                    {count}
                  </span>
                  <button
                    className="bg-gradient-to-r from-[#534723] to-[#171203] text-white h-11 font-bold rounded px-4 py-2 shadow-lg hover:opacity-80 transition duration-300 ease-in-out"
                    onClick={incrementCount}
                  >
                    +
                  </button>
                </div>

                {/* Heart of a Product */}
                <div>
                  {click ? (
                    <AiFillHeart
                      size={30}
                      className="cursor-pointer"
                      onClick={() => removeFromWishlistHandler(data)}
                      color="#171203"
                      title="Removed from wishlist"
                    />
                  ) : (
                    <AiOutlineHeart
                      size={30}
                      className="cursor-pointer"
                      onClick={() => addToWishlistHandler(data)}
                      color="#171203"
                      title="Added to wishlist"
                    />
                  )}
                </div>
              </div>

              {/* Cart Button */}
              <div
                className={`${styles.button} mt-6 rounded-[4px] h-11 flex items-center justify-center bg-[#171203] text-white cursor-pointer hover:opacity-95 transition duration-300 ease-in-out`}
                onClick={() => addToCartHandler(data._id)}
              >
                <span className="flex items-center">
                  Add to cart <AiOutlineShoppingCart className="ml-1" />
                </span>
              </div>

              {/* Create Design Button */}
              <div
                className={`${styles.button} mt-6 rounded-[4px] h-11 flex items-center justify-center bg-[#171203] text-white cursor-pointer hover:opacity-95 transition duration-300 ease-in-out`}
                onClick={() => createDesignHandler(data._id)}
              >
                <span className="flex items-center">
                  Create Design <AiOutlineFontSize className="ml-1" />
                </span>
              </div>

              {/* Dropdown options */}
              {data.dropdowns &&
                data.dropdowns.map((dropdown, index) => (
                  <div key={dropdown._id} className="mt-4">
                    <label className="block font-medium text-[#534723]">
                      {dropdown.name}:
                    </label>
                    <select
                      className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      onChange={(e) =>
                        handleOptionChange(dropdown.name, e.target.value)
                      }
                      required
                    >
                      <option value="">Select an option</option>
                      {dropdown.options.map((option, idx) => (
                        <option key={idx} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}

              {/* Instructions */}
              <div className="mt-6">
                <p className="text-lg font-semibold text-[#534723]">
                  Instructions for Personalised Product
                </p>
                <span className="font-[200] text-[17px] text-[#b19b56]">
                  {data?.instructions}
                </span>
              </div>

              {/* Customer response to instructions */}
              {data?.instructions && (
                <div className="mt-4">
                  <label className="block font-medium text-[#534723]">
                    Response To Instructions
                  </label>
                  <textarea
                    className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    value={insResponse}
                    onChange={(e) => setInsResponse(e.target.value)}
                  />
                </div>
              )}

              {/* Admin Profile */}
              <div className="flex items-center pt-8">
                <Link to="/" className="flex items-center">
                  <img
                    src={`${data?.admin?.avatar?.url}`}
                    alt=""
                    className="w-[50px] h-[50px] rounded-full mr-3 shadow-lg"
                  />
                  <div>
                    <h3
                      className={`${styles.shop_name} text-xl font-semibold text-[#171203]`}
                    >
                      {data.admin.name}
                    </h3>
                    <h5 className="text-[15px] text-[#534723]">
                      ({averageRating}/5) Ratings
                    </h5>
                  </div>
                </Link>
                <div
                  className={`${styles.button} bg-[#171203] ml-auto rounded-[4px] h-11 flex items-center justify-center text-white cursor-pointer hover:opacity-95 transition duration-300 ease-in-out`}
                  onClick={handleMessageSubmit}
                >
                  <span className="flex items-center">
                    Send Message <AiOutlineMessage className="ml-1" />
                  </span>
                </div>
              </div>
            </div>
          </div>
          <UserCreateDesign data={data} />
          <ProductDetailsInfo
            data={data}
            products={products}
            totalReviewsLength={totalReviewsLength}
            averageRating={averageRating}
          />
        </div>
      ) : null}
    </div>
  );
};

const ProductDetailsInfo = ({
  data,
  products,
  totalReviewsLength,
  averageRating,
}) => {
  const [active, setActive] = useState(1);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const maskName = (name) => {
    const parts = name.split(' ');
    return parts
      .map((part, index) => {
        if (index === 0) return part.slice(0, 2) + '*****';
        return '*****';
      })
      .join(' ');
  };

  const openModal = (image) => {
    setSelectedImage(image);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedImage(null);
  };

  return (
    <div className="bg-[#f7ebca] px-3 800px:px-10 py-2 rounded">
      <div className="w-full flex justify-between border-b pt-10 pb-2">
        <div className="relative">
          <h5
            className={
              'text-[#171203] text-[18px] px-1 leading-5 font-[600] cursor-pointer 800px:text-[20px]'
            }
            onClick={() => setActive(1)}
          >
            Product Details
          </h5>
          {active === 1 ? <div className={styles.active_indicator} /> : null}
        </div>
        <div className="relative">
          <h5
            className={
              'text-[#171203] text-[18px] px-1 leading-5 font-[600] cursor-pointer 800px:text-[20px]'
            }
            onClick={() => setActive(2)}
          >
            Product Reviews
          </h5>
          {active === 2 ? <div className={styles.active_indicator} /> : null}
        </div>
        <div className="relative">
          <h5
            className={
              'text-[#171203] text-[18px] px-1 leading-5 font-[600] cursor-pointer 800px:text-[20px]'
            }
            onClick={() => setActive(3)}
          >
            Shop Information
          </h5>
          {active === 3 ? <div className={styles.active_indicator} /> : null}
        </div>
      </div>

      {active === 1 && (
        <p className="text-[#534723] text-justify py-2 text-[18px] leading-8 pb-10 whitespace-pre-line">
          {data.description}
        </p>
      )}

      {active === 2 && (
        <div className="w-full py-3 max-h-[70vh] flex flex-col items-center overflow-y-scroll hide-scrollbar">
          {data?.reviews.map((item, index) => (
            <div key={index} className="w-full flex my-2">
              <div className="pl-2">
                <img
                  src={`${item.user.avatar?.url}`}
                  alt=""
                  className="w-[50px] h-[50px] rounded-full"
                />
              </div>
              <div className="pl-2">
                <div className="w-full flex flex-col">
                  <h1 className="font-[500] text-[#171203]">
                    {item.isAnonymous
                      ? maskName(item.user.name)
                      : item.user.name}
                  </h1>
                  <Ratings rating={item?.rating} />
                </div>
                <p>{item.comment}</p>
                {item.reviewImages && item.reviewImages.length > 0 && (
                  <div className="flex flex-wrap">
                    {item.reviewImages.map((image, idx) => (
                      <img
                        key={idx}
                        src={image.url}
                        alt="Review"
                        className="w-[100px] h-[100px] m-1 cursor-pointer"
                        onClick={() => openModal(image)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {data?.reviews.length === 0 && (
            <h5>As of the moment, we have still no review for this product!</h5>
          )}
        </div>
      )}

      {active === 3 && (
        <div className="w-full block 800px:flex p-5">
          <div className="w-full 800px:w-[50%]">
            <div className="flex items-center">
              <img
                src={`${data?.admin?.avatar?.url}`}
                alt=""
                className="w-[50px] h-[50px] rounded-full"
              />
              <div className="pl-3">
                <h3 className={styles.shop_name}>{data.admin.name}</h3>
                <h5 className="pb-2 text-[15px] text-[#534723]">
                  ({averageRating}/5) Ratings
                </h5>
              </div>
            </div>
            <p className="pt-2 text-justify text-[#534723]">
              {data.admin.description}
            </p>
          </div>
          <div className="w-full 800px:w-[50%] mt-5 800px:mt-0 800px:flex flex-col items-end">
            <div className="text-left">
              <h5 className="font-[600] text-[#171203]">
                Joined on:
                <span className="font-[500] text-[#534723]">
                  {' '}
                  14 March, 2023
                </span>
              </h5>
              <h5 className="font-[600] text-[#171203] pt-3">
                Total Products:{' '}
                <span className="font-[500]">
                  {products && products.length}
                </span>
              </h5>
              <h5 className="font-[600] text-[#171203] pt-3">
                Total Reviews:{' '}
                <span className="font-[500]">{totalReviewsLength}</span>
              </h5>
              <Link to="/">
                <div
                  className={`${styles.button} !rounded-[4px] !h-[39.5px] mt-3`}
                >
                  <h4 className="text-[#fff4d7]">Go to Shop</h4>
                </div>
              </Link>
            </div>
          </div>
        </div>
      )}

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Review Image"
        className={styles.modal}
        overlayClassName={styles.overlay}
      >
        <button onClick={closeModal} className={styles.closeButton}>
          <AiOutlineClose size={24} />
        </button>
        {selectedImage && (
          <img
            src={selectedImage.url}
            alt="Review"
            className={styles.modalImage}
          />
        )}
      </Modal>
    </div>
  );
};
export default ProductDetails;

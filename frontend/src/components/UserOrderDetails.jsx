import React, { useEffect, useState } from 'react';
import styles from '../styles/style';
import { BsFillBagFill } from 'react-icons/bs';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { server } from '../server';
import { getAllOrdersOfUser } from '../redux/action/order';
import { RxCross1 } from 'react-icons/rx';
import { AiFillStar, AiOutlinePlusCircle, AiOutlineStar } from 'react-icons/ai';
import axios from 'axios';
import { toast } from 'react-toastify';

const UserOrderDetails = () => {
  const { orders } = useSelector((state) => state.order);
  const { user } = useSelector((state) => state.user);
  const [open, setOpen] = useState(false);
  const [comment, setComment] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [rating, setRating] = useState(1);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [reviewImages, setReviewImages] = useState([]);
  const dispatch = useDispatch();

  const { id } = useParams();

  useEffect(() => {
    dispatch(getAllOrdersOfUser(user._id));
  }, [dispatch, user._id]);

  const handleImageChange = (e) => {
    e.preventDefault();

    const files = Array.from(e.target.files);

    setReviewImages([]);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setReviewImages((old) => [...old, reader.result]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const data = orders && orders.find((item) => item._id === id);
  console.log(id);
  const reviewHandler = async (e) => {
    await axios
      .put(
        `${server}/product/create-new-review`,
        {
          user,
          rating,
          comment,
          productId: selectedItem?._id,
          orderId: id,
          isAnonymous,
          reviewImages,
        },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        toast.success(res.data.message);
        dispatch(getAllOrdersOfUser(user._id));

        setComment('');
        setRating(null);
        setIsAnonymous(false);
        setOpen(false);
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const refundHandler = async () => {
    await axios
      .put(`${server}/order/order-refund/${id}`, {
        status: 'Processing Refund',
      })
      .then((res) => {
        toast.success(res.data.message);
        dispatch(getAllOrdersOfUser(user._id));
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };

  return (
    <div className={`py-4 min-h-screen ${styles.section}`}>
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center">
          <BsFillBagFill size={30} className="text-[#171203]" />
          <h1 className="pl-2 text-[#171203] text-[25px]"> Order Details </h1>
        </div>
        <Link to="/profile">
          <div
            className={`${styles.button}!w-max !h-[45px] px-3 !rounded-[5px] mr-3 mb-3 font-[600] text-[18px] text-[#fff4d7]`}
          >
            User Order List
          </div>
        </Link>
      </div>
      <div className="w-full flex items-center justify-between pt-6">
        <h5 className="text-[#171203]">
          Order ID: <span>#{data?._id?.slice(0, 8)}</span>
        </h5>
        <h5 className="text-[#171203]">
          Placed on: <span>{data?.createAt?.slice(0, 10)}</span>
        </h5>
      </div>

      {/* Order Items */}
      <br />
      <br />
      {data &&
        data?.cart.map((item, index) => (
          <div className="w-full flex items-start mb-5">
            <img
              src={`${item.images[0]?.url}`}
              alt=""
              className="w-[80px] h-[80px] "
            />
            <div className="w-full">
              <h5 className="pl-3 text-[18px]">{item.name}</h5>
              <h5 className="pl-3 text-[15px] text-[#534723]">
                {item.discountPrice > 0
                  ? `₱ ${item.discountPrice}`
                  : `₱ ${item.originalPrice}`}
              </h5>
              <h5 className="pl-3 text-[15px] text-[#534723]">
                Quantity: {item.qty}
              </h5>
            </div>
            {data?.status === 'Delivered' && !item.isReviewed ? (
              <div
                className={`${styles.button} !h-[45px] px-3 !rounded-[5px] mr-3 mb-3 font-[600] text-[15px] text-[#fff4d7]`}
                onClick={() => {
                  setOpen(true);
                  setSelectedItem(item);
                }}
              >
                Review Product
              </div>
            ) : (
              <div className="w-[150px] bg-[#171203] my-3 flex items-center justify-center !h-[45px] px-3 !rounded-[5px] mr-3 mb-3 font-[600] text-[15px] text-[#fff4d7] opacity-50 cursor-not-allowed">
                Review Product
              </div>
            )}
          </div>
        ))}

      {/* Review Popup */}
      {open && (
        <div className="w-full fixed top-0 left-0 h-screen bg-[#0005] z-50 flex items-center justify-center">
          <div className="800px:w-[50%] w-[90%] 800px:h-min h-[70%] bg-[#fff] shadow rounded-md p-3 overflow-y-scroll hide-scrollbar">
            <div className="w-full flex justify-end p-3">
              <RxCross1
                size={30}
                onClick={() => setOpen(false)}
                className="cursor-pointer"
              />
            </div>
            <h2 className="text-[30px] font-Poppins text-center text-[#171203]">
              Review the Product
            </h2>
            <br />

            {/* Order Details */}
            <div className="w-full flex pl-3">
              <img
                src={`${selectedItem?.images[0]?.url}`}
                alt=""
                className="w-[80px] h-[80px]"
              />
              <div>
                <div className="pl-3 text-[18px]">{selectedItem.name}</div>
                <h4 className="pl-3 text-[15px] text-[#534723]">
                  {selectedItem.discountPrice > 0
                    ? `₱ ${selectedItem.discountPrice}`
                    : `₱ ${selectedItem.originalPrice}`}
                </h4>
                <h5 className="pl-3 text-[15px] text-[#534723]">
                  Quantity: {selectedItem.qty}
                </h5>
              </div>
            </div>

            <br />
            <br />

            {/* Ratings */}
            <h5 className="pl-3 text-[20px] font-[500] text-[#171203]">
              Give a Rating
            </h5>
            <div className="flex w-full ml-2 pt-1">
              {[1, 2, 3, 4, 5].map((i) =>
                rating >= i ? (
                  <AiFillStar
                    key={i}
                    className="mr-1 cursor-pointer"
                    color="rgb(246,186,0)"
                    size={25}
                    onClick={() => setRating(i)}
                  />
                ) : (
                  <AiOutlineStar
                    key={i}
                    className="mr-1 cursor-pointer"
                    color="rgb(246,186,0)"
                    size={25}
                    onClick={() => setRating(i)}
                  />
                )
              )}
            </div>
            <br />
            <div className="w-full ml-3">
              <label className="block text-[20px] font-[500] text-[#171203]">
                {' '}
                Write a Comment{' '}
                <span className="ml-1 font-[400] text-[16px] text-[#534723]">
                  (optional)
                </span>
              </label>
              <textarea
                name="comment"
                id=""
                cols="20"
                rows="5"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="How was your product experience?"
                className="mt-2 appearance-none block w-[95%] pt-2 px-3 border border-[#9e8a4f] rounded-[3px] shadow-sm placeholder-[#9e8a4f] focus:outline-none focus:ring-brown-dark focus:border-brown-dark"
              ></textarea>
            </div>
            <div className="flex items-center mt-3">
              <input
                type="checkbox"
                id="anonymous"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="anonymous" className="text-[#171203] text-[18px]">
                Review Anonymously
              </label>
            </div>

            {/* Upload Images for Review */}
            <div>
              <label className="block text-lg font-medium text-gray-800 mb-2">
                Upload Images
              </label>
              <input
                type="file"
                id="upload"
                className="hidden"
                multiple
                onChange={handleImageChange}
              />
              <div className="w-full flex items-center flex-wrap">
                <label htmlFor="upload">
                  <AiOutlinePlusCircle
                    size={30}
                    className="mt-3 text-gray-600 hover:text-gray-800 cursor-pointer"
                  />
                </label>
                {reviewImages &&
                  reviewImages.map((i, index) => (
                    <img
                      src={i}
                      key={index}
                      alt=""
                      className="h-32 w-32 object-cover m-2 rounded-lg shadow"
                    />
                  ))}
              </div>
            </div>

            <div
              className={`${styles.button}!w-max !h-[45px] px-3 !rounded-[5px] mr-3 mb-3 font-[600] text-[18px] text-[#fff4d7]`}
              onClick={rating > 1 ? reviewHandler : null}
            >
              Submit
            </div>
          </div>
        </div>
      )}

      <div className="border-t w-full text-right">
        <h5 className="pt-3 text-[18px]">
          Total Price: <strong>₱ {data?.totalPrice}</strong>
        </h5>
      </div>

      <br />

      {/* Shipping Address */}
      <div className="w-full 800px:flex ">
        <div className="w-full 800px:w-[60%]">
          <h4 className="pt-3 text-[20px] font-[600]">Shipping Address</h4>
          <h4 className="pt-3 text-[20px]">
            {data?.shippingAddress.address1 +
              ' ' +
              data?.shippingAddress.address2}
          </h4>
          <h4 className="pt-3 text-[20px]">{data?.shippingAddress.country}</h4>
          <h4 className="pt-3 text-[20px]">{data?.shippingAddress.state}</h4>
          <h4 className="pt-3 text-[20px]">{data?.shippingAddress.city}</h4>
          <h4 className="pt-3 text-[20px]">{data?.user?.phoneNumber}</h4>
        </div>
        <div className="w-full 800px:w-[40%]">
          <h4 className="pt-3 text-[20px] font-[600]">
            Order Notes Information
          </h4>
          {cartInfo(data)}
        </div>
        <div className="w-full 800px:w-[40%] ">
          <h4 className="pt-3 text-[20px] font-[600]">Payment Information</h4>
          <h4>
            Status:{' '}
            {data?.paymentInfo?.status ? data?.paymentInfo?.status : 'Not Paid'}
          </h4>
        </div>
      </div>

      <br />
      <div className="flex items-center justify-between">
        <Link to="/">
          <div
            className={`${styles.button}!w-max !h-[45px] px-3 !rounded-[5px] mr-3 mb-3 font-[600] text-[18px] text-[#fff4d7]`}
          >
            Send Message
          </div>
        </Link>
        {data?.status === 'Delivered' ? (
          <div
            className={`${styles.button}!w-max !h-[45px] px-3 !rounded-[5px] mr-3 mb-3 font-[600] text-[18px] text-[#fff4d7]`}
            onClick={refundHandler}
          >
            Refund
          </div>
        ) : (
          <div className="w-[150px] bg-[#171203] my-3 flex items-center justify-center !h-[45px] px-3 !rounded-[5px] mr-3 mb-3 font-[600] text-[15px] text-[#fff4d7] opacity-50 cursor-not-allowed">
            Refund
          </div>
        )}
      </div>
    </div>
  );
};

const cartInfo = (datas) => {
  console.log("data in cart info", datas);
  const data = Object.entries(datas);
  console.log("Datas : ", data);
  return (
    <div>
    {data.map((item, index) => {
      // Check if the item contains a cart array
      if (item[0] === 'cart') {
        return (
          <div key={index}>
            {item[1].map((cartItem, cartIndex) => (
              <div key={cartIndex}>
                <strong><h2>Item Ordered : {cartItem.name}</h2></strong>
                <h2>Customer Note: <br /> {cartItem.response}</h2>
                <h2>Selected Options:</h2>
                 {cartItem.options ? (
                  <ul>
                    {Object.entries(cartItem.options).map(([key, value]) => (
                      <li key={key}>{`${key}: ${value}`}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No options available.</p>
                )}
              </div>
            ))}
          </div>
        );
      }
      return null;
    })}
  </div>
  );
};

export default UserOrderDetails;

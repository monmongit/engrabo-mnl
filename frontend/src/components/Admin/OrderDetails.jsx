import React, { useEffect, useState } from "react";
import styles from "../../styles/style";
import { BsFillBagFill } from "react-icons/bs";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersOfAdmin } from "../../redux/action/order";
import { server } from "../../server";
import axios from "axios";
import { toast } from "react-toastify";
import { ConnectionStates } from "mongoose";

const OrderDetails = () => {
  const { orders, isLoading } = useSelector((state) => state.order);
  const { admin } = useSelector((state) => state.admin);
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const [status, setStatus] = useState("");
  const navigate = useNavigate();

  const { id } = useParams();

  useEffect(() => {
    dispatch(getAllOrdersOfAdmin(admin._id));
  }, [dispatch, admin._id]);

  const data = orders && orders.find((item) => item._id === id);
  console.log("orders information: ", data);
  console.log("Cart: ", cart);

  const orderUpdateHandler = async (e) => {
    await axios
      .put(
        `${server}/order/update-order-status/${id}`,
        {
          status,
        },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        toast.success("Order Status Update!");
        navigate("/dashboard-orders");
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };

  const refundOrderUpdateHandler = async (e) => {
    await axios
      .put(
        `${server}/order/order-refund-success/${id}`,
        {
          status,
        },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        toast.success("Order Status Update!");
        dispatch(getAllOrdersOfAdmin(admin._id));
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
        <Link to="/dashboard-orders">
          <div
            className={`${styles.button}!w-max !h-[45px] px-3 !rounded-[5px] mr-3 mb-3 font-[600] text-[18px] text-[#fff4d7]`}
          >
            Order List
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
              className="w-[80px] h-[80px]"
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
          </div>
        ))}

      <div className="border-t w-full text-right">
        <h5 className="pt-3 text-[18px]">
          Total Price: <strong>₱ {data?.totalPrice}</strong>
        </h5>
      </div>

      <br />

      {/* Shipping Address */}
      <div className="w-full 800px:flex">
        <div className="w-full 800px:w-[60%]">
          <h4 className="pt-3 text-[20px] font-[600]">Shipping Address</h4>
          <h4 className="pt-3 ">
            {data?.shippingAddress.address1 +
              " " +
              data?.shippingAddress.address2}
          </h4>
          <h4 className="pt-3">{data?.shippingAddress.country}</h4>
          <h4 className="pt-3 ">{data?.shippingAddress.state}</h4>
          <h4 className="pt-3 ">{data?.shippingAddress.city}</h4>
          <h4 className="pt-3 ">{data?.user?.phoneNumber}</h4>
        </div>

        {/* Order information about notes and options */}
        <div className="w-full 800px:w-[40%]">
          <h4 className="pt-3 text-[20px] font-[600]">
            Order Notes Information
          </h4>
          {cartInfo(data)}
        </div>
        {/* <div> */}
        {/* <h4 className="pt-3 text-[20px] font-[600]">Order Notes Information</h4> */}
        {/* {cartInfo2(cart)} */}
        {/* </div> */}

        <div className="w-full 800px:w-[40%]">
          <h4 className="pt-3 text-[20px] font-[600]">Payment Information</h4>
          Status:{" "}
          {data?.paymentInfo?.status ? data?.paymentInfo?.status : "Not Paid"}
        </div>
      </div>

      <br />

      {/* Status of Order */}
      <h4 className="pt-3 text-[20px] font-[600]">Order Status:</h4>
      {data?.status !== "Processing Refund" &&
        data?.status !== "Refund Approved" && (
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="mt-2 appearance-none block px-3 h-[35px] border border-[#9e8a4f] rounded-[3px] shadow-sm placeholder-[#9e8a4f] focus:outline-none focus:ring-brown-dark focus:border-brown-dark"
          >
            {[
              "Processing",
              "Transferred to delivery partner",
              "Shipping",
              "On the way",
              "Delivered",
            ]
              .slice(
                [
                  "Processing",
                  "Transferred to delivery partner",
                  "Shipping",
                  "On the way",
                  "Delivered",
                ].indexOf(data?.status)
              )
              .map((option, index) => (
                <option value={option} key={index}>
                  {option}
                </option>
              ))}
          </select>
        )}

      {data?.status === "Processing Refund" ||
      data?.status === "Refund Approved" ? (
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="mt-2 appearance-none block px-3 h-[35px] border border-[#9e8a4f] rounded-[3px] shadow-sm placeholder-[#9e8a4f] focus:outline-none focus:ring-brown-dark focus:border-brown-dark"
        >
          {["Processing Refund", "Refund Approved"]
            .slice(
              ["Processing Refund", "Refund Approved"].indexOf(data?.status)
            )
            .map((option, index) => (
              <option value={option} key={index}>
                {option}
              </option>
            ))}
        </select>
      ) : null}

      <div
        className={`${styles.button}!w-max !h-[45px] px-3 !rounded-[5px] mr-3 mb-3 font-[600] text-[18px] text-[#fff4d7]`}
        onClick={
          data?.status !== "Processing Refund"
            ? orderUpdateHandler
            : refundOrderUpdateHandler
        }
      >
        Update Status
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
        if (item[0] === "cart") {
          return (
            <div key={index}>
              {item[1].map((cartItem, cartIndex) => (
                <div key={cartIndex}>
                  <strong>
                    <h2>Item Ordered : {cartItem.name}</h2>
                  </strong>
                  <h2>
                    Customer Note: <br /> {cartItem.response}
                  </h2>
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
    // <>div</>
  );
};

// const cartInfo2 = (data) => {
//   console.log("checkout: ",data)
//   const optionsArray = Object.entries(data);

//   console.log("response: ", data.response)
//   console.log("optionsArray: ", optionsArray );
//   return (
//     <div className="w-full bg-[#fff] rounded-md p-5 pb-8 mr-5">
//       <br />
//       <div className="flex justify-between mt-5">
//         <h3 className="text-[16px] font-[400] text-[#b19b56]">
//           Checkout Options and Notes:
//         </h3>
//       </div>
//       <div className="mt-3">
//         {/* Repeat this block for each option */}
//         {data.map((item, index) => (
//         <div key={index} className="bg-gray-100 rounded p-4 mb-4"> {/* Tailwind CSS classes for styling */}
//           <h3 className="text-lg font-bold mb-2">{item.name}</h3> {/* Display product name */}
//           <p className="text-gray-700 mb-2">Response: {item.response}</p>
//           <ul>
//             {Object.entries(item.options).map(([key, value]) => (
//               <li key={key} className="text-gray-700">{key}: {value}</li>
//             ))}
//           </ul>
//         </div>
//       ))}
//       </div>
//     </div>
//   );
// };

export default OrderDetails;

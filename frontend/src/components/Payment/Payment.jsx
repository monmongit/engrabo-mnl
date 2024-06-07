import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/style';
import { useEffect } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { server } from '../../server';
import { toast } from 'react-toastify';
import { RxCross1 } from 'react-icons/rx';
import { IoArrowBackCircle } from 'react-icons/io5';

const Payment = () => {
  const [orderData, setOrderData] = useState([]);
  const [open, setOpen] = useState(false);
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    const orderData = JSON.parse(localStorage.getItem('latestOrder'));
    setOrderData(orderData);
  }, []);

  const createOrder = (data, actions) => {
    return actions.order
      .create({
        purchase_units: [
          {
            description: 'Sunflower',
            amount: {
              currency_code: 'PHP', // This should match the PayPalScriptProvider currency
              value: orderData?.totalPrice.toString(), // Make sure this is a string
            },
          },
        ],
        application_context: {
          shipping_preference: 'NO_SHIPPING', // Adjust as needed
        },
      })
      .then((orderID) => {
        return orderID;
      });
  };

  const order = {
    cart: orderData?.cart,
    shippingAddress: orderData?.shippingAddress,
    user: user && user,
    discountPrice: orderData?.discountValue,
    totalPrice: orderData?.totalPrice,
  };

  console.log(order);

  const onApprove = async (data, actions) => {
    return actions.order.capture().then(function (details) {
      const { payer } = details;
      let paymentInfo = payer;
      if (paymentInfo !== undefined) {
        paypalPaymentHandler(paymentInfo);
      }
    });
  };

  const paypalPaymentHandler = async (paymentInfo) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    order.paymentInfo = {
      id: paymentInfo.payer_id,
      status: 'Paid',
      type: 'Paypal',
    };

    await axios
      .post(`${server}/order/create-order`, order, config)
      .then((res) => {
        setOpen(false);
        navigate('/order/success');
        toast.success('Order successful!');
        localStorage.setItem('cartItems', JSON.stringify([]));
        localStorage.setItem('latestOrder', JSON.stringify([]));
        window.location.reload();
      });
  };

  const cashOnDeliveryHandler = async (e) => {
    e.preventDefault();

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    order.paymentInfo = {
      type: 'Cash On Delivery',
    };

    await axios
      .post(`${server}/order/create-order`, order, config)
      .then((res) => {
        setOpen(false);
        navigate('/order/success');
        toast.success('Order successful!');
        localStorage.setItem('cartItems', JSON.stringify([]));
        localStorage.setItem('latestOrder', JSON.stringify([]));
        window.location.reload();
      });
  };

  return (
    <div className="w-full flex flex-col items-center py-8">
      <div className="flex items-center w-full justify-between px-4">
        <button
          className="flex items-center text-[#171203]"
          onClick={() => navigate('/checkout')}
        >
          <IoArrowBackCircle size={24} className="mr-2" />
          Back to Checkout
        </button>
      </div>
      <div className="w-[90%] 1000px:w-[40%] block 800px:flex">
        <div className="w-full 800px:w-[40%] 800px:mt-0 mt-8">
          <CartData orderData={orderData} />
        </div>
        <div className="w-full 800px:w-[65%]">
          <PaymentInfo
            user={user}
            open={open}
            setOpen={setOpen}
            onApprove={onApprove}
            createOrder={createOrder}
            cashOnDeliveryHandler={cashOnDeliveryHandler}
          />
        </div>
      </div>
    </div>
  );
};

const PaymentInfo = ({
  user,
  open,
  setOpen,
  onApprove,
  createOrder,
  cashOnDeliveryHandler,
}) => {
  const [select, setSelect] = useState(1);

  return (
    <div className="w-full 800px:w-[95%] rounded-md p-5 pb-8">
      {/* select buttons */}
      <div>
        <div className="flex w-full pb-5 border-b mb-2">
          <div
            className="w-[25px] h-[25px] rounded-full bg-transparent border-[3px] border-[#534723] relative flex items-center justify-center"
            onClick={() => setSelect(1)}
          >
            {select === 1 ? (
              <div className="w-[13px] h-[13px] bg-[#534723] rounded-full" />
            ) : null}
          </div>
          <h4 className="text-[18px] pl-2 font-[600] text-[#534723]">
            Cash on Delivery
          </h4>
        </div>

        {/* cash on delivery */}
        {select === 1 ? (
          <div className="w-full flex">
            <form className="w-full" onSubmit={cashOnDeliveryHandler}>
              <input
                type="submit"
                value="Confirm"
                className={`${styles.button} !bg-[#171203] text-[#fff] h-[45px] rounded-[5px] cursor-pointer text-[18px] font-[600]`}
              />
            </form>
          </div>
        ) : null}
      </div>

      <br />
      {/* paypal payment */}
      <div>
        <div className="flex w-full pb-5 border-b mb-2">
          <div
            className="w-[25px] h-[25px] rounded-full bg-transparent border-[3px] border-[#534723] relative flex items-center justify-center"
            onClick={() => setSelect(2)}
          >
            {select === 2 ? (
              <div className="w-[13px] h-[13px] bg-[#534723] rounded-full" />
            ) : null}
          </div>
          <h4 className="text-[18px] pl-2 font-[600] text-[#534723]">
            Pay with Paypal
          </h4>
        </div>

        {select === 2 ? (
          <div className="w-full flex border-b">
            <div
              className={`${styles.button} !bg-[#171203] text-white h-[45px] rounded-[5px] cursor-pointer text-[18px] font-[600]`}
              onClick={() => setOpen(true)}
            >
              Pay Now
            </div>
            {open && (
              <div className="w-full fixed top-0 left-0 bg-[#00000039] h-screen flex items-center justify-center z-[99999]">
                <div className="w-full 800px:w-[40%] h-screen 800px:h-[80vh] bg-white rounded-[5px] shadow flex flex-col justify-center p-8 relative overflow-y-scroll hide-scrollbar">
                  <div className="w-full flex justify-end p-3">
                    <RxCross1
                      size={30}
                      className="cursor-pointer absolute top-3 right-3"
                      onClick={() => setOpen(false)}
                    />
                  </div>
                  <PayPalScriptProvider
                    options={{
                      'client-id':
                        'AY9RmKYNdhQRMajz2-Ytjdnql6TGH0yMp4q39m7U7UBs-2pS8rofvGAibY9hSAXj9v7RlXUo3FVktmHp',
                      currency: 'PHP',
                    }}
                  >
                    <PayPalButtons
                      style={{ layout: 'vertical' }}
                      onApprove={onApprove}
                      createOrder={createOrder}
                      onError={(error) =>
                        console.error('PayPal Button Error:', error)
                      }
                    />
                  </PayPalScriptProvider>
                </div>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};

const CartData = ({ orderData }) => {
  const shipping = orderData?.shipping?.toFixed(2);
  return (
    <div className="w-full bg-[#fff] rounded-md p-5 pb-8">
      <div className="flex justify-between">
        <h3 className="text-[16px] font-[400] text-[#b19b56]">subtotal:</h3>
        <h5 className="text-[18px] font-[600]">₱{orderData?.subTotalPrice}</h5>
      </div>
      <br />
      <div className="flex justify-between">
        <h3 className="text-[16px] font-[400] text-[#b19b56]">shipping:</h3>
        <h5 className="text-[18px] font-[600]">₱{shipping}</h5>
      </div>
      <br />
      <div className="flex justify-between border-b pb-3">
        <h3 className="text-[16px] font-[400] text-[#b19b56]">Discount:</h3>
        <h5 className="text-[18px] font-[600]">
          {orderData.discountPrice && parseFloat(orderData.discountPrice) > 0
            ? `₱${parseFloat(orderData.discountPrice).toFixed(2)}`
            : '-'}{' '}
        </h5>
      </div>
      <h5 className="text-[18px] font-[600] text-end pt-3">
        ₱{orderData?.totalPrice}
      </h5>
      <br />
    </div>
  );
};

export default Payment;

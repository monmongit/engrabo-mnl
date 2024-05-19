import React, { useState } from "react";
import styles from "../../styles/style";
import { Country, State, City } from "country-state-city";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";

const Checkout = () => {
  const { user } = useSelector((state) => state.user);
  const { cart } = useSelector((state) => state.cart);
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [userInfo, setUserInfo] = useState(false);
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [zipCode, setZipCode] = useState(null);
  const [couponCode, setCouponCode] = useState("");
  const [couponCodeData, setCouponCodeData] = useState(null);
  const [originalPrice, setOriginalPrice] = useState(null);
  const navigate = useNavigate();

  console.log("checkout data for cart: ", cart);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const paymentSubmit = () => {
    if (
      address1 === "" ||
      zipCode === null ||
      country === "" ||
      state === "" ||
      city === ""
    ) {
      toast.error("Please choose your delivery address!");
    } else {
      const shippingAddress = {
        address1,
        address2,
        zipCode,
        country,
        state,
        city,
      };

      const discountValue = couponCodeData
        ? (couponCodeData.value / 100) * subTotalPrice
        : 0;
      const totalPrice = (subTotalPrice + shipping - discountValue).toFixed(2);

      const orderData = {
        cart,
        totalPrice: totalPrice,
        subTotalPrice: subTotalPrice,
        shipping,
        originalPrice,
        discountPrice: discountValue.toFixed(2),
        shippingAddress,
        user,
      };
      // update local storage with the updated orders array
      localStorage.setItem("latestOrder", JSON.stringify(orderData));
      navigate("/payment");
    }
  };

  const subTotalPrice = cart.reduce(
    (acc, item) =>
      acc +
      item.qty *
        (item.discountPrice > 0 ? item.discountPrice : item.originalPrice),
    0
  );

  // this is shipping cost variable
  const shipping = subTotalPrice * 0.1;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!couponCode) {
      toast.error("Please enter a coupon code.");
      return;
    }

    await axios
      .get(`${server}/coupon/get-coupon-value/${couponCode}`)
      .then((res) => {
        if (!res.data.couponCode) {
          toast.error("Coupon code does not exist!");
          setCouponCode("");
          return;
        }

        const { couponCode } = res.data;
        const today = new Date();
        const expiryDate = new Date(couponCode.expiresAt);

        // Check coupon validity
        if (expiryDate < today) {
          toast.error("This coupon has expired.");
          setCouponCode("");
          return;
        }

        if (subTotalPrice < couponCode.minAmount) {
          toast.error(
            `This coupon requires a minimum amount of ${couponCode.minAmount} to be valid.`
          );
          setCouponCode("");
          return;
        }

        // Calculate discount
        const discountValue = (couponCode.value / 100) * subTotalPrice;
        setOriginalPrice(subTotalPrice - discountValue); // Assuming originalPrice is the final price after discount
        setCouponCodeData(couponCode);
        toast.success("Coupon applied successfully!");
      })
      .catch((error) => {
        console.error("Error fetching coupon:", error);
        toast.error("Failed to apply coupon.");
      });
  };

  const discountPercentenge = couponCodeData
    ? ((couponCodeData.value * subTotalPrice) / 100).toFixed(2)
    : 0;

  const totalPrice = couponCodeData
    ? (subTotalPrice + shipping - discountPercentenge).toFixed(2)
    : (subTotalPrice + shipping).toFixed(2);

  return (
    <div className="w-full flex flex-col items-center py-8">
      <div className="w-[90%] 1000px:w-[70%] block 800px:flex">
        <div className="w-full 800px:w-[65%]">
          <ShippingInfo
            user={user}
            country={country}
            setCountry={setCountry}
            state={state}
            setState={setState}
            city={city}
            setCity={setCity}
            userInfo={userInfo}
            setUserInfo={setUserInfo}
            address1={address1}
            setAddress1={setAddress1}
            address2={address2}
            setAddress2={setAddress2}
            zipCode={zipCode}
            setZipCode={setZipCode}
          />
        </div>
        {/* display the cart information */}
        <div className="w-full 800px:w-[65%]">{cartInfo(cart)}</div>
        <div className="w-full 800px:w-[35%] 800px:mt-0 mt-8">
          <CartData
            handleSubmit={handleSubmit}
            totalPrice={totalPrice}
            shipping={shipping}
            subTotalPrice={subTotalPrice}
            couponCode={couponCode}
            setCouponCode={setCouponCode}
            discountPercentenge={discountPercentenge}
          />
        </div>
      </div>
      <div
        className={`${styles.button} w-[150px] 800px:w-[280px] mt-10`}
        onClick={paymentSubmit}
      >
        <h5 className="text-white">Go to Payment</h5>
      </div>
    </div>
  );
};

const ShippingInfo = ({
  user,
  country,
  setCountry,
  state,
  setState,
  city,
  setCity,
  userInfo,
  setUserInfo,
  address1,
  setAddress1,
  address2,
  setAddress2,
  zipCode,
  setZipCode,
}) => {
  return (
    <div className="w-full 800px:w-[95%] bg-white rounded-md p-5 pb-8">
      <h5 className="text-[18px] font-[500]">Shipping Address</h5>
      <br />
      <form>
        <div className="w-full flex pb-3">
          {/* Name */}
          <div className="w-[50%]">
            <label className="block pb-2 !text-[#171203]">Full Name</label>
            <input
              type="text"
              value={user && user.name}
              required
              className="h-[40px] w-[95%] appearance-none block px-3 border border-[#9e8a4f] rounded-[3px] shadow-sm placeholder-[#9e8a4f] focus:outline-none focus:ring-brown-dark focus:border-brown-dark"
            />
          </div>

          {/* Email address */}
          <div className="w-[50%]">
            <label className="block pb-2 !text-[#171203]">Email Address</label>
            <input
              type="email"
              value={user && user.email}
              required
              className="h-[40px] w-full appearance-none block px-3 border border-[#9e8a4f] rounded-[3px] shadow-sm placeholder-[#9e8a4f] focus:outline-none focus:ring-brown-dark focus:border-brown-dark"
            />
          </div>
        </div>

        <div className="w-full flex pb-3">
          {/* Phone number */}
          <div className="w-[50%]">
            <label className="block pb-2 !text-[#171203]">Phone Number</label>
            <input
              type="number"
              required
              value={user && user.phoneNumber}
              className="h-[40px] w-[95%] appearance-none block px-3 border border-[#9e8a4f] rounded-[3px] shadow-sm placeholder-[#9e8a4f] focus:outline-none focus:ring-brown-dark focus:border-brown-dark"
            />
          </div>

          {/* Zip code*/}
          <div className="w-[50%]">
            <label className="block pb-2 !text-[#171203]">Zip Code</label>
            <input
              type="number"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              required
              className="h-[40px] w-full appearance-none block px-3 border border-[#9e8a4f] rounded-[3px] shadow-sm placeholder-[#9e8a4f] focus:outline-none focus:ring-brown-dark focus:border-brown-dark"
            />
          </div>
        </div>

        <div className="w-full flex pb-3">
          {/* Country */}
          <div className="w-[50%]">
            <label className="block pb-2 !text-[#171203]">Country</label>
            <select
              className="h-[40px] w-[95%] appearance-none block px-3 border border-[#9e8a4f] rounded-[3px] shadow-sm placeholder-[#9e8a4f] focus:outline-none focus:ring-brown-dark focus:border-brown-dark"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            >
              <option className="block pb-2" value="">
                Choose your country
              </option>
              {Country &&
                Country.getAllCountries().map((item) => (
                  <option key={item.isoCode} value={item.isoCode}>
                    {item.name}
                  </option>
                ))}
            </select>
          </div>

          {/* State */}
          <div className="w-[50%]">
            <label className="block pb-2 text-[#171203]">State</label>
            <select
              name=""
              id=""
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="h-[40px] w-full appearance-none block px-3 border border-[#9e8a4f] rounded-[3px] shadow-sm placeholder-[#9e8a4f] focus:outline-none focus:ring-brown-dark focus:border-brown-dark"
            >
              <option value="" className="block pb-2">
                Choose your State
              </option>
              {State &&
                State.getStatesOfCountry(country).map((item) => (
                  <option
                    className="block pb-2"
                    key={item.isoCode}
                    value={item.isoCode}
                  >
                    {item.name}
                  </option>
                ))}
            </select>
          </div>
        </div>

        <div className="w-full flex pb-3">
          {/* City */}
          <div className="w-full">
            {/* City Selection */}
            <label className="block pb-2 text-[#171203]">City</label>
            <select
              name=""
              id=""
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="h-[40px] w-full appearance-none block px-3 border border-[#9e8a4f] rounded-[3px] shadow-sm placeholder-[#9e8a4f] focus:outline-none focus:ring-brown-dark focus:border-brown-dark"
            >
              <option value="" className="block pb-2">
                Choose your City
              </option>
              {City &&
                State &&
                City.getCitiesOfState(country, state).map((item) => (
                  <option
                    className="block pb-2"
                    key={item.isoCode}
                    value={item.isoCode}
                  >
                    {item.name}
                  </option>
                ))}
            </select>
          </div>
        </div>

        <div className="w-full flex pb-3">
          {/* Address 1 */}
          <div className="w-[50%]">
            <label className="block pb-2 !text-[#171203]">Address1</label>
            <input
              type="address"
              required
              value={address1}
              onChange={(e) => setAddress1(e.target.value)}
              className="h-[40px] w-[95%] appearance-none block px-3 border border-[#9e8a4f] rounded-[3px] shadow-sm placeholder-[#9e8a4f] focus:outline-none focus:ring-brown-dark focus:border-brown-dark"
            />
          </div>

          {/* Address 2 */}
          <div className="w-[50%]">
            <label className="block pb-2 !text-[#171203]">Address2</label>
            <input
              type="address"
              value={address2}
              onChange={(e) => setAddress2(e.target.value)}
              required
              className="h-[40px] w-full appearance-none block px-3 border border-[#9e8a4f] rounded-[3px] shadow-sm placeholder-[#9e8a4f] focus:outline-none focus:ring-brown-dark focus:border-brown-dark"
            />
          </div>
        </div>

        <div></div>
      </form>

      {/* Select Saved Address */}
      <h5
        className="text-[18px] font-[600] cursor-pointer inline-block !text-[#171203]"
        onClick={() => setUserInfo(!userInfo)}
      >
        Choose From saved address
      </h5>
      {userInfo && (
        <div>
          {user &&
            user.addresses.map((item, index) => (
              <div className="w-full flex mt-1">
                <input
                  type="checkbox"
                  className="mr-3 !text-[#171203]"
                  value={item.addressType}
                  onClick={() =>
                    setAddress1(item.address1) ||
                    setAddress2(item.address2) ||
                    setZipCode(item.zipCode) ||
                    setCountry(item.country) ||
                    setState(item.state) ||
                    setCity(item.city)
                  }
                />
                <h2>{item.addressType}</h2>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

const CartData = ({
  handleSubmit,
  totalPrice,
  shipping,
  subTotalPrice,
  couponCode,
  setCouponCode,
  discountPercentenge,
}) => {
  return (
    <div className="w-full bg-[#fff] rounded-md p-5 pb-8">
      <div className="flex justify-between">
        <h3 className="text-[16px] font-[400] text-[#b19b56]">subtotal:</h3>
        <h5 className="text-[18px] font-[600]">₱ {subTotalPrice}</h5>
      </div>
      <br />
      <div className="flex justify-between">
        <h3 className="text-[16px] font-[400] text-[#b19b56]">shipping:</h3>
        <h5 className="text-[18px] font-[600]">₱ {shipping.toFixed(2)}</h5>
      </div>
      <br />
      <div className="flex justify-between border-b pb-3">
        <h3 className="text-[16px] font-[400] text-[#b19b56]">Discount:</h3>
        <h5 className="text-[18px] font-[600]">
          - {discountPercentenge ? "₱" + discountPercentenge.toString() : null}
        </h5>
      </div>
      <h5 className="text-[18px] font-[600] text-end pt-3">₱ {totalPrice}</h5>
      <br />
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="mt-2 appearance-none block w-full px-3 h-[45px] border border-[#9e8a4f] rounded-[3px] shadow-sm placeholder-[#9e8a4f] focus:outline-none focus:ring-brown-dark focus:border-brown-dark"
          placeholder="Coupoun code"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          required
        />
        <input
          className={`w-full h-[40px] border border-[#171203] text-center text-[#171203] rounded-[3px] mt-8 cursor-pointer `}
          required
          value="Apply code"
          type="submit"
        />
      </form>
    </div>
  );
};

const cartInfo = (data) => {
  console.log("checkout: ",data)
  const optionsArray = Object.entries(data);
  
  console.log("response: ", data.response)
  console.log("optionsArray: ", optionsArray );
  return (
    <div className="w-full bg-[#fff] rounded-md p-5 pb-8 mr-5">
      <br />
      <div className="flex justify-between mt-5">
        <h3 className="text-[16px] font-[400] text-[#b19b56]">
          Checkout Options and Notes:
        </h3>
      </div>
      <div className="mt-3">
        {/* Repeat this block for each option */}
        {data.map((item, index) => (
        <div key={index} className="bg-gray-100 rounded p-4 mb-4"> {/* Tailwind CSS classes for styling */}
          <h3 className="text-lg font-bold mb-2">{item.name}</h3> {/* Display product name */}
          <p className="text-gray-700 mb-2">Response: {item.response}</p>
          <ul>
            {Object.entries(item.options).map(([key, value]) => (
              <li key={key} className="text-gray-700">{key}: {value}</li>
            ))}
          </ul>
        </div>
      ))}
      </div>
    </div>
  );
};

export default Checkout;

import React from 'react';
import styles from '../../styles/style';

const CheckoutSteps = ({ active }) => {
  console.log(active);
  return (
    <div className="w-full flex justify-center pl-40">
      <div className="w-[90%] 800px:w-[50%] flex items-center flex-wrap">
        <div className={`${styles.normalFlex}`}>
          <div className={`${styles.cart_button}`}>
            <span className={`${styles.cart_button_text}`}>1.Shipping</span>
          </div>
          <div
            className={`${
              active > 1
                ? 'w-[30px] 800px:w-[70px] h-[4px] !bg-[#171203]'
                : 'w-[30px] 800px:w-[70px] h-[4px] !bg-[#e2cb87]'
            }`}
          />
        </div>

        <div className={`${styles.normalFlex}`}>
          <div
            className={`${
              active > 1
                ? `${styles.cart_button}`
                : `${styles.cart_button} !bg-[#e2cb87]`
            }`}
          >
            <span
              className={`${
                active > 1
                  ? `${styles.cart_button_text}`
                  : `${styles.cart_button_text} !text-[#171203]`
              }`}
            >
              2.Payment
            </span>
          </div>
        </div>

        <div className={`${styles.normalFlex}`}>
          <div
            className={`${
              active > 3
                ? 'w-[30px] 800px:w-[70px] h-[4px] !bg-[#171203]'
                : 'w-[30px] 800px:w-[70px] h-[4px] !bg-[#e2cb87]'
            }`}
          />
          <div
            className={`${
              active > 2
                ? `${styles.cart_button}`
                : `${styles.cart_button} !bg-[#e2cb87]`
            }`}
          >
            <span
              className={`${
                active > 2
                  ? `${styles.cart_button_text}`
                  : `${styles.cart_button_text} !text-[#171203]`
              }`}
            >
              3.Success
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSteps;

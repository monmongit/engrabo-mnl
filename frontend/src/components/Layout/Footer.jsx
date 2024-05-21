import React from "react";
import Logo from "../../assets/Logo/engrabo-logo.png";
import { IoLogoTiktok } from "react-icons/io5";
import gcLogo from "../../assets/Logo/gcash-logo.png";

import {
  AiFillFacebook,
  AiOutlineInstagram,
  AiOutlineTwitter,
} from "react-icons/ai";
import {
  footerProductLinks,
  footerSupportLinks,
  footercompanyLinks,
} from "../../static/data";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="bg-[#171203] text-[#fff4d7]">
      <div className="md:flex md:justify-between md:items-center sm:px-12 px-4 bg-gradient-to-r from-[#e1c570] to-[#7a6b3c] py-7">
        <h1 className="lg:text-4xl text-3xl md:mb-0 mb-6 lg:leading-normal font-semibold md:w-2/5">
          <span className="text-[#171203]">Subscribe</span> us for get news
          <br />
          events and offer
        </h1>
        <div>
          <input
            type="text"
            required
            placeholder="Enter your email"
            className="text-gray-800 sm:w-72 w-full sm:mr-5 mr-1 lg:mb-0 mb-4 py-2.5 rounded px-2 focus:outline-none"
          />
          <button className="bg-[#171203] hover:opacity-80 transition duration-300 ease-in-out px-5 py-2.5 rounded-md text-[#fff4d7] md:w-auto w-full">
            Submit
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-6 sm:px-8 px-5 py-16 sm: text-center">
        <ul className="px-5 text-center sm:text-start flex sm:block flex-col items-center">
          <img
            src={Logo}
            alt=""
            style={{ filter: "brightness(0) invert(1)" }}
          />
          <br />
          <p className="text-justify text-[14px]">
            Engraving shop for wooden signages, souvenirs, decors and displays.
          </p>
          <div className="flex items-center mt-[15px]">
            <AiFillFacebook size={25} className="cursor-pointer" />
            <AiOutlineTwitter
              size={25}
              style={{ marginLeft: "15px", cursor: "pointer" }}
            />
            <AiOutlineInstagram
              size={25}
              style={{ marginLeft: "15px", cursor: "pointer" }}
            />
            <IoLogoTiktok
              size={25}
              style={{ marginLeft: "15px", cursor: "pointer" }}
            />
          </div>
        </ul>

        <ul className="text-center sm:text-start">
          <h1 className="mb-1 font-semibold">Company</h1>
          {footerProductLinks.map((link, index) => (
            <li key={index}>
              <Link
                className="text-[#b19b56] hover:text-[#fff4d7] duration-300 text-sm cursor-pointer leading-6"
                to={link.link}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        <ul className="text-center sm:text-start">
          <h1 className="mb-1 font-semibold">Shop</h1>
          {footercompanyLinks.map((link, index) => (
            <li key={index}>
              <Link
                className="text-[#b19b56] hover:text-[#fff4d7] duration-300 text-sm cursor-pointer leading-6"
                to={link.link}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        <ul className="text-center sm:text-start">
          <h1 className="mb-1 font-semibold">Support</h1>
          {footerSupportLinks.map((link, index) => (
            <li key={index}>
              <Link
                className="text-[#b19b56] hover:text-[#fff4d7] duration-300 text-sm cursor-pointer leading-6"
                to={link.link}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 text-center pt-2 text-[#e1c570] text-sm pb-8">
        <span>© 2024 EngraboMNL, All rights reserved.</span>
        <span>Terms · Privacy Policy</span>
        <div className="sm:block flex items-center justify-center w-full">
          <img src={gcLogo} alt="" className="h-[45px]" />
        </div>
      </div>
    </div>
  );
};

export default Footer;

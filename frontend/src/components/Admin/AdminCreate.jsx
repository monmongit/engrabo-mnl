import React, { useState } from "react";
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
import { RxAvatar } from "react-icons/rx";
import axios from "axios";

import { toast } from "react-toastify";
import "../../styles/toastDesign.css";
import { server } from "../../server";
import styles from "../../styles/style";
import { Link } from "react-router-dom";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

const AdminCreate = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [backdropOpen, setBackdropOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    setBackdropOpen(true);

    axios
      .post(`${server}/admin/create-admin`, {
        name,
        email,
        password,
        avatar,
        zipCode,
        address,
        phoneNumber,
      })
      .then((res) => {
        toast.success(res.data.message);
        setName("");
        setEmail("");
        setPassword("");
        setAvatar("");
        setZipCode("");
        setAddress("");
        setPhoneNumber("");
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      })
      .finally(() => {
        setBackdropOpen(false);
      });
  };

  const handleFileInputChange = (e) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatar(reader.result);
      }
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center 800px:pt-12 pt-0 pb-12 sm:px-6 lg:px-8 px-4">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/*<img src={logo} alt="Engrabo Logo" className="m-0 p-0" />*/}
        <h2 className="800px:mt-6 mt-0 text-center text-3xl font-extrabold text-brown-dark">
          Admin registration
        </h2>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-[35rem]">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="w-full space-y-6" onSubmit={handleSubmit}>
            {/* Shop name */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-brown-semidark"
              >
                Admin Name
              </label>
              <div className="mt-1">
                <input
                  type="name"
                  name="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-brown-lightdark rounded-md shadow-sm placeholder-brown-lightdark focus:outline-none focus:ring-brown-semidark focus:border-brown-semidark"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-brown-semidark"
              >
                Email
              </label>
              <div className="mt-1">
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-brown-lightdark rounded-md shadow-sm placeholder-brown-lightdark focus:outline-none focus:ring-brown-semidark focus:border-brown-semidark"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-brown-semidark"
              >
                Phone Number
              </label>
              <div className="mt-1">
                <input
                  type="number"
                  name="phone-number"
                  autoComplete="email"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-brown-lightdark rounded-md shadow-sm placeholder-brown-lightdark focus:outline-none focus:ring-brown-semidark focus:border-brown-semidark"
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-brown-semidark"
              >
                Address
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="address"
                  autoComplete="email"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-brown-lightdark rounded-md shadow-sm placeholder-brown-lightdark focus:outline-none focus:ring-brown-semidark focus:border-brown-semidark"
                />
              </div>
            </div>

            {/* ZipCode */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-brown-semidark"
              >
                Zip Code
              </label>
              <div className="mt-1">
                <input
                  type="number"
                  name="zipcode"
                  autoComplete="email"
                  required
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-brown-lightdark rounded-md shadow-sm placeholder-brown-lightdark focus:outline-none focus:ring-brown-semidark focus:border-brown-semidark"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-brown-semidark"
              >
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  type={visible ? "text" : "password"}
                  name="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-brown-lightdark rounded-md shadow-sm placeholder-brown-lightdark focus:outline-none focus:ring-brown-semidark focus:border-brown-semidark"
                />
                {visible ? (
                  <AiOutlineEye
                    className="absolute right-2 top-2 cursor-pointer"
                    size={25}
                    onClick={() => setVisible(false)}
                  />
                ) : (
                  <AiOutlineEyeInvisible
                    className="absolute right-2 top-2 cursor-pointer"
                    size={25}
                    onClick={() => setVisible(true)}
                  />
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="avatar"
                className="block text-sm font-medium text-brown-semidark"
              ></label>
              <div className="mt-2 flex items-center">
                <span className="inline-block h-8 w-8 rounded-full overflow-hidden">
                  {avatar ? (
                    <img
                      src={avatar}
                      alt="avatar"
                      className="h-full w-full object-cover rounded-full"
                    />
                  ) : (
                    <RxAvatar className="h-8 w-8" />
                  )}
                </span>
                <label
                  htmlFor="file-input"
                  className="ml-5 flex items-center justify-center px-4 py-2 border border-brown-lightdark rounded-md shadow-sm text-sm font-medium  text-brown-semidark bg-white hover:border-brown-semidark"
                >
                  <span>Upload a profile</span>
                  <input
                    type="file"
                    name="avatar"
                    id="file-input"
                    accept=".jpg,.jpeg,.png"
                    onChange={handleFileInputChange}
                    className="sr-only"
                  />
                </label>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full h-[40px] flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-brown-lightdark bg-brown-semidark hover:bg-brown-dark"
              >
                Submit
              </button>
            </div>

            <div className={`${styles.normalFlex} w-full`}>
              <h4>Already have an account?</h4>
              <Link
                to="/admin-login"
                className="ml-2 text-brown-semidark hover:text-brown-dark"
              >
                Sign In
              </Link>
            </div>
          </form>
          <Backdrop
            sx={{
              color: "#fff",
              zIndex: (theme) => theme.zIndex.drawer + 1,
            }}
            open={backdropOpen}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        </div>
      </div>
    </div>
  );
};

export default AdminCreate;

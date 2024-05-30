import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { server } from "../../server";

import Homebackground from "../../assets/Logo/home-background.jpg";

const AdminUpdatePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const passwordChangeHandler = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match!");
      return;
    }

    try {
      await axios.put(
        `${server}/admin/update-admin-password`,
        {
          oldPassword,
          newPassword,
        },
        {
          withCredentials: true,
        }
      );

      toast.success("Password updated successfully!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="w-full flex flex-col justify-center sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2
          className=" text-[25px] text-center font-[600] text-[#171203]"
          style={{ marginTop: "50px" }}
        >
          Admin Change Password
        </h2>
      </div>
      <div
        className="flex flex-col mt-6 sm:mx-auto sm:flex-row sm:max-w-screen-xl"
        style={{ borderRadius: "10px" }}
      >
        <div className="w-full sm:w-auto hidden sm:block ">
          <img
            src={Homebackground}
            alt="Engrabo Logo"
            className="m-0 p-0 w-full sm:w-auto"
            style={{ width: 448, height: 376 }}
          />
        </div>
        <div
          className="bg-white py-8 px-4 shadow sm:rounded lg:px-10 sm:w-full sm:max-w-md sm:ml-auto"
          style={{ borderRadius: "10px", marginBottom: "30px" }}
        >
          <form className="w-full space-y-6" onSubmit={passwordChangeHandler}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-brown-semidark"
              >
                Current Password
              </label>
              <div className="mt-1">
                <input
                  type="password"
                  required
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-brown-lightdark rounded-md shadow-sm placeholder-brown-lightdark focus:outline-none focus:ring-brown-semidark focus:border-brown-semidark"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-brown-semidark"
              >
                New Password
              </label>
              <div className="mt-1 relative">
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-brown-lightdark rounded-md shadow-sm placeholder-brown-lightdark focus:outline-none focus:ring-brown-semidark focus:border-brown-semidark"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-brown-semidark"
              >
                Confirm New Password
              </label>
              <div className="mt-1 relative">
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-brown-lightdark rounded-md shadow-sm placeholder-brown-lightdark focus:outline-none focus:ring-brown-semidark focus:border-brown-semidark"
                />
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
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminUpdatePassword;

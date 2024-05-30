import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import styles from "./../styles/style";
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
import badRequest from "./../assets/Icons/400.png";
import { server } from "../server";
import { toast } from "react-toastify";

const ResetPage = () => {
  const navigate = useNavigate();
  const { reset_token } = useParams();
  const [error, setError] = useState(false);
  const [validUrl, setValidUrl] = useState(false);
  const [adminUrl, setAdminUrl] = useState(false);
  const [successUrl, setSuccessUrl] = useState(false);
  const [visible, setVisible] = useState(false);
  const [visible2, setVisible2] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const flag = localStorage.getItem("effectExecuted");

    if (!flag && reset_token) {
      const sendRequest = async () => {
        await axios
          .post(`${server}/user/reset`, {
            reset_token,
          })
          .then((res) => {
            console.log(res);
            setValidUrl(true);
          })
          .catch((err) => {
            const message =
              err.response && err.response.data && err.response.data.message
                ? err.response.data.message
                : "An error occurred during account activation.";
            setError(message);
            localStorage.removeItem("effectExecuted");
          });
      };
      sendRequest();
    } else {
      navigate("/login");
      localStorage.removeItem("effectExecuted");
    }
  }, [reset_token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await axios
      .post(
        `${server}/user/reset-password`,
        { newPassword, confirmPassword, reset_token },
        { withCredentials: true }
      )
      .then((res) => {
        const { userType } = res.data;

        if (userType === "User") {
          localStorage.setItem("effectExecuted", true);
          setSuccessUrl(true);
          setValidUrl(false);
          setError(false);
        } else if (userType === "Admin") {
          localStorage.setItem("effectExecuted", true);
          setSuccessUrl(true);
          setAdminUrl(true);
          setValidUrl(false);
          setError(false);
        }
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };

  return (
    <>
      {validUrl ? (
        <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 px-4">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <h2 className="mt-6 text-center text-3xl font-extrabold text-brown-dark">
              Reset your Password
            </h2>
          </div>
          <div className="flex flex-col mt-6 sm:mx-auto sm:flex-row sm:max-w-screen-xl">
            <div className="bg-white py-8 px-4 shadow sm:rounded lg:px-10 sm:w-full sm:max-w-md sm:ml-auto">
              <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="text-center text-gray-600 mb-3">
                  Please create and enter your new password.
                </h2>
              </div>
              <form className="w-full space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-brown-semidark"
                  >
                    New Password
                  </label>
                  <div className="mt-1 relative">
                    <input
                      type={visible ? "text" : "password"}
                      name="password"
                      autoComplete="current-password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
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
                    htmlFor="password"
                    className="block text-sm font-medium text-brown-semidark"
                  >
                    Confirm Password
                  </label>
                  <div className="mt-1 relative">
                    <input
                      type={visible2 ? "text" : "password"}
                      name="password"
                      autoComplete="current-password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="appearance-none block w-full px-3 py-2 border border-brown-lightdark rounded-md shadow-sm placeholder-brown-lightdark focus:outline-none focus:ring-brown-semidark focus:border-brown-semidark"
                    />
                    {visible2 ? (
                      <AiOutlineEye
                        className="absolute right-2 top-2 cursor-pointer"
                        size={25}
                        onClick={() => setVisible2(false)}
                      />
                    ) : (
                      <AiOutlineEyeInvisible
                        className="absolute right-2 top-2 cursor-pointer"
                        size={25}
                        onClick={() => setVisible2(true)}
                      />
                    )}
                  </div>
                </div>
                <div>
                  <button
                    type="submit"
                    className="group relative w-full h-[40px] flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-brown-lightdark bg-brown-semidark hover:bg-brown-dark"
                  >
                    Reset Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : null}
      {successUrl ? (
        <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 px-4">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <h2 className="text-center text-3xl font-extrabold text-brown-dark">
              Your password has been successfully reset!{" "}
            </h2>
          </div>
          <div className="flex flex-col mt-6 sm:mx-auto sm:flex-row sm:max-w-screen-xl">
            <div className="bg-white py-8 px-4 shadow sm:rounded lg:px-10 sm:w-full sm:max-w-md sm:ml-auto">
              <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="text-center text-gray-600 mb-3">
                  Sign in with your new password
                </h2>
              </div>
              <div>
                <button className="mt-10 group relative w-full h-[40px] flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-brown-lightdark bg-brown-semidark hover:bg-brown-dark">
                  <Link to={adminUrl ? "/admin-login" : "/login"}>Sign In</Link>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
      {error ? (
        <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 px-4">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <h2 className="text-center text-3xl font-extrabold text-brown-dark">
              Unable to reset password
            </h2>
          </div>
          <div className="flex flex-col mt-6 sm:mx-auto sm:flex-row sm:max-w-screen-xl">
            <div className="bg-white py-8 px-4 shadow sm:rounded lg:px-10 sm:w-full sm:max-w-md sm:ml-auto">
              <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <img
                  src={badRequest}
                  alt="Bad Request"
                  className="m-0 p-0 w-full sm:w-auto"
                />
                <h2 className="text-center text-gray-600 mb-3">
                  The reset link is either invalid or expired. Try to reset your
                  password again.
                </h2>
              </div>

              <div>
                <button className="mt-10 group relative w-full h-[40px] flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-brown-lightdark bg-brown-semidark hover:bg-brown-dark">
                  <Link to="/.forgot-password" className="">
                    Reset Password
                  </Link>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default ResetPage;

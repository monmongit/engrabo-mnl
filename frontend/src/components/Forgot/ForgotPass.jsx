import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../../styles/style";
// import logo from "../../assets/Logo/engrabo-logo.png";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import "../../styles/toastDesign.css";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

const Forgot = () => {
  const [email, setEmail] = useState("");
  const [validUrl, setValidUrl] = useState(true);
  const [redirectUrl, setRedirectUrl] = useState(false);
  const [backdropOpen, setBackdropOpen] = useState(false);
  const [returnLink, setReturnLink] = useState("/login");

  useEffect(() => {
    const referrer = document.referrer;
    if (referrer.includes("/admin-login")) {
      setReturnLink("/admin-login");
    } else if (referrer.includes("/login")) {
      setReturnLink("/login");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setBackdropOpen(true);

    await axios
      .post(
        `${server}/user/forgot-pass`,
        {
          email,
        },
        { withCredentials: true }
      )
      .then((res) => {
        const { userType } = res.data;

        if (userType === "User") {
          setValidUrl(false);
        } else if (userType === "Admin") {
          setValidUrl(false);
          setRedirectUrl(true);
        }
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      })
      .finally(() => {
        setBackdropOpen(false);
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
                  Please enter your email address and we'll send you a link to
                  reset your password.
                </h2>
              </div>
              <form className="w-full space-y-6" onSubmit={handleSubmit}>
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
                <div>
                  <button
                    type="submit"
                    className="group relative w-full h-[40px] flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-brown-lightdark bg-brown-semidark hover:bg-brown-dark"
                  >
                    Submit
                  </button>
                </div>
                <div className={`${styles.normalFlex} w-full`}>
                  <h4>Return to</h4>
                  <Link
                    to={returnLink}
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
      ) : (
        <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 px-4">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <h2 className="mt-6 text-center text-3xl font-extrabold text-brown-dark">
              Email Sent{" "}
            </h2>
          </div>
          <div className="flex flex-col mt-6 sm:mx-auto sm:flex-row sm:max-w-screen-xl">
            <div className="bg-white py-8 px-4 shadow sm:rounded lg:px-10 sm:w-full sm:max-w-md sm:ml-auto">
              <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="text-center text-gray-600 mb-3">
                  A link to reset your password has been sent to you on
                  <div style={{ fontWeight: "700" }}>{email}</div>
                </h2>
              </div>

              <div>
                <button className="mt-10 group relative w-full h-[40px] flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-brown-lightdark bg-brown-semidark hover:bg-brown-dark">
                  <Link to={redirectUrl ? "/admin-login" : "/login"}>
                    Sign In
                  </Link>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Forgot;

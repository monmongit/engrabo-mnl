import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { server } from "../server";
import badRequest from "./../assets/Icons/400.png";

const ActivationPage = () => {
  const { activation_token } = useParams();
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const flag = localStorage.getItem("effectExecuted");

    if (!flag && activation_token) {
      const sendRequest = async () => {
        localStorage.setItem("effectExecuted", true);

        await axios
          .post(`${server}/user/activation`, {
            activation_token,
          })

          .then((res) => {
            console.log(res);
            // Set a success state and display a success message or redirect the user
          })
          .catch((err) => {
            // Check for different types of errors and set appropriate messages
            const message =
              err.response && err.response.data && err.response.data.message
                ? err.response.data.message
                : "An error occurred during account activation.";
            setError(message);
          });
      };
      sendRequest();
    } else {
      navigate("/login");
      localStorage.removeItem("effectExecuted");
    }
  }, [activation_token, navigate]);

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {error ? (
        <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 px-4">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <h2 className="text-center text-3xl font-extrabold text-brown-dark">
              Unable to activate your account
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
                  The activation link is either invalid or expired. Try to
                  activate your account again.
                </h2>
              </div>

              <div>
                <button className="mt-10 group relative w-full h-[40px] flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-brown-lightdark bg-brown-semidark hover:bg-brown-dark">
                  <Link to="/login">Reset Password</Link>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 px-4">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <h2 className="text-center text-3xl font-extrabold text-brown-dark">
              Your account has been created successfully!
            </h2>
          </div>
          <div className="flex flex-col mt-6 sm:mx-auto sm:flex-row sm:max-w-screen-xl">
            <div className="bg-white py-8 px-4 shadow sm:rounded lg:px-10 sm:w-full sm:max-w-md sm:ml-auto">
              <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="text-center text-gray-600 mb-3">
                  Sign in with your new account
                </h2>
              </div>
              <div>
                <button className="mt-10 group relative w-full h-[40px] flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-brown-lightdark bg-brown-semidark hover:bg-brown-dark">
                  <Link to={"/login"}>Sign In</Link>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivationPage;

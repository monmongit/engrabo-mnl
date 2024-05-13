import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AiOutlineEyeInvisible, AiOutlineEye } from 'react-icons/ai';
import { RxAvatar } from 'react-icons/rx';
import Homebackground from '../../assets/Logo/home-background.jpg'; //import logo from '../../assets/Logo/engrabo-logo.png';
import styles from '../../styles/style';
import axios from 'axios';
import { server } from '../../server';
import { toast } from 'react-toastify';
import '../../styles/toastDesign.css';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [visible, setVisible] = useState('');
  const [avatar, setAvatar] = useState('');

  const handleFileInputChange = (e) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatar(reader.result);
      }
    };

    reader.readAsDataURL(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    axios
      .post(`${server}/user/create-user`, { name, email, password, avatar })
      .then((res) => {
        toast.success(res.data.message);
        setName('');
        setEmail('');
        setPassword('');
        setAvatar();
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/*<img src={logo} alt="Engrabo Logo" className="m-0 p-0" />*/}
        <h2 className="mt-6 text-center text-3xl font-extrabold text-brown-dark">
          Register your account
        </h2>
      </div>
      <div className="flex flex-col mt-6 sm:mx-auto sm:flex-row sm:max-w-screen-xl">
        <div className="w-full sm:w-auto hidden sm:block ">
          <img
            src={Homebackground}
            alt="Engrabo Logo"
            className="m-0 p-0 w-full sm:w-auto"
            style={{ width: 484, height: 484 }}
          />
        </div>
        <div className="bg-white py-8 px-4 shadow sm:rounded lg:px-10 sm:w-full sm:max-w-md sm:ml-aut">
          <form className="w-full space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-brown-semidark"
              >
                Full Name
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="name"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-brown-lightdark rounded-md shadow-sm placeholder-brown-lightdark focus:outline-none focus:ring-brown-semidark focus:border-brown-semidark"
                />
              </div>
            </div>
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
              <label
                htmlFor="password"
                className="block text-sm font-medium text-brown-semidark"
              >
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  type={visible ? 'text' : 'password'}
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
                to="/login"
                className="ml-2 text-brown-semidark hover:text-brown-dark"
              >
                Sign In
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;

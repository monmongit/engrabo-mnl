import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { server } from "../../server";
import { AiOutlineCamera } from "react-icons/ai";
import styles from "../../styles/style";
import axios from "axios";
import { toast } from "react-toastify";
import { loadAdmin } from "../../redux/action/user";
import Button from "@mui/material/Button";

const AdminSettings = () => {
  const { admin } = useSelector((state) => state.admin);
  const [avatar, setAvatar] = useState();
  const [name, setName] = useState(admin && admin.name);
  const [description, setDescription] = useState(
    admin && admin.description ? admin.description : ""
  );
  const [address, setAddress] = useState(admin && admin.address);
  const [phoneNumber, setPhoneNumber] = useState(admin && admin.phoneNumber);
  const [zipCode, setZipcode] = useState(admin && admin.zipCode);

  const dispatch = useDispatch();

  const handleImage = async (e) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatar(reader.result);
        axios
          .put(
            `${server}/admin/update-admin-avatar`,
            { avatar: reader.result },
            {
              withCredentials: true,
            }
          )
          .then((res) => {
            dispatch(loadAdmin());
            toast.success("Avatar updated successfully!");
          })
          .catch((error) => {
            toast.error(error.response.data.message);
          });
      }
    };

    reader.readAsDataURL(e.target.files[0]);
  };

  const updateHandler = async (e) => {
    e.preventDefault();

    await axios
      .put(
        `${server}/admin/update-admin-info`,
        {
          name,
          address,
          zipCode,
          phoneNumber,
          description,
        },
        { withCredentials: true }
      )
      .then((res) => {
        toast.success("Shop info updated succesfully!");
        dispatch(loadAdmin());
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };

  return (
    <div
      className="w-full min-h-screen flex flex-col items-center mt-3"
      style={{ marginBottom: "100px" }}
    >
      <div className="p-4 flex w-full bg-white lg:w-[50%] flex-col justify-center my-5 bg-[#171203] rounded-lg shadow-lg hover:shadow-xl hover:border-white border border-transparent transition duration-300">
        <div className="w-full flex items-center justify-center">
          <div className="relative">
            <img
              src={avatar ? avatar : `${admin.avatar?.url}`}
              alt=""
              className="w-[200px] h-[200px] rounded-full cursor-pointer"
            />
            <div className="w-[30px] h-[30px] bg-[#E3E9EE] rounded-full flex items-center justify-center cursor-pointer absolute bottom-[10px] right-[15px]">
              <input
                type="file"
                id="image"
                className="hidden"
                onChange={handleImage}
              />
              <label htmlFor="image">
                <AiOutlineCamera />
              </label>
            </div>
          </div>
        </div>

        {/* shop info */}
        <form className="flex flex-col items-center" onSubmit={updateHandler}>
          {/* <div className="w-[100%] flex items-center flex-col 800px:w-[80%] mt-5">
            <div className="w-full pl-[3%]">
              <label className="block pb-2 font-[800] text-black">
                Shop Name
              </label>
            </div>
            <input
              type="name"
              placeholder={`${admin.name}`}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`${styles.input} !w-[95%] mb-4 800px:mb-0 text-gray-600`}
              required
            />
          </div> */}

          <div className="w-[100%] flex items-center flex-col 800px:w-[80%] mt-2">
            <div className="w-full pl-[3%]">
              <label
                className="block pb-2 font-[600] text-black"
                style={{ fontFamily: "Roboto, sans-serif" }}
              >
                Shop Name
              </label>
            </div>
            <div class="relative h-11 w-[350px] min-w-[200px]">
              <input
                type="name"
                placeholder={`${admin.name}`}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="peer h-full w-full rounded-[7px]  !border  !border-gray-300 border-t-transparent bg-transparent bg-white px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700  shadow-lg shadow-gray-900/5 outline outline-0 ring-4 ring-transparent transition-all placeholder:text-gray-500 placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2  focus:!border-gray-900 focus:border-t-transparent focus:!border-t-gray-900 focus:outline-0 focus:ring-gray-900/10 disabled:border-0 disabled:bg-blue-gray-50"
              />
            </div>
          </div>

          {/* <div className="w-[100%] flex items-center flex-col 800px:w-[80%] mt-2">
            <div className="w-full pl-[3%]">
              <label className="block pb-2 font-[800] text-black">
                Shop description
              </label>
            </div>
            <input
              type="name"
              placeholder={`${
                admin?.description
                  ? admin.description
                  : "Enter your shop description"
              }`}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`${styles.input} !w-[95%] mb-4 800px:mb-0 text`}
            />
          </div> */}

          <div className="w-[100%] flex items-center flex-col 800px:w-[80%] mt-2">
            <div className="w-full pl-[3%]">
              <label
                className="block pb-2 font-[600] text-black"
                style={{ fontFamily: "Roboto, sans-serif" }}
              >
                Shop description
              </label>
            </div>
            <div class="relative h-11 w-[350px] min-w-[200px]">
              <input
                type="name"
                placeholder={`${
                  admin?.description
                    ? admin.description
                    : "Enter your shop description"
                }`}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="peer h-full w-full rounded-[7px]  !border  !border-gray-300 border-t-transparent bg-transparent bg-white px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700  shadow-lg shadow-gray-900/5 outline outline-0 ring-4 ring-transparent transition-all placeholder:text-gray-500 placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2  focus:!border-gray-900 focus:border-t-transparent focus:!border-t-gray-900 focus:outline-0 focus:ring-gray-900/10 disabled:border-0 disabled:bg-blue-gray-50"
              />
            </div>
          </div>
          {/* 
          <div className="w-[100%] flex items-center flex-col 800px:w-[80%] mt-2">
            <div className="w-full pl-[3%]">
              <label className="block pb-2 font-[800] text-black">
                Shop Address
              </label>
            </div>
            <input
              type="name"
              placeholder={admin?.address}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className={`${styles.input} !w-[95%] mb-4 800px:mb-0 text-gray-600`}
              required
            />
          </div> */}

          <div className="w-[100%] flex items-center flex-col 800px:w-[80%] mt-2">
            <div className="w-full pl-[3%]">
              <label
                className="block pb-2 font-[600] text-black"
                style={{ fontFamily: "Roboto, sans-serif" }}
              >
                Shop Address
              </label>
            </div>
            <div class="relative h-11 w-[350px] min-w-[200px]">
              <input
                type="name"
                placeholder={admin?.address}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                className="peer h-full w-full rounded-[7px]  !border  !border-gray-300 border-t-transparent bg-transparent bg-white px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700  shadow-lg shadow-gray-900/5 outline outline-0 ring-4 ring-transparent transition-all placeholder:text-gray-500 placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2  focus:!border-gray-900 focus:border-t-transparent focus:!border-t-gray-900 focus:outline-0 focus:ring-gray-900/10 disabled:border-0 disabled:bg-blue-gray-50"
              />
            </div>
          </div>
          {/* 
          <div className="w-[100%] flex items-center flex-col 800px:w-[80%] mt-2">
            <div className="w-full pl-[3%]">
              <label className="block pb-2 font-[800] text-black">
                Shop Phone Number
              </label>
            </div>
            <input
              type="number"
              placeholder={admin?.phoneNumber}
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className={`${styles.input} !w-[95%] mb-4 800px:mb-0 text-gray-600`}
              required
            />
          </div> */}

          <div className="w-[100%] flex items-center flex-col 800px:w-[80%] mt-2">
            <div className="w-full pl-[3%]">
              <label
                className="block pb-2 font-[600] text-black"
                style={{ fontFamily: "Roboto, sans-serif" }}
              >
                Shop Phone Number
              </label>
            </div>
            <div class="relative h-11 w-[350px] min-w-[200px]">
              <input
                type="number"
                placeholder={admin?.phoneNumber}
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
                className="peer h-full w-full rounded-[7px]  !border  !border-gray-300 border-t-transparent bg-transparent bg-white px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700  shadow-lg shadow-gray-900/5 outline outline-0 ring-4 ring-transparent transition-all placeholder:text-gray-500 placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2  focus:!border-gray-900 focus:border-t-transparent focus:!border-t-gray-900 focus:outline-0 focus:ring-gray-900/10 disabled:border-0 disabled:bg-blue-gray-50"
              />
            </div>
          </div>

          {/* <div className="w-[100%] flex items-center flex-col 800px:w-[80%] mt-2">
            <div className="w-full pl-[3%]">
              <label className="block pb-2 font-[800] text-black">
                Shop Zip Code
              </label>
            </div>
            <input
              type="number"
              placeholder={admin?.zipCode}
              value={zipCode}
              onChange={(e) => setZipcode(e.target.value)}
              className={`${styles.input} !w-[95%] mb-4 800px:mb-0 text-gray-600`}
              required
            />
          </div> */}

          <div className="w-[100%] flex items-center flex-col 800px:w-[80%] mt-2">
            <div className="w-full pl-[3%]">
              <label
                className="block pb-2 font-[600] text-black"
                style={{ fontFamily: "Roboto, sans-serif" }}
              >
                Shop Zip Code
              </label>
            </div>
            <div class="relative h-11 w-[350px] min-w-[200px]">
              <input
                type="number"
                placeholder={admin?.zipCode}
                value={zipCode}
                onChange={(e) => setZipcode(e.target.value)}
                required
                className="peer h-full w-full rounded-[7px]  !border  !border-gray-300 border-t-transparent bg-transparent bg-white px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700  shadow-lg shadow-gray-900/5 outline outline-0 ring-4 ring-transparent transition-all placeholder:text-gray-500 placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2  focus:!border-gray-900 focus:border-t-transparent focus:!border-t-gray-900 focus:outline-0 focus:ring-gray-900/10 disabled:border-0 disabled:bg-blue-gray-50"
              />
            </div>
          </div>

          <div
            className="w-[100%] flex items-center flex-col 800px:w-[80%] mt-5"
            style={{ marginBottom: "20px" }}
          >
            <Button
              variant="contained"
              color="primary"
              type="submit"
              className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
              required
              //   readOnly
            >
              Update Shop
            </Button>
          </div>
          {/* <input
              type="submit"
              value="Update Shop"
              className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
              required
            /> */}
        </form>
      </div>
    </div>
  );
};

export default AdminSettings;

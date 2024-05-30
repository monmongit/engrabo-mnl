import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { server } from '../../server';
import { AiOutlineCamera } from 'react-icons/ai';
import axios from 'axios';
import { toast } from 'react-toastify';
import { loadAdmin } from '../../redux/action/user';
import Button from '@mui/material/Button';

const AdminSettings = () => {
  const { admin } = useSelector((state) => state.admin);
  const [avatar, setAvatar] = useState();
  const [name, setName] = useState(admin && admin.name);
  const [description, setDescription] = useState(
    admin && admin.description ? admin.description : ''
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
            toast.success('Avatar updated successfully!');
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
        toast.success('Shop info updated successfully!');
        dispatch(loadAdmin());
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };

  return (
    <div
      className="w-full min-h-screen flex flex-col items-center mt-3"
      style={{ marginBottom: '100px' }}
    >
      <div className="p-4 flex w-full bg-white lg:w-[50%] flex-col justify-center my-5  rounded-lg shadow-lg hover:shadow-xl hover:border-white border border-transparent transition duration-300">
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
        <form
          className="flex flex-col items-center w-full"
          onSubmit={updateHandler}
        >
          <div className="w-full flex flex-col mt-4">
            <label
              className="text-black font-semibold"
              style={{ fontFamily: 'Roboto, sans-serif' }}
            >
              Shop Name
            </label>
            <input
              type="name"
              placeholder={`${admin.name}`}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-2 mt-1 border rounded-md border-gray-300"
            />
          </div>

          <div className="w-full flex flex-col mt-4">
            <label
              className="text-black font-semibold"
              style={{ fontFamily: 'Roboto, sans-serif' }}
            >
              Shop Description
            </label>
            <input
              type="text"
              placeholder={`${
                admin?.description
                  ? admin.description
                  : 'Enter your shop description'
              }`}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 mt-1 border rounded-md border-gray-300"
            />
          </div>

          <div className="w-full flex flex-col mt-4">
            <label
              className="text-black font-semibold"
              style={{ fontFamily: 'Roboto, sans-serif' }}
            >
              Shop Address
            </label>
            <input
              type="text"
              placeholder={admin?.address}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              className="w-full p-2 mt-1 border rounded-md border-gray-300"
            />
          </div>

          <div className="w-full flex flex-col mt-4">
            <label
              className="text-black font-semibold"
              style={{ fontFamily: 'Roboto, sans-serif' }}
            >
              Shop Phone Number
            </label>
            <input
              type="number"
              placeholder={admin?.phoneNumber}
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
              className="w-full p-2 mt-1 border rounded-md border-gray-300"
            />
          </div>

          <div className="w-full flex flex-col mt-4">
            <label
              className="text-black font-semibold"
              style={{ fontFamily: 'Roboto, sans-serif' }}
            >
              Shop Zip Code
            </label>
            <input
              type="number"
              placeholder={admin?.zipCode}
              value={zipCode}
              onChange={(e) => setZipcode(e.target.value)}
              required
              className="w-full p-2 mt-1 border rounded-md border-gray-300"
            />
          </div>

          <div className="w-full flex items-center justify-center mt-6">
            <Button
              variant="contained"
              color="primary"
              type="submit"
              className="w-full"
            >
              Update Shop
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminSettings;

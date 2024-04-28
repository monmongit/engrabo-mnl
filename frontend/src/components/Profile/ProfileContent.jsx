import React, { useEffect, useState } from 'react';
import { backend_url, server } from '../../server';
import { useDispatch, useSelector } from 'react-redux';
import { AiOutlineCamera, AiOutlineDelete } from 'react-icons/ai';
import styles from '../../styles/style';
import { Link } from 'react-router-dom';
import { MdOutlineTrackChanges, MdTrackChanges } from 'react-icons/md';
import Button from '@mui/material/Button';
import { DataGrid } from '@mui/x-data-grid';
import {
  deleteUserAddress,
  updateUserAddress,
  updateUserInformation,
} from '../../redux/action/user';
import { City, Country, State } from 'country-state-city';
import { toast } from 'react-toastify';
import axios from 'axios';
import { RxCross1 } from 'react-icons/rx';

const ProfileContent = ({ active }) => {
  const { user, error, successMessage } = useSelector((state) => state.user);
  const [name, setName] = useState(user && user.name);
  const [email, setEmail] = useState(user && user.email);
  const [phoneNumber, setPhoneNumber] = useState(user && user.phoneNumber);
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch({ type: 'clearErrors' });
    }
    if (successMessage) {
      toast.success(successMessage.successMessage);
    }
  }, [error, dispatch, successMessage]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateUserInformation(name, email, phoneNumber, password));
    toast.success(`Hi ${user.name} your information is now updated!`);
  };

  useEffect(() => {
    if (user && user.name) {
      setName(user.name);
    }
  }, [user]);

  const handleImage = async (e) => {
    const file = e.target.files[0];
    setAvatar(file);

    const formData = new FormData();

    formData.append('image', e.target.files[0]);

    await axios
      .put(`${server}/user/update-avatar`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      })
      .then((response) => {
        window.location.reload();
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  return (
    <div className="w-full">
      {/* Profile Content */}
      {active === 1 && (
        <>
          {/* Image and Change Image */}
          <div className="flex justify-center w-full">
            <div className="relative">
              <img
                src={`${backend_url}/${user?.avatar.url}`}
                className="w-[150px] h-[150px] rounded-full object-cover border-[3px] border-[#171203]"
                alt="User Avatar"
              />
              <div className="w-[30px] h-[30px] bg-[#e1c77a] rounded-full flex items-center justify-center cursor-pointer absolute bottom-[5px] right-[5px]">
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
          <div className="w-full px-5">
            <br />
            <br />
            <form
              onSubmit={handleSubmit}
              required
              className="flex flex-col items-center justify-center sm:px-5 px-2"
            >
              {/* Fullname and Email Addresss */}
              <div className="w-full 800px:flex block pb-3">
                <div className="w-[100%] 800px:w-[50%]">
                  <label className="block pb-2 text-[#171203]">Full Name</label>
                  <input
                    type="text"
                    className={`${styles.input} !w-[95%] mb-4 800px:mb-0 pl-2`}
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="w-[100%] 800px:w-[50%]">
                  <label className="block pb-2 text-[#171203]">
                    Email Address
                  </label>
                  <input
                    type="text"
                    className={`${styles.input} !w-[95%] mb-1 800px:mb-0 pl-2`}
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* Phone number and Password */}
              <div className="w-full 800px:flex block pb-3">
                <div className="w-[100%] 800px:w-[50%]">
                  <label className="block pb-2 text-[#171203]">
                    Phone Number
                  </label>
                  <input
                    type="number"
                    className={`${styles.input} !w-[95%] mb-4 800px:mb-0 pl-2`}
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>

                <div className="w-[100%] 800px:w-[50%]">
                  <label className="block pb-2 text-[#171203]">
                    Enter your password
                  </label>
                  <input
                    type="password"
                    className={`${styles.input} !w-[95%] mb-4 800px:mb-0 pl-2`}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <input
                type="submit"
                value="Update"
                required
                className={`w-[250px] text-center text-[#171203] border border-[#171203] mt-4 !rounded-[4px] !h-11 hover:bg-[#e8d5a9] transition duration-300 ease-in-out`}
              />
            </form>
          </div>
        </>
      )}

      {/* Order Content */}
      {active === 2 && (
        <div className="">
          <AllOrders />
        </div>
      )}

      {/* Refund Content */}
      {active === 3 && (
        <div className="">
          <AllRefundOrders />
        </div>
      )}

      {/* Tract Order Content */}
      {active === 5 && (
        <div className="">
          <TrackOrder />
        </div>
      )}

      {/* Payment Method Content */}
      {active === 6 && (
        <div className="">
          <PaymentMethod />
        </div>
      )}

      {/* User Address Content */}
      {active === 7 && (
        <div className="">
          <Address />
        </div>
      )}
    </div>
  );
};

// All Orders Table
const AllOrders = () => {
  const orders = [
    {
      _id: '123456',
      orderItems: [
        {
          name: 'Chopping Board Engraved',
        },
      ],
      totalPrice: 120,
      orderStatus: 'Processing',
    },
  ];

  const columns = [
    { field: 'id', headerName: 'Order ID', minWidth: 150, flex: 0.7 },

    {
      field: 'status',
      headerName: 'Status',
      minWidth: 130,
      flex: 0.7,
      cellClassName: (params) => {
        return params.row.status === 'Delivered' ? 'greenColor' : 'redColor';
      },
    },
    {
      field: 'itemsQty',
      headerName: 'Items Qty',
      type: 'number',
      minWidth: 130,
      flex: 0.7,
    },

    {
      field: 'total',
      headerName: 'Total',
      type: 'number',
      minWidth: 130,
      flex: 0.8,
    },

    {
      field: ' ',
      flex: 1,
      minWidth: 150,
      headerName: '',
      type: 'number',
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/order/${params.id}`}>
              <Button>
                <MdTrackChanges size={20} />
              </Button>
            </Link>
          </>
        );
      },
    },
  ];

  const row = [];

  orders &&
    orders.forEach((item) => {
      row.push({
        id: item._id,
        itemsQty: item.orderItems.length,
        total: '₱' + item.totalPrice,
        status: item.orderStatus,
      });
    });
  return (
    <div className="pl-8 pt-1">
      <DataGrid
        rows={row}
        columns={columns}
        pageSize={10}
        disableSelectOnClick
        autoHeight
      />
    </div>
  );
};

// All Refund Orders Table
const AllRefundOrders = () => {
  const orders = [
    {
      _id: '123456',
      orderItems: [
        {
          name: 'Chopping Board Engraved',
        },
      ],
      totalPrice: 120,
      orderStatus: 'Processing',
    },
  ];

  const columns = [
    { field: 'id', headerName: 'Order ID', minWidth: 150, flex: 0.7 },

    {
      field: 'status',
      headerName: 'Status',
      minWidth: 130,
      flex: 0.7,
      cellClassName: (params) => {
        return params.row.status === 'Delivered' ? 'greenColor' : 'redColor';
      },
    },
    {
      field: 'itemsQty',
      headerName: 'Items Qty',
      type: 'number',
      minWidth: 130,
      flex: 0.7,
    },

    {
      field: 'total',
      headerName: 'Total',
      type: 'number',
      minWidth: 130,
      flex: 0.8,
    },

    {
      field: ' ',
      flex: 1,
      minWidth: 150,
      headerName: '',
      type: 'number',
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/order/${params.id}`}>
              <Button>
                <MdTrackChanges size={20} />
              </Button>
            </Link>
          </>
        );
      },
    },
  ];

  const row = [];

  orders &&
    orders.forEach((item) => {
      row.push({
        id: item._id,
        itemsQty: item.orderItems.length,
        total: '₱' + item.totalPrice,
        status: item.orderStatus,
      });
    });

  return (
    <div className="pl-8 pt-1">
      <DataGrid
        rows={row}
        columns={columns}
        pageSize={10}
        autoHeight
        disableSelectionOnClick
      />
    </div>
  );
};

// Track Order Table
const TrackOrder = () => {
  const orders = [
    {
      _id: '123456',
      orderItems: [
        {
          name: 'Chopping Board Engraved',
        },
      ],
      totalPrice: 120,
      orderStatus: 'Processing',
    },
  ];

  const colums = [
    {
      field: 'id',
      headerName: 'Order ID',
      minWidth: 150,
      flex: 0.7,
    },
    {
      field: 'status',
      headerName: 'Status',
      minWidth: 130,
      flex: 0.7,
      cellClassName: (params) => {
        return params.row.status === 'Delivered' ? 'greenColor' : 'redColor';
      },
    },
    {
      field: 'itemsQty',
      headerName: 'Items Qty',
      type: 'number',
      minWidth: 130,
      flex: 0.7,
    },

    {
      field: 'total',
      headerName: 'Total',
      type: 'number',
      minWidth: 130,
      flex: 0.8,
    },
    {
      field: ' ',
      flex: 1,
      minWidth: 130,
      headerName: '',
      type: 'number',
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/order/${params.id}`}>
              <Button>
                <MdOutlineTrackChanges size={20} />
              </Button>
            </Link>
          </>
        );
      },
    },
  ];

  const row = [];

  orders &&
    orders.forEach((item) => {
      row.push({
        id: item._id,
        itemsQty: item.orderItems.length,
        total: '₱' + item.totalPrice,
        status: item.orderStatus,
      });
    });

  return (
    <div className="pl-8 pt-1">
      <DataGrid
        rows={row}
        columns={colums}
        pageSize={10}
        disableSelectionOnClick
        autoHeight
      />
    </div>
  );
};

// Payment Method
const PaymentMethod = () => {
  return (
    <div className="w-full px-5">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-[25px] font-[600] text-[#171203] pb-2">
          Payment Methods
        </h1>
        <div
          className={`${styles.button}  mt-4 !rounded-[4px] !h-11 hover:opacity-95 transition duration-300 ease-in-out`}
        >
          <span className="text-[#fff4d7]">Add New</span>
        </div>
      </div>
      <br />
      <div className="w-full bg-[#f7ebca] h-[70px] rounded-[4px] flex items-center px-3 shadow justify-between pr-10">
        <div className="flex items-center">
          <img
            src="https://bonik-react.vercel.app/assets/images/payment-methods/Visa.svg"
            alt=""
          />
          <h5 className="pl-5 font-[600]">Card Name</h5>
        </div>
        <div className="pl-8 flex items-center">
          <h6>63+ **** *** ****</h6>
          <h5 className="pl-6"> expired Date </h5>
        </div>
        <div className="min-w-[10%] flex items-center justify-between pl-8">
          <AiOutlineDelete size={25} className="cursor-pointer" />
        </div>
      </div>
    </div>
  );
};

// Address
const Address = () => {
  const [open, setOpen] = useState(false);
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState();
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [addressType, setAddressType] = useState('');
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const addressTypeData = [
    {
      name: 'Default',
    },
    {
      name: 'House',
    },
    {
      name: 'Office',
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (addressType === '' || country === '' || state === '' || city === '') {
      toast.error('Plesae fill all the fields!');
    } else {
      dispatch(
        updateUserAddress(country, state, city, address1, address2, addressType)
      );
      setOpen(false);
      setCountry('');
      setState('');
      setCity('');
      setAddress1('');
      setAddress2('');
      setZipCode('');
      setAddressType('');
    }
  };

  const handleDelete = (item) => {
    dispatch(deleteUserAddress(item._id));
  };

  return (
    <div className="w-full px-5">
      {open && (
        <div className="fixed w-full h-screen bg-[#0000004b] top-0 left-0 flex items-center justify-center">
          <div className="w-[35%] h-[80vh] bg-white rounded shadow relative overflow-y-scroll hide-scrollbar">
            <div className="w-full flex justify-end p-3">
              <RxCross1
                size={30}
                className="cursor-pointer"
                onClick={() => setOpen(false)}
              />
            </div>
            <h1 className="text-center text-[25px] font-Poppins text-[#171203]">
              Add New Address
            </h1>
            <div className="w-full">
              <form onSubmit={handleSubmit} className="w-full">
                <div className="w-full block p-4">
                  {/* Country Selection */}
                  <div className="w-full pb-2">
                    <label className="block pb-2 text-[#171203]">Country</label>
                    <select
                      name=""
                      id=""
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="mt-2 appearance-none block w-full px-3 h-[35px] border border-[#9e8a4f] rounded-[3px] shadow-sm placeholder-[#9e8a4f] focus:outline-none focus:ring-brown-dark focus:border-brown-dark"
                    >
                      <option value="" className="block pb-2">
                        Choose your Country
                      </option>
                      {Country &&
                        Country.getAllCountries().map((item) => (
                          <option
                            className="block pb-2"
                            key={item.isoCode}
                            value={item.isoCode}
                          >
                            {item.name}
                          </option>
                        ))}
                    </select>
                  </div>

                  {/* State Selection */}
                  <div className="w-full pb-2">
                    <label className="block pb-2 text-[#171203]">State</label>
                    <select
                      name=""
                      id=""
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="mt-2 appearance-none block w-full px-3 h-[35px] border border-[#9e8a4f] rounded-[3px] shadow-sm placeholder-[#9e8a4f] focus:outline-none focus:ring-brown-dark focus:border-brown-dark"
                    >
                      <option value="" className="block pb-2">
                        Choose your State
                      </option>
                      {State &&
                        State.getStatesOfCountry(country).map((item) => (
                          <option
                            className="block pb-2"
                            key={item.isoCode}
                            value={item.isoCode}
                          >
                            {item.name}
                          </option>
                        ))}
                    </select>
                  </div>

                  {/* City Selection */}
                  <div className="w-full pb-2">
                    <label className="block pb-2 text-[#171203]">City</label>
                    <select
                      name=""
                      id=""
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="mt-2 appearance-none block w-full px-3 h-[35px] border border-[#9e8a4f] rounded-[3px] shadow-sm placeholder-[#9e8a4f] focus:outline-none focus:ring-brown-dark focus:border-brown-dark"
                    >
                      <option value="" className="block pb-2">
                        Choose your City
                      </option>
                      {City &&
                        state &&
                        City.getCitiesOfState(country, state).map((item) => (
                          <option
                            className="block pb-2"
                            key={item.isoCode}
                            value={item.isoCode}
                          >
                            {item.name}
                          </option>
                        ))}
                    </select>
                  </div>

                  {/* Address 1 */}
                  <div className="w-full pb-2">
                    <label className="block pb-2 text-[#171203]">
                      Address 1
                    </label>
                    <input
                      type="address"
                      className="mt-2 appearance-none block w-full px-3 h-[35px] border border-[#9e8a4f] rounded-[3px] shadow-sm placeholder-[#9e8a4f] focus:outline-none focus:ring-brown-dark focus:border-brown-dark"
                      required
                      value={address1}
                      onChange={(e) => setAddress1(e.target.value)}
                    />
                  </div>

                  {/* Address 2 */}
                  <div className="w-full pb-2">
                    <label className="block pb-2 text-[#171203]">
                      Address 2
                    </label>
                    <input
                      type="address"
                      className="mt-2 appearance-none block w-full px-3 h-[35px] border border-[#9e8a4f] rounded-[3px] shadow-sm placeholder-[#9e8a4f] focus:outline-none focus:ring-brown-dark focus:border-brown-dark"
                      value={address2}
                      onChange={(e) => setAddress2(e.target.value)}
                    />
                  </div>

                  {/* ZipCode */}
                  <div className="w-full pb-2">
                    <label className="block pb-2 text-[#171203]">
                      Zip Code
                    </label>
                    <input
                      type="number"
                      className="mt-2 appearance-none block w-full px-3 h-[35px] border border-[#9e8a4f] rounded-[3px] shadow-sm placeholder-[#9e8a4f] focus:outline-none focus:ring-brown-dark focus:border-brown-dark"
                      required
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                    />
                  </div>

                  {/* Address Type */}
                  <div className="w-full pb-2">
                    <label className="block pb-2 text-[#171203]">
                      Address Type
                    </label>
                    <select
                      name=""
                      id=""
                      value={addressType}
                      onChange={(e) => setAddressType(e.target.value)}
                      className="mt-2 appearance-none block w-full px-3 h-[35px] border border-[#9e8a4f] rounded-[3px] shadow-sm placeholder-[#9e8a4f] focus:outline-none focus:ring-brown-dark focus:border-brown-dark"
                    >
                      <option value="" className="block pb-2">
                        Choose your Address Type
                      </option>
                      {addressTypeData &&
                        addressTypeData.map((item) => (
                          <option
                            className="block pb-2"
                            key={item.name}
                            value={item.name}
                          >
                            {item.name}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div className="w-full pb-2">
                    <input
                      type="submit"
                      value="Create"
                      className="mt-2 appearance-none block w-full px-3 h-[35px] border border-[#9e8a4f] rounded-[3px] shadow-sm placeholder-[#9e8a4f] focus:outline-none focus:ring-brown-dark focus:border-brown-dark hover:bg-[#f9f1dc] transition duration-300 ease-in-out"
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      <div className="flex w-full items-center justify-between">
        <h1 className="text-[25px] font-[600] text-[#171203] pb-2">
          My Addresses
        </h1>
        <div
          className={`${styles.button}  mt-4 !rounded-[4px] !h-11 hover:opacity-95 transition duration-300 ease-in-out`}
          onClick={() => setOpen(true)}
        >
          <span className="text-[#fff4d7]">Add New</span>
        </div>
      </div>
      <br />
      {user &&
        user.addresses.map((item, index) => (
          <div
            className="w-full bg-[#f7ebca] h-[70px] rounded-[4px] flex items-center px-3 shadow justify-between pr-10"
            key={index}
          >
            <div className="flex items-center w-[10%]">
              <h5 className="pl-5 font-[600]">{item.addressType}</h5>
            </div>
            <div className="pl-8 flex items-center w-[50%]">
              <h6 className="800px:text-[unset] text-[12px]">
                {item.address1} {item.address2}
              </h6>
            </div>
            <div className="pl-8 flex items-center">
              <h6 className="text-[12px] 800px:text-[unset]">
                +63 {user && user.phoneNumber}
              </h6>
            </div>
            <div className="min-w-[10%] flex items-center justify-between pl-8">
              <AiOutlineDelete
                size={25}
                className="cursor-pointer"
                onClick={() => handleDelete(item)}
              />
            </div>
          </div>
        ))}
      {user && user.addresses.length === 0 && (
        <h5 className="text-center pt-20 text-[18px]">
          You not have any saved address yet!
        </h5>
      )}
    </div>
  );
};
export default ProfileContent;

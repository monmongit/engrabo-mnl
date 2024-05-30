import React, { useEffect, useState } from 'react';
import { server } from '../../server';
import { useDispatch, useSelector } from 'react-redux';
import {
  AiOutlineArrowRight,
  AiOutlineCamera,
  AiOutlineDelete,
  AiOutlineSearch,
} from 'react-icons/ai';
import styles from '../../styles/style';
import { Link } from 'react-router-dom';
import { MdTrackChanges } from 'react-icons/md';
import Button from '@mui/material/Button';
import { DataGrid } from '@mui/x-data-grid';

import {
  deleteUserAddress,
  loadUser,
  updateUserAddress,
  updateUserInformation,
} from '../../redux/action/user';
import { City, Country, State } from 'country-state-city';
import { toast } from 'react-toastify';
import axios from 'axios';
import { RxCross1 } from 'react-icons/rx';
import { getAllOrdersOfUser } from '../../redux/action/order';

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
      toast.success(successMessage);
      dispatch({ type: 'clearMessages' });
    }
  }, [dispatch, error, successMessage]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateUserInformation(name, email, phoneNumber, password));
  };

  useEffect(() => {
    if (user && user.name) {
      setName(user.name);
    }
  }, [user]);

  const handleImage = async (e) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatar(reader.result);
        axios
          .put(
            `${server}/user/update-avatar`,
            { avatar: reader.result },
            {
              withCredentials: true,
            }
          )
          .then((res) => {
            dispatch(loadUser());
            toast.success('Avatar updated successfully!');
          })
          .catch((error) => {
            toast.error(error);
          });
      }
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  return (
    <div className="w-full">
      {/* Profile Content */}
      {active === 1 && (
        <>
          {/* Image and Change Image */}
          <div
            className="w-full min-h-screen flex flex-col items-center"
            style={{ marginBottom: '100px' }}
          >
            <div className="p-4 flex w-full bg-white lg:w-[50%] flex-col justify-center ml-4 my-5 bg-[#171203] rounded-lg shadow-lg hover:shadow-xl hover:border-white border border-transparent transition duration-300">
              <div className="w-full flex items-center justify-center"></div>
              <div className="flex justify-center w-full">
                <div className="relative">
                  <img
                    src={avatar ? avatar : `${user?.avatar?.url}`}
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
                  className="flex flex-col items-center justify-center sm:px-5 px-2 sm:pb-0 pb-[60px]"
                >
                  {/* Fullname and Email Addresss */}

                  <div className="w-full flex flex-wrap justify-between pb-3">
                    <div className="w-full sm:w-[calc(50% - 10px)]">
                      <label
                        className="block pb-2 font-[600] text-black"
                        style={{ fontFamily: 'Roboto, sans-serif' }}
                      >
                        Full Name
                      </label>
                      <input
                        type="text"
                        className="mb-1 peer  w-full rounded-[7px]  !border  !border-gray-300 border-t-transparent bg-transparent bg-white px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700  shadow-lg shadow-gray-900/5 outline outline-0 ring-4 ring-transparent transition-all placeholder:text-gray-500 placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2  focus:!border-gray-900 focus:border-t-transparent focus:!border-t-gray-900 focus:outline-0 focus:ring-gray-900/10 disabled:border-0 disabled:bg-blue-gray-50"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div className="w-full sm:w-[calc(50% - 10px)] mt-5 sm:mt-0">
                      <label
                        className="block pb-2 font-[600] text-black"
                        style={{ fontFamily: 'Roboto, sans-serif' }}
                      >
                        Email Address
                      </label>
                      <input
                        type="text"
                        className="mb-1 peer w-full rounded-[7px]  !border  !border-gray-300 border-t-transparent bg-transparent bg-white px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700  shadow-lg shadow-gray-900/5 outline outline-0 ring-4 ring-transparent transition-all placeholder:text-gray-500 placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2  focus:!border-gray-900 focus:border-t-transparent focus:!border-t-gray-900 focus:outline-0 focus:ring-gray-900/10 disabled:border-0 disabled:bg-blue-gray-50"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="w-full flex flex-wrap justify-between pb-3">
                    <div className="w-full sm:w-[calc(50% - 10px)]">
                      <label
                        className="block pb-2 font-[600] text-black"
                        style={{ fontFamily: 'Roboto, sans-serif' }}
                      >
                        Phone Number
                      </label>
                      <input
                        type="number"
                        className="mb-1 peer  w-full rounded-[7px]  !border  !border-gray-300 border-t-transparent bg-transparent bg-white px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700  shadow-lg shadow-gray-900/5 outline outline-0 ring-4 ring-transparent transition-all placeholder:text-gray-500 placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2  focus:!border-gray-900 focus:border-t-transparent focus:!border-t-gray-900 focus:outline-0 focus:ring-gray-900/10 disabled:border-0 disabled:bg-blue-gray-50"
                        required
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                      />
                    </div>
                    <div className="w-full sm:w-[calc(50% - 10px)] mt-5 sm:mt-0">
                      <label
                        className="block pb-2 font-[600] text-black"
                        style={{ fontFamily: 'Roboto, sans-serif' }}
                      >
                        Enter your password
                      </label>
                      <input
                        type="password"
                        className="peer w-full rounded-[7px]  !border  !border-gray-300 border-t-transparent bg-transparent bg-white px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700  shadow-lg shadow-gray-900/5 outline outline-0 ring-4 ring-transparent transition-all placeholder:text-gray-500 placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2  focus:!border-gray-900 focus:border-t-transparent focus:!border-t-gray-900 focus:outline-0 focus:ring-gray-900/10 disabled:border-0 disabled:bg-blue-gray-50"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                  </div>

                  <div
                    className="w-[100%] flex items-center flex-col 800px:w-[100%] mt-5"
                    style={{ marginBottom: '10px' }}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      type="submit"
                      value="Update"
                      className={`${styles.input} !w-[100%] mb-4 800px:mb-0`}
                      required
                      //   readOnly
                    >
                      Update Profile
                    </Button>
                  </div>
                  {/* <input
                    type="submit"
                    value="Update"
                    required
                    className={`w-[250px] text-center text-[#171203] border border-[#171203] mt-4 !rounded-[4px] !h-11 hover:bg-[#e8d5a9] transition duration-300 ease-in-out`}
                  /> */}
                </form>
              </div>
            </div>
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

      {/* ChangePassword Content */}
      {active === 6 && (
        <div className="">
          <ChangePassword />
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
  const { user } = useSelector((state) => state.user);
  const { orders, isLoading } = useSelector((state) => state.order);
  const dispatch = useDispatch();
  const [statusFilter, setStatusFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(getAllOrdersOfUser(user._id));
  }, [dispatch, user._id]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const filteredOrders =
    orders &&
    orders.filter((item) => {
      const matchesSearch = item._id.includes(searchTerm);
      const matchesStatus = statusFilter === '' || item.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

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
            <Link to={`/user/order/${params.id}`}>
              <Button variant="contained" color="secondary">
                <AiOutlineArrowRight size={20} />
                Check
              </Button>
            </Link>
          </>
        );
      },
    },
  ];

  const row = [];

  filteredOrders &&
    filteredOrders.forEach((item) => {
      row.push({
        id: item._id,
        itemsQty: item.cart.length,
        total: '₱ ' + item.totalPrice,
        status: item.status,
      });
    });

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div
      className="w-full sm:px-8 pt-1 mt-10 bg-white overflow-x-auto"
      style={{
        marginBottom: '100px',
        borderRadius: '10px',
        marginLeft: 'auto',
        marginRight: isMobile ? '36px' : 'auto', // Apply margin-right only on mobile
        maxWidth: '90%',
      }}
    >
      <div className="mx-4">
        <div className="w-full flex justify-end items-center mb-4 px-4">
          <div className="relative w-full sm:w-[30%] mt-5">
            <input
              type="text"
              placeholder="Search Orders..."
              className="h-10 sm:h-[45px] pl-4 pr-10 w-full border-2 border-solid border-[#ff9800] rounded-md placeholder-[#9e8a4f] shadow-md transition ease-in-out duration-300 focus:outline-none hover:border-[#ff9800] hover:ring-[#ff9800] hover:ring-2"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <AiOutlineSearch
              size={30}
              className="absolute right-3 top-1.5 text-[#9e8a4f] cursor-pointer"
            />
          </div>
          <div className="relative w-full sm:w-[30%] mt-5 ml-4">
            <select
              className="h-10 sm:h-[45px] pl-4 pr-10 w-full border-2 border-solid border-[#ff9800] rounded-md placeholder-[#9e8a4f] shadow-md transition ease-in-out duration-300 focus:outline-none hover:border-[#ff9800] hover:ring-[#ff9800] hover:ring-2"
              value={statusFilter}
              onChange={handleStatusChange}
            >
              <option value="">All Orders</option>
              <option value="Processing">Processing</option>
              <option value="Transferred to delivery partner">
                Transferred to delivery partner
              </option>
              <option value="Shipping">Shipping</option>
              <option value="On the way">On the way</option>
              <option value="Delivered">Delivered</option>
              <option value="Processing Refund">Processing Refund</option>
              <option value="Refund Approved">Refund Approved</option>
              <option value="Refund Successful">Refund Successful</option>
            </select>
          </div>
        </div>
        <div className="w-full overflow-x-auto mb-10">
          <DataGrid
            rows={row}
            columns={columns}
            pageSize={10}
            disableSelectionOnClick
            autoHeight
            className="data-grid"
          />
        </div>
      </div>
    </div>
  );
};

// All Refund Orders Table
const AllRefundOrders = () => {
  const { user } = useSelector((state) => state.user);
  const { orders } = useSelector((state) => state.order);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllOrdersOfUser(user._id));
  }, [dispatch, user._id]);

  const eligibleOrders =
    orders &&
    orders.filter(
      (item) =>
        item.status === 'Processing Refund' ||
        item.status === 'Refund Approved' ||
        item.status === 'Refund Successfull'
    );

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
            <Link to={`/user/order/${params.id}`}>
              <Button>
                <AiOutlineArrowRight size={20} />
              </Button>
            </Link>
          </>
        );
      },
    },
  ];

  const row = [];

  eligibleOrders &&
    eligibleOrders.forEach((item) => {
      row.push({
        id: item._id,
        itemsQty: item.cart.length,
        total: '₱' + item.totalPrice,
        status: item.status,
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
  const { user } = useSelector((state) => state.user);
  const { orders } = useSelector((state) => state.order);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllOrdersOfUser(user._id));
  }, [dispatch, user._id]);

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
            <Link to={`/user/track/order/${params.id}`}>
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
        itemsQty: item.cart.length,
        total: '₱' + item.totalPrice,
        status: item.status,
      });
    });

  return (
    <div className="pl-8 pt-1">
      <DataGrid
        rows={row}
        columns={columns}
        pageSize={10}
        disableSelectionOnClick
        autoHeight
      />
    </div>
  );
};

// Change Password
const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const passwordChangeHandler = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(
        `${server}/user/update-user-password`,
        { oldPassword, newPassword, confirmPassword },
        { withCredentials: true }
      );
      toast.success(response.data.message);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  return (
    <>
      <div
        className="w-full min-h-screen flex flex-col items-center"
        style={{ marginBottom: '100px' }}
      >
        <div className="p-4 flex w-full bg-white lg:w-[50%] flex-col justify-center ml-4 my-5 bg-[#171203] rounded-lg shadow-lg hover:shadow-xl hover:border-white border border-transparent transition duration-300">
          <div className="w-full flex items-center justify-center"></div>
          <div className="flex justify-center w-full">
            <div className="relative">
              <h1 className="text-[25px] text-center font-[600] text-[#171203] pb-2">
                Change Password
              </h1>
            </div>
          </div>

          <div className="w-full px-5">
            <form
              onSubmit={passwordChangeHandler}
              required
              className="flex flex-col items-center justify-center sm:px-5 px-2 sm:pb-0 pb-[60px]"
            >
              {/* Fullname and Email Addresss */}
              <div className="w-full flex flex-wrap justify-between pb-3">
                <div className="w-full sm:w-[calc(50% - 10px)]">
                  <label
                    className="block pb-2 font-[600] text-black"
                    style={{ fontFamily: 'Roboto, sans-serif' }}
                  >
                    Current Password
                  </label>
                  <input
                    type="password"
                    className="mb-1 peer  w-full rounded-[7px]  !border  !border-gray-300 border-t-transparent bg-transparent bg-white px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700  shadow-lg shadow-gray-900/5 outline outline-0 ring-4 ring-transparent transition-all placeholder:text-gray-500 placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2  focus:!border-gray-900 focus:border-t-transparent focus:!border-t-gray-900 focus:outline-0 focus:ring-gray-900/10 disabled:border-0 disabled:bg-blue-gray-50"
                    required
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                  />
                </div>
                <div className="w-full sm:w-[calc(50% - 10px)] mt-5 sm:mt-0">
                  <label
                    className="block pb-2 font-[600] text-black"
                    style={{ fontFamily: 'Roboto, sans-serif' }}
                  >
                    New Password
                  </label>
                  <input
                    type="password"
                    className="mb-1 peer w-full rounded-[7px]  !border  !border-gray-300 border-t-transparent bg-transparent bg-white px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700  shadow-lg shadow-gray-900/5 outline outline-0 ring-4 ring-transparent transition-all placeholder:text-gray-500 placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2  focus:!border-gray-900 focus:border-t-transparent focus:!border-t-gray-900 focus:outline-0 focus:ring-gray-900/10 disabled:border-0 disabled:bg-blue-gray-50"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="w-full flex flex-wrap justify-between pb-3">
                <div className="w-full sm:w-[calc(50% - 10px)]">
                  <label
                    className="block pb-2 font-[600] text-black"
                    style={{ fontFamily: 'Roboto, sans-serif' }}
                  >
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    className="mb-1 peer  w-full rounded-[7px]  !border  !border-gray-300 border-t-transparent bg-transparent bg-white px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700  shadow-lg shadow-gray-900/5 outline outline-0 ring-4 ring-transparent transition-all placeholder:text-gray-500 placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2  focus:!border-gray-900 focus:border-t-transparent focus:!border-t-gray-900 focus:outline-0 focus:ring-gray-900/10 disabled:border-0 disabled:bg-blue-gray-50"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>

              <div
                className="w-[100%] flex items-center flex-col 800px:w-[100%] mt-5"
                style={{ marginBottom: '10px' }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  value="Update"
                  className={`${styles.input} !w-[100%] mb-4 800px:mb-0`}
                  required
                  //   readOnly
                >
                  Update Profile
                </Button>
              </div>
              {/* <input
                type="submit"
                value="Update"
                required
                className={`w-full text-center text-[#171203] border border-[#171203] mt-5 !rounded-[4px] !h-11 hover:bg-[#e8d5a9] transition duration-300 ease-in-out`}
              /> */}
            </form>
          </div>
        </div>
      </div>
    </>
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
      toast.error('Please fill all the fields!');
    } else {
      dispatch(
        updateUserAddress(
          country,
          state,
          city,
          address1,
          address2,
          zipCode,
          addressType
        )
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

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="w-full px-5 relative">
      {open && (
        <div className="fixed top-0 left-0 w-full h-screen bg-[#0000004b] flex items-center justify-center z-50">
          <div className="800px:w-[50%] w-[90%] bg-white shadow-lg h-[80vh] rounded-lg p-5 overflow-y-scroll hide-scrollbar">
            <div className="w-full flex justify-end p-3">
              <RxCross1
                size={30}
                className="cursor-pointer"
                onClick={() => setOpen(false)}
              />
            </div>
            <h5 className="text-[30px] font-bold font-Poppins text-center">
              Add New Address
            </h5>

            <div className="w-full">
              <form onSubmit={handleSubmit} className="w-full">
                <div className="w-full block p-4">
                  {/* Country Selection */}
                  <div className="w-full pb-2">
                    <label className="block text-l font-medium text-gray-800 mb-2  font-Poppins">
                      Country
                    </label>
                    <select
                      name=""
                      id=""
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                    <label className="block text-l font-medium text-gray-800 mb-2  font-Poppins">
                      State
                    </label>{' '}
                    <select
                      name=""
                      id=""
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                    <label className="block text-l font-medium text-gray-800 mb-2  font-Poppins">
                      City
                    </label>{' '}
                    <select
                      name=""
                      id=""
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                      <label className="block text-l font-medium text-gray-800 mb-2  font-Poppins">
                        Address 1
                      </label>
                    </label>
                    <input
                      type="address"
                      className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                      value={address1}
                      onChange={(e) => setAddress1(e.target.value)}
                    />
                  </div>

                  {/* Address 2 */}
                  <div className="w-full pb-2">
                    <label className="block text-l font-medium text-gray-800 mb-2  font-Poppins">
                      Address 2
                    </label>{' '}
                    <input
                      type="address"
                      className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={address2}
                      onChange={(e) => setAddress2(e.target.value)}
                    />
                  </div>

                  {/* ZipCode */}
                  <div className="w-full pb-2">
                    <label className="block text-l font-medium text-gray-800 mb-2  font-Poppins">
                      Zip Code
                    </label>{' '}
                    <input
                      type="number"
                      className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                    />
                  </div>

                  {/* Address Type */}
                  <div className="w-full pb-2">
                    <label className="block text-l font-medium text-gray-800 mb-2  font-Poppins">
                      Address Type
                    </label>{' '}
                    <select
                      name=""
                      id=""
                      value={addressType}
                      onChange={(e) => setAddressType(e.target.value)}
                      className="mb-5 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                      className="block w-full py-2 px-4 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded-lg cursor-pointer text-center mt-3"
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
          <div key={index}>
            <div className="w-full min-h-screen flex flex-col items-center">
              <div
                className="w-full bg-white rounded-[4px] p-4 shadow transition duration-300 ease-in-out hover:shadow-lg mb-4"
                style={{ width: isMobile ? '100%' : '50%' }}
              >
                <div className="flex items-center w-full mb-2">
                  <h6 className="text-[20px]  font-bold  font-Poppins font-medium sm:text-[unset] text-center w-full">
                    {item.addressType}
                  </h6>
                </div>
              </div>
              <div
                className="w-full bg-white rounded-[4px] p-4 shadow transition duration-300 ease-in-out hover:shadow-lg mb-4"
                style={{ width: isMobile ? '100%' : '50%' }}
              >
                {' '}
                <div className="flex items-center w-full mb-2">
                  <h6 className="text-[15px]  font-bold  font-Poppins font-medium sm:text-[unset] text-center w-full">
                    {item.address1}
                  </h6>
                </div>
              </div>
              <div
                className="w-full bg-white rounded-[4px] p-4 shadow transition duration-300 ease-in-out hover:shadow-lg mb-4"
                style={{ width: isMobile ? '100%' : '50%' }}
              >
                {' '}
                <div className="flex items-center w-full mb-2">
                  <h6 className="text-[15px]  font-bold  font-Poppins font-medium sm:text-[unset] text-center w-full">
                    {item.address2}
                  </h6>
                </div>
              </div>
              <div
                className="w-full bg-white rounded-[4px] p-4 shadow transition duration-300 ease-in-out hover:shadow-lg mb-4"
                style={{ width: isMobile ? '100%' : '50%' }}
              >
                {' '}
                <div className="flex items-center w-full mb-2">
                  <h6 className="text-[15px]  font-bold  font-Poppins font-medium sm:text-[unset] text-center w-full">
                    +63 {user && user.phoneNumber}
                  </h6>
                </div>
              </div>
              <div className="flex items-center justify-center w-full">
                <button
                  className="flex items-center px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-300 ease-in-out"
                  onClick={() => handleDelete(item)}
                >
                  <AiOutlineDelete size={20} className="mr-2" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}

      {user && user.addresses.length === 0 && (
        <h5 className="text-center pt-20 text-[18px]">
          You do not have any saved address yet!
        </h5>
      )}
    </div>
  );
};
export default ProfileContent;

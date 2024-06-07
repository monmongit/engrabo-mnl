import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import { DataGrid } from '@mui/x-data-grid';
import { useDispatch, useSelector } from 'react-redux';
import {
  AiOutlineDelete,
  AiOutlineSearch,
  AiOutlineHeart,
} from 'react-icons/ai';
import Loader from '../Layout/Loader';
import { getAllUsers, deleteUser } from '../../redux/action/user';
import { Link } from 'react-router-dom';

const AllUsers = () => {
  const { usersList, isLoading } = useSelector((state) => state.user);
  const { admin } = useSelector((state) => state.admin);
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  const [wishlistItems, setWishlistItems] = useState([]);
  const [wishlistEmptyMessage, setWishlistEmptyMessage] = useState('');

  useEffect(() => {
    dispatch(getAllUsers(admin._id));
  }, [dispatch, admin._id]);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      dispatch(deleteUser(id));
    }
  };

  const handleOpenWishlist = (wishlist) => {
    if (wishlist.length === 0) {
      setWishlistEmptyMessage('No items in wishlist');
    } else {
      setWishlistItems(wishlist);
      setWishlistEmptyMessage('');
    }
  };

  const handleCloseWishlist = () => {
    setWishlistItems([]);
    setWishlistEmptyMessage('');
  };

  const filteredUsers = usersList.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const calculateSelectedPrice = (item) => {
    return (
      item.selectedSize?.price ??
      item.selectedEngraving?.price ??
      item.selectedColor?.price ??
      (item.discountPrice > 0 ? item.discountPrice : item.originalPrice)
    );
  };

  const columns = [
    {
      field: 'image',
      headerName: 'User Profile',
      minWidth: 100,
      flex: 1,
      renderCell: (params) => (
        <img
          src={params.value}
          alt="User Avatar"
          className="w-[50px] h-[50px] rounded-full ml-[10px]"
        />
      ),
    },
    { field: 'name', headerName: 'User Name', minWidth: 100, flex: 1 },
    { field: 'email', headerName: 'User Email', minWidth: 150, flex: 1 },
    {
      field: 'phonenumber',
      headerName: 'User Phone Number',
      type: 'string',
      minWidth: 150,
      flex: 1,
    },
    {
      field: 'wishlist',
      headerName: 'Wishlist',
      minWidth: 130,
      flex: 0.5,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleOpenWishlist(params.row.wishlist)}
        >
          <AiOutlineHeart size={20} />
          Wishlist
        </Button>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      minWidth: 130,
      flex: 0.5,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="error"
          onClick={() => handleDelete(params.row.id)}
        >
          <AiOutlineDelete size={20} />
          Delete
        </Button>
      ),
    },
  ];

  const rows = filteredUsers.map((user) => ({
    id: user._id,
    image: user.avatar?.url || '',
    name: user.name,
    email: user.email,
    phonenumber: user.phoneNumber,
    wishlist: user.wishlist,
  }));

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-full px-0 sm:px-8 pt-1 mt-10 bg-white overflow-x-auto mb-16 rounded-md">
          <div className="mx-4">
            <div className="w-full flex justify-end items-center mb-4">
              <div className="relative w-full sm:w-[40%] mt-5">
                <input
                  type="text"
                  placeholder="Search Users..."
                  className="h-10 sm:h-[45px] pl-4 pr-10 w-full  border-2 border-solid border-[#171203] rounded-md placeholder-[#9e8a4f] shadow-md transition ease-in-out duration-300  focus:outline-none hover:border-[#171203] hover:ring-[#171203] hover:ring-1"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <AiOutlineSearch
                  size={30}
                  className="absolute right-2 top-1.5 cursor-pointer"
                />
              </div>
            </div>
            <div className="w-full overflow-x-auto mb-10">
              <DataGrid
                rows={rows}
                columns={columns}
                pageSize={10}
                disableSelectionOnClick
                autoHeight
                className="data-grid"
              />
            </div>
          </div>
          {wishlistItems.length > 0 || wishlistEmptyMessage ? (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-md w-3/4 md:w-1/2 lg:w-1/3">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Wishlist</h2>
                  <button
                    onClick={handleCloseWishlist}
                    className="text-xl font-bold"
                  >
                    &times;
                  </button>
                </div>
                {wishlistItems.length > 0 ? (
                  <div className="grid grid-cols-3 gap-4">
                    {wishlistItems.map((item) => (
                      <Link
                        to={`/product/${item._id}`}
                        key={item._id}
                        className="mb-4"
                      >
                        <img
                          src={item.images[0]?.url}
                          alt={item.name}
                          className="w-full h-[150px] object-cover mb-2"
                        />
                        <p className="text-lg font-semibold">{item.name}</p>
                        <p>₱ {calculateSelectedPrice(item)}</p>
                        <p>Stocks: {item.stock}</p>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p>{wishlistEmptyMessage}</p>
                )}
              </div>
            </div>
          ) : null}
        </div>
      )}
    </>
  );
};

export default AllUsers;

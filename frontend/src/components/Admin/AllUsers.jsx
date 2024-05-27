import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import { DataGrid } from '@mui/x-data-grid';
import { useDispatch, useSelector } from 'react-redux';
import { AiOutlineDelete, AiOutlineSearch } from 'react-icons/ai';
import Loader from '../Layout/Loader';
import { getAllUsers, deleteUser } from '../../redux/action/user';
import { Link } from 'react-router-dom';

const AllUsers = () => {
  const { usersList, isLoading } = useSelector((state) => state.user);
  const { admin } = useSelector((state) => state.admin);
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(getAllUsers(admin._id));
  }, [dispatch, admin._id]);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      dispatch(deleteUser(id));
      dispatch(getAllUsers(admin._id));
    }
  };

  const filteredUsers = usersList.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { field: 'id', headerName: 'User ID', minWidth: 150, flex: 0.7 },
    { field: 'name', headerName: 'User Name', minWidth: 150, flex: 0.7 },
    { field: 'email', headerName: 'User Email', minWidth: 130, flex: 0.8 },
    {
      field: 'phonenumber',
      headerName: 'User Phone Number',
      type: 'string',
      minWidth: 150,
      flex: 0.8,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      minWidth: 150,
      flex: 0.5,
      renderCell: (params) => (
        <Button onClick={() => handleDelete(params.row.id)}>
          <AiOutlineDelete size={20} />
        </Button>
      ),
    },
  ];

  const rows = filteredUsers.map((user) => ({
    id: user._id,
    name: user.name,
    email: user.email,
    phonenumber: user.phoneNumber,
  }));

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-full mx-8 pt-1 mt-10 bg-white">
          <div className="w-full flex justify-end items-center mb-4">
            <div className="relative w-[40%]">
              <input
                type="text"
                placeholder="Search Users..."
                className="h-[45px] pl-2 pr-10 w-full border-[#171203] border-[2px] rounded-md placeholder-[#9e8a4f]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <AiOutlineSearch
                size={30}
                className="absolute right-2 top-1.5 cursor-pointer"
              />
            </div>
          </div>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            disableSelectionOnClick
            autoHeight
          />
        </div>
      )}
    </>
  );
};

export default AllUsers;

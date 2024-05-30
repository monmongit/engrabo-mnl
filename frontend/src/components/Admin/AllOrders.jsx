import Button from '@mui/material/Button';
import { DataGrid } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Loader from '../Layout/Loader';
import { AiOutlineArrowRight, AiOutlineSearch } from 'react-icons/ai';
import { getAllOrdersOfAdmin } from '../../redux/action/order';

const AllOrders = () => {
  const { orders, isLoading } = useSelector((state) => state.order);
  const { admin } = useSelector((state) => state.admin);
  const dispatch = useDispatch();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    dispatch(getAllOrdersOfAdmin(admin._id));
  }, [dispatch, admin._id]);

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
      renderCell: (params) => (
        <Link to={`/order/${params.id}`}>
          <Button variant="contained" color="secondary">
            <AiOutlineArrowRight size={20} />
            Check
          </Button>
        </Link>
      ),
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

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div
          className="w-full sm:px-8 pt-1 mt-10 bg-white overflow-x-auto"
          style={{ marginBottom: '100px', borderRadius: '10px' }}
        >
          <div className="mx-4">
            <div className="w-full flex justify-end items-center mb-4">
              <div className="relative w-full sm:w-[30%] mt-5">
                <input
                  type="text"
                  placeholder="Search Orders..."
                  className="h-10 sm:h-[45px] pl-4 pr-10 w-full border-2 border-solid border-[#171203] rounded-md placeholder-[#9e8a4f] shadow-md transition ease-in-out duration-300 focus:outline-none hover:border-[#171203] hover:ring-[#171203] hover:ring-1"
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
                  className="h-10 sm:h-[45px] pl-4 pr-10 w-full border-2 border-solid border-[#171203] rounded-md placeholder-[#9e8a4f] shadow-md transition ease-in-out duration-300 focus:outline-none hover:border-[#171203] hover:ring-[#171203] hover:ring-1"
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
      )}
    </>
  );
};

export default AllOrders;

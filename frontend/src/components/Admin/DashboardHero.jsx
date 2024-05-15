import React, { useEffect, useState } from 'react';
import { AiOutlineArrowRight, AiOutlineMoneyCollect } from 'react-icons/ai';
import styles from '../../styles/style';
import { Link } from 'react-router-dom';
import { MdBorderClear } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { getAllOrdersOfAdmin } from '../../redux/action/order';
import { getAllProductsAdmin } from '../../redux/action/product';
import { getAllUsers } from '../../redux/action/user';

import { Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import {IoBagHandle, IoPieChart, IoPeople, IoCart} from 'react-icons/io5' 
// import { LuUser2 } from 'react-icons/lu';

const DashboardHero = () => {
  const dispatch = useDispatch();
  const { orders } = useSelector((state) => state.order);
  const { admin } = useSelector((state) => state.admin);
  const {usersList} = useSelector((state) => state.user)
  const { products } = useSelector((state) => state.products);
  const [deliveredOrder, setDeliveredOrder] = useState(null);
  
  console.log(admin);
  useEffect(() => {
    if (admin && admin._id) {
      dispatch(getAllOrdersOfAdmin(admin._id));
      dispatch(getAllProductsAdmin(admin._id));
      dispatch(getAllUsers(admin._id));
    }
  }, [dispatch, admin]);

  useEffect(() => {
    const orderData =
      orders && orders.filter((item) => item.status === 'Delivered');
    setDeliveredOrder(orderData);
  }, [orders]);

  const totalEarningWithoutTax =
    deliveredOrder &&
    deliveredOrder.reduce((acc, item) => acc + item.totalPrice, 0);

  const serviceCharge = totalEarningWithoutTax
    ? totalEarningWithoutTax * 0.1
    : 0;

  const availableBalance = totalEarningWithoutTax
    ? totalEarningWithoutTax - serviceCharge
    : 0;

  // computes the total expenses
   const ComputetotalExpenses = () => {
    if (!products || products.length === 0) {
      return 0;
    }

    // Iterate over each product and calculate its total cost based on stock and original price
    const totalExpenses = products.reduce((total, product) => {
      const productExpense = product.stock * product.originalPrice;
      return total + productExpense;
    }, 0);

    return totalExpenses;
 }

 const totalExpenses = ComputetotalExpenses();

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
                <AiOutlineArrowRight size={20} />
              </Button>
            </Link>
          </>
        );
      },
    },
  ];

  const row = [];

  const BoxWrapper = ({children}) =>{
    return <div className="bg-white rounded-sm p-4 flex-1 border border-gray-200 flex items-center">{children}</div>
  }

  orders &&
    orders.forEach((item) => {
      row.push({
        id: item._id,
        itemsQty: item.cart.reduce((acc, item) => acc + item.qty, 0),
        total: '₱ ' + item.totalPrice,
        status: item.status,
      });
    });

  return (
    <div className="w-full p-8">
      <h3 className="text-[22px] font-Poppins pb-2">Overview</h3>
      <div className="data-drid-analytic grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">

        {/* Total Sales */}
         <BoxWrapper>
          <div className="rounded-full h-12 w-12 flex items-center justify-center bg-sky-500">
            <IoBagHandle className='text-2xl text-white'/>
          </div>
          <div className="pl-4">
            <span className="text-sm text-gray-500 font-light">Total Sales</span>
            <div className="flex items-center">
              <strong className='text-xl text-gray-700 font-semibold'>₱ {availableBalance.toFixed(2)}</strong>
            </div>
          </div>
        </BoxWrapper>

        {/* total expenses */}
        <BoxWrapper>
          <div className="rounded-full h-12 w-12 flex items-center justify-center bg-orange-600">
            <IoPieChart className="text-2xl text-white" />
          </div>
          <div className="pl-4">
            <span className="text-sm text-gray-500 font-light">Total Expenses</span>
            <div className="flex items-center">
              <strong className="text-xl text-gray-700 font-semibold">₱ {totalExpenses.toFixed(2)}</strong>
            </div>
          </div>
        </BoxWrapper>

         {/* total customers */}
        <Link to="/dashboard-users">
          <BoxWrapper>
            <div className="rounded-full h-12 w-12 flex items-center justify-center bg-yellow-400">
                <IoPeople className="text-2xl text-white" />
            </div>
            <div className="pl-4">
              <span className="text-sm text-gray-500 font-light">Total Customers</span>
              <div className="flex items-center">
                <strong className="text-xl text-gray-700 font-semibold">{usersList && usersList.length}</strong>
              </div>
            </div>
          </BoxWrapper>
        </Link>

        {/* Total Orders */}
        <Link to="/dashboard-orders">
          <BoxWrapper>
              <div className="rounded-full h-12 w-12 flex items-center justify-center bg-green-600">
                  <IoCart className="text-2xl text-white" />
              </div>
              <div className="pl-4">
                <span className="text-sm text-gray-500 font-light">Total Orders</span>
                <div className="flex items-center">
                  <strong className="text-xl text-gray-700 font-semibold">{orders && orders.length}</strong>
                </div>
              </div>
          </BoxWrapper>
        </Link>
      </div>
      
      <br />

      {/* TODO: Add Analytics Bar Chart */}

      {/* Section for Latest Orders */}
      <h3 className="text-[22px] font-Poppins pb-2 text-[171203]">
        Latest Orders
      </h3>
      <div className="w-full min-h-[40vh] bg-white rounded">
        <DataGrid
          rows={row}
          columns={columns}
          pageSize={10}
          disableSelectionOnClick
          autoHeight
        />
      </div>
    </div>
  );
};

export default DashboardHero;

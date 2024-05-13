import React, { useEffect, useState } from 'react';
import { AiOutlineArrowRight, AiOutlineMoneyCollect } from 'react-icons/ai';
import styles from '../../styles/style';
import { Link } from 'react-router-dom';
import { MdBorderClear } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { getAllOrdersOfAdmin } from '../../redux/action/order';
import { getAllProductsAdmin } from '../../redux/action/product';
import { Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { FiShoppingBag } from 'react-icons/fi';
import { HiOutlineReceiptRefund } from 'react-icons/hi';
import {IoBagHandle, IoPieChart, IoPeople, IoCart} from 'react-icons/io5' 
// import { LuUser2 } from 'react-icons/lu';

const DashboardHero = () => {
  const dispatch = useDispatch();
  const { orders } = useSelector((state) => state.order);
  const { admin } = useSelector((state) => state.admin);
  const { products } = useSelector((state) => state.products);
  const [deliveredOrder, setDeliveredOrder] = useState(null);

  console.log(admin);
  useEffect(() => {
    if (admin && admin._id) {
      dispatch(getAllOrdersOfAdmin(admin._id));
      dispatch(getAllProductsAdmin(admin._id));
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

  const refundApprovedCount = orders
    ? orders.filter((order) => order.status === 'Refund Approved').length
    : 0;
  return (
    <div className="w-full p-8">
      <h3 className="text-[22px] font-Poppins pb-2">Overview</h3>
      <div className="w-full block 800px:flex items-center justify-between">
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

        {/* TODO: Add total Expenses */}

        {/* TODO: Add total Customers */}

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
        
        {/* all users */}
        {/* <div className="w-[80%] 800px:ml-0 ml-[40px] mb-4 800px:w-[18%] min-h-[20vh] bg-white shadow rounded px-2 py-5">
          <div className="flex items-center">
            <LuUser2 size={30} className="mr-2" />
            <h3
              className={`${styles.productTitle} !text-[18px] leading-5 !font-[400] text-[#534723]`}
            >
              All User
            </h3>
          </div>
          <h5 className="pt-2 pl-[36px] text-[22px] font-[500]">
            {users && users.length}
          </h5>
          <Link to="/dashboard-refunds">
            <h5 className="pt-4 pl-2 text-[#171203]">View User</h5>
          </Link>
        </div> */}
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

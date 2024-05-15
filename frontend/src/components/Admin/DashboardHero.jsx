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
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const DashboardHero = () => {
  const dispatch = useDispatch();
  const { orders } = useSelector((state) => state.order);
  const { admin } = useSelector((state) => state.admin);
  const {usersList} = useSelector((state) => state.user)
  const { products } = useSelector((state) => state.products);
  const [deliveredOrder, setDeliveredOrder] = useState(null);
  
  console.log("orders: ",orders)
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

  // Call our Computation Functions, Order Dashboard and Analytics 
  const availableBalance = computeTotalSales(deliveredOrder);
  const totalExpenses = computeTotalExpenses(products);
  const {columns, row} = ordersDashboard(orders)
  const displayAnalytics = transactionChart(orders, products)

  // css stying custom 
  const BoxWrapper = ({children}) =>{return <div className="bg-white rounded-sm p-4 flex-1 border border-gray-200 flex items-center">{children}</div>}
  
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
      {/* transactions */}
      <div className="transaction-analytic">
        {displayAnalytics}
      </div>

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


// FUNCTION DEFINITIONS
const computeTotalSales = (deliveredOrder) => {
  const totalEarningWithoutTax =
    deliveredOrder &&
    deliveredOrder.reduce((acc, item) => acc + item.totalPrice, 0);

  const serviceCharge = totalEarningWithoutTax
    ? totalEarningWithoutTax * 0.1
    : 0;

  const availableBalance = totalEarningWithoutTax
    ? totalEarningWithoutTax - serviceCharge
    : 0;

  return availableBalance;
}
const computeTotalExpenses = (products) => {
  if (!products || products.length === 0) {
    return 0;
  }

  // Iterate over each product and calculate its total cost based on stock and gross price
  const totalExpenses = products.reduce((total, product) => {
    const productExpense = product.stock * product.grossPrice;
    return total + productExpense;
  }, 0);

  return totalExpenses;
}

const ordersDashboard = (orders) => {

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

  
  orders &&
    orders.forEach((item) => {
      row.push({
        id: item._id,
        itemsQty: item.cart.reduce((acc, item) => acc + item.qty, 0),
        total: '₱ ' + item.totalPrice,
        status: item.status,
      });
    });

  return {columns, row}
}

const transactionChart = (orders,products) => {
  // check if ordrers 
  if(!orders || !orders.length ){
    console.log("orders data not available")
  } 
  // Initialize monthly sales object with zeros for all months
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const monthlySales = {};
  for (let month = 0; month < 12; month++) {
    const key = `${currentYear}-${month}`;
    monthlySales[key] = {
      month: month,
      year: currentYear,
      sales: 0,
      orders: 0
    };
  }

  // Group orders by month
  orders.forEach(order => { 
      const paidAt = new Date(order.paidAt);
      const month = paidAt.getMonth();
      const year = paidAt.getFullYear();
      const key = `${year}-${month}`;
      monthlySales[key].orders++;
      if (order.status === "Delivered") {
      monthlySales[key].sales += order.totalPrice;
    }
  });

  console.log("Product for computing expenses: ", products)
  // Group expenses by month
  const monthlyExpenses = {};
  products.forEach(product => {
    const createdAt = new Date(product.createAt);
    const month = createdAt.getMonth();
    const year = createdAt.getFullYear();
    const key = `${year}-${month}`;
    const productExpenses = product.stock * product.grossPrice;
    if (!monthlyExpenses[key]) {
      monthlyExpenses[key] = {
        month: month,
        year: year,
        expenses: productExpenses
      };
    } else {
      monthlyExpenses[key].expenses += productExpenses;
    }
  });

  console.log("monthly expenses: ", monthlyExpenses)

  // Convert object to array of monthly sales with sales formatted to two decimal places
  const formattedData = Object.values(monthlySales).map(item => ({
    month: new Date(item.year, item.month, 1).toLocaleString('en-US', { month: 'long' }),
    sales: item.sales.toFixed(2), // Format sales to two decimal places
    orders: item.orders,
    expenses: monthlyExpenses[`${item.year}-${item.month}`] ? monthlyExpenses[`${item.year}-${item.month}`].expenses.toFixed(2) : 0
  }));

  console.log("Formatted Data: ",formattedData);


  const data = formattedData;
  return (
    <div className="h-[22rem] bg-white p-4 rounded-sm border border-gray-200 flex flex-col flex-1">
      <div className='flex justify-between items-center'>
        <div className='align-middle'>
          <strong className="text-gray-700 font-medium">Transactions</strong>
        </div>
        <div className="mb-2 align-middle">
          {/* <button className="bg-blue-400 hover:bg-blue-700 text-white font-medium py-1 px-2 rounded" onClick={downloadCsv}>
            Download CSV
          </button> */}
        </div>
      </div>
      <div className="mt-3 w-full flex-1 text-xs">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            width={500}
            height={600}
            data={data}
            margin={{
              top: 20,
              right: 10,
              left: -10,
              bottom: 0
            }}
          >
            <CartesianGrid strokeDasharray="3 3 0 0" vertical={false} />
            <XAxis dataKey="month" />
            <YAxis tickCount={100} tick={{ fontSize: 12, fontFamily: 'Arial', dy: 5 }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="sales" fill="#0ea5e9" />
            <Bar dataKey="expenses" fill="#ea580c" />
            <Bar dataKey="orders" fill="#82ca9d" /> 
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// To do: Y axix of analytics, Use ApexCharts instead, Functionality to download the reports


export default DashboardHero;

import React, { useEffect, useState } from 'react';
import { AiOutlineArrowRight } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAllOrdersOfAdmin } from '../../redux/action/order';
import { getAllProductsAdmin } from '../../redux/action/product';
import { getAllUsers } from '../../redux/action/user';
import { Button, MenuItem, Select } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { IoBagHandle, IoPieChart, IoPeople, IoCart } from 'react-icons/io5';
import Chart from 'react-apexcharts';

const DashboardHero = () => {
  const dispatch = useDispatch();
  const { orders } = useSelector((state) => state.order);
  const { admin } = useSelector((state) => state.admin);
  const { usersList } = useSelector((state) => state.user);
  const { products } = useSelector((state) => state.products);
  const [deliveredOrder, setDeliveredOrder] = useState(null);
  const [selectedMonth1, setSelectedMonth1] = useState('');
  const [selectedMonth2, setSelectedMonth2] = useState('');
  const [comparisonData, setComparisonData] = useState(null);

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

  const availableBalance = computeTotalSales(deliveredOrder);
  const totalExpenses = computeTotalExpenses(products);
  const { columns, row } = ordersDashboard(orders);
  const displayAnalytics = transactionChart(orders, products);

  const handleMonthChange1 = (event) => {
    setSelectedMonth1(event.target.value);
  };

  const handleMonthChange2 = (event) => {
    setSelectedMonth2(event.target.value);
  };

  useEffect(() => {
    if (selectedMonth1 && selectedMonth2) {
      const data1 = computeComparisonData(selectedMonth1, orders, products);
      const data2 = computeComparisonData(selectedMonth2, orders, products);
      const differences = computeDifferences(data1, data2);
      setComparisonData({ data1, data2, differences });
    }
  }, [selectedMonth1, selectedMonth2, orders, products]);

  const computeComparisonData = (month, orders, products) => {
    const [year, monthIndex] = month.split('-');
    const sales = orders
      .filter((order) => {
        const paidAt = new Date(order.paidAt);
        return (
          paidAt.getFullYear() === parseInt(year) &&
          paidAt.getMonth() === parseInt(monthIndex) &&
          order.status === 'Delivered'
        );
      })
      .reduce((acc, order) => acc + order.totalPrice, 0);

    const expenses = products
      .filter((product) => {
        const createdAt = new Date(product.createAt);
        return (
          createdAt.getFullYear() === parseInt(year) &&
          createdAt.getMonth() === parseInt(monthIndex)
        );
      })
      .reduce((acc, product) => {
        let productExpense = 0;
        if (
          (product.sizes && product.sizes.length > 0) ||
          (product.engravings && product.engravings.length > 0)
        ) {
          const sizeExpenses = product.sizes.reduce(
            (sizeAcc, size) =>
              sizeAcc + (size.stock || 0) * (size.grossPrice || 0),
            0
          );
          const engravingExpenses = product.engravings.reduce(
            (engravingAcc, engraving) =>
              engravingAcc +
              (engraving.stock || 0) * (engraving.grossPrice || 0),
            0
          );
          productExpense = sizeExpenses + engravingExpenses;
        } else if (product.colors && product.colors.length > 0) {
          productExpense = product.colors.reduce(
            (colorAcc, color) =>
              colorAcc + (color.stock || 0) * (product.grossPrice || 0),
            0
          );
        } else {
          productExpense = (product.stock || 0) * (product.grossPrice || 0);
        }
        return acc + productExpense;
      }, 0);

    const ordersCount = orders.filter((order) => {
      const paidAt = new Date(order.paidAt);
      return (
        paidAt.getFullYear() === parseInt(year) &&
        paidAt.getMonth() === parseInt(monthIndex)
      );
    }).length;

    const deliveredOrdersCount = orders.filter((order) => {
      const paidAt = new Date(order.paidAt);
      return (
        paidAt.getFullYear() === parseInt(year) &&
        paidAt.getMonth() === parseInt(monthIndex) &&
        order.status === 'Delivered'
      );
    }).length;

    return { sales, expenses, ordersCount, deliveredOrdersCount };
  };

  const computeDifferences = (data1, data2) => {
    const salesDifference = Math.abs(data1.sales - data2.sales);
    const expensesDifference = Math.abs(data1.expenses - data2.expenses);
    const ordersCountDifference = Math.abs(
      data1.ordersCount - data2.ordersCount
    );
    const deliveredOrdersCountDifference = Math.abs(
      data1.deliveredOrdersCount - data2.deliveredOrdersCount
    );
    return {
      salesDifference,
      expensesDifference,
      ordersCountDifference,
      deliveredOrdersCountDifference,
    };
  };

  const BoxWrapper = ({ children }) => {
    return (
      <div className="bg-white rounded-sm p-4 flex-1 border border-gray-200 flex items-center">
        {children}
      </div>
    );
  };

  const formatMonthYear = (month) => {
    const [year, monthIndex] = month.split('-');
    const date = new Date(year, monthIndex, 1);
    return date.toLocaleString('en-US', { month: 'long', year: 'numeric' });
  };

  const renderComparisonCharts = () => {
    if (!comparisonData) return null;

    const { data1, data2 } = comparisonData;

    const dailyCategories = generateDailyCategories(selectedMonth1);

    const dailySeries1 = generateDailySeries(selectedMonth1, orders, products);
    const dailySeries2 = generateDailySeries(selectedMonth2, orders, products);

    const dailySalesExpensesSeries = [
      {
        name: formatMonthYear(selectedMonth1) + ' Sales',
        data: dailySeries1.sales,
      },
      {
        name: formatMonthYear(selectedMonth1) + ' Expenses',
        data: dailySeries1.expenses,
      },
      {
        name: formatMonthYear(selectedMonth2) + ' Sales',
        data: dailySeries2.sales,
      },
      {
        name: formatMonthYear(selectedMonth2) + ' Expenses',
        data: dailySeries2.expenses,
      },
    ];

    const dailyOrdersDeliveredSeries = [
      {
        name: formatMonthYear(selectedMonth1) + ' Total Orders',
        data: dailySeries1.orders,
      },
      {
        name: formatMonthYear(selectedMonth1) + ' Delivered Orders',
        data: dailySeries1.delivered,
      },
      {
        name: formatMonthYear(selectedMonth2) + ' Total Orders',
        data: dailySeries2.orders,
      },
      {
        name: formatMonthYear(selectedMonth2) + ' Delivered Orders',
        data: dailySeries2.delivered,
      },
    ];

    const chartOptions = {
      chart: {
        type: 'line',
      },
      stroke: {
        width: 2,
        curve: 'smooth',
      },
      xaxis: {
        categories: dailyCategories,
      },
      yaxis: {
        title: {
          text: 'Amount (₱)',
        },
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return (
              '₱' + val.toLocaleString('en-US', { minimumFractionDigits: 2 })
            );
          },
        },
      },
    };

    return (
      <div className="comparison-charts mt-4">
        <h4 className="text-lg font-semibold">Comparison Charts</h4>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <h5 className="text-md font-medium text-center">
              Daily Total Sales and Total Expenses
            </h5>
            <Chart
              options={chartOptions}
              series={dailySalesExpensesSeries}
              type="line"
              height={350}
            />
          </div>
          <div>
            <h5 className="text-md font-medium text-center">
              Daily Total Orders and Delivered Orders
            </h5>
            <Chart
              options={chartOptions}
              series={dailyOrdersDeliveredSeries}
              type="line"
              height={350}
            />
          </div>
        </div>
      </div>
    );
  };

  const generateDailyCategories = (month) => {
    const [year, monthIndex] = month.split('-');
    const date = new Date(year, monthIndex, 1);
    const daysInMonth = new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      0
    ).getDate();
    const categories = [];
    for (let i = 1; i <= daysInMonth; i++) {
      categories.push(`${i}`);
    }
    return categories;
  };

  const generateDailySeries = (month, orders, products) => {
    const [year, monthIndex] = month.split('-');
    const salesData = [];
    const expensesData = [];
    const ordersData = [];
    const deliveredData = [];
    const daysInMonth = new Date(year, parseInt(monthIndex) + 1, 0).getDate();

    for (let i = 1; i <= daysInMonth; i++) {
      const daySales = orders
        .filter((order) => {
          const paidAt = new Date(order.paidAt);
          return (
            paidAt.getFullYear() === parseInt(year) &&
            paidAt.getMonth() === parseInt(monthIndex) &&
            paidAt.getDate() === i &&
            order.status === 'Delivered'
          );
        })
        .reduce((acc, order) => acc + order.totalPrice, 0);
      salesData.push(daySales);

      const dayExpenses = products
        .filter((product) => {
          const createdAt = new Date(product.createAt);
          return (
            createdAt.getFullYear() === parseInt(year) &&
            createdAt.getMonth() === parseInt(monthIndex) &&
            createdAt.getDate() === i
          );
        })
        .reduce((acc, product) => {
          let productExpense = 0;
          if (
            (product.sizes && product.sizes.length > 0) ||
            (product.engravings && product.engravings.length > 0)
          ) {
            const sizeExpenses = product.sizes.reduce(
              (sizeAcc, size) =>
                sizeAcc + (size.stock || 0) * (size.grossPrice || 0),
              0
            );
            const engravingExpenses = product.engravings.reduce(
              (engravingAcc, engraving) =>
                engravingAcc +
                (engraving.stock || 0) * (engraving.grossPrice || 0),
              0
            );
            productExpense = sizeExpenses + engravingExpenses;
          } else if (product.colors && product.colors.length > 0) {
            productExpense = product.colors.reduce(
              (colorAcc, color) =>
                colorAcc + (color.stock || 0) * (product.grossPrice || 0),
              0
            );
          } else {
            productExpense = (product.stock || 0) * (product.grossPrice || 0);
          }
          return acc + productExpense;
        }, 0);
      expensesData.push(dayExpenses);

      const dayOrders = orders.filter((order) => {
        const paidAt = new Date(order.paidAt);
        return (
          paidAt.getFullYear() === parseInt(year) &&
          paidAt.getMonth() === parseInt(monthIndex) &&
          paidAt.getDate() === i
        );
      }).length;
      ordersData.push(dayOrders);

      const dayDeliveredOrders = orders.filter((order) => {
        const paidAt = new Date(order.paidAt);
        return (
          paidAt.getFullYear() === parseInt(year) &&
          paidAt.getMonth() === parseInt(monthIndex) &&
          paidAt.getDate() === i &&
          order.status === 'Delivered'
        );
      }).length;
      deliveredData.push(dayDeliveredOrders);
    }

    return {
      sales: salesData,
      expenses: expensesData,
      orders: ordersData,
      delivered: deliveredData,
    };
  };

  return (
    <div className="w-full p-2">
      <div className="mt-2 p-4 bg-[#171203] mb-4 rounded-lg shadow-lg hover:shadow-xl hover:border-white border border-transparent transition duration-300">
        <h3 className="text-[22px] font-Poppins pb-2 text-white">Overview</h3>
      </div>

      <div className="data-drid-analytic grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <BoxWrapper>
          <div className="rounded-full h-12 w-12 flex items-center justify-center bg-sky-500">
            <IoBagHandle className="text-2xl text-white" />
          </div>
          <div className="pl-4 flex flex-col">
            <span className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-500 font-light mb-1">
              Total Sales
            </span>
            <div className="flex items-center">
              <strong className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-700 font-semibold">
                ₱{' '}
                {availableBalance.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                })}
              </strong>
            </div>
          </div>
        </BoxWrapper>
        <BoxWrapper>
          <div className="rounded-full h-12 w-12 flex items-center justify-center bg-orange-600">
            <IoPieChart className="text-2xl text-white" />
          </div>
          <div className="pl-4 flex flex-col">
            <span className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-500 font-light mb-1">
              Total Expenses
            </span>
            <div className="flex items-center">
              <strong className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-700 font-semibold">
                ₱{' '}
                {totalExpenses.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                })}
              </strong>
            </div>
          </div>
        </BoxWrapper>
        <Link to="/dashboard-users">
          <BoxWrapper>
            <div className="rounded-full h-12 w-12 flex items-center justify-center bg-yellow-400">
              <IoPeople className="text-2xl text-white" />
            </div>
            <div className="pl-4 flex flex-col">
              <span className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-500 font-light mb-1">
                Total Customers
              </span>
              <div className="flex items-center">
                <strong className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-700 font-semibold">
                  {usersList && usersList.length}
                </strong>
              </div>
            </div>
          </BoxWrapper>
        </Link>
        <Link to="/dashboard-orders">
          <BoxWrapper>
            <div className="rounded-full h-12 w-12 flex items-center justify-center bg-green-600">
              <IoCart className="text-2xl text-white" />
            </div>
            <div className="pl-4 flex flex-col">
              <span className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-500 font-light mb-1">
                Total Orders
              </span>
              <div className="flex items-center">
                <strong className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-700 font-semibold">
                  {orders && orders.length}
                </strong>
              </div>
            </div>
          </BoxWrapper>
        </Link>
      </div>

      <br />
      <div className="transaction-analytic">{displayAnalytics}</div>

      <div className="mt-4 p-4 bg-[#171203] mb-4 rounded-lg shadow-lg hover:shadow-xl hover:border-white border border-transparent transition duration-300">
        <h3 className="text-[22px] font-Poppins pb-2 text-white">
          {' '}
          Compare Data
        </h3>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between">
        <Select
          value={selectedMonth1}
          onChange={handleMonthChange1}
          displayEmpty
          className="mb-2 sm:mr-4 sm:mb-0"
        >
          <MenuItem value="" disabled>
            Select Month
          </MenuItem>
          {getMonthOptions().map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
        <Select
          value={selectedMonth2}
          onChange={handleMonthChange2}
          displayEmpty
          className="mb-2 sm:mr-4 sm:mb-0"
        >
          <MenuItem value="" disabled>
            Select Month
          </MenuItem>
          {getMonthOptions().map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </div>
      {renderComparisonCharts()}
      {comparisonData && (
        <div className="comparison-results mt-4">
          <h4 className="text-lg font-semibold">Comparison Results</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <BoxWrapper>
              <div className="flex flex-col md:flex-row w-full">
                <div className="md:w-1/2">
                  <span className="text-sm  text-gray-500 font-light">
                    Total Sales of {formatMonthYear(selectedMonth1)}
                  </span>
                  <div className="flex items-center">
                    <strong className="text-xl text-gray-700 font-semibold">
                      <span className="text-base sm:text-lg md:text-xl lg:text-2xl">
                        ₱{' '}
                        {comparisonData.data1.sales.toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    </strong>
                  </div>
                  <span className="text-sm text-gray-500 font-light">
                    Total Sales of {formatMonthYear(selectedMonth2)}
                  </span>
                  <div className="flex items-center">
                    <strong className="text-xl text-gray-700 font-semibold">
                      <span className="text-base sm:text-lg md:text-xl lg:text-2xl">
                        ₱{' '}
                        {comparisonData.data2.sales.toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    </strong>
                  </div>
                  <span className="text-sm text-gray-500 font-light">
                    Difference of {formatMonthYear(selectedMonth1)} and{' '}
                    {formatMonthYear(selectedMonth2)}
                  </span>
                  <div className="flex items-center">
                    <strong className="text-xl text-gray-700 font-semibold">
                      <span className="text-base sm:text-lg md:text-xl lg:text-2xl">
                        ₱{' '}
                        {comparisonData.differences.salesDifference.toLocaleString(
                          'en-US',
                          { minimumFractionDigits: 2 }
                        )}
                      </span>
                    </strong>
                  </div>
                </div>
                <div className="md:w-1/2 md:text-right mt-4 md:mt-0">
                  <h4 className="text-lg font-semibold mb-4">
                    Total Sales Comparison
                  </h4>

                  <Chart
                    options={{
                      chart: {
                        type: 'pie',
                      },
                      labels: [
                        formatMonthYear(selectedMonth1),
                        formatMonthYear(selectedMonth2),
                      ],
                    }}
                    series={[
                      comparisonData.data1.sales,
                      comparisonData.data2.sales,
                    ]}
                    type="pie"
                    width="100%"
                    height="200"
                  />
                </div>
              </div>
            </BoxWrapper>

            <BoxWrapper>
              <div className="flex flex-col md:flex-row w-full">
                <div className="md:w-1/2">
                  <span className="text-sm text-gray-500 font-light">
                    Total Expenses of {formatMonthYear(selectedMonth1)}
                  </span>
                  <div className="flex items-center">
                    <strong className="text-xl text-gray-700 font-semibold">
                      <span className="text-base sm:text-lg md:text-xl lg:text-2xl">
                        ₱{' '}
                        {comparisonData.data1.expenses.toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    </strong>
                  </div>
                  <span className="text-sm text-gray-500 font-light">
                    Total Expenses of {formatMonthYear(selectedMonth2)}
                  </span>
                  <div className="flex items-center">
                    <strong className="text-xl text-gray-700 font-semibold">
                      <span className="text-base sm:text-lg md:text-xl lg:text-2xl">
                        ₱{' '}
                        {comparisonData.data2.expenses.toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    </strong>
                  </div>
                  <span className="text-sm text-gray-500 font-light">
                    Difference of {formatMonthYear(selectedMonth1)} and{' '}
                    {formatMonthYear(selectedMonth2)}
                  </span>
                  <div className="flex items-center">
                    <strong className="text-xl text-gray-700 font-semibold">
                      <span className="text-base sm:text-lg md:text-xl lg:text-2xl">
                        ₱{' '}
                        {comparisonData.differences.expensesDifference.toLocaleString(
                          'en-US',
                          { minimumFractionDigits: 2 }
                        )}
                      </span>
                    </strong>
                  </div>
                </div>
                <div className="md:w-1/2 md:text-right mt-4 md:mt-0">
                  <h4 className="text-lg font-semibold mb-4 ml-10">
                    Total Expenses Comparison
                  </h4>
                  <Chart
                    options={{
                      chart: {
                        type: 'pie',
                      },
                      labels: [
                        formatMonthYear(selectedMonth1),
                        formatMonthYear(selectedMonth2),
                      ],
                    }}
                    series={[
                      comparisonData.data1.expenses,
                      comparisonData.data2.expenses,
                    ]}
                    type="pie"
                    width="100%"
                    height="200"
                  />
                </div>
              </div>
            </BoxWrapper>
            <BoxWrapper>
              <div className="flex flex-col md:flex-row w-full">
                <div className="md:w-1/2">
                  <span className="text-sm text-gray-500 font-light">
                    Total Orders of {formatMonthYear(selectedMonth1)}
                  </span>
                  <div className="flex items-center">
                    <strong className="text-xl text-gray-700 font-semibold">
                      <span className="text-base sm:text-lg md:text-xl lg:text-2xl">
                        {comparisonData.data1.ordersCount}
                      </span>
                    </strong>
                  </div>
                  <span className="text-sm text-gray-500 font-light">
                    Total Orders of {formatMonthYear(selectedMonth2)}
                  </span>
                  <div className="flex items-center">
                    <strong className="text-xl text-gray-700 font-semibold">
                      <span className="text-base sm:text-lg md:text-xl lg:text-2xl">
                        {comparisonData.data2.ordersCount}
                      </span>
                    </strong>
                  </div>
                  <span className="text-sm text-gray-500 font-light">
                    Difference of {formatMonthYear(selectedMonth1)} and{' '}
                    {formatMonthYear(selectedMonth2)}
                  </span>
                  <div className="flex items-center">
                    <strong className="text-xl text-gray-700 font-semibold">
                      <span className="text-base sm:text-lg md:text-xl lg:text-2xl">
                        {comparisonData.differences.ordersCountDifference}
                      </span>
                    </strong>
                  </div>
                </div>
                <div className="md:w-1/2 md:text-right mt-4 md:mt-0">
                  <h4 className="text-lg font-semibold mb-4 ml-10">
                    Total Orders Comparison
                  </h4>
                  <Chart
                    options={{
                      chart: {
                        type: 'pie',
                      },
                      labels: [
                        formatMonthYear(selectedMonth1),
                        formatMonthYear(selectedMonth2),
                      ],
                    }}
                    series={[
                      comparisonData.data1.ordersCount,
                      comparisonData.data2.ordersCount,
                    ]}
                    type="pie"
                    width="100%"
                    height="200"
                  />
                </div>
              </div>
            </BoxWrapper>
            <BoxWrapper>
              <div className="flex flex-col md:flex-row w-full">
                <div className="md:w-1/2">
                  <span className="text-sm text-gray-500 font-light">
                    Delivered Orders of {formatMonthYear(selectedMonth1)}
                  </span>
                  <div className="flex items-center">
                    <strong className="text-xl text-gray-700 font-semibold">
                      <span className="text-base sm:text-lg md:text-xl lg:text-2xl">
                        {comparisonData.data1.deliveredOrdersCount}
                      </span>
                    </strong>
                  </div>
                  <span className="text-sm text-gray-500 font-light">
                    Delivered Orders of {formatMonthYear(selectedMonth2)}
                  </span>
                  <div className="flex items-center">
                    <strong className="text-xl text-gray-700 font-semibold">
                      <span className="text-base sm:text-lg md:text-xl lg:text-2xl">
                        {comparisonData.data2.deliveredOrdersCount}
                      </span>
                    </strong>
                  </div>
                  <span className="text-sm text-gray-500 font-light">
                    Difference of {formatMonthYear(selectedMonth1)} and{' '}
                    {formatMonthYear(selectedMonth2)}
                  </span>
                  <div className="flex items-center">
                    <strong className="text-xl text-gray-700 font-semibold">
                      <span className="text-base sm:text-lg md:text-xl lg:text-2xl">
                        {
                          comparisonData.differences
                            .deliveredOrdersCountDifference
                        }
                      </span>
                    </strong>
                  </div>
                </div>
                <div className="md:w-1/2 md:text-right mt-4 md:mt-0">
                  <h4 className="text-lg font-semibold mb-4 ml-10">
                    Delivered Orders Comparison
                  </h4>
                  <Chart
                    options={{
                      chart: {
                        type: 'pie',
                      },
                      labels: [
                        formatMonthYear(selectedMonth1),
                        formatMonthYear(selectedMonth2),
                      ],
                    }}
                    series={[
                      comparisonData.data1.deliveredOrdersCount,
                      comparisonData.data2.deliveredOrdersCount,
                    ]}
                    type="pie"
                    width="100%"
                    height="200"
                  />
                </div>
              </div>
            </BoxWrapper>
          </div>
        </div>
      )}

      <div className="mt-4 p-4 bg-[#171203] mb-4 rounded-lg shadow-lg hover:shadow-xl hover:border-white border border-transparent transition duration-300">
        <h3 className="text-[22px] font-Poppins pb-2 text-white">
          {' '}
          Latest Orders
        </h3>
      </div>
      <div
        className="w-full min-h-[40vh] bg-white rounded "
        style={{ marginBottom: '100px' }}
      >
        <DataGrid
          rows={row}
          columns={columns}
          pageSize={10}
          disableSelectionOnClick
          autoHeight
        />
      </div>
      <div id="chart"></div>
    </div>
  );
};

const computeTotalSales = (deliveredOrder) => {
  const totalEarningWithoutTax =
    deliveredOrder &&
    deliveredOrder.reduce((acc, item) => acc + item.totalPrice, 0);

  const availableBalance = totalEarningWithoutTax ? totalEarningWithoutTax : 0;

  return availableBalance;
};

const computeTotalExpenses = (products) => {
  if (!products || products.length === 0) {
    return 0;
  }

  const totalExpenses = products.reduce((total, product) => {
    let productExpense = 0;
    if (product.sizes && product.sizes.length > 0) {
      productExpense = product.sizes.reduce(
        (sizeAcc, size) => sizeAcc + (size.stock || 0) * (size.grossPrice || 0),
        0
      );
    } else if (product.engravings && product.engravings.length > 0) {
      productExpense = product.engravings.reduce(
        (engravingAcc, engraving) =>
          engravingAcc + (engraving.stock || 0) * (engraving.grossPrice || 0),
        0
      );
    } else if (product.colors && product.colors.length > 0) {
      productExpense = product.colors.reduce(
        (colorAcc, color) =>
          colorAcc + (color.stock || 0) * (product.grossPrice || 0),
        0
      );
    } else {
      productExpense = (product.stock || 0) * (product.grossPrice || 0);
    }
    return total + productExpense;
  }, 0);

  return totalExpenses;
};

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

  orders &&
    orders.forEach((item) => {
      row.push({
        id: item._id,
        itemsQty: item.cart.reduce((acc, item) => acc + item.qty, 0),
        total:
          '₱ ' +
          item.totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2 }),
        status: item.status,
      });
    });

  return { columns, row };
};

const transactionChart = (orders, products) => {
  if (!orders || !orders.length) {
    console.log('orders data not available');
  }

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();

  const monthlySales = {};
  for (let month = 0; month < 12; month++) {
    const key = `${currentYear}-${month}`;
    monthlySales[key] = {
      month: month,
      year: currentYear,
      sales: 0,
      orders: 0,
      delivered_orders: 0,
    };
  }

  orders.forEach((order) => {
    const paidAt = new Date(order.paidAt);
    const month = paidAt.getMonth();
    const year = paidAt.getFullYear();
    const key = `${year}-${month}`;

    if (order.status === 'Delivered') {
      monthlySales[key].sales += order.totalPrice;
      monthlySales[key].delivered_orders++;
    }
    monthlySales[key].orders++;
  });

  const monthlyExpenses = {};
  products.forEach((product) => {
    const createdAt = new Date(product.createAt);
    const month = createdAt.getMonth();
    const year = createdAt.getFullYear();
    const key = `${year}-${month}`;
    let productExpenses = 0;
    if (product.sizes && product.sizes.length > 0) {
      productExpenses = product.sizes.reduce(
        (sizeAcc, size) => sizeAcc + (size.stock || 0) * (size.grossPrice || 0),
        0
      );
    } else if (product.engravings && product.engravings.length > 0) {
      productExpenses = product.engravings.reduce(
        (engravingAcc, engraving) =>
          engravingAcc + (engraving.stock || 0) * (engraving.grossPrice || 0),
        0
      );
    } else if (product.colors && product.colors.length > 0) {
      productExpenses = product.colors.reduce(
        (colorAcc, color) =>
          colorAcc + (color.stock || 0) * (product.grossPrice || 0),
        0
      );
    } else {
      productExpenses = (product.stock || 0) * (product.grossPrice || 0);
    }
    if (!monthlyExpenses[key]) {
      monthlyExpenses[key] = {
        month: month,
        year: year,
        expenses: productExpenses,
      };
    } else {
      monthlyExpenses[key].expenses += productExpenses;
    }
  });

  const formattedData = Object.values(monthlySales).map((item) => ({
    month: new Date(item.year, item.month, 1).toLocaleString('en-US', {
      month: 'long',
    }),
    sales: item.sales.toLocaleString('en-US', { minimumFractionDigits: 2 }),
    orders: item.orders,
    delivered_orders: item.delivered_orders,
    expenses: monthlyExpenses[`${item.year}-${item.month}`]
      ? monthlyExpenses[`${item.year}-${item.month}`].expenses.toLocaleString(
          'en-US',
          { minimumFractionDigits: 2 }
        )
      : '0.00',
  }));

  return (
    <>
      <div>{MyChartComponentSales(formattedData)}</div>
      <div>{MyChartComponentOrders(formattedData)}</div>
    </>
  );
};

const MyChartComponentSales = (formattedData) => {
  const categories = formattedData.map((item) => item.month);
  const salesData = formattedData.map((item) =>
    parseFloat(item.sales.replace(/,/g, ''))
  );
  const expensesData = formattedData.map((item) =>
    parseFloat(item.expenses.replace(/,/g, ''))
  );

  const [fontSize, setFontSize] = useState('18px');

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 400) {
        setFontSize('12px');
      } else if (window.innerWidth < 576) {
        setFontSize('14px');
      } else if (window.innerWidth < 768) {
        setFontSize('16px');
      } else {
        setFontSize('18px');
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Call handler right away so state gets updated with initial window size

    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const options = {
    chart: {
      type: 'bar',
    },
    title: {
      text: 'Sales and Expenses By Month',
      align: 'center',
      margin: 10,
      offsetX: 0,
      offsetY: 0,
      floating: false,
      style: {
        fontSize: fontSize,
        fontWeight: 'bold',
        color: '#333',
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        endingShape: 'rounded',
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    xaxis: {
      categories: categories,
    },
    yaxis: {
      title: {
        text: 'Amount (₱)',
      },
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return (
            '₱' + val.toLocaleString('en-US', { minimumFractionDigits: 2 })
          );
        },
      },
    },
  };

  const series = [
    {
      name: 'Sales',
      data: salesData,
      color: '#228B22',
    },
    {
      name: 'Expenses',
      data: expensesData,
      color: '#B22222',
    },
  ];

  return (
    <div className="bg-white rounded-sm p-5">
      <Chart
        options={options}
        series={series}
        type="bar"
        width="100%"
        height="400"
      />
    </div>
  );
};

const MyChartComponentOrders = (formattedData) => {
  const categories = formattedData.map((item) => item.month);
  const total_orders = formattedData.map((item) => parseFloat(item.orders));
  const delivered_orders = formattedData.map((item) =>
    parseFloat(item.delivered_orders)
  );

  //RESPONSIVENESS OF TITLE CHART
  const [fontSize, setFontSize] = useState('18px');

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 400) {
        setFontSize('12px');
      } else if (window.innerWidth < 576) {
        setFontSize('14px');
      } else if (window.innerWidth < 768) {
        setFontSize('16px');
      } else {
        setFontSize('18px');
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Call handler right away so state gets updated with initial window size

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const options = {
    chart: {
      type: 'bar',
    },
    title: {
      text: 'Total Orders and Delivered Orders By Month',
      align: 'center',
      margin: 10,
      offsetX: 0,
      offsetY: 0,
      floating: false,
      style: {
        fontSize: fontSize,
        fontWeight: 'bold',
        color: '#333',
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        endingShape: 'rounded',
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    xaxis: {
      categories: categories,
    },
    yaxis: {
      title: {
        text: '# of Orders',
      },
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val.toFixed(0);
        },
      },
    },
  };

  const series = [
    {
      name: 'Total Orders',
      data: total_orders,
      color: '#000080',
    },
    {
      name: 'Delivered Orders',
      data: delivered_orders,
      color: '#FFA500',
    },
  ];

  return (
    <div className="bg-white rounded-sm p-5 mt-5 ">
      <Chart
        options={options}
        series={series}
        type="bar"
        width="100%"
        height="400"
      />
    </div>
  );
};

const getMonthOptions = () => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const options = [];

  for (let year = currentYear - 5; year <= currentYear; year++) {
    for (let month = 0; month < 12; month++) {
      const monthLabel = new Date(year, month, 1).toLocaleString('en-US', {
        month: 'long',
      });
      options.push({
        value: `${year}-${month}`,
        label: `${monthLabel} ${year}`,
      });
    }
  }

  return options;
};

export default DashboardHero;

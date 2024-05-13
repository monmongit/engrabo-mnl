import Button from '@mui/material/Button';
import { DataGrid } from '@mui/x-data-grid';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Loader from '../Layout/Loader';
import { AiOutlineArrowRight } from 'react-icons/ai';
import { getAllOrdersOfAdmin } from '../../redux/action/order';

const AllRefundOrders = () => {
  const { orders, isLoading } = useSelector((state) => state.order);
  const { admin } = useSelector((state) => state.admin);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllOrdersOfAdmin(admin._id));
  }, [dispatch, admin._id]);

  const refundOrders =
    orders &&
    orders.filter(
      (item) =>
        item.status === 'Processing Refund' ||
        item.status === 'Refund Approved' ||
        'Refund Received'
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

  refundOrders &&
    refundOrders.forEach((item) => {
      console.log('Order item:', item.status);
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
        <div className="w-full mx-8 pt-1 mt-10 bg-white">
          <DataGrid
            rows={row}
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

export default AllRefundOrders;

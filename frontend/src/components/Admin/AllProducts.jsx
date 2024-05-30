import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllProductsAdmin, deleteProduct } from '../../redux/action/product';
import { getAllCategories, deleteCategory } from '../../redux/action/category';
import { useNavigate } from 'react-router-dom';
// import { makeStyles } from "@mui/styles";

import {
  AiOutlineDelete,
  AiOutlineEye,
  AiOutlineEdit,
  AiOutlineSearch,
} from 'react-icons/ai';
import Button from '@mui/material/Button';
import Loader from '../Layout/Loader';
import { DataGrid, GridOverlay } from '@mui/x-data-grid';
import { toast } from 'react-toastify';
import CreateProduct from './CreateProduct';
import UpdateProduct from './UpdateProduct';
import CreateCategory from './CreateCategories';
import styles from '../../styles/style';
import { VscNewFile } from 'react-icons/vsc';

const AllProducts = () => {
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editProductId, setEditProductId] = useState(null);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('Product');
  const { products, isLoading: loadingProducts } = useSelector(
    (state) => state.products
  );
  const { categories, isLoading: loadingCategories } = useSelector(
    (state) => state.categories
  );
  const dispatch = useDispatch();
  const { admin } = useSelector((state) => state.admin);

  const fetchData = useCallback(() => {
    if (viewMode === 'Product') {
      dispatch(getAllProductsAdmin(admin._id));
    } else if (viewMode === 'Category') {
      dispatch(getAllCategories(admin._id));
    }
  }, [viewMode, dispatch, admin._id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleViewModeChange = (e) => {
    const mode = e.target.value;
    setViewMode(mode);
  };

  useEffect(() => {
    const newPath =
      viewMode === 'Product' ? '/dashboard-products' : '/dashboard-categories';
    window.history.pushState({}, '', newPath);
    fetchData();
  }, [viewMode, fetchData]);

  const handleDelete = async (id) => {
    if (viewMode === 'Product') {
      await dispatch(deleteProduct(id));
    } else {
      await dispatch(deleteCategory(id));
    }
    fetchData();
    toast.success(`${viewMode} deleted successfully`);
  };

  const handleEdit = (id) => {
    setEditProductId(id);
    setEditOpen(true);
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredCategories = categories.filter((category) =>
    category.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { field: 'id', headerName: `${viewMode} ID`, minWidth: 150, flex: 0.5 },
    {
      field: 'name',
      headerName: <span className="header-name">Name</span>,
      minWidth: 180,
      flex: 1,
    },
    ...(viewMode === 'Product'
      ? [
          {
            field: 'grossprice',

            headerName: <span className="header-name">Gross Price</span>,
            minWidth: 100,
            flex: 0.5,
          },
          {
            field: 'price',
            headerName: <span className="header-name">Selling Price</span>,
            minWidth: 100,
            flex: 0.5,
          },
          {
            field: 'discount',
            headerName: <span className="header-name">Discounted Price</span>,
            minWidth: 100,
            flex: 0.5,
          },
          {
            field: 'stock',
            headerName: <span className="header-name">Stock</span>,
            minWidth: 50,
            flex: 0.5,
          },
        ]
      : []),

    viewMode === 'Product'
      ? [
          {
            field: 'Preview',
            headerName: 'Preview',
            minWidth: 100,
            flex: 0.3,
            renderHeader: () => <div className="header-cell">Preview</div>,
            renderCell: (params) => (
              <Button
                variant="contained"
                color="primary"
                style={{ marginRight: '8px' }}
                onClick={() =>
                  navigate(`/${viewMode.toLowerCase()}/${params.row.id}`)
                }
              >
                <AiOutlineEye size={20} />
                View
              </Button>
            ),
          },
          {
            field: 'Edit',
            headerName: 'Edit',
            minWidth: 100,
            flex: 0.3,
            renderHeader: () => <div className="header-cell">Edit</div>,
            renderCell: (params) => (
              <Button
                variant="contained"
                color="secondary"
                style={{ marginRight: '8px' }}
                onClick={() => handleEdit(params.row.id)}
              >
                <AiOutlineEdit size={20} />
                Edit
              </Button>
            ),
          },
        ]
      : [],
    {
      field: 'Delete',
      headerName: 'Delete',
      minWidth: 130,
      flex: 0.3,
      renderHeader: () => <div className="header-cell">Delete</div>,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="error"
          style={{ marginRight: '10px' }} // Add margin to the right
          onClick={() => handleDelete(params.row.id)}
        >
          <AiOutlineDelete size={20} />
          Delete
        </Button>
      ),
    },
  ];

  const rows =
    viewMode === 'Product'
      ? filteredProducts.map((item) => ({
          id: item._id,
          name: item.name,
          grossprice: `₱ ${item.grossPrice}`,
          price: `₱ ${item.originalPrice}`,
          discount:
            item.discountPrice !== null
              ? `₱ ${item.discountPrice}`
              : 'No Discount',
          stock: item.stock,
          sold: item?.sold_out,
        }))
      : filteredCategories.map((item) => ({
          id: item._id,
          name: item.title,
        }));

  const isLoading =
    viewMode === 'Product' ? loadingProducts : loadingCategories;

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <>
      <div
        className="w-full sm:px-8 pt-1 mt-10 bg-white overflow-x-auto"
        style={{ marginBottom: '100px', borderRadius: '10px' }}
      >
        <div className="mx-4">
          <div className="w-full flex flex-col sm:flex-row justify-between items-center mb-4 mt-2">
            <div className="w-full sm:w-52 mb-3 sm:mb-0">
              {' '}
              {/* Adjust width here */}
              <select
                className="h-10 sm:h-[45px] border-2 border-solid border-[#171203] rounded-md p-2 shadow-md bg-white text-black mr-0 sm:mr-8 mb-3 sm:mb-0 mt-0 transition ease-in-out duration-300 focus:border-[#171203] focus:outline-none hover:border-[#171203] hover:ring-[#171203] hover:ring-1"
                value={viewMode}
                onChange={handleViewModeChange}
              >
                <option className="text-black" value="Product">
                  Products
                </option>
                <option className="text-black" value="Category">
                  Categories
                </option>
              </select>
            </div>
            <div className="relative w-full sm:w-[40%] mb-3 sm:mb-0">
              <input
                type="text"
                placeholder={`Search ${viewMode}s...`}
                className="h-10 sm:h-[45px] pl-4 pr-10 w-full  border-2 border-solid border-[#171203] rounded-md placeholder-[#9e8a4f] shadow-md transition ease-in-out duration-300 focus:border-[#171203] focus:outline-none hover:border-[#171203] hover:ring-[#171203] hover:ring-1"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <AiOutlineSearch
                size={30}
                className="absolute right-3 top-1.5 text-[#9e8a4f] cursor-pointer"
              />
            </div>
            <div className="flex flex-col sm:flex-row">
              {' '}
              {/* Wrap buttons in a flex container */}
              <div
                className={`${styles.button} w-max h-10 px-4 rounded-md mb-3 ml-2 bg-[#171203] hover:bg-[#171203] text-white flex items-center justify-center transition ease-in-out duration-300 cursor-pointer`}
                onClick={() => setOpen(true)}
              >
                <span className="text-white flex items-center justify-center">
                  <VscNewFile size={20} className="mr-2" />
                  Create {viewMode}
                </span>
              </div>
            </div>
          </div>
          <div className="w-full overflow-x-auto mb-10">
            {' '}
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={12}
              disableSelectionOnClick
              autoHeight
              className="data-grid MuiDataGrid-root MuiDataGrid-autoHeight MuiDataGrid-root--densityStandard MuiDataGrid-withBorderColor rounded-lg shadow-md border border-gray-300 divide-y divide-gray-300"
            />
            {open && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                {viewMode === 'Product' ? (
                  <CreateProduct setOpen={setOpen} />
                ) : (
                  <CreateCategory setOpen={setOpen} />
                )}
              </div>
            )}
            {editOpen && viewMode === 'Product' && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <UpdateProduct
                  setOpen={setEditOpen}
                  productId={editProductId}
                />
              </div>
            )}
          </div>
          {editOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <UpdateProduct setOpen={setEditOpen} productId={editProductId} />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AllProducts;

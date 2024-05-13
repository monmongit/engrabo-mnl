import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllProductsAdmin, deleteProduct } from '../../redux/action/product';
import { getAllCategories, deleteCategory } from '../../redux/action/category';
import { useNavigate } from 'react-router-dom';
import { AiOutlineDelete, AiOutlineEye, AiOutlineSearch } from 'react-icons/ai';
import Button from '@mui/material/Button';
import Loader from '../Layout/Loader';
import { DataGrid } from '@mui/x-data-grid';
import { toast } from 'react-toastify';
import CreateProduct from './CreateProduct';
import CreateCategory from './CreateCategories';
import styles from '../../styles/style';
import { VscNewFile } from 'react-icons/vsc';

const AllProducts = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('Product'); // Could be 'Product' or 'Category'
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
    fetchData(); // Fetch data whenever the viewMode changes
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

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCategories = categories.filter((category) =>
    category.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { field: 'id', headerName: `${viewMode} ID`, minWidth: 150, flex: 0.5 },
    { field: 'name', headerName: 'Name', minWidth: 180, flex: 1 },
    ...(viewMode === 'Product'
      ? [
          {
            field: 'gross',
            headerName: 'Price no tax',
            minWidth: 100,
            flex: 0.5,
            hide: viewMode !== 'Product',
          },

          {
            field: 'price',
            headerName: 'Price',
            minWidth: 100,
            flex: 0.5,
            hide: viewMode !== 'Product',
          },
          {
            field: 'discount',
            headerName: 'Discount',
            minWidth: 80,
            flex: 0.5,
            hide: viewMode !== 'Product',
          },
          {
            field: 'stock',
            headerName: 'Stock',
            minWidth: 80,
            flex: 0.5,
            hide: viewMode !== 'Product',
          },
        ]
      : []),
    {
      field: 'Preview',
      headerName: 'Preview',
      minWidth: 100,
      flex: 0.3,
      renderCell: (params) => (
        <Button
          onClick={() =>
            navigate(`/${viewMode.toLowerCase()}/${params.row.id}`)
          }
        >
          <AiOutlineEye size={20} />
        </Button>
      ),
    },
    {
      field: 'Delete',
      headerName: 'Delete',
      minWidth: 100,
      flex: 0.3,
      renderCell: (params) => (
        <Button onClick={() => handleDelete(params.row.id)}>
          <AiOutlineDelete size={20} />
        </Button>
      ),
    },
  ];

  const rows =
    viewMode === 'Product'
      ? filteredProducts.map((item) => ({
          id: item._id,
          name: item.name,
          gross: `₱ ${item.grossPrice}`,
          price: `₱ ${item.originalPrice}`,
          discount: `₱ ${item.discountedPrice}`,
          stock: item.stock,
          sold: item?.sold_out,
        }))
      : filteredCategories.map((item) => ({
          id: item._id,
          name: item.title,
        }));

  const isLoading =
    viewMode === 'Product' && 'Categories'
      ? loadingProducts
      : loadingCategories;

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-full mx-8 pt-1 mt-10 bg-white">
          <div className="w-full flex justify-end items-center mb-4">
            {/* Selection */}
            <select
              className="h-[45px] border-[2px] border-[#171203] rounded-md mr-[425px]"
              value={viewMode}
              onChange={handleViewModeChange}
            >
              <option value="Product">Products</option>
              <option value="Category">Categories</option>
            </select>

            {/* Search Bar */}
            <div className="relative mr-3 w-[40%]">
              <input
                type="text"
                placeholder={`Search ${viewMode}s...`}
                className="h-[45px] pl-2 pr-10 w-full border-[#171203] border-[2px] rounded-md placeholder-[#9e8a4f]"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <AiOutlineSearch
                size={30}
                className="absolute right-2 top-1.5 cursor-pointer"
              />
            </div>

            {/* Create Product or Category */}
            <div
              className={`${styles.button} !w-max !h-[45px] px-3 !rounded-[5px] mr-3 mb-3`}
              onClick={() => setOpen(true)}
            >
              <span className="text-white flex items-center justify-center">
                <VscNewFile size={20} className="mr-2" />
                Create {viewMode}
              </span>
            </div>
          </div>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            disableSelectionOnClick
            autoHeight
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
        </div>
      )}
    </>
  );
};

export default AllProducts;

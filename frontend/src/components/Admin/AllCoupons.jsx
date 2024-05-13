import Button from '@mui/material/Button';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { AiOutlineDelete, AiOutlineSearch } from 'react-icons/ai';
import { RxCross1 } from 'react-icons/rx';
import { useDispatch, useSelector } from 'react-redux';
import styles from '../../styles/style';
import Loader from '../Layout/Loader';
import { server } from '../../server';
import { toast } from 'react-toastify';
import ExpiredIcon from '../../assets/Icons/ExpiredIcon.png';
import ActiveIcon from '../../assets/Icons/ActiveIcon.png';
import { VscNewFile } from 'react-icons/vsc';

const AllCoupons = () => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [coupons, setCoupons] = useState([]);
  const [minAmount, setMinAmout] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState(null);
  const [expiresAt, setExpiresAt] = useState('');
  const [value, setValue] = useState(null);
  const { admin } = useSelector((state) => state.admin);
  const { products } = useSelector((state) => state.products);
  const today = new Date().toISOString().split('T')[0];

  const [searchTerm, setSearchTerm] = useState(''); // To hold the search term
  const [searchResults] = useState([]); // To hold the search results

  const dispatch = useDispatch();

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`${server}/coupon/get-coupon/${admin._id}`, {
        withCredentials: true,
      })
      .then((res) => {
        setIsLoading(false);
        setCoupons(res.data.couponCodes);
      })
      .catch((error) => {
        setIsLoading(false);
      });
  }, [dispatch, admin._id]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${server}/coupon/delete-coupon/${id}`, {
        withCredentials: true,
      });
      toast.success('Coupon code deleted successfully!');
      setCoupons(coupons.filter((coupon) => coupon._id !== id)); // Update the local state
    } catch (error) {
      toast.error('Failed to delete the coupon code.');
      console.error('Error deleting coupon:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data } = await axios.post(
        `${server}/coupon/create-coupon-code`,
        {
          name,
          minAmount,
          selectedProducts,
          value,
          adminId: admin._id,
          expiresAt,
        },
        { withCredentials: true }
      );

      setCoupons([...coupons, data.couponCode]);
      toast.success('Coupon code created successfully!');
      setOpen(false);
    } catch (error) {
      console.error('Error creating coupon:', error);
      toast.error('Failed to create coupon.');
    }

    setIsLoading(false);
  };

  const getFilteredCoupons = () => {
    if (!searchTerm) {
      return coupons; // Return all coupons if search term is empty
    }
    return coupons.filter((coupon) =>
      coupon.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const columns = [
    { field: 'id', headerName: 'ID', minWidth: 150, flex: 0.7 },
    {
      field: 'name',
      headerName: 'Coupon Code',
      minWidth: 180,
      flex: 1.4,
    },
    {
      field: 'price',
      headerName: 'Value',
      minWidth: 100,
      flex: 0.6,
    },
    {
      field: 'status',
      headerName: 'Status',
      minWidth: 100,
      flex: 0.6,
      renderCell: (params) => {
        const isActive = params.row.status === 'Active';
        return (
          <div className="flex justify-start items-center h-full">
            <img
              src={isActive ? ActiveIcon : ExpiredIcon}
              alt={isActive ? 'Active' : 'Expired'}
              className="block w-4 h-4"
            />
          </div>
        );
      },
    },
    {
      field: 'Delete',
      flex: 0.8,
      minWidth: 120,
      headerName: 'Delete',
      type: 'number',
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Button onClick={() => handleDelete(params.id)}>
              <AiOutlineDelete size={20} />
            </Button>
          </>
        );
      },
    },
  ];

  const rows = getFilteredCoupons().map((item) => ({
    id: item._id,
    name: item.name,
    price: item.value + ' %',
    status: new Date() < new Date(item.expiresAt) ? 'Active' : 'Expired',
    sold: 10,
  }));
  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-full mx-8 pt-1 mt-10 bg-white">
          <div className="w-full flex justify-end items-center mb-4">
            {/* Search Bar */}
            <div className="relative mr-3 w-[40%]">
              <input
                type="text"
                placeholder="Search Coupon..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="h-[45px] pl-2 pr-10 w-full border-[#171203] border-[2px] rounded-md"
              />
              <AiOutlineSearch
                size={30}
                className="absolute right-2 top-1.5 cursor-pointer"
              />
              {searchResults.length > 0 && (
                <div
                  className="absolute w-full bg-white shadow-md z-10"
                  style={{ top: '100%', left: 0 }}
                >
                  {searchResults.map((coupon) => (
                    <div key={coupon._id} className="p-2 hover:bg-gray-100">
                      {coupon.name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Create Button */}
            <div
              className={`${styles.button} !w-max !h-[45px] px-3 !rounded-[5px] mr-3 mb-3`}
              onClick={() => setOpen(true)}
            >
              <span className="text-white flex items-center justify-center">
                <VscNewFile size={20} className="mr-2" />
                Create Coupon
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
            <div className="fixed top-0 left-0 w-full h-screen bg-[#00000062] z-[20000] flex items-center justify-center">
              <div className="w-[90%] 800px:w-[40%] h-[80vh] bg-white rounded-md shadow p-4 overflow-auto hide-scrollbar">
                {/* Cross Icons */}
                <div className="w-full flex justify-end">
                  <RxCross1
                    size={30}
                    className="cursor-pointer"
                    onClick={() => setOpen(false)}
                  />
                </div>

                {/* Coupon Header */}
                <h5 className="text-[30px] font-Poppins text-center">
                  Create Coupon code
                </h5>
                {/* create coupoun code */}
                <form onSubmit={handleSubmit}>
                  <br />

                  {/* Name */}
                  <div>
                    <label className="pb-2 text-[#171203]">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={name}
                      className="mt-2 appearance-none block w-full px-3 h-[35px]  border border-[#9e8a4f] rounded-[3px] shadow-sm placeholder-[#9e8a4f] focus:outline-none focus:ring-brown-dark focus:border-brown-dark"
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your coupon code name..."
                    />
                  </div>
                  <br />

                  {/* Discount Percentenge */}
                  <div>
                    <label className="pb-2 text-[#171203]">
                      Discount Percentenge{' '}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="value"
                      value={value}
                      required
                      className="mt-2 appearance-none block w-full px-3 h-[35px]  border border-[#9e8a4f] rounded-[3px] shadow-sm placeholder-[#9e8a4f] focus:outline-none focus:ring-brown-dark focus:border-brown-dark"
                      onChange={(e) => setValue(e.target.value)}
                      placeholder="Enter your coupon code value..."
                    />
                  </div>
                  <br />

                  {/* Minimum Amount */}
                  <div>
                    <label className="pb-2 text-[#171203]">Min Amount</label>
                    <input
                      type="number"
                      name="value"
                      value={minAmount}
                      className="mt-2 appearance-none block w-full px-3 h-[35px]  border border-[#9e8a4f] rounded-[3px] shadow-sm placeholder-[#9e8a4f] focus:outline-none focus:ring-brown-dark focus:border-brown-dark"
                      onChange={(e) => setMinAmout(e.target.value)}
                      placeholder="Enter your coupon code min amount..."
                    />
                  </div>
                  <br />

                  {/* Selected Product */}
                  <div>
                    <label className="pb-2 text-[#171203]">
                      Selected Product
                    </label>
                    <select
                      className="w-full mt-2 border h-[35px] rounded-[5px]"
                      value={selectedProducts}
                      onChange={(e) => setSelectedProducts(e.target.value)}
                    >
                      <option value="Choose your selected products">
                        Choose a selected product
                      </option>
                      {products &&
                        products.map((i) => (
                          <option value={i.name} key={i.name}>
                            {i.name}
                          </option>
                        ))}
                    </select>
                  </div>
                  <br />

                  {/* Expiration */}
                  <div>
                    <label>Expiry Date:</label>
                    <input
                      type="date"
                      value={expiresAt}
                      min={today}
                      onChange={(e) => setExpiresAt(e.target.value)}
                      className="mt-2 appearance-none block w-full px-3 h-[35px]  border border-[#9e8a4f] rounded-[3px] shadow-sm placeholder-[#9e8a4f] focus:outline-none focus:ring-brown-dark focus:border-brown-dark"
                    />
                  </div>
                  <br />

                  {/* Button */}
                  <div>
                    <input
                      type="submit"
                      value="Create"
                      className="mt-2 appearance-none block w-full px-3 h-[35px]  border border-[#9e8a4f] rounded-[3px] shadow-sm placeholder-[#9e8a4f] focus:outline-none focus:ring-brown-dark focus:border-brown-dark hover:bg-[#f9f1dc] transition duration-300 ease-in-out"
                    />
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default AllCoupons;

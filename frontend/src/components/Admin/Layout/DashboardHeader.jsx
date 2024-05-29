import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import EngraboLogo from '../../../assets/Logo/engrabo-logo.png';
import { AiOutlineGift } from 'react-icons/ai';
import { MdOutlineLocalOffer } from 'react-icons/md';
import { FiPackage, FiShoppingBag } from 'react-icons/fi';
import { BiMessageSquareDetail } from 'react-icons/bi';

const DashboardHeader = () => {
  const { admin } = useSelector((state) => state.admin);
  return (
    <div className="w-full h-[80px] bg-[#171203] shadow sticky top-0 left-0 z-30 flex items-center justify-between px-4">
      {/* Logo */}
      <div>
        <Link to="/dashboard">
          <img src={EngraboLogo} alt="" className="w-[120px] h-[60px]" />
        
        </Link>
      </div>

      {/* Navbar */}
      <div className="flex items-center">
        <div className="flex items-center mr-4">
          {/* Coupon */}
          <Link to="/dashboard-coupons" className="800px:block hidden">
            <AiOutlineGift
              color="#fff4d7"
              size={30}
              className="mx-5 cursor-pointer"
            />
          </Link>

          {/* Events */}
          <Link to="/dashboard-events" className="800px:block hidden">
            <MdOutlineLocalOffer
              color="#fff4d7"
              size={30}
              className="mx-5 cursor-pointer"
            />
          </Link>

          {/* Products */}
          <Link to="/dashboard-products" className="800px:block hidden">
            <FiShoppingBag
              color="#fff4d7"
              size={30}
              className="mx-5 cursor-pointer"
            />
          </Link>

          {/* Orders */}
          <Link to="/dashboard-orders" className="800px:block hidden">
            <FiPackage
              color="#fff4d7"
              size={30}
              className="mx-5 cursor-pointer"
            />
          </Link>

          {/* Message */}
          <Link to="/dashboard-messages" className="800px:block hidden">
            <BiMessageSquareDetail
              color="#fff4d7"
              size={30}
              className="mx-5 cursor-pointer"
            />
          </Link>

          {/* Profile */}
          <Link to={`/admin/${admin._id}`}>
            <img
              src={`${admin?.avatar?.url}`}
              className="w-[35px] h-[35px] rounded-full"
              alt="User Avatar"
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;

import React, { useState, useEffect } from 'react';
import { AiOutlineGift, AiOutlineLogout } from 'react-icons/ai';
import { FiPackage, FiShoppingBag } from 'react-icons/fi';
import { BiMessageSquareDetail } from 'react-icons/bi';
import { MdOutlineLocalOffer } from 'react-icons/md';
import { RxDashboard } from 'react-icons/rx';
import { RiLockPasswordLine } from 'react-icons/ri';
import { CiSettings } from 'react-icons/ci';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaRegUser } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { server } from '../../../server';

const DashboardSideBar = ({ active }) => {
  const navigate = useNavigate();

  const logoutHandler = () => {
    axios
      .get(`${server}/admin/logout`, { withCredentials: true })
      .then((res) => {
        toast.success(res.data.message);
        window.location.reload(true);
        navigate('/admin-login');
      })
      .catch((error) => {
        console.log(error.response.data.message);
      });
  };

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleMoreClick = () => setShowMore(!showMore);

  const mainIcons = [
    { to: '/dashboard', icon: <RxDashboard />, label: 'Dashboard', id: 1 },
    { to: '/dashboard-users', icon: <FaRegUser />, label: 'All Users', id: 12 },
    {
      to: '/dashboard-orders',
      icon: <FiPackage />,
      label: 'All Orders',
      id: 2,
    },
    {
      to: '/dashboard-products',
      icon: <FiShoppingBag />,
      label: 'Products',
      id: 3,
    },
    {
      to: '/dashboard-coupons',
      icon: <AiOutlineGift />,
      label: 'Coupon Codes',
      id: 9,
    },
  ];

  const moreIcons = [
    {
      to: '/dashboard-events',
      icon: <MdOutlineLocalOffer />,
      label: 'Events',
      id: 5,
    },
    {
      to: '/dashboard-messages',
      icon: <BiMessageSquareDetail />,
      label: 'Admin Inbox',
      id: 6,
    },
    {
      to: '/dashboard-settings',
      icon: <RiLockPasswordLine />,
      label: 'Change Password',
      id: 8,
    },
    { to: '/settings', icon: <CiSettings />, label: 'Settings', id: 13 },
    {
      to: '#',
      icon: <AiOutlineLogout />,
      label: 'Log out',
      id: 11,
      action: logoutHandler, // Add action to handle the logout functionality
    },
  ];

  return (
    <div className="fixed bottom-0 md:static md:top-0 md:left-0 md:h-full w-full md:w-auto bg-[#f7ebca] shadow-sm overflow-y-scroll hide-scrollbar z-10 border-t-4 border-t-[#171203]">
      <div className="flex md:flex-col items-center justify-around md:justify-start md:items-start p-2 md:p-4">
        {mainIcons.map(({ to, icon, label, id }) => (
          <Link
            key={id}
            to={to}
            className={`flex flex-col items-center md:items-start p-2 md:p-4 ${
              active === id ? 'text-[#171203]' : 'text-[#6b540f]'
            }`}
          >
            <div
              className={`flex items-center flex-col md:flex-row transition-transform duration-300 hover:scale-125 ${
                active === id ? 'hover:text-[#171203]' : 'hover:text-[#171203]'
              } group`}
            >
              <div
                className={`inline-block ${
                  active === id
                    ? 'text-[#171203]'
                    : 'text-[#6b540f] group-hover:text-[#171203]'
                }`}
              >
                {React.cloneElement(icon, {
                  size: isMobile ? 24 : 30,
                  color: active === id ? '#171203' : 'currentColor',
                })}
              </div>
              <h5
                className={`text-center ml-0 md:ml-2 md:text-[15px] mt-1 md:mt-0 font-[700] hidden md:block ${
                  active === id
                    ? 'text-[#171203]'
                    : 'text-[#6b540f] group-hover:text-[#171203]'
                }`}
              >
                {label}
              </h5>
            </div>
          </Link>
        ))}
        {isMobile && (
          <button
            onClick={handleMoreClick}
            className="flex flex-col items-center md:items-start"
          >
            <div className="flex items-center flex-col">
              <div className="inline-block transition-transform duration-300 hover:scale-125 text-[#6b540f] hover:text-[#171203]">
                <span className="text-[24px]">•••</span>
              </div>
            </div>
          </button>
        )}

        {(!isMobile || showMore) &&
          moreIcons.map(({ to, icon, label, id, action }) =>
            action ? (
              <button
                key={id}
                onClick={action}
                className="flex flex-col items-center md:items-start p-2 md:p-4 text-[#6b540f] hover:text-[#171203] transition-colors duration-300"
              >
                <div className="flex items-center flex-col md:flex-row transition-transform duration-300 hover:scale-125">
                  <div className="inline-block group-hover:text-[#171203]">
                    {React.cloneElement(icon, {
                      size: isMobile ? 24 : 30,
                      color: 'currentColor',
                    })}
                  </div>
                  <h5 className="text-center ml-0 md:ml-2 md:text-[15px] mt-1 md:mt-0 font-[700] hidden md:block group-hover:text-[#171203]">
                    {label}
                  </h5>
                </div>
              </button>
            ) : (
              <Link
                key={id}
                to={to}
                className={`flex flex-col items-center md:items-start p-2 md:p-4 ${
                  active === id ? 'text-[#171203]' : 'text-[#6b540f]'
                }`}
              >
                <div
                  className={`flex items-center flex-col md:flex-row transition-transform duration-300 hover:scale-125 ${
                    active === id
                      ? 'hover:text-[#171203]'
                      : 'hover:text-[#171203] group'
                  }`}
                >
                  <div
                    className={`inline-block ${
                      active === id
                        ? 'text-[#171203]'
                        : 'text-[#6b540f] group-hover:text-[#171203]'
                    }`}
                  >
                    {React.cloneElement(icon, {
                      size: isMobile ? 24 : 30,
                      color: active === id ? '#171203' : 'currentColor',
                    })}
                  </div>
                  <h5
                    className={`text-center ml-0 md:ml-2 md:text-[15px] mt-1 md:mt-0 font-[700] hidden md:block ${
                      active === id
                        ? 'text-[#171203]'
                        : 'text-[#6b540f] group-hover:text-[#171203]'
                    }`}
                  >
                    {label}
                  </h5>
                </div>
              </Link>
            )
          )}
      </div>
    </div>
  );
};

export default DashboardSideBar;

import React, { useState, useEffect } from "react";
import { AiOutlineLogout, AiOutlineMessage } from "react-icons/ai";
import { RxPerson } from "react-icons/rx";
import { RiLockPasswordLine } from "react-icons/ri";
import { TbAddressBook } from "react-icons/tb";
import { HiOutlineShoppingBag } from "react-icons/hi";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { server } from "../../../server";

const TrySidebar = ({ setActive, active }) => {
  const navigate = useNavigate();

  const logoutHandler = () => {
    axios
      .get(`${server}/user/logout`, { withCredentials: true })
      .then((res) => {
        toast.success(res.data.message);
        window.location.reload(true);
        navigate("/login");
      })
      .catch((error) => {
        console.log(error.response.data.message);
      });
  };

  const [showMore, setShowMore] = useState(false);
  const handleMoreClick = () => setShowMore(!showMore);

  const mainIcons = [
    {
      id: 1,
      renderIcon: (active) => (
        <div
          onClick={() => setActive(1)}
          className={`flex items-center cursor-pointer mb-2 ${
            isMobile ? "" : "mt-20"
          }`}
        >
          <div
            className={`flex items-center flex-col md:flex-row transition-transform duration-300 hover:scale-125 ${
              active === 1 ? "hover:text-[#171203]" : "hover:text-[#171203]"
            }`}
          >
            <RxPerson size={24} color={active === 1 ? "#171203" : "#6b540f"} />
            <span
              className={`pl-3 ${
                active === 1 ? "text-[#171203]" : "text-[#6b540f]"
              } 800px:block hidden`}
            >
              Profile
            </span>
          </div>
        </div>
      ),
      label: "Profile",
    },
    {
      id: 2,
      renderIcon: (active) => (
        <div
          onClick={() => setActive(2)}
          className="flex items-center cursor-pointer mb-2"
        >
          <div
            className={`flex items-center flex-col md:flex-row transition-transform duration-300 hover:scale-125 ${
              active === 2 ? "hover:text-[#171203]" : "hover:text-[#171203]"
            }`}
          >
            <HiOutlineShoppingBag
              size={24}
              color={active === 2 ? "#171203" : "#6b540f"}
            />
            <span
              className={`pl-3 ${
                active === 2 ? "text-[#171203]" : "text-[#6b540f]"
              } 800px:block hidden`}
            >
              Orders
            </span>
          </div>
        </div>
      ),
      label: "Profile",
    },
    {
      id: 3,
      renderIcon: (active) => (
        <div
          onClick={() => setActive(4) || navigate("/inbox")}
          className="flex items-center cursor-pointer mb-2"
        >
          <div
            className={`flex items-center flex-col md:flex-row transition-transform duration-300 hover:scale-125 ${
              active === 4 ? "hover:text-[#171203]" : "hover:text-[#171203]"
            }`}
          >
            <AiOutlineMessage
              size={24}
              color={active === 4 ? "#171203" : "#6b540f"}
            />
            <span
              className={`pl-3 ${
                active === 4 ? "text-[#171203]" : "text-[#6b540f]"
              } 800px:block hidden`}
            >
              Inbox
            </span>
          </div>
        </div>
      ),
      label: "Profile",
    },
    {
      id: 4,
      renderIcon: (active) => (
        <div
          onClick={() => setActive(6)}
          className="flex items-center cursor-pointer mb-2"
        >
          <div
            className={`flex items-center flex-col md:flex-row transition-transform duration-300 hover:scale-125 ${
              active === 6 ? "hover:text-[#171203]" : "hover:text-[#171203]"
            }`}
          >
            <RiLockPasswordLine
              size={24}
              color={active === 6 ? "#171203" : "#6b540f"}
            />
            <span
              className={`pl-3 ${
                active === 6 ? "text-[#171203]" : "text-[#6b540f]"
              } 800px:block hidden`}
            >
              Change Password
            </span>
          </div>
        </div>
      ),
      label: "Profile",
    },
    {
      id: 5,
      renderIcon: (active) => (
        <div
          onClick={() => setActive(7)}
          className="flex items-center cursor-pointer mb-2"
        >
          <div
            className={`flex items-center flex-col md:flex-row transition-transform duration-300 hover:scale-125 ${
              active === 7 ? "hover:text-[#171203]" : "hover:text-[#171203]"
            }`}
          >
            <TbAddressBook
              size={24}
              color={active === 7 ? "#171203" : "#6b540f"}
            />
            <span
              className={`pl-3 ${
                active === 7 ? "text-[#171203]" : "text-[#6b540f]"
              } 800px:block hidden`}
            >
              Address
            </span>
          </div>
        </div>
      ),
      label: "Profile",
    },
    {
      id: 6,
      renderIcon: (active) => (
        <div
          onClick={() => setActive(8) || logoutHandler()}
          className="flex items-center cursor-pointer mb-2"
        >
          <div
            className={`flex items-center flex-col md:flex-row transition-transform duration-300 hover:scale-125 ${
              active === 8 ? "hover:text-[#171203]" : "hover:text-[#171203]"
            }`}
          >
            <AiOutlineLogout
              size={24}
              color={active === 8 ? "#171203" : "#6b540f"}
            />
            <span
              className={`pl-3 ${
                active === 8 ? "text-[#171203]" : "text-[#6b540f]"
              } 800px:block hidden`}
            >
              Logout
            </span>
          </div>
        </div>
      ),
      label: "Profile",
    },
  ];

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="fixed bottom-0 md:static md:top-0 md:left-0 md:h-full w-full md:w-auto bg-[#f7ebca] shadow-sm overflow-y-scroll hide-scrollbar z-10 border-t-4 border-t-[#171203]">
      <div className="flex md:flex-col items-center justify-around md:justify-start md:items-start p-2 md:p-4">
        {mainIcons.map(({ id, renderIcon, to, icon, label, onClick }) => (
          <div key={id} className={`${isMobile ? "" : "ml-10 mb-5"} mb-0 mt-2`}>
            {renderIcon ? (
              renderIcon(active)
            ) : (
              <Link
                to={to}
                onClick={onClick}
                className={`flex items-center flex-col md:flex-row transition-transform duration-300 hover:scale-125 ${
                  active === id
                    ? "hover:text-[#171203]"
                    : "hover:text-[#171203]"
                }`}
              ></Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrySidebar;

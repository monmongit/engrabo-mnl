import React from "react";
import { useNavigate } from "react-router-dom";
import { RxPerson } from "react-icons/rx";
import { HiOutlineReceiptRefund, HiOutlineShoppingBag } from "react-icons/hi";
import { AiOutlineLogout, AiOutlineMessage } from "react-icons/ai";
import { MdOutlineTrackChanges } from "react-icons/md";
import { TbAddressBook } from "react-icons/tb";
import { RiLockPasswordLine } from "react-icons/ri";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";

const ProfileSidebar = ({ setActive, active }) => {
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

  return (
    <div className="w-full bg-[#f7ebca] shadow-sm rounded-[10px] p-4 pt-8">
      {/* Profile Sidebar */}
      <div
        className="flex items-center cursor-pointer w-full mb-8"
        onClick={() => setActive(1)}
      >
        <RxPerson size={20} color={active === 1 ? "#171203" : "#6b540f"} />
        <span
          className={`pl-3 ${
            active === 1 ? "text-[#171203]" : "text-[#6b540f]"
          } 800px:block hidden`}
        >
          Profile
        </span>
      </div>

      {/* Orders Sidebar */}
      <div
        className="flex items-center cursor-pointer w-full mb-8"
        onClick={() => setActive(2)}
      >
        <HiOutlineShoppingBag
          size={20}
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

      {/* Refunds Sidebar */}
      <div
        className="flex items-center cursor-pointer w-full mb-8"
        onClick={() => setActive(3)}
      >
        <HiOutlineReceiptRefund
          size={20}
          color={active === 3 ? "#171203" : "#6b540f"}
        />
        <span
          className={`pl-3 ${
            active === 3 ? "text-[#171203]" : "text-[#6b540f]"
          } 800px:block hidden`}
        >
          Refunds
        </span>
      </div>

      {/* Inbox Sidebar */}
      <div
        className="flex items-center cursor-pointer w-full mb-8"
        onClick={() => setActive(4) || navigate("/inbox")}
      >
        <AiOutlineMessage
          size={20}
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

      {/* Tract Order Sidebar */}
      <div
        className="flex items-center cursor-pointer w-full mb-8"
        onClick={() => setActive(5)}
      >
        <MdOutlineTrackChanges
          size={20}
          color={active === 5 ? "#171203" : "#6b540f"}
        />
        <span
          className={`pl-3 ${
            active === 5 ? "text-[#171203]" : "text-[#6b540f]"
          } 800px:block hidden`}
        >
          Tract Order
        </span>
      </div>

      {/* Change Password Sidebar */}
      <div
        className="flex items-center cursor-pointer w-full mb-8"
        onClick={() => setActive(6)}
      >
        <RiLockPasswordLine
          size={20}
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

      {/* Address Sidebar */}
      <div
        className="flex items-center cursor-pointer w-full mb-8"
        onClick={() => setActive(7)}
      >
        <TbAddressBook size={20} color={active === 7 ? "#171203" : "#6b540f"} />
        <span
          className={`pl-3 ${
            active === 7 ? "text-[#171203]" : "text-[#6b540f]"
          } 800px:block hidden`}
        >
          Address
        </span>
      </div>

      {/* Logout Sidebar */}
      <div
        className="flex items-center cursor-pointer w-full mb-8"
        onClick={() => setActive(8) || logoutHandler()}
      >
        <AiOutlineLogout
          size={20}
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
  );
};

export default ProfileSidebar;

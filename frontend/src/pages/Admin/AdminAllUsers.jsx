import React, { useState, useEffect } from "react";
import DashboardHeader from "../../components/Admin/Layout/DashboardHeader";
import DashboardSideBar from "../../components/Admin/Layout/DashboardSideBar";
import AllUsers from "../../components/Admin/AllUsers";
import { styled } from "@mui/material";

const AdminAllUsers = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex flex-col h-full">
      <DashboardHeader />
      <div
        className={`flex ${isMobile ? "flex-col-reverse" : "flex-row"} w-full`}
      >
        <div
          className={`w-[80px] 800px:w-[330px] ${
            isMobile ? "" : "fixed left-0 h-full"
          }`}
        >
          <DashboardSideBar active={12} />
        </div>

        <div
          className={`flex-1 px-4 overflow-x-auto mx-2 mt-3 mb-20 ${
            isMobile ? "" : "ml-[330px]"
          }`}
        >
          <AllUsers />
        </div>
      </div>
    </div>

    //ORIGINAL SIDEBAR

    //   <div className="flex flex-col h-full">
    //   <DashboardHeader />
    //   <div className="flex flex-1 flex-col-reverse md:flex-row w-full">
    //     <div className="w-[80px] 800px:w-[330px]">
    //       <DashboardSideBar active={12} />
    //     </div>
    //     <div className="flex-1 overflow-x-auto mx-4">
    //       <AllUsers />
    //     </div>
    //   </div>
    // </div>
  );
};

export default AdminAllUsers;

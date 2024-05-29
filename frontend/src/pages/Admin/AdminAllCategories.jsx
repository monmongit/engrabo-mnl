// AdminAllCategories.js
import React from "react";
import DashboardHeader from "../../components/Admin/Layout/DashboardHeader";
import DashboardSideBar from "../../components/Admin/Layout/DashboardSideBar";
import AllProducts from "../../components/Admin/AllProducts";

const AdminAllCategories = () => {
  return (
    <div className="flex flex-col h-full">
      <DashboardHeader />
      <div className="flex flex-1 flex-col-reverse md:flex-row w-full">
        <div className="w-[80px] 800px:w-[330px]">
          <DashboardSideBar />
        </div>
        <div className="flex-1 overflow-x-auto mx-4">
          <AllProducts />
        </div>
      </div>
    </div>
  );
};

export default AdminAllCategories;

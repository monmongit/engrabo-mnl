// AdminAllCategories.js
import React from 'react';
import DashboardHeader from '../../components/Admin/Layout/DashboardHeader';
import DashboardSideBar from '../../components/Admin/Layout/DashboardSideBar';
import AllProducts from '../../components/Admin/AllProducts';

const AdminAllCategories = () => {
  return (
    <div>
      <DashboardHeader />
      <div className="flex justify-between w-full">
        <div className="w-[80px] 800px:w-[330px]">
          <DashboardSideBar />
        </div>
        <div className="w-full justify-center flex">
          <AllProducts />
        </div>
      </div>
    </div>
  );
};

export default AdminAllCategories;

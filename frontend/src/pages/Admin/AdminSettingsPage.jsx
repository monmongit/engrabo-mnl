import React from 'react';
import AdminSettings from '../../components/Admin/AdminSettings';
import DashboardHeader from '../../components/Admin/Layout/DashboardHeader';
import DashboardSideBar from '../../components/Admin/Layout/DashboardSideBar';

const ShopSettingsPage = () => {
  return (
    <div>
      <DashboardHeader />
      <div className="flex items-start justify-between w-full">
        <div className="w-[80px] 800px:w-[330px]">
          <DashboardSideBar active={13} />
        </div>
        <AdminSettings />
      </div>
    </div>
  );
};

export default ShopSettingsPage;

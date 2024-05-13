import React from 'react';
import DashboardHeader from '../../components/Admin/Layout/DashboardHeader';
import DashboardSideBar from '../../components/Admin/Layout/DashboardSideBar';
// import AllUsers from '../../components/Admin/AllUsers';


const AdminAllUsers = () => {
  return (
    <div>
      <div>
        <DashboardHeader />
        <div className="flex justify-between w-full">
          <div className="w-[80px] 800px:w-[330px]">
            <DashboardSideBar active={9} />
          </div>
          <div className="w-full justify-center flex">
            {/* <AllUsers /> */}
            <p>Hello world</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAllUsers;

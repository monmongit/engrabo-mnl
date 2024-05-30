import React, { useEffect, useState } from "react";
import styles from "../../styles/style";
import AdminInfo from "../../components/Admin/AdminInfo";
import AdminProfileData from "../../components/Admin/AdminProfileData";

const AdminHomePage = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    //bg-slate-950
    <div className={`${styles.section} `} style={{ borderRadius: "10px" }}>
      <div
        className="w-full flex flex-col py-10 justify-between bg-dark mt-5 sm:mt-5 mb-5 sm:mb-5 mt-0"
        style={{ marginTop: "-10px" }}
      >
        {isMobile ? (
          <div className="w-full flex flex-col">
            <div
              className="w-full max-w-full bg-white  rounded-md shadow-sm mb-4 overflow-y-auto hide-scrollbar"
              style={{ marginTop: "-60px" }}
            >
              <AdminInfo isOwner={true} />
            </div>
            <div className="w-full max-w-full bg-white rounded-md px-3 shadow-sm mb-4 overflow-y-auto hide-scrollbar">
              <AdminProfileData isOwner={true} />
            </div>
          </div>
        ) : (
          <div className="w-full flex flex-col sm:flex-row">
            <div className="w-full sm:w-[25%] bg-white rounded-md mx-4 shadow-sm overflow-y-scroll h-[90vh] sticky top-10 left-0 z-10 mb-4 sm:mb-0 hide-scrollbar">
              <AdminInfo isOwner={true} />
            </div>
            <div className="w-full sm:w-[75%] bg-white rounded-md mx-4 px-5 shadow-sm overflow-y-auto">
              <AdminProfileData isOwner={true} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminHomePage;

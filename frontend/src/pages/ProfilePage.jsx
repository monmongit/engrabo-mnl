import React, { useState, useEffect } from "react";
import Header from "../components/Layout/Header";
import styles from "../styles/style";
import ProfileSidebar from "../components/Profile/ProfileSidebar";
import ProfileContent from "../components/Profile/ProfileContent.jsx";
import { useSelector } from "react-redux";
import Loader from "../components/Layout/Loader.jsx";
import TrySidebar from "../components/Admin/Layout/TrySidebar";

const ProfilePage = () => {
  const { loading } = useSelector((state) => state.user);
  const [active, setActive] = useState(1);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div>
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="flex flex-col h-full">
            <Header />
            <div
              className={`flex ${isMobile ? "flex-col" : "flex-row"} w-full`}
            >
              <div className={`${isMobile ? "" : "sticky top-0"} md:w-[330px]`}>
                <TrySidebar active={active} setActive={setActive} />
              </div>
              <div className="flex-1 px-2 overflow-x-auto mx-2 mt-3">
                <ProfileContent active={active} />
              </div>
            </div>
          </div>

          {/* <Header />

          <div className={`${styles.section} flex bg-[#fff4d7] py-10`}>
            <div className="w-[50px] 800px:w-[335px] sticky 800px:mt-0 mt-[6%]">
              <ProfileSidebar active={active} setActive={setActive} />
            </div>
            <ProfileContent active={active} />
          </div> */}
        </>
      )}
    </div>
  );
};

export default ProfilePage;

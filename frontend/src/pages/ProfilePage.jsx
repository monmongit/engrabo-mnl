import React, { useState } from 'react';
import Header from '../components/Layout/Header';
import styles from '../styles/style';
import ProfileSidebar from '../components/Profile/ProfileSidebar';
import ProfileContent from '../components/Profile/ProfileContent.jsx';
import { useSelector } from 'react-redux';
import Loader from '../components/Layout/Loader.jsx';

const ProfilePage = () => {
  const { loading } = useSelector((state) => state.user);
  const [active, setActive] = useState(1);
  return (
    <div>
      {loading ? (
        <Loader />
      ) : (
        <>
          <Header />
          <div className={`${styles.section} flex bg-[#fff4d7] py-10`}>
            <div className="w-[50px] 800px:w-[335px] sticky 800px:mt-0 mt-[6%]">
              <ProfileSidebar active={active} setActive={setActive} />
            </div>
            <ProfileContent active={active} />
          </div>
        </>
      )}
    </div>
  );
};

export default ProfilePage;

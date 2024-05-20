import React, { useState } from "react";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import styles from "../styles/style";
import UserCreateDesign from "../components/UserCreateDesign";

const CreatePage = () => {
  return (
    <div>
      <Header activeHeading={5} />
      {/* Page for create 
            - Load here the component to create a user design 
        */}
      <UserCreateDesign />
      <Footer />
    </div>
  );
};

export default CreatePage;

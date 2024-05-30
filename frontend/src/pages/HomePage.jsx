import React from 'react';
import Header from '../components/Layout/Header';
import Slider from '../components/Route/Slider/Slider';
import Categories from '../components/Route/Categories/Categories';
import BestDeals from '../components/Route/BestDeals/BestDeals';
import FeaturedProduct from '../components/Route/FeaturedProduct/FeaturedProduct';
import Events from '../components/Route/Events/Events';
import Footer from '../components/Layout/Footer';
import Chatbox from '../components/Chatbot/Chatbox';
const HomePage = () => {
  return (
    <div>
      <Header activeHeading={1} />
      <Slider />
      <Categories />
      <BestDeals />
      <Events />
      <FeaturedProduct />
      <Chatbox />
      <Footer />
    </div>
  );
};

export default HomePage;

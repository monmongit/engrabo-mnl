import React from 'react';
import Header from '../components/Layout/Header';
import EventCard from '../components/Route/Events/EventCard';
import { useSelector } from 'react-redux';
import Loader from '../components/Layout/Loader';
import Footer from '../components/Layout/Footer';

const EventsPage = () => {
  const { allEvents, isLoading } = useSelector((state) => state.events);
  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <Header activeHeading={4} />
          <EventCard active={true} data={allEvents && allEvents[0]} />
          <Footer />
        </div>
      )}
    </>
  );
};

export default EventsPage;

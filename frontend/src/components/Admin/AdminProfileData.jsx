import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import styles from '../../styles/style';
import ProductCard from '../Route/ProductCard/ProductCard';
import Ratings from '../Products/Ratings';
import { getAllProductsAdmin } from '../../redux/action/product';
import { getAllEventsAdmin } from '../../redux/action/event';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';

const AdminProfileData = ({ isOwner }) => {
  const { products } = useSelector((state) => state.products);
  const { events } = useSelector((state) => state.events);
  const { id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllProductsAdmin(id));
    dispatch(getAllEventsAdmin(id));
  }, [dispatch, id]);

  const [active, setActive] = useState(1);
  const [selectedRating, setSelectedRating] = useState(0);

  // Flatten reviews with product names and product details
  const allReviews =
    products &&
    products.flatMap((product) =>
      product.reviews.map((review) => ({
        ...review,
        productName: product.name,
        productSize: product.size,
        productColor: product.color,
        productEngraving: product.engraving,
      }))
    );

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const formatDate = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      timeZone: 'Asia/Manila',
    };
    return new Intl.DateTimeFormat('en-US', options).format(
      new Date(dateString)
    );
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          onClick={() => setSelectedRating(i)}
          className={`cursor-pointer ${
            i <= selectedRating ? 'text-[#f6b100]' : 'text-[#f6b100]'
          }`}
        >
          {i <= selectedRating ? (
            <AiFillStar size={24} />
          ) : (
            <AiOutlineStar size={24} />
          )}
        </span>
      );
    }
    return stars;
  };

  const filteredReviews =
    selectedRating > 0
      ? allReviews.filter(
          (review) => Math.floor(review.rating) === selectedRating
        )
      : allReviews;

  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row justify-between items-center">
        <div
          className="flex flex-wrap justify-center lg:justify-start w-full lg:w-auto mb-4 lg:mb-0"
          style={{ marginTop: '20px' }}
        >
          <div>
            <button
              className={`font-semibold text-lg ${
                active === 1
                  ? 'text-red-500'
                  : 'text-gray-700 hover:text-red-500'
              } focus:outline-none mb-2 lg:mb-0`}
              onClick={() => setActive(1)}
            >
              <div className="mt-2 p-4 bg-primary rounded-lg shadow-lg hover:shadow-xl hover:border-white border border-transparent transition duration-300">
                <p
                  className={`text-center text-xl ${
                    active === 1 ? 'text-red-500' : 'text-gray-600'
                  }`}
                >
                  Shop Products
                </p>
              </div>
            </button>
            {isMobile && (
              <div className="relative">
                <hr
                  className="absolute left-0 right-0 border-b border-gray-300 shadow"
                  style={{ width: 'calc(100% - 2rem)', margin: '0 1rem' }}
                />
              </div>
            )}
          </div>
          <div>
            <button
              className={`font-semibold text-lg ${
                active === 2
                  ? 'text-red-500'
                  : 'text-gray-700 hover:text-red-500'
              } focus:outline-none mb-2 lg:mb-0`}
              onClick={() => setActive(2)}
            >
              <div className="mt-2 p-4 bg-primary rounded-lg shadow-lg hover:shadow-xl hover:border-white border border-transparent transition duration-300">
                <p
                  className={`text-center text-xl ${
                    active === 2 ? 'text-red-500' : 'text-gray-600'
                  }`}
                >
                  Running Events
                </p>
              </div>
            </button>
            {isMobile && (
              <div className="relative">
                <hr
                  className="absolute left-0 right-0 border-b border-gray-300 shadow"
                  style={{ width: 'calc(100% - 2rem)', margin: '0 1rem' }}
                />
              </div>
            )}
          </div>
          <div>
            <div>
              <button
                className={`font-semibold text-lg ${
                  active === 3
                    ? 'text-red-500'
                    : 'text-gray-700 hover:text-red-500'
                } focus:outline-none mb-2 lg:mb-0`}
                onClick={() => setActive(3)}
              >
                <div className="mt-2 p-4 bg-primary rounded-lg shadow-lg hover:shadow-xl hover:border-white border border-transparent transition duration-300">
                  <p
                    className={`text-center text-xl ${
                      active === 3 ? 'text-red-500' : 'text-gray-600'
                    }`}
                  >
                    Shop Reviews
                  </p>
                </div>
              </button>
              {isMobile && (
                <div className="relative">
                  <hr
                    className="absolute left-0 right-0 border-b border-gray-300 shadow"
                    style={{ width: 'calc(100% - 2rem)', margin: '0 1rem' }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        {isOwner && (
          <div className="relative">
            <Link to="/dashboard">
              <div className="mt-4 p-4 bg-[#171203] rounded-lg shadow-lg hover:shadow-xl hover:border-white border border-transparent transition duration-300">
                <h3 className="text-center font-[800] text-white">
                  Go to Dashboard
                </h3>
              </div>
            </Link>
            {isMobile && (
              <div className="absolute left-0 right-0 bottom-0 h-3 bg-black shadow-md"></div>
            )}
          </div>
        )}
      </div>

      <br />
      {active === 1 && (
        <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-3 lg:gap-[25px] xl:grid-cols-3 xl:gap-[20px] mb-12 border-0">
          {products &&
            products.map((i, index) => (
              <ProductCard data={i} key={index} isShop={true} />
            ))}
        </div>
      )}

      {active === 2 && (
        <div className="w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 justify-items-start">
            {events &&
              events.map((i, index) => (
                <ProductCard
                  data={i}
                  key={index}
                  isShop={true}
                  isEvent={true}
                />
              ))}
          </div>
          {events && events.length === 0 && (
            <h5 className="w-full text-center py-5 text-[18px]">
              No Events have for this shop!
            </h5>
          )}
        </div>
      )}

      {active === 3 && (
        <div className="w-full">
          <div className="mb-4">
            <h3>Filter by Ratings</h3>
            <div className="flex">{renderStars()}</div>
          </div>
          {filteredReviews &&
            filteredReviews.map((item, index) => (
              <div className="w-full flex my-4" key={index}>
                <img
                  src={`${item.user.avatar?.url}`}
                  className="w-[50px] h-[50px] rounded-full"
                  alt=""
                />
                <div className="pl-2">
                  <div className="flex w-full items-center">
                    <h1 className="font-[600] pr-2">{item.user.name}</h1>
                    <Ratings rating={item.rating} />
                  </div>
                  <p className="text-[#000000a7] text-[14px]">
                    Product: {item.productName}
                  </p>
                  <p className="font-[400] text-[#000000a7]">{item?.comment}</p>
                  <p className="text-[#000000a7] text-[14px]">
                    {formatDate(item.createdAt)}
                  </p>
                  {item.productSize && (
                    <p className="text-[#000000a7] text-[14px]">
                      Size: {item.productSize}
                    </p>
                  )}
                  {item.productColor && (
                    <p className="text-[#000000a7] text-[14px]">
                      Color: {item.productColor}
                    </p>
                  )}
                  {item.productEngraving && (
                    <p className="text-[#000000a7] text-[14px]">
                      Engraving: {item.productEngraving}
                    </p>
                  )}
                </div>
              </div>
            ))}
          {filteredReviews && filteredReviews.length === 0 && (
            <h5 className="w-full text-center py-5 text-[18px]">
              No Reviews have for this shop!
            </h5>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminProfileData;

import React, { useEffect } from 'react';
import { brandingData } from '../../../static/data';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styles from '../../../styles/style';
import { getAllCategories } from '../../../redux/action/category';

const Categories = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { categories, isLoading } = useSelector((state) => state.categories);

  useEffect(() => {
    dispatch(getAllCategories());
  }, [dispatch]);

  const handleSubmit = (category) => {
    navigate(`/products?category=${category.title}`);
  };

  return (
    <>
      <div className={`${styles.section} hidden sm:block`}>
        <div
          className={`branding my-12 flex justify-between w-full shadow-sm bg-white p-5 rounded-md`}
        >
          {brandingData &&
            brandingData.map((i, index) => (
              <div className="flex items-start" key={index}>
                {i.icon}
                <div className="px-3">
                  <h3 className="font-bold text-sm md:text-base text-[#171203]">
                    {i.title}
                  </h3>
                  <p className="text-xs md:text-sm text-[#6b540f]">
                    {i.Description}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>

      <div
        className={`${styles.section} bg-white p-6 rounded-lg mb-12 mt-12`}
        id="categories"
      >
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid grid-cols-1 gap-[5px] md:grid-cols-2 md:gap-[10px] lg:grid-cols-4 lg:gap-[20px] xl:grid-cols-5 xl:gap-[30px]">
            {categories &&
              categories.map((category) => (
                <div
                  className="w-full h-[100px] flex items-center justify-between cursor-pointer overflow-hidden"
                  key={category._id}
                  onClick={() => handleSubmit(category)}
                >
                  <h5 className={`text-[17px] leading-[1.2] text-[#171203]`}>
                    {category.title}
                  </h5>
                  <img
                    src={category.images[0]?.url}
                    className="w-[120px] object-cover"
                    alt={category.title}
                  />
                </div>
              ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Categories;

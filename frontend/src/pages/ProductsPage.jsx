import React, { useEffect, useState } from 'react';
import Header from '../components/Layout/Header';
import styles from '../styles/style';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/Route/ProductCard/ProductCard';
import { useSelector } from 'react-redux';
import Loader from '../components/Layout/Loader';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';
import { IoOptionsOutline } from 'react-icons/io5';

import FilterModal from '../components/FilterModal/FilterModal'; // Import the modal

const ProductsPage = () => {
  const [searchParams] = useSearchParams();
  const { allProducts = [], isLoading } = useSelector(
    (state) => state.products
  );
  const [data, setData] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedRating, setSelectedRating] = useState(0);
  const [sortOption, setSortOption] = useState('default');
  const [stockFilter, setStockFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false); // State for filter visibility

  const categories =
    Array.isArray(allProducts) && allProducts.length > 0
      ? Array.from(new Set(allProducts.map((product) => product.category)))
      : [];

  useEffect(() => {
    const categoryFromQuery = searchParams.get('category');
    if (categoryFromQuery) {
      setSelectedCategory(categoryFromQuery);
    }
  }, [searchParams]);

  useEffect(() => {
    if (allProducts && !isLoading) {
      let filteredData = allProducts;

      if (selectedCategory) {
        filteredData = filteredData.filter(
          (i) => i.category === selectedCategory
        );
      }
      filteredData = filteredData.filter(
        (i) =>
          (i.discountPrice || i.originalPrice) >= priceRange[0] &&
          (i.discountPrice || i.originalPrice) <= priceRange[1]
      );
      if (selectedRating > 0) {
        filteredData = filteredData.filter(
          (i) => Math.floor(i.ratings) === selectedRating
        );
      }

      // Apply sorting
      if (sortOption === 'soldHighToLow') {
        filteredData.sort((a, b) => b.sold_out - a.sold_out);
      } else if (sortOption === 'soldLowToHigh') {
        filteredData.sort((a, b) => a.sold_out - b.sold_out);
      }

      // Apply stock filter
      if (stockFilter === 'inStock') {
        filteredData = filteredData.filter((i) => i.stock > 0);
      } else if (stockFilter === 'noStock') {
        filteredData = filteredData.filter((i) => i.stock === 0);
      }

      // Apply search filter
      if (searchTerm) {
        filteredData = filteredData.filter((i) =>
          i.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      setData(filteredData);
      window.scrollTo(0, 0);
    }
  }, [
    allProducts,
    selectedCategory,
    priceRange,
    selectedRating,
    sortOption,
    stockFilter,
    searchTerm,
    isLoading,
  ]);

  const handleSliderChange = (value) => {
    setPriceRange(value);
  };

  const handleRatingChange = (rating) => {
    setSelectedRating(rating);
  };

  const handleSortChange = (option) => {
    setSortOption(option);
  };

  const handleStockFilterChange = (event) => {
    setStockFilter(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleResetFilters = () => {
    setPriceRange([0, 1000]);
    setSelectedRating(0);
    setSortOption('default');
    setStockFilter('all');
    setSearchTerm('');
    setSelectedCategory('');
    setData(allProducts);
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          onClick={() => handleRatingChange(i)}
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

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <Header activeHeading={3} />
          <br />
          <br />
          <div className={`${styles.section}`}>
            <div className="mb-4 hidden md:block">
              <h3>Search Products</h3>
              <input
                type="text"
                placeholder="Search by name..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4 hidden md:block">
              <h3>Category</h3>
              <select
                onChange={handleCategoryChange}
                value={selectedCategory}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4 hidden md:block">
              <h3>Price Range</h3>
              <Slider
                range
                min={0}
                max={1000}
                defaultValue={[0, 1000]}
                onChange={handleSliderChange}
                value={priceRange}
                trackStyle={[{ backgroundColor: 'black' }]}
                handleStyle={[
                  { borderColor: 'black' },
                  { borderColor: 'black' },
                ]}
              />
              <div className="flex justify-between mt-2">
                <span>₱{priceRange[0]}</span>
                <span>₱{priceRange[1]}</span>
              </div>
            </div>
            <div className="mb-4 hidden md:block">
              <h3>Filter by Ratings</h3>
              <div className="flex">{renderStars()}</div>
            </div>
            <div className="mb-4 hidden md:block">
              <h3>Sort by Sold</h3>
              <div className="flex space-x-4">
                <button
                  onClick={() => handleSortChange('soldHighToLow')}
                  className={`px-3 py-1 border ${
                    sortOption === 'soldHighToLow'
                      ? 'border-black'
                      : 'border-gray-300'
                  }`}
                >
                  Sold High to Low
                </button>
                <button
                  onClick={() => handleSortChange('soldLowToHigh')}
                  className={`px-3 py-1 border ${
                    sortOption === 'soldLowToHigh'
                      ? 'border-black'
                      : 'border-gray-300'
                  }`}
                >
                  Sold Low to High
                </button>
              </div>
            </div>
            <div className="mb-4 hidden md:block">
              <h3>Stock Availability</h3>
              <select
                onChange={handleStockFilterChange}
                value={stockFilter}
                className="px-3 py-1 border border-gray-300 rounded"
              >
                <option value="all">All</option>
                <option value="inStock">In Stock</option>
                <option value="noStock">No Stock</option>
              </select>
            </div>
            <div className="mb-4 hidden md:block">
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                Reset Filters
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 justify-items-center mt-8 lg:mt-4 md:mt-4">
              {data &&
                data.map((i, index) => <ProductCard data={i} key={index} />)}
            </div>
            {data && data.length === 0 ? (
              <h1 className="text-center w-full pb-[110px] text-[20px] 800px:text-[15px]">
                We're on out of stock of that product, Thank you!
              </h1>
            ) : null}
          </div>
          {/* Filter Button at the Bottom */}
          <button
            className="fixed bottom-20 right-10 bg-[#171203] text-white p-4 rounded-full md:hidden"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <IoOptionsOutline size={24} />
          </button>
          {/* Filter Modal */}
          <FilterModal
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
          >
            <div className="mb-4">
              <h3>Search Products</h3>
              <input
                type="text"
                placeholder="Search by name..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <h3>Category</h3>
              <select
                onChange={handleCategoryChange}
                value={selectedCategory}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <h3>Price Range</h3>
              <Slider
                range
                min={0}
                max={1000}
                defaultValue={[0, 1000]}
                onChange={handleSliderChange}
                value={priceRange}
                trackStyle={[{ backgroundColor: 'black' }]}
                handleStyle={[
                  { borderColor: 'black' },
                  { borderColor: 'black' },
                ]}
              />
              <div className="flex justify-between mt-2">
                <span>₱{priceRange[0]}</span>
                <span>₱{priceRange[1]}</span>
              </div>
            </div>
            <div className="mb-4">
              <h3>Filter by Ratings</h3>
              <div className="flex">{renderStars()}</div>
            </div>
            <div className="mb-4">
              <h3>Sort by Sold</h3>
              <div className="flex space-x-4">
                <button
                  onClick={() => handleSortChange('soldHighToLow')}
                  className={`px-3 py-1 border ${
                    sortOption === 'soldHighToLow'
                      ? 'border-black'
                      : 'border-gray-300'
                  }`}
                >
                  Sold High to Low
                </button>
                <button
                  onClick={() => handleSortChange('soldLowToHigh')}
                  className={`px-3 py-1 border ${
                    sortOption === 'soldLowToHigh'
                      ? 'border-black'
                      : 'border-gray-300'
                  }`}
                >
                  Sold Low to High
                </button>
              </div>
            </div>
            <div className="mb-4">
              <h3>Stock Availability</h3>
              <select
                onChange={handleStockFilterChange}
                value={stockFilter}
                className="px-3 py-1 border border-gray-300 rounded"
              >
                <option value="all">All</option>
                <option value="inStock">In Stock</option>
                <option value="noStock">No Stock</option>
              </select>
            </div>
            <div className="mb-4">
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                Reset Filters
              </button>
            </div>
          </FilterModal>
        </div>
      )}
    </>
  );
};

export default ProductsPage;

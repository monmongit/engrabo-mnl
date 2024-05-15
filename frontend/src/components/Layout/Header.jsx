import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from '../../styles/style';
import EngraboLogo from '../../assets/Logo/engrabo-logo.png';
import { categoriesData } from '../../static/data';
import {
  AiOutlineHeart,
  AiOutlineSearch,
  AiOutlineShoppingCart,
} from 'react-icons/ai';
import { IoIosArrowForward, IoIosMore } from 'react-icons/io';
import { BiMenuAltLeft } from 'react-icons/bi';
import { IoIosArrowDown } from 'react-icons/io';
import DropDown from './DropDown';
import Navbar from './Navbar';
import { GoHeart } from 'react-icons/go';
import { LuUserCircle2 } from 'react-icons/lu';
import { useSelector } from 'react-redux';
import Cart from '../Cart/Cart';
import Wishlist from '../Wishlist/Wishlist.jsx';
import { RxCross1 } from 'react-icons/rx';
import { IoHome } from 'react-icons/io5';
import { FaQuestionCircle } from 'react-icons/fa';
import { FaBasketShopping } from 'react-icons/fa6';
import { BiSolidLike } from 'react-icons/bi';
import { useLocation } from 'react-router-dom';

const Header = ({ activeHeading }) => {
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const { isAdmin } = useSelector((state) => state.admin);
  const { cart } = useSelector((state) => state.cart);
  const { wishlist } = useSelector((state) => state.wishlist);

  const { allProducts } = useSelector((state) => state.products);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchData, setSearchData] = useState(null);
  const [active, setActive] = useState(false);
  const [dropDown, setDropDown] = useState(false);
  const [openCart, setOpenCart] = useState(false);
  const [openWishlist, setOpenWishlist] = useState(false);
  const location = useLocation();

  // Mobile
  const [open, setOpen] = useState(false);

  // Search Function
  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term.length > 0) {
      const filteredProducts =
        allProducts &&
        allProducts.filter((product) =>
          product.name.toLowerCase().includes(term.toLowerCase())
        );
      setSearchData(filteredProducts);
    } else {
      setSearchData([]);
    }
  };

  // Sticky Header
  window.addEventListener('scroll', () => {
    if (window.scrollY > 70) {
      setActive(true);
    } else {
      setActive(false);
    }
  });

  return (
    <>
      {/* First Header */}
      <div className={`${styles.section}`}>
        <div className="hidden 800px:h-[50px] 800px:my-[20px] 800px:flex items-center justify-between">
          <div>
            <Link to="/">
              <img src={EngraboLogo} alt="Engrabo Logo" />
            </Link>
          </div>

          {/* Search Box*/}
          <div className="w-[50%] relative">
            <input
              type="text"
              placeholder="Search Product..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="h-[40px] w-full px-2 border-[#171203] border-[2px] rounded-md"
            />
            <AiOutlineSearch
              size={30}
              className="absolute right-2 top-1.5 cursor-pointer"
            />
            {searchData && searchData.length !== 0 ? (
              <div className="absolute w-full  bg-slate-50 shadow-sm z-10 p-4 rounded-md mt-[2px]">
                {searchData &&
                  searchData.map((i, index) => {
                    return (
                      <Link to={`/product/${i._id} `}>
                        <div className="w-full flex items-start-py-3 pb-2">
                          <img
                            src={`${i.images[0]?.url}`}
                            alt=""
                            className="w-[40px] h-[40px] mr-[10px]"
                          />
                          <h1 className="text-left w-full">{i.name}</h1>
                        </div>
                      </Link>
                    );
                  })}
              </div>
            ) : null}
          </div>

          {/* Best Offer */}
          <div className={`${styles.button}`}>
            {isAdmin ? (
              <Link to="/admin-login">
                <h1 className="text-[#fff4d7] flex items-center">
                  {isAdmin ? 'Go Dashboard' : null}
                  <IoIosArrowForward className="ml-1" />
                </h1>
              </Link>
            ) : null}
          </div>
        </div>
      </div>

      {/* Second Header */}
      <div
        className={`${
          active === true ? 'shadow-sm fixed top-0 left-0 z-10' : null
        } transition hidden 800px:flex items-center justify-between w-full bg-[#171203] h-[70px]`}
      >
        <div
          className={`${styles.section} relative ${styles.normalFlex} justify-between`}
        >
          {/* Categories */}
          <div onClick={() => setDropDown(!dropDown)}>
            <div className="relative h-[60px] mt-[10px] w-[270px] hidden 1000px:block">
              <BiMenuAltLeft
                size={30}
                className="absolute top-3 left-2 text-[#171203]"
              />
              <button
                className={`h-[100%] w-full flex justify-between items-center pl-10 bg-[#fff4d7] font-sans text-lg font-[500] select-none rounded-t-md text-[#171203]`}
              >
                All Categories
              </button>
              <IoIosArrowDown
                size={20}
                className="absolute right-2 top-4 cursor-pointer text-[#171203]"
                onClick={() => setDropDown(!dropDown)}
              />
              {/* Dropdown */}
              {dropDown ? (
                <DropDown
                  categoriesData={categoriesData}
                  setDropDown={setDropDown}
                />
              ) : null}
            </div>
          </div>

          {/* Navitems */}
          <div className={`${styles.normalFlex}`}>
            <Navbar active={activeHeading} />
          </div>

          {/* Profile and others */}
          <div className="flex">
            <div className={`${styles.normalFlex}`}>
              <div
                className="relative cursor-pointer mr-[15px]"
                onClick={() => setOpenWishlist(true)}
              >
                <GoHeart size={30} color="#fff4d7" />
                <span className="absolute right-0 top-0 rounded-full bg-[#b19b56] w-4 h-4 top right p-0 m-0 text-white font-mono text-[12px] leading-tight text-center">
                  {wishlist && wishlist.length}
                </span>
              </div>
            </div>

            {/* User Cart */}
            <div className={`${styles.normalFlex}`}>
              <div
                className="relative cursor-pointer mr-[15px]"
                onClick={() => setOpenCart(true)}
              >
                <AiOutlineShoppingCart size={30} color="#fff4d7" />
                <span className="absolute right-0 top-0 rounded-full bg-[#b19b56] w-4 h-4 top right p-0 m-0 text-white font-mono text-[12px] leading-tight text-center">
                  {cart && cart.length}
                </span>
              </div>
            </div>

            {/* User Profile */}
            <div className={`${styles.normalFlex}`}>
              <div className="relative cursor-pointer mr-[15px]">
                {isAuthenticated ? (
                  <Link to="/profile">
                    <img
                      src={`${user?.avatar?.url}`}
                      className="w-[35px] h-[35px] rounded-full"
                      alt="User Avatar"
                    />
                  </Link>
                ) : (
                  <Link to="/login">
                    <LuUserCircle2 size={30} color="#fff4d7" />
                  </Link>
                )}
              </div>
            </div>

            {/* Cart Popup */}
            {openCart ? <Cart setOpenCart={setOpenCart} /> : null}

            {/* Wishlist Popup */}
            {openWishlist ? (
              <Wishlist setOpenWishlist={setOpenWishlist} />
            ) : null}
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div
        className={`${
          active === true ? 'shadow-sm fixed top-0 left-0 z-10' : null
        } w-full h-[60px] fixed bg-[#171203] z-20 top-0 left-0 shadow-sm 800px:hidden`}
      >
        <div className="w-full flex items-center justify-between">
          <div>
            <Link to="/">
              <img
                src={EngraboLogo}
                alt="Engrabo Logo"
                className="mt-2 ml-4 cursor-pointer w-[90px] h-[45px]"
              />
            </Link>
          </div>
          <div>
            <div
              className="relative mr-[20px] cursor-pointer"
              onClick={() => setOpenCart(true)}
            >
              <AiOutlineShoppingCart size={30} color="#9c6f18" />
              <span className="absolute right-0 top-0 rounded-full bg-[#b19b56] w-4 h-4 top right p-0 m-0 text-white font-mono text-[12px] leading-tight text-center">
                {cart && cart.length}
              </span>
            </div>
          </div>

          {/* Cart popup */}
          {openCart ? <Cart setOpenCart={setOpenCart} /> : null}

          {/* Wishlist popup */}
          {openWishlist ? <Wishlist setOpenWishlist={setOpenWishlist} /> : null}
        </div>
      </div>

      {/* Sticky Mobile Footer */}
      <div className="fixed bottom-0 left-0 w-full bg-[#171203] z-20 flex justify-between items-center h-[60px] shadow-2xl 800px:hidden">
        <div className="flex justify-around w-full">
          <div className="flex flex-col items-center justify-center pd-[10px]">
            <Link to="/">
              <IoHome
                size={30}
                color={location.pathname === '/' ? '#9c6f18' : '#fff4d7'}
              />
              <h5
                className="text-[10px] text-center"
                style={{
                  color: location.pathname === '/' ? '#9c6f18' : '#fff4d7',
                }}
              >
                Home
              </h5>
            </Link>
          </div>
          <div className="flex flex-col items-center justify-center">
            <Link to="/products">
              <FaBasketShopping
                size={30}
                color={
                  location.pathname === '/products' ? '#9c6f18' : '#fff4d7'
                }
              />
              <h5
                className="text-[10px] text-center "
                style={{
                  color:
                    location.pathname === '/products' ? '#9c6f18' : '#fff4d7',
                }}
              >
                Shop
              </h5>
            </Link>
          </div>
          <div className="flex flex-col items-center justify-center">
            <Link to="/best-selling">
              <BiSolidLike
                size={30}
                color={
                  location.pathname === '/best-selling' ? '#9c6f18' : '#fff4d7'
                }
                style={{ display: 'block', margin: '0 auto' }}
              />
              <h5
                className="text-[10px] text-center"
                style={{
                  color:
                    location.pathname === '/best-selling'
                      ? '#9c6f18'
                      : '#fff4d7',
                }}
              >
                Best Sales
              </h5>
            </Link>
          </div>
          <div className="flex flex-col items-center justify-center">
            <Link to="/faq">
              <FaQuestionCircle
                size={30}
                color={location.pathname === '/faq' ? '#9c6f18' : '#fff4d7'}
              />
              <h5
                className="text-[10px] text-center"
                style={{
                  color: location.pathname === '/faq' ? '#9c6f18' : '#fff4d7',
                }}
              >
                FAQ
              </h5>
            </Link>
          </div>
          <div className="flex flex-col items-center justify-center">
            <IoIosMore
              size={30}
              onClick={() => setOpen(true)}
              color={open ? '#9c6f18' : '#fff4d7'}
            />
            <h5
              className="text-[10px] text-center "
              style={{
                color: open ? '#9c6f18' : '#fff4d7',
              }}
            >
              More
            </h5>
          </div>
        </div>
      </div>

      {/* Mobile Header Sidebar */}
      {open && (
        <div
          className={`fixed top-0 left-0 w-full bg-[#0000004b] h-screen z-20 `}
        >
          <div className="fixed w-[70%] bg-[#fff] h-screen top-0 left-0 z-70 overflow-y-scroll hide-scrollbar">
            {/* Wishlist and X Icon */}
            <div className="w-full justify-between flex pr-3">
              {/* Wishlist Icon */}
              <div>
                <div
                  className="relative mr-[15px]"
                  onClick={() => setOpenWishlist(true) || setOpen(false)}
                >
                  <AiOutlineHeart size={30} className="mt-5 ml-3" />
                  <span className="absolute right-0 top-0 rounded-full bg-[#b19b56] w-4 h-4 top right p-0 m-0 text-white font-mono text-[12px] leading-tight text-center">
                    {wishlist && wishlist.length}
                  </span>
                </div>
              </div>

              {/* Cross Icon */}
              <RxCross1
                size={30}
                className="ml-4 mt-5"
                onClick={() => setOpen(false)}
              />
            </div>

            {/* Search Bar */}
            <div className="my-8 w-[92%] m-auto h-[40px] relative">
              <input
                type="search"
                placeholder="Search Product..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="h-[40px] w-full px-2 border-[#171203] border-[2px] rounded-md"
              />
              {searchData && (
                <div className="absolute bg-[#fff] z-10 shadow w-full left-0 ">
                  {searchData.map((i) => {
                    const d = i.name;

                    const Product_name = d.replace(/\s+/g, '-');
                    return (
                      <Link to={`/product/${Product_name}`}>
                        <div className="w-full flex items-start-py-3 pt-1 pb-1">
                          <img
                            src={i.image_Url[0]?.url}
                            alt=""
                            className="w-[40px] h-[40px] mr-[10px]"
                          />
                          <h1 className="text-left w-full">{i.name}</h1>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />

            {/* Logo */}
            <div className="flex w-full justify-center">
              <Link to="">
                <img
                  src={EngraboLogo}
                  alt="Engrabo Logo"
                  className="mt-2 cursor-pointer w-[160px] h-[90px]"
                />
              </Link>
            </div>

            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />

            {/* User Profile */}
            <div className="flex w-full justify-center">
              {isAuthenticated ? (
                <Link to="/profile">
                  <img
                    src={`${user.avatar?.url}`}
                    className="w-[60px] h-[60px] rounded-full border-[3px] border-green-400"
                    alt="User Avatar"
                  />
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-[18px] pr-[10px] text-[#6b540f] hover:text-[#171203] transition duration-300 ease-in-out"
                  >
                    Login /
                  </Link>
                  <Link
                    to="/sign-up"
                    className="text-[18px] text-[#6b540f] hover:text-[#171203] transition duration-300 ease-in-out"
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;

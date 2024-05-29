import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { server } from "../../server";
import styles from "../../styles/style";
import Loader from "../Layout/Loader";
import { useDispatch, useSelector } from "react-redux";
import { getAllProductsAdmin } from "../../redux/action/product";
import Button from "@mui/material/Button";

const AdminInfo = ({ isOwner }) => {
  const [data, setData] = useState({});
  const { products } = useSelector((state) => state.products);
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllProductsAdmin(id));
    setIsLoading(true);
    axios
      .get(`${server}/admin/get-admin-info/${id}`)
      .then((res) => {
        setData(res.data.admin);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  }, [dispatch, id]);

  const logoutHandler = async () => {
    axios.get(`${server}/admin/logout`, {
      withCredentials: true,
    });
    window.location.reload();
  };

  const totalReviewsLength =
    products &&
    products.reduce((acc, product) => acc + product.reviews.length, 0);

  const totalRatings =
    products &&
    products.reduce(
      (acc, product) =>
        acc + product.reviews.reduce((sum, review) => sum + review.rating, 0),
      0
    );

  const averageRating = totalRatings / totalReviewsLength || 0;

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-full p-4 bg-white rounded-md shadow-md hover:shadow-lg transition duration-300">
          <div className="w-full py-5">
            <div className="w-full flex item-center justify-center">
              <img
                src={`${data.avatar?.url}`}
                alt=""
                className="w-[150px] h-[150px] object-cover rounded-full hover:shadow-xl hover:border-white border border-transparent transition duration-300"
              />
            </div>
            <div className="mt-2 p-4 bg-[#171203] rounded-lg shadow-lg hover:shadow-xl hover:border-white border border-transparent transition duration-300">
              <h3 className="text-center text-2xl font-[800] text-white">
                {data.name}
              </h3>
            </div>
            <div className="mt-2 p-4 bg-primary rounded-lg shadow-lg hover:shadow-xl hover:border-white border border-transparent transition duration-300">
              <p className="text-center text-sm text-gray-600 mb-4">
                {data.description}
              </p>
            </div>
          </div>
          <div className="p-1 bg-primary rounded-lg shadow-lg hover:shadow-xl hover:border-white border border-transparent transition duration-300">
            <div className="font-roboto">
              <div className="p-3">
                <h5 className="font-[800] text-black ">Address</h5>
                <h4 className="text-[#000000a6] text-gray-600">
                  {data.address}
                </h4>
              </div>
              <div className="p-3">
                <h5 className="font-[800] text-black">Phone Number</h5>
                <h4 className="text-[#000000a6] text-gray-600">
                  {data.phoneNumber}
                </h4>
              </div>
              <div className="p-3">
                <h5 className="font-[800] text-black">Total Products</h5>
                <h4 className="text-[#000000a6] text-gray-600">
                  {products && products.length}
                </h4>
              </div>
              <div className="p-3">
                <h5 className="font-[800] text-black">Shop Ratings</h5>
                <h4 className="text-[#000000b0] text-gray-600">
                  {averageRating}/5
                </h4>
              </div>
              <div className="p-3">
                <h5 className="font-[800] text-black">Joined On</h5>
                <h4 className="text-[#000000b0] text-gray-600">
                  {data?.createdAt?.slice(0, 10)}
                </h4>
              </div>
            </div>
          </div>
          {isOwner && (
            <div className="py-3 px-1">
              <Link to="/settings">
                <div
                  className={`${styles.button} !w-full !h-[42px] !rounded-[5px] font-roboto`}
                >
                  <span className="text-white font-[800]">Edit Shop</span>
                </div>
              </Link>
              <Button
                variant="contained"
                color="error"
                className="w-full h-10 rounded-md  text-white text-center py-2 cursor-pointer hover:bg-red-600"
                onClick={logoutHandler}
              >
                <div className="font-roboto font-[800]">Log Out</div>
              </Button>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default AdminInfo;

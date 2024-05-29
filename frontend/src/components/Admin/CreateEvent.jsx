import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { categoriesData } from "../../static/data";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { toast } from "react-toastify";
import { createEvent } from "../../redux/action/event";
import { RxCross1 } from "react-icons/rx";

const CreateEvent = ({ setOpen }) => {
  const { admin } = useSelector((state) => state.admin);
  const { success, error } = useSelector((state) => state.events);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [images, setImages] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [stock, setStock] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleStartDateChange = (e) => {
    const startDate = new Date(e.target.value);
    const minEndDate = new Date(startDate.getTime() + 1 * 24 * 60 * 60 * 1000);
    setStartDate(startDate);
    setEndDate(null);
    document.getElementById("end-date").min = minEndDate
      .toISOString()
      .slice(0, 10);
  };

  const handleEndDateChange = (e) => {
    const endDate = new Date(e.target.value);
    setEndDate(endDate);
  };

  const today = new Date().toISOString().slice(0, 10);

  const minEndDate = startDate
    ? new Date(startDate.getTime() + 1 * 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 10)
    : today;

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
    if (success) {
      navigate("/dashboard-events");
      window.location.reload();
      toast.success("Event created successfully");
    }
  }, [dispatch, error, success, navigate]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    setImages([]);

    files.forEach((file) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setImages((old) => [...old, reader.result]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newForm = new FormData();

    images.forEach((image) => {
      newForm.append("images", image);
    });
    const data = {
      name,
      description,
      category,
      tags,
      originalPrice,
      discountPrice,
      stock,
      images,
      adminId: admin._id,
      start_Date: startDate?.toISOString(),
      Finish_Date: endDate?.toISOString(),
    };
    dispatch(createEvent(data));
  };

  return (
    <>
      <div className="800px:w-[50%] w-[90%] bg-[white] shadow h-[80vh] rounded-[4px] p-3 overflow-y-scroll hide-scrollbar">
        {/* Cross Icons */}
        <div className="w-full flex justify-end">
          <RxCross1
            size={30}
            className="cursor-pointer"
            onClick={() => setOpen(false)}
          />
        </div>

        <h5 className="text-[30px] font-bold font-Poppins text-center">
          Create Event{" "}
        </h5>

        {/* Create Event Form */}
        <form onSubmit={handleSubmit}>
          <br />
          {/* Name */}
          <div>
            <label className="block text-l font-medium text-gray-800 mb-2  font-Poppins">
              Name <span className="text-red-500">*</span>
            </label>{" "}
            <input
              type="text"
              name="name"
              value={name}
              className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your event product name..."
            />
          </div>
          <br />

          {/* Description */}
          <div>
            <label className="block text-l font-medium text-gray-800 mb-2  font-Poppins">
              Description <span className="text-red-500">*</span>
            </label>{" "}
            <textarea
              cols="30"
              required
              row="8"
              type="text"
              name="description"
              value={description}
              className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter your event product description..."
            ></textarea>
          </div>
          <br />

          {/* Categories */}
          <div>
            <label className="block text-l font-medium text-gray-800 mb-2  font-Poppins">
              Category <span className="text-red-500">*</span>
            </label>{" "}
            <select
              className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="Choose a category">Choose a category</option>
              {categoriesData &&
                categoriesData.map((i) => (
                  <option value={i.title} key={i.title}>
                    {i.title}
                  </option>
                ))}
            </select>
          </div>
          <br />

          {/* Tags */}
          <div>
            <label className="block text-l font-medium text-gray-800 mb-2  font-Poppins">
              Tags <span className="text-red-500">*</span>
            </label>{" "}
            <input
              type="text"
              name="tags"
              value={tags}
              className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              onChange={(e) => setTags(e.target.value)}
              placeholder="Enter your event product tags..."
            />
          </div>
          <br />

          {/* Original Price */}
          <div>
            <label className="block text-l font-medium text-gray-800 mb-2  font-Poppins">
              Original Price <span className="text-red-500">*</span>
            </label>{" "}
            <input
              type="number"
              name="price"
              value={originalPrice}
              className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              onChange={(e) => setOriginalPrice(e.target.value)}
              placeholder="Enter your event product price..."
            />
          </div>
          <br />

          {/* Price with Discount */}
          <div>
            <label className="block text-l font-medium text-gray-800 mb-2  font-Poppins">
              Price (With Discount)
            </label>

            <input
              type="number"
              name="price"
              value={discountPrice}
              className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              onChange={(e) => setDiscountPrice(e.target.value)}
              placeholder="Enter your event product price with discount..."
            />
          </div>
          <br />

          {/* Product Stock */}
          <div>
            <label className="block text-l font-medium text-gray-800 mb-2  font-Poppins">
              Product Stock <span className="text-red-500">*</span>
            </label>

            <input
              type="number"
              name="stock"
              value={stock}
              className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              onChange={(e) => setStock(e.target.value)}
              placeholder="Enter your event product stock..."
            />
          </div>
          <br />

          {/* Event Start Date */}
          <div>
            <label className="block text-l font-medium text-gray-800 mb-2  font-Poppins">
              Event Start Date <span className="text-red-500">*</span>
            </label>{" "}
            <input
              type="date"
              name="price"
              id="start-date"
              value={startDate ? startDate.toISOString().slice(0, 10) : ""}
              className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              onChange={handleStartDateChange}
              min={today}
              placeholder="Enter your event product start date..."
            />
          </div>
          <br />

          {/* Event End Date */}
          <div>
            <label className="block text-l font-medium text-gray-800 mb-2  font-Poppins">
              Event End Date <span className="text-red-500">*</span>
            </label>{" "}
            <input
              type="date"
              name="price"
              id="end-date"
              value={endDate ? endDate.toISOString().slice(0, 10) : ""}
              className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              onChange={handleEndDateChange}
              min={minEndDate}
              placeholder="Enter your event product end date..."
            />
          </div>
          <br />

          {/* Product Images*/}
          <div>
            <label className="block text-l font-medium text-gray-800 mb-2  font-Poppins">
              Upload Images <span className="text-red-500">*</span>
            </label>{" "}
            <input
              type="file"
              name=""
              id="upload"
              className="hidden"
              multiple
              onChange={handleImageChange}
            />
            <div className="w-full flex items-center flex-wrap">
              {" "}
              <label htmlFor="upload">
                <AiOutlinePlusCircle size={30} className="mt-3" color="#555" />{" "}
              </label>
              {images &&
                images.map((i) => (
                  <img
                    src={i}
                    key={i}
                    alt=""
                    className="h-[120px] w-[120px] object-cover m-2"
                  />
                ))}
            </div>
            <br />
            <div>
              <input
                type="submit"
                value="Create"
                className="block w-full py-2 px-4 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded-lg cursor-pointer text-center mt-3"
              />
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default CreateEvent;

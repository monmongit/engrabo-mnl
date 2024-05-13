import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { categoriesData } from '../../static/data';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import { toast } from 'react-toastify';
import { createEvent } from '../../redux/action/event';
import { RxCross1 } from 'react-icons/rx';

const CreateEvent = ({ setOpen }) => {
  const { admin } = useSelector((state) => state.admin);
  const { success, error } = useSelector((state) => state.events);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [images, setImages] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [discountPrice, setDiscountPrice] = useState('');
  const [stock, setStock] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleStartDateChange = (e) => {
    const startDate = new Date(e.target.value);
    const minEndDate = new Date(startDate.getTime() + 1 * 24 * 60 * 60 * 1000);
    setStartDate(startDate);
    setEndDate(null);
    document.getElementById('end-date').min = minEndDate
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
      navigate('/dashboard-events');
      window.location.reload();
      toast.success('Event created successfully');
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
      newForm.append('images', image);
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
    <div className="800px:w-[50%] w-[90%] bg-[white] shadow h-[80vh] rounded-[4px] p-3 overflow-y-scroll hide-scrollbar">
      {/* Cross Icons */}
      <div className="w-full flex justify-end">
        <RxCross1
          size={30}
          className="cursor-pointer"
          onClick={() => setOpen(false)}
        />
      </div>

      <h5 className="text-[30px] font-Poppins text-center text-[#171203]">
        Create Event
      </h5>

      {/* Create Event Form */}
      <form onSubmit={handleSubmit}>
        <br />
        {/* Name */}
        <div>
          <label className="pb-2 text-[#171203]">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={name}
            className="mt-2 appearance-none block w-full px-3 h-[35px]  border border-[#9e8a4f] rounded-[3px] shadow-sm placeholder-[#9e8a4f] focus:outline-none focus:ring-brown-dark focus:border-brown-dark"
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your event product name..."
          />
        </div>
        <br />

        {/* Description */}
        <div>
          <label className="pb-2 text-[#171203]">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            cols="30"
            required
            row="8"
            type="text"
            name="description"
            value={description}
            className="mt-2 appearance-none block w-full pt-2 px-3 border border-[#9e8a4f] rounded-[3px] shadow-sm placeholder-[#9e8a4f] focus:outline-none focus:ring-brown-dark focus:border-brown-dark"
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter your event product description..."
          ></textarea>
        </div>
        <br />

        {/* Categories */}
        <div>
          <label className="pb-2 text-[#171203]">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            className="mt-2 w-full border h-[35px] rounded-[5px]"
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
          <label className="pb-2 text-[#171203]">
            Tags <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="tags"
            value={tags}
            className="mt-2 appearance-none block w-full px-3 h-[35px]  border border-[#9e8a4f] rounded-[3px] shadow-sm placeholder-[#9e8a4f] focus:outline-none focus:ring-brown-dark focus:border-brown-dark"
            onChange={(e) => setTags(e.target.value)}
            placeholder="Enter your event product tags..."
          />
        </div>
        <br />

        {/* Original Price */}
        <div>
          <label className="pb-2 text-[#171203]">
            Original Price <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="price"
            value={originalPrice}
            className="mt-2 appearance-none block w-full px-3 h-[35px]  border border-[#9e8a4f] rounded-[3px] shadow-sm placeholder-[#9e8a4f] focus:outline-none focus:ring-brown-dark focus:border-brown-dark"
            onChange={(e) => setOriginalPrice(e.target.value)}
            placeholder="Enter your event product price..."
          />
        </div>
        <br />

        {/* Price with Discount */}
        <div>
          <label className="pb-2 text-[#171203]">Price (With Discount) </label>
          <input
            type="number"
            name="price"
            value={discountPrice}
            className="mt-2 appearance-none block w-full px-3 h-[35px]  border border-[#9e8a4f] rounded-[3px] shadow-sm placeholder-[#9e8a4f] focus:outline-none focus:ring-brown-dark focus:border-brown-dark"
            onChange={(e) => setDiscountPrice(e.target.value)}
            placeholder="Enter your event product price with discount..."
          />
        </div>
        <br />

        {/* Product Stock */}
        <div>
          <label className="pb-2 text-[#171203]">
            Product Stock <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="stock"
            value={stock}
            className="mt-2 appearance-none block w-full px-3 h-[35px]  border border-[#9e8a4f] rounded-[3px] shadow-sm placeholder-[#9e8a4f] focus:outline-none focus:ring-brown-dark focus:border-brown-dark"
            onChange={(e) => setStock(e.target.value)}
            placeholder="Enter your event product stock..."
          />
        </div>
        <br />

        {/* Event Start Date */}
        <div>
          <label className="pb-2 text-[#171203]">
            Event Start Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="price"
            id="start-date"
            value={startDate ? startDate.toISOString().slice(0, 10) : ''}
            className="mt-2 appearance-none block w-full px-3 h-[35px]  border border-[#9e8a4f] rounded-[3px] shadow-sm placeholder-[#9e8a4f] focus:outline-none focus:ring-brown-dark focus:border-brown-dark"
            onChange={handleStartDateChange}
            min={today}
            placeholder="Enter your event product start date..."
          />
        </div>
        <br />

        {/* Event End Date */}
        <div>
          <label className="pb-2 text-[#171203]">
            Event End Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="price"
            id="end-date"
            value={endDate ? endDate.toISOString().slice(0, 10) : ''}
            className="mt-2 appearance-none block w-full px-3 h-[35px]  border border-[#9e8a4f] rounded-[3px] shadow-sm placeholder-[#9e8a4f] focus:outline-none focus:ring-brown-dark focus:border-brown-dark"
            onChange={handleEndDateChange}
            min={minEndDate}
            placeholder="Enter your event product end date..."
          />
        </div>
        <br />

        {/* Product Images*/}
        <div>
          <label className="pb-2 text-[#171203]">
            Upload Images <span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            name=""
            id="upload"
            className="hidden"
            multiple
            onChange={handleImageChange}
          />
          <div className="w-full flex items-center flex-wrap">
            {' '}
            <label htmlFor="upload">
              <AiOutlinePlusCircle size={30} className="mt-3" color="#555" />{' '}
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
              className="mt-2 appearance-none block w-full px-3 h-[35px]  border border-[#9e8a4f] rounded-[3px] shadow-sm placeholder-[#9e8a4f] focus:outline-none focus:ring-brown-dark focus:border-brown-dark hover:bg-[#f9f1dc] transition duration-300 ease-in-out"
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateEvent;

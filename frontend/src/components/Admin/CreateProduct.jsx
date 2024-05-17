import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import { createProduct } from '../../redux/action/product';
import { toast } from 'react-toastify';
import { RxCross1 } from 'react-icons/rx';
import { getAllCategories } from '../../redux/action/category';

const CreateProduct = ({ setOpen }) => {
  const { admin } = useSelector((state) => state.admin);

  const { success, error } = useSelector((state) => state.products);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { categories } = useSelector((state) => state.categories);

  const [images, setImages] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [grossPrice, setGrossPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [discountPrice, setDiscountPrice] = useState('');
  const [stock, setStock] = useState('');

  useEffect(() => {
    dispatch(getAllCategories());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
    if (success) {
      toast.success('Product created successfully');
      navigate('/dashboard-products');
      window.location.reload();
    }
  }, [dispatch, error, success, navigate]);

  const handleImageChange = (e) => {
    e.preventDefault();

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

  console.log(admin._id);
  const handleSubmit = (e) => {
    e.preventDefault();

    const newForm = new FormData();

    images.forEach((image) => {
      newForm.set('images', image);
    });

    newForm.append('name', name);
    newForm.append('description', description);
    newForm.append('category', category);
    newForm.append('tags', tags);
    newForm.append('grossPrice', grossPrice)
    newForm.append('originalPrice', originalPrice);
    newForm.append('discountPrice', discountPrice);
    newForm.append('stock', stock);
    newForm.append('adminId', admin._id);

    dispatch(
      createProduct({
        name,
        description,
        category,
        tags,
        grossPrice,
        originalPrice,
        discountPrice,
        stock,
        adminId: admin._id,
        images,
      })
    );
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
        Create Product
      </h5>

      {/* Create Product Form */}
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
            placeholder="Enter your product name..."
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
            placeholder="Enter your product description..."
          ></textarea>
        </div>
        <br />

        {/* Categories */}
        <div>
          <label className="pb-2 text-[#171203]">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            className="mt-2 w-full pl-2 border h-[35px] rounded-[5px]"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="Choose a category">Choose a category</option>
            {categories &&
              categories.map((i) => (
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
            placeholder="Enter your product tags..."
          />
        </div>
        <br />

        {/* Gross Price */}
         <div>
          <label className="pb-2 text-[#171203]">
            Gross Price <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="price"
            value={grossPrice}
            className="mt-2 appearance-none block w-full px-3 h-[35px]  border border-[#9e8a4f] rounded-[3px] shadow-sm placeholder-[#9e8a4f] focus:outline-none focus:ring-brown-dark focus:border-brown-dark"
            onChange={(e) => setGrossPrice(e.target.value)}
            placeholder="Enter your product gross price..."
          />
        </div>
        <br />

        {/* Selling Price */}
        <div>
          <label className="pb-2 text-[#171203]">
            Selling Price <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="price"
            value={originalPrice}
            className="mt-2 appearance-none block w-full px-3 h-[35px]  border border-[#9e8a4f] rounded-[3px] shadow-sm placeholder-[#9e8a4f] focus:outline-none focus:ring-brown-dark focus:border-brown-dark"
            onChange={(e) => setOriginalPrice(e.target.value)}
            placeholder="Enter your product selling price..."
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
            placeholder="Enter your product price with discount..."
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
            placeholder="Enter your product stock..."
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
              className=" appearance-none block w-full px-3 h-[35px]  border border-[#171203] text-center text-[#171203] rounded-[3px] mt-8 cursor-pointer"
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateProduct;

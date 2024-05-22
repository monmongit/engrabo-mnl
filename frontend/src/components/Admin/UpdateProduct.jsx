import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { updateProduct, getProductDetails } from '../../redux/action/product';
import { toast } from 'react-toastify';
import { RxCross1 } from 'react-icons/rx';
import { getAllCategories } from '../../redux/action/category';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import { FaPlus, FaTrash } from 'react-icons/fa';

const UpdateProduct = ({ setOpen, productId }) => {
  const { admin } = useSelector((state) => state.admin);
  const { success, error, product } = useSelector((state) => state.products);
  const { categories } = useSelector((state) => state.categories);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [images, setImages] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [grossPrice, setGrossPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [discountPrice, setDiscountPrice] = useState('');
  const [stock, setStock] = useState('');
  const [instructions, setInstructions] = useState('');
  const [dropdowns, setDropdowns] = useState([]);

  useEffect(() => {
    dispatch(getAllCategories());
    dispatch(getProductDetails(productId));
  }, [dispatch, productId]);

  useEffect(() => {
    if (product) {
      setImages(product.images || []);
      setName(product.name || '');
      setDescription(product.description || '');
      setCategory(product.category || '');
      setTags(product.tags || '');
      setGrossPrice(product.grossPrice || '');
      setOriginalPrice(product.originalPrice || '');
      setDiscountPrice(product.discountPrice || '');
      setStock(product.stock || '');
      setInstructions(product.instructions || '');
      setDropdowns(product.dropdowns || []);
    }
  }, [product]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
    if (success) {
      toast.success('Product updated successfully');
      navigate('/dashboard-products');
      setOpen(false);
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
          setImages((old) => [...old, { url: reader.result }]); // Changed to ensure images are objects with `url` property
        }
      };
      reader.readAsDataURL(file); // Ensure this reads as Data URL
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedProduct = {
      id: productId,
      name,
      description,
      category,
      tags,
      grossPrice,
      originalPrice,
      discountPrice,
      stock,
      adminId: admin._id,
      images: images.map((img) => img.url), // Map to extract base64 strings
      instructions,
      dropdowns,
    };

    console.log('Updated Product Data:', updatedProduct); // Add this line to debug

    dispatch(updateProduct(updatedProduct));
  };

  // Handlers for Dropdowns
  const handleAddDropdown = () => {
    setDropdowns([...dropdowns, { name: '', options: [] }]);
  };
  const handleAddOption = (index) => {
    const newDropdowns = dropdowns.map((dropdown, i) => {
      if (i === index) {
        return { ...dropdown, options: [...dropdown.options, ''] };
      }
      return dropdown;
    });
    setDropdowns(newDropdowns);
  };
  const handleDropdownChange = (index, value) => {
    const newDropdowns = dropdowns.map((dropdown, i) => {
      if (i === index) {
        return { ...dropdown, name: value };
      }
      return dropdown;
    });
    setDropdowns(newDropdowns);
  };
  const handleOptionChange = (dropdownIndex, optionIndex, value) => {
    const newDropdowns = dropdowns.map((dropdown, i) => {
      if (i === dropdownIndex) {
        const newOptions = dropdown.options.map((option, j) => {
          if (j === optionIndex) {
            return value;
          }
          return option;
        });
        return { ...dropdown, options: newOptions };
      }
      return dropdown;
    });
    setDropdowns(newDropdowns);
  };
  const handleDeleteDropdown = (index) => {
    const newDropdowns = dropdowns.filter((_, i) => i !== index);
    setDropdowns(newDropdowns);
  };
  const handleDeleteOption = (dropdownIndex, optionIndex) => {
    const newDropdowns = dropdowns.map((dropdown, i) => {
      if (i === dropdownIndex) {
        const newOptions = dropdown.options.filter((_, j) => j !== optionIndex);
        return { ...dropdown, options: newOptions };
      }
      return dropdown;
    });
    setDropdowns(newDropdowns);
  };

  return (
    <div className="800px:w-[50%] w-[90%] bg-white shadow-lg h-[80vh] rounded-lg p-5 overflow-y-scroll hide-scrollbar">
      <div className="w-full flex justify-end">
        <RxCross1
          size={30}
          className="cursor-pointer text-gray-600 hover:text-gray-800"
          onClick={() => setOpen(false)}
        />
      </div>

      <h5 className="text-3xl font-bold text-center text-gray-900 mb-6">
        Update Product
      </h5>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <div>
            <label className="block text-lg font-medium text-gray-800 mb-2">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={name}
              className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your product name..."
            />
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-800 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              cols="30"
              required
              rows="8"
              name="description"
              value={description}
              className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter your product description..."
            ></textarea>
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-800 mb-2">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Choose a category</option>
              {categories &&
                categories.map((i) => (
                  <option value={i.title} key={i.title}>
                    {i.title}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-800 mb-2">
              Tags <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="tags"
              value={tags}
              className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              onChange={(e) => setTags(e.target.value)}
              placeholder="Enter your product tags..."
            />
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-800 mb-2">
              Gross Price <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="grossPrice"
              value={grossPrice}
              className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              onChange={(e) => setGrossPrice(e.target.value)}
              placeholder="Enter your product gross price..."
            />
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-800 mb-2">
              Selling Price <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="originalPrice"
              value={originalPrice}
              className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              onChange={(e) => setOriginalPrice(e.target.value)}
              placeholder="Enter your product selling price..."
            />
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-800 mb-2">
              Price (With Discount)
            </label>
            <input
              type="number"
              name="discountPrice"
              value={discountPrice}
              className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              onChange={(e) => setDiscountPrice(e.target.value)}
              placeholder="Enter your product price with discount..."
            />
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-800 mb-2">
              Product Stock <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="stock"
              value={stock}
              className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              onChange={(e) => setStock(e.target.value)}
              placeholder="Enter your product stock..."
            />
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-800 mb-2">
              Upload Images <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              name="upload"
              id="upload"
              className="hidden"
              multiple
              onChange={handleImageChange}
            />
            <div className="w-full flex items-center flex-wrap">
              <label htmlFor="upload">
                <AiOutlinePlusCircle
                  size={30}
                  className="mt-3 text-gray-600 hover:text-gray-800 cursor-pointer"
                />
              </label>
              {images &&
                images.map((i, index) => (
                  <img
                    src={i.url}
                    key={index}
                    alt=""
                    className="h-32 w-32 object-cover m-2 rounded-lg shadow"
                  />
                ))}
            </div>
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-800 mb-2">
              Instruction For Personalization{' '}
              <span className="text-red-500">*</span>
            </label>
            <textarea
              cols="30"
              rows="8"
              name="instructions"
              value={instructions}
              className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Enter your personalization instructions..."
            ></textarea>
          </div>

          <div className="space-y-4">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
              type="button"
              onClick={handleAddDropdown}
            >
              <FaPlus className="mr-2" /> Add Dropdown For Product
              Personalization
            </button>
            <div className="space-y-4">
              {dropdowns.map((dropdown, dropdownIndex) => (
                <div
                  key={dropdownIndex}
                  className="border p-4 rounded-lg shadow-md"
                >
                  <div className="flex items-center mb-2">
                    <input
                      className="text-black flex-1 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-green-200"
                      placeholder={`Dropdown Name ${dropdownIndex + 1}`}
                      value={dropdown.name}
                      onChange={(e) =>
                        handleDropdownChange(dropdownIndex, e.target.value)
                      }
                      required
                    />
                    <button
                      className="bg-red-500 hover:bg-red-700 text-white p-2 rounded-lg ml-2"
                      type="button"
                      onClick={() => handleDeleteDropdown(dropdownIndex)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                  <div className="space-y-2">
                    {dropdown.options.map((option, optionIndex) => (
                      <div key={optionIndex} className="flex items-center">
                        <input
                          className="flex-1 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          type="text"
                          placeholder={`Option ${optionIndex + 1}`}
                          value={option}
                          onChange={(e) =>
                            handleOptionChange(
                              dropdownIndex,
                              optionIndex,
                              e.target.value
                            )
                          }
                          required
                        />
                        <button
                          className="bg-red-500 hover:bg-red-700 text-white p-2 rounded-lg ml-2"
                          type="button"
                          onClick={() =>
                            handleDeleteOption(dropdownIndex, optionIndex)
                          }
                        >
                          <FaTrash />
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    className="mt-2 bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded-lg flex items-center"
                    type="button"
                    onClick={() => handleAddOption(dropdownIndex)}
                  >
                    <FaPlus className="mr-2" /> Add Option
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <input
              type="submit"
              value="Update"
              className="block w-full py-2 px-4 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded-lg cursor-pointer text-center mt-8"
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default UpdateProduct;
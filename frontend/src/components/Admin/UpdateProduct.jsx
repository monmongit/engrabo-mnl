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
  const [sizes, setSizes] = useState([]);
  const [engravings, setEngravings] = useState([]);
  const [mediaType, setMediaType] = useState('none');

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
      setSizes(product.sizes || []);
      setEngravings(product.engravings || []);
      setMediaType(product.mediaType || 'none');
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
          setImages((old) => [...old, { url: reader.result }]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddSize = () => {
    setSizes([
      ...sizes,
      { name: '', grossPrice: '', price: '', stock: '', description: '' },
    ]);
  };

  const handleSizeChange = (index, field, value) => {
    const newSizes = sizes.map((size, i) => {
      if (i === index) {
        return { ...size, [field]: value };
      }
      return size;
    });
    setSizes(newSizes);
  };

  const handleDeleteSize = (index) => {
    const newSizes = sizes.filter((_, i) => i !== index);
    setSizes(newSizes);
  };

  const handleAddEngraving = () => {
    setEngravings([
      ...engravings,
      { type: '', grossPrice: '', price: '', stock: '', description: '' },
    ]);
  };

  const handleEngravingChange = (index, field, value) => {
    const newEngravings = engravings.map((engraving, i) => {
      if (i === index) {
        return { ...engraving, [field]: value };
      }
      return engraving;
    });
    setEngravings(newEngravings);
  };

  const handleDeleteEngraving = (index) => {
    const newEngravings = engravings.filter((_, i) => i !== index);
    setEngravings(newEngravings);
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
      images: images.map((img) => img.url),
      instructions,
      sizes,
      engravings,
      mediaType,
    };

    dispatch(updateProduct(updatedProduct));
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
          <div>
            <label className="block text-lg font-medium text-gray-800 mb-2">
              Sizes
            </label>
            <button
              type="button"
              onClick={handleAddSize}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
            >
              <FaPlus className="mr-2" /> Add Size
            </button>
            {sizes.map((size, index) => (
              <div key={index} className="mt-2 flex flex-wrap">
                <input
                  type="text"
                  placeholder="Size name"
                  value={size.name}
                  onChange={(e) =>
                    handleSizeChange(index, 'name', e.target.value)
                  }
                  className="flex-1 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                <input
                  type="number"
                  placeholder="Size gross price"
                  value={size.grossPrice}
                  onChange={(e) =>
                    handleSizeChange(index, 'grossPrice', e.target.value)
                  }
                  className="flex-1 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                <input
                  type="number"
                  placeholder="Size price"
                  value={size.price}
                  onChange={(e) =>
                    handleSizeChange(index, 'price', e.target.value)
                  }
                  className="flex-1 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                <input
                  type="number"
                  placeholder="Size stock"
                  value={size.stock}
                  onChange={(e) =>
                    handleSizeChange(index, 'stock', e.target.value)
                  }
                  className="flex-1 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                <input
                  type="text"
                  placeholder="Size description"
                  value={size.description}
                  onChange={(e) =>
                    handleSizeChange(index, 'description', e.target.value)
                  }
                  className="flex-1 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => handleDeleteSize(index)}
                  className="bg-red-500 hover:bg-red-700 text-white p-2 rounded-lg ml-2"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-800 mb-2">
              Engravings
            </label>
            <button
              type="button"
              onClick={handleAddEngraving}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
            >
              <FaPlus className="mr-2" /> Add Engraving
            </button>
            {engravings.map((engraving, index) => (
              <div key={index} className="mt-2 flex flex-wrap">
                <input
                  type="text"
                  placeholder="Engraving type"
                  value={engraving.type}
                  onChange={(e) =>
                    handleEngravingChange(index, 'type', e.target.value)
                  }
                  className="flex-1 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                <input
                  type="number"
                  placeholder="Engraving gross price"
                  value={engraving.grossPrice}
                  onChange={(e) =>
                    handleEngravingChange(index, 'grossPrice', e.target.value)
                  }
                  className="flex-1 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                <input
                  type="number"
                  placeholder="Engraving price"
                  value={engraving.price}
                  onChange={(e) =>
                    handleEngravingChange(index, 'price', e.target.value)
                  }
                  className="flex-1 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                <input
                  type="number"
                  placeholder="Engraving stock"
                  value={engraving.stock}
                  onChange={(e) =>
                    handleEngravingChange(index, 'stock', e.target.value)
                  }
                  className="flex-1 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                <input
                  type="text"
                  placeholder="Engraving description"
                  value={engraving.description}
                  onChange={(e) =>
                    handleEngravingChange(index, 'description', e.target.value)
                  }
                  className="flex-1 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => handleDeleteEngraving(index)}
                  className="bg-red-500 hover:bg-red-700 text-white p-2 rounded-lg ml-2"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-800 mb-2">
              Media Type
            </label>
            <select
              value={mediaType}
              onChange={(e) => setMediaType(e.target.value)}
              className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="none">None</option>
              <option value="text">Text</option>
              <option value="image">Image</option>
              <option value="both">Both</option>
            </select>
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

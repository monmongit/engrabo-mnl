import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import { createProduct } from '../../redux/action/product';
import { toast } from 'react-toastify';
import { RxCross1 } from 'react-icons/rx';
import { getAllCategories } from '../../redux/action/category';
import { FaPlus, FaTrash } from 'react-icons/fa';

const CreateProduct = ({ setOpen }) => {
  const { admin } = useSelector((state) => state.admin);
  const { success, error } = useSelector((state) => state.products);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.categories);

  const [images, setImages] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [details, setDetails] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [grossPrice, setGrossPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [discountPrice, setDiscountPrice] = useState('');
  const [stock, setStock] = useState('');
  const [sizes, setSizes] = useState([]);
  const [engravings, setEngravings] = useState([]);
  const [instructions, setInstructions] = useState('');
  const [mediaType, setMediaType] = useState('none');
  const [bundles, setBundles] = useState([]);

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

  const handleAddBundle = () => {
    setBundles([...bundles, { name: '', stock: '' }]);
  };
  const handleBundleChange = (index, field, value) => {
    const newBundles = bundles.map((bundle, i) => {
      if (i === index) {
        return { ...bundle, [field]: value };
      }
      return bundle;
    });
    setBundles(newBundles);
  };
  const handleDeleteBundle = (index) => {
    const newBundles = bundles.filter((_, i) => i !== index);
    setBundles(newBundles);
  };

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

  const handleSubmit = (e) => {
    e.preventDefault();
    const newForm = new FormData();
    images.forEach((image) => {
      newForm.set('images', image);
    });

    const defaultSize = sizes[0];
    const defaultEngraving = engravings[0];

    newForm.append('name', name);
    newForm.append(
      'description',
      defaultSize
        ? defaultSize.description
        : defaultEngraving
        ? defaultEngraving.description
        : description
    );
    newForm.append('details', details);
    newForm.append('category', category);
    newForm.append('tags', tags);
    newForm.append(
      'grossPrice',
      defaultSize
        ? defaultSize.grossPrice
        : defaultEngraving
        ? defaultEngraving.grossPrice
        : grossPrice
    );
    newForm.append(
      'originalPrice',
      defaultSize
        ? defaultSize.price
        : defaultEngraving
        ? defaultEngraving.price
        : originalPrice
    );
    newForm.append('discountPrice', discountPrice);
    newForm.append(
      'stock',
      defaultSize
        ? defaultSize.stock
        : defaultEngraving
        ? defaultEngraving.stock
        : stock
    );
    newForm.append('adminId', admin._id);
    newForm.append('instructions', instructions);
    newForm.append('sizes', JSON.stringify(sizes));
    newForm.append('engravings', JSON.stringify(engravings));
    newForm.append('bundles', JSON.stringify(bundles));
    newForm.append('mediaType', mediaType);

    dispatch(
      createProduct({
        name,
        description: defaultSize
          ? defaultSize.description
          : defaultEngraving
          ? defaultEngraving.description
          : description,
        details,
        category,
        tags,
        grossPrice: defaultSize
          ? defaultSize.grossPrice
          : defaultEngraving
          ? defaultEngraving.grossPrice
          : grossPrice,
        originalPrice: defaultSize
          ? defaultSize.price
          : defaultEngraving
          ? defaultEngraving.price
          : originalPrice,
        discountPrice,
        stock: defaultSize
          ? defaultSize.stock
          : defaultEngraving
          ? defaultEngraving.stock
          : stock,
        adminId: admin._id,
        images,
        instructions,
        sizes,
        engravings,
        bundles,
        mediaType,
      })
    );
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
        Create Product
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
              disabled={sizes.length > 0 || engravings.length > 0}
            ></textarea>
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-800 mb-2">
              Details <span className="text-red-500">*</span>
            </label>
            <textarea
              cols="30"
              required
              rows="8"
              name="details"
              value={details}
              className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Enter your product details..."
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
              <option value="Choose a category">Choose a category</option>
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
              disabled={sizes.length > 0 || engravings.length > 0}
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
              disabled={sizes.length > 0 || engravings.length > 0}
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
              disabled={sizes.length > 0 || engravings.length > 0}
            />
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-800 mb-2">
              Upload Images <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              required
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
                />{' '}
              </label>
              {images &&
                images.map((i) => (
                  <img
                    src={i}
                    key={i}
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
              Bundles
            </label>
            <button
              type="button"
              onClick={handleAddBundle}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
            >
              <FaPlus className="mr-2" /> Add Bundle
            </button>
            {bundles.map((bundle, index) => (
              <div key={index} className="mt-2 flex flex-wrap">
                <input
                  type="text"
                  placeholder="Bundle name"
                  value={bundle.name}
                  onChange={(e) =>
                    handleBundleChange(index, 'name', e.target.value)
                  }
                  className="flex-1 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                <input
                  type="number"
                  placeholder="Bundle stock"
                  value={bundle.stock}
                  onChange={(e) =>
                    handleBundleChange(index, 'stock', e.target.value)
                  }
                  className="flex-1 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => handleDeleteBundle(index)}
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
              value="Create"
              className="block w-full py-2 px-4 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded-lg cursor-pointer text-center mt-8"
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateProduct;

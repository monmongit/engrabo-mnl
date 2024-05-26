import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { createProduct } from "../../redux/action/product";
import { toast } from "react-toastify";
import { RxCross1 } from "react-icons/rx";
import { getAllCategories } from "../../redux/action/category";
import { Button } from "@mui/material/Button";
import { FaPlus, FaTrash } from "react-icons/fa";

const CreateProduct = ({ setOpen }) => {
  const { admin } = useSelector((state) => state.admin);
  const { success, error } = useSelector((state) => state.products);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.categories);

  const [images, setImages] = useState([]);
<<<<<<< HEAD
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [grossPrice, setGrossPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [discountPrice, setDiscountPrice] = useState('');
  const [stock, setStock] = useState('');
  const [sizes, setSizes] = useState([]); // Add state for sizes
  const [colors, setColors] = useState(''); // Add state for colors
  const [mediaType, setMediaType] = useState(''); // Add state for media type
  const [instructions, setInstructions] = useState('');
  const [personalization, setPersonalization] = useState('');
=======
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [grossPrice, setGrossPrice] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [stock, setStock] = useState("");
  const [sizes, setSizes] = useState([]);
  const [packaging, setPackaging] = useState([]);

  // for personalization purposes
  const [instructions, setIntructions] = useState("");

  // for personalization purposes
  const [personalization, setPersonalization] = useState("");
>>>>>>> d39bfceac9eaca282b8a641b4e1ede1fe3f05a3d
  const [dropdowns, setDropdowns] = useState([]);
  const [imageOptions, setImageOptions] = useState([]); // Add state for image options
  const [textOptions, setTextOptions] = useState([]); // Add state for text options

<<<<<<< HEAD
=======
  dropdowns.forEach((dropdown, index) => {
    console.log(`Dropdown ${index + 1}:`);
    console.log(`Name: ${dropdown.name}`);
    console.log(`Options: ${dropdown.options.join(", ")}`);
  });
>>>>>>> d39bfceac9eaca282b8a641b4e1ede1fe3f05a3d
  useEffect(() => {
    dispatch(getAllCategories());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
    if (success) {
      toast.success("Product created successfully");
      navigate("/dashboard-products");
      window.location.reload();
    }
  }, [dispatch, error, success, navigate]);

<<<<<<< HEAD
  const handleAddSize = () => {
    setSizes([...sizes, { name: '', price: '', description: '' }]);
=======
  // handlers to add sizes
  const handleAddSize = () => {
    setSizes([...sizes, { name: "", price: "" }]);
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

  // handlers for adding packaging
  const handleAddPackaging = () => {
    setPackaging([...packaging, { name: "", price: "" }]);
  };
  const handlePackagingChange = (index, field, value) => {
    const newPackaging = packaging.map((pack, i) => {
      if (i === index) {
        return { ...pack, [field]: value };
      }
      return pack;
    });
    setPackaging(newPackaging);
  };
  const handleDeletePackaging = (index) => {
    const newPackaging = packaging.filter((_, i) => i !== index);
    setPackaging(newPackaging);
  };

  // Handlers for Dropdowns
  const handleAddDropdown = () => {
    setDropdowns([...dropdowns, { name: "", options: [] }]);
>>>>>>> d39bfceac9eaca282b8a641b4e1ede1fe3f05a3d
  };

  const handleSizeChange = (index, field, value) => {
    const newSizes = sizes.map((size, i) => {
      if (i === index) {
<<<<<<< HEAD
        return { ...size, [field]: value };
=======
        return { ...dropdown, options: [...dropdown.options, ""] };
>>>>>>> d39bfceac9eaca282b8a641b4e1ede1fe3f05a3d
      }
      return size;
    });
    setSizes(newSizes);
  };

  const handleDeleteSize = (index) => {
    const newSizes = sizes.filter((_, i) => i !== index);
    setSizes(newSizes);
  };

  const handleAddImageOption = () => {
    setImageOptions([
      ...imageOptions,
      { name: '', price: '', description: '' },
    ]);
  };

  const handleImageOptionChange = (index, field, value) => {
    const newImageOptions = imageOptions.map((option, i) => {
      if (i === index) {
        return { ...option, [field]: value };
      }
      return option;
    });
    setImageOptions(newImageOptions);
  };

  const handleDeleteImageOption = (index) => {
    const newImageOptions = imageOptions.filter((_, i) => i !== index);
    setImageOptions(newImageOptions);
  };

  const handleAddTextOption = () => {
    setTextOptions([...textOptions, { name: '', price: '', description: '' }]);
  };

  const handleTextOptionChange = (index, field, value) => {
    const newTextOptions = textOptions.map((option, i) => {
      if (i === index) {
        return { ...option, [field]: value };
      }
      return option;
    });
    setTextOptions(newTextOptions);
  };

  const handleDeleteTextOption = (index) => {
    const newTextOptions = textOptions.filter((_, i) => i !== index);
    setTextOptions(newTextOptions);
  };

  const handleImageChange = (e) => {
    e.preventDefault();
    const files = Array.from(e.target.files);
<<<<<<< HEAD
=======
    console.log("create product files: ", files);

>>>>>>> d39bfceac9eaca282b8a641b4e1ede1fe3f05a3d
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
<<<<<<< HEAD

=======
  console.log(admin._id);
>>>>>>> d39bfceac9eaca282b8a641b4e1ede1fe3f05a3d
  const handleSubmit = (e) => {
    e.preventDefault();
    const newForm = new FormData();
    images.forEach((image) => {
      newForm.set("images", image);
    });
<<<<<<< HEAD
    newForm.append('name', name);
    newForm.append('description', description);
    newForm.append('category', category);
    newForm.append('tags', tags);
    newForm.append('grossPrice', grossPrice);
    newForm.append('originalPrice', originalPrice);
    newForm.append('discountPrice', discountPrice);
    newForm.append('stock', stock);
    newForm.append('adminId', admin._id);
    newForm.append('instructions', instructions);
    newForm.append('sizes', JSON.stringify(sizes));
    newForm.append('colors', JSON.stringify(colors.split(',')));
    newForm.append('mediaType', mediaType);
    newForm.append('imageOptions', JSON.stringify(imageOptions));
    newForm.append('textOptions', JSON.stringify(textOptions));
=======

    newForm.append("name", name);
    newForm.append("description", description);
    newForm.append("category", category);
    newForm.append("tags", tags);
    newForm.append("grossPrice", grossPrice);
    newForm.append("originalPrice", originalPrice);
    newForm.append("discountPrice", discountPrice);
    newForm.append("stock", stock);
    newForm.append("adminId", admin._id);
    newForm.append("intructions", instructions);
    newForm.append("dropdown", dropdowns);
    newForm.append("size", JSON.stringify(sizes));
    newForm.append("packaging", JSON.stringify(packaging));
>>>>>>> d39bfceac9eaca282b8a641b4e1ede1fe3f05a3d

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
        instructions,
        sizes,
        colors: colors.split(','),
        mediaType,
        dropdowns,
<<<<<<< HEAD
        imageOptions,
        textOptions,
=======
        sizes,
        packaging,
>>>>>>> d39bfceac9eaca282b8a641b4e1ede1fe3f05a3d
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
              name="price"
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
              name="price"
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
              name="price"
              value={discountPrice}
              className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              onChange={(e) => setDiscountPrice(e.target.value)}
              placeholder="Enter your product price with discount..."
            />
          </div>
<<<<<<< HEAD
=======

          {/* Sizes */}
          <div className="space-y-4">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
              type="button"
              onClick={handleAddSize}
            >
              <FaPlus className="mr-2" /> Add Size
            </button>
            {sizes.map((size, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={size.name}
                  placeholder={`Size Name ${index + 1}`}
                  onChange={(e) =>
                    handleSizeChange(index, "name", e.target.value)
                  }
                  className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                <input
                  type="number"
                  value={size.price}
                  placeholder={`Price ${index + 1}`}
                  onChange={(e) =>
                    handleSizeChange(index, "price", e.target.value)
                  }
                  className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                <button
                  className="bg-red-500 hover:bg-red-700 text-white p-2 rounded-lg"
                  type="button"
                  onClick={() => handleDeleteSize(index)}
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>

          {/* Packaging */}
          <div className="space-y-4">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
              type="button"
              onClick={handleAddPackaging}
            >
              <FaPlus className="mr-2" /> Add Packaging
            </button>
            {packaging.map((pack, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={pack.name}
                  placeholder={`Packaging Name ${index + 1}`}
                  onChange={(e) =>
                    handlePackagingChange(index, "name", e.target.value)
                  }
                  className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                <input
                  type="number"
                  value={pack.price}
                  placeholder={`Price ${index + 1}`}
                  onChange={(e) =>
                    handlePackagingChange(index, "price", e.target.value)
                  }
                  className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                <button
                  className="bg-red-500 hover:bg-red-700 text-white p-2 rounded-lg"
                  type="button"
                  onClick={() => handleDeletePackaging(index)}
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>

          {/* Product Stock */}
>>>>>>> d39bfceac9eaca282b8a641b4e1ede1fe3f05a3d
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
              name=""
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
                />{" "}
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
              Instruction For Personalization{" "}
              <span className="text-red-500">*</span>
            </label>
            <textarea
              cols="30"
              rows="8"
              name="description"
              value={instructions}
              className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Enter your personalization instructions..."
            ></textarea>
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-800 mb-2">
              Colors (comma separated)
            </label>
            <input
              type="text"
              value={colors}
              onChange={(e) => setColors(e.target.value)}
              className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter colors separated by commas"
            />
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
              <option value="">Choose a media type</option>
              <option value="text">Text</option>
              <option value="image">Image</option>
              <option value="both">Both</option>
            </select>
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
                  placeholder="Size price"
                  value={size.price}
                  onChange={(e) =>
                    handleSizeChange(index, 'price', e.target.value)
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
              Image Options
            </label>
            <button
              type="button"
              onClick={handleAddImageOption}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
            >
              <FaPlus className="mr-2" /> Add Image Option
            </button>
            {imageOptions.map((option, index) => (
              <div key={index} className="mt-2 flex flex-wrap">
                <input
                  type="text"
                  placeholder="Option name"
                  value={option.name}
                  onChange={(e) =>
                    handleImageOptionChange(index, 'name', e.target.value)
                  }
                  className="flex-1 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                <input
                  type="number"
                  placeholder="Option price"
                  value={option.price}
                  onChange={(e) =>
                    handleImageOptionChange(index, 'price', e.target.value)
                  }
                  className="flex-1 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                <input
                  type="text"
                  placeholder="Option description"
                  value={option.description}
                  onChange={(e) =>
                    handleImageOptionChange(
                      index,
                      'description',
                      e.target.value
                    )
                  }
                  className="flex-1 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => handleDeleteImageOption(index)}
                  className="bg-red-500 hover:bg-red-700 text-white p-2 rounded-lg ml-2"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-800 mb-2">
              Text Options
            </label>
            <button
              type="button"
              onClick={handleAddTextOption}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
            >
              <FaPlus className="mr-2" /> Add Text Option
            </button>
            {textOptions.map((option, index) => (
              <div key={index} className="mt-2 flex flex-wrap">
                <input
                  type="text"
                  placeholder="Option name"
                  value={option.name}
                  onChange={(e) =>
                    handleTextOptionChange(index, 'name', e.target.value)
                  }
                  className="flex-1 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                <input
                  type="number"
                  placeholder="Option price"
                  value={option.price}
                  onChange={(e) =>
                    handleTextOptionChange(index, 'price', e.target.value)
                  }
                  className="flex-1 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                <input
                  type="text"
                  placeholder="Option description"
                  value={option.description}
                  onChange={(e) =>
                    handleTextOptionChange(index, 'description', e.target.value)
                  }
                  className="flex-1 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => handleDeleteTextOption(index)}
                  className="bg-red-500 hover:bg-red-700 text-white p-2 rounded-lg ml-2"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
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

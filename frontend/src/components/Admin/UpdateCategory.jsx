import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  updateCategory,
  getCategoryDetails,
} from '../../redux/action/category';
import { toast } from 'react-toastify';
import { RxCross1 } from 'react-icons/rx';
import { AiOutlinePlusCircle } from 'react-icons/ai';

const UpdateCategory = ({ setOpen, categoryId }) => {
  const { admin } = useSelector((state) => state.admin);
  const { success, error, category } = useSelector((state) => state.categories);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [title, setTitle] = useState('');
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (categoryId) {
      dispatch(getCategoryDetails(categoryId));
    }
  }, [dispatch, categoryId]);

  useEffect(() => {
    if (category) {
      setTitle(category.title || '');
      setImage(category.images[0]?.url || null);
    }
  }, [category]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
    if (success) {
      toast.success('Category updated successfully');
      navigate('/dashboard-categories');
      setOpen(false);
      window.location.reload();
    }
  }, [dispatch, error, success, navigate, setOpen]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const base64Image =
      image instanceof File ? await convertToBase64(image) : image;

    const categoryData = {
      title,
      image: base64Image,
      adminId: admin._id,
    };

    dispatch(updateCategory(categoryId, categoryData));
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  return (
    <div className="800px:w-[30%] w-[90%] bg-[white] shadow h-[55vh] rounded-[4px] p-3 overflow-y-scroll hide-scrollbar">
      <div className="w-full flex justify-end">
        <RxCross1
          size={30}
          className="cursor-pointer"
          onClick={() => setOpen(false)}
        />
      </div>

      <h5 className="text-[30px] font-Poppins text-center text-[#171203]">
        Update Category
      </h5>

      <form onSubmit={handleSubmit}>
        <div>
          <label className="pb-2 text-[#171203]">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-[#9e8a4f] rounded-[3px] shadow-sm placeholder-[#9e8a4f] focus:outline-none focus:ring-brown-dark focus:border-brown-dark"
            placeholder="Enter category title..."
            required
          />
        </div>

        <div className="pt-2">
          <label htmlFor="upload" className="pb-2 text-[#171203]">
            Upload Image <span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            id="upload"
            className="hidden"
            onChange={handleImageChange}
            required={!image}
          />
          <div className="w-full flex items-center flex-wrap">
            <label htmlFor="upload" className="cursor-pointer">
              <AiOutlinePlusCircle size={30} className="mt-3" color="#555" />
            </label>
            {image && (
              <img
                src={image instanceof File ? URL.createObjectURL(image) : image}
                alt="Preview"
                className="h-[120px] w-[120px] object-cover m-2"
              />
            )}
          </div>
        </div>

        <div>
          <input
            type="submit"
            value="Update"
            className="appearance-none block w-full px-3 h-[35px] border !border-[#171203] text-center !text-[#171203] rounded-[3px] mt-8 cursor-pointer"
          />
        </div>
      </form>
    </div>
  );
};

export default UpdateCategory;

import React from 'react';
import { AiOutlineClose } from 'react-icons/ai';

const FilterModal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ">
      <div className="bg-white w-11/12 max-w-lg p-4 rounded-lg h-[50vh] overflow-y-scroll hide-scrollbar">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Filters</h2>
          <button onClick={onClose}>
            <AiOutlineClose size={24} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default FilterModal;

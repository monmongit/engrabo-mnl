import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import CanvasArea from "./CanvasArea";

/* 
 Things to do 
 - get all the product here (done)
 - allow user to select from the product (done )
 - allow user to  create canvas 
   - Type 
   - draw
   - Use selected product image in the canvas 
   - upload photo
 */

const UserCreateDesign = () => {
  const { allProducts, isLoading } = useSelector((state) => state.products);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isProductListVisible, setIsProductListVisible] = useState(true);

  const handleSelectProduct = (event) => {
    const productId = event.target.value;
    const product = products.find((product) => product._id === productId);
    setSelectedProduct(product);
    setIsProductListVisible(true); // Hide the product list panel after selection
  };

  useEffect(() => {
    setProducts(allProducts);
  }, [allProducts]);

  return (
    <div className="flex">
      <div className="flex flex-col">
        <SidePanel />

        {isProductListVisible && (
          <div className="w-64 bg-white border-l border-gray-300 p-4">
            <h1 className="text-xl font-bold mb-4">Product List</h1>
            <select
              onChange={handleSelectProduct}
              defaultValue=""
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="" disabled>
                Select a product
              </option>
              {products.map((product) => (
                <option key={product._id} value={product._id}>
                  {product.name}
                </option>
              ))}
            </select>

            {selectedProduct && (
              <div className="mt-4">
                <h2 className="text-lg font-bold">Selected Product</h2>
                <p>Name: {selectedProduct.name}</p>
                <p>Description: {selectedProduct.description}</p>
                <p>Price: ${selectedProduct.originalPrice}</p>
                {selectedProduct.images &&
                  selectedProduct.images.length > 0 && (
                    <img
                      src={selectedProduct.images[0].url}
                      alt={selectedProduct.name}
                      className="w-full h-[170px] object-contain"
                    />
                  )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Display the Canvas */}
      <div className="border-solid">
        <CanvasArea />
      </div>
    </div>
  );
};

const SidePanel = () => {
  return (
    <div className="w-64 bg-gray-200 h-full p-4">
      <button className="w-full bg-blue-500 text-white py-2 rounded">
        Products
      </button>
    </div>
  );
};

export default UserCreateDesign;

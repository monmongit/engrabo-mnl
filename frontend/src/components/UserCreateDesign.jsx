import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import {
  Stage,
  Layer,
  Line,
  Text,
  Image as KonvaImage,
  Transformer,
} from "react-konva";

/* 
 Things to do 
 - get all the product here (done)
 - allow user to select from the product (done )
 - allow user to  create canvas 
   - Type 
   - draw (done)
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
    if (allProducts) {
      setProducts(allProducts);
      if (allProducts.length > 0) {
        setSelectedProduct(allProducts[0]);
      }
    }
  }, [allProducts]);

  console.log(products);

  return (
    <div className="flex h-full">
      <div className="flex flex-col h-full">
        <SidePanel className="h-full" />

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
              {products &&
                products.map((product) => (
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
      <div className="border-solid">
        <DrawingCanvas />
      </div>
      <div className="flex flex-col h-full">
        <SidePanel className="h-full" />

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
              {products &&
                products.map((product) => (
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

const OrderPanel = () => {
  return (
    <div className="w-64 bg-gray-200 h-full p-4">
      <button className="w-full bg-blue-500 text-white py-2 rounded">
        Products
      </button>
    </div>
  );
};

const DrawingCanvas = () => {
  const [tool, setTool] = useState("pen");
  const [lines, setLines] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [image, setImage] = useState(null);
  const [imageURL, setImageURL] = useState("");
  const stageRef = useRef(null);
  const [text, setText] = useState("");
  const [texts, setTexts] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const transformerRef = useRef(null);

  useEffect(() => {
    if (imageURL) {
      const img = new window.Image();
      img.onload = () => {
        setImage(img);
      };
      img.onerror = () => {
        console.error("Failed to load image");
        // Handle error here, such as showing a message to the user
      };
      img.src = imageURL;
    }
  }, [imageURL]);

  useEffect(() => {
    const stage = stageRef.current.getStage();
    const transformer = transformerRef.current;
    if (selectedId) {
      const selectedNode = stage.findOne(`#${selectedId}`);
      if (selectedNode) {
        transformer.nodes([selectedNode]);
        transformer.getLayer().batchDraw();
      }
    } else {
      transformer.nodes([]);
      transformer.getLayer().batchDraw();
    }
  }, [selectedId]);

  const handleMouseDown = (e) => {
    if (tool === "pen" || tool === "eraser") {
      setIsDrawing(true);
      const pos = e.target.getStage().getPointerPosition();
      setLines([...lines, { tool, points: [pos.x, pos.y] }]);
    }
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    let lastLine = lines[lines.length - 1];
    lastLine.points = lastLine.points.concat([point.x, point.y]);
    lines.splice(lines.length - 1, 1, lastLine);
    setLines(lines.concat());
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const handleTextAdd = (e) => {
    const stage = stageRef.current.getStage();
    const pointer = stage.getPointerPosition();
    setTexts([
      ...texts,
      { id: `text${texts.length}`, text, x: pointer.x, y: pointer.y },
    ]);
    setText("");
  };

  const handleTextDblClick = (e) => {
    const id = e.target.id();
    setSelectedId(id);
  };

  const handleTextChange = (e) => {
    const id = selectedId;
    const newText = e.target.text();
    setTexts(
      texts.map((textItem) =>
        textItem.id === id ? { ...textItem, text: newText } : textItem
      )
    );
  };

  const handleClear = () => {
    setLines([]);
    setTexts([]);
    setImage(null);
    setImageURL("");
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageURL(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelect = (e) => {
    setSelectedId(e.target.id());
  };

  const handleExport = () => {
    const stage = stageRef.current.getStage();
    const dataURL = stage.toDataURL();
    const link = document.createElement("a");
    link.download = "canvas.png";
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col items-start p-4 space-y-4">
      <div className="flex space-x-2">
        <button
          onClick={() => setTool("select")}
          className="bg-yellow-500 text-white px-4 py-2 rounded"
        >
          Select
        </button>
        <button
          onClick={() => setTool("pen")}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Draw
        </button>
        <button
          onClick={() => setTool("eraser")}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Erase
        </button>
        <button
          onClick={() => setTool("text")}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Text
        </button>
        <button
          onClick={handleClear}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Clear
        </button>
        {tool === "text" && (
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type text and click on canvas"
            className="border border-gray-300 px-4 py-2 rounded"
          />
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="bg-white border border-gray-300 px-4 py-2 rounded"
        />{" "}
        <button
          onClick={handleExport}
          className="bg-purple-500 text-white px-4 py-2 rounded"
        >
          Export
        </button>
      </div>
      <Stage
        // width={window.innerWidth}
        // height={window.innerHeight}
        width={900}
        height={400}
        onMouseDown={tool === "text" ? handleTextAdd : handleMouseDown}
        onMousemove={handleMouseMove}
        onMouseup={handleMouseUp}
        ref={stageRef}
        className=" bg-white border rounded border-black"
        onClick={handleSelect}
      >
        <Layer>
          {lines.map((line, i) => (
            <Line
              key={i}
              id={`line${i}`}
              points={line.points}
              stroke={line.tool === "pen" ? "black" : "white"}
              strokeWidth={5}
              tension={0.5}
              lineCap="round"
              globalCompositeOperation={
                line.tool === "eraser" ? "destination-out" : "source-over"
              }
            />
          ))}
          {texts.map((textItem, i) => (
            <Text
              key={i}
              id={textItem.id}
              text={textItem.text}
              x={textItem.x}
              y={textItem.y}
              fontSize={20}
              draggable
              onClick={handleSelect}
              onDblClick={handleTextDblClick}
              onChange={handleTextChange}
            />
          ))}
          {image && (
            <KonvaImage
              id="uploadedImage"
              image={image}
              x={50}
              y={50}
              draggable
              onClick={handleSelect}
            />
          )}
          <Transformer ref={transformerRef} />
        </Layer>
      </Stage>
    </div>
  );
};

export default UserCreateDesign;

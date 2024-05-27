import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import {
  Stage,
  Layer,
  Line,
  Text,
  Image as KonvaImage,
  Transformer,
} from 'react-konva';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import { server } from '../server';

const UserCreateDesign = ({ data }) => {
  const [tool, setTool] = useState('pen');
  const [lines, setLines] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [image, setImage] = useState(null);
  const [imageURL, setImageURL] = useState('');
  const stageRef = useRef(null);
  const [text, setText] = useState('');
  const [texts, setTexts] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const transformerRef = useRef(null);

  // cart and design
  const { cart } = useSelector((state) => state.cart);
  const [design, SetDesign] = useState(null);
  const [finalDesign, setFinalDesign] = useState(null);

  useEffect(() => {
    if (imageURL) {
      const img = new window.Image();
      img.onload = () => {
        setImage(img);
      };
      img.onerror = () => {
        console.error('Failed to load image');
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
    if (tool === 'pen' || tool === 'eraser') {
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
    setText('');
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
    setImageURL('');
  };

  const handleSelect = (e) => {
    setSelectedId(e.target.id());
  };

  const handleExport = () => {
    const stage = stageRef.current.getStage();
    const container = stage.container();
    container.style.backgroundColor = 'transparent';

    try {
      const dataURL = stage.toDataURL({ mimeType: 'image/png' });
      const link = document.createElement('a');
      link.download = 'canvas.png';
      link.href = dataURL;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error exporting canvas:', error);
    }
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

  const saveExportedImage = async () => {
    const stage = stageRef.current.getStage();
    const dataURL = stage.toDataURL({ mimeType: 'image/jpeg', quality: 1 });

    fetch(`${server}/custom/create-custom`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ canvasDataURL: dataURL }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('secure url: ', data.secureURL);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <div className="flex flex-col items-start p-4 space-y-4">
      <div className="flex space-x-2">
        <button
          onClick={() => setTool('select')}
          className="bg-yellow-500 text-white px-4 py-2 rounded"
        >
          Select
        </button>
        {(data.mediaType === 'both' || data.mediaType === 'text') && (
          <button
            onClick={() => setTool('pen')}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Draw
          </button>
        )}
        {data.mediaType !== 'image' && (
          <>
            <button
              onClick={() => setTool('text')}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Text
            </button>
            {tool === 'text' && (
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type text and click on canvas"
                className="border border-gray-300 px-4 py-2 rounded"
              />
            )}
          </>
        )}
        {data.mediaType !== 'text' && (
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="bg-white border border-gray-300 px-4 py-2 rounded"
          />
        )}
        <button
          onClick={handleClear}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Clear
        </button>
        <button
          onClick={handleExport}
          className="bg-purple-500 text-white px-4 py-2 rounded"
        >
          Export
        </button>
      </div>
      <button
        onClick={saveExportedImage}
        className="bg-green-500 text-white px-4 py-2 rounded"
      >
        Add the design
      </button>

      <Stage
        width={900}
        height={400}
        onMouseDown={tool === 'text' ? handleTextAdd : handleMouseDown}
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
              stroke={line.tool === 'pen' ? 'black' : 'white'}
              strokeWidth={5}
              tension={0.5}
              lineCap="round"
              globalCompositeOperation={
                line.tool === 'eraser' ? 'destination-out' : 'source-over'
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

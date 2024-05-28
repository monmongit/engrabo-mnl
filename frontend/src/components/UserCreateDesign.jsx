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
import { RxCross1 } from 'react-icons/rx';

import WebFont from 'webfontloader';
import axios from 'axios';
import { server } from '../server';

// Add the font families you want to use
const fontFamilies = [
  'Arial',
  'Times New Roman',
  'Courier New',
  'Georgia',
  'Verdana',
  'Tahoma',
  'Trebuchet MS',
  'Impact',
  'Comic Sans MS',
  'Lucida Console',
  'Lucida Sans Unicode',
  'Palatino Linotype',
  'Garamond',
  'Bookman',
  'Arial Black',
  'Narrow',
  'Roboto',
  'Open Sans',
  'Lato',
  'Montserrat',
  'Oswald',
  'Raleway',
  'Pacifico',
  'Playfair Display',
  'Merriweather',
  'Fjalla One',
  'Ubuntu',
  'PT Sans',
  'Droid Sans',
  'Lobster',
  'Bitter',
  'Anton',
  'Dancing Script',
  'Maven Pro',
  'Indie Flower',
  'Bangers',
  'Cabin',
  'Cinzel',
  'Comfortaa',
  'Cormorant Garamond',
  'Courgette',
  'Dosis',
  'Exo',
  'Fira Sans',
  'Frank Ruhl Libre',
  'Gloria Hallelujah',
  'Great Vibes',
  'Josefin Sans',
  'Kalam',
  'Karla',
  'Lobster Two',
  'Merriweather Sans',
  'Muli',
  'Nunito',
  'Oxygen',
  'Patua One',
  'Quicksand',
  'Righteous',
  'Russo One',
  'Satisfy',
  'Shadows Into Light',
  'Signika',
  'Source Code Pro',
  'Spectral',
  'Titillium Web',
  'Yanone Kaffeesatz',
  'Zilla Slab',
  'Mountains of Christmas',
  'Mr De Haviland',
  'Over the Rainbow',
  'Licorice',
  'Bilbo Swash Caps',
  'Comforter Brush',
  'Hachi Maru Pop',
  'Smooch',
  'Edu TAS Beginner',
  'Sevillana',
  'Dancing Script',
  'Jersey',
  'Jacquard',
  'Bodoni Moda',
  'Sacramento',
  'Rubik Bubbles',
  'Bad Script',

  // Add more fonts here if needed
];

const UserCreateDesign = ({ data, setDrawingInfo, setOpen }) => {
  const [tool, setTool] = useState('pen');
  const [lines, setLines] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [image, setImage] = useState(null);
  const [imageURL, setImageURL] = useState('');
  const stageRef = useRef(null);
  const [text, setText] = useState('');
  const [texts, setTexts] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [fontFamily, setFontFamily] = useState('Arial');
  const [fontStyle, setFontStyle] = useState('normal');
  const [textDecoration, setTextDecoration] = useState('');
  const transformerRef = useRef(null);

  const { cart } = useSelector((state) => state.cart);

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

  useEffect(() => {
    WebFont.load({
      google: {
        families: fontFamilies,
      },
    });
  }, []);

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
    
    if (lines.length === 0) return; // Ensure there's at least one line before proceeding
  
    let lastLine = lines[lines.length - 1];
    lastLine = {
      ...lastLine,
      points: lastLine.points.concat([point.x, point.y])
    };
    
    const newLines = lines.slice(0, lines.length - 1).concat(lastLine);
    setLines(newLines);
  };
  

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const handleTextAdd = (e) => {
    const stage = stageRef.current.getStage();
    const pointer = stage.getPointerPosition();
    setTexts([
      ...texts,
      {
        id: `text${texts.length}`,
        text,
        x: pointer.x,
        y: pointer.y,
        fontFamily,
        fontStyle,
        textDecoration,
      },
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
    const selectedText = texts.find((text) => text.id === e.target.id());
    if (selectedText) {
      setFontFamily(selectedText.fontFamily);
      setFontStyle(selectedText.fontStyle);
      setTextDecoration(selectedText.textDecoration);
    }
  };

  const handleExport = () => {
    const stage = stageRef.current.getStage();

    if (!stage) {
      console.error('Stage not found');
      return;
    }

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
    console.log('uploaded file: ', file);
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

    console.log('data url: ', dataURL);

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

  const handleFontFamilyChange = (e) => {
    const newFamily = e.target.value;
    setFontFamily(newFamily);
    setTexts(
      texts.map((textItem) =>
        textItem.id === selectedId
          ? { ...textItem, fontFamily: newFamily }
          : textItem
      )
    );
  };

  const toggleItalic = () => {
    const newFontStyle = fontStyle === 'italic' ? 'normal' : 'italic';
    setFontStyle(newFontStyle);
    setTexts(
      texts.map((textItem) =>
        textItem.id === selectedId
          ? { ...textItem, fontStyle: newFontStyle }
          : textItem
      )
    );
  };

  const toggleUnderline = () => {
    const newTextDecoration = textDecoration === 'underline' ? '' : 'underline';
    setTextDecoration(newTextDecoration);
    setTexts(
      texts.map((textItem) =>
        textItem.id === selectedId
          ? { ...textItem, textDecoration: newTextDecoration }
          : textItem
      )
    );
  };

  return (
    <div className="flex flex-col items-center p-4 space-y-4 bg-slate-500 rounded-md">
       <span className="w-full flex justify-end">
        <RxCross1
          size={30}
          className="cursor-pointer text-white-600 hover:text-gray-800"
          onClick={() => setOpen(false)}
        />
        </span>
      
      <div className="flex space-x-2">
        <button
          onClick={() => setTool('select')}
          className="bg-yellow-500 text-white px-4 py-2 rounded"
        >
          Select
        </button>
        <button
          onClick={() => setTool('pen')}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Draw
        </button>
        <button
          onClick={() => setTool('eraser')}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Erase
        </button>
        <button
          onClick={() => setTool('text')}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Text
        </button>
        <button
          onClick={handleClear}
          className="bg-gray-700 text-white px-4 py-2 rounded"
        >
          Clear
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
        <button
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="bg-white border border-gray-300 px-4 py-2 rounded w-50%"
        >
          Upload
        </button>


        <button
          onClick={handleExport}
          className="bg-purple-500 text-white px-4 py-2 rounded"
        >
          Export
        </button>
      </div>
      {selectedId && (
        <div className="flex space-x-2">
          <label>
            Font Family:
            <select
              value={fontFamily}
              onChange={handleFontFamilyChange}
              className="border border-gray-300 px-2 py-1 rounded"
              style={{ fontFamily }}
            >
              {fontFamilies.map((family) => (
                <option
                  key={family}
                  value={family}
                  style={{ fontFamily: family }}
                >
                  {family}
                </option>
              ))}
            </select>
          </label>
          <button
            onClick={toggleItalic}
            className="bg-gray-300 text-black px-2 py-1 rounded"
          >
            <em>I</em>
          </button>
          <button
            onClick={toggleUnderline}
            className="bg-gray-300 text-black px-2 py-1 rounded"
          >
            <u>U</u>
          </button>
        </div>
      )}
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
        className="bg-white border rounded border-black"
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
              fontFamily={textItem.fontFamily}
              fontStyle={textItem.fontStyle}
              textDecoration={textItem.textDecoration}
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

import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import {
  Stage,
  Layer,
  Line,
  Text,
  Image as KonvaImage,
  Transformer,
  Rect,
  Circle,
  Arrow,
  Star,
  RegularPolygon,
  Path,
} from 'react-konva';
import { RxCross1 } from 'react-icons/rx';

import WebFont from 'webfontloader';
import axios from 'axios';
import { server } from '../server';
import { toast } from 'react-toastify';

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

const drawHeartPath = (x1, y1, x2, y2) => {
  const width = x2 - x1;
  const height = y2 - y1;
  const startX = x1 + width / 2;
  const startY = y1 + height / 4;

  return `
    M${startX},${startY}
    C${startX + width / 2},${startY - height / 2},
    ${startX + width * 1.5},${startY + height / 3},
    ${startX},${startY + height}
    C${startX - width * 1.5},${startY + height / 3},
    ${startX - width / 2},${startY - height / 2},
    ${startX},${startY}
  `;
};

const UserCreateDesign = ({ data, setDrawingInfo, setOpen, setUrls }) => {
  const [tool, setTool] = useState('select');
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
  const [fontSize, setFontSize] = useState(20);
  const [shapes, setShapes] = useState([]);
  const [pages, setPages] = useState([
    { id: 0, lines: [], shapes: [], texts: [], image: null, imageProps: {} },
  ]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const transformerRef = useRef(null);
  const fileInputRef = useRef(null);
  const [tempShape, setTempShape] = useState(null);
  const [saveMessage, setSaveMessage] = useState('');

  const { cart } = useSelector((state) => state.cart);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 800);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 800);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isToolCollapsed, setIsToolCollapsed] = useState(true);
  const [selectedTools, setTools] = useState('');

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };
  const toggleToolsCollapse = () => {
    setIsToolCollapsed(!isToolCollapsed);
  };

  const getButtonClass = (tool) => {
    return selectedTools === tool ? 'bg-blue-500' : 'bg-gray-500';
  };

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

  const saveCurrentPage = () => {
    const stage = stageRef.current.getStage();
    const imageNode = stage.findOne('#uploadedImage');
    const currentPage = {
      id: currentPageIndex,
      lines: [...lines],
      shapes: [...shapes],
      texts: [...texts],
      image,
      imageProps: imageNode
        ? {
            x: imageNode.x(),
            y: imageNode.y(),
            width: imageNode.width(),
            height: imageNode.height(),
            scaleX: imageNode.scaleX(),
            scaleY: imageNode.scaleY(),
          }
        : {},
    };
    const updatedPages = pages.map((page, index) =>
      index === currentPageIndex ? currentPage : page
    );
    setPages(updatedPages);
  };

  const loadPage = (index) => {
    const page = pages[index];
    setLines(page.lines);
    setShapes(page.shapes);
    setTexts(page.texts);
    setImage(page.image);
    setCurrentPageIndex(index);
  };

  const handleMouseDown = (e) => {
    e.evt.preventDefault();
    if (tool === 'pen' || tool === 'eraser') {
      setIsDrawing(true);
      const pos = e.target.getStage().getPointerPosition();
      setLines([...lines, { tool, points: [pos.x, pos.y] }]);
    } else if (
      [
        'rectangle',
        'circle',
        'line',
        'arrow',
        'star',
        'polygon',
        'heart',
      ].includes(tool)
    ) {
      const pos = e.target.getStage().getPointerPosition();
      setShapes([...shapes, { tool, points: [pos.x, pos.y, pos.x, pos.y] }]);
      setTempShape({ tool, points: [pos.x, pos.y, pos.x, pos.y] });
      setIsDrawing(true);
    }
  };

  const handleMouseMove = (e) => {
    e.evt.preventDefault();
    if (!isDrawing) return;
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();

    if (tool === 'pen' || tool === 'eraser') {
      let lastLine = lines[lines.length - 1];
      lastLine.points = lastLine.points.concat([point.x, point.y]);
      lines.splice(lines.length - 1, 1, lastLine);
      setLines(lines.concat());
    } else if (
      [
        'rectangle',
        'circle',
        'line',
        'arrow',
        'star',
        'polygon',
        'heart',
      ].includes(tool)
    ) {
      let lastShape = shapes[shapes.length - 1];
      lastShape.points[2] = point.x;
      lastShape.points[3] = point.y;
      shapes.splice(shapes.length - 1, 1, lastShape);
      setShapes(shapes.concat());
      setTempShape({ ...lastShape });
    }
  };

  const handleMouseUp = (e) => {
    e.evt.preventDefault();
    setIsDrawing(false);
    setTempShape(null);
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
        fontSize,
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
    setShapes([]);
    setImage(null);
    setImageURL('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSelect = (e) => {
    setSelectedId(e.target.id());
    const selectedText = texts.find((text) => text.id === e.target.id());
    if (selectedText) {
      setFontFamily(selectedText.fontFamily);
      setFontStyle(selectedText.fontStyle);
      setTextDecoration(selectedText.textDecoration);
      setFontSize(selectedText.fontSize);
    }
  };

  const handleExport = async (index) => {
    const stage = stageRef.current.getStage();

    if (!stage) {
      console.error('Stage not found');
      return;
    }

    const container = stage.container();
    container.style.backgroundColor = 'white';

    try {
      const dataURL = stage.toDataURL({ mimeType: 'image/png' });

      const link = document.createElement('a');
      link.download = `canvas_page_${index + 1}.png`;
      link.href = dataURL;

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
    } catch (error) {
      console.error('Error exporting canvas:', error);
    }
  };

  const handleExportAll = async () => {
    for (let i = 0; i < pages.length; i++) {
      await loadPage(i);
      await new Promise((resolve) => setTimeout(resolve, 500));
      await handleExport(i);
    }
  };

  const saveToCartDesignAll = async (index) => {
    try {
      const stage = stageRef.current.getStage();
      const dataURL = stage.toDataURL({ mimeType: 'image/png', quality: 1 });

      console.log('data url: ', dataURL);

      const response = await fetch(`${server}/custom/create-custom`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ canvasDataURL: dataURL }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('secure url: ', data.secureURL);

      return data.secureURL;
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const saveToCartDesign = async () => {
    const urls = [];
    for (let i = 0; i < pages.length; i++) {
      await loadPage(i);
      await new Promise((resolve) => setTimeout(resolve, 500));
      const url = await saveToCartDesignAll(i);
      urls.push(url);
    }
    setUrls(urls);
    toast.success('Design added to cart successfully!');
    setOpen(false);
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

  const handleFontSizeChange = (e) => {
    const newSize = parseInt(e.target.value, 10);
    setFontSize(newSize);
    setTexts(
      texts.map((textItem) =>
        textItem.id === selectedId
          ? { ...textItem, fontSize: newSize }
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

  const addBlankPage = () => {
    saveCurrentPage();
    setPages([
      ...pages,
      {
        id: pages.length,
        lines: [],
        shapes: [],
        texts: [],
        image: null,
        imageProps: {},
      },
    ]);
    setCurrentPageIndex(pages.length);
    handleClear();
  };

  const deletePage = (index) => {
    saveCurrentPage();
    const updatedPages = pages.filter((_, i) => i !== index);
    setPages(updatedPages);
    setCurrentPageIndex(updatedPages.length - 1);
    if (updatedPages.length > 0) {
      const lastPage = updatedPages[updatedPages.length - 1];
      loadPage(updatedPages.length - 1);
    } else {
      handleClear();
    }
  };

  const selectPage = (index) => {
    saveCurrentPage();
    loadPage(index);
  };

  const handleSaveDesign = () => {
    saveCurrentPage();
    setSaveMessage('Your design is now saved.');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  return (
    <>
      <div
        className={`grid ${
          isMobile
            ? 'grid-cols-1 h-[90%] overflow-y-scroll'
            : 'grid-cols-2 lg:grid-cols-3'
        } p-4 bg-slate-500 rounded-md gap-2`}
      >
        <div
          className={`${
            isMobile ? 'order-last' : ''
          } flex flex-col border-solid`}
        >
          <span className="flex justify">
            <RxCross1
              size={30}
              className="cursor-pointer text-white-600 hover:text-gray-800"
              onClick={() => setOpen(false)}
            />
            Close
          </span>
          <div className="flex flex-col">
            <button
              onClick={toggleToolsCollapse}
              className="bg-gradient-to-r from-gray-800 to-gray-700 text-white px-4 py-2 rounded mb-2"
            >
              {isToolCollapsed ? 'Show Tools' : 'Hide Tools'}
            </button>

            <div
              className={`transition-all duration-300 overflow-y-auto z-10 ${
                isToolCollapsed ? 'max-h-0' : 'max-h-40'
              }`}
            >
              {(data.mediaType === 'both' || data.mediaType === 'text') && (
                <div className="grid grid-cols-1 mb-2 space-y-2">
                  <button
                    onClick={() => setTool('text')}
                    className={`${getButtonClass(
                      'text'
                    )} bg-gray-700 text-white px-4 py-2 rounded`}
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
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 mb-4">
                <button
                  onClick={() => setTool('select')}
                  className={`${getButtonClass(
                    'select'
                  )} bg-gray-700 text-white px-4 py-2 rounded`}
                >
                  Select
                </button>
                <button
                  onClick={() => setTool('pen')}
                  className={`${getButtonClass(
                    'pen'
                  )} bg-gray-700 text-white px-4 py-2 rounded`}
                >
                  Draw
                </button>
                <button
                  onClick={() => setTool('eraser')}
                  className={`${getButtonClass(
                    'eraser'
                  )} bg-gray-700 text-white px-4 py-2 rounded`}
                >
                  Erase
                </button>
                <button
                  onClick={handleClear}
                  className="bg-gray-700 text-white px-4 py-2 rounded"
                >
                  Clear
                </button>

                {(data.mediaType === 'both' || data.mediaType === 'image') && (
                  <button
                    className="bg-white border border-gray-300 px-4 py-2 rounded w-50%"
                    style={{ position: 'relative', overflow: 'hidden' }}
                  >
                    Upload
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </button>
                )}

                <button
                  onClick={handleExport}
                  className="bg-purple-700 text-white px-4 py-2 rounded"
                >
                  Export
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col">
            <button
              onClick={toggleCollapse}
              className="bg-gray-700 text-white px-4 py-2 rounded mb-2"
            >
              {isCollapsed ? 'Show Shapes' : 'Hide Shapes'}
            </button>

            <div className="overflow-y-auto max-h-20">
              <div
                className={`transition-all duration-300 ${
                  isCollapsed ? 'max-h-0 overflow-hidden' : 'max-h-full'
                }`}
              >
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <button
                    onClick={() => setTool('rectangle')}
                    className={`${getButtonClass(
                      'rectangle'
                    )} text-white px-4 py-2 rounded`}
                  >
                    Rectangle
                  </button>
                  <button
                    onClick={() => setTool('circle')}
                    className={`${getButtonClass(
                      'circle'
                    )} text-white px-4 py-2 rounded`}
                  >
                    Circle
                  </button>
                  <button
                    onClick={() => setTool('line')}
                    className={`${getButtonClass(
                      'line'
                    )} text-white px-4 py-2 rounded`}
                  >
                    Line
                  </button>
                  <button
                    onClick={() => setTool('arrow')}
                    className={`${getButtonClass(
                      'arrow'
                    )} text-white px-4 py-2 rounded`}
                  >
                    Arrow
                  </button>
                  <button
                    onClick={() => setTool('star')}
                    className={`${getButtonClass(
                      'star'
                    )} text-white px-4 py-2 rounded`}
                  >
                    Star
                  </button>
                  <button
                    onClick={() => setTool('polygon')}
                    className={`${getButtonClass(
                      'polygon'
                    )} text-white px-4 py-2 rounded`}
                  >
                    Polygon
                  </button>
                  <button
                    onClick={() => setTool('heart')}
                    className={`${getButtonClass(
                      'heart'
                    )} text-white px-4 py-2 rounded`}
                  >
                    Heart
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4">
            <div className="flex">
              <button
                onClick={addBlankPage}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Add Blank Page
              </button>
              <button
                onClick={handleExportAll}
                className="bg-purple-500 text-white px-4 py-2 rounded"
              >
                Export All Pages
              </button>
              <button
                onClick={handleSaveDesign}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Save Design
              </button>
            </div>
            <div className="overflow-y-auto max-h-40">
              <div className="grid grid-cols-2 gap-2 mt-4">
                {pages.map((page, index) => (
                  <div key={index} className="flex flex-col space-y-2">
                    <button
                      onClick={() => selectPage(index)}
                      className={`${
                        currentPageIndex === index
                          ? 'bg-yellow-500'
                          : 'bg-gray-300'
                      } text-white px-4 py-2 rounded`}
                    >
                      Page {index + 1}
                    </button>
                    <button
                      onClick={() => deletePage(index)}
                      className="bg-red-500 text-white px-4 py-2 rounded"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {saveMessage && (
              <div className="mt-4 p-2 bg-green-200 text-green-800 rounded">
                {saveMessage}
              </div>
            )}
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
                <label>
                  Font Size:
                  <input
                    type="number"
                    value={fontSize}
                    onChange={handleFontSizeChange}
                    className="border border-gray-300 px-2 py-1 rounded"
                    style={{ width: '60px' }}
                  />
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
          </div>

          <button
            onClick={saveToCartDesign}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Add Design to Order
          </button>
        </div>

        <div
          className={`${
            isMobile ? 'h-[60vh] overflow-y-scroll' : 'lg:col-span-2'
          }`}
        >
          <div className="h-full w-full overflow-hidden">
            <div className="h-full w-full relative">
              <Stage
                width={window.innerWidth * 0.9}
                height={window.innerHeight * 0.7}
                onMouseDown={tool === 'text' ? handleTextAdd : handleMouseDown}
                onTouchStart={tool === 'text' ? handleTextAdd : handleMouseDown}
                onMouseMove={handleMouseMove}
                onTouchMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onTouchEnd={handleMouseUp}
                ref={stageRef}
                className="bg-white border rounded border-black"
                onClick={handleSelect}
                onTap={handleSelect} // For touch devices
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
                        line.tool === 'eraser'
                          ? 'destination-out'
                          : 'source-over'
                      }
                    />
                  ))}
                  {shapes.map((shape, i) => {
                    if (shape.tool === 'rectangle') {
                      return (
                        <Rect
                          key={i}
                          id={`rect${i}`}
                          x={shape.points[0]}
                          y={shape.points[1]}
                          width={shape.points[2] - shape.points[0]}
                          height={shape.points[3] - shape.points[1]}
                          stroke="black"
                          draggable
                          onClick={handleSelect}
                          onTap={handleSelect} // For touch devices
                        />
                      );
                    } else if (shape.tool === 'circle') {
                      const radius = Math.sqrt(
                        Math.pow(shape.points[2] - shape.points[0], 2) +
                          Math.pow(shape.points[3] - shape.points[1], 2)
                      );
                      return (
                        <Circle
                          key={i}
                          id={`circle${i}`}
                          x={shape.points[0]}
                          y={shape.points[1]}
                          radius={radius}
                          stroke="black"
                          draggable
                          onClick={handleSelect}
                          onTap={handleSelect} // For touch devices
                        />
                      );
                    } else if (shape.tool === 'line') {
                      return (
                        <Line
                          key={i}
                          id={`line${i}`}
                          points={shape.points}
                          stroke="black"
                          strokeWidth={2}
                          lineCap="round"
                          draggable
                          onClick={handleSelect}
                          onTap={handleSelect} // For touch devices
                        />
                      );
                    } else if (shape.tool === 'arrow') {
                      return (
                        <Arrow
                          key={i}
                          id={`arrow${i}`}
                          points={shape.points}
                          stroke="black"
                          strokeWidth={2}
                          lineCap="round"
                          draggable
                          onClick={handleSelect}
                          onTap={handleSelect} // For touch devices
                        />
                      );
                    } else if (shape.tool === 'star') {
                      return (
                        <Star
                          key={i}
                          id={`star${i}`}
                          x={shape.points[0]}
                          y={shape.points[1]}
                          numPoints={5}
                          innerRadius={(shape.points[2] - shape.points[0]) / 2}
                          outerRadius={(shape.points[3] - shape.points[1]) / 2}
                          stroke="black"
                          draggable
                          onClick={handleSelect}
                          onTap={handleSelect} // For touch devices
                        />
                      );
                    } else if (shape.tool === 'polygon') {
                      return (
                        <RegularPolygon
                          key={i}
                          id={`polygon${i}`}
                          x={shape.points[0]}
                          y={shape.points[1]}
                          sides={6}
                          radius={Math.sqrt(
                            Math.pow(shape.points[2] - shape.points[0], 2) +
                              Math.pow(shape.points[3] - shape.points[1], 2)
                          )}
                          stroke="black"
                          draggable
                          onClick={handleSelect}
                          onTap={handleSelect} // For touch devices
                        />
                      );
                    } else if (shape.tool === 'heart') {
                      return (
                        <Path
                          key={i}
                          id={`heart${i}`}
                          data={drawHeartPath(
                            shape.points[0],
                            shape.points[1],
                            shape.points[2],
                            shape.points[3]
                          )}
                          stroke="black"
                          draggable
                          onClick={handleSelect}
                          onTap={handleSelect} // For touch devices
                        />
                      );
                    }
                    return null;
                  })}
                  {tempShape && ['line', 'arrow'].includes(tempShape.tool) && (
                    <Line
                      points={tempShape.points}
                      stroke="gray"
                      strokeWidth={2}
                      lineCap="round"
                      dash={[4, 4]}
                    />
                  )}
                  {tempShape && tempShape.tool === 'rectangle' && (
                    <Rect
                      x={tempShape.points[0]}
                      y={tempShape.points[1]}
                      width={tempShape.points[2] - tempShape.points[0]}
                      height={tempShape.points[3] - tempShape.points[1]}
                      stroke="gray"
                      dash={[4, 4]}
                    />
                  )}
                  {tempShape && tempShape.tool === 'circle' && (
                    <Circle
                      x={tempShape.points[0]}
                      y={tempShape.points[1]}
                      radius={Math.sqrt(
                        Math.pow(tempShape.points[2] - tempShape.points[0], 2) +
                          Math.pow(tempShape.points[3] - tempShape.points[1], 2)
                      )}
                      stroke="gray"
                      dash={[4, 4]}
                    />
                  )}
                  {tempShape && tempShape.tool === 'heart' && (
                    <Path
                      data={drawHeartPath(
                        tempShape.points[0],
                        tempShape.points[1],
                        tempShape.points[2],
                        tempShape.points[3]
                      )}
                      stroke="gray"
                      dash={[4, 4]}
                    />
                  )}
                  {texts.map((textItem, i) => (
                    <Text
                      key={i}
                      id={textItem.id}
                      text={textItem.text}
                      x={textItem.x}
                      y={textItem.y}
                      fontSize={textItem.fontSize}
                      fontFamily={textItem.fontFamily}
                      fontStyle={textItem.fontStyle}
                      textDecoration={textItem.textDecoration}
                      draggable
                      onClick={handleSelect}
                      onTap={handleSelect} // For touch devices
                      onDblClick={handleTextDblClick}
                      onDblTap={handleTextDblClick} // For touch devices
                      onChange={handleTextChange}
                    />
                  ))}
                  {image && (
                    <KonvaImage
                      id="uploadedImage"
                      image={image}
                      x={pages[currentPageIndex].imageProps.x || 50}
                      y={pages[currentPageIndex].imageProps.y || 50}
                      width={pages[currentPageIndex].imageProps.width || 200}
                      height={pages[currentPageIndex].imageProps.height || 200}
                      scaleX={pages[currentPageIndex].imageProps.scaleX || 1}
                      scaleY={pages[currentPageIndex].imageProps.scaleY || 1}
                      draggable
                      onClick={handleSelect}
                      onTap={handleSelect} // For touch devices
                    />
                  )}
                  <Transformer ref={transformerRef} />
                </Layer>
              </Stage>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserCreateDesign;

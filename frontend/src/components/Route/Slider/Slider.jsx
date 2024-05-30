import React, { useEffect, useState, useRef, useCallback } from 'react';
import './slider.css';
import { AiOutlineArrowLeft, AiOutlineArrowRight } from 'react-icons/ai';
import { sliderData } from './slider-data';
import { useNavigate } from 'react-router-dom';
import styles from '../../../styles/style';

const Slider = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurretSlide] = useState(0);
  const slideLength = sliderData.length;
  const autoScroll = true;
  const slideInterval = useRef();
  const intervalTime = 5000;

  const nextSlide = useCallback(() => {
    setCurretSlide((currentSlide) =>
      currentSlide === slideLength - 1 ? 0 : currentSlide + 1
    );
  }, [slideLength]);

  const prevSlide = useCallback(() => {
    setCurretSlide((currentSlide) =>
      currentSlide === 0 ? slideLength - 1 : currentSlide - 1
    );
  }, [slideLength]);

  useEffect(() => {
    setCurretSlide(0);
  }, []);

  useEffect(() => {
    if (autoScroll) {
      slideInterval.current = setInterval(nextSlide, intervalTime);
    }
    return () => clearInterval(slideInterval.current);
  }, [nextSlide, intervalTime, autoScroll]);

  return (
    <div className="slider">
      <AiOutlineArrowLeft className="arrow prev" onClick={prevSlide} />
      <AiOutlineArrowRight className="arrow next" onClick={nextSlide} />
      {sliderData.map((slide, index) => {
        return (
          <div
            key={index}
            className={index === currentSlide ? 'slide current' : 'slide'}
          >
            {index === currentSlide && (
              <>
                <img src={slide.image} alt="slide" />
                <div className="content ">
                  <span className="span1"></span>
                  <span className="span2"></span>
                  <span className="span3"></span>
                  <span className="span4"></span>
                  <h2>{slide.heading}</h2>
                  <p>{slide.desc}</p>
                  <hr />
                  <button
                    className={`${styles.button} z-20 relative hover:opacity-95 transition duration-300 ease-in-out`}
                    onClick={() => navigate('/products')}
                  >
                    Shop Now
                  </button>
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Slider;

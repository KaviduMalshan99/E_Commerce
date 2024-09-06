import React, { useState, useEffect, useRef } from 'react';
import Mainsrc1 from '../src/assets/home4.jpeg';
import Mainsrc2 from '../src/assets/home2.jpeg';
import Mainsrc3 from '../src/assets/home5.jpeg';
import Mainsrc4 from '../src/assets/home3.jpeg';
import MobileSrc1 from '../src/assets/mob-home1.png';
import MobileSrc2 from '../src/assets/mob-home2.png';
import MobileSrc3 from '../src/assets/mob-home3.png';
import MobileSrc4 from '../src/assets/mob-home4.png';
import './Slider.scss';

const desktopImages = [Mainsrc1, Mainsrc2, Mainsrc3, Mainsrc4];
const mobileImages = [MobileSrc1, MobileSrc2, MobileSrc3, MobileSrc4];

const Slider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const slideInterval = useRef(null);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth <= 1024;
  const images = isMobile ? mobileImages : desktopImages;

  useEffect(() => {
    if (!isPaused) {
      slideInterval.current = setInterval(() => {
        setCurrentSlide((prevSlide) => (prevSlide + 1) % images.length);
      }, 3000);
    }
    return () => clearInterval(slideInterval.current);
  }, [isPaused, images.length]);

  const handlePause = () => {
    setIsPaused(true);
  };

  const handlePlay = () => {
    setIsPaused(false);
  };

  const goToNextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % images.length);
  };

  const goToPrevSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide - 1 + images.length) % images.length);
  };

  return (
    <div className="slider" onMouseDown={handlePause} onMouseUp={handlePlay} onTouchStart={handlePause} onTouchEnd={handlePlay}>
      {images.map((image, index) => (
        <div
          key={index}
          className={`slide ${index === currentSlide ? 'active' : ''} ${index === images.length - 1 ? 'social' : ''}`}
          style={{ backgroundImage: `url(${image})` }}
        >
          {index === 3 && !isMobile && (
            <div className="social-icons desktop">
              <a href="https://www.facebook.com/share/JkhC5o8SXoMJ5yKj/?mibextid=qi2Omg" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="https://www.instagram.com/wellworn_sl?igsh=MXJkaTU0a25ldGp0YQ==" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          )}
          {index === 3 && isMobile && (
            <div className="social-icons mobile">
              <a href="https://www.facebook.com/share/JkhC5o8SXoMJ5yKj/?mibextid=qi2Omg" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="https://www.instagram.com/wellworn_sl?igsh=MXJkaTU0a25ldGp0YQ==" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          )}
        </div>
      ))}
      {!isMobile && (
        <>
          <button className="prev" onClick={goToPrevSlide}>❮</button>
          <button className="next" onClick={goToNextSlide}>❯</button>
        </>
      )}
    </div>
  );
};

export default Slider;

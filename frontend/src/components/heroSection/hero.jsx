import React, { useState, useEffect } from 'react';

import background1 from '../../assets/1.png';
import background2 from '../../assets/2.png';
import background3 from '../../assets/3.png';

const HeroSection = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const backgrounds = [
    background1,
    background2,
    background3
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === backgrounds.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden ">
      {/* Image Slider */}
      <div 
        className="flex transition-transform duration-1000 ease-in-out h-full"
        style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
      >
        {backgrounds.map((bg, index) => (
          <div 
            key={index}
            className="relative min-w-full h-full"
          >
            <img 
              src={bg}
              alt={`Background ${index + 1}`}
              className="w-full h-full object-cover"
            />
            {/* Dark overlay for better text visibility */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
          </div>
        ))}
      </div>

      {/* Content overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-10">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-white max-w-4xl drop-shadow-lg">
          Learn anything, anytime, anywhere
        </h1>
        <p className="text-lg md:text-xl text-white mb-8 max-w-2xl drop-shadow-md">
          Explore thousands of online courses from the best instructors
        </p>
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-300 shadow-lg">
          Get Started
        </button>
      </div>

      {/* Carousel indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
        {backgrounds.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              currentImageIndex === index ? 'bg-white w-4' : 'bg-white/50'
            }`}
            onClick={() => setCurrentImageIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSection;
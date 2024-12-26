import React from 'react';
import img from '../../assets/csmind.gif';

const About = () => {
  return (
    <div className=" min-h-screen w-full">
      <div className="container mx-auto px-4 py-12 md:py-16">
        
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16">
          
          <div className="w-full lg:w-1/2 max-w-2xl">
            <div className="relative  rounded-lg shadow-xl transform hover:scale-[1.02] transition-transform duration-300">
              <img 
                src={img}
                alt="Person working on computer with analytics" 
                className="w-full h-auto rounded-lg object-cover"
                loading="lazy"
              />
            </div>
          </div>
          
          
          <div className="w-full lg:w-1/2 max-w-2xl">
            <div className="space-y-6 px-4 lg:px-8">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center ">
                About CS Mind
              </h1>
              <p className="text-base md:text-lg lg:text-xl leading-relaxed text-center  text-gray-700">
                An e-learning platform. Our services vary from integrated interactive 
                education for people interested in acquiring new skills and many 
                training courses using the latest technologies, technology and 
                artificial intelligence to facilitate access to information in line 
                with the development of the era, technology and the Fourth 
                Industrial Revolution.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
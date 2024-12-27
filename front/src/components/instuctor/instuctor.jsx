import React from 'react';
import { Link } from 'react-router-dom';

const JoinInstructorSection = () => {
  const instructorBenefits = [
    'Flexible Schedule',
    'Global Reach',
    'Competitive Compensation',
    'Professional Growth',
    'Cutting-edge Platform'
  ];

  return (
    <div className="bg-white py-16 w-full">
      <h2 className="text-4xl font-bold text-gray-800 mb-4 px-4 text-center">
        Join Us as an Instructor
      </h2>
      <p className="text-lg text-gray-700 mb-8 px-4 text-center max-w-2xl mx-auto">
        Share your expertise, inspire learners, and be part of a dynamic educational community that empowers professionals worldwide.
      </p>

      <div className="flex flex-wrap gap-4 justify-center mb-8">
        {instructorBenefits.map((benefit, index) => (
          <div
            key={index}
            className="bg-white rounded-full px-6 py-3 shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <span className="text-blue-600">
              {benefit}
            </span>
          </div>
        ))}
      </div>

      <div className="text-center">
        <Link 
          to="/become-instructor" 
          className="inline-block bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition-colors duration-300 shadow-md hover:shadow-lg"
        >
          Become an Instructor
        </Link>
      </div>
    </div>
  );
};

export default JoinInstructorSection;
import React, { useState } from 'react';

import { useLocation, useNavigate, Link } from 'react-router-dom';
const CourseCard = ({ title, description, image, url }) => {
  const navigate = useNavigate();

  const renderImage = () => {
    switch (image) {
      case 'python':
        return (
          <div className="flex items-center space-x-2">
            <div className="w-12 h-12 bg-blue-500 rounded-full"></div>
            <div className="w-12 h-12 bg-yellow-500 rounded-full -ml-6"></div>
          </div>
        );
      case 'html':
        return (
          <div className="bg-orange-500 p-4 rounded-lg">
            <h2 className="text-4xl font-bold text-white">HTML5</h2>
          </div>
        );
      case 'java':
        return (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-red-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-2xl font-bold">Java</span>
            </div>
          </div>
        );
      case 'unity':
        return (
          <div className="bg-black p-4 rounded-lg">
            <span className="text-white text-2xl font-bold">Unity</span>
          </div>
        );
      case 'react':
        return (
          <div className="flex items-center justify-center">
            <div className="w-16 h-16 bg-blue-400 rounded-full flex items-center justify-center">
              <span className="text-white text-xl">React</span>
            </div>
          </div>
        );
      case 'flutter':
        return (
          <div className="flex items-center justify-center">
            <div className="w-16 h-16 bg-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-xl">Flutter</span>
            </div>
          </div>
        );
      default:
        return (
          <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
            <span className="text-gray-600 text-xl">DEV</span>
          </div>
        );
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-sm transform transition-all duration-300 hover:scale-105 hover:shadow-xl h-full flex flex-col">
      <a href={url} target="_blank" rel="noopener noreferrer" className="block">
        <div className="h-48 bg-white flex items-center justify-center p-4 transition-transform duration-300 hover:scale-95">
          {renderImage()}
        </div>
      </a>
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex-grow">
          <h3 className="text-xl font-bold mb-2 transition-colors duration-300 group-hover:text-blue-600 text-center">{title}</h3>
          <p className="text-gray-600 mb-4 text-center">{description}</p>
        </div>
        <div className="w-full flex justify-center mt-auto">
          <button 
         
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-md transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5">
            Enroll Now
          </button>
        </div>
      </div>
    </div>
  );
};

const CourseCatalog = () => {
  const [selectedFilter, setSelectedFilter] = useState('All');

  const featuredFilters = [
    { title: 'All', type: 'filter' },
    { title: 'Web Development', type: 'filter' },
    { title: 'Mobile Development', type: 'filter' },
    { title: 'Programming Languages', type: 'filter' },
    { title: 'Game Development', type: 'filter' }
  ];

  const allCourses = [
    {
      title: 'Game Development Courses',
      description: 'Learn to create immersive gaming experiences using Unity. Master game mechanics, graphics, and user interaction.',
      image: 'unity',
      url: '#',
      category: 'Game Development'
    },
    {
      title: 'HTML Courses',
      description: 'Master the fundamentals of web development with HTML5. Build modern, responsive websites.',
      image: 'html',
      url: '#',
      category: 'Web Development'
    },
    {
      title: 'Python Courses',
      description: 'Discover the power of Python programming. From basics to advanced concepts, data science, and AI.',
      image: 'python',
      url: '#',
      category: 'Programming Languages'
    },
    {
      title: 'JAVA Courses',
      description: 'Build robust applications with Java. Learn object-oriented programming, enterprise development, and more.',
      image: 'java',
      url: '#',
      category: 'Programming Languages'
    },
    {
      title: 'React Native',
      description: 'Build cross-platform mobile applications using React Native framework.',
      image: 'react',
      url: '#',
      category: 'Mobile Development'
    },
    {
      title: 'Flutter Development',
      description: 'Create beautiful native apps for iOS and Android using Flutter.',
      image: 'flutter',
      url: '#',
      category: 'Mobile Development'
    }
  ];

  const filteredCourses = selectedFilter === 'All' 
    ? allCourses 
    : allCourses.filter(course => course.category === selectedFilter);

  return (
    <div className="min-h-screen bg-white mt-10">
      {/* Header Section */}
      <div className="py-16 px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">
            Explore Our Programming Courses
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Start your journey into programming with our comprehensive courses. Learn from industry experts and build real-world projects.
          </p>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white py-8 w-full">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-8">
          Browse by Category
        </h2>
        <div className="flex flex-wrap gap-4 justify-center mb-8">
          {featuredFilters.map((filter, index) => (
            <button
              key={index}
              onClick={() => setSelectedFilter(filter.title)}
              className={`rounded-full px-6 py-3 transition-all duration-300 ${
                selectedFilter === filter.title
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-blue-600 shadow-md hover:shadow-lg'
              }`}
            >
              {filter.title}
            </button>
          ))}
        </div>
        <div className="text-center mt-12">
  <Link to="/courses">
    <button 
      className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 hover:shadow-xl"
    >
      Explore More Courses
    </button>
  </Link>
</div>
      </div>

      {/* Courses Grid Section */}
      <div className="max-w-6xl mx-auto px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course, index) => (
            <CourseCard
              key={index}
              title={course.title}
              description={course.description}
              image={course.image}
              url={course.url}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseCatalog;
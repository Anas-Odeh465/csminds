import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';

function StarRating({ totalStars = 5, initialRating = 5.7 }) {
  const [rating, setRating] = useState(5.7);

  const renderStars = () => {
    const stars = [];
    for (let i = 0; i < totalStars; i++) {
      const starClass = i < rating ? 'filled' : 'empty';
      stars.push(
        <span  key={i} className={starClass}>
          &#9733;
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="star-rating">
      <span className="rating-value">{rating}</span>&nbsp;&nbsp;
      {renderStars()}
      <span style={{fontSize:'12px'}} className='text-gray-500 pl-[5px] pt-[3px]'>{'(5,723)'}</span>
    </div>
  );
}
const CourseCard = ({ title, category, price, image, name }) => {
  const generateSlug = (text) => {
    if (!text) return "";
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "") 
      .replace(/\s+/g, "-")        
      .trim();                     
  };

  const handleViewCourse = () => {
    if (!title || !category) {
      console.error("Title or category is missing for this course: ", title, category);
      return;
    }
    const titleSlug = generateSlug(title);
    const categorySlug = generateSlug(category);
    const fullUrl = `/courses/${categorySlug}/${titleSlug}`;
    console.log("Navigating to:", fullUrl);
  };

  return (
    <div className="bg-white ml-[20px] rounded-lg shadow-lg overflow-hidden max-w-sm transform transition-all duration-300 hover:scale-105 hover:shadow-xl h-full flex flex-col">
      <div className="h-48 bg-white flex items-center justify-center">
        {image ? (
          <img src={`http://localhost:3307${image}`} width="270" alt="Course" />
        ) : (
          <p>Course not available</p>
        )} 
      </div>
      <div className="flex flex-col flex-grow p-2">
        <div className="flex-grow">
          <h3 className="text-base font-bold mt-[-20px] text-left">{title || "Untitled Course"}</h3>
          <h3 className="mt-[2px] text-gray-500 text-left" style={{ fontSize: "12px" }}>
            {name || "Unknown Author"}
          </h3>
          <p className="text-gray-800 font-bold mb-4 text-left">${price || "Free"}</p>
        </div>
        <div className="w-full flex justify-center mt-auto gap-7">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-md transition-all duration-300 hover:shadow-lg"
            onClick={handleViewCourse}
          >
            View course
          </button>
          <button
            className="bg-white border border-solid border-[1px] border-gray-400 hover:bg-gray-300 text-white font-semibold w-13 h-13 rounded-full transition-all duration-300 hover:shadow-lg"
            title="Add to cart"
          >
            <ShoppingCart className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </div>
    </div>
  );
};

const CourseCatalog = () => {
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [allCourses, setAllCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    axios.get('http://localhost:3307/api/courses')
      .then(response => {
        setAllCourses(response.data);
        setIsLoading(false);
        console.log("Fetched courses:", response.data);
      })
      .catch(error => {
        console.error("Error fetching courses:", error);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <p>Loading courses...</p>;
  }

  if (allCourses.length === 0) {
    return <div className='block p-6 border-2 border-dashed bg-gray-100 mt-10 mb-10'>
      <p className='text-center text-2xl font-bold'>No courses available!</p>
    </div>;
  }

  const featuredFilters = [
    { title: 'All', type: 'filter' },
    { title: 'Web Development', type: 'filter' },
    { title: 'Mobile Development', type: 'filter' },
    { title: 'Programming Languages', type: 'filter' },
    { title: 'Game Development', type: 'filter' },
    { title: 'IT & Software', type: 'filter' },
    { title: 'Design', type: 'filter' },
   /* { title: 'Marketing', type: 'filter' },
    { title: 'Business', type: 'filter' },
    { title: 'Office Productivity', type: 'filter' } */
  ];

  const filteredCourses = selectedFilter === 'All' ? allCourses
  : allCourses.filter(course => course.course_category === selectedFilter);

  return (
    <div className="min-h-screen bg-white ">
      <div className="py-16 px-8 text-center">
        <h1 className="text-4xl font-bold text-black mb-4">
          Explore Our Programming Courses
        </h1>
        <p className="text-xl text-gray-600">
          Start your journey into programming with our comprehensive courses.
        </p>
      </div>
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
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-blue-600 shadow-md'
              }`}
            >
              {filter.title}
            </button>
          ))}
        </div>
        <div className="text-center mt-12">
          <Link to="/courses">
            <button className="bg-blue-600 text-white py-4 px-8 rounded-full">
              Explore More Courses
            </button>
          </Link>
        </div>
      </div>
      <div className="text-left font-bold text-3xl mb-4 ml-6" style={{ fontFamily: 'TimesNewRoman ' }}>
          Learn and Search what ever you want
      </div>
      <div className="text-left font-bold text-2xl mt-4 ml-6">
          Recommended for you
      </div>
      <div className="max-w-5xl mx-auto px-14 ml-[10px] py-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {filteredCourses.map((course, index) => (
          <CourseCard
            key={index}
            title={course.course_title}
            price={course.course_pricing}
            image={course.course_picture}
            category={course.course_category}
            name={course.FullName}
          />
        ))}
      </div>
    </div>
  );
};
export default CourseCatalog;

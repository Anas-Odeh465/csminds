import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {  useLocation, useNavigate , Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../../context/CourseContext/cartContext';

function StarRating({ totalStars = 5, initialRating }) {
  const [rating, setRating] = useState('');

  useEffect(() => {
      setRating(initialRating);
  }, [initialRating]);

  const calculateStars = () => {
    return Math.round(rating / 10);
  };

  const renderStars = () => {
      const filledStars = calculateStars();
      const stars = [];
      for (let i = 0; i < totalStars; i++) {
          const starClass = i < filledStars ? 'filled' : 'empty';
          stars.push(
              <span key={i} className={starClass}>
                  &#9733;
              </span>
          );
      }
      return stars;
  };

  return (
      <div className="star-rating">
          <span className="rating-value text-gray-700">{rating}</span>&nbsp;&nbsp;
          {renderStars()}
          <span style={{ fontSize: '12px' }} className="text-gray-700 pl-[5px] pt-[3px]">
              ({rating} points)
          </span>
      </div>
  );
}

const Loading = () => {
  return (
    <div className="loading">
      Loading Courses
      <span className="dot dot1">.</span>
      <span className="dot dot2">.</span>
      <span className="dot dot3">.</span>
    </div>
  );
};
const CourseCard = ({ title, category, price, image, name, id, Email, Auth, ratingScore }) => {
  const navigate = useNavigate();
  const { cart, dispatch } = useCart();
  console.log('rating card: ', ratingScore)
  // id is course id not user
  const handleAddToCart = () => {
    if(id && Email) {
      axios.post('http://localhost:3307/api/saveUserCart', [id, Email])
      .then(response => {
        console.log(response.data.success);
        if(response.data.success === 'Course added to cart successfully') {
          console.log('Course added to cart successfully');
          location.reload(true); 
        }
        else if(response.data.error){
          alert('already Course added to cart');
        }
      })
      .catch(error => {console.log(error)});
      dispatch({
        type: 'ADD_TO_CART',
        payload: {
          id: id
        }
      });
    }
  };
  
  const handleViewCourseClick = () => {
    if (!title || !category) {
      console.error("Title or category is missing for this course: ", title, category);
      return;
    }window.scrollTo(0, 0);
    navigate(`/coursesDetailsPage?category=${encodeURIComponent(category)}&title=${encodeURIComponent(title)}&idc=${encodeURIComponent(id)}`);
  };

  return (
    <div className="bg-white ml-[20px] rounded-lg shadow-lg overflow-hidden max-w-sm transform transition-all duration-300 hover:scale-105 hover:shadow-xl h-full flex flex-col">
      <div className="h-48 bg-white flex items-center justify-center">
        {image ? (
          <img src={`http://localhost:3307${image}`} width="270" className='h-[150px]' alt="Course" />
        ) : (
          <p>Course not available</p>
        )} 
      </div>
      <div className="flex flex-col flex-grow p-2">
        <div className="flex-grow">
          <h3 className="text-base font-bold mt-[-20px] text-left">{title}</h3>
          <h3 className="mt-[2px] text-gray-500 text-left" style={{ fontSize: "12px" }}>
            {name}
          </h3>
          <StarRating totalStars={5} initialRating={ratingScore} />
          <p className="text-gray-800 font-bold mb-4 text-left">${price}</p>
        </div>
        <div className="w-full flex justify-center mt-auto gap-7">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-md transition-all duration-300 hover:shadow-lg"
            onClick={handleViewCourseClick}
          >
            View course
          </button>
          {Auth ?
            (price === 'Free' 
              ? (
                <button
                  className="bg-white border border-solid border-[1px] border-gray-400 focus:outline-none text-gray-400 font-semibold "
                  title="Add to cart"
                >
                 $ Free
                </button>
              ) :
              (
                <button onClick={handleAddToCart}
                  className="bg-white border border-solid text-gray-600 border-[1px] border-gray-600 hover:bg-gray-300 font-semibold w-13 h-13  transition-all duration-300 hover:shadow-lg"
                  title="Add to cart"
                >
                   <div className='flex flex-row'>
                       <ShoppingCart className='w-5 h-5'/>
                       <p className='text-sm ml-1'>Add</p>
                   </div>
                
                </button>
              )
            ) : (
              price === 'Free' 
                ? (
                  <button
                    className="bg-white border border-solid border-[1px] border-gray-400 focus:outline-none text-gray-400 font-semibold "
                    title="Add to cart"
                  >
                   $ Free
                  </button>
                ) :
                (
                  <button onClick={() => navigate('/login', {state: 'login'})}
                    className="bg-white border border-solid text-gray-600 border-[1px] border-gray-600 hover:bg-gray-300 font-semibold w-13 h-13  transition-all duration-300 hover:shadow-lg"
                    title="Add to cart"
                  >
                     <div className='flex flex-row'>
                         <ShoppingCart className='w-5 h-5'/>
                         <p className='text-sm ml-1'>Add</p>
                     </div>
                  
                  </button>
                )
            ) 
          }
        </div>
      </div>
    </div>
  );
};

const CourseCatalog = () => {
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [allCourses, setAllCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [auth, setAuth] = useState(false);
  const [email, setEmail] = useState('');
  const { cart, dispatch } = useCart();

  axios.defaults.withCredentials = true;
  useEffect(() => {
    const fetchAuthStatus = async () => {
      try {
        const res1 = await axios.get('http://localhost:3307');
        
        if (res1.data && res1.data.FirstName) {
          setAuth(true);
          setEmail(res1.data.Email);
        } else {
          
          const res2 = await axios.get('http://localhost:3307/api/users/to');
          if (res2.data && res2.data.user) {
            setAuth(true);
            setEmail(res2.data.user.email);
          } else {
            setAuth(false);
          }
          
        }
      } catch (err) {
        console.error("Error fetching auth status:", err);
        setAuth(false);
      }
    };
  
    fetchAuthStatus();
  }, [auth]);
  
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
    return <Loading/>;
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
    { title: 'Data science', type: 'filter' },
    { title: 'Artificial intelligence', type: 'filter' },
  ];

  const filteredCourses = selectedFilter === 'All' ? allCourses
  : allCourses.filter(course => course.course_category === selectedFilter);

  return (
    <div className="min-h-screen bg-white ">
      <div className="py-16 px-8 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Explore Our Programming Courses 
        </h1>
        <p className="text-xl text-gray-600">
          Start your journey into programming with our comprehensive courses.
        </p>
      </div>
      <div className="bg-white py-8 w-full">
        <h2 className="text-3xl font-semibold text-center text-gray-700 mb-8">
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
      <div className="max-w-8xl mx-auto px-14 ml-[10px] py-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredCourses.map((course, index) => (
          <CourseCard
            key={index}
            title={course.course_title}
            price={course.course_pricing}
            image={course.course_picture}
            category={course.course_category}
            name={course.FullName}
            id={course.ID_course_specifier}
            Email={email}
            Auth={auth}
            ratingScore={course.course_evaluation > 0 ? course.course_evaluation : 0}
          />
        ))}
        
      </div>
    </div>
  );
};
export default CourseCatalog;

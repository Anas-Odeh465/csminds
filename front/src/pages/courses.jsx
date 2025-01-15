import React, { useState, useMemo, useEffect} from 'react';
import axios from 'axios';
import { Search, BookOpen, ShoppingCart } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CourseContext/cartContext';
// Explore courses page

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
    
  const handleAddToCart = () => {
    if(id && Email) {
      axios.post('http://localhost:3307/api/saveUserCart', [id, Email]).catch(error => {console.log(error)});
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
      console.error('Title or category is missing for this course: ', title, category);
      return;
    }window.scrollTo(0, 0);
    navigate(
      `/coursesDetailsPage?category=${encodeURIComponent(category)}&title=${encodeURIComponent(title)}&idc=${encodeURIComponent(id)}`
    );
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
          <h3 className="mt-[2px] text-gray-500 text-left" style={{ fontSize: '12px' }}>
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

const CoursesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [selectedPrice, setSelectedPrice] = useState('All');
  const [allCourses, setAllCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [auth, setAuth] = useState(false);
  const [email, setEmail] = useState('');

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
      .then((response) => {
        setAllCourses(response.data);
        setIsLoading(false);
        console.log('Fetched courses:', response.data);
      })
      .catch((error) => {
        console.error('Error fetching courses:', error);
        setIsLoading(false);
      });
  }, []);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const categoryFromURL = searchParams.get('category') || 'All';
  const searchFromURL = searchParams.get('search');
  console.log('Fetched courses', categoryFromURL);

  if(categoryFromURL){
    useEffect(() => {
      setSelectedCategory(categoryFromURL);
    }, [categoryFromURL]);
  }

  if(searchFromURL){
    useEffect(() => {
      setSearchQuery(searchFromURL);
    }, [searchFromURL]);
  }

  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];
  const priceRanges = ['All', 'Under $10', 'Under $5', '$5-$10', 'Free'];

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

  const filteredCourses = allCourses
    .filter((course) => {
      const matchesSearch =
        (course.course_title && course.course_title.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (course.course_description && course.course_description.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'All' || course.course_category === selectedCategory;
      const matchesPrice =
        selectedPrice === 'All' ||
        (selectedPrice === 'Under $10' && parseFloat(course.course_pricing) < 10) ||
        (selectedPrice === 'Under $5' && parseFloat(course.course_pricing) < 5) ||
        (selectedPrice === '$5-$10' && parseFloat(course.course_pricing) >= 5 && parseFloat(course.course_pricing) <= 10) ||
        (selectedPrice === 'Free' && course.course_pricing === 'Free');
      
      const matchesLevel = selectedLevel === 'All' || course.course_level === selectedLevel;
      console.log(`Course: ` + course.course_level);
      return matchesSearch && matchesCategory && matchesPrice && matchesLevel;
    });

  if (isLoading) {
    return <Loading />;
  }

  if (allCourses.length === 0) {
    return (
      <div className="block p-6 border-2 border-dashed bg-gray-100 mt-10 mb-10">
        <p className="text-center text-2xl font-bold">No courses available!</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 mt-16">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-12 text-center">
        <h1 className="text-4xl font-bold text-gray-700 mb-4">Explore Our Courses</h1>
        <p className="text-xl text-gray-600">Find the perfect course to advance your programming skills</p>
      </div>

      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex-1">
              <select
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {featuredFilters.map((filter) => (
                  <option key={filter.title} value={filter.title}>
                    {filter.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Level Filter */}
            <div className="flex-1">
              <select
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
              >
                {levels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Filter */}
            <div className="flex-1">
              <select
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedPrice}
                onChange={(e) => setSelectedPrice(e.target.value)}
              >
                {priceRanges.map((range) => (
                  <option key={range} value={range}>
                    {range}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="max-w-7xl mx-auto">
        {filteredCourses.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-semibold text-gray-900">No courses found</h3>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
        )}
      </div>
    </div>
  );
};

export default CoursesPage;


import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { FaFacebook, FaYoutube, FaLinkedin } from 'react-icons/fa';
import { ArrowLeft, BookOpen, ShoppingCart, LinkIcon, Play ,Clock, Book} from 'lucide-react';
import axios from 'axios';
import { UserAvatar_large }  from '../Profile/userAvat';
import x from '../../assets/twitter.png';
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

const CourseCard = ({ title, category, price, image, name, id, ratingScore }) => {
    const navigate = useNavigate(); 
    const { cart, dispatch } = useCart();
      
    const handleAddToCart = () => {
      dispatch({
        type: 'ADD_TO_CART',
        payload: {
          id: id
        }
      });
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
            <img src={`http://localhost:3307${image}`} width="270" alt="Course" />
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
               <StarRating totalStars={5} initialRating={ratingScore}/>
            <p className="text-gray-800 font-bold mb-4 text-left">${price}</p>
          </div>
          <div className="w-full flex justify-center mt-auto gap-7">
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-md transition-all duration-300 hover:shadow-lg"
              onClick={handleViewCourseClick}
            >
              View course
            </button>
            {price === 'Free' 
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
            }
          </div>
        </div>
      </div>
    );
};

function InstructorProfile() {
    const [courseInstructorData, setCourseInstructorData] = useState(null);
    const [allInstructorsCources, setAllInstructorsCources] = useState(null);
    const [totalRecords, setTotalRecords] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const courseId = queryParams.get('idc');
    const Instructor_user_courseID = queryParams.get('insIdc');

if(courseId){
    useEffect(() => {
        axios.get(`http://localhost:3307/api/courses?idc=${courseId}`)
            .then((response) => {
                setCourseInstructorData(response.data);
                setIsLoading(false);
                if(response.data){
                   axios.get(`http://localhost:3307/api/myinsCourses?instructorId=${Instructor_user_courseID}`)
                  .then((response) => {
                         setAllInstructorsCources(response.data);
                         setTotalRecords(response.data[0].totalRecords);
                         setIsLoading(false);
                   })
                    .catch((error) => {
                         console.error('Error fetching courses:', error);
                        setIsLoading(false);
                  });
                }
            })
            .catch((error) => {
                console.error('Error fetching course:', error);
                setIsLoading(false);
            });
        }, [courseId]);
        if (isLoading) {
            return <Loading />;
        }
        
        if (!courseInstructorData) {
            return <div className="text-center mt-16">Course details or Instructor not found.</div>;
        }
       
        else{
            const { FullName, number_Learners, profileImage, biography, course_evaluation,
                headline, youtube, X, linkedin, website} = courseInstructorData;
            
            const filteredCourses = allInstructorsCources;   
            return (
                <div className="max-w-4xl py-12 px-4 sm:px-6 lg:px-8 mt-[80px] mx-auto p-5">
                    <div className="flex items-center sm:px-6 gap-16">
                        <div>
                            <h1 className="text-xl text-gray-500">
                                Instructor
                            </h1>
                            <h1 className="text-4xl font-bold w-[500px]" style={{ fontFamily: 'TimesNewRoman ' }}>
                                {FullName}, {headline}
                            </h1>
                            <h2 className="text-gray-500">{headline}</h2>
                            <span className="inline-block mt-2 bg-blue-100 text-blue-600 text-sm px-2 py-1 rounded-full">
                                CS Minds Instructor
                            </span>
                        </div>
                        <div className="w-48 h-48">
                            {profileImage == 'No photo available' ? (<UserAvatar_large firstName={FullName} />) : 
                              (<img src={`http://localhost:3307${profileImage}`} alt="profile picture" 
                                className="rounded-full w-full h-full object-cover" title={FullName} />) }
                                <div className="flex-col gap-8 mt-6">
                                    {website ? 
                                    (
                                            <a href={website} className="flex items-center gap-2 mt-2  px-4 py-2 border border-black text-gray-700 hover:text-gray-700 hover:bg-gray-200"> 
                                            <LinkIcon style={{ width: 19, height: 19 }}/> Website
                                            </a>
                                            ) : (''
                                    )}

                                    {X ? 
                                        (
                                        <a href={X} className="flex items-center gap-2  mt-2 px-4 py-2 border border-black text-gray-700 hover:text-gray-700 hover:bg-gray-200"> 
                                            <img src={x}  style={{ width: 19, height: 19 }}/>X
                                        </a>
                                        ) : (''
                                    )}

                                    {youtube ? 
                                    (
                                        <a href={youtube} className="flex items-center gap-2  mt-2 px-4 py-2 border border-black text-gray-700 hover:text-gray-700 hover:bg-gray-200"> 
                                            <FaYoutube  style={{ width: 19, height: 19 }}/> YouTube
                                        </a>
                                        ) : (''
                                    )}

                                    {linkedin ? 
                                    (
                                        <a href={linkedin} className="flex items-center gap-2  mt-2 px-4 py-2 border border-black text-gray-700 hover:text-gray-700 hover:bg-gray-200"> 
                                           <FaLinkedin style={{ width: 19, height: 19 }}/> LinkedIn
                                        </a>
                                        ) : (''
                                    )}
                                </div>
                        </div>
                    </div>
                    <div className="flex mt-6 gap-8  lg:px-8 mx-auto ">
                        <div>
                        <h3 className="text-2xl font-bold">{number_Learners}</h3>
                        <p className="text-gray-500">Total students</p>
                        </div>
                        <div>
                        <h3 className="text-2xl font-bold">{course_evaluation}</h3>
                        <p className="text-gray-500">Reviews</p>
                        </div>
                    </div>
                    <div className="mt-6 sm:px-6 lg:px-8 mt-8 mx-auto ">
                        <h2 className="text-xl font-semibold ">About me</h2>
                        <p className="text-gray-700 mt-3 flex w-[500px]">
                            {biography}
                        </p>
                        <h2 className="text-2xl text-left font-bold mt-10">My Courses {' '+ totalRecords}</h2>
                    </div>

                    <div className="bg-white rounded-lg shadow-lg p-6 ml-10 mb-[50px]">
                      <div className="space-y-6">
                            <div className="max-w-8xl mx-auto px-14 ml-[10px] py-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 gap-4 place-items-center">
                                  {(filteredCourses ?? []).map((course, index) => (
                                    <CourseCard
                                        key={index}
                                        title={course.course_title}
                                        price={course.course_pricing}
                                        image={course.course_picture}
                                        category={course.course_category}
                                        name={FullName}
                                        id={course.ID_course_specifier}
                                        ratingScore={course.course_evaluation > 0 ? course.course_evaluation : 0}
                                    />
                                  ))}
                            </div>
                      </div>
                  </div>
                </div>
            );     
        }     
}
else{
    return (
      <div className="flex items-center justify-center h-screen">
        <h1>Instructor not found!</h1>
        <Link to="/">
          <ArrowLeft className="w-6 h-6 text-blue-600" /> back to CS Minds
        </Link>
      </div>
    );  
  
}
};
export default InstructorProfile;

import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { UserAvatar_large } from '../components/Profile/userAvat';
import { ArrowLeft, BookOpen,  Play ,Clock, Book, CodeIcon, ShoppingCart, PercentDiamondIcon, StarIcon, LanguagesIcon, RotateCwSquareIcon, BarChart, Users, CheckCircle } from 'lucide-react';
import { useNavigate,  useLocation } from 'react-router-dom';
import { FaFacebook, FaYoutube, FaLinkedin } from 'react-icons/fa';
import { useCart } from '../context/CourseContext/cartContext';
import x from '../assets/twitter.png';

function StarRating({ totalStars = 5, initialRating }) {
    const [rating, setRating] = useState(initialRating);

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
            <span className="rating-value text-white">{rating}</span>&nbsp;&nbsp;
            {renderStars()}
            <span style={{ fontSize: '12px' }} className="text-white pl-[5px] pt-[3px]">
                {`(${' ' + rating + ' '} points)`}
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



const CourseDetailsPage = () => {
  const [courseData, setCourseData] = useState(null);
  const [courseQuizzes, setCourseQuizzes] = useState(null);
  const [courseAssignments, setCourseAssignments] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const videoRef = useRef(null);
  const targetRef = useRef(null);
  const [showVideo, setShowVideo] = useState(false);
  const [timeLimitReached, setTimeLimitReached] = useState(false);
  const { cart, dispatch } = useCart();
  const [auth, setAuth] = useState(false);
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const [totalRecords, setTotalRecords] = useState(0);
  const queryParams = new URLSearchParams(location.search);
  const courseId = queryParams.get('idc');

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
    if(courseId){
      axios.get(`http://localhost:3307/api/getAssignments/inCourses?idc=${courseId}`)
    .then(response => {
      setCourseAssignments(response.data);
      setIsLoading(false);
    }).catch(err =>{console.error("Error fetching quiz status:", err)});
    }
  },[courseId]);

  useEffect(() => {
    if(courseId){
        axios.get(`http://localhost:3307/api/getQuiz/inCouses?idc=${courseId}`)
      .then(response => {
        setCourseQuizzes(response.data);
        setIsLoading(false);
      }).catch(err =>{console.error("Error fetching quiz status:", err)});
    }
  },[courseId]);
  
  const handleScrollClick = () => {
    targetRef.current.scrollIntoView({
      behavior: 'smooth', 
      block: 'start',
    });
  };

  const handleImageClick = () => {
    setShowVideo(true);
  };

  useEffect(() => {
    if (showVideo && videoRef.current) {
      const handleTimeUpdate = () => {
        if (videoRef.current) {
          const currentTime = videoRef.current.currentTime;
          console.log("Current time:", currentTime);
          if (currentTime >= 300) {
            videoRef.current.pause();
            setTimeLimitReached(true);
            console.log("Time limit reached");
          }
        }
      };

      const videoElement = videoRef.current;
      videoElement.addEventListener("timeupdate", handleTimeUpdate);
      
      return () => {
        videoElement.removeEventListener("timeupdate", handleTimeUpdate);
      };
    }
  }, [showVideo]);


  
  
useEffect(() => {
  if(courseId){
  axios.get(`http://localhost:3307/api/courses?idc=${courseId}`)
  .then((response) => {
    setCourseData(response.data);
    setIsLoading(false);
  })
  .catch((error) => {
    console.error('Error fetching course:', error);
    setIsLoading(false);
  });
}
}, [courseId]);


  if (isLoading) {
    return <Loading />;
  }
  
  if (!courseData) {
    return <div className="text-center mt-16">Course details or Instructor not found.</div>;
  }

  const {
    outcome_1,
    outcome_2,
    outcome_3,
    outcome_4,
    requirement_1,
    requirement_2,
    requirement_3,
    requirement_4,
    course_category,
    course_title,
    course_description,
    studentsEnrolled,
    course_evaluation,
    FullName,
    user_courseID,
    Published_date,
    course_language,
    course_time,
    course_level,
    course_pricing,
    course_picture,
    number_Learners,
    video_course,
    profileImage,
    biography,
    headline,
    facebook,
    youtube,
    X,
    linkedin,
  } = courseData;

  if(courseData){
    axios.get(`http://localhost:3307/api/myinsCourses?instructorId=${user_courseID}`)
  .then((response) => {
          setTotalRecords(response.data[0].totalRecords);
          setIsLoading(false);
    })
    .catch((error) => {
          console.error('Error fetching courses:', error);
        setIsLoading(false);
  });
 }

  const outcomes = [outcome_1, outcome_2, outcome_3, outcome_4].filter(Boolean);
  const requirements = [requirement_1, requirement_2, requirement_3, requirement_4].filter(Boolean);

  const handleAddToCart = () => {
    if(courseId && email) {
      axios.post('http://localhost:3307/api/saveUserCart', [courseId, email]).catch(error => {console.log(error)});
      navigate('/cart');window.location.reload(true);
      dispatch({
        type: 'ADD_TO_CART',
        payload: {
          id: courseId
        }
      });
    }
  };

  const handleEnrollStudent = () => {
    if(email && courseId){
      axios.post('http://localhost:3307/api/newStudentEnrolled', [email, courseId])
      .then(response => { // done enrolled
        console.log(response);
      }).catch(err => {console.log(err)});
    }
  }

  const filteredQuizzes = Array.isArray(courseQuizzes) ? courseQuizzes : [];
  const filteredAssignment = Array.isArray(courseAssignments) ? courseAssignments : [];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 mt-8">
      {/* Course Header */}
      <div style={{ backgroundColor: '#1c1d1f' }} className="w-screen ml-[-40px] shadow-lg overflow-hidden mb-8">
        <p style={{ color: '#c0c4fc' }} className="font-bold flex ml-20 mt-8 text-xl">
          {course_category ? (<a style={{ color: '#c0c4fc' }} className='mr-2 cursor-pointer' onClick={(e) => navigate(`/courses?category=${encodeURIComponent(course_category)}`)}>{course_category}</a>) : ('Unknown course category') }{course_title ? (course_title.length > 40 ? " > " + course_title.slice(0, 40) + "...": " > " + course_title): ('not founded course category')}
        </p>
         <div className="p-8">
          <div className="flex flex-col md:flex-row items-start ml-20 gap-4">
            <div className="flex-1">
              <h1 className="text-3xl text-white font-bold mb-4">{course_title || 'Untitled Course'}</h1>
              <p className="text-white flex mb-6" style={{ fontSize: '20px' }}>{course_description || 'No description available.'}</p>
              <div className="flex flex-row items-start gap-2 mb-4">
                <StarRating className="text-white flex mb-4" totalStars={5} initialRating={course_evaluation} />
                <span className="text-white">{number_Learners || '-'} students</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 mb-4">
                <span className="text-white underline cursor-pointer" onClick={handleScrollClick}>Created by {FullName || 'Unknown Instructor'}</span>
              </div>
              <div className="flex items-center gap-4 mb-4">
                <Clock className="w-5 h-5 text-white" />
                <span className="text-white">Publication date: {' ' + Published_date || 'N/A'}</span>
                <LanguagesIcon className="w-5 h-5 text-white" />
                <span className="text-white">{course_language || 'N/A'}</span>
              </div>
            </div>
            {/* stick card */}
            <div className="flex-2 mt-[-70px] bg-white shadow-lg rounded-lg overflow-hidden max-w-sm  h-full flex flex-col">
              <div className="h-48 bg-white flex items-center justify-center rounded-lg">
                <div className='flex flex-col text-center'>
                  <div className="relative h-68 bg-white flex items-center justify-center">
                      {course_picture ? (
                        <div className=" flex-col" onClick={handleImageClick}>
                          <img
                            src={`http://localhost:3307${course_picture}`}
                            width="400"
                            alt="Course"
                            className={`transition-all duration-300 h-[220px] ${showVideo ? 'blur-none hidden' : 'blur-base'}`}
                          />
                          {!showVideo && (
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                              <Play className="w-[40px] h-[40px] text-white cursor-pointer" />
                            </div>
                          )}
                          {showVideo && (
                            <video
                              ref={videoRef}
                              src={`http://localhost:3307${video_course}`}
                              width="400"
                              controls={!timeLimitReached}
                              controlsList="nodownload"
                              className="shadow-lg mt-4 cursor-pointer"
                            />
                          )}
                          {timeLimitReached ? (
                            <p className="text-center text-gray-500  mb-18">Video time limit (5 minutes)</p>
                          ) : ('')}
                          
                        </div>
                      ) : (
                        <p>Course not available</p>
                      )} 
                    </div>
                </div>
              </div>
                <div className="flex flex-col flex-grow p-2 ">
                  <div className="flex-grow">
                    <h3 className="mt-[15px] font-bold gap-2 ml-5 text-2xl text-gray-800 text-left"style={{ fontFamily: 'TimesNewRoman ' }}>
                       {course_pricing === 'Free' ? ('What you waiting for? Get the course for free') : ('Get the course and share it for free with your friend')} 
                    </h3>
                    <h3 className="mt-[2px]  gap-2 ml-5 text-sm text-gray-700 text-left">
                       {course_pricing === 'Free' ? ('Get course for free') : ('Get this course, plus 12,000+ of our top-rated courses, with Personal Plan')} 
                    </h3>
                    <p className="text-gray-800 font-bold mb-4 text-left mt-[2px] ml-5">${course_pricing}</p>
                  </div>
                  <div className="w-full flex justify-center mt-[-10px]">
                    {/* edit here */}


                    {auth ?
                    (
                      course_pricing === 'Free' 
                      ?(
                          <button onClick={(e) => 
                            {e.preventDefault(); 
                              handleEnrollStudent();
                              navigate(`/showcoursevideo?course=${encodeURIComponent(course_title)}&idc=${encodeURIComponent(courseId)}`);
                            }}
                            className="bg-blue-700 text-white flex gap-5 border border-solid border-[1px] border-gray-400 hover:bg-blue-500 font-semibold w-13 h-13  transition-all duration-300 hover:shadow-lg"
                            title="Add to cart"
                            >Go to course
                            <BookOpen className="w-5 h-5 text-white mt-1" />
                          </button>
                      ) : (
                          <button onClick={handleAddToCart}
                            className="bg-blue-700 text-white flex gap-5 border border-solid border-[1px] border-gray-400 hover:bg-blue-500 font-semibold w-13 h-13  transition-all duration-300 hover:shadow-lg"
                            title="Add to cart"
                          >Go to cart
                            <ShoppingCart className="w-5 h-5 text-white-700 mt-1" />
                          </button>
                    )): (
                      course_pricing === 'Free' 
                      ?(
                          <button onClick={() => navigate('/login', {state: 'login'})}
                            className="bg-blue-700 text-white flex gap-5 border border-solid border-[1px] border-gray-400 hover:bg-blue-500 font-semibold w-13 h-13  transition-all duration-300 hover:shadow-lg"
                            title="Add to cart"
                            >Go to course
                            <BookOpen className="w-5 h-5 text-white mt-1" />
                          </button>
                      ) : (
                          <button onClick={() => navigate('/login', {state: 'login'})}
                            className="bg-blue-700 text-white flex gap-5 border border-solid border-[1px] border-gray-400 hover:bg-blue-500 font-semibold w-13 h-13  transition-all duration-300 hover:shadow-lg"
                            title="Add to cart"
                          >Go to cart
                            <ShoppingCart className="w-5 h-5 text-white-700 mt-1" />
                          </button>
                    ))
                  } 
                  </div>
                </div>
            </div>
         </div> 
      </div>
    </div>

      {/* Course Content */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Learning Outcomes */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold mb-6">Course outcome</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {outcomes.length > 0
                ? outcomes.map((outcome, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                      <span>{outcome}</span>
                    </div>
                  ))
                : 'No outcomes available.'}
            </div>
          </div>

          {/* Course requirements */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6">Course requirements</h2>
            <div className="space-y-6">
              {requirements.length > 0
                ? requirements.map((requirement, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <RotateCwSquareIcon className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                      <span>{requirement}</span>
                    </div>
                  ))
                : 'No outcomes available.'}
            </div>
          </div>

          {/* Course quizzes */}
          {filteredQuizzes.length > 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-6 mt-10">
             <h2 className="text-2xl font-bold mb-6">Course include</h2>
             <div className="space-y-6">
              {filteredQuizzes.length > 0
                ? filteredQuizzes.map((quiz, index) => (
                    <div key={index} className="flex flex-col items-start gap-3">
                      <div className='flex flex-row gap-2'>
                        <CodeIcon className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                        <span className="text-xl font-bold ">{quiz.quiz_title}</span>
                      </div>
                      <span>{quiz.quiz_description}</span>
                    </div>
                  ))
                : 'No course Quizzes available.'}
             </div>
          </div> ) : ('')}

          {filteredAssignment.length > 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-6 mt-10">
             <h2 className="text-2xl font-bold mb-6">Course include</h2>
             <div className="space-y-6">
              {filteredAssignment.length > 0
                ? filteredAssignment.map((assignment, index) => (
                    <div key={index} className="flex flex-col items-start gap-3">
                      <div className='flex flex-row gap-2'>
                        <CodeIcon className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                        <span className="text-xl font-bold ">{assignment.title}</span>
                      </div>
                      <span>{assignment.description}</span>
                    </div>
                  ))
                : 'No course assignment available.'}
             </div>
          </div> ) : ('')}

          <div className="bg-white rounded-lg shadow-lg p-6 mt-10">
            <h2 className="text-2xl font-bold mb-6" ref={targetRef}>Instructor</h2>
            <h2 className="text-xl font-bold ml-2 mb-2">{FullName}</h2>
            <div className="space-y-6">
              <div className='flex items-start gap-3'>
              {profileImage === 'No photo available' ? (<UserAvatar_large firstName={FullName} />) : 
                ( <img  src={`http://localhost:3307${profileImage}`} alt="Profile preview" className='cursor-pointer'
                style={{ width: '100px', display: 'block',
                height: '100px', borderRadius: '50%' , objectFit: 'cover' }} 
                onClick={(e) => navigate(`/instructorProfile?userName=${encodeURIComponent(FullName)}&idc=${encodeURIComponent(courseId)}&insIdc=${encodeURIComponent(user_courseID)}`)(window.scrollTo(0, 0))}/>)}
                <div className='flex flex-col gap-4'>
                  <div className='flex flex-row gap-2'> 
                  <Users className="w-5 h-5 text-gray-700" />
                    {number_Learners || '-'} students
                  </div>
                  <div className='flex flex-row gap-2'>
                    <StarIcon className="w-5 h-5 text-gray-700" />
                    {course_evaluation} Instructor rating points
                  </div>
                  <div className='flex flex-row gap-2'>
                    <PercentDiamondIcon className="w-5 h-5 text-gray-700" />
                    {totalRecords+ ' '}
                    Cources
                  </div>
                </div>
             </div>
                
             <div className='mt-10'>
                <span className='text-gray-700 text-2sm font-bold '>{headline}</span>
             </div>
             <div className='flex items-end gap-1'>
                   <span className='text-gray-600 text-xl'>{biography}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Side Panel */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
            <h3 className="text-xl font-bold mb-4">This course includes:</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-gray-400" />
                <span>{course_time || 'N/A'} of content</span>
              </div>
              <div className="flex items-center gap-3">
                <BarChart className="w-5 h-5 text-gray-400" />
                <span>{course_level || 'N/A'} level</span>
              </div>
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-gray-400" />
                <span>Access to student community</span>
              </div>
              <div className="flex items-center gap-3">
                <Book className="w-5 h-5 text-gray-400" />
                <span>Certificate of completion</span>
              </div>
            </div>
          </div>
        </div>

        
        
      </div>

      
    </div>
  );
};
export default CourseDetailsPage;

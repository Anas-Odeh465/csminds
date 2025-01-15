import React, { useEffect, useState } from 'react';
import { Plus, Book, Users, Trash2, AlertCircle, ActivityIcon, WorkflowIcon ,CodeIcon, DollarSign, MoreVertical, X } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

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

const InstructorDashboard = () => {
  const [allInstructorsCources, setAllInstructorsCources] = useState(null);
  const [courseQuizzes, setCourseQuizzes] = useState({});
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [courseAssignments, setCourseAssignments] = useState({});
  const [totalRecords, setTotalRecords] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [auth, setAuth] = useState(false);
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const navigate = useNavigate();

  axios.defaults.withCredentials = true;
  useEffect(() => {
    const fetchAuthStatus = async () => {
      try {
        const res1 = await axios.get('http://localhost:3307');
        if (res1.data && res1.data.FirstName) {
          setAuth(true);
          setFullName(res1.data.FirstName + ' ' + res1.data.LastName);
          setEmail(res1.data.Email);
        } else {
          const res2 = await axios.get('http://localhost:3307/api/users/to');
          if (res2.data && res2.data.user) {
            setAuth(true);
            setFullName(res2.data.user.given_name + ' ' + res2.data.user.family_name);
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
    if (email) { 
      axios.get(`http://localhost:3307/api/usersCheckINS?email=${email}`)
          .then((response) => {
              setAllInstructorsCources(response.data);
              setTotalRecords(response.data[0]?.totalRecords || 0);
              setIsLoading(false);
          })
          .catch((error) => {
              console.error('Error fetching courses:', error);
              setIsLoading(false);
          });
    }
  }, [email]);

  const filterIF_ARRAY = Array.isArray(allInstructorsCources) ? allInstructorsCources : [];

  useEffect(() => {
    if (filterIF_ARRAY && filterIF_ARRAY.length > 0) {
        const fetchData = async () => {
            try {
                const assignmentsPromises = filterIF_ARRAY.map(course =>
                    axios.get(`http://localhost:3307/api/getAssignments/inCourses?idc=${course.ID_course_specifier}`)
                );
                const quizzesPromises = filterIF_ARRAY.map(course =>
                    axios.get(`http://localhost:3307/api/getQuiz/inCouses?idc=${course.ID_course_specifier}`)
                );

                const assignmentsResponses = await Promise.all(assignmentsPromises);
                const quizzesResponses = await Promise.all(quizzesPromises);

                const assignmentsData = {};
                assignmentsResponses.forEach((response, index) => {
                    assignmentsData[filterIF_ARRAY[index].ID_course_specifier] = response.data;
                });

                const quizzesData = {};
                quizzesResponses.forEach((response, index) => {
                    quizzesData[filterIF_ARRAY[index].ID_course_specifier] = response.data;
                });

                setCourseAssignments(assignmentsData);
                setCourseQuizzes(quizzesData);
            } catch (err) {
                console.error("Error fetching assignments or quizzes:", err);
            }
        };

        fetchData();
    }
}, [filterIF_ARRAY]); 


  const handleDeleteCourse = (courseID) => {
    axios.get(`http://localhost:3307/api/deleteCourse?courseID=${courseID}&email=${email}`)
      .then((response) => {
      if(response){
        console.log(response);
        location.reload(true);
        setShowDeleteAlert(false);
      }
      }).catch((error) => { console.error('Error deleting courses:', error) });
  }

  const handleAddQuiz = (courseID) => {
    navigate(`/quizCreator?idc=${courseID}`)
  }

  const handleAddAssignment = (courseID) => {
    navigate(`/createAssignment?idc=${courseID}`)
  }

  if (isLoading) {
    return <Loading className='mt-[100px] mb-[100px]' />;
  }

  if (allInstructorsCources.length === 0) {
    return (
      <div className="text-center flex">
        <Book className='w-10 h-10'/>
        <h1>No courses found</h1>
        <p>You don't have any courses yet. Create a new course by clicking the button above.</p>
      </div>
    );
  } else {
    return (
      <div className="min-h-screen w-screen bg-gray-50 p-6 mt-[85px] mb-36">
        {/* Header */}
        <div className="max-w-7xl mx-auto mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 gap-3 flex">
                <Book className='w-10 h-10' /> My Courses ({totalRecords})
              </h1>
              <p className="text-gray-600 mt-1">Manage your courses and content</p>
            </div>
            <button
              onClick={() => navigate('/steps')}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-5 h-5" />
              Create New Course
            </button>
          </div>
        </div>

        {/* Course Grid */}
        {totalRecords === 0 ? (
          <div className="flex flex-col justify-center items-center text-center">
            <h1 className="text-3xl font-bold text-gray-900">No courses found</h1>
            <p className="text-gray-600 mt-1">Get Started and create a course</p>
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-8">
          <div className="lg:col-span-2">
            {filterIF_ARRAY.map((course, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-lg p-6 mb-4 flex items-start space-x-4"
              >
                <div className="w-58 h-44 bg-gray-100 flex items-center justify-center">
                  <img
                    src={`http://localhost:3307${course.course_picture}`}
                    alt={course.course_title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 p-2">
                  <div className='flex flex-row gap-5'>
                    <h3 className="text-xl font-semibold mb-2">{course.course_title}</h3>
                    <h3 className="text-xl font-semibold underline ml-5 mb-2">Quiz:</h3>
                    {Array.isArray(courseQuizzes[course.ID_course_specifier]) && courseQuizzes[course.ID_course_specifier].length > 0
                        ? courseQuizzes[course.ID_course_specifier].map((quiz, index) => (
                            <div key={index} className="flex flex-col items-start gap-3">
                                <div className='flex flex-row gap-2'>
                                    <CodeIcon className="w-5 h-5 text-blue-500 flex-shrink-0 mt-1" />
                                    <span className="text-md font-bold ">{quiz.quiz_title}</span>
                                </div>
                            </div>
                        ))
                        : <p></p>
                    }
                    
                  </div> 
                  <div className='flex flex-row gap-5 '>
                  <p className="text-gray-600 mb-2">By <strong>{fullName}</strong></p> 
                  <h3 className="text-xl font-semibold underline ml-60  mb-2">Assignment:</h3>
                    {Array.isArray(courseAssignments[course.ID_course_specifier]) && courseAssignments[course.ID_course_specifier].length > 0
                        ? courseAssignments[course.ID_course_specifier].map((assignment, index) => (
                            <div key={index} className="flex flex-col items-start gap-3">
                                <div className='flex flex-row gap-2'>
                                    <WorkflowIcon className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                                    <span className="text-md font-bold ">{assignment.title}</span>
                                </div>
                            </div>
                        ))
                        : <p></p>
                    }
                    
                  </div> 
                  
                  <StarRating totalStars={5} initialRating={course.course_evaluation} />
                  <div className="flex items-center justify-between mt-5">
                    <span className="text-2xl font-bold">${course.course_pricing}</span>
                    <button
                      onClick={() => handleAddQuiz(course.ID_course_specifier)}
                      className="text-blue-500 flex gap-4 hover:text-blue-700 transition-colors duration-200 hover:bg-gray-200"
                    >
                      Add Quiz Course
                      <CodeIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleAddAssignment(course.ID_course_specifier)}
                      className="text-green-500 flex gap-4 hover:text-green-700 transition-colors duration-200 hover:bg-gray-200"
                    >
                      Add Assignment Course
                      <WorkflowIcon className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => setShowDeleteAlert(true)}
                      className="text-red-500 flex gap-4 hover:text-red-700 transition-colors duration-200 hover:bg-gray-200"
                    >
                      Delete Course
                      <Trash2 className="w-5 h-5" />
                    </button>
                    {showDeleteAlert && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                      <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <div className="flex items-center gap-3 mb-4">
                          <AlertCircle className="w-6 h-6 text-red-600" />
                          <h3 className="text-xl font-semibold">Delete Course</h3>
                        </div>
                        <p className="text-gray-600 mb-6">
                          Are you sure you want to delete this Course? This action cannot be undone.
                        </p>
                        <div className="flex gap-4 justify-end">
                          <button
                            onClick={() => setShowDeleteAlert(false)}
                            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleDeleteCourse(course.ID_course_specifier)}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
};

export default InstructorDashboard;

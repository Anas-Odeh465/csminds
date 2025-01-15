import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Users, StarIcon, PercentDiamondIcon,WorkflowIcon, TimerIcon,  CheckIcon , CodeIcon, Send } from 'lucide-react';
import axios from 'axios';
import { UserAvatar_large, UserAvatarSmall } from '../components/Profile/userAvat';

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

const CourseVideoPlayer = () => {
  const [fullName, setFullName] = useState('');
  const [auth, setAuth] = useState(false);
  const [email, setEmail] = useState('');
  const [newComment, setNewComment] = useState('');
  const [photo, setPhoto] = useState('');
  const [courseData, setCourseData] = useState(null);
  const [courseQuizzes, setCourseQuizzes] = useState(null);
  const [courseAssignments, setCourseAssignments] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [totalRecords, setTotalRecords] = useState(0);
  const [comments, setComments] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [attemptsAssignment, setAttemptsAssignment] = useState([]);
  const targetRef = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const courseId = queryParams.get('idc');

  useEffect(() => {
    const fetchAuthStatus = async () => {
      try {
        const res1 = await axios.get('http://localhost:3307');
        
        if (res1.data && res1.data.FirstName) {
          setAuth(true);
          setFullName(res1.data.FirstName + ' ' + res1.data.LastName);
          setEmail(res1.data.Email);
          setPhoto(res1.data.photo);
        } else {
          const res2 = await axios.get('http://localhost:3307/api/users/to');
          if (res2.data && res2.data.user) {
            setAuth(true);
            setFullName(res2.data.given_name + ' ' + res2.data.family_name);
            setEmail(res2.data.Email);
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
  }, []);

  useEffect(() => {
    if (courseId) {
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

  useEffect(() => {
    axios.get(`http://localhost:3307/api/getQuiz/inCouses?idc=${courseId}`)
    .then(response => {
      setCourseQuizzes(response.data);
      setIsLoading(false);
    }).catch(err =>{console.error("Error fetching quiz status:", err)});
  });

  useEffect(() => {
    axios.get(`http://localhost:3307/api/getAssignments/inCourses?idc=${courseId}`)
    .then(response => {
      setCourseAssignments(response.data);
      setIsLoading(false);
    }).catch(err =>{console.error("Error fetching quiz status:", err)});
  });

  useEffect(() => {
    if (courseData) {
      axios.get(`http://localhost:3307/api/myinsCourses?instructorId=${courseData.user_courseID}`)
        .then((response) => {
          setTotalRecords(response.data[0].totalRecords);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching courses:', error);
          setIsLoading(false);
        });
    }
  }, [courseData]);

  useEffect(() => {
    if (courseId) {
      axios.get(`http://localhost:3307/api/get-global-messages?courseId=${courseId}`)
        .then((response) => {
          setComments(response.data);
          console.log('response.data: ', response.data);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching comments:', error);
          setIsLoading(false);
        });
    }
  }, [courseId]);

  useEffect(() => {
      axios.get(`http://localhost:3307/api/fetch/attempt?email=${email}`)
      .then(response => {
        setAttempts(response.data)
      }).catch(error => {console.error(error);});
  },[email]);

  useEffect(() => {
    axios.get(`http://localhost:3307/api/fetch/attempt/assignment?email=${email}`)
    .then(response => {
      setAttemptsAssignment(response.data)
    }).catch(error => {console.error(error);});
},[email]);

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    axios.post('http://127.0.0.1:4000/api/CommentsClassifier', { message: newComment })
      .then(response => {
        if (response) {
          axios.post('http://localhost:3307/api/postComment', [courseId, email, newComment, response.data.response, fullName, photo])
            .then(response => {
              console.log('Comment posted:', response.data);
            }).catch(error => { 
              console.log('Error posting comment:', error);
            });
        }
      })
      .catch(error => {
        console.error('Error classifying comment:', error);
      });

    const newCommentObj = {
      photo: photo,
      fullName: fullName,
      comment: newComment,
    };
    setComments([newCommentObj, ...comments]);
    setNewComment('');
  };

  if (isLoading) {
    return <Loading className="mt-[100px] mb-[100px]" />;
  }

  if (!courseData) {
    return <div className="text-center mt-16">Course details or Instructor not found.</div>;
  }

  const { course_title, course_description, studentsEnrolled, FullName, user_courseID, course_evaluation,
    number_Learners, video_course, profileImage, biography, headline } = courseData;

  const handleUserLearning = () => {
    console.log("see data: ", `Email: ${email}  courseID: ${courseId}`)
    axios.post('http://localhost:3307/api/postLearn', [courseId, email])
    .then(response => {
      console.log('Learn posted:', response.data);
    }).catch(error => { 
      console.log('Error posting Learn:', error);
    });
  }  

  const filteredQuizzes = Array.isArray(courseQuizzes) ? courseQuizzes : [];
  const filteredAssignment = Array.isArray(courseAssignments) ? courseAssignments : [];
  const quizAttempts = Array.isArray(attempts)? attempts : [];
  const assignmentAttempts = Array.isArray(attemptsAssignment)? attemptsAssignment : [];

  return (
    <>
      <div className="w-full bg-gray-50 mt-16 grid grid-cols-3 gap-6 ">
        {/* Video Player Section on the Left */}
        <div className="col-span-2 rounded-lg p-8 pt-16  " style={{ backgroundColor: '#1c1d1f' }}>
          <div className="relative aspect-video bg-gray-800 rounded-lg overflow-hidden ">
            <video
              src={`http://localhost:3307${video_course}`}
              alt="Video placeholder"
              className="w-full h-full object-cover cursor-pointer"
              controlsList="nodownload"
              onContextMenu={(e) => e.preventDefault()}
              onClick={(e) => handleUserLearning()}
              controls
            />
          </div>
          <div className="text-white py-4">
            <h1 className="text-2xl font-bold">{course_title}</h1>
            <p className="text-gray-300 mt-2">{course_description}</p>
          </div>
        </div>

        <div className="bg-white p-12 rounded-lg shadow-lg col-span-1">
          <h2 className="text-2xl font-bold mb-4">Comments</h2>
          <form onSubmit={handleAddComment} className="mb-4">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="w-full flex items-center gap-5 mt-2 bg-blue-500 text-white py-2 rounded-lg"
            >
              <Send className="w-4 h-4" />
              <p>Comment</p>
            </button>
          </form>

          {/* Display Comments */}
          <div className="space-y-4 max-h-96 overflow-y-auto ">
            {comments.length > 0 ? comments.map((comment, index) => (
              <div key={index} className="flex gap-4 items-start border-b pb-4">
                {/* Use comment's photo if available, otherwise use a default avatar */}
                {comment.photo !== 'No photo available' ? (
                  <img
                    src={`http://localhost:3307${comment.photo}`}
                    alt="User Avatar"
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <UserAvatarSmall firstName={comment.fullName} />
                )}
                <div>
                  <p className="font-bold">{comment.fullName}</p>
                  <p className="text-sm text-gray-700">{comment.comment}</p>
                </div>
              </div>
            )) : <p>No comments yet.</p>}
          </div>
        </div>
      </div>

      {/* Course quizzes */}
      {filteredQuizzes.length > 0 ? (
    <div className="space-y-4 bg-white mb-10">
        <h2 className="text-2xl font-bold mt-10 ml-5 mb-6">Course include Short exam:</h2>
        {filteredQuizzes.map((quiz, index) => {
            // Check if the quiz was attempted
            const isAttempted = quizAttempts.some((attempt) => Number(attempt.quiz_ID) === Number(quiz.quiz_id));
            const submittedQuiz = quizAttempts.find((attempt) => Number(attempt.quiz_ID) === Number(quiz.quiz_id));

            return (
                <div
                    onClick={() => !isAttempted && navigate(`/quizAttempPage?qiud=${quiz.quiz_id}&idc=${courseId}`)}
                    key={index}
                    className={`bg-white ml-10 w-2/3 rounded-lg border hover:border-gray-500 hover:shadow-lg cursor-pointer 
                        ${isAttempted ? 'cursor-not-allowed opacity-50' : ''}`}
                >
                    <div className="p-4">
                        <div className="flex items-center justify-between">
                            {/* Quiz Title and Description */}
                            <div className="flex items-center gap-4">
                                <div className="flex flex-col">
                                    <div className='flex flex-row gap-3'>
                                        <CodeIcon className="w-5 h-5 text-blue-500 flex-shrink-0 mt-1" />
                                        <h3 className="font-semibold text-lg">{quiz.quiz_title}</h3>
                                    </div>
                                    <p className="text-gray-600 text-sm">{quiz.quiz_description}</p>
                                </div>
                            </div>
                            {isAttempted ? (
                                <div className="flex flex-row gap-5">
                                    <p className="text-gray-600 text-md">Your score: {' '+ submittedQuiz.Mark}</p>
                                    <CheckIcon className="w-5 h-5 text-blue-500 flex-shrink-0 mt-1" />
                                </div>
                            ) : (
                              <div className="flex items-center gap-4">
                                  <span className="text-gray-500">Quiz limited time for {quiz.time_limit} minutes</span>
                                  <TimerIcon className="w-5 h-5 text-gray-400" />
                              </div>
                            )}
                            
                        </div>
                    </div>
                </div>
            );
        })}
    </div>
) : null}


{filteredAssignment.length > 0 ? (
    <div className="space-y-4 bg-white mb-10">
        <h2 className="text-2xl font-bold mt-10 ml-5 mb-6">Course include Short assignment:</h2>
        {filteredAssignment.map((assignment, index) => {
            // Check if the quiz was attempted
            const isAttempted = assignmentAttempts.some((attempt) => Number(attempt.assignment_id) === Number(assignment.assignment_id));
            const submittedAssignment = assignmentAttempts.find((attempt) => Number(attempt.assignment_id) === Number(assignment.assignment_id));

            return (
                <div
                    onClick={() => !isAttempted && navigate(`/studentPageAssignment?aiud=${assignment.assignment_id}&idc=${courseId}`)}
                    key={index}
                    className={`bg-white ml-10 w-2/3 rounded-lg border hover:border-gray-500 hover:shadow-lg cursor-pointer 
                        ${isAttempted ? 'cursor-not-allowed opacity-50' : ''}`}
                >
                    <div className="p-4">
                        <div className="flex items-center justify-between">
                            {/* Quiz Title and Description */}
                            <div className="flex items-center gap-4">
                                <div className="flex flex-col">
                                    <div className='flex flex-row gap-3'>
                                        <WorkflowIcon className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                                        <h3 className="font-semibold text-lg">{assignment.title}</h3>
                                    </div>
                                    <p className="text-gray-600 text-sm">{assignment.description}</p>
                                </div>
                            </div>
                            {isAttempted ? (
                                <div className="flex flex-row gap-5">
                                    <p className="text-gray-600 text-md">Submission state: {'   '+ '  ' + submittedAssignment.state_assignment	}</p>
                                    <CheckIcon className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                                </div>
                            ) : (
                              <div className="flex items-center gap-4">
                                <span className="text-gray-500">
                                      {new Date(assignment.submission_time) < new Date() ? (
                                          <span className="text-red-500">Assignment is overdue!</span>
                                      ) : (
                                          `Assignment limited time: ${new Date(assignment.submission_time).toLocaleDateString()}`
                                      )}
                                  </span>
                                    <TimerIcon className="w-5 h-5 text-gray-400" />
                              </div>
                            )}
                            
                        </div>
                    </div>
                </div>
            );
        })}
    </div>
) : null}

      <div className="w-full bg-white rounded-lg shadow-lg p-8  mb-20">
        <hr className='shadow-xl  mb-5'/>
        <h2 className="text-2xl font-bold mb-6" ref={targetRef}>Instructor</h2>
        <h2 className="text-xl font-bold ml-2 mb-2">{FullName}</h2>
        <div className="space-y-6">
          <div className="flex items-start gap-3">
            {profileImage === 'No photo available' ? (
              <UserAvatar_large firstName={FullName} />
            ) : (
              <img
                src={`http://localhost:3307${profileImage}`}
                alt="Profile preview"
                className="cursor-pointer"
                style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                }}
                onClick={(e) => {
                  navigate(`/instructorProfile?userName=${encodeURIComponent(FullName)}&idc=${encodeURIComponent(courseId)}&insIdc=${encodeURIComponent(user_courseID)}`);
                  window.scrollTo(0, 0);
                }}
              />
            )}
            <div className="flex flex-col gap-4">
              <div className="flex flex-row gap-2">
                <Users className="w-5 h-5 text-gray-700" />
                {number_Learners || '-'} students
              </div>
              <div className="flex flex-row gap-2">
                <StarIcon className="w-5 h-5 text-gray-700" />
                {course_evaluation} Instructor rating points
              </div>
              <div className="flex flex-row gap-2">
                <PercentDiamondIcon className="w-5 h-5 text-gray-700" />
                {totalRecords + ' '} Courses
              </div>
            </div>
          </div>
          <div className="mt-10">
            <span className="text-gray-700 text-2sm font-bold ">{headline}</span>
          </div>
          <div className="flex items-end gap-1">
            <span className="text-gray-600 text-xl">{biography}</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseVideoPlayer;

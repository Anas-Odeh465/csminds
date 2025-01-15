import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { FaFacebook, FaYoutube, FaLinkedin } from 'react-icons/fa';
import { ArrowLeft, BookOpen,ShoppingCart,  Play ,Clock, Book} from 'lucide-react';
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

const CourseCard = ({ title, category, price, image, name, id,  Auth, Email, ratingScore }) => {
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
        {Auth ?
          (
            price === 'Free' 
            ?(
                <button onClick={(e) => 
                  {e.preventDefault(); 
                    navigate(`/showcoursevideo?course=${encodeURIComponent(title)}&idc=${encodeURIComponent(id)}`);
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
  );
};


function ProfilePage() {
  const [allIDS, setAllIds] = useState(null);
  const [courseInstructorData, setCourseInstructorData] = useState(null);
  const [auth, setAuth] = useState(false);
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [photo, setPhoto] = useState('');
  const [headline, setHeadline] = useState('');
  const [biography, setBiography] = useState('');
  const [X, setX] = useState('');
  const [youtube, setYoutube] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [facebook, setFaceBook] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const containerStyle = {
    fontFamily: "Arial, sans-serif",
    textAlign: "left",
    color: "#fff",
    background:'#1c1d1f',
    paddingTop: "130px",
    paddingLeft: "100px",
    paddingBottom: "30px",
    width: "105%",
    fontSize: "18px",
  };

  const profileStyle = {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    paddingTop: "30px",
    marginBottom: "130px",
    marginLeft: "180px",

  };

  const imageStyle = {
    width: "110px",
    height: "110px",
    borderRadius: "50%",
    border: "3px solid #fff",
    objectFit: 'cover',
  };

  const descriptionContainerStyle = {
    display: "flex",
    flexDirection: "column",
    width: "60%",
    gap: "10px",
    marginLeft: "50px",
    marginTop: "30px",
  };

  const linksStyle = {
    display: "flex",
    position: "absolute",
    gap: "10px",
    marginTop: "180px",
    marginLeft:"8px",
  };
  const navigate = useNavigate();
 
  axios.defaults.withCredentials = true;
  useEffect(() => {
    const fetchAuthStatus = async () => {
      try {
        const res1 = await axios.get('http://localhost:3307');
        
        if (res1.data && res1.data.FirstName) {
          setAuth(true);
          setFirstname(res1.data.FirstName);
          setLastname(res1.data.LastName);
          setEmail(res1.data.Email);
          setPhoto(res1.data.photo);
          setHeadline(res1.data.headline);
          setBiography(res1.data.biography);
          setX(res1.data.x);
          setYoutube(res1.data.youtube);
          setLinkedin(res1.data.linkedin);
          setFaceBook(res1.data.facebook);
        } else {
          
          const res2 = await axios.get('http://localhost:3307/api/users/to');
          if (res2.data && res2.data.user) {
            setAuth(true);
            setFirstname(res2.data.user.given_name);
            setLastname(res2.data.user.family_name);
            setEmail(res2.data.user.email);
            setPhoto(res2.data.user.send_photo_link);
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
    axios.get(`http://localhost:3307/api/getLearn?email=${email}`)
      .then(response => {
        setAllIds(response.data);
        
        if (response.data && response.data.length > 0) {
          // Fetch courses for each ID in allIds
          const courseRequests = response.data.map(id => 
            axios.get(`http://localhost:3307/api/courses?idc=${id.ID_course_specifier}`)
          );
          
          Promise.all(courseRequests)
            .then(courseResponses => {
              const allCourses = courseResponses.map(res => res.data);
              setCourseInstructorData(allCourses); 
              setIsLoading(false);
            })
            .catch(error => {
              console.error('Error fetching courses:', error);
              setIsLoading(false);
            });
        } else {
          console.log("No IDs found or user data is empty.");
          setIsLoading(false);
        }
      })
      .catch(err => {
        console.error("Error fetching learn data:", err);
        setIsLoading(false);
      });
  }, [email]);

 if (isLoading) {
  return <Loading className='mt-20 mb-20'/>;
}

console.log("Loading :", courseInstructorData)

 if(!courseInstructorData){
  return ( <> 
    { auth ? (
       <div> 
        <div style={containerStyle}>
           <h1>{firstname} {lastname}</h1>
           <h2>{headline}</h2>
         </div>
 
         <div style={profileStyle}>
 
         {photo == 'No photo available' ? (<UserAvatar_large firstName={firstname} />) : 
         ( <img src={`http://localhost:3307${photo}`} alt="profile picture" 
           style={imageStyle} title={firstname +" "+ lastname} />) }
 
           <div style={linksStyle}>
 
               {facebook ? <a href={facebook}>
                 <FaFacebook size={20} style={{ color: 'blue' }}/>
               </a> : ('')}
               
               {youtube ? (<a href={youtube}>
                 <FaYoutube size={20}  style={{ color: 'red' }}/>
               </a>) : ('')}
 
               {X ? (<a href={X}>
                 <img src={x}  style={{ width: 19, height: 19 }}/>
               </a>) : ('')}
 
               {linkedin ? (<a href={linkedin}>
                 <FaLinkedin size={20}  style={{ color: 'blue' }}/>
               </a>) : ('')}
             
           </div>
 
           <div style={descriptionContainerStyle}>
             <p>{biography}</p>
           </div>
 
         </div>
       </div>
       ) : (
         <div className="w-screen text-center  mt-[250px] mb-[260px] ">
             <h2 className="text-4xl font-bold text-gray-800 mt-[150px]">
                 Access denied profile and settings
             </h2>
         </div>
       )
     }</>);
 }

 else{
  const filteredCourses = courseInstructorData; 
  console.log('GOT HERE: ',courseInstructorData);
  return ( <> 
    { auth ? (
       <div> 
        <div style={containerStyle}>
           <h1>{firstname} {lastname}</h1>
           <h2>{headline}</h2>
         </div>
 
         <div style={profileStyle}>
 
         {photo == 'No photo available' ? (<UserAvatar_large firstName={firstname} />) : 
         ( <img src={`http://localhost:3307${photo}`} alt="profile picture" 
           style={imageStyle} title={firstname +" "+ lastname} />) }
 
           <div style={linksStyle}>
 
               {facebook ? <a href={facebook}>
                 <FaFacebook size={20} style={{ color: 'blue' }}/>
               </a> : ('')}
               
               {youtube ? (<a href={youtube}>
                 <FaYoutube size={20}  style={{ color: 'red' }}/>
               </a>) : ('')}
 
               {X ? (<a href={X}>
                 <img src={x}  style={{ width: 19, height: 19 }}/>
               </a>) : ('')}
 
               {linkedin ? (<a href={linkedin}>
                 <FaLinkedin size={20}  style={{ color: 'blue' }}/>
               </a>) : ('')}
             
           </div>
 
           <div style={descriptionContainerStyle}>
             <p>{biography}</p>
           </div>
 
         </div>
       </div>
       ) : (
         <div className="w-screen text-center  mt-[250px] mb-[260px] ">
             <h2 className="text-4xl font-bold text-gray-800 mt-[150px]">
                 Access denied profile and settings
             </h2>
         </div>
       )
     }
     <div className="bg-white rounded-lg shadow-lg p-6 ml-10 mb-[50px]">
         <h2 className="text-2xl text-center font-bold mb-6">Courses you are enrolled in</h2>
         <div className="space-y-6">
             <div className="max-w-auto mx-auto px-14 ml-[10px] py-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 place-items-center">
                 {(filteredCourses ?? []).map((course, index) => (
                     <CourseCard
                         key={index}
                         title={course.course_title}
                         price={course.course_pricing}
                         image={course.course_picture}
                         category={course.course_category}
                         name={course.FullName}
                         id={course.ID_course_specifier}
                         Auth={auth}
                         Email={email}
                         ratingScore={course.course_evaluation > 0 ? course.course_evaluation : 0}
                     />
                   ))}
               </div>
           </div>
      </div>
     
   </>);
 }

  
}
export default ProfilePage;

import React, { useState, useEffect } from 'react';
import { useCart } from '../../context/CourseContext/cartContext';
import { useNavigate } from 'react-router-dom';
import { Trash2, ArrowLeft, Send } from 'lucide-react';
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

const CartPage = () => {
    const { dispatch } = useCart();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [auth, setAuth] = useState(false);
    const [email, setEmail] = useState('');
    const [allCoursesInUserCart, setAllCoursesInUserCart] = useState([]);
    const [totalCourses, setTotalCourses] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);

    axios.defaults.withCredentials = true;
    useEffect(() => {
        const fetchAuthStatus = async () => {
            try {
                const res = await axios.get('http://localhost:3307');
                if (res.data && res.data.FirstName) {
                    setAuth(true);
                    setEmail(res.data.Email);
                    setIsLoading(false);
                } else {
                    setAuth(false);
                    setIsLoading(false);
                }
            } catch (err) {
                console.error('Error fetching auth status:', err);
                setAuth(false);
            }
        };

        fetchAuthStatus();
    }, []);

    useEffect(() => {
        const fetchCartData = async () => {
            try {
                const response = await axios.get(`http://localhost:3307/api/getUserCart?vepwj=${encodeURIComponent(email)}`);
                if (response.data.courseCart) {
                    setAllCoursesInUserCart(response.data.courseCart);
                    setTotalCourses(response.data.totalCartsRecords);
                    const total = response.data.courseCart.reduce((sum, course) => sum + parseFloat(course.course_pricing), 0);
                    setTotalPrice(total);
                    setIsLoading(false);
                } else {
                    setTotalCourses(0);
                    setTotalPrice(0);
                    setIsLoading(false);
                }
            } catch (error) {
                console.error('Error fetching cart data:', error);
            }
        };

        if (email) {
            fetchCartData();
        }
    }, [email]);

    const handleRemoveFromCart = async (course) => {
      if (!email) {
          alert('User not authenticated.');
          return;
      }
      try {
          const response = await axios.delete('http://localhost:3307/api/deleteCourseFromCart', {
              params: {
                  Email: email,
                  CourseID: course.ID_course_specifier
              },
              withCredentials: true
          });
  
          if (response.data.message) {
              alert(response.data.message);
              setAllCoursesInUserCart((prevCourses) => 
                  prevCourses.filter((c) => c.ID_course_specifier !== course.ID_course_specifier)
              );
  
              setTotalPrice((prevTotal) => 
                  (prevTotal - parseFloat(course.course_pricing)).toFixed(2)
              );
              setTotalCourses((prevCount) => prevCount - 1);
              window.location.reload(true);
          } else {
              alert('Failed to delete the course.');
          }
      } catch (error) {
          console.error('Error deleting course:', error);
          alert('Failed to delete the course.');
      }
  };

    const handleCheckout = () => {
        navigate(`/checkoutPage?totalPrice=${totalPrice}`);
    };

    if (isLoading) {
      return <Loading/>;
    }
    console.log('Check cart: ' + allCoursesInUserCart);

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 mt-16">
            {/* Back Button */}
            <div className="max-w-7xl mx-auto mb-8">
                <button
                    onClick={() => navigate('/courses')}
                    className="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back to Courses
                </button>
            </div>

            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

                {allCoursesInUserCart.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                        <h2 className="text-xl text-gray-600 mb-4">Your cart is empty</h2>
                        <button
                            onClick={() => navigate('/courses')}
                            className="text-blue-500 hover:text-blue-600 font-semibold"
                        >
                            Browse Courses
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            {allCoursesInUserCart.map((course, index) => (
                                <div
                                    key={index}
                                    className="bg-white rounded-lg shadow-lg p-6 mb-4 flex items-start space-x-4"
                                >
                                    <div className="w-48 h-38 bg-gray-100 flex items-center justify-center">
                                        <img src={`http://localhost:3307${course.course_picture}`} alt={course.course_title} className="w-full h-full object-cover" />
                                    </div>

                                    <div className="flex-1">
                                        <h3 className="text-xl font-semibold mb-2">{course.course_title}</h3>
                                        <p className="text-gray-600 mb-2">By <strong>{course.instructor_name}</strong></p>
                                          <StarRating totalStars={5} initialRating={course.course_evaluation} />
                                        <div className="flex items-center justify-between">
                                            <span className="text-2xl font-bold">${course.course_pricing}</span>
                                            <button
                                                onClick={() => handleRemoveFromCart(course)}
                                                className="text-red-500 hover:text-red-600 transition-colors duration-200"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
                                <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                                <div className="space-y-4">
                                    <div className="flex justify-between">
                                        <span>Total Courses:</span>
                                        <span>{totalCourses}</span>
                                    </div>
                                    <div className="flex justify-between text-xl font-bold">
                                        <span>Total:</span>
                                        <span>${totalPrice.toFixed(2)}</span>
                                    </div>
                                    <button
                                        onClick={handleCheckout}
                                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-md transition-all duration-300"
                                    >
                                        Checkout 
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartPage;

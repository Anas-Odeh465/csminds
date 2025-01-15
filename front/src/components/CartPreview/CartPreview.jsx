import React, {useState, useEffect} from 'react';
import { useCart } from '../../context/CourseContext/cartContext';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import axios from 'axios';


const CartPreview = () => {
  const { cart } = useCart();
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
                } else {
                    setAuth(false);
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
                } else {
                    setTotalCourses(0);
                    setTotalPrice(0);
                }
            } catch (error) {
                console.error('Error fetching cart data:', error);
            }
        };

        if (email) {
            fetchCartData();
        }
    }, [email]);

  return (
    <div className="group relative">
      <Link to="/cart" className="text-gray-600 relative">
        <ShoppingCart className="w-5 h-5" />
        {allCoursesInUserCart.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
            {allCoursesInUserCart.length}
          </span>
        )}
      </Link>
      
      {/* Hover Preview */}
      <div className="hidden group-hover:block absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border z-50 transition-opacity duration-2000 delay-2000">
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-3">Cart ({totalCourses})</h3>
          
          {allCoursesInUserCart.length === 0 ? (
            <p className="text-gray-500">Your cart is empty</p>
          ) : (
            <>
              <div className="max-h-64 overflow-y-auto">
                {allCoursesInUserCart.map((course, index) => (
                  <div key={index} className="flex items-center gap-3 py-2 border-b last:border-0">
                    <div className="w-24 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <img src={`http://localhost:3307${course.course_picture}`} alt={course.course_title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{course.course_title}</p>
                      <p className="text-sm text-gray-600 mb-2">By <strong>{course.instructor_name}</strong></p>
                      <p className="text-sm text-gray-500">${course.course_pricing}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-3 pt-3 border-t">
                <div className="flex justify-between mb-3">
                  <span className="font-medium">Total:</span>
                  <span className="font-bold">${totalPrice.toFixed(2)}</span>
                </div>
                <Link 
                  to="/cart"
                  className="block w-full bg-blue-500 hover:bg-blue-600 text-white text-center py-2 px-4 rounded-md transition-colors duration-200"
                >
                  View Cart
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartPreview;
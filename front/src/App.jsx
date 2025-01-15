{/* Important layout must specified based on the page */}

import DefaultLayout from './defaultLayout';
import NoLayout from './noLayout';

{/* ------------------------------------------------- */}

import NavigationBar from './components/Layout/navBar';
import LoginAdmin from './pages/admin/adminLogin';
import './App.css';
import HomePage from './pages/home/home';
import AdminPage from './pages/admin/adminManagement';
import Footer from './components/Layout/footer';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CoursesPage from './pages/courses';
import BecomeInstructor from './components/joinus/joinUs';
import CourseDetailsPage from './pages/courseDetails';
import AuthPage from './pages/login/login';
import { UserAvatar, UserAvatarSmall } from './components/Profile/userAvat';
import EmailVerification from './pages/login/forgot-password';
import ResetPassword from './pages/login/reset-password';
import AccountEmailVerification from './pages/login/verify-email-signup';
import CourseCreationSteps from './components/steps/steps';
import EditProfilePage from './components/profile/editProfile';
import ProfilePage from './components/profile/profilePage';
import InstructorProfile from './components/profile/instuctorsProfile';
import InstructorDashboard from './components/instructorDashboard/dashboard';
import CartPage from './pages/cartPage/cart';
import CourseVideoPlayer from './pages/courseVideoPlayer';
import QuizCreator from './components/quizCourse/quiz';
import QuizPage from './components/attempQuiz/quizPage';
import CheckoutPage from './components/payment/paymentMethod';
import AccountSettings from './components/accountSettings/account_settings';
import InstructorPage from './components/InstructorCreatr-HW/homeWorkCreate';
import StudentPage from './components/InstructorCreatr-HW/homeWorkPage';

function App() {
  return ( 
    <Router>
        <Routes>  <Route path="/admin" element={<LoginAdmin />}/><Route path="/adminPage" element={<AdminPage />}/>
            <Route path="/" element={<DefaultLayout> <HomePage /> </DefaultLayout>} />
            <Route path="/courses" element={<DefaultLayout> <CoursesPage /> </DefaultLayout>} />
            <Route path="/become-instructor" element={<DefaultLayout> <BecomeInstructor /> </DefaultLayout>} />
            <Route path="/coursesDetailsPage" element={<DefaultLayout> <CourseDetailsPage /> </DefaultLayout>} />
            <Route path="/login" element={<NoLayout> <AuthPage /> </NoLayout>} />
            <Route path="/useravtart" element={<DefaultLayout> <UserAvatar /> </DefaultLayout>} />
            <Route path="/useravtart2" element={<DefaultLayout> <UserAvatarSmall /> </DefaultLayout>} />
            <Route path="/passCode" element={<DefaultLayout> <EmailVerification /> </DefaultLayout>} />
            <Route path="/resetpass" element={<DefaultLayout> <ResetPassword /> </DefaultLayout>} />
            <Route path="/Aemailverify" element={<DefaultLayout> <AccountEmailVerification /> </DefaultLayout>} />
            <Route path="/steps" element={<DefaultLayout> <CourseCreationSteps /> </DefaultLayout>} />
            <Route path="/editProfile" element={<DefaultLayout> <EditProfilePage /> </DefaultLayout>} />
            <Route path="/publicProfile" element={<DefaultLayout> <ProfilePage /> </DefaultLayout>} />
            <Route path="/instructorProfile" element={<DefaultLayout> <InstructorProfile /> </DefaultLayout>} />
            <Route path="/cart" element={<DefaultLayout> <CartPage /> </DefaultLayout>} />
            <Route path="/showcoursevideo" element={<DefaultLayout> <CourseVideoPlayer /> </DefaultLayout>} />
            <Route path="/instructorDashboard" element={<DefaultLayout> <InstructorDashboard /> </DefaultLayout>} />
            <Route path="/quizCreator" element={<DefaultLayout> <QuizCreator /> </DefaultLayout>} />
            <Route path="/quizAttempPage" element={<DefaultLayout> <QuizPage /> </DefaultLayout>} />
            <Route path="/checkoutPage" element={<DefaultLayout> <CheckoutPage /> </DefaultLayout>} />
            <Route path="/accountSettings" element={<DefaultLayout> <AccountSettings /> </DefaultLayout>} />
            <Route path="/createAssignment" element={<DefaultLayout> <InstructorPage /> </DefaultLayout>} />
            <Route path="/studentPageAssignment" element={<DefaultLayout> <StudentPage /> </DefaultLayout>} />
        </Routes>
  </Router>
  );
}

export default App;

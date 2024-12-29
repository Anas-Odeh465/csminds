{/* Important layout must specified based on the page */}

import DefaultLayout from './defaultLayout';
import NoLayout from './noLayout';

{/* ------------------------------------------------- */}

import NavigationBar from './components/Layout/navBar';
import './App.css';
import HomePage from './pages/home/home';
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


function App() {
  return ( 
    <Router>
        <Routes>
           
            <Route path="/" element={<DefaultLayout> <HomePage /> </DefaultLayout>} />
            <Route path="/courses" element={<DefaultLayout> <CoursesPage /> </DefaultLayout>} />
            <Route path="/become-instructor" element={<DefaultLayout> <BecomeInstructor /> </DefaultLayout>} />
            <Route path="/courses/:courseId" element={<DefaultLayout> <CourseDetailsPage /> </DefaultLayout>} />
            <Route path="/login" element={<NoLayout> <AuthPage /> </NoLayout>} />
            <Route path="/useravtart" element={<DefaultLayout> <UserAvatar /> </DefaultLayout>} />
            <Route path="/useravtart2" element={<DefaultLayout> <UserAvatarSmall /> </DefaultLayout>} />
            <Route path="/passCode" element={<DefaultLayout> <EmailVerification /> </DefaultLayout>} />
            <Route path="/resetpass" element={<DefaultLayout> <ResetPassword /> </DefaultLayout>} />
            <Route path="/Aemailverify" element={<DefaultLayout> <AccountEmailVerification /> </DefaultLayout>} />
            <Route path="/steps" element={<DefaultLayout> <CourseCreationSteps /> </DefaultLayout>} />
            <Route path="/editProfile" element={<DefaultLayout> <EditProfilePage /> </DefaultLayout>} />
            <Route path="/publicProfile" element={<DefaultLayout> <ProfilePage /> </DefaultLayout>} />


        </Routes>
  </Router>
  );
}

export default App;

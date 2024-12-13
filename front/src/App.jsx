import NavigationBar from './components/Layout/navBar';
import './App.css';
import HomePage from './pages/home/home';
import Footer from './components/Layout/footer';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CoursesPage from './pages/courses';
import BecomeInstructor from './components/joinus/joinUs';
import CourseDetailsPage from './pages/courseDetails';
function App() {
  return (
    <Router>
    <div className="flex flex-col min-h-screen">
      {/* Header / Navigation */}
      <NavigationBar />

      {/* Main Content */}
      <main className="flex-grow">
      <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/courses" element={<CoursesPage />} />
      <Route path="/become-instructor" element={<BecomeInstructor />} />
      <Route path="/courses/:courseId" element={<CourseDetailsPage />} />


      </Routes>
      </main>

      {/* Footer */}
      <Footer />
    </div>
    </Router>
  );
}

export default App;

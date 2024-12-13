import React from 'react';
import { ArrowLeft, Clock, Book, BarChart, Users, CheckCircle } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';

const CourseDetailsPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  // Mock data structure matching the courses page data format
  const allCourses = [
    {
      id: 'python-beginners',
      title: 'Python for Beginners',
      description: 'Start your programming journey with Python fundamentals',
      image: 'python',
      category: 'Programming Languages',
      duration: '8 weeks',
      level: 'Beginner',
      price: '49.99',
      instructor: 'John Doe',
      studentsEnrolled: '2,345',
      lastUpdated: 'November 2024',
      learningOutcomes: [
        'Understand Python basic syntax and data types',
        'Work with functions, loops, and conditional statements',
        'Handle file operations and basic error handling',
        'Create simple Python applications',
        'Work with Python packages and modules'
      ],
      syllabus: [
        {
          week: 1,
          title: 'Introduction to Python',
          topics: ['Setting up Python environment', 'Basic syntax', 'Variables and data types']
        },
        {
          week: 2,
          title: 'Control Flow',
          topics: ['Conditional statements', 'Loops', 'Basic functions']
        },
        {
          week: 3,
          title: 'Data Structures',
          topics: ['Lists', 'Dictionaries', 'Sets', 'Tuples']
        }
      ]
    }
  ];

  const courseData = allCourses.find(course => course.id === courseId) || allCourses[0];

  const renderImage = () => {
    switch (courseData.image) {
      case 'python':
        return (
          <div className="flex items-center space-x-2">
            <div className="w-12 h-12 bg-blue-500 rounded-full"></div>
            <div className="w-12 h-12 bg-yellow-500 rounded-full -ml-6"></div>
          </div>
        );
      case 'html':
        return (
          <div className="bg-orange-500 p-4 rounded-lg">
            <h2 className="text-4xl font-bold text-white">HTML5</h2>
          </div>
        );
      case 'java':
        return (
          <div className="w-16 h-16 bg-red-500 rounded-lg flex items-center justify-center">
            <span className="text-white text-2xl font-bold">Java</span>
          </div>
        );
      case 'unity':
        return (
          <div className="bg-black p-4 rounded-lg">
            <span className="text-white text-2xl font-bold">Unity</span>
          </div>
        );
      case 'react':
        return (
          <div className="w-16 h-16 bg-blue-400 rounded-full flex items-center justify-center">
            <span className="text-white text-xl">React</span>
          </div>
        );
      case 'flutter':
        return (
          <div className="w-16 h-16 bg-blue-500 rounded-lg flex items-center justify-center">
            <span className="text-white text-xl">Flutter</span>
          </div>
        );
      case 'nodejs':
        return (
          <div className="w-16 h-16 bg-green-500 rounded-lg flex items-center justify-center">
            <span className="text-white text-xl">Node</span>
          </div>
        );
      case 'angular':
        return (
          <div className="w-16 h-16 bg-red-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-xl">Angular</span>
          </div>
        );
      default:
        return (
          <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
            <span className="text-gray-600 text-xl">DEV</span>
          </div>
        );
    }
  };

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

      {/* Course Header */}
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden mb-8">
        <div className="p-8">
          <div className="flex flex-col md:flex-row items-start gap-8">
            <div className="h-48 w-48 bg-white flex items-center justify-center">
              {renderImage()}
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm">
                  {courseData.duration}
                </span>
                <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-sm">
                  {courseData.level}
                </span>
                <span className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-sm">
                  ${courseData.price}
                </span>
              </div>
              <h1 className="text-3xl font-bold mb-4">{courseData.title}</h1>
              <p className="text-gray-600 mb-6">{courseData.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-gray-400" />
                  <span>{courseData.studentsEnrolled} students</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <span>Last updated {courseData.lastUpdated}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Book className="w-5 h-5 text-gray-400" />
                  <span>By {courseData.instructor}</span>
                </div>
              </div>
              <button className="w-full md:w-auto bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-md transition-all duration-300">
                Enroll Now for ${courseData.price}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Learning Outcomes */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold mb-6">What you'll learn</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {courseData.learningOutcomes.map((outcome, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                  <span>{outcome}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Course Syllabus */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6">Course Content</h2>
            <div className="space-y-6">
              {courseData.syllabus.map((week, index) => (
                <div key={index} className="border-b border-gray-200 pb-6 last:border-0 last:pb-0">
                  <h3 className="text-lg font-semibold mb-2">
                    Week {week.week}: {week.title}
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-600">
                    {week.topics.map((topic, topicIndex) => (
                      <li key={topicIndex}>{topic}</li>
                    ))}
                  </ul>
                </div>
              ))}
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
                <span>{courseData.duration} of content</span>
              </div>
              <div className="flex items-center gap-3">
                <BarChart className="w-5 h-5 text-gray-400" />
                <span>{courseData.level} level</span>
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
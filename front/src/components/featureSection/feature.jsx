import React from 'react';

const FeaturedCourses = () => {
  const courses = [
    { title: 'Web Development', type: 'learners' },
    { title: 'JavaScript', type: 'learners' },
    { title: 'React JS', type: 'learners' },
    { title: 'Angular', type: 'learners' },
    { title: 'Java', type: 'learners' },
    { title: 'Android Development', type: 'learners' },
    { title: 'iOS Development', type: 'learners' },
    { title: 'CSS', type: 'learners' },
  ];

  return (
    <div className="bg-white py-8 w-full mt-16">
      <h1 className="text-4xl font-bold text-gray-800 mb-2 px-4 text-center">
        the skills you need in one place
      </h1>
      <p className="text-lg text-gray-700 mb-8 px-4 text-center">
        From critical skills to technical topics, CS Minds supports your professional development.
      </p>
      
      <h2 className="text-3xl font-semibold text-center text-gray-800 mb-8">
        Featured Courses
      </h2>

      <div className="flex flex-wrap gap-4 justify-center">
        {courses.map((course, index) => (
          <div
            key={index}
            className="bg-white rounded-full px-6 py-3 shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <span className="text-blue-600">
              {course.title} {course.type}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedCourses;
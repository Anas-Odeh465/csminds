import React, { useState, useMemo } from 'react';
import { Search, BookOpen } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const CourseCard = ({ title, description, image, url, duration, level, price }) => {
  const renderImage = () => {
    switch (image) {
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
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
      <div className="h-48 bg-white flex items-center justify-center p-4">
        {renderImage()}
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm">
            {duration}
          </span>
          <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-sm">
            {level}
          </span>
          <span className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-sm">
            ${price}
          </span>
        </div>
        <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-md transition-all duration-300">
          Enroll Now
        </button>
      </div>
    </div>
  );
};

const CoursesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [selectedPrice, setSelectedPrice] = useState('All');
  
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const categoryFromURL = searchParams.get('category') || 'All';

  // Set initial category from URL
  React.useEffect(() => {
    setSelectedCategory(categoryFromURL);
  }, [categoryFromURL]);

  const allCourses = [
    {
      title: 'Python for Beginners',
      description: 'Start your programming journey with Python fundamentals',
      image: 'python',
      category: 'Programming Languages',
      duration: '8 weeks',
      level: 'Beginner',
      price: '49.99',
      url: '#'
    },
    {
      title: 'Advanced Web Development',
      description: 'Master modern web development with React and Node.js',
      image: 'react',
      category: 'Web Development',
      duration: '12 weeks',
      level: 'Advanced',
      price: '89.99',
      url: '#'
    },
    {
      title: 'Mobile App Development with Flutter',
      description: 'Build cross-platform mobile apps with Flutter',
      image: 'flutter',
      category: 'Mobile Development',
      duration: '10 weeks',
      level: 'Intermediate',
      price: '79.99',
      url: '#'
    },
    {
      title: 'Java Enterprise Development',
      description: 'Learn enterprise Java development with Spring Boot',
      image: 'java',
      category: 'Programming Languages',
      duration: '16 weeks',
      level: 'Advanced',
      price: '99.99',
      url: '#'
    },
    {
      title: 'Unity Game Development',
      description: 'Create 3D games with Unity and C#',
      image: 'unity',
      category: 'Game Development',
      duration: '14 weeks',
      level: 'Intermediate',
      price: '89.99',
      url: '#'
    },
    {
      title: 'Frontend Development with Angular',
      description: 'Build modern web applications with Angular',
      image: 'angular',
      category: 'Web Development',
      duration: '10 weeks',
      level: 'Intermediate',
      price: '69.99',
      url: '#'
    },
    {
      title: 'Node.js Backend Development',
      description: 'Create scalable backend services with Node.js',
      image: 'nodejs',
      category: 'Web Development',
      duration: '12 weeks',
      level: 'Advanced',
      price: '79.99',
      url: '#'
    },
    {
      title: 'HTML & CSS Fundamentals',
      description: 'Learn the building blocks of web development',
      image: 'html',
      category: 'Web Development',
      duration: '6 weeks',
      level: 'Beginner',
      price: '39.99',
      url: '#'
    }
  ];

  const categories = ['All', 'Web Development', 'Mobile Development', 'Programming Languages', 'Game Development'];
  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];
  const priceRanges = ['All', 'Under $50', '$50-$80', 'Over $80'];

  const filteredCourses = useMemo(() => {
    return allCourses.filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          course.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
      const matchesLevel = selectedLevel === 'All' || course.level === selectedLevel;
      const matchesPrice = selectedPrice === 'All' ||
        (selectedPrice === 'Under $50' && parseFloat(course.price) < 50) ||
        (selectedPrice === '$50-$80' && parseFloat(course.price) >= 50 && parseFloat(course.price) <= 80) ||
        (selectedPrice === 'Over $80' && parseFloat(course.price) > 80);

      return matchesSearch && matchesCategory && matchesLevel && matchesPrice;
    });
  }, [searchQuery, selectedCategory, selectedLevel, selectedPrice]);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 mt-16">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-12 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Explore Our Courses
        </h1>
        <p className="text-xl text-gray-600">
          Find the perfect course to advance your programming skills
        </p>
      </div>

      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            {/* Category Filter */}
            <div className="flex-1">
              <select
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Level Filter */}
            <div className="flex-1">
              <select
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
              >
                {levels.map((level) => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>

            {/* Price Filter */}
            <div className="flex-1">
              <select
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedPrice}
                onChange={(e) => setSelectedPrice(e.target.value)}
              >
                {priceRanges.map((range) => (
                  <option key={range} value={range}>{range}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="max-w-7xl mx-auto">
        {filteredCourses.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-semibold text-gray-900">No courses found</h3>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCourses.map((course, index) => (
              <CourseCard key={index} {...course} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesPage;
import React, { createContext, useContext, useState } from 'react';

const CourseContext = createContext();

export const CourseProvider = ({ children }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [selectedPrice, setSelectedPrice] = useState('All');

  return (
    <CourseContext.Provider value={{
      selectedCategory,
      setSelectedCategory,
      searchQuery,
      setSearchQuery,
      selectedLevel,
      setSelectedLevel,
      selectedPrice,
      setSelectedPrice
    }}>
      {children}
    </CourseContext.Provider>
  );
};

export const useCourseContext = () => useContext(CourseContext);
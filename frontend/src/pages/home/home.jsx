import React from 'react';
import HeroSection from '../../components/heroSection/hero';
import FeaturedCourses from '../../components/featureSection/feature'
import CourseCatalog from '../../components/courses/courses';
import About from '../../components/about/about';

const HomePage = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <HeroSection />
            <FeaturedCourses />
            <CourseCatalog />
            <About />
        </div>
    )
}

export default HomePage;

import React, { useState } from "react";
import img from '../../assets/image.jpg';
import img2 from '../../assets/imag1.jpg';
import img3 from '../../assets/imag2.jpg';
import img4 from '../../assets/imag3.jpg';
import { Link } from 'react-router-dom';
const InstructorPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="flex justify-between items-center py-4 px-6 bg-white shadow-md">
        <h1 className="text-2xl font-bold text-gray-800">CS Minds</h1>
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Search anything..."
            className="px-4 py-2 border border-gray-300 rounded-md w-80"
          />
          <nav className="flex items-center space-x-4">
            <button className="text-gray-800 hover:text-blue-600">AI Minds</button>
            <button className="text-gray-800 hover:text-blue-600">Login</button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Sign Up
            </button>
          </nav>
        </div>
      </header>

      <main className="py-16 px-6 max-w-6xl mx-auto">
        {/* Hero Section */}
        <section className="flex flex-col lg:flex-row items-center gap-8 mb-16">
          <div className="flex-1">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Join us as an instructor
            </h2>
            <p className="text-gray-600 mb-6">
              Make a difference in the lives of others while transforming your own.
            </p>
            <button
              onClick={openModal}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Get started
            </button>
          </div>
          <div className="flex-1">
            <img src={img} alt="Instructor" className="rounded-md shadow-lg" />
          </div>
        </section>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-md shadow-md max-w-lg w-full">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Want to use CSMinds in your classroom?
              </h3>
              <p className="text-gray-600 mb-6">
                Fill out the form and get more information, including demo videos!
              </p>
              <form className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Name*</label>
                  <input
                    type="text"
                    placeholder="Your name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Work email*</label>
                  <input
                    type="email"
                    placeholder="Email address"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Select your role*</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-md">
                    <option>Select your role</option>
                    <option>Teacher</option>
                    <option>Administrator</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Number of learners*
                  </label>
                  <input
                    type="number"
                    placeholder="Number"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div className="text-sm text-gray-600">
                  By sending this form you agree to our{" "}
                  <a href="#" className="text-blue-600 underline">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-blue-600 underline">
                    Privacy Policy
                  </a>
                </div>
                <Link to ='/steps'>
                <button
                  type="submit"
                  className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  See it in action
                </button>
                </Link>
              </form>
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-lg"
              >
                &times;
              </button>
            </div>
          </div>
        )}
 {/* Features Section */}
 <section className="text-center mb-16">
          <h3 className="text-3xl font-bold text-gray-800 mb-6">
            So many reasons to start
          </h3>
          <div className="flex flex-wrap justify-center gap-8">
            <div className="max-w-xs text-center">
              <img
                src={img2}
                alt="Teach your way"
                className="mx-auto mb-4"
              />
              <h4 className="text-lg font-bold text-gray-800 mb-2">Teach your way</h4>
              <p className="text-gray-600">
                Publish the course you want, in the way you want, and always have control
                of your own content.
              </p>
            </div>
            <div className="max-w-xs text-center">
              <img
                src={img3}
                alt="Inspire learners"
                className="mx-auto mb-4"
              />
              <h4 className="text-lg font-bold text-gray-800 mb-2">Inspire learners</h4>
              <p className="text-gray-600">
                Teach what you know and help learners explore their interests and careers.
              </p>
            </div>
            <div className="max-w-xs text-center">
              <img
                src={img4}
                alt="Get rewarded"
                className="mx-auto mb-4"
              />
              <h4 className="text-lg font-bold text-gray-800 mb-2">Get rewarded</h4>
              <p className="text-gray-600">
                Expand your network, build expertise, and earn money on each enrollment.
              </p>
            </div>
          </div>
        </section>
        {/* Features Section */}
        <section className="text-center">
          <h3 className="text-3xl font-bold text-gray-800 mb-6">
            Get started in a few simple steps
          </h3>
          <p className="text-gray-600 mb-8">
            Setting up your classroom is quick and effortless. Sign up, customize learning
            paths, and invite students.
          </p>
          <div className="flex flex-wrap justify-center gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">1</div>
              <p className="text-gray-600">Fill out form</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">2</div>
              <p className="text-gray-600">Sign up</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">3</div>
              <p className="text-gray-600">Invite students</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default InstructorPage;

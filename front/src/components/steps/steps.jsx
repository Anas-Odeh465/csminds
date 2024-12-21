import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, BookOpen, Target, VideoIcon, CheckCircle } from 'lucide-react';

const CourseCreationSteps = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [courseTitle, setCourseTitle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [prerequisites, setPrerequisites] = useState([]);
  const [newPrerequisite, setNewPrerequisite] = useState('');
  const [outcomes, setOutcomes] = useState([]);
  const [newOutcome, setNewOutcome] = useState('');

  // cate
  const categories = [
    'Development',
    'Business',
    'Finance & Accounting',
    'IT & Software',
    'Office Productivity',
    'Personal Development',
    'Design',
    'Marketing',
    'Lifestyle',
    'Photography & Video',
    'Health & Fitness',
    'Music',
    'Teaching & Academics'
  ];

  const levels = [
    { id: 'beginner', name: 'Beginner Level', description: 'No prior knowledge required' },
    { id: 'intermediate', name: 'Intermediate Level', description: 'Basic knowledge required' },
    { id: 'advanced', name: 'Advanced Level', description: 'Comprehensive experience needed' },
    { id: 'all', name: 'All Levels', description: 'Content suitable for everyone' }
  ];

  const addPrerequisite = () => {
    if (newPrerequisite.trim()) {
      setPrerequisites([...prerequisites, newPrerequisite.trim()]);
      setNewPrerequisite('');
    }
  };

  const addOutcome = () => {
    if (newOutcome.trim()) {
      setOutcomes([...outcomes, newOutcome.trim()]);
      setNewOutcome('');
    }
  };

  const renderStep = () => {
    switch(currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-blue-500" />
              <h2 className="text-2xl font-bold">Choose a category</h2>
            </div>
            <div className="grid gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`text-left p-3 rounded-lg transition-all
                    ${selectedCategory === category 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100 hover:bg-gray-200'}`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">How about a working title?</h2>
            <p className="text-gray-600">
              It's ok if you can't think of a good title now. You can change it later.
            </p>
            <div className="relative">
              <input
                type="text"
                value={courseTitle}
                onChange={(e) => setCourseTitle(e.target.value)}
                placeholder="e.g. Learn Photoshop CS6 from Scratch"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                maxLength={60}
              />
              <div className="absolute right-3 top-3 text-sm text-gray-500">
                {courseTitle.length}/60
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Target className="w-6 h-6 text-blue-500" />
              <h2 className="text-2xl font-bold">Course Level & Prerequisites</h2>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Select Course Level</h3>
              <div className="grid gap-3">
                {levels.map((level) => (
                  <button
                    key={level.id}
                    onClick={() => setSelectedLevel(level.id)}
                    className={`p-4 rounded-lg border transition-all text-left
                      ${selectedLevel === level.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-200'}`}
                  >
                    <div className="font-medium">{level.name}</div>
                    <div className="text-sm text-gray-600">{level.description}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Course Prerequisites</h3>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newPrerequisite}
                    onChange={(e) => setNewPrerequisite(e.target.value)}
                    placeholder="Add a prerequisite..."
                    className="flex-1 p-2 border rounded-lg"
                  />
                  <button
                    onClick={addPrerequisite}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    Add
                  </button>
                </div>
                <div className="space-y-2">
                  {prerequisites.map((prereq, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>{prereq}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <VideoIcon className="w-6 h-6 text-blue-500" />
              <h2 className="text-2xl font-bold">Learning Outcomes</h2>
            </div>
            
            <p className="text-gray-600">
              What will students be able to do after completing your course? 
              These learning outcomes will help students decide if your course is right for them.
            </p>

            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newOutcome}
                  onChange={(e) => setNewOutcome(e.target.value)}
                  placeholder="e.g., Create professional-quality logos using Photoshop"
                  className="flex-1 p-2 border rounded-lg"
                />
                <button
                  onClick={addOutcome}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Add
                </button>
              </div>
              <div className="space-y-2">
                {outcomes.map((outcome, index) => (
                  <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>{outcome}</span>
                  </div>
                ))}
              </div>
              {outcomes.length === 0 && (
                <div className="text-center p-6 bg-gray-50 rounded-lg text-gray-500">
                  Add at least 4 learning outcomes to help students understand what they'll learn
                </div>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-lg mt-40 mb-16">
      <div className="border-b px-6 py-4 flex items-center justify-between">
        <div className="text-lg font-semibold">Step {currentStep} of 4</div>
        <div className="text-sm text-gray-500">
          {currentStep === 1 && 'Select a category'}
          {currentStep === 2 && 'Create a title'}
          {currentStep === 3 && 'Set level & prerequisites'}
          {currentStep === 4 && 'Define learning outcomes'}
        </div>
      </div>
      <div className="p-6">
        {renderStep()}
        <div className="mt-6 flex justify-between">
          <button
            onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
            disabled={currentStep === 1}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>
          <button
            onClick={() => setCurrentStep(prev => Math.min(4, prev + 1))}
            disabled={currentStep === 4}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
          >
            {currentStep === 4 ? 'Finish' : 'Continue'}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseCreationSteps;
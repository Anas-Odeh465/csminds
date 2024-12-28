import React, { useState, useEffect } from 'react';
import {useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { ChevronRight, ChevronLeft, BookOpen, Target, Upload, DollarSign, VideoIcon, CheckCircle } from 'lucide-react';

const CourseCreationSteps = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [courseTitle, setCourseTitle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [prerequisites, setPrerequisites] = useState([]);
  const [newPrerequisite, setNewPrerequisite] = useState('');
  const [outcomes, setOutcomes] = useState([]);
  const [newOutcome, setNewOutcome] = useState('');
  const [videos, setVideos] = useState([]);
  const [courseFile, setCourseFile] = useState('');
  const [videofile, setVideoFile] = useState('');
  const [price, setPrice] = useState('');
  const [auth, setAuth] = useState(false);
  const [email, setEmail] = useState('');

  const navigate = useNavigate();

  axios.defaults.withCredentials = true;
  useEffect(() => {
    const fetchAuthStatus = async () => {
      try {
        const res1 = await axios.get('http://localhost:3307');
        
        if (res1.data && res1.data.FirstName) {
          setAuth(true);
          setEmail(res1.data.Email);
        } else {
            
          const res2 = await axios.get('http://localhost:3307/api/users/to');
          if (res2.data && res2.data.user) {
            setAuth(true);
            setEmail(res2.data.user.email);
          } else {
            setAuth(false);
          }
          
        }
      } catch (err) {
        console.error("Error fetching auth status:", err);
        setAuth(false);
      }
    };
  
    fetchAuthStatus();
    
  }, [auth]);

  const categories = [
    'Development',
    'Data science',
    'IT & Software',
    'Personal Development',
    'Design',
    'Marketing',
    'Business',
    'Finance & Accounting',
    'Office Productivity',
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
 
  const handleVideoUpload = (e) => {
    const files = Array.from(e.target.files);
    const newVideos = files.map(file => ({
      file,
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2),
      progress: 0,
      url: URL.createObjectURL(file)
    }));
    setVideos([...videos, ...newVideos]);
  };

  const removeVideo = (index) => {
    setVideos(videos.filter((_, i) => i !== index));
  };

  const handelSubmitSteps = async () => {
    const formData = new FormData();
      formData.append('title', courseTitle);
      formData.append('category', selectedCategory);
      formData.append('level', selectedLevel);
      formData.append('prerequisites', prerequisites);
      formData.append('outcomes', outcomes);
      formData.append('price', price);
      formData.append('email', email);
      formData.append('video', videofile);
      setCourseFile(formData);

    try {
        
        if (courseFile !== '') {
          await axios.post('http://localhost:3307/uploads/course=video', courseFile)
          .then(res => {
            if (res.data === 'steps complete') {
              alert('were done successfully');
              navigate('/become-instructor');
              console.log(res.data);
            } else {
              alert('Failed to create course');
            }
          }).catch(err => {console.log(err)});
          }
    } catch (err) {
      console.error("Error creating course:", err);
      alert('Failed to create course');
    }
  }

  const renderStep = () => {
    if(auth){
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
                {/*selectedCategory && <span className='text-green-600'>{selectedCategory}</span>*/}
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
                <h2 className="text-2xl font-bold">Course Level & Requirements</h2>
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
                <h3 className="text-lg font-semibold">Course Requirements</h3>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newPrerequisite}
                      onChange={(e) => setNewPrerequisite(e.target.value)}
                      placeholder="Add a Requirements..."
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
          case 5:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Upload className="w-6 h-6 text-blue-500" />
              <h2 className="text-2xl font-bold">Upload Course Content</h2>
            </div>

            <div className="space-y-4">
              <label className="block p-6 border-2 border-dashed rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="file"
                  name="video"
                  multiple
                  accept="video/*"
                  onChange={(e) => {setVideoFile(e.target.files[0]); handleVideoUpload(e);}}
                  className="hidden"
                />
                <div className="text-center">
                  <VideoIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">Drop your video files here or click to browse</p>
                </div>
              </label>

              <div className="space-y-2">
                {videos.map((video, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <VideoIcon className="w-4 h-4 text-blue-500" />
                      <div>
                        <div className="font-medium">{video.name}</div>
                        <div className="text-sm text-gray-500">{video.size} MB</div>
                      </div>
                    </div>
                    <button
                      onClick={() => removeVideo(index)}
                      className="text-red-500 hover:text-red-600"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <DollarSign className="w-6 h-6 text-blue-500" />
                <h2 className="text-2xl font-bold">Set Course Price</h2>
              </div>
              
              <div className="relative">
                <input
                  type="number"
                  name="price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Enter course price"
                  min="0"
                  step="0.01"
                  className="w-full p-3 pl-8 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="absolute left-3 top-3 text-gray-500">$</span>
              </div>
            </div>
          </div>
        );
        default:
          return null;
        
      } 
    }
    else{
      <div className="w-screen text-center  mt-[250px] mb-[260px] ">
          <h2 className="text-4xl font-bold text-gray-800 mt-[150px]">
              Access denied 
          </h2>
      </div>
    }       
  };
  if(auth){
    return (
      <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-lg mt-40 mb-16">
        <div className="border-b px-6 py-4 flex items-center justify-between">
          <div className="text-lg font-semibold">Step {currentStep} of 5</div>
          <div className="text-sm text-gray-500">
            {currentStep === 1 && 'Select a category'}
            {currentStep === 2 && 'Create a title'}
            {currentStep === 3 && 'Set level & prerequisites'}
            {currentStep === 4 && 'Define learning outcomes'}
            {currentStep === 5 && 'Upload videos & set price'}
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
              onClick={currentStep === 5 ? (handelSubmitSteps)
                : (() => setCurrentStep(prev => Math.min(5, prev + 1)))}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
            >
              {currentStep === 5 ? 'Finish' : 'Continue'}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
}else{
  <div className="w-screen text-center  mt-[250px] mb-[260px] ">
      <h2 className="text-4xl font-bold text-gray-800 mt-[150px]">
          Access denied 
      </h2>
  </div>
}
};

export default CourseCreationSteps;
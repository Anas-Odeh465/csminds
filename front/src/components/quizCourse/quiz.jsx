import React, { useState } from 'react';
import { Plus, Minus, Save, ArrowLeft } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const QuizCreator = () => {
  const MAX_QUESTIONS = 10;
  const navigate = useNavigate();

  const questionTypes = {
    MULTIPLE_CHOICE: 'multiple_choice',
    TRUE_FALSE: 'true_false',
    SHORT_ANSWER: 'short_answer',
  };

  const [quizTitle, setQuizTitle] = useState('');
  const [description, setDescription] = useState('');
  const [timeLimit, setTimeLimit] = useState('');
  const [showLimitWarning, setShowLimitWarning] = useState(false);
  const [questions, setQuestions] = useState([
    {
      type: questionTypes.MULTIPLE_CHOICE,
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      points: 1
    }
  ]);
  console.log('points: ', questions.points)

  const handleAddQuestion = (type = questionTypes.MULTIPLE_CHOICE) => {
    if (questions.length >= MAX_QUESTIONS) {
      setShowLimitWarning(true);
      setTimeout(() => setShowLimitWarning(false), 3000);
      return;
    }

    const newQuestion = {
      type,
      question: '',
      points: 1,
      ...(type === questionTypes.MULTIPLE_CHOICE && {
        options: ['', '', '', ''],
        correctAnswer: 0
      }),
      ...(type === questionTypes.TRUE_FALSE && {
        correctAnswer: true
      }),
      ...(type === questionTypes.SHORT_ANSWER && {
        correctAnswer: '',
        caseSensitive: false
      })
    };
    
    setQuestions([...questions, newQuestion]);
  };

  const handleRemoveQuestion = (index) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, i) => i !== index));
    }
  };

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...questions];
    if (field === 'option') {
      const [optionIndex, optionValue] = value;
      newQuestions[index].options[optionIndex] = optionValue;
    }else {
      newQuestions[index][field] = value;
    }
    setQuestions(newQuestions);
  };

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const courseId = queryParams.get('idc');
  console.log("Quiz courseId: " + courseId)

  const handleSubmitQuiz = async (e) => {
    e.preventDefault();
    const quizData = {
        quizTitle,
        description,
        timeLimit,
        questions,
        courseId
    };

    try {
        await axios.post('http://localhost:3307/api/createQuiz', quizData);
        navigate('/instructorDashboard');
        
    } catch (error) {
        console.error('Error submitting quiz:', error);
        alert('Failed to submit quiz');
    }
};

  const renderQuestionFields = (question, index) => {
    switch (question.type) {
      case questionTypes.MULTIPLE_CHOICE:
        return (
          <div className="space-y-3">
            <label className="block text-gray-700 font-medium">Answer Options*</label>
            {question.options.map((option, optionIndex) => (
              <div key={optionIndex} className="flex items-center gap-3">
                <input
                  type="radio"
                  name={`correct-${index}`}
                  checked={question.correctAnswer === optionIndex}
                  onChange={() => handleQuestionChange(index, 'correctAnswer', optionIndex)}
                  className="w-4 h-4 text-blue-600"
                />
                <input
                  type="text"
                  value={option}
                  onChange={(e) => 
                    handleQuestionChange(index, 'option', [optionIndex, e.target.value])
                  }
                  placeholder={`Option ${optionIndex + 1}`}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
            ))}
          </div>
        );

      case questionTypes.TRUE_FALSE:
        return (
          <div className="space-y-3">
            <label className="block text-gray-700 font-medium">Correct Answer</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={question.correctAnswer === true}
                  onChange={() => handleQuestionChange(index, 'correctAnswer', true)}
                  className="w-4 h-4 text-blue-600"
                />
                True
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={question.correctAnswer === false}
                  onChange={() => handleQuestionChange(index, 'correctAnswer', false)}
                  className="w-4 h-4 text-blue-600"
                />
                False
              </label>
            </div>
          </div>
        );

      case questionTypes.SHORT_ANSWER:
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Correct Answer*</label>
              <input
                type="text"
                value={question.correctAnswer}
                onChange={(e) => handleQuestionChange(index, 'correctAnswer', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={question.caseSensitive}
                onChange={(e) => handleQuestionChange(index, 'caseSensitive', e.target.checked)}
                className="w-4 h-4 text-blue-600"
              />
              Case sensitive
            </label>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 mt-36">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link to="/instructorprofile" className="text-gray-600 hover:text-gray-800">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Create New Quiz</h1>
          </div>
          <p className="text-gray-600">Add questions and configure quiz settings (Maximum {MAX_QUESTIONS} questions)</p>
        </div>

        {/* Warning message */}
        {showLimitWarning && (
          <div className="mb-4 p-4 bg-yellow-100 text-yellow-800 rounded-lg">
            You've reached the maximum limit of {MAX_QUESTIONS} questions.
          </div>
        )}

        <form onSubmit={handleSubmitQuiz} className="space-y-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Quiz Details</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-gray-700 font-medium mb-2">
                  Quiz Title*
                </label>
                <input
                  id="title"
                  type="text"
                  value={quizTitle}
                  onChange={(e) => setQuizTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md h-24"
                />
              </div>
              <div>
                <label htmlFor="timeLimit" className="block text-gray-700 font-medium mb-2">
                  Time Limit (minutes)
                </label>
                <input
                  id="timeLimit"
                  type="number"
                  value={timeLimit}
                  onChange={(e) => setTimeLimit(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {questions.map((question, questionIndex) => (
              <div
                key={questionIndex}
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-800">
                    Question {questionIndex + 1} of {MAX_QUESTIONS}
                  </h3>
                  <button
                    type="button"
                    onClick={() => handleRemoveQuestion(questionIndex)}
                    className="text-gray-400 hover:text-red-600"
                    disabled={questions.length === 1}
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Question Type*
                    </label>
                    <select
                      value={question.type}
                      onChange={(e) => {
                        const newQuestions = [...questions];
                        newQuestions[questionIndex] = {
                          ...questions[questionIndex],
                          type: e.target.value,
                          ...(e.target.value === questionTypes.MULTIPLE_CHOICE && {
                            options: ['', '', '', ''],
                            correctAnswer: 0
                          }),
                          ...(e.target.value === questionTypes.TRUE_FALSE && {
                            correctAnswer: true
                          }),
                          ...(e.target.value === questionTypes.SHORT_ANSWER && {
                            correctAnswer: '',
                            caseSensitive: false
                          })
                        };
                        setQuestions(newQuestions);
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    >
                      <option value={questionTypes.MULTIPLE_CHOICE}>Multiple Choice</option>
                      <option value={questionTypes.TRUE_FALSE}>True/False</option>
                      <option value={questionTypes.SHORT_ANSWER}>Short Answer</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Question Text*
                    </label>
                    <input
                      type="text"
                      value={question.question}
                      onChange={(e) => handleQuestionChange(questionIndex, 'question', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  {renderQuestionFields(question, questionIndex)}
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            {Object.entries(questionTypes).map(([key, value]) => (
              <button
                key={key}
                type="button"
                onClick={() => handleAddQuestion(value)}
                className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
                <Plus className="w-4 h-4" />
                Add {key.toLowerCase().replace('_', ' ')}
              </button>
            ))}
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              <Save className="w-5 h-5" />
              Save Quiz
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuizCreator;
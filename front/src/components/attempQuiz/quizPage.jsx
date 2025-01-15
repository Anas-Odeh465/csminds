import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Clock, ArrowLeft, Send } from 'lucide-react';
import axios from 'axios';

const Loading = () => (
  <div className="loading">
    Loading Courses
    <span className="dot dot1">.</span>
    <span className="dot dot2">.</span>
    <span className="dot dot3">.</span>
  </div>
);

const QuizPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchQuizID = new URLSearchParams(location.search);
  const quizId = searchQuizID.get('qiud');
  const courseID = searchQuizID.get('idc');
  const [auth, setAuth] = useState(false);
  const [email, setEmail] = useState('');
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleAnswer = (questionIndex, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: answer
    }));
  };

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
            setEmail(res2.data.Email);
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

  useEffect(() => {
    // Fetch quiz data
    axios.get(`http://localhost:3307/post/quizPage?QIDp=${quizId}`)
      .then(response => {
        setQuiz(response.data);
        //console.log('Quiz data: ', response.data);
        setTimeLeft(response.data.quizInfo.time_limit * 60); 
      })
      .catch(err => {
        console.error(err);
      });
  }, [quizId]);

  useEffect(() => {
    let timer;
    if (timeLeft > 0 && !isSubmitted) {
      timer = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            clearInterval(timer);
            handleSubmit();
            return 0; 
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timer); 
  }, [timeLeft, isSubmitted]);

  const renderQuestion = (question, index) => {
    switch (question.question_type) {
      case 'multiple_choice':
        return question.options?.map((option, optionIndex) => (
          <label key={optionIndex} className="flex items-center gap-3">
            <input
              type="radio"
              name={`question-${index}`}
              checked={answers[index] === option.option_text}
              onChange={() => handleAnswer(index, option.option_text)}
            />
            <span>{option.option_text}</span>
          </label>
        ));

      case 'true_false':
        return ['True', 'False'].map((option, optionIndex) => (
          <label key={option} className="flex items-center gap-3">
            <input
              type="radio"
              name={`question-${index}`}
              checked={answers[index] === option}
              onChange={() => handleAnswer(index, option)}
            />
            <span>{option}</span>
          </label>
        ));

      case 'short_answer':
        return (
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            value={answers[index] || ''}
            onChange={(e) => handleAnswer(index, e.target.value)}
          />
        );

      default:
        return <p>Unknown question type.</p>;
    }
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
  
    let score = 0;

    quiz?.questions.forEach((question, index) => {
      const userAnswer = answers[index]; 
  
      if (question.question_type === 'multiple_choice') {
        const correctAnswer = question.options?.find(option => option.is_correct === 1)?.option_text;
        if (userAnswer === correctAnswer) {
          score++;
        }
  
      } else if (question.question_type === 'short_answer') {
        const correctAnswer = question.correct_answer;
        const filterAnswer = Array.isArray(correctAnswer) ? correctAnswer : [correctAnswer];
        if (filterAnswer.find.toString(userAnswer)) {
          score++;
        }
  
      } else if (question.question_type === 'true_false') {
        const correctAnswer = question.correct_answer === 1 ? 1 : 0;
        if (userAnswer === 'True' && correctAnswer === 1){
          score++;
        }
        else if (userAnswer === 'False' && correctAnswer === 0){
          score++;
        }
      }
    });
    axios.get(`http://localhost:3307/api/quizzes/attemp?QIDp=${quizId}&userEmail=${email}&score=${score}`)
    .then(response => {
       if(response){
        navigate(`/showcoursevideo?idc=${courseID}&scoreaf=${score}`);
       }
     })
    .catch(error => {
       console.error('Error fetching quiz:', error);
     });
    
  }

  return (
    <div className="min-h-screen w-screen mt-36 bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-bold text-gray-900">{quiz?.quizInfo?.quiz_title || <Loading />}</h1>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="w-5 h-5" />
              <span>{Math.floor(timeLeft / 60) || 0}:{(timeLeft % 60 || 0).toString().padStart(2, '0')}</span>
            </div>
          </div>
          <p className="mt-2 text-gray-600">{quiz?.quizInfo?.quiz_description || 'Loading description...'}</p>
        </div>

        {/* Questions */}
        <div className="space-y-8">
          {quiz?.questions?.map((question, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-sm text-gray-500">Question {index + 1}</span>
                  <h3 className="text-lg font-medium text-gray-900">{question.question_text}</h3>
                </div>
                <span className="text-sm text-gray-500">{question.points} points</span>
              </div>
              {renderQuestion(question, index)}
            </div>
          ))}
        </div>

        {/* Submit button */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={isSubmitted}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
            Submit Quiz
          </button>
        </div>
      </div>
    </div>
  );
};
export default QuizPage;

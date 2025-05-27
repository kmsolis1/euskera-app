import React, { useState, useEffect } from 'react';
import { Home, Users, Award, Settings, Star, Heart, Flame, Book, CheckCircle, XCircle, Trophy, Crown, Lock, Target, Zap, Sparkles, User, Calendar, Clock, TrendingUp, Edit3 } from 'lucide-react';

const EuskeraApp = () => {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', content: '' });
  const [currentLesson, setCurrentLesson] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [lessonComplete, setLessonComplete] = useState(false);
  const [hearts, setHearts] = useState(5);
  const [xp, setXp] = useState(120);
  const [streak, setStreak] = useState(1);
  const [userProgress, setUserProgress] = useState({ 1: true, 2: false });
  const [isPremium, setIsPremium] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showCorrectAnimation, setShowCorrectAnimation] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  
  // Profile data
  const [userProfile, setUserProfile] = useState({
    name: "Euskera Learner",
    email: "learner@example.com",
    joinDate: "2025-05-26",
    totalLessons: 1,
    totalQuestions: 4,
    correctAnswersTotal: 4,
    longestStreak: 1,
    dailyGoal: 10,
    weeklyGoal: 3,
    lastActiveDate: "2025-05-26",
    streakHistory: ["2025-05-26"],
    studyTime: 5
  });

  // Lessons data
  const lessons = [
    {
      id: 1,
      title: "Basic Greetings",
      description: "Learn essential Basque greetings",
      difficulty: "Beginner",
      xp: 15,
      isPremium: false,
      category: "Basics",
      questions: [
        {
          type: "multiple-choice",
          question: "How do you say 'Hello' in Basque?",
          options: ["Kaixo", "Agur", "Eskerrik asko", "Mesedez"],
          correct: "Kaixo",
          translation: "Hello",
          explanation: "Kaixo is the most common informal greeting in Basque, similar to 'Hi' or 'Hello' in English."
        },
        {
          type: "translation",
          question: "What does 'Egun on' mean in English?",
          basque: "Egun on",
          options: ["Good morning", "Good night", "Thank you", "Please"],
          correct: "Good morning",
          translation: "Good morning",
          explanation: "Egun on literally means 'good day' and is used as a morning greeting."
        },
        {
          type: "multiple-choice",
          question: "How do you say 'Thank you very much' in Basque?",
          options: ["Kaixo", "Agur", "Eskerrik asko", "Barkatu"],
          correct: "Eskerrik asko",
          translation: "Thank you very much",
          explanation: "Eskerrik asko means 'thank you very much' - the most polite way to express gratitude."
        },
        {
          type: "translation",
          question: "What does 'Agur' mean in English?",
          basque: "Agur",
          options: ["Hello", "Goodbye", "Please", "Sorry"],
          correct: "Goodbye",
          translation: "Goodbye",
          explanation: "Agur is used when leaving or saying farewell to someone."
        }
      ]
    },
    {
      id: 2,
      title: "Numbers 1-10",
      description: "Count from one to ten in Basque",
      difficulty: "Beginner",
      xp: 20,
      isPremium: false,
      category: "Basics",
      questions: [
        {
          type: "multiple-choice",
          question: "What is 'bat' in English?",
          basque: "bat",
          options: ["One", "Two", "Three", "Four"],
          correct: "One",
          translation: "One",
          explanation: "Bat is the number one in Basque."
        },
        {
          type: "multiple-choice",
          question: "How do you say 'Three' in Basque?",
          options: ["bi", "hiru", "lau", "bost"],
          correct: "hiru",
          translation: "Three",
          explanation: "Hiru is the Basque word for the number three."
        },
        {
          type: "translation",
          question: "What number is 'hamar'?",
          basque: "hamar",
          options: ["Eight", "Nine", "Ten", "Seven"],
          correct: "Ten",
          translation: "Ten",
          explanation: "Hamar is the highest single digit number in Basque counting."
        },
        {
          type: "multiple-choice",
          question: "How do you say 'Five' in Basque?",
          options: ["lau", "bost", "sei", "zazpi"],
          correct: "bost",
          translation: "Five",
          explanation: "Bost means five in Basque."
        }
      ]
    }
  ];

  const openModal = (title, content) => {
    setModalContent({ title, content });
    setShowModal(true);
  };

  const startLesson = (lessonIndex) => {
    const lesson = lessons[lessonIndex];
    if (lesson.isPremium && !isPremium) {
      openModal('Premium Required', 'This lesson is part of Euskera Plus. Upgrade to access all intermediate and advanced lessons, unlimited hearts, and premium features!');
      return;
    }
    
    setCurrentLesson(lessonIndex);
    setCurrentQuestion(0);
    setSelectedAnswer('');
    setShowResult(false);
    setLessonComplete(false);
    setCorrectAnswers(0);
    setCurrentScreen('lesson');
  };

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
    setShowResult(true);
    
    const currentQ = lessons[currentLesson].questions[currentQuestion];
    const isCorrect = answer === currentQ.correct;
    
    if (isCorrect) {
      setXp(prevXp => prevXp + 5);
      setCorrectAnswers(prev => prev + 1);
      setShowCorrectAnimation(true);
      setTimeout(() => setShowCorrectAnimation(false), 1000);
    } else {
      setHearts(prevHearts => Math.max(0, prevHearts - 1));
    }
    
    setTimeout(() => {
      if (currentQuestion < lessons[currentLesson].questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer('');
        setShowResult(false);
      } else {
        setLessonComplete(true);
        const newProgress = { ...userProgress };
        newProgress[lessons[currentLesson].id] = true;
        setUserProgress(newProgress);
        setXp(prevXp => prevXp + lessons[currentLesson].xp);
      }
    }, 2000);
  };

  const goHome = () => {
    setCurrentScreen('home');
    setCurrentQuestion(0);
    setSelectedAnswer('');
    setShowResult(false);
    setLessonComplete(false);
    setCorrectAnswers(0);
  };

  const groupedLessons = lessons.reduce((acc, lesson) => {
    if (!acc[lesson.category]) {
      acc[lesson.category] = [];
    }
    acc[lesson.category].push(lesson);
    return acc;
  }, {});

  // Navigation component
  const Navigation = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-around py-3">
          <button 
            onClick={() => setCurrentScreen('home')}
            className={`flex flex-col items-center space-y-1 transition-colors ${currentScreen === 'home' ? 'text-blue-600' : 'text-gray-400'}`}
          >
            <Home className="w-6 h-6" />
            <span className="text-xs font-medium">Home</span>
          </button>
          <button 
            onClick={() => setCurrentScreen('profile')}
            className={`flex flex-col items-center space-y-1 transition-colors ${currentScreen === 'profile' ? 'text-blue-600' : 'text-gray-400'}`}
          >
            <User className="w-6 h-6" />
            <span className="text-xs font-medium">Profile</span>
          </button>
          <button 
            onClick={() => setCurrentScreen('friends')}
            className={`flex flex-col items-center space-y-1 transition-colors ${currentScreen === 'friends' ? 'text-blue-600' : 'text-gray-400'}`}
          >
            <Users className="w-6 h-6" />
            <span className="text-xs font-medium">Friends</span>
          </button>
          <button 
            onClick={() => setCurrentScreen('achievements')}
            className={`flex flex-col items-center space-y-1 transition-colors ${currentScreen === 'achievements' ? 'text-blue-600' : 'text-gray-400'}`}
          >
            <Award className="w-6 h-6" />
            <span className="text-xs font-medium">Achievements</span>
          </button>
          <button 
            onClick={() => setCurrentScreen('settings')}
            className={`flex flex-col items-center space-y-1 transition-colors ${currentScreen === 'settings' ? 'text-blue-600' : 'text-gray-400'}`}
          >
            <Settings className="w-6 h-6" />
            <span className="text-xs font-medium">Settings</span>
          </button>
        </div>
      </div>
    </div>
  );

  // Home Screen
  const HomeScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 pb-20">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
              E
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Euskera</h1>
              <p className="text-sm text-gray-600">Welcome back!</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {!isPremium && (
              <button 
                onClick={() => openModal('Upgrade to Premium', 'Unlock all lessons, unlimited hearts, offline mode, and premium features for just $9.99/month!')}
                className="flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:shadow-lg transition-all duration-200 hover:scale-105"
              >
                <Crown className="w-4 h-4" />
                <span>Plus</span>
              </button>
            )}
            <div className="flex items-center space-x-2 text-orange-600">
              <Flame className="w-5 h-5" />
              <span className="font-bold">{streak}</span>
            </div>
            <div className="flex items-center space-x-2 text-red-500">
              <Heart className="w-5 h-5" />
              <span className="font-bold">{hearts}</span>
            </div>
            <div className="flex items-center space-x-2 text-yellow-600">
              <Star className="w-5 h-5" />
              <span className="font-bold">{xp}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-gradient-to-r from-blue-500 to-green-500 rounded-2xl shadow-xl p-6 mb-8 text-white">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <Zap className="w-6 h-6 mr-2" />
            Your Progress
          </h3>
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">{Object.values(userProgress).filter(Boolean).length}</div>
              <div className="text-blue-100">Lessons Completed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">{streak}</div>
              <div className="text-blue-100">Day Streak</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">{xp}</div>
              <div className="text-blue-100">Total XP</div>
            </div>
          </div>
        </div>

        {Object.entries(groupedLessons).map(([category, categoryLessons]) => (
          <div key={category} className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              {category}
              {category !== 'Basics' && (
                <Crown className="w-6 h-6 text-yellow-500 ml-2" />
              )}
            </h2>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {categoryLessons.map((lesson, index) => {
                const globalIndex = lessons.findIndex(l => l.id === lesson.id);
                const isLocked = lesson.isPremium && !isPremium;
                const isCompleted = userProgress[lesson.id];
                
                return (
                  <div key={lesson.id} className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 ${isLocked ? 'opacity-75' : 'hover:-translate-y-1'}`}>
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          isCompleted ? 'bg-green-100 text-green-600' : 
                          isLocked ? 'bg-gray-100 text-gray-400' : 'bg-blue-100 text-blue-600'
                        }`}>
                          {isLocked ? <Lock className="w-6 h-6" /> : 
                           isCompleted ? <CheckCircle className="w-6 h-6" /> : <Book className="w-6 h-6" />}
                        </div>
                        <div className="flex items-center space-x-2">
                          {lesson.isPremium && (
                            <Crown className="w-4 h-4 text-yellow-500" />
                          )}
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            lesson.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
                            lesson.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {lesson.difficulty}
                          </span>
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">{lesson.title}</h3>
                      <p className="text-gray-600 mb-4">{lesson.description}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-yellow-600">
                          <Star className="w-4 h-4" />
                          <span className="text-sm font-medium">{lesson.xp} XP</span>
                        </div>
                        
                        <button
                          onClick={() => startLesson(globalIndex)}
                          className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                            isLocked 
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              : isCompleted 
                              ? 'bg-green-600 hover:bg-green-700 text-white hover:scale-105' 
                              : 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-105'
                          }`}
                        >
                          {isLocked ? 'Premium' : (isCompleted ? 'Review' : 'Start')}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <Navigation />
    </div>
  );

  // Lesson Screen
  const LessonScreen = () => {
    const lesson = lessons[currentLesson];
    const question = lesson.questions[currentQuestion];
    const isCorrect = selectedAnswer === question.correct;

    if (lessonComplete) {
      const finalAccuracy = Math.round((correctAnswers / lesson.questions.length) * 100);
      const perfectScore = finalAccuracy === 100;
      
      return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 text-center relative overflow-hidden">
            {perfectScore && (
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 animate-pulse"></div>
            )}
            
            <div className="relative z-10">
              <div className="mb-6">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
                  perfectScore ? 'bg-yellow-100' : 'bg-green-100'
                }`}>
                  {perfectScore ? (
                    <Crown className="w-10 h-10 text-yellow-600" />
                  ) : (
                    <Trophy className="w-10 h-10 text-green-600" />
                  )}
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {perfectScore ? 'Perfect!' : 'Lesson Complete!'}
                </h2>
                <p className="text-gray-600 mt-2">
                  {perfectScore ? 'Flawless performance!' : `Great job learning ${lesson.title}`}
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">XP Earned</span>
                  <span className="font-bold text-yellow-600 flex items-center">
                    <Star className="w-4 h-4 mr-1" />
                    +{lesson.xp}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Accuracy</span>
                  <span className={`font-bold ${perfectScore ? 'text-yellow-600' : 'text-green-600'}`}>
                    {finalAccuracy}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Correct Answers</span>
                  <span className="font-bold text-blue-600">
                    {correctAnswers}/{lesson.questions.length}
                  </span>
                </div>
              </div>
              
              {perfectScore && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
                  <div className="flex items-center justify-center space-x-2 text-yellow-800">
                    <Sparkles className="w-5 h-5" />
                    <span className="font-medium">Perfect Score Bonus!</span>
                    <Sparkles className="w-5 h-5" />
                  </div>
                </div>
              )}
              
              <button
                onClick={goHome}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
              >
                Continue Learning
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
        {showCorrectAnimation && (
          <div className="fixed inset-0 bg-green-500/20 flex items-center justify-center z-50 pointer-events-none">
            <div className="bg-white rounded-full p-6 shadow-2xl animate-bounce">
              <CheckCircle className="w-16 h-16 text-green-600" />
            </div>
          </div>
        )}
        
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <button onClick={goHome} className="text-gray-600 hover:text-gray-800 text-2xl">
                ←
              </button>
              
              <div className="flex-1 mx-4">
                <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${((currentQuestion + 1) / lesson.questions.length) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1 text-red-500">
                  <Heart className="w-5 h-5" />
                  <span className="font-bold">{hearts}</span>
                </div>
                <div className="flex items-center space-x-1 text-yellow-600">
                  <Star className="w-5 h-5" />
                  <span className="font-bold">{xp}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800">{question.question}</h2>
                <div className="flex items-center space-x-2">
                  <Target className="w-5 h-5 text-blue-500" />
                  <span className="text-sm text-gray-600">
                    {currentQuestion + 1}/{lesson.questions.length}
                  </span>
                </div>
              </div>
              
              {question.basque && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mb-4 border border-blue-100">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-800 mb-2">{question.basque}</div>
                    <div className="text-sm text-blue-600 uppercase tracking-wide">Basque</div>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-3 mb-8">
              {question.options.map((option, index) => {
                let buttonClass = "w-full p-4 text-left border-2 rounded-xl font-medium transition-all duration-200 ";
                
                if (showResult) {
                  if (option === question.correct) {
                    buttonClass += "border-green-500 bg-green-50 text-green-800 shadow-lg scale-[1.02]";
                  } else if (option === selectedAnswer && option !== question.correct) {
                    buttonClass += "border-red-500 bg-red-50 text-red-800";
                  } else {
                    buttonClass += "border-gray-200 bg-gray-50 text-gray-500";
                  }
                } else if (selectedAnswer === option) {
                  buttonClass += "border-blue-500 bg-blue-50 text-blue-800 shadow-md";
                } else {
                  buttonClass += "border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-gray-800 hover:shadow-md";
                }

                return (
                  <button
                    key={index}
                    onClick={() => !showResult && handleAnswerSelect(option)}
                    className={buttonClass}
                    disabled={showResult}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-lg">{option}</span>
                      {showResult && option === question.correct && (
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      )}
                      {showResult && option === selectedAnswer && option !== question.correct && (
                        <XCircle className="w-6 h-6 text-red-600" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {showResult && (
              <div className={`p-6 rounded-xl mb-6 border-2 ${
                isCorrect 
                  ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200' 
                  : 'bg-gradient-to-r from-red-50 to-pink-50 border-red-200'
              }`}>
                <div className="flex items-start space-x-4">
                  {isCorrect ? (
                    <CheckCircle className="w-8 h-8 text-green-600 flex-shrink-0 mt-1" />
                  ) : (
                    <XCircle className="w-8 h-8 text-red-600 flex-shrink-0 mt-1" />
                  )}
                  <div className="flex-1">
                    <div className={`font-bold text-lg mb-2 ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                      {isCorrect ? 'Excellent!' : 'Not quite right'}
                    </div>
                    <div className={`text-base mb-2 ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                      {question.basque ? (
                        <span><strong>"{question.basque}"</strong> means <strong>"{question.translation}"</strong></span>
                      ) : (
                        <span><strong>"{question.correct}"</strong> means <strong>"{question.translation}"</strong></span>
                      )}
                    </div>
                    {question.explanation && (
                      <div className={`text-sm ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                        💡 {question.explanation}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="text-center">
              <div className="inline-flex items-center space-x-2 bg-gray-100 rounded-full px-4 py-2">
                <div className="flex space-x-1">
                  {Array.from({ length: lesson.questions.length }, (_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full ${
                        i < currentQuestion 
                          ? 'bg-green-500' 
                          : i === currentQuestion 
                          ? 'bg-blue-500' 
                          : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Profile Screen
  const ProfileScreen = () => {
    const accuracy = userProfile.totalQuestions > 0 ? Math.round((userProfile.correctAnswersTotal / userProfile.totalQuestions) * 100) : 0;
    const joinedDaysAgo = Math.floor((new Date() - new Date(userProfile.joinDate)) / (1000 * 60 * 60 * 24));
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 pb-20">
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => setCurrentScreen('home')}
                  className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white font-bold text-lg"
                >
                  E
                </button>
                <h1 className="text-2xl font-bold text-gray-800">Profile</h1>
              </div>
              <button
                onClick={() => setShowEditProfile(true)}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm transition-colors"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit</span>
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-500 to-green-500 rounded-2xl shadow-xl p-6 mb-8 text-white">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold">
                {userProfile.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{userProfile.name}</h2>
                <p className="text-blue-100">{userProfile.email}</p>
                <p className="text-blue-100 text-sm">
                  Joined {joinedDaysAgo === 0 ? 'today' : `${joinedDaysAgo} days ago`}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{streak}</div>
                <div className="text-blue-100 text-sm">Day Streak</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{xp}</div>
                <div className="text-blue-100 text-sm">Total XP</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{userProfile.totalLessons}</div>
                <div className="text-blue-100 text-sm">Lessons</div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-4 text-center">
              <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">{accuracy}%</div>
              <div className="text-gray-600 text-sm">Accuracy</div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-4 text-center">
              <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">{userProfile.studyTime}</div>
              <div className="text-gray-600 text-sm">Minutes</div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-4 text-center">
              <Target className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-600">{userProfile.totalQuestions}</div>
              <div className="text-gray-600 text-sm">Questions</div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-4 text-center">
              <Flame className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-orange-600">{userProfile.longestStreak}</div>
              <div className="text-gray-600 text-sm">Best Streak</div>
            </div>
          </div>

          {/* Goals Section */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <Target className="w-6 h-6 mr-2 text-blue-600" />
              Learning Goals
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-700">Daily Goal</span>
                  <span className="text-sm text-gray-500">{userProfile.studyTime}/{userProfile.dailyGoal} min</span>
                </div>
                <div className="bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min((userProfile.studyTime / userProfile.dailyGoal) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-700">Weekly Goal</span>
                  <span className="text-sm text-gray-500">{userProfile.totalLessons}/{userProfile.weeklyGoal} lessons</span>
                </div>
                <div className="bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min((userProfile.totalLessons / userProfile.weeklyGoal) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <Calendar className="w-6 h-6 mr-2 text-green-600" />
              Recent Activity
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">Completed Basic Greetings</div>
                    <div className="text-sm text-gray-500">Today</div>
                  </div>
                </div>
                <div className="text-yellow-600 font-semibold">+15 XP</div>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Flame className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">Started daily streak</div>
                    <div className="text-sm text-gray-500">Today</div>
                  </div>
                </div>
                <div className="text-orange-600 font-semibold">Day 1</div>
              </div>
            </div>
          </div>
        </div>

        <Navigation />
      </div>
    );
  };

  // Simple screens for other navigation items
  const FriendsScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 pb-20">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setCurrentScreen('home')}
              className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white font-bold text-lg"
            >
              E
            </button>
            <h1 className="text-2xl font-bold text-gray-800">Friends</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Learning Community</h2>
          
          <div className="text-center py-8">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">Start Your Community</h3>
            <p className="text-gray-500 mb-4">Invite friends to learn Basque together!</p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg transition-colors">
              Invite Friends
            </button>
          </div>
        </div>
      </div>

      <Navigation />
    </div>
  );

  const AchievementsScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 pb-20">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setCurrentScreen('home')}
              className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white font-bold text-lg"
            >
              E
            </button>
            <h1 className="text-2xl font-bold text-gray-800">Achievements</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-blue-600">{Object.values(userProgress).filter(Boolean).length}</div>
            <div className="text-gray-600 text-sm">Lessons</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-orange-600">{streak}</div>
            <div className="text-gray-600 text-sm">Day Streak</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-yellow-600">{xp}</div>
            <div className="text-gray-600 text-sm">Total XP</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-green-600">2</div>
            <div className="text-gray-600 text-sm">Achievements</div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Your Achievements</h3>
          <div className="space-y-4">
            <div className="p-4 rounded-lg border-2 border-yellow-300 bg-yellow-50">
              <div className="flex items-center space-x-3">
                <span className="text-3xl">🎯</span>
                <div className="flex-1">
                  <h4 className="font-semibold text-yellow-800">First Steps</h4>
                  <p className="text-sm text-yellow-700">Complete your first lesson</p>
                </div>
                <Trophy className="w-6 h-6 text-yellow-600" />
              </div>
            </div>

            <div className="p-4 rounded-lg border-2 border-yellow-300 bg-yellow-50">
              <div className="flex items-center space-x-3">
                <span className="text-3xl">🔥</span>
                <div className="flex-1">
                  <h4 className="font-semibold text-yellow-800">Week Warrior</h4>
                  <p className="text-sm text-yellow-700">Maintain a 7-day streak</p>
                </div>
                <Trophy className="w-6 h-6 text-yellow-600" />
              </div>
            </div>

            <div className="p-4 rounded-lg border-2 border-gray-200 bg-gray-50">
              <div className="flex items-center space-x-3">
                <span className="text-3xl">📚</span>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-500">Scholar</h4>
                  <p className="text-sm text-gray-400">Complete 5 lessons</p>
                </div>
                <Lock className="w-6 h-6 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Navigation />
    </div>
  );

  const SettingsScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 pb-20">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setCurrentScreen('home')}
              className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white font-bold text-lg"
            >
              E
            </button>
            <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {!isPremium && (
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl shadow-lg p-6 mb-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold mb-2">Upgrade to Euskera Plus</h3>
                <p className="text-yellow-100">Unlock all lessons, unlimited hearts, and premium features!</p>
              </div>
              <Crown className="w-12 h-12 text-yellow-200" />
            </div>
            <button 
              onClick={() => openModal('Upgrade to Premium', 'Euskera Plus Features:\n\n• All 8 lessons (including Business Basque)\n• Unlimited hearts\n• Offline mode\n• Priority support\n• Advanced grammar explanations\n\nOnly $9.99/month!')}
              className="mt-4 bg-white text-orange-600 font-semibold py-2 px-6 rounded-lg hover:bg-yellow-50 transition-colors"
            >
              Upgrade Now
            </button>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">App Settings</h3>
          <div className="space-y-3">
            <button 
              onClick={() => openModal('Privacy Policy', 'At Euskera, we take your privacy seriously. We collect minimal data necessary to provide our language learning service. Your learning progress is stored securely and never shared with third parties. We use industry-standard encryption to protect your data. You can request deletion of your data at any time by contacting support.')}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-6 rounded-lg text-left transition-colors"
            >
              Privacy Policy
            </button>
            <button 
              onClick={() => openModal('Terms of Service', 'By using Euskera, you agree to our terms. Our service is provided "as is" for educational purposes. You are responsible for maintaining the confidentiality of your account. We reserve the right to modify the service and these terms. Prohibited uses include sharing accounts or using the service for commercial purposes without permission.')}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-6 rounded-lg text-left transition-colors"
            >
              Terms of Service
            </button>
            <button 
              onClick={() => openModal('Contact Support', 'Need help with Euskera? We are here to help!\n\n📧 Email us at: euskerasupport@gmail.com\n\nWe typically respond within 24-48 hours. For technical issues, please include:\n• Your device type (mobile/desktop)\n• Browser you are using\n• Description of the issue\n\nYou can also provide feedback through your app store reviews!')}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-6 rounded-lg text-left transition-colors"
            >
              Contact Support
            </button>
          </div>
        </div>
      </div>

      <Navigation />
    </div>
  );

  // Edit Profile Modal
  const EditProfileModal = () => {
    const [editedProfile, setEditedProfile] = useState({
      name: userProfile.name,
      email: userProfile.email,
      dailyGoal: userProfile.dailyGoal,
      weeklyGoal: userProfile.weeklyGoal
    });
    
    if (!showEditProfile) return null;

    const handleSave = () => {
      setUserProfile(prev => ({
        ...prev,
        ...editedProfile
      }));
      setShowEditProfile(false);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">Edit Profile</h2>
              <button
                onClick={() => setShowEditProfile(false)}
                className="text-gray-600 hover:text-gray-800 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={editedProfile.name}
                  onChange={(e) => setEditedProfile({...editedProfile, name: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={editedProfile.email}
                  onChange={(e) => setEditedProfile({...editedProfile, email: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Daily Goal (minutes)</label>
                <input
                  type="number"
                  value={editedProfile.dailyGoal}
                  onChange={(e) => setEditedProfile({...editedProfile, dailyGoal: parseInt(e.target.value)})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Weekly Goal (lessons)</label>
                <input
                  type="number"
                  value={editedProfile.weeklyGoal}
                  onChange={(e) => setEditedProfile({...editedProfile, weeklyGoal: parseInt(e.target.value)})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowEditProfile(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-6 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Modal Component
  const Modal = ({ isOpen, onClose, title, content }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">{title}</h2>
              <button
                onClick={onClose}
                className="text-gray-600 hover:text-gray-800 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
              >
                ×
              </button>
            </div>
            <div className="text-gray-600 leading-relaxed mb-6 whitespace-pre-line">
              {content}
            </div>
            <button
              onClick={onClose}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Main App Render
  return (
    <div className="font-sans">
      {currentScreen === 'home' && <HomeScreen />}
      {currentScreen === 'profile' && <ProfileScreen />}
      {currentScreen === 'friends' && <FriendsScreen />}
      {currentScreen === 'achievements' && <AchievementsScreen />}
      {currentScreen === 'settings' && <SettingsScreen />}
      {currentScreen === 'lesson' && <LessonScreen />}
      
      <Modal 
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={modalContent.title}
        content={modalContent.content}
      />
      
      <EditProfileModal />
    </div>
  );
};

export default EuskeraApp;

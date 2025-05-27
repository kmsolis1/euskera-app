import React, { useState, useEffect } from 'react';
import { Home, Users, Award, Settings, Star, Heart, Flame, Book, CheckCircle, XCircle, Trophy, Crown, Lock, Target, Zap, Sparkles, User, Calendar, Clock, TrendingUp, Edit3 } from 'lucide-react';

const EuskeraApp = () => {
  // Basic app state
  const [currentScreen, setCurrentScreen] = useState('home');
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', content: '' });
  
  // Lesson state
  const [currentLesson, setCurrentLesson] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [lessonComplete, setLessonComplete] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showCorrectAnimation, setShowCorrectAnimation] = useState(false);
  
  // User progress state
  const [hearts, setHearts] = useState(5);
  const [xp, setXp] = useState(120);
  const [streak, setStreak] = useState(1);
  const [userProgress, setUserProgress] = useState({ 1: true, 2: false });
  const [isPremium, setIsPremium] = useState(false);
  
  // Profile state
  const [showEditProfile, setShowEditProfile] = useState(false);
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
  
  // Ad state
  const [showAdModal, setShowAdModal] = useState(false);
  const [adModalType, setAdModalType] = useState('');
  const [showInterstitialAd, setShowInterstitialAd] = useState(false);
  const [lessonsCompletedToday, setLessonsCompletedToday] = useState(0);

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
          explanation: "Kaixo is the most common informal greeting in Basque."
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
          explanation: "Eskerrik asko means 'thank you very much'."
        },
        {
          type: "translation",
          question: "What does 'Agur' mean in English?",
          basque: "Agur",
          options: ["Hello", "Goodbye", "Please", "Sorry"],
          correct: "Goodbye",
          translation: "Goodbye",
          explanation: "Agur is used when leaving or saying farewell."
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
          explanation: "Hiru is the Basque word for three."
        },
        {
          type: "translation",
          question: "What number is 'hamar'?",
          basque: "hamar",
          options: ["Eight", "Nine", "Ten", "Seven"],
          correct: "Ten",
          translation: "Ten",
          explanation: "Hamar is ten in Basque."
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

  // Helper functions
  const openModal = (title, content) => {
    setModalContent({ title, content });
    setShowModal(true);
  };

  const startLesson = (lessonIndex) => {
    const lesson = lessons[lessonIndex];
    if (lesson.isPremium && !isPremium) {
      openModal('Premium Required', 'This lesson is part of Euskera Plus. Upgrade to access all lessons and remove ads!');
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
        
        setLessonsCompletedToday(prev => prev + 1);
        
        if (!isPremium && lessonsCompletedToday > 0 && (lessonsCompletedToday + 1) % 3 === 0) {
          setTimeout(() => setShowInterstitialAd(true), 2000);
        }
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

  // Ad functions
  const watchAdForReward = (type) => {
    setAdModalType(type);
    setShowAdModal(true);
  };

  const completeAdReward = () => {
    switch(adModalType) {
      case 'hearts':
        setHearts(5);
        break;
      case 'xp':
        setXp(prev => prev + 20);
        break;
      default:
        break;
    }
    setShowAdModal(false);
    setAdModalType('');
  };

  const groupedLessons = lessons.reduce((acc, lesson) => {
    if (!acc[lesson.category]) {
      acc[lesson.category] = [];
    }
    acc[lesson.category].push(lesson);
    return acc;
  }, {});

  // Components
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
                onClick={() => openModal('Remove Ads', 'Remove all ads and unlock premium features for just $9.99/month!\n\n✨ No advertisements\n🔥 Unlimited hearts\n📚 All lessons unlocked\n⚡ Priority support')}
                className="flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:shadow-lg transition-all duration-200 hover:scale-105"
              >
                <Crown className="w-4 h-4" />
                <span>Remove Ads</span>
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
              {categoryLessons.map((lesson) => {
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

        {/* Banner Ad for Non-Premium */}
        {!isPremium && (
          <div className="mb-8">
            <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-500 mb-2">Advertisement</p>
              <div className="bg-gradient-to-r from-blue-100 to-green-100 rounded p-6">
                <h4 className="font-semibold text-gray-700 mb-2">Learn Spanish Next!</h4>
                <p className="text-sm text-gray-600 mb-3">Master multiple languages with our partner app</p>
                <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 transition-colors">
                  Try SpanishPro Free
                </button>
              </div>
              <button 
                onClick={() => openModal('Remove Ads', 'Tired of ads? Upgrade to Premium!\n\n✨ No advertisements\n🔥 Unlimited hearts\n📚 All lessons unlocked')}
                className="text-xs text-blue-600 hover:underline mt-2"
              >
                Remove ads
              </button>
            </div>
          </div>
        )}
      </div>

      <Navigation />
    </div>
  );

  // Hearts depleted screen
  const HeartsDepletedScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Heart className="w-10 h-10 text-red-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Out of Hearts!</h2>
        <p className="text-gray-600 mb-6">You've run out of hearts. Watch an ad to get more hearts or upgrade to premium for unlimited hearts.</p>
        
        <div className="space-y-3 mb-6">
          <button
            onClick={() => watchAdForReward('hearts')}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-6 rounded-lg font-medium hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <span>📺</span>
            <span>Watch Ad - Get Full Hearts</span>
          </button>
          
          <button
            onClick={() => openModal('Upgrade to Premium', 'Get unlimited hearts and remove all ads!\n\n💖 Unlimited hearts\n✨ No advertisements\n📚 All lessons unlocked\n\nUpgrade now for $9.99/month')}
            className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white py-3 px-6 rounded-lg font-medium hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <Crown className="w-5 h-5" />
            <span>Get Premium - Unlimited Hearts</span>
          </button>
        </div>
        
        <button
          onClick={goHome}
          className="text-gray-500 hover:text-gray-700 text-sm"
        >
          Wait for hearts to refill (4h 23m)
        </button>
      </div>
    </div>
  );

  const LessonScreen = () => {
    const lesson = lessons[currentLesson];
    const question = lesson.questions[currentQuestion];
    const isCorrect = selectedAnswer === question.correct;

    if (hearts <= 0 && !isPremium) {
      return <HeartsDepletedScreen />;
    }

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
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors mb-4"
              >
                Continue Learning
              </button>
              
              {!isPremium && (
                <button
                  onClick={() => watchAdForReward('xp')}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium py-2 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2 text-sm"
                >
                  <span>📺</span>
                  <span>Watch Ad for +20 Bonus XP</span>
                </button>
              )}
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
                  {!isPremium && hearts < 3 && (
                    <button
                      onClick={() => watchAdForReward('hearts')}
                      className="ml-2 text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 transition-colors"
                    >
                      +5 ❤️
                    </button>
                  )}
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

  // Simple placeholder screens
  const ProfileScreen = () => (
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
            <h1 className="text-2xl font-bold text-gray-800">Profile</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <User className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{userProfile.name}</h2>
          <p className="text-gray-600 mb-4">{userProfile.email}</p>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{streak}</div>
              <div className="text-gray-600 text-sm">Day Streak</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{xp}</div>
              <div className="text-gray-600 text-sm">Total XP</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{userProfile.totalLessons}</div>
              <div className="text-gray-600 text-sm">Lessons</div>
            </div>
          </div>
        </div>
      </div>

      <Navigation />
    </div>
  );

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
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">App Settings</h3>
          <div className="space-y-3">
            <button 
              onClick={() => openModal('Privacy Policy', 'At Euskera, we take your privacy seriously. We collect minimal data necessary to provide our language learning service.')}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-6 rounded-lg text-left transition-colors"
            >
              Privacy Policy
            </button>
            <button 
              onClick={() => openModal('Terms of Service', 'By using Euskera, you agree to our terms of service.')}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-6 rounded-lg text-left transition-colors"
            >
              Terms of Service
            </button>
          </div>
        </div>
      </div>

      <Navigation />
    </div>
  );

  // Ad Modals
  const RewardedAdModal = () => {
    const [adProgress, setAdProgress] = useState(0);
    const [adComplete, setAdComplete] = useState(false);

    useEffect(() => {
      if (showAdModal && !adComplete) {
        const timer = setInterval(() => {
          setAdProgress(prev => {
            if (prev >= 100) {
              setAdComplete(true);
              clearInterval(timer);
              return 100;
            }
            return prev + 5;
          });
        }, 150);

        return () => clearInterval(timer);
      }
    }, [showAdModal, adComplete]);

    useEffect(() => {
      if (showAdModal) {
        setAdProgress(0);
        setAdComplete(false);
      }
    }, [showAdModal]);

    if (!showAdModal) return null;

    const getRewardText = () => {
      switch(adModalType) {
        case 'hearts': return 'Full Hearts Restored!';
        case 'xp': return '+20 Bonus XP!';
        default: return 'Reward Earned!';
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full text-center p-6">
          {!adComplete ? (
            <>
              <h2 className="text-xl font-bold text-gray-800 mb-4">Watching Ad...</h2>
              <div className="bg-gray-200 rounded-full h-4 mb-4">
                <div 
                  className="bg-green-600 h-4 rounded-full transition-all duration-150"
                  style={{ width: `${adProgress}%` }}
                ></div>
              </div>
              <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg p-6 mb-4">
                <h3 className="font-semibold text-gray-700 mb-2">Learn French Too!</h3>
                <p className="text-sm text-gray-600 mb-3">Join millions learning French with our app</p>
                <div className="bg-blue-600 text-white px-4 py-2 rounded text-sm">
                  Download FrenchMaster
                </div>
              </div>
              <p className="text-sm text-gray-500">Ad will complete automatically...</p>
            </>
          ) : (
            <>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">{getRewardText()}</h2>
              <p className="text-gray-600 mb-6">Thanks for watching! Your reward has been added.</p>
              <button
                onClick={completeAdReward}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
              >
                Claim Reward
              </button>
            </>
          )}
        </div>
      </div>
    );
  };

  const InterstitialAdModal = () => {
    const [adTimer, setAdTimer] = useState(5);

    useEffect(() => {
      if (showInterstitialAd && adTimer > 0) {
        const timer = setTimeout(() => setAdTimer(prev => prev - 1), 1000);
        return () => clearTimeout(timer);
      }
    }, [showInterstitialAd, adTimer]);

    if (!showInterstitialAd) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full text-center p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Great Progress!</h2>
            <p className="text-gray-600">You've completed 3 lessons today</p>
          </div>
          
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-6 mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-3">Travel to Spain!</h3>
            <p className="text-gray-600 mb-4">Book your dream vacation to the Basque Country</p>
            <div className="bg-purple-600 text-white px-6 py-3 rounded-lg inline-block">
              Get 20% Off Flights
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <button
              onClick={() => openModal('Remove Ads', 'Tired of ads? Upgrade to Premium!\n\n✨ Ad-free experience\n🔥 Unlimited hearts\n📚 All lessons unlocked')}
              className="text-blue-600 hover:underline text-sm"
            >
              Remove ads
            </button>
            
            {adTimer > 0 ? (
              <span className="text-gray-500 text-sm">Continue in {adTimer}s</span>
            ) : (
              <button
                onClick={() => setShowInterstitialAd(false)}
                className="bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Continue Learning
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

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
      
      <RewardedAdModal />
      <InterstitialAdModal />
    </div>
  );
};

export default EuskeraApp;

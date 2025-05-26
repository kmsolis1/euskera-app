import React, { useState, useEffect } from 'react';
import { Home, Users, Award, Settings, Star, Heart, Flame, Book, Volume2, CheckCircle, XCircle, Trophy, Crown, Lock, Play } from 'lucide-react';

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
  const [streak, setStreak] = useState(7);
  const [userProgress, setUserProgress] = useState({ 1: true, 2: false });
  const [isPremium, setIsPremium] = useState(false);

  // Expanded lesson data with 8 lessons
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
          basque: "Kaixo",
          audio: "kai-sho",
          options: ["Kaixo", "Agur", "Eskerrik asko", "Mesedez"],
          correct: "Kaixo",
          translation: "Hello"
        },
        {
          type: "translation",
          question: "Translate to English:",
          basque: "Egun on",
          audio: "eh-gun on",
          options: ["Good morning", "Good night", "Thank you", "Please"],
          correct: "Good morning",
          translation: "Good morning"
        },
        {
          type: "multiple-choice",
          question: "How do you say 'Thank you' in Basque?",
          basque: "Eskerrik asko",
          audio: "es-ker-rik as-ko",
          options: ["Kaixo", "Agur", "Eskerrik asko", "Barkatu"],
          correct: "Eskerrik asko",
          translation: "Thank you very much"
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
          audio: "baht",
          options: ["One", "Two", "Three", "Four"],
          correct: "One",
          translation: "One"
        },
        {
          type: "translation",
          question: "How do you say 'Three' in Basque?",
          basque: "hiru",
          audio: "hi-ru",
          options: ["bi", "hiru", "lau", "bost"],
          correct: "hiru",
          translation: "Three"
        },
        {
          type: "multiple-choice",
          question: "What number is 'hamar'?",
          basque: "hamar",
          audio: "ha-mar",
          options: ["Eight", "Nine", "Ten", "Seven"],
          correct: "Ten",
          translation: "Ten"
        }
      ]
    },
    {
      id: 3,
      title: "Family Members",
      description: "Learn words for family relationships",
      difficulty: "Beginner",
      xp: 25,
      isPremium: false,
      category: "Basics",
      questions: [
        {
          type: "multiple-choice",
          question: "How do you say 'Mother' in Basque?",
          basque: "ama",
          audio: "ah-ma",
          options: ["ama", "aita", "anaia", "arreba"],
          correct: "ama",
          translation: "Mother"
        },
        {
          type: "translation",
          question: "What does 'aita' mean?",
          basque: "aita",
          audio: "ah-ee-ta",
          options: ["Father", "Brother", "Sister", "Uncle"],
          correct: "Father",
          translation: "Father"
        }
      ]
    },
    {
      id: 4,
      title: "Colors",
      description: "Discover the colors in Basque",
      difficulty: "Beginner",
      xp: 20,
      isPremium: false,
      category: "Basics",
      questions: [
        {
          type: "multiple-choice",
          question: "How do you say 'Red' in Basque?",
          basque: "gorria",
          audio: "gor-ri-a",
          options: ["gorria", "urdina", "horia", "berdea"],
          correct: "gorria",
          translation: "Red"
        },
        {
          type: "translation",
          question: "What color is 'urdina'?",
          basque: "urdina",
          audio: "ur-di-na",
          options: ["Blue", "Green", "Yellow", "Red"],
          correct: "Blue",
          translation: "Blue"
        }
      ]
    },
    {
      id: 5,
      title: "Food & Drinks",
      description: "Essential vocabulary for dining",
      difficulty: "Intermediate",
      xp: 30,
      isPremium: true,
      category: "Daily Life",
      questions: [
        {
          type: "multiple-choice",
          question: "How do you say 'Water' in Basque?",
          basque: "ura",
          audio: "u-ra",
          options: ["ura", "ardoa", "esnea", "kafea"],
          correct: "ura",
          translation: "Water"
        },
        {
          type: "translation",
          question: "What does 'ogia' mean?",
          basque: "ogia",
          audio: "o-gi-a",
          options: ["Bread", "Cheese", "Meat", "Fish"],
          correct: "Bread",
          translation: "Bread"
        }
      ]
    },
    {
      id: 6,
      title: "Weather & Nature",
      description: "Talk about weather and natural elements",
      difficulty: "Intermediate",
      xp: 35,
      isPremium: true,
      category: "Daily Life",
      questions: [
        {
          type: "multiple-choice",
          question: "How do you say 'Sun' in Basque?",
          basque: "eguzkia",
          audio: "eh-guz-ki-a",
          options: ["eguzkia", "euria", "haizetza", "elurra"],
          correct: "eguzkia",
          translation: "Sun"
        },
        {
          type: "translation",
          question: "What does 'euria' mean?",
          basque: "euria",
          audio: "eh-u-ri-a",
          options: ["Rain", "Wind", "Snow", "Cloud"],
          correct: "Rain",
          translation: "Rain"
        }
      ]
    },
    {
      id: 7,
      title: "Transportation",
      description: "Getting around in the Basque Country",
      difficulty: "Intermediate",
      xp: 40,
      isPremium: true,
      category: "Travel",
      questions: [
        {
          type: "multiple-choice",
          question: "How do you say 'Car' in Basque?",
          basque: "autoa",
          audio: "au-to-a",
          options: ["autoa", "trenea", "autobusa", "hegazkina"],
          correct: "autoa",
          translation: "Car"
        },
        {
          type: "translation",
          question: "What does 'geltokia' mean?",
          basque: "geltokia",
          audio: "gel-to-ki-a",
          options: ["Station", "Airport", "Bus", "Ticket"],
          correct: "Station",
          translation: "Station"
        }
      ]
    },
    {
      id: 8,
      title: "Business Basque",
      description: "Professional vocabulary and phrases",
      difficulty: "Advanced",
      xp: 50,
      isPremium: true,
      category: "Professional",
      questions: [
        {
          type: "multiple-choice",
          question: "How do you say 'Meeting' in Basque?",
          basque: "bilera",
          audio: "bi-le-ra",
          options: ["bilera", "bulegoa", "enpresa", "lana"],
          correct: "bilera",
          translation: "Meeting"
        },
        {
          type: "translation",
          question: "What does 'kontratua' mean?",
          basque: "kontratua",
          audio: "kon-tra-tu-a",
          options: ["Contract", "Project", "Report", "Email"],
          correct: "Contract",
          translation: "Contract"
        }
      ]
    }
  ];

  const openModal = (title, content) => {
    setModalContent({ title, content });
    setShowModal(true);
  };

  const playAudio = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
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
    setCurrentScreen('lesson');
  };

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
    setShowResult(true);
    
    const currentQ = lessons[currentLesson].questions[currentQuestion];
    const isCorrect = answer === currentQ.correct;
    
    if (isCorrect) {
      setXp(prevXp => prevXp + 5);
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
    }, 1500);
  };

  const goHome = () => {
    setCurrentScreen('home');
    setCurrentQuestion(0);
    setSelectedAnswer('');
    setShowResult(false);
    setLessonComplete(false);
  };

  const groupedLessons = lessons.reduce((acc, lesson) => {
    if (!acc[lesson.category]) {
      acc[lesson.category] = [];
    }
    acc[lesson.category].push(lesson);
    return acc;
  }, {});

  // Screen Components
  const LessonScreen = () => {
    const lesson = lessons[currentLesson];
    const question = lesson.questions[currentQuestion];
    const isCorrect = selectedAnswer === question.correct;

    if (lessonComplete) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 text-center">
            <div className="mb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Lesson Complete!</h2>
              <p className="text-gray-600 mt-2">Great job learning {lesson.title}</p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">XP Earned</span>
                <span className="font-bold text-yellow-600">+{lesson.xp}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Accuracy</span>
                <span className="font-bold text-green-600">100%</span>
              </div>
            </div>
            
            <button
              onClick={goHome}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Continue Learning
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <button onClick={goHome} className="text-gray-600 hover:text-gray-800 text-2xl">
                ←
              </button>
              
              <div className="flex-1 mx-4">
                <div className="bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-green-500 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${((currentQuestion + 1) / lesson.questions.length) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="flex items-center space-x-1 text-red-500">
                <Heart className="w-5 h-5" />
                <span className="font-bold">{hearts}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">{question.question}</h2>
              
              {question.basque && (
                <div className="bg-blue-50 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-blue-800 mb-1">{question.basque}</div>
                      <div className="text-sm text-blue-600">/{question.audio}/</div>
                    </div>
                    <button
                      onClick={() => playAudio(question.basque)}
                      className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full transition-colors"
                    >
                      <Volume2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-3 mb-8">
              {question.options.map((option, index) => {
                let buttonClass = "w-full p-4 text-left border-2 rounded-lg font-medium transition-all ";
                
                if (showResult) {
                  if (option === question.correct) {
                    buttonClass += "border-green-500 bg-green-50 text-green-800";
                  } else if (option === selectedAnswer && option !== question.correct) {
                    buttonClass += "border-red-500 bg-red-50 text-red-800";
                  } else {
                    buttonClass += "border-gray-200 bg-gray-50 text-gray-500";
                  }
                } else if (selectedAnswer === option) {
                  buttonClass += "border-blue-500 bg-blue-50 text-blue-800";
                } else {
                  buttonClass += "border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-800";
                }

                return (
                  <button
                    key={index}
                    onClick={() => !showResult && handleAnswerSelect(option)}
                    className={buttonClass}
                    disabled={showResult}
                  >
                    <div className="flex items-center justify-between">
                      <span>{option}</span>
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
              <div className={`p-4 rounded-lg mb-6 ${
                isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
              }`}>
                <div className="flex items-center space-x-3">
                  {isCorrect ? (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-600" />
                  )}
                  <div>
                    <div className={`font-semibold ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                      {isCorrect ? 'Excellent!' : 'Not quite'}
                    </div>
                    <div className={`text-sm ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                      {question.translation}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="text-center text-gray-500 text-sm">
              Question {currentQuestion + 1} of {lesson.questions.length}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const HomeScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 pb-20">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
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
                className="flex items-center space-x-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium hover:shadow-lg transition-shadow"
              >
                <Crown className="w-4 h-4" />
                <span>Upgrade</span>
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
              <span className="font-bold">{xp} XP</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4">Your Progress</h3>
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{Object.values(userProgress).filter(Boolean).length}</div>
              <div className="text-gray-600">Lessons Completed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{streak}</div>
              <div className="text-gray-600">Day Streak</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600">{xp}</div>
              <div className="text-gray-600">Total XP</div>
            </div>
          </div>
        </div>

        {Object.entries(groupedLessons).map(([category, categoryLessons]) => (
          <div key={category} className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
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
                  <div key={lesson.id} className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow ${isLocked ? 'opacity-75' : ''}`}>
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
                          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                            isLocked 
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              : isCompleted 
                              ? 'bg-green-600 hover:bg-green-700 text-white' 
                              : 'bg-blue-600 hover:bg-blue-700 text-white'
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

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex justify-around py-3">
            <button 
              onClick={() => setCurrentScreen('friends')}
              className={`flex flex-col items-center space-y-1 ${currentScreen === 'friends' ? 'text-blue-600' : 'text-gray-400'}`}
            >
              <Users className="w-6 h-6" />
              <span className="text-xs font-medium">Friends</span>
            </button>
            <button 
              onClick={() => setCurrentScreen('achievements')}
              className={`flex flex-col items-center space-y-1 ${currentScreen === 'achievements' ? 'text-blue-600' : 'text-gray-400'}`}
            >
              <Award className="w-6 h-6" />
              <span className="text-xs font-medium">Achievements</span>
            </button>
            <button 
              onClick={() => setCurrentScreen('settings')}
              className={`flex flex-col items-center space-y-1 ${currentScreen === 'settings' ? 'text-blue-600' : 'text-gray-400'}`}
            >
              <Settings className="w-6 h-6" />
              <span className="text-xs font-medium">Settings</span>
            </button>
          </div>
        </div>
      </div>
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

            <div className="p-4 rounded-lg border-2 border-gray-200 bg-gray-50">
              <div className="flex items-center space-x-3">
                <span className="text-3xl">⭐</span>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-500">Perfectionist</h4>
                  <p className="text-sm text-gray-400">Complete a lesson with no mistakes</p>
                </div>
                <Lock className="w-6 h-6 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex justify-around py-3">
            <button 
              onClick={() => setCurrentScreen('home')} 
              className={`flex flex-col items-center space-y-1 ${currentScreen === 'home' ? 'text-blue-600' : 'text-gray-400'}`}
            >
              <Home className="w-6 h-6" />
              <span className="text-xs font-medium">Home</span>
            </button>
            <button 
              onClick={() => setCurrentScreen('friends')}
              className={`flex flex-col items-center space-y-1 ${currentScreen === 'friends' ? 'text-blue-600' : 'text-gray-400'}`}
            >
              <Users className="w-6 h-6" />
              <span className="text-xs font-medium">Friends</span>
            </button>
            <button 
              onClick={() => setCurrentScreen('achievements')}
              className={`flex flex-col items-center space-y-1 ${currentScreen === 'achievements' ? 'text-blue-600' : 'text-gray-400'}`}
            >
              <Award className="w-6 h-6" />
              <span className="text-xs font-medium">Achievements</span>
            </button>
            <button 
              onClick={() => setCurrentScreen('settings')}
              className={`flex flex-col items-center space-y-1 ${currentScreen === 'settings' ? 'text-blue-600' : 'text-gray-400'}`}
            >
              <Settings className="w-6 h-6" />
              <span className="text-xs font-medium">Settings</span>
            </button>
          </div>
        </div>
      </div>
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

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex justify-around py-3">
            <button 
              onClick={() => setCurrentScreen('home')} 
              className={`flex flex-col items-center space-y-1 ${currentScreen === 'home' ? 'text-blue-600' : 'text-gray-400'}`}
            >
              <Home className="w-6 h-6" />
              <span className="text-xs font-medium">Home</span>
            </button>
            <button 
              onClick={() => setCurrentScreen('friends')}
              className={`flex flex-col items-center space-y-1 ${currentScreen === 'friends' ? 'text-blue-600' : 'text-gray-400'}`}
            >
              <Users className="w-6 h-6" />
              <span className="text-xs font-medium">Friends</span>
            </button>
            <button 
              onClick={() => setCurrentScreen('achievements')}
              className={`flex flex-col items-center space-y-1 ${currentScreen === 'achievements' ? 'text-blue-600' : 'text-gray-400'}`}
            >
              <Award className="w-6 h-6" />
              <span className="text-xs font-medium">Achievements</span>
            </button>
            <button 
              onClick={() => setCurrentScreen('settings')}
              className={`flex flex-col items-center space-y-1 ${currentScreen === 'settings' ? 'text-blue-600' : 'text-gray-400'}`}
            >
              <Settings className="w-6 h-6" />
              <span className="text-xs font-medium">Settings</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

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
    </div>
  );
};

export default EuskeraApp;

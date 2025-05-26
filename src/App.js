import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, CheckCircle, XCircle, Trophy, Star, Book, Users, Settings, Home, Award, Volume2, Heart, Flame } from 'lucide-react';

const EuskeraApp = () => {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [currentLesson, setCurrentLesson] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(7);
  const [hearts, setHearts] = useState(5);
  const [xp, setXp] = useState(1250);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [lessonComplete, setLessonComplete] = useState(false);
  const [userProgress, setUserProgress] = useState({});

  // Lesson data structure
  const lessons = [
    {
      id: 1,
      title: "Basic Greetings",
      description: "Learn essential Basque greetings",
      difficulty: "Beginner",
      xp: 15,
      completed: true,
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
      completed: false,
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
          question: "How do you say 'Five' in Basque?",
          basque: "bost",
          audio: "bosht",
          options: ["lau", "bost", "sei", "zazpi"],
          correct: "bost",
          translation: "Five"
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
      completed: false,
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
        },
        {
          type: "multiple-choice",
          question: "How do you say 'Sister' in Basque?",
          basque: "arreba",
          audio: "ar-re-ba",
          options: ["anaia", "arreba", "izeba", "osaba"],
          correct: "arreba",
          translation: "Sister"
        }
      ]
    },
    {
      id: 4,
      title: "Colors",
      description: "Discover the colors in Basque",
      difficulty: "Beginner",
      xp: 20,
      completed: false,
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
    }
  ];

  const achievements = [
    { id: 1, title: "First Steps", description: "Complete your first lesson", unlocked: true, icon: "🎯" },
    { id: 2, title: "Streak Master", description: "Maintain a 7-day streak", unlocked: true, icon: "🔥" },
    { id: 3, title: "Scholar", description: "Earn 1000 XP", unlocked: true, icon: "📚" },
    { id: 4, title: "Perfectionist", description: "Complete a lesson with no mistakes", unlocked: false, icon: "⭐" }
  ];

  // Initialize progress
  useEffect(() => {
    const initialProgress = {};
    lessons.forEach(lesson => {
      initialProgress[lesson.id] = lesson.completed;
    });
    setUserProgress(initialProgress);
  }, []);

  const playAudio = (text) => {
    // In a real app, this would play actual audio
    console.log(`Playing audio: ${text}`);
  };

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
    setShowResult(true);
    
    const currentQ = lessons[currentLesson].questions[currentQuestion];
    const isCorrect = answer === currentQ.correct;
    
    if (isCorrect) {
      setScore(score + 10);
      setXp(xp + 5);
    } else {
      setHearts(Math.max(0, hearts - 1));
    }
    
    setTimeout(() => {
      if (currentQuestion < lessons[currentLesson].questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer('');
        setShowResult(false);
      } else {
        // Lesson complete
        setLessonComplete(true);
        const newProgress = { ...userProgress };
        newProgress[lessons[currentLesson].id] = true;
        setUserProgress(newProgress);
        setXp(xp + lessons[currentLesson].xp);
      }
    }, 1500);
  };

  const startLesson = (lessonIndex) => {
    setCurrentLesson(lessonIndex);
    setCurrentQuestion(0);
    setSelectedAnswer('');
    setShowResult(false);
    setLessonComplete(false);
    setCurrentScreen('lesson');
  };

  const restartLesson = () => {
    setCurrentQuestion(0);
    setSelectedAnswer('');
    setShowResult(false);
    setLessonComplete(false);
  };

  const goHome = () => {
    setCurrentScreen('home');
    setCurrentQuestion(0);
    setSelectedAnswer('');
    setShowResult(false);
    setLessonComplete(false);
  };

  // Home Screen Component
  const HomeScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
              E
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Euskera</h1>
          </div>
          
          <div className="flex items-center space-x-6">
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
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Learn Basque</h2>
          <p className="text-gray-600">Master the beautiful Basque language with interactive lessons</p>
        </div>

        {/* Progress Overview */}
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

        {/* Lessons Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {lessons.map((lesson, index) => (
            <div key={lesson.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    userProgress[lesson.id] ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                  }`}>
                    {userProgress[lesson.id] ? <CheckCircle className="w-6 h-6" /> : <Book className="w-6 h-6" />}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    lesson.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {lesson.difficulty}
                  </span>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{lesson.title}</h3>
                <p className="text-gray-600 mb-4">{lesson.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-yellow-600">
                    <Star className="w-4 h-4" />
                    <span className="text-sm font-medium">{lesson.xp} XP</span>
                  </div>
                  
                  <button
                    onClick={() => startLesson(index)}
                    className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                      userProgress[lesson.id] 
                        ? 'bg-green-600 hover:bg-green-700 text-white' 
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {userProgress[lesson.id] ? 'Review' : 'Start'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Achievements Section */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Achievements</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {achievements.map(achievement => (
              <div key={achievement.id} className={`p-4 rounded-lg border-2 ${
                achievement.unlocked 
                  ? 'border-yellow-300 bg-yellow-50' 
                  : 'border-gray-200 bg-gray-50'
              }`}>
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{achievement.icon}</span>
                  <div>
                    <h4 className={`font-semibold ${achievement.unlocked ? 'text-yellow-800' : 'text-gray-500'}`}>
                      {achievement.title}
                    </h4>
                    <p className={`text-sm ${achievement.unlocked ? 'text-yellow-700' : 'text-gray-400'}`}>
                      {achievement.description}
                    </p>
                  </div>
                  {achievement.unlocked && <Trophy className="w-5 h-5 text-yellow-600" />}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex justify-around py-3">
            <button onClick={() => setCurrentScreen('home')} className="flex flex-col items-center space-y-1 text-blue-600">
              <Home className="w-6 h-6" />
              <span className="text-xs font-medium">Home</span>
            </button>
            <button className="flex flex-col items-center space-y-1 text-gray-400">
              <Users className="w-6 h-6" />
              <span className="text-xs font-medium">Friends</span>
            </button>
            <button className="flex flex-col items-center space-y-1 text-gray-400">
              <Award className="w-6 h-6" />
              <span className="text-xs font-medium">Achievements</span>
            </button>
            <button className="flex flex-col items-center space-y-1 text-gray-400">
              <Settings className="w-6 h-6" />
              <span className="text-xs font-medium">Settings</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Lesson Screen Component
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
                <span className="text-gray-600">Questions Correct</span>
                <span className="font-bold text-green-600">{lesson.questions.length}/{lesson.questions.length}</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={restartLesson}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
              >
                Practice Again
              </button>
              <button
                onClick={goHome}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-6 rounded-lg transition-colors"
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
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <button onClick={goHome} className="text-gray-600 hover:text-gray-800">
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
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1 text-red-500">
                  <Heart className="w-5 h-5" />
                  <span className="font-bold">{hearts}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {/* Question */}
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

            {/* Answer Options */}
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

            {/* Result Message */}
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
                      {isCorrect ? 'Correct!' : 'Incorrect'}
                    </div>
                    <div className={`text-sm ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                      {question.translation}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Progress */}
            <div className="text-center text-gray-500 text-sm">
              Question {currentQuestion + 1} of {lesson.questions.length}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Main App Render
  return (
    <div className="font-sans">
      {currentScreen === 'home' ? <HomeScreen /> : <LessonScreen />}
    </div>
  );
};

export default EuskeraApp;

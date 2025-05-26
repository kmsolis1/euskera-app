import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, CheckCircle, XCircle, Trophy, Star, Book, Users, Settings, Home, Award, Volume2, Heart, Flame, LogOut, Mail } from 'lucide-react';

// Firebase imports
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';

// Firebase configuration with better error handling
const firebaseConfig = {
  // Main App Render
  return (
    <div className="font-sans">
      {currentScreen === 'home' && <HomeScreen />}
      {currentScreen === 'friends' && <FriendsScreen />}
      {currentScreen === 'lesson' && <LessonScreen />}
    </div>
  );
};

export default EuskeraApp;apiKey: "AIzaSyDW1TaQRTk1_N7JPJAvKsaJBmbI_DGsJ68",
  authDomain: "euskera-learning-app.firebaseapp.com",
  projectId: "euskera-learning-app",
  storageBucket: "euskera-learning-app.firebasestorage.app",
  messagingSenderId: "826608378295",
  appId: "1:826608378295:web:09db74c268b661b5038832",
  measurementId: "G-6CFH074GLD"
};

// Initialize Firebase with error handling
let app, auth, db, googleProvider;
try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  googleProvider = new GoogleAuthProvider();
} catch (error) {
  console.error('Firebase initialization error:', error);
}

const EuskeraApp = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentScreen, setCurrentScreen] = useState('home');
  const [currentLesson, setCurrentLesson] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(1);
  const [hearts, setHearts] = useState(5);
  const [xp, setXp] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [lessonComplete, setLessonComplete] = useState(false);
  const [userProgress, setUserProgress] = useState({});
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Authentication state listener with better error handling
  useEffect(() => {
    let unsubscribe;
    
    try {
      if (auth && onAuthStateChanged) {
        unsubscribe = onAuthStateChanged(auth, async (user) => {
          if (user) {
            setUser(user);
            loadLocalProgress(); // Use local storage for now
          } else {
            setUser(null);
          }
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error('Auth listener error:', error);
      setLoading(false);
    }

    const loadingTimeout = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => {
      if (unsubscribe) unsubscribe();
      clearTimeout(loadingTimeout);
    };
  }, []);

  // Load progress from localStorage (simplified)
  const loadLocalProgress = () => {
    try {
      const savedProgress = localStorage.getItem('euskera-progress');
      if (savedProgress) {
        const data = JSON.parse(savedProgress);
        setUserProgress(data.progress || {});
        setXp(data.xp || 0);
        setStreak(data.streak || 1);
        setHearts(data.hearts || 5);
      }
    } catch (error) {
      console.error('Error loading local progress:', error);
    }
  };

  // Save progress locally
  const saveLocalProgress = () => {
    try {
      const progressData = {
        progress: userProgress,
        xp: xp,
        streak: streak,
        hearts: hearts,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem('euskera-progress', JSON.stringify(progressData));
    } catch (error) {
      console.error('Error saving local progress:', error);
    }
  };

  // Save progress whenever it changes
  useEffect(() => {
    if (user) {
      saveLocalProgress();
    }
  }, [userProgress, xp, streak, hearts, user]);

  // Google Sign In
  const signInWithGoogle = async () => {
    if (!auth || !googleProvider) {
      alert('Authentication not available. Please refresh the page.');
      return;
    }

    try {
      setAuthLoading(true);
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Error signing in with Google:', error);
      alert('Error signing in with Google. Please try again.');
    } finally {
      setAuthLoading(false);
    }
  };

  // Email/Password Sign Up
  const handleEmailSignUp = async (e) => {
    e.preventDefault();
    if (!email || !password || !name) {
      alert('Please fill in all fields');
      return;
    }
    
    try {
      setAuthLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      await userCredential.user.reload();
      setUser(userCredential.user);
    } catch (error) {
      console.error('Error creating account:', error);
      alert('Error creating account. Please try again.');
    } finally {
      setAuthLoading(false);
    }
  };

  // Email/Password Sign In
  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert('Please enter your email and password');
      return;
    }
    
    try {
      setAuthLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Error signing in:', error);
      alert('Error signing in. Please check your credentials.');
    } finally {
      setAuthLoading(false);
    }
  };

  // Sign Out
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setCurrentScreen('home');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Lesson data
  const lessons = [
    {
      id: 1,
      title: "Basic Greetings",
      description: "Learn essential Basque greetings",
      difficulty: "Beginner",
      xp: 15,
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
        }
      ]
    }
  ];

  const playAudio = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
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

  const goHome = () => {
    setCurrentScreen('home');
    setCurrentQuestion(0);
    setSelectedAnswer('');
    setShowResult(false);
    setLessonComplete(false);
  };

  // Loading screen
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white font-bold text-3xl mx-auto animate-pulse mb-4">
            E
          </div>
          <div className="text-lg text-gray-700 font-medium">Loading Euskera...</div>
        </div>
      </div>
    );
  }

  // Authentication screen
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white font-bold text-3xl mx-auto mb-4">
              E
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome to Euskera</h1>
            <p className="text-gray-600">Learn Basque with interactive lessons</p>
          </div>

          <div className="space-y-4">
            <button
              onClick={signInWithGoogle}
              disabled={authLoading}
              className="w-full bg-white border-2 border-gray-200 hover:border-gray-300 disabled:bg-gray-50 text-gray-800 font-medium py-4 px-6 rounded-lg transition-colors flex items-center justify-center space-x-3 shadow-sm hover:shadow-md"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">or</span>
              </div>
            </div>

            <form onSubmit={isSignUp ? handleEmailSignUp : handleEmailSignIn} className="space-y-3">
              {isSignUp && (
                <input
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-blue-500 focus:outline-none"
                  required
                />
              )}
              
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-blue-500 focus:outline-none"
                required
              />
              
              <input
                type="password"
                placeholder="Password (min 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-blue-500 focus:outline-none"
                required
                minLength={6}
              />

              <button
                type="submit"
                disabled={authLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-6 rounded-lg transition-colors"
              >
                {authLoading ? 'Loading...' : (isSignUp ? 'Create Account' : 'Sign In')}
              </button>
            </form>

            <div className="text-center">
              <button
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setEmail('');
                  setPassword('');
                  setName('');
                }}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Simple Friends Screen that works
  const FriendsScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 pb-20">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setCurrentScreen('home')}
              className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white font-bold text-lg hover:shadow-lg transition-shadow"
            >
              E
            </button>
            <h1 className="text-2xl font-bold text-gray-800">Friends</h1>
          </div>
          <button onClick={handleSignOut} className="text-gray-600 hover:text-gray-800 p-2">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Learning Community</h2>
          
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white font-bold">
                {user?.displayName?.[0] || user?.email?.[0] || 'U'}
              </div>
              <div>
                <div className="font-semibold text-gray-800">{user?.displayName || user?.email || 'You'}</div>
                <div className="text-sm text-gray-600">{xp} XP • {streak} day streak</div>
              </div>
            </div>
          </div>

          <div className="text-center py-8">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">Start Your Learning Community</h3>
            <p className="text-gray-500 mb-4">Invite friends to learn Basque together and see who can earn the most XP!</p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors">
              Invite Friends
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
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

  // Home Screen
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
              <p className="text-sm text-gray-600">Welcome back, {user.displayName || user.email}</p>
            </div>
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
            <button onClick={handleSignOut} className="text-gray-600 hover:text-gray-800 p-2">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {lessons.map((lesson, index) => (
            <div key={lesson.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <Book className="w-6 h-6" />
                  </div>
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
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
                    className="px-6 py-2 rounded-lg font-medium bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                  >
                    Start
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation */}
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

  // Lesson Screen (simplified)
  const LessonScreen = () => {
    const lesson = lessons[currentLesson];
    const question = lesson.questions[currentQuestion];

    if (lessonComplete) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 text-center">
            <Trophy className="w-20 h-20 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Lesson Complete!</h2>
            <p className="text-gray-600 mb-6">Great job learning {lesson.title}</p>
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
              <button onClick={goHome} className="text-gray-600 hover:text-gray-800">←</button>
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

            <div className="space-y-3 mb-8">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => !showResult && handleAnswerSelect(option)}
                  className={`w-full p-4 text-left border-2 rounded-lg font-medium transition-all ${
                    showResult
                      ? option === question.correct
                        ? 'border-green-500 bg-green-50 text-green-800'
                        : option === selectedAnswer
                        ? 'border-red-500 bg-red-50 text-red-800'
                        : 'border-gray-200 bg-gray-50 text-gray-500'
                      : selectedAnswer === option
                      ? 'border-blue-500 bg-blue-50 text-blue-800'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-800'
                  }`}
                  disabled={showResult}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

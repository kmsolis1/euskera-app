import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, CheckCircle, XCircle, Trophy, Star, Book, Users, Settings, Home, Award, Volume2, Heart, Flame, LogOut, Mail } from 'lucide-react';

// Firebase imports
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailLink, isSignInWithEmailLink, sendSignInLinkToEmail, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDW1TaQRTk1_N7JPJAvKsaJBmbI_DGsJ68",
  authDomain: "euskera-learning-app.firebaseapp.com",
  projectId: "euskera-learning-app",
  storageBucket: "euskera-learning-app.firebasestorage.app",
  messagingSenderId: "826608378295",
  appId: "1:826608378295:web:09db74c268b661b5038832",
  measurementId: "G-6CFH074GLD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

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
  const [emailForSignIn, setEmailForSignIn] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [showEmailConfirm, setShowEmailConfirm] = useState(false);
  const [confirmEmail, setConfirmEmail] = useState('');

  // Authentication state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        await loadUserProgress(user.uid);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    // Check if user is signing in with email link
    if (isSignInWithEmailLink(auth, window.location.href)) {
      const storedEmail = window.localStorage.getItem('emailForSignIn');
      if (storedEmail) {
        handleEmailLinkSignIn(storedEmail);
      } else {
        setShowEmailConfirm(true);
        setLoading(false);
      }
    }

    return () => unsubscribe();
  }, []);

  // Load user progress from Firestore
  const loadUserProgress = async (userId) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUserProgress(userData.progress || {});
        setXp(userData.xp || 0);
        setStreak(userData.streak || 1);
        setHearts(userData.hearts || 5);
      } else {
        // Create new user document
        const newUserData = {
          progress: {},
          xp: 0,
          streak: 1,
          hearts: 5,
          createdAt: new Date()
        };
        await setDoc(doc(db, 'users', userId), newUserData);
      }
    } catch (error) {
      console.error('Error loading user progress:', error);
    }
  };

  // Save user progress to Firestore
  const saveUserProgress = async () => {
    if (!user) return;
    
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        progress: userProgress,
        xp: xp,
        streak: streak,
        hearts: hearts,
        lastUpdated: new Date()
      });
    } catch (error) {
      console.error('Error saving user progress:', error);
    }
  };

  // Save progress whenever it changes
  useEffect(() => {
    if (user) {
      saveUserProgress();
    }
  }, [userProgress, xp, streak, hearts, user]);

  // Google Sign In
  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
  };

  // Email Link Sign In
  const sendEmailLink = async () => {
    const actionCodeSettings = {
      url: window.location.origin,
      handleCodeInApp: true,
    };

    try {
      await sendSignInLinkToEmail(auth, emailForSignIn, actionCodeSettings);
      window.localStorage.setItem('emailForSignIn', emailForSignIn);
      setEmailSent(true);
    } catch (error) {
      console.error('Error sending email link:', error);
      alert('Error sending email link. Please try again.');
    }
  };

  // Handle email link sign in
  const handleEmailLinkSignIn = async (email) => {
    try {
      setLoading(true);
      await signInWithEmailLink(auth, email, window.location.href);
      window.localStorage.removeItem('emailForSignIn');
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
      setShowEmailConfirm(false);
    } catch (error) {
      console.error('Error completing email link sign in:', error);
      alert('Error signing in. Please try requesting a new magic link.');
      setShowEmailConfirm(false);
      window.history.replaceState({}, document.title, window.location.pathname);
    } finally {
      setLoading(false);
    }
  };

  // Handle email confirmation for magic link
  const handleEmailConfirmation = () => {
    if (confirmEmail.trim()) {
      handleEmailLinkSignIn(confirmEmail.trim());
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

  // Lesson data structure
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
    { id: 1, title: "First Steps", description: "Complete your first lesson", unlocked: Object.values(userProgress).some(Boolean), icon: "🎯" },
    { id: 2, title: "Streak Master", description: "Maintain a 7-day streak", unlocked: streak >= 7, icon: "🔥" },
    { id: 3, title: "Scholar", description: "Earn 1000 XP", unlocked: xp >= 1000, icon: "📚" },
    { id: 4, title: "Perfectionist", description: "Complete a lesson with no mistakes", unlocked: false, icon: "⭐" }
  ];

  const playAudio = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      
      const voices = window.speechSynthesis.getVoices();
      const spanishVoice = voices.find(voice => 
        voice.lang.startsWith('es') || voice.lang.startsWith('eu')
      );
      
      if (spanishVoice) {
        utterance.voice = spanishVoice;
      }
      
      utterance.rate = 0.8;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      
      window.speechSynthesis.speak(utterance);
    } else {
      console.log('Text-to-speech not supported in this browser');
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

  // Loading screen
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white font-bold text-2xl mb-4 mx-auto">
            E
          </div>
          <div className="text-xl text-gray-600">Loading Euskera...</div>
        </div>
      </div>
    );
  }

  // Email confirmation screen for magic link
  if (showEmailConfirm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white font-bold text-3xl mx-auto mb-4">
              E
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Confirm Your Email</h1>
            <p className="text-gray-600">Please enter your email address to complete sign-in</p>
          </div>

          <div className="space-y-4">
            <input
              type="email"
              placeholder="Enter your email address"
              value={confirmEmail}
              onChange={(e) => setConfirmEmail(e.target.value)}
              className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-blue-500 focus:outline-none"
              autoFocus
            />
            <button
              onClick={handleEmailConfirmation}
              disabled={!confirmEmail.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Complete Sign In
            </button>
            <button
              onClick={() => {
                setShowEmailConfirm(false);
                window.history.replaceState({}, document.title, window.location.pathname);
              }}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
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

          {!emailSent ? (
            <div className="space-y-4">
              <button
                onClick={signInWithGoogle}
                className="w-full bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-800 font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-3"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
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

              <div className="space-y-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={emailForSignIn}
                  onChange={(e) => setEmailForSignIn(e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-blue-500 focus:outline-none"
                />
                <button
                  onClick={sendEmailLink}
                  disabled={!emailForSignIn}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  <Mail className="w-5 h-5" />
                  <span>Send Magic Link</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Check your email!</h3>
              <p className="text-gray-600 mb-4">We sent a magic link to {emailForSignIn}</p>
              <button
                onClick={() => {setEmailSent(false); setEmailForSignIn('');}}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Try a different email
              </button>
            </div>
          )}

          <div className="mt-8 text-center text-sm text-gray-500">
            <p>No passwords needed • Secure sign-in</p>
          </div>
        </div>
      </div>
    );
  }

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
            <button
              onClick={handleSignOut}
              className="text-gray-600 hover:text-gray-800 p-2"
              title="Sign out"
            >
              <LogOut className="w-5 h-5" />
            </button>
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

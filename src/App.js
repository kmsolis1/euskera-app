import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, CheckCircle, XCircle, Trophy, Star, Book, Users, Settings, Home, Award, Volume2, Heart, Flame, LogOut, Mail } from 'lucide-react';

// Firebase imports
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';

// Firebase configuration with better error handling
const firebaseConfig = {
  apiKey: "AIzaSyDW1TaQRTk1_N7JPJAvKsaJBmbI_DGsJ68",
  authDomain: "euskera-learning-app.firebaseapp.com",
  projectId: "euskera-learning-app",
  storageBucket: "euskera-learning-app.firebasestorage.app",
  messagingSenderId: "826608378295",
  appId: "1:826608378295:web:09db74c268b661b5038832",
  measurementId: "G-6CFH074GLD"
};

// Initialize Firebase with error handling
let app, auth, db;
try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
} catch (error) {
  console.error('Firebase initialization error:', error);
  // Create mock objects to prevent crashes
  auth = { currentUser: null };
  db = null;
}
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
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [friends, setFriends] = useState([
    // Start with just a few realistic demo users to populate the leaderboard
    { id: 'demo1', name: 'Alex Chen', xp: 1250, streak: 8, avatar: '🧑🏻‍💻', status: 'Learning Numbers', isDemo: true },
    { id: 'demo2', name: 'Sara Kim', xp: 890, streak: 5, avatar: '👩🏻‍🎓', status: 'Completed Greetings', isDemo: true }
  ]);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', content: '' });

  // Authentication state listener with better error handling
  useEffect(() => {
    let unsubscribe;
    
    try {
      if (auth && auth.onAuthStateChanged) {
        unsubscribe = onAuthStateChanged(auth, async (user) => {
          console.log('Auth state changed:', user ? 'User logged in' : 'No user');
          if (user) {
            setUser(user);
            // Load user progress in background, don't block UI
            if (db) {
              loadUserProgress(user.uid);
            } else {
              console.warn('Firestore not available, using local storage');
              loadLocalProgress();
            }
          } else {
            setUser(null);
          }
          setLoading(false);
        });
      } else {
        console.warn('Firebase Auth not available');
        setLoading(false);
      }
    } catch (error) {
      console.error('Auth listener error:', error);
      setLoading(false);
    }

    // Set a maximum loading time to prevent infinite loading
    const loadingTimeout = setTimeout(() => {
      console.log('Loading timeout reached');
      setLoading(false);
    }, 3000);

    return () => {
      if (unsubscribe) unsubscribe();
      clearTimeout(loadingTimeout);
    };
  }, []);

  // Load user progress from Firestore with fallback
  const loadUserProgress = async (userId) => {
    if (!db) {
      console.warn('Firestore not available, using local progress');
      loadLocalProgress();
      return;
    }

    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUserProgress(userData.progress || {});
        setXp(userData.xp || 0);
        setStreak(userData.streak || 1);
        setHearts(userData.hearts || 5);
        console.log('Loaded progress from Firestore');
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
        console.log('Created new user document');
      }
    } catch (error) {
      console.error('Error loading user progress from Firestore:', error);
      console.log('Falling back to local progress');
      loadLocalProgress();
    }
  };

  // Fallback: Load progress from localStorage
  const loadLocalProgress = () => {
    try {
      const savedProgress = localStorage.getItem('euskera-progress');
      if (savedProgress) {
        const data = JSON.parse(savedProgress);
        setUserProgress(data.progress || {});
        setXp(data.xp || 0);
        setStreak(data.streak || 1);
        setHearts(data.hearts || 5);
        console.log('Loaded progress from localStorage');
      }
    } catch (error) {
      console.error('Error loading local progress:', error);
    }
  };

  // Save progress locally as backup
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

  // Save user progress to Firestore with fallback
  const saveUserProgress = async () => {
    // Always save locally as backup
    saveLocalProgress();
    
    if (!user || !db) {
      console.log('No user or Firestore, progress saved locally only');
      return;
    }
    
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        progress: userProgress,
        xp: xp,
        streak: streak,
        hearts: hearts,
        lastUpdated: new Date()
      });
      console.log('Progress saved to Firestore');
    } catch (error) {
      console.error('Error saving user progress to Firestore:', error);
      console.log('Progress saved locally as fallback');
    }
  };

  // Save progress whenever it changes
  useEffect(() => {
    if (user) {
      saveUserProgress();
    }
  }, [userProgress, xp, streak, hearts, user]);

  // Google Sign In with better error handling
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
      if (error.code === 'auth/popup-blocked') {
        alert('Popup was blocked. Please allow popups for this site and try again.');
      } else if (error.code === 'auth/network-request-failed') {
        alert('Network error. Please check your connection and try again.');
      } else {
        alert('Error signing in with Google. Please try again.');
      }
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
      
      // Update the user's display name
      await updateProfile(userCredential.user, {
        displayName: name
      });
      
      // Reload user to get updated profile
      await userCredential.user.reload();
      setUser(userCredential.user);
      
    } catch (error) {
      console.error('Error creating account:', error);
      if (error.code === 'auth/email-already-in-use') {
        alert('This email is already registered. Try signing in instead.');
      } else if (error.code === 'auth/weak-password') {
        alert('Password should be at least 6 characters long.');
      } else {
        alert('Error creating account. Please try again.');
      }
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
      if (error.code === 'auth/user-not-found') {
        alert('No account found with this email. Try signing up instead.');
      } else if (error.code === 'auth/wrong-password') {
        alert('Incorrect password. Please try again.');
      } else {
        alert('Error signing in. Please check your credentials.');
      }
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

  // Loading screen with faster, more engaging animation
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white font-bold text-3xl mx-auto animate-pulse">
              E
            </div>
            <div className="absolute inset-0 w-20 h-20 border-4 border-blue-200 rounded-full animate-spin border-t-blue-500 mx-auto"></div>
          </div>
          <div className="text-lg text-gray-700 font-medium">Euskera</div>
          <div className="text-sm text-gray-500 mt-1">Loading your progress...</div>
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
            {/* Google Sign In */}
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

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">or</span>
              </div>
            </div>

            {/* Email/Password Form */}
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

            {/* Toggle Sign Up / Sign In */}
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

          <div className="mt-8 text-center text-sm text-gray-500">
            <p>Secure authentication • Your progress is saved</p>
          </div>
        </div>
      </div>
    );
  }

  // Modal Component with improved styling
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
            <div className="text-gray-600 leading-relaxed mb-6">
              {content}
            </div>
            <div className="space-y-3">
              <button
                onClick={onClose}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
              >
                Got it
              </button>
              {title.includes('Share') && (
                <button
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(window.location.origin);
                      onClose();
                    } catch (error) {
                      console.error('Could not copy to clipboard');
                    }
                  }}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-6 rounded-lg transition-colors"
                >
                  Copy Link Again
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };
  const FriendsScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 pb-20">
      {/* Header */}
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
          
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 text-yellow-600">
              <Star className="w-5 h-5" />
              <span className="font-bold">{xp} XP</span>
            </div>
            <button
              onClick={handleSignOut}
              className="text-gray-600 hover:text-gray-800 p-2"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Leaderboard Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Weekly Leaderboard</h2>
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {user?.displayName?.[0] || user?.email?.[0] || 'U'}
              </div>
              <div>
                <div className="font-semibold text-gray-800">{user?.displayName || user?.email || 'You'}</div>
                <div className="text-sm text-gray-600">{xp} XP • #{friends.filter(f => f.xp > xp).length + 1} place</div>
              </div>
            </div>
            <div className="text-2xl">🏆</div>
          </div>
        </div>

        {/* Friends List */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-800">Learning Community</h3>
            <span className="text-sm text-gray-500">{friends.length + 1} learners</span>
          </div>

          {friends.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-gray-400" />
              </div>
              <h4 className="text-lg font-semibold text-gray-600 mb-2">No friends yet</h4>
              <p className="text-gray-500 mb-4">Invite friends to learn Basque together!</p>
              <button 
                onClick={shareApp}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Invite Friends
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* All learners including user */}
              {[
                {
                  id: 'current-user',
                  name: user?.displayName || user?.email?.split('@')[0] || 'You',
                  xp: xp,
                  streak: streak,
                  avatar: user?.displayName?.[0] || user?.email?.[0] || '👤',
                  status: `${Object.values(userProgress).filter(Boolean).length} lessons completed`,
                  isCurrentUser: true
                },
                ...friends
              ]
              .sort((a, b) => b.xp - a.xp)
              .map((person, index) => (
                <div key={person.id} className={`flex items-center justify-between p-4 rounded-lg transition-colors ${
                  person.isCurrentUser 
                    ? 'bg-gradient-to-r from-blue-50 to-green-50 border-2 border-blue-200' 
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}>
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                        person.isCurrentUser 
                          ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white font-bold'
                          : 'bg-blue-100'
                      }`}>
                        {person.isCurrentUser ? (person.avatar.length === 1 ? person.avatar : person.avatar[0]) : person.avatar}
                      </div>
                      <div className={`absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                        index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-amber-600' : 'bg-blue-500'
                      }`}>
                        {index + 1}
                      </div>
                    </div>
                    <div>
                      <div className={`font-semibold ${person.isCurrentUser ? 'text-blue-800' : 'text-gray-800'}`}>
                        {person.name} {person.isCurrentUser && '(You)'}
                      </div>
                      <div className={`text-sm ${person.isCurrentUser ? 'text-blue-600' : 'text-gray-600'}`}>
                        {person.status}
                        {person.isDemo && <span className="ml-2 text-xs bg-gray-200 px-2 py-1 rounded">Demo</span>}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-blue-600">{person.xp} XP</div>
                    <div className="text-sm text-orange-600 flex items-center space-x-1">
                      <Flame className="w-4 h-4" />
                      <span>{person.streak}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Invite Friends */}
        <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Invite Friends</h3>
          <p className="text-gray-600 mb-4">Learning is more fun with friends! Invite them to join you on Euskera.</p>
          <button 
            onClick={shareApp}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
            Share Euskera
          </button>
        </div>
      </div>
    </div>
  );

  // Achievements Screen Component  
  const AchievementsScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setCurrentScreen('home')}
              className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white font-bold text-lg hover:shadow-lg transition-shadow"
            >
              E
            </button>
            <h1 className="text-2xl font-bold text-gray-800">Achievements</h1>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 text-yellow-600">
              <Star className="w-5 h-5" />
              <span className="font-bold">{xp} XP</span>
            </div>
            <button
              onClick={handleSignOut}
              className="text-gray-600 hover:text-gray-800 p-2"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Stats Overview */}
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
            <div className="text-3xl font-bold text-green-600">{achievements.filter(a => a.unlocked).length}</div>
            <div className="text-gray-600 text-sm">Achievements</div>
          </div>
        </div>

        {/* Achievement Categories */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Learning Achievements</h3>
            <div className="grid gap-4 md:grid-cols-2">
              {achievements.map(achievement => (
                <div key={achievement.id} className={`p-4 rounded-lg border-2 ${
                  achievement.unlocked 
                    ? 'border-yellow-300 bg-yellow-50' 
                    : 'border-gray-200 bg-gray-50'
                }`}>
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl">{achievement.icon}</span>
                    <div className="flex-1">
                      <h4 className={`font-semibold ${achievement.unlocked ? 'text-yellow-800' : 'text-gray-500'}`}>
                        {achievement.title}
                      </h4>
                      <p className={`text-sm ${achievement.unlocked ? 'text-yellow-700' : 'text-gray-400'}`}>
                        {achievement.description}
                      </p>
                    </div>
                    {achievement.unlocked && <Trophy className="w-6 h-6 text-yellow-600" />}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* More Achievement Categories */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Social Achievements</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 rounded-lg border-2 border-gray-200 bg-gray-50">
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">👥</span>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-500">Social Butterfly</h4>
                    <p className="text-sm text-gray-400">Add 5 friends</p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 rounded-lg border-2 border-gray-200 bg-gray-50">
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">🏆</span>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-500">Top Performer</h4>
                    <p className="text-sm text-gray-400">Reach #1 on leaderboard</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Special Achievements</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 rounded-lg border-2 border-gray-200 bg-gray-50">
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">🌟</span>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-500">Night Owl</h4>
                    <p className="text-sm text-gray-400">Complete lesson after 10 PM</p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 rounded-lg border-2 border-gray-200 bg-gray-50">
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">⚡</span>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-500">Speed Demon</h4>
                    <p className="text-sm text-gray-400">Complete lesson in under 2 minutes</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Settings Screen Component
  const SettingsScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setCurrentScreen('home')}
              className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white font-bold text-lg hover:shadow-lg transition-shadow"
            >
              E
            </button>
            <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
          </div>
          
          <button
            onClick={handleSignOut}
            className="text-gray-600 hover:text-gray-800 p-2"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Profile Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Profile</h3>
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white font-bold text-2xl">
              {user?.displayName?.[0] || user?.email?.[0] || 'U'}
            </div>
            <div>
              <div className="font-semibold text-gray-800 text-lg">{user?.displayName || 'Euskera Learner'}</div>
              <div className="text-gray-600">{user?.email}</div>
            </div>
          </div>
          <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-6 rounded-lg transition-colors">
            Edit Profile
          </button>
        </div>

        {/* Learning Settings */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Learning Preferences</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-800">Daily Goal</div>
                <div className="text-sm text-gray-600">XP to earn each day</div>
              </div>
              <select className="bg-gray-100 border border-gray-300 rounded-lg px-3 py-2">
                <option>20 XP</option>
                <option>50 XP</option>
                <option>100 XP</option>
              </select>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-800">Sound Effects</div>
                <div className="text-sm text-gray-600">Audio feedback for answers</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-800">Speaking Exercises</div>
                <div className="text-sm text-gray-600">Practice pronunciation</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Notifications</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-800">Daily Reminder</div>
                <div className="text-sm text-gray-600">Remind me to practice</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-800">Streak Freeze</div>
                <div className="text-sm text-gray-600">Protect your streak</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Account Actions */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Account</h3>
          <div className="space-y-3">
            <button 
              onClick={() => openModal('Privacy Policy', 'At Euskera, we take your privacy seriously. We collect minimal data necessary to provide our language learning service. Your learning progress is stored securely and never shared with third parties. We use industry-standard encryption to protect your data. You can request deletion of your data at any time by contacting support.')}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-6 rounded-lg transition-colors text-left"
            >
              Privacy Policy
            </button>
            <button 
              onClick={() => openModal('Terms of Service', 'By using Euskera, you agree to our terms. Our service is provided "as is" for educational purposes. You are responsible for maintaining the confidentiality of your account. We reserve the right to modify the service and these terms. Prohibited uses include sharing accounts or using the service for commercial purposes without permission.')}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-6 rounded-lg transition-colors text-left"
            >
              Terms of Service
            </button>
            <button 
              onClick={() => openModal('Contact Support', 'Need help? We\'re here for you! Email us at: support@euskera-app.com or use the feedback form in the app. We typically respond within 24 hours. For technical issues, please include your device and browser information.')}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-6 rounded-lg transition-colors text-left"
            >
              Contact Support
            </button>
            <button 
              onClick={handleSignOut}
              className="w-full bg-red-100 hover:bg-red-200 text-red-800 font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
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

  // Main App Render - Route to different screens
  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <HomeScreen />;
      case 'friends':
        return <FriendsScreen />;
      case 'achievements':
        return <AchievementsScreen />;
      case 'settings':
        return <SettingsScreen />;
      case 'lesson':
        return <LessonScreen />;
      default:
        return <HomeScreen />;
    }
  };

  // Main App Render
  return (
    <div className="font-sans">
      {renderCurrentScreen()}
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

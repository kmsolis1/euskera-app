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

  // Updated lessons with cultural focus
  const lessons = [
    {
      id: 1,
      title: "Ateak Zabalduz (Opening Doors)",
      description: "Discover the words your ancestors spoke",
      difficulty: "Beginner",
      xp: 20,
      isPremium: false,
      category: "Etxe (Home) - Heritage Connection",
      culturalInsight: "These phrases connect you to 1,000+ years of Basque tradition, spoken by your ancestors in the same mountains and valleys.",
      questions: [
        {
          type: "multiple-choice",
          question: "How do you say 'I am Basque' - a declaration of cultural identity?",
          options: ["Ni euskalduna naiz", "Ni turistak naiz", "Ni amerikarra naiz", "Ni frantziarra naiz"],
          correct: "Ni euskalduna naiz",
          translation: "I am Basque",
          explanation: "Euskaldun literally means 'one who has Euskera' - this is how Basques have identified themselves for centuries.",
          culturalNote: "🏔️ Heritage Connection: Your ancestors used this exact phrase to identify themselves as keepers of Europe's oldest language."
        },
        {
          type: "translation",
          question: "What does this heritage phrase mean?",
          basque: "Nire arbasoak hemengo ziren",
          options: ["My ancestors were from here", "My family is traveling", "I am learning Basque", "This is my homeland"],
          correct: "My ancestors were from here",
          translation: "My ancestors were from here",
          explanation: "A powerful phrase connecting you to your Basque roots and ancestral homeland.",
          culturalNote: "🌊 Use This: Perfect for when visiting the village your family came from."
        },
        {
          type: "multiple-choice",
          question: "How do you introduce yourself with your Basque name heritage?",
          options: ["Nire izena... da", "Nik nahi dut", "Hori zer da", "Non nago"],
          correct: "Nire izena... da",
          translation: "My name is...",
          explanation: "Many Basque surnames carry deep meaning - connecting to places, occupations, or characteristics of your ancestors.",
          culturalNote: "📚 Did you know? Basque surnames often tell the story of where your family lived: 'Etxeberria' means 'new house', 'Mendizabal' means 'wide mountain'."
        },
        {
          type: "translation",
          question: "This question helps trace your family origins:",
          basque: "Nire familia... etorri zen",
          options: ["My family came from...", "My family lives in...", "My family works in...", "My family speaks..."],
          correct: "My family came from...",
          translation: "My family came from...",
          explanation: "Essential for genealogy research and connecting with local families who may share your ancestry.",
          culturalNote: "🏠 Heritage Tip: Many Basque villages maintain detailed family records going back centuries."
        }
      ]
    },
    {
      id: 2,
      title: "Familia Zuhaitza (Family Tree)",
      description: "Learn family terms through ancestral connections",
      difficulty: "Beginner",
      xp: 25,
      isPremium: false,
      category: "Etxe (Home) - Heritage Connection",
      culturalInsight: "Basque family structures were unique in Europe - inheritance through both male and female lines, with deep respect for elders.",
      questions: [
        {
          type: "multiple-choice",
          question: "How do you say 'grandfather' - the keeper of family stories?",
          basque: "aitona",
          options: ["aitona", "amona", "osaba", "anaia"],
          correct: "aitona",
          translation: "Grandfather",
          explanation: "Aitona literally means 'big father' - traditionally the storyteller and keeper of family history.",
          culturalNote: "👴 Cultural Role: Basque grandfathers traditionally passed down oral histories, legends, and family traditions."
        },
        {
          type: "translation",
          question: "Who was the heart of the traditional Basque household?",
          basque: "amona",
          options: ["Grandmother", "Mother", "Aunt", "Sister"],
          correct: "Grandmother",
          translation: "Grandmother",
          explanation: "Amona means 'big mother' - often the matriarch who maintained cultural traditions and recipes.",
          culturalNote: "👵 Heritage Wisdom: Basque grandmothers were keepers of recipes, folk medicine, and cultural practices passed down through generations."
        },
        {
          type: "multiple-choice",
          question: "In traditional Basque culture, which family member often inherited the family farm?",
          options: ["The eldest child (regardless of gender)", "Only the eldest son", "Only the youngest", "Only daughters"],
          correct: "The eldest child (regardless of gender)",
          translation: "The eldest child",
          explanation: "Basque inheritance law was unique in medieval Europe - the 'etxekojaun/etxekoandre' (house lord/lady) could be male or female.",
          culturalNote: "⚖️ Progressive Culture: Basque women had inheritance and property rights centuries before most European cultures."
        },
        {
          type: "translation",
          question: "What does this phrase about family heritage mean?",
          basque: "Zein herritatik?",
          options: ["From which town?", "What family name?", "How many siblings?", "What profession?"],
          correct: "From which town?",
          translation: "From which town?",
          explanation: "Essential question for tracing Basque ancestry - most families are identified by their village of origin.",
          culturalNote: "🗺️ Genealogy Key: Basque identity is deeply tied to specific villages and valleys - this question opens family history doors."
        }
      ]
    },
    {
      id: 3,
      title: "Turista Baino Gehiago (More Than a Tourist)",
      description: "Navigate the Basque Country like a cultural insider",
      difficulty: "Beginner",
      xp: 30,
      isPremium: false,
      category: "Bidaiak (Journeys) - Cultural Tourism",
      culturalInsight: "When you speak Euskera, locals know you're genuinely interested in their culture, not just passing through.",
      questions: [
        {
          type: "multiple-choice",
          question: "How do you show cultural respect by expressing desire to learn?",
          options: ["Euskera ikasi nahi dut", "English hitz egin", "Turista naiz", "Diru nahi dut"],
          correct: "Euskera ikasi nahi dut",
          translation: "I want to learn Basque",
          explanation: "This phrase immediately signals to locals that you respect their culture and want genuine connection.",
          culturalNote: "🤝 Cultural Bridge: Saying this opens doors - locals often become enthusiastic teachers and cultural guides."
        },
        {
          type: "translation",
          question: "How do you express genuine cultural curiosity?",
          basque: "Kultura ezagutu nahi dut",
          options: ["I want to know the culture", "I want to buy souvenirs", "I want to take photos", "I want to eat food"],
          correct: "I want to know the culture",
          translation: "I want to know the culture",
          explanation: "Goes beyond surface tourism to show you want to understand the deeper meaning behind Basque traditions.",
          culturalNote: "🎭 Cultural Immersion: This phrase often leads to invitations to local festivals, family gatherings, or cultural explanations."
        },
        {
          type: "multiple-choice",
          question: "What's the respectful way to ask about local Basque heritage sites?",
          options: ["Non daude euskal lekuak?", "Tourist information?", "Where McDonald's?", "Hablo español"],
          correct: "Non daude euskal lekuak?",
          translation: "Where are the Basque places?",
          explanation: "Shows you're seeking authentic Basque culture, not generic tourist attractions.",
          culturalNote: "🏛️ Hidden Gems: Locals will direct you to ancient stone circles, traditional cider houses, and family-run restaurants tourists never find."
        },
        {
          type: "translation",
          question: "This genealogy question connects you with locals:",
          basque: "Non jaio zen nire aitona?",
          options: ["Where was my grandfather born?", "When did grandfather die?", "What did grandfather do?", "How old was grandfather?"],
          correct: "Where was my grandfather born?",
          translation: "Where was my grandfather born?",
          explanation: "Basques take great pride in helping diaspora descendants trace their family origins.",
          culturalNote: "🔍 Family Detective: This question often leads to introductions with local historians, genealogists, or distant relatives still in the area."
        }
      ]
    },
    {
      id: 4,
      title: "Pintxo Kultura (Pintxo Culture)",
      description: "Experience Basque social dining culture authentically",
      difficulty: "Intermediate",
      xp: 35,
      isPremium: true,
      category: "Bidaiak (Journeys) - Cultural Tourism",
      culturalInsight: "Pintxo culture isn't just about food - it's about community, conversation, and maintaining social bonds that define Basque society.",
      questions: [
        {
          type: "multiple-choice",
          question: "How do you respectfully ask for the local's favorite pintxo?",
          options: ["Zer gomendatzen duzu?", "Cheap food please", "Tourist menu?", "English menu?"],
          correct: "Zer gomendatzen duzu?",
          translation: "What do you recommend?",
          explanation: "Shows respect for local expertise and opens conversation about regional specialties and family recipes.",
          culturalNote: "👨‍🍳 Cultural Exchange: Bartenders often share stories about their grandmother's recipes or explain the history behind traditional pintxos."
        },
        {
          type: "translation",
          question: "How do you participate in the social aspect of pintxo culture?",
          basque: "Txikito bat, mesedez",
          options: ["A small glass, please", "Large beer, please", "Water bottle, please", "Coffee cup, please"],
          correct: "A small glass, please",
          translation: "A small glass, please",
          explanation: "Txikito (small glass of wine) is central to pintxo culture - meant for sipping while socializing, not drinking quickly.",
          culturalNote: "🍷 Social Ritual: The txikito encourages slow, social drinking that builds community connections over hours of conversation."
        },
        {
          type: "multiple-choice",
          question: "What's the traditional way to show appreciation for exceptional food?",
          options: ["Oso goxoa!", "Very expensive!", "Too spicy!", "More sauce!"],
          correct: "Oso goxoa!",
          translation: "Very delicious!",
          explanation: "Goxoa is a warm, appreciative term that acknowledges the cook's skill and cultural heritage.",
          culturalNote: "😋 Cultural Compliment: This phrase often leads to chefs explaining cooking techniques or family recipe origins."
        },
        {
          type: "translation",
          question: "How do you ask about traditional preparation methods?",
          basque: "Nola egiten da?",
          options: ["How is it made?", "Where is it from?", "When do you serve it?", "Why is it popular?"],
          correct: "How is it made?",
          translation: "How is it made?",
          explanation: "Shows genuine interest in preserving and understanding traditional Basque cooking methods.",
          culturalNote: "👩‍🍳 Recipe Exchange: Often leads to detailed explanations about traditional techniques, seasonal ingredients, or family variations."
        }
      ]
    },
    {
      id: 5,
      title: "Euskera, Hizkuntza Zaharra (The Ancient Language)",
      description: "Understand what makes Basque culture unique in Europe",
      difficulty: "Intermediate",
      xp: 40,
      isPremium: true,
      category: "Ondarea (Heritage) - Deep Cultural Connection",
      culturalInsight: "Euskera is Europe's oldest language - unrelated to any other known language, spoken here before Romans, Celts, or Germanic tribes arrived.",
      questions: [
        {
          type: "multiple-choice",
          question: "How do you express pride in learning this ancient language?",
          options: ["Euskera zaharren hizkuntza da", "Spanish is easier", "French is better", "English is global"],
          correct: "Euskera zaharren hizkuntza da",
          translation: "Basque is the oldest language",
          explanation: "Acknowledges the unique historical significance of Euskera as a pre-Indo-European language.",
          culturalNote: "🏛️ Ancient Heritage: When Romans arrived 2,000 years ago, they found Basques already speaking this language - unchanged in its core structure."
        },
        {
          type: "translation",
          question: "How do you show respect for cultural preservation efforts?",
          basque: "Kultura mantendu behar dugu",
          options: ["We must maintain culture", "Culture is changing", "Modern is better", "Old ways are gone"],
          correct: "We must maintain culture",
          translation: "We must maintain culture",
          explanation: "Expresses solidarity with ongoing efforts to preserve and revitalize Basque language and traditions.",
          culturalNote: "🛡️ Cultural Guardian: This phrase shows you understand your role in helping preserve this unique European heritage."
        },
        {
          type: "multiple-choice",
          question: "What makes Euskera scientifically fascinating to linguists?",
          options: ["Hizkuntza isolatua da", "Easy to learn", "Similar to Spanish", "New language"],
          correct: "Hizkuntza isolatua da",
          translation: "It's an isolated language",
          explanation: "Euskera has no known linguistic relatives - a unique survival from pre-historic Europe.",
          culturalNote: "🔬 Scientific Marvel: Linguists study Euskera to understand what European languages were like before Indo-European expansion."
        },
        {
          type: "translation",
          question: "How do you express connection to this ancient heritage?",
          basque: "Nire ondarea da",
          options: ["It is my heritage", "It is too difficult", "It is not important", "It is just old"],
          correct: "It is my heritage",
          translation: "It is my heritage",
          explanation: "Personal claim to cultural inheritance and responsibility for preservation.",
          culturalNote: "🌳 Living Heritage: This phrase connects you to an unbroken chain of speakers stretching back thousands of years."
        }
      ]
    },
    {
      id: 6,
      title: "Herritar Izatea (Being a Community Member)",
      description: "Understanding Basque values and community identity",
      difficulty: "Intermediate",
      xp: 45,
      isPremium: true,
      category: "Ondarea (Heritage) - Deep Cultural Connection",
      culturalInsight: "Basque society is built on concepts of mutual aid, collective identity, and deep connection to place - values that shaped unique democratic traditions.",
      questions: [
        {
          type: "multiple-choice",
          question: "How do you express the core Basque concept of collective identity?",
          options: ["Euskal Herria gure etxea da", "I am individual", "Competition is key", "Money matters most"],
          correct: "Euskal Herria gure etxea da",
          translation: "The Basque Country is our home",
          explanation: "Euskal Herria (the Basque Country) represents collective identity transcending political borders.",
          culturalNote: "🏠 Collective Identity: This concept unites Basques across France and Spain, emphasizing shared culture over political divisions."
        },
        {
          type: "translation",
          question: "What traditional value emphasizes community cooperation?",
          basque: "Auzolan egiten dugu",
          options: ["We do community work", "We work alone", "We compete always", "We avoid others"],
          correct: "We do community work",
          translation: "We do community work",
          explanation: "Auzolan is the traditional practice of neighbors working together for community benefit.",
          culturalNote: "🤝 Traditional Democracy: Auzolan represents ancient Basque democratic values - collective decision-making and mutual aid."
        },
        {
          type: "multiple-choice",
          question: "How do you show respect for Basque democratic traditions?",
          options: ["Guztiak parte hartu behar dugu", "Leaders decide everything", "Only experts know", "Democracy is new"],
          correct: "Guztiak parte hartu behar dugu",
          translation: "Everyone must participate",
          explanation: "Reflects traditional Basque assemblies where community decisions required broad participation.",
          culturalNote: "🗳️ Ancient Democracy: Basque communities practiced participatory democracy centuries before it became widespread in Europe."
        },
        {
          type: "translation",
          question: "How do you express commitment to preserving cultural practices?",
          basque: "Ohiturak gorde behar ditugu",
          options: ["We must preserve customs", "Customs are outdated", "Change everything now", "Forget the past"],
          correct: "We must preserve customs",
          translation: "We must preserve customs",
          explanation: "Shows understanding that cultural survival depends on active preservation efforts.",
          culturalNote: "🎭 Living Culture: Basque festivals, sports, and traditions survive because each generation commits to passing them forward."
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
              <p className="text-sm text-gray-600">Connect with your Basque heritage</p>
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
            Your Cultural Journey
          </h3>
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">{Object.values(userProgress).filter(Boolean).length}</div>
              <div className="text-blue-100">Cultural Lessons</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">{streak}</div>
              <div className="text-blue-100">Days Connected</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">{xp}</div>
              <div className="text-blue-100">Heritage Points</div>
            </div>
          </div>
        </div>

        {Object.entries(groupedLessons).map(([category, categoryLessons]) => (
          <div key={category} className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                {category}
                {category.includes('Heritage') && (
                  <div className="ml-2 text-amber-600">🏛️</div>
                )}
                {category.includes('Tourism') && (
                  <div className="ml-2 text-blue-600">🗺️</div>
                )}
                {category.includes('Home') && (
                  <div className="ml-2 text-green-600">🏠</div>
                )}
              </h2>
              {category.includes('Heritage') && (
                <div className="text-sm text-gray-600 italic">
                  "Connect with your ancestors"
                </div>
              )}
              {category.includes('Tourism') && (
                <div className="text-sm text-gray-600 italic">
                  "Experience like a local"
                </div>
              )}
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {categoryLessons.map((lesson) => {
                const globalIndex = lessons.findIndex(l => l.id === lesson.id);
                const isLocked = lesson.isPremium && !isPremium;
                const isCompleted = userProgress[lesson.id];
                
                return (
                  <div key={lesson.id} className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 ${isLocked ? 'opacity-75' : 'hover:-translate-y-1'} border-l-4 ${
                    lesson.category.includes('Heritage') ? 'border-amber-500' :
                    lesson.category.includes('Tourism') ? 'border-blue-500' :
                    lesson.category.includes('Home') ? 'border-green-500' : 'border-gray-300'
                  }`}>
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          isCompleted ? 'bg-green-100 text-green-600' : 
                          isLocked ? 'bg-gray-100 text-gray-400' : 
                          lesson.category.includes('Heritage') ? 'bg-amber-100 text-amber-600' :
                          lesson.category.includes('Tourism') ? 'bg-blue-100 text-blue-600' :
                          'bg-green-100 text-green-600'
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
                              : lesson.category.includes('Heritage') 
                              ? 'bg-amber-600 hover:bg-amber-700 text-white hover:scale-105'
                              : lesson.category.includes('Tourism')
                              ? 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-105'
                              : 'bg-green-600 hover:bg-green-700 text-white hover:scale-105'
                          }`}
                        >
                          {isLocked ? 'Premium' : (isCompleted ? 'Review' : 'Begin Journey')}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Cultural Banner Ad */}
        {!isPremium && (
          <div className="mb-8">
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-dashed border-amber-300 rounded-lg p-6 text-center">
              <div className="text-2xl mb-2">🏔️</div>
              <p className="text-sm text-amber-600 mb-2">Sponsored Content</p>
              <div className="bg-gradient-to-r from-blue-100 to-green-100 rounded p-6">
                <h4 className="font-semibold text-gray-700 mb-2">Visit the Basque Country</h4>
                <p className="text-sm text-gray-600 mb-3">Experience the culture you're learning firsthand</p>
                <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 transition-colors">
                  Plan Your Heritage Journey
                </button>
              </div>
              <button 
                onClick={() => openModal('Remove Ads', 'Focus on your cultural learning journey without distractions!\n\n✨ Ad-free experience\n🏛️ Premium heritage content\n🗺️ Advanced cultural insights\n\nUpgrade to Premium for $9.99/month')}
                className="text-xs text-amber-600 hover:underline mt-2"
              >
                Remove ads • Focus on heritage
              </button>
            </div>
          </div>
        )}
      </div>

      <Navigation />
    </div>
  );

  // Hearts depleted screen with cultural messaging
  const HeartsDepletedScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Heart className="w-10 h-10 text-red-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Cultural Journey Paused</h2>
        <p className="text-gray-600 mb-6">Even the best learners need breaks! Continue your heritage connection by watching an ad or upgrading to premium.</p>
        
        <div className="space-y-3 mb-6">
          <button
            onClick={() => watchAdForReward('hearts')}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-6 rounded-lg font-medium hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <span>📺</span>
            <span>Watch Ad - Continue Learning Heritage</span>
          </button>
          
          <button
            onClick={() => openModal('Unlimited Cultural Learning', 'Continue your heritage journey without interruption!\n\n💖 Unlimited hearts\n🏛️ Premium cultural insights\n🗺️ Advanced heritage content\n✨ Ad-free experience\n\nUpgrade now for $9.99/month')}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 px-6 rounded-lg font-medium hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <Crown className="w-5 h-5" />
            <span>Unlimited Heritage Learning</span>
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
              
              {/* Cultural Insight for lesson start */}
              {currentQuestion === 0 && lesson.culturalInsight && (
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4 mb-4">
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl">💡</div>
                    <div>
                      <h4 className="font-semibold text-amber-800 mb-1">Cultural Insight</h4>
                      <p className="text-sm text-amber-700">{lesson.culturalInsight}</p>
                    </div>
                  </div>
                </div>
              )}
              
              {question.basque && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mb-4 border border-blue-100">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-800 mb-2">{question.basque}</div>
                    <div className="text-sm text-blue-600 uppercase tracking-wide">Euskera - Europe's Oldest Language</div>
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
                      <div className={`text-sm mb-3 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                        💡 {question.explanation}
                      </div>
                    )}
                    {question.culturalNote && (
                      <div className={`text-sm p-3 rounded-lg ${
                        isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                      }`}>
                        <div className={`font-medium mb-1 ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                          Cultural Connection
                        </div>
                        <div className={`text-xs ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                          {question.culturalNote}
                        </div>
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

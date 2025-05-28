<div className="bg-gradient-to-r from-blue-500 to-green-500 rounded-2xl shadow-xl p-6 mb-8 text-white">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <Zap className="w-6 h-6 mr-2" />
            {appLanguage === 'en' ? 'Your Learning Progress' : 'Tu Progreso de Aprendizaje'}
          </h3>
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">{completedLessons}/{totalLessons}</div>
              <div className="text-blue-100">{appLanguage === 'en' ? 'Lessons Done' : 'Lecciones Hechas'}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">{progressPercentage}%</div>
              <div className="text-blue-100">{appLanguage === 'en' ? 'Complete' : 'Completo'}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">{xp}</div>
              <div className="text-blue-100">XP {appLanguage === 'en' ? 'Earned' : 'Ganados'}</div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-sm text-blue-100 mb-2">
              <span>{appLanguage === 'en' ? 'Overall Progress' : 'Progreso General'}</span>
              <span>{completedLessons}/{totalLessons} {appLanguage === 'en' ? 'lessons' : 'lecciones'}</span>
            </div>
            <div className="w-full bg-blue-400/30 rounded-full h-3">
              <div 
                className="bg-white h-3 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Unit Progress Overview */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            {appLanguage === 'en' ? 'Learning Path' : 'Ruta de Aprendizaje'}
          </h3>
          <div className="space-y-4">
            {Array.from({length: totalUnits}, (_, i) => {
              const unitNumber = i + 1;
              const unitLessons = lessons.filter(l => l.unit === unitNumber);
              const completedInUnit = unitLessons.filter(l => userProgress[l.id]).length;
              const unitProgress = Math.round((completedInUnit / unitLessons.length) * 100);
              const isUnlocked = unitNumber === 1 || lessons.some(l => l.unit === unitNumber - 1 && userProgress[l.id]);
              
              return (
                <div key={unitNumber} className={`border rounded-lg p-4 ${isUnlocked ? 'border-blue-200 bg-blue-50' : 'border-gray-200 bg-gray-50'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        unitProgress === 100 ? 'bg-green-500 text-white' : 
                        isUnlocked ? 'bg-blue-500 text-white' : 'bg-gray-400 text-white'
                      }`}>
                        {unitProgress === 100 ? '✓' : unitNumber}
                      </div>
                      <div>
                        <h4 className={`font-semibold ${isUnlocked ? 'text-gray-800' : 'text-gray-500'}`}>
                          {unitLessons[0]?.category || `Unit ${unitNumber}`}
                        </h4>
                        <p className={`text-sm ${isUnlocked ? 'text-gray-600' : 'text-gray-400'}`}>
                          {completedInUnit}/{unitLessons.length} {appLanguage === 'en' ? 'lessons' : 'lecciones'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-bold ${isUnlocked ? 'text-blue-600' : 'text-gray-400'}`}>
                        {unitProgress}%
                      </div>
                      {!isUnlocked && (
                        <Lock className="w-4 h-4 text-gray-400 mx-auto mt-1" />
                      )}
                    </div>
                  </div>
                 <div 
  className={`h-2 rounded-full transition-all duration-300 ${
    unitProgress === 100
      ? 'bg-green-500'
      : isUnlocked
      ? 'bg-blue-500'
      : 'bg-gray-400'
  }`}
  style={{ width: `${unitProgress}%` }}
></div>
import { Home } from 'lucide-react';
import { Users } from 'lucide-react';
import { Award } from 'lucide-react';
import { Settings } from 'lucide-react';
import { Star } from 'lucide-react';
import { Heart } from 'lucide-react';
import { Flame } from 'lucide-react';
import { Book } from 'lucide-react';
import { CheckCircle } from 'lucide-react';
import { XCircle } from 'lucide-react';
import { Trophy } from 'lucide-react';
import { Crown } from 'lucide-react';
import { Lock } from 'lucide-react';
import { Target } from 'lucide-react';
import { Zap } from 'lucide-react';
import { Sparkles } from 'lucide-react';
import { User } from 'lucide-react';
import { Edit3 } from 'lucide-react';

const EuskeraApp = () => {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', content: '' });
  const [appLanguage, setAppLanguage] = useState('en');
  const [onboardingStep, setOnboardingStep] = useState(0);
  
  const [currentLesson, setCurrentLesson] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [lessonComplete, setLessonComplete] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showCorrectAnimation, setShowCorrectAnimation] = useState(false);
  
  const [hearts, setHearts] = useState(5);
  const [maxHearts, setMaxHearts] = useState(5);
  const [xp, setXp] = useState(120);
  const [streak, setStreak] = useState(1);
  const [userProgress, setUserProgress] = useState({ 1: true, 2: false });
  const [isPremium, setIsPremium] = useState(false);
  const [lastHeartRegenTime, setLastHeartRegenTime] = useState(Date.now());
  const [heartRegenTimer, setHeartRegenTimer] = useState(null);
  
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: "Euskera Learner",
    email: "learner@example.com",
    totalLessons: 1,
    location: "San Francisco, CA",
    basqueAncestry: "Bizkaia",
    learningGoal: "Connect with heritage",
    joinDate: "2025-05-26"
  });
  
  const [showAdModal, setShowAdModal] = useState(false);
  const [adModalType, setAdModalType] = useState('');

  const translations = {
    en: {
      appName: "Euskera",
      tagline: "Connect with your Basque heritage",
      removeAds: "Remove Ads",
      yourCulturalJourney: "Your Cultural Journey",
      culturalLessons: "Cultural Lessons",
      daysConnected: "Days Connected",
      heritagePoints: "Heritage Points",
      connectWithAncestors: "Connect with your ancestors",
      premium: "Premium",
      review: "Review",
      beginJourney: "Begin Journey",
      sponsoredContent: "Sponsored Content",
      visitBasqueCountry: "Visit the Basque Country",
      experienceCulture: "Experience the culture you're learning firsthand",
      planHeritage: "Plan Your Heritage Journey",
      home: "Home",
      profile: "Profile",
      friends: "Friends",
      achievements: "Achievements",
      settings: "Settings",
      dayStreak: "Day Streak",
      totalXP: "Total XP",
      lessons: "Lessons",
      startCommunity: "Start Your Community",
      inviteFriends: "Invite friends to learn Basque together!",
      inviteFriendsBtn: "Invite Friends",
      yourAchievements: "Your Achievements",
      firstSteps: "First Steps",
      completeFirstLesson: "Complete your first lesson",
      appSettings: "App Settings",
      privacyPolicy: "Privacy Policy",
      termsOfService: "Terms of Service",
      editProfile: "Edit Profile",
      save: "Save",
      cancel: "Cancel",
      name: "Name",
      email: "Email",
      location: "Location",
      basqueAncestry: "Basque Ancestry",
      learningGoal: "Learning Goal",
      memberSince: "Member since",
      profileUpdated: "Profile Updated",
      profileUpdateSuccess: "Your profile has been updated successfully!",
      continue: "Continue",
      heartsRefill: "Hearts refill over time",
      heartsRefillIn: "Next heart in",
      heartsFull: "Hearts full!",
      minutes: "minutes",
      seconds: "seconds"
    },
    es: {
      appName: "Euskera",
      tagline: "Conecta con tu herencia vasca",
      removeAds: "Eliminar Anuncios",
      yourCulturalJourney: "Tu Viaje Cultural",
      culturalLessons: "Lecciones Culturales",
      daysConnected: "Días Conectado",
      heritagePoints: "Puntos de Herencia",
      connectWithAncestors: "Conecta con tus antepasados",
      premium: "Premium",
      review: "Repasar",
      beginJourney: "Comenzar Viaje",
      sponsoredContent: "Contenido Patrocinado",
      visitBasqueCountry: "Visita el País Vasco",
      experienceCulture: "Experimenta la cultura que estás aprendiendo de primera mano",
      planHeritage: "Planifica Tu Viaje Patrimonial",
      home: "Inicio",
      profile: "Perfil",
      friends: "Amigos",
      achievements: "Logros",
      settings: "Configuración",
      dayStreak: "Racha de Días",
      totalXP: "XP Total",
      lessons: "Lecciones",
      startCommunity: "Inicia Tu Comunidad",
      inviteFriends: "¡Invita a amigos a aprender euskera juntos!",
      inviteFriendsBtn: "Invitar Amigos",
      yourAchievements: "Tus Logros",
      firstSteps: "Primeros Pasos",
      completeFirstLesson: "Completa tu primera lección",
      appSettings: "Configuración de la Aplicación",
      privacyPolicy: "Política de Privacidad",
      termsOfService: "Términos del Servicio",
      editProfile: "Editar Perfil",
      save: "Guardar",
      cancel: "Cancelar",
      name: "Nombre",
      email: "Correo electrónico",
      location: "Ubicación",
      basqueAncestry: "Ascendencia Vasca",
      learningGoal: "Objetivo de Aprendizaje",
      memberSince: "Miembro desde",
      profileUpdated: "Perfil Actualizado",
      profileUpdateSuccess: "¡Tu perfil se ha actualizado correctamente!",
      continue: "Continuar",
      heartsRefill: "Los corazones se rellenan con el tiempo",
      heartsRefillIn: "Próximo corazón en",
      heartsFull: "¡Corazones llenos!",
      minutes: "minutos",
      seconds: "segundos"
    }
  };

  const t = translations[appLanguage];

  const lessons = [
    {
      id: 1,
      title: appLanguage === 'en' ? "Kaixo! (Hello!)" : "Kaixo! (¡Hola!)",
      description: appLanguage === 'en' ? "Learn your first Basque greeting" : "Aprende tu primer saludo vasco",
      difficulty: appLanguage === 'en' ? "Beginner" : "Principiante",
      xp: 10,
      isPremium: false,
      category: appLanguage === 'en' ? "Unit 1: Basic Greetings" : "Unidad 1: Saludos Básicos",
      unit: 1,
      lessonInUnit: 1,
      totalLessonsInUnit: 5,
      questions: [
        {
          type: "multiple-choice",
          question: appLanguage === 'en' 
            ? "How do you say 'Hello' in Euskera?"
            : "¿Cómo se dice 'Hola' en euskera?",
          options: ["Kaixo", "Agur", "Mesedez", "Eskerrik asko"],
          correct: "Kaixo",
          translation: appLanguage === 'en' ? "Hello" : "Hola",
          explanation: appLanguage === 'en' 
            ? "Kaixo is the most common greeting, used any time of day."
            : "Kaixo es el saludo más común, usado a cualquier hora del día."
        },
        {
          type: "multiple-choice",
          question: appLanguage === 'en' 
            ? "When someone says 'Kaixo!' what do you say back?"
            : "Cuando alguien dice '¡Kaixo!', ¿qué respondes?",
          options: ["Kaixo!", "Agur", "Ez", "Bai"],
          correct: "Kaixo!",
          translation: appLanguage === 'en' ? "Hello!" : "¡Hola!",
          explanation: appLanguage === 'en' 
            ? "Just like English - you respond to 'Hello' with 'Hello'!"
            : "¡Igual que en español - respondes 'Hola' con 'Hola'!"
        }
      ]
    },
    {
      id: 2,
      title: appLanguage === 'en' ? "Bai eta Ez (Yes & No)" : "Bai eta Ez (Sí y No)",
      description: appLanguage === 'en' ? "The two most important words" : "Las dos palabras más importantes",
      difficulty: appLanguage === 'en' ? "Beginner" : "Principiante",
      xp: 10,
      isPremium: false,
      category: appLanguage === 'en' ? "Unit 1: Basic Greetings" : "Unidad 1: Saludos Básicos",
      unit: 1,
      lessonInUnit: 2,
      totalLessonsInUnit: 5,
      questions: [
        {
          type: "multiple-choice",
          question: appLanguage === 'en' 
            ? "How do you say 'Yes'?"
            : "¿Cómo se dice 'Sí'?",
          options: ["Bai", "Ez", "Kaixo", "Agur"],
          correct: "Bai",
          translation: appLanguage === 'en' ? "Yes" : "Sí",
          explanation: appLanguage === 'en' 
            ? "Bai (sounds like 'bye') means yes."
            : "Bai (suena como 'bai') significa sí."
        },
        {
          type: "multiple-choice",
          question: appLanguage === 'en' 
            ? "How do you say 'No'?"
            : "¿Cómo se dice 'No'?",
          options: ["Ez", "Bai", "Kaixo", "Agur"],
          correct: "Ez",
          translation: appLanguage === 'en' ? "No" : "No",
          explanation: appLanguage === 'en' 
            ? "Ez (sounds like 'eth') means no."
            : "Ez (suena como 'eth') significa no."
        }
      ]
    },
    {
      id: 3,
      title: appLanguage === 'en' ? "Eskerrik asko (Thank you)" : "Eskerrik asko (Gracias)",
      description: appLanguage === 'en' ? "Show appreciation in Euskera" : "Muestra aprecio en euskera",
      difficulty: appLanguage === 'en' ? "Beginner" : "Principiante",
      xp: 10,
      isPremium: false,
      category: appLanguage === 'en' ? "Unit 1: Basic Greetings" : "Unidad 1: Saludos Básicos",
      unit: 1,
      lessonInUnit: 3,
      totalLessonsInUnit: 5,
      questions: [
        {
          type: "multiple-choice",
          question: appLanguage === 'en' 
            ? "How do you say 'Thank you'?"
            : "¿Cómo se dice 'Gracias'?",
          options: ["Eskerrik asko", "Kaixo", "Agur", "Barkatu"],
          correct: "Eskerrik asko",
          translation: appLanguage === 'en' ? "Thank you" : "Gracias",
          explanation: appLanguage === 'en' 
            ? "Eskerrik asko means 'thank you' - literally 'many thanks'."
            : "Eskerrik asko significa 'gracias' - literalmente 'muchas gracias'."
        }
      ]
    },
    {
      id: 4,
      title: appLanguage === 'en' ? "Agur (Goodbye)" : "Agur (Adiós)",
      description: appLanguage === 'en' ? "End conversations politely" : "Termina conversaciones cortésmente",
      difficulty: appLanguage === 'en' ? "Beginner" : "Principiante",
      xp: 10,
      isPremium: false,
      category: appLanguage === 'en' ? "Unit 1: Basic Greetings" : "Unidad 1: Saludos Básicos",
      unit: 1,
      lessonInUnit: 4,
      totalLessonsInUnit: 5,
      questions: [
        {
          type: "multiple-choice",
          question: appLanguage === 'en' 
            ? "How do you say 'Goodbye'?"
            : "¿Cómo se dice 'Adiós'?",
          options: ["Agur", "Kaixo", "Bai", "Ez"],
          correct: "Agur",
          translation: appLanguage === 'en' ? "Goodbye" : "Adiós",
          explanation: appLanguage === 'en' 
            ? "Agur is the standard way to say goodbye."
            : "Agur es la forma estándar de decir adiós."
        }
      ]
    },
    {
      id: 5,
      title: appLanguage === 'en' ? "Conversation Practice" : "Práctica de Conversación",
      description: appLanguage === 'en' ? "Put it all together" : "Junta todo lo aprendido",
      difficulty: appLanguage === 'en' ? "Beginner" : "Principiante",
      xp: 15,
      isPremium: false,
      category: appLanguage === 'en' ? "Unit 1: Basic Greetings" : "Unidad 1: Saludos Básicos",
      unit: 1,
      lessonInUnit: 5,
      totalLessonsInUnit: 5,
      questions: [
        {
          type: "multiple-choice",
          question: appLanguage === 'en' 
            ? "Someone says 'Kaixo!' You say 'Kaixo!' They say 'Eskerrik asko.' What do they mean?"
            : "Alguien dice '¡Kaixo!' Tú dices '¡Kaixo!' Dicen 'Eskerrik asko.' ¿Qué significa?",
          options: [
            appLanguage === 'en' ? "Thank you" : "Gracias",
            appLanguage === 'en' ? "Goodbye" : "Adiós", 
            appLanguage === 'en' ? "Yes" : "Sí",
            appLanguage === 'en' ? "No" : "No"
          ],
          correct: appLanguage === 'en' ? "Thank you" : "Gracias",
          translation: appLanguage === 'en' ? "Thank you" : "Gracias",
          explanation: appLanguage === 'en' 
            ? "They're thanking you for responding to their greeting!"
            : "¡Te están agradeciendo por responder a su saludo!"
        },
        {
          type: "multiple-choice",
          question: appLanguage === 'en' 
            ? "What's the correct order for a simple greeting?"
            : "¿Cuál es el orden correcto para un saludo simple?",
          options: [
            "Kaixo → Kaixo → Agur",
            "Agur → Kaixo → Bai", 
            "Ez → Kaixo → Agur",
            "Kaixo → Ez → Agur"
          ],
          correct: "Kaixo → Kaixo → Agur",
          translation: appLanguage === 'en' ? "Hello → Hello → Goodbye" : "Hola → Hola → Adiós",
          explanation: appLanguage === 'en' 
            ? "A basic conversation: greet each other, then say goodbye."
            : "Una conversación básica: se saludan, luego se despiden."
        }
      ]
    },
    {
      id: 6,
      title: appLanguage === 'en' ? "Ni (I)" : "Ni (Yo)",
      description: appLanguage === 'en' ? "Talk about yourself" : "Habla de ti mismo",
      difficulty: appLanguage === 'en' ? "Beginner" : "Principiante",
      xp: 15,
      isPremium: false,
      category: appLanguage === 'en' ? "Unit 2: Introducing Yourself" : "Unidad 2: Presentarse",
      unit: 2,
      lessonInUnit: 1,
      totalLessonsInUnit: 4,
      questions: [
        {
          type: "multiple-choice",
          question: appLanguage === 'en' 
            ? "How do you say 'I' in Euskera?"
            : "¿Cómo se dice 'Yo' en euskera?",
          options: ["Ni", "Zu", "Hura", "Gu"],
          correct: "Ni",
          translation: appLanguage === 'en' ? "I" : "Yo",
          explanation: appLanguage === 'en' 
            ? "Ni means 'I' - the word for yourself."
            : "Ni significa 'yo' - la palabra para ti mismo."
        }
      ]
    }
  ];

  // Calculate total lessons and units
  const totalLessons = lessons.length;
  const totalUnits = Math.max(...lessons.map(l => l.unit));
  const completedLessons = Object.values(userProgress).filter(Boolean).length;
  const progressPercentage = Math.round((completedLessons / totalLessons) * 100);

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
      if (!isPremium && hearts > 1) {
        setHearts(prevHearts => prevHearts - 1);
      }
    }
  };
    
  const handleContinue = () => {
    const currentQ = lessons[currentLesson].questions[currentQuestion];
    const isCorrect = selectedAnswer === currentQ.correct;
    
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
  };

  const goHome = () => {
    setCurrentScreen('home');
    setCurrentQuestion(0);
    setSelectedAnswer('');
    setShowResult(false);
    setLessonComplete(false);
    setCorrectAnswers(0);
  };

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

  const HEART_REGEN_TIME = 20 * 60 * 1000;
  
  const regenerateHearts = () => {
    const now = Date.now();
    const timeSinceLastRegen = now - lastHeartRegenTime;
    const heartsToAdd = Math.floor(timeSinceLastRegen / HEART_REGEN_TIME);
    
    if (heartsToAdd > 0 && hearts < maxHearts) {
      const newHearts = Math.min(hearts + heartsToAdd, maxHearts);
      setHearts(newHearts);
      setLastHeartRegenTime(now - (timeSinceLastRegen % HEART_REGEN_TIME));
    }
  };

  const getTimeUntilNextHeart = () => {
    if (hearts >= maxHearts) return 0;
    const timeSinceLastRegen = Date.now() - lastHeartRegenTime;
    const timeUntilNext = HEART_REGEN_TIME - (timeSinceLastRegen % HEART_REGEN_TIME);
    return timeUntilNext;
  };

  const formatTime = (ms) => {
    const minutes = Math.floor(ms / (60 * 1000));
    const seconds = Math.floor((ms % (60 * 1000)) / 1000);
    return { minutes, seconds };
  };

  useEffect(() => {
    regenerateHearts();
    
    if (hearts < maxHearts) {
      const timer = setInterval(() => {
        regenerateHearts();
      }, 1000);
      setHeartRegenTimer(timer);
      return () => clearInterval(timer);
    } else {
      if (heartRegenTimer) {
        clearInterval(heartRegenTimer);
        setHeartRegenTimer(null);
      }
    }
  }, [hearts, maxHearts, lastHeartRegenTime]);

  const groupedLessons = lessons.reduce((acc, lesson) => {
    if (!acc[lesson.category]) {
      acc[lesson.category] = [];
    }
    acc[lesson.category].push(lesson);
    return acc;
  }, {});

  const HeartRegenTimer = () => {
    const [timeLeft, setTimeLeft] = useState(getTimeUntilNextHeart());

    useEffect(() => {
      const timer = setInterval(() => {
        setTimeLeft(getTimeUntilNextHeart());
      }, 1000);
      return () => clearInterval(timer);
    }, []);

    const { minutes, seconds } = formatTime(timeLeft);

    return (
      <span>
        {t.heartsRefillIn} {minutes}:{seconds.toString().padStart(2, '0')}
      </span>
    );
  };

  const Navigation = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-around py-3">
          <button 
            onClick={() => setCurrentScreen('home')}
            className={`flex flex-col items-center space-y-1 transition-colors ${currentScreen === 'home' ? 'text-blue-600' : 'text-gray-400'}`}
          >
            <Home className="w-6 h-6" />
            <span className="text-xs font-medium">{t.home}</span>
          </button>
          <button 
            onClick={() => setCurrentScreen('profile')}
            className={`flex flex-col items-center space-y-1 transition-colors ${currentScreen === 'profile' ? 'text-blue-600' : 'text-gray-400'}`}
          >
            <User className="w-6 h-6" />
            <span className="text-xs font-medium">{t.profile}</span>
          </button>
          <button 
            onClick={() => setCurrentScreen('friends')}
            className={`flex flex-col items-center space-y-1 transition-colors ${currentScreen === 'friends' ? 'text-blue-600' : 'text-gray-400'}`}
          >
            <Users className="w-6 h-6" />
            <span className="text-xs font-medium">{t.friends}</span>
          </button>
          <button 
            onClick={() => setCurrentScreen('achievements')}
            className={`flex flex-col items-center space-y-1 transition-colors ${currentScreen === 'achievements' ? 'text-blue-600' : 'text-gray-400'}`}
          >
            <Award className="w-6 h-6" />
            <span className="text-xs font-medium">{t.achievements}</span>
          </button>
          <button 
            onClick={() => setCurrentScreen('settings')}
            className={`flex flex-col items-center space-y-1 transition-colors ${currentScreen === 'settings' ? 'text-blue-600' : 'text-gray-400'}`}
          >
            <Settings className="w-6 h-6" />
            <span className="text-xs font-medium">{t.settings}</span>
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
              <h1 className="text-2xl font-bold text-gray-800">{t.appName}</h1>
              <p className="text-sm text-gray-600">{t.tagline}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-gray-100 rounded-full p-1">
              <button
                onClick={() => setAppLanguage('en')}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  appLanguage === 'en' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setAppLanguage('es')}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  appLanguage === 'es' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                ES
              </button>
            </div>
            
            {!isPremium && (
              <button 
                onClick={() => openModal(t.removeAds, appLanguage === 'en' 
                  ? 'Remove all ads and unlock premium features for just $9.99/month!'
                  : '¡Elimina todos los anuncios y desbloquea funciones premium por solo 9,99€/mes!'
                )}
                className="flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:shadow-lg transition-all duration-200 hover:scale-105"
              >
                <Crown className="w-4 h-4" />
                <span>{t.removeAds}</span>
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
        {hearts < maxHearts && (
          <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Heart className="w-6 h-6 text-red-500" />
                <div>
                  <div className="font-medium text-red-800">{t.heartsRefill}</div>
                  <div className="text-sm text-red-600">
                    {hearts < maxHearts ? (
                      <HeartRegenTimer />
                    ) : (
                      t.heartsFull
                    )}
                  </div>
                </div>
              </div>
              {!isPremium && (
                <button
                  onClick={() => watchAdForReward('hearts')}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  📺 +{maxHearts}❤️
                </button>
              )}
            </div>
          </div>
        )}

        <div className="bg-gradient-to-r from-blue-500 to-green-500 rounded-2xl shadow-xl p-6 mb-8 text-white">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <Zap className="w-6 h-6 mr-2" />
            {t.yourCulturalJourney}
          </h3>
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">{Object.values(userProgress).filter(Boolean).length}</div>
              <div className="text-blue-100">{t.culturalLessons}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">{streak}</div>
              <div className="text-blue-100">{t.daysConnected}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">{xp}</div>
              <div className="text-blue-100">{t.heritagePoints}</div>
            </div>
          </div>
        </div>

        {Object.entries(groupedLessons).map(([category, categoryLessons]) => (
          <div key={category} className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                {category}
                <div className="ml-3 text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
                  {categoryLessons.filter(l => userProgress[l.id]).length}/{categoryLessons.length} {appLanguage === 'en' ? 'complete' : 'completas'}
                </div>
              </h2>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {categoryLessons.map((lesson) => {
                const globalIndex = lessons.findIndex(l => l.id === lesson.id);
                const isLocked = lesson.isPremium && !isPremium;
                const isCompleted = userProgress[lesson.id];
                const canAccess = lesson.id === 1 || userProgress[lesson.id - 1]; // Can access if first lesson or previous completed
                
                return (
                  <div key={lesson.id} className={`bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 ${
                    !canAccess ? 'opacity-60' : 'hover:-translate-y-1'
                  } border-l-4 ${
                    isCompleted ? 'border-green-500' : 
                    canAccess ? 'border-blue-500' : 'border-gray-300'
                  }`}>
                    <div className="p-5">
                      <div className="flex items-center justify-between mb-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                          isCompleted ? 'bg-green-100 text-green-600' : 
                          !canAccess ? 'bg-gray-100 text-gray-400' : 
                          'bg-blue-100 text-blue-600'
                        }`}>
                          {!canAccess ? <Lock className="w-5 h-5" /> : 
                           isCompleted ? <CheckCircle className="w-5 h-5" /> : lesson.lessonInUnit}
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-1 text-yellow-600 text-sm">
                            <Star className="w-3 h-3" />
                            <span>{lesson.xp}</span>
                          </div>
                          <div className="text-xs text-gray-500">
                            {lesson.lessonInUnit}/{lesson.totalLessonsInUnit}
                          </div>
                        </div>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">{lesson.title}</h3>
                      <p className="text-gray-600 text-sm mb-4">{lesson.description}</p>
                      
                      <button
                        onClick={() => canAccess ? startLesson(globalIndex) : null}
                        className={`w-full py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
                          !canAccess
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            : isCompleted 
                            ? 'bg-green-600 hover:bg-green-700 text-white' 
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                        disabled={!canAccess}
                      >
                        {!canAccess ? (appLanguage === 'en' ? 'Locked' : 'Bloqueado') :
                         isCompleted ? (appLanguage === 'en' ? 'Review' : 'Repasar') : 
                         (appLanguage === 'en' ? 'Start' : 'Empezar')}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {!isPremium && (
          <div className="mb-8">
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-dashed border-amber-300 rounded-lg p-6 text-center">
              <div className="text-2xl mb-2">🏔️</div>
              <p className="text-sm text-amber-600 mb-2">{t.sponsoredContent}</p>
              <div className="bg-gradient-to-r from-blue-100 to-green-100 rounded p-6">
                <h4 className="font-semibold text-gray-700 mb-2">{t.visitBasqueCountry}</h4>
                <p className="text-sm text-gray-600 mb-3">{t.experienceCulture}</p>
                <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 transition-colors">
                  {t.planHeritage}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <Navigation />
    </div>
  );

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
                  {perfectScore ? '¡Perfecto!' : (appLanguage === 'en' ? 'Lesson Complete!' : '¡Lección Completada!')}
                </h2>
                <p className="text-gray-600 mt-2">
                  {perfectScore ? (appLanguage === 'en' ? 'Flawless performance!' : '¡Rendimiento impecable!') : (appLanguage === 'en' ? `Great job learning ${lesson.title}` : `¡Buen trabajo aprendiendo ${lesson.title}!`)}
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">{appLanguage === 'en' ? 'XP Earned' : 'XP Ganados'}</span>
                  <span className="font-bold text-yellow-600 flex items-center">
                    <Star className="w-4 h-4 mr-1" />
                    +{lesson.xp}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">{appLanguage === 'en' ? 'Accuracy' : 'Precisión'}</span>
                  <span className={`font-bold ${perfectScore ? 'text-yellow-600' : 'text-green-600'}`}>
                    {finalAccuracy}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">{appLanguage === 'en' ? 'Correct Answers' : 'Respuestas Correctas'}</span>
                  <span className="font-bold text-blue-600">
                    {correctAnswers}/{lesson.questions.length}
                  </span>
                </div>
              </div>
              
              {perfectScore && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
                  <div className="flex items-center justify-center space-x-2 text-yellow-800">
                    <Sparkles className="w-5 h-5" />
                    <span className="font-medium">{appLanguage === 'en' ? 'Perfect Score Bonus!' : '¡Bonificación por Puntuación Perfecta!'}</span>
                    <Sparkles className="w-5 h-5" />
                  </div>
                </div>
              )}
              
              <button
                onClick={goHome}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors mb-4"
              >
                {appLanguage === 'en' ? 'Continue Learning' : 'Continuar Aprendiendo'}
              </button>
              
              {!isPremium && (
                <button
                  onClick={() => watchAdForReward('xp')}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium py-2 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2 text-sm"
                >
                  <span>📺</span>
                  <span>{appLanguage === 'en' ? 'Watch Ad for +20 Bonus XP' : 'Ver Anuncio por +20 XP Extra'}</span>
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
                  {hearts < maxHearts && (
                    <div className="ml-2 text-xs text-gray-500">
                      <HeartRegenTimer />
                    </div>
                  )}
                  {!isPremium && hearts <= 2 && (
                    <button
                      onClick={() => watchAdForReward('hearts')}
                      className="ml-2 text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition-colors"
                    >
                      📺+❤️
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
                    <div className="text-sm text-blue-600 uppercase tracking-wide">Euskera</div>
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
                      {isCorrect ? (appLanguage === 'en' ? 'Excellent!' : '¡Excelente!') : (appLanguage === 'en' ? 'Not quite right' : 'No del todo correcto')}
                    </div>
                    <div className={`text-base mb-2 ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                      {question.basque ? (
                        <span><strong>"{question.basque}"</strong> {appLanguage === 'en' ? 'means' : 'significa'} <strong>"{question.translation}"</strong></span>
                      ) : (
                        <span><strong>"{question.correct}"</strong> {appLanguage === 'en' ? 'means' : 'significa'} <strong>"{question.translation}"</strong></span>
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
                          {appLanguage === 'en' ? 'Cultural Connection' : 'Conexión Cultural'}
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

            {showResult && (
              <div className="text-center mt-6">
                <button
                  onClick={handleContinue}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-colors flex items-center space-x-2 mx-auto"
                >
                  <span>{t.continue}</span>
                  <span>→</span>
                </button>
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
              {appLanguage === 'en' ? 'Got it' : 'Entendido'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="font-sans">
      {currentScreen === 'home' && <HomeScreen />}
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

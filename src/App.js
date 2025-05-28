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
                  <div className={`w-full rounded-full h-2 ${isUnlocked ? 'bg-blue-200' : 'bg-gray-200'}`}>
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

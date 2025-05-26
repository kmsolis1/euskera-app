import React, { useState } from 'react';
import { Home, Users, Award, Settings, Star, Heart, Flame, Book } from 'lucide-react';

const EuskeraApp = () => {
  const [currentScreen, setCurrentScreen] = useState('home');

  const HomeScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 pb-20">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
              E
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Euskera</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Learn Basque</h2>
          <p className="text-gray-600">Master the beautiful Basque language</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <Book className="w-8 h-8 text-blue-600" />
              <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                Beginner
              </span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Basic Greetings</h3>
            <p className="text-gray-600 mb-4">Learn essential Basque greetings</p>
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg">
              Start Lesson
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <Book className="w-8 h-8 text-blue-600" />
              <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                Beginner
              </span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Numbers 1-10</h3>
            <p className="text-gray-600 mb-4">Count from one to ten in Basque</p>
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg">
              Start Lesson
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
            <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg">
              Invite Friends
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
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Progress</h2>
          
          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">0</div>
              <div className="text-gray-600">Lessons</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">1</div>
              <div className="text-gray-600">Day Streak</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600">0</div>
              <div className="text-gray-600">Total XP</div>
            </div>
          </div>

          <div className="p-4 rounded-lg border-2 border-gray-200 bg-gray-50">
            <div className="flex items-center space-x-3">
              <span className="text-3xl">🎯</span>
              <div>
                <h4 className="font-semibold text-gray-500">First Steps</h4>
                <p className="text-sm text-gray-400">Complete your first lesson</p>
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
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">App Settings</h3>
          <div className="space-y-3">
            <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-6 rounded-lg text-left">
              Privacy Policy
            </button>
            <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-6 rounded-lg text-left">
              Terms of Service
            </button>
            <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-6 rounded-lg text-left">
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

  return (
    <div className="font-sans">
      {currentScreen === 'home' && <HomeScreen />}
      {currentScreen === 'friends' && <FriendsScreen />}
      {currentScreen === 'achievements' && <AchievementsScreen />}
      {currentScreen === 'settings' && <SettingsScreen />}
    </div>
  );
};

export default EuskeraApp;

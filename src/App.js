import React, { useState } from 'react';

const MinimalEuskeraApp = () => {
  const [currentScreen, setCurrentScreen] = useState('home');

  console.log('🚀 App rendering, currentScreen:', currentScreen);

  const HomeScreen = () => (
    <div className="min-h-screen bg-blue-50 p-4">
      <h1 className="text-2xl font-bold mb-4">Home Screen Works!</h1>
      <button 
        onClick={() => {
          console.log('🔄 Switching to friends...');
          setCurrentScreen('friends');
        }}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Go to Friends
      </button>
    </div>
  );

  const FriendsScreen = () => (
    <div className="min-h-screen bg-green-50 p-4">
      <h1 className="text-2xl font-bold mb-4">Friends Screen Works!</h1>
      <button 
        onClick={() => {
          console.log('🔄 Switching to home...');
          setCurrentScreen('home');
        }}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Back to Home
      </button>
    </div>
  );

  try {
    return (
      <div>
        {/* Debug indicator */}
        <div className="fixed top-0 left-0 bg-red-600 text-white px-2 py-1 text-xs z-50">
          Current: {currentScreen}
        </div>
        
        {currentScreen === 'home' && <HomeScreen />}
        {currentScreen === 'friends' && <FriendsScreen />}
        
        {/* Bottom navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
          <div className="flex justify-center space-x-4">
            <button 
              onClick={() => setCurrentScreen('home')}
              className={`px-4 py-2 rounded ${currentScreen === 'home' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              Home
            </button>
            <button 
              onClick={() => setCurrentScreen('friends')}
              className={`px-4 py-2 rounded ${currentScreen === 'friends' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              Friends
            </button>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('💥 Render error:', error);
    return <div className="text-red-600 p-4">Error: {error.message}</div>;
  }
};

export default MinimalEuskeraApp;

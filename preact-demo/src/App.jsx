import { useState, useEffect } from 'preact/hooks';
import { GameProvider } from './contexts/GameContext';
import { AudioProvider } from './contexts/AudioContext';
import StartScreen from './components/StartScreen';
import GameScreen from './components/GameScreen';
import ModalSystem from './components/ModalSystem';
import './styles/main.css';

const SCREENS = {
  START: 'start',
  GAME: 'game'
};

function App() {
  const [currentScreen, setCurrentScreen] = useState(SCREENS.START);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Check for saved game on app initialization
    const savedLevel = localStorage.getItem('readingGame_currentLevel');
    const savedScore = localStorage.getItem('readingGame_currentScore');
    
    if (savedLevel && savedScore !== null) {
      // Show resume modal logic would go here
    }
    
    setIsInitialized(true);
  }, []);

  const handleStartGame = (level = 1) => {
    setCurrentScreen(SCREENS.GAME);
  };

  const handleBackToStart = () => {
    setCurrentScreen(SCREENS.START);
  };

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-400 to-purple-600">
        <div className="text-white text-xl">Ładowanie...</div>
      </div>
    );
  }

  return (
    <AudioProvider>
      <GameProvider>
        <div className="min-h-screen bg-gradient-to-br from-purple-400 to-purple-600">
          <div className="container mx-auto px-4 py-8 max-w-4xl">
            {currentScreen === SCREENS.START && (
              <StartScreen onStartGame={handleStartGame} />
            )}
            
            {currentScreen === SCREENS.GAME && (
              <GameScreen onBackToStart={handleBackToStart} />
            )}
            
            <ModalSystem />
          </div>
        </div>
      </GameProvider>
    </AudioProvider>
  );
}

export default App;
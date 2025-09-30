import { useAudio } from '../contexts/AudioContext';

const StartScreen = ({ onStartGame }) => {
  const { initializeAudio } = useAudio();

  const handleStartClick = async () => {
    await initializeAudio(); // Initialize audio on first interaction
    onStartGame(1);
  };

  const handleMasterModeClick = () => {
    // This would open the master mode modal
    console.log('Master mode clicked - modal should open here');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 max-w-md w-full mx-4">
        <h1 className="text-4xl md:text-5xl font-black text-white mb-6 drop-shadow-lg">
          Nauka Czytania!
        </h1>
        
        <p className="text-xl text-white/90 mb-8 leading-relaxed">
          Zaczynamy przygodę z literkami, sylabami i słowami!
        </p>
        
        <button
          onClick={handleStartClick}
          className="bg-yellow-400 hover:bg-yellow-300 text-gray-800 font-bold text-xl px-8 py-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 mb-4 w-full"
        >
          Start! (Poziom 1)
        </button>
      </div>
      
      {/* Persistent Master Mode Button */}
      <button
        onClick={handleMasterModeClick}
        className="fixed bottom-5 right-5 bg-purple-500 hover:bg-purple-400 text-white font-bold px-6 py-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
      >
        Tryb Mistrza
      </button>
    </div>
  );
};

export default StartScreen;
import { useGame } from '../contexts/GameContext';
import { useAudio } from '../contexts/AudioContext';
import ProgressBar from './ProgressBar';
import TargetDisplay from './TargetDisplay';
import OptionsGrid from './OptionsGrid';
import FeedbackDisplay from './FeedbackDisplay';
import ScoreDisplay from './ScoreDisplay';

const GameScreen = ({ onBackToStart }) => {
  const { 
    currentLevel, 
    currentQuestionIndex, 
    questionsOrder, 
    score,
    isPlaying,
    gameEnded,
    actions 
  } = useGame();

  const { speakText } = useAudio();

  // Get current question data
  const currentQuestion = questionsOrder[currentQuestionIndex];
  const progressPercentage = questionsOrder.length > 0 
    ? (currentQuestionIndex / questionsOrder.length) * 100 
    : 0;

  // Generate options for current question
  const generateOptions = (correctAnswer) => {
    // This would implement the complex option generation logic from the original app
    // For demo purposes, simplified version:
    const allLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'R', 'S', 'T', 'U', 'W', 'Y', 'Z'];
    const incorrectOptions = allLetters
      .filter(letter => letter !== correctAnswer)
      .sort(() => Math.random() - 0.5)
      .slice(0, 2);
    
    return [correctAnswer, ...incorrectOptions].sort(() => Math.random() - 0.5);
  };

  const handleOptionClick = (selectedOption) => {
    const isCorrect = selectedOption === currentQuestion;
    actions.answerQuestion(isCorrect);
    
    if (!isCorrect) {
      // Speak the incorrect answer
      setTimeout(() => speakText(selectedOption), 200);
    }
  };

  const handleTargetClick = () => {
    if (currentQuestion) {
      speakText(currentQuestion);
    }
  };

  const getLevelTitle = (level) => {
    const titles = {
      1: "Poziom 1 (Litery bez PL)",
      2: "Poziom 2 (Litery bez PL, słuch)",
      3: "Poziom 3 (Litery z PL, słuch)",
      // Add more level titles...
    };
    return titles[level] || `Poziom ${level}`;
  };

  const getInstruction = (level) => {
    if (level === 1) {
      return "Posłuchaj i wybierz pokazaną literę:";
    } else if (level <= 3) {
      return "Posłuchaj i wybierz pokazaną literę:";
    }
    // Add more instructions for different levels
    return "Posłuchaj i wybierz:";
  };

  if (!isPlaying || !currentQuestion) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white text-xl">Ładowanie pytania...</div>
      </div>
    );
  }

  const options = generateOptions(currentQuestion);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {/* Level Header */}
      <div className="text-center mb-6">
        <h2 className="text-3xl md:text-4xl font-black text-white drop-shadow-lg">
          {getLevelTitle(currentLevel)}
        </h2>
      </div>

      {/* Game Card */}
      <div className="bg-white rounded-2xl p-6 md:p-8 max-w-2xl w-full mx-4 shadow-2xl">
        <ProgressBar percentage={progressPercentage} />
        
        <div className="text-center mb-6">
          <div className="text-lg text-gray-600 mb-2">
            {getInstruction(currentLevel)}
          </div>
          
          <TargetDisplay 
            target={currentQuestion} 
            onClick={handleTargetClick}
          />
          
          <OptionsGrid 
            options={options} 
            onOptionClick={handleOptionClick}
          />
          
          <FeedbackDisplay />
          
          <ScoreDisplay score={score} />
        </div>
      </div>

      {/* Persistent Master Mode Button */}
      <button className="fixed bottom-5 right-5 bg-purple-500 hover:bg-purple-400 text-white font-bold px-6 py-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
        Tryb Mistrza
      </button>
    </div>
  );
};

export default GameScreen;
import { useGame } from '../contexts/GameContext';
import { useAudio } from '../contexts/AudioContext';

/**
 * Custom hook for game logic and question handling
 */
export const useGameLogic = () => {
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

  return {
    currentLevel,
    currentQuestion,
    progressPercentage,
    score,
    isPlaying,
    gameEnded,
    handleOptionClick,
    handleTargetClick
  };
};
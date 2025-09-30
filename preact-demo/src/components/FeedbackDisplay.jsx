import { useGame } from '../contexts/GameContext';
import { useSoundEffects } from '../hooks/useSoundEffects';

const FeedbackDisplay = () => {
  const { lastAnswerCorrect } = useGame();
  
  // Handle sound effects in dedicated hook
  useSoundEffects(lastAnswerCorrect);

  if (lastAnswerCorrect === null) {
    return <div className="h-12 mb-4" />; // Placeholder to maintain layout
  }

  return (
    <div className={`
      text-2xl font-semibold h-12 mb-4 flex items-center justify-center
      ${lastAnswerCorrect ? 'text-green-500' : 'text-red-500'}
    `}>
      {lastAnswerCorrect ? 'Świetnie!' : 'Spróbuj jeszcze raz!'}
    </div>
  );
};

export default FeedbackDisplay;
import { useGame } from '../contexts/GameContext';
import { useAudio } from '../contexts/AudioContext';
import { useEffect } from 'preact/hooks';

const FeedbackDisplay = () => {
  const { lastAnswerCorrect } = useGame();
  const { playCorrectSound, playIncorrectSound } = useAudio();

  useEffect(() => {
    if (lastAnswerCorrect === true) {
      playCorrectSound();
    } else if (lastAnswerCorrect === false) {
      playIncorrectSound();
    }
  }, [lastAnswerCorrect, playCorrectSound, playIncorrectSound]);

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
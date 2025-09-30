import { useEffect } from 'preact/hooks';
import { useAudio } from '../contexts/AudioContext';

/**
 * Custom hook for handling sound effects based on game state
 */
export const useSoundEffects = (lastAnswerCorrect) => {
  const { playCorrectSound, playIncorrectSound } = useAudio();

  useEffect(() => {
    if (lastAnswerCorrect === true) {
      playCorrectSound();
    } else if (lastAnswerCorrect === false) {
      playIncorrectSound();
    }
  }, [lastAnswerCorrect, playCorrectSound, playIncorrectSound]);
};
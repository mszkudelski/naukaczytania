import { useMemo } from 'preact/hooks';

/**
 * Custom hook for generating question options
 */
export const useQuestionGeneration = (correctAnswer) => {
  const options = useMemo(() => {
    if (!correctAnswer) return [];
    
    // All available letters for generating incorrect options
    const allLetters = [
      'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 
      'M', 'N', 'O', 'P', 'R', 'S', 'T', 'U', 'W', 'Y', 'Z'
    ];
    
    // Filter out the correct answer and get random incorrect options
    const incorrectOptions = allLetters
      .filter(letter => letter !== correctAnswer)
      .sort(() => Math.random() - 0.5)
      .slice(0, 2);
    
    // Combine correct and incorrect options, then shuffle
    return [correctAnswer, ...incorrectOptions].sort(() => Math.random() - 0.5);
  }, [correctAnswer]);

  return options;
};
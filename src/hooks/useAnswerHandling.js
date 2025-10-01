import { useState } from 'preact/hooks';
import { playCorrectSound, playIncorrectSound } from '../utils/audio';
import { checkLevelUp } from '../utils/gameLogic';
import { LEVEL_UP_THRESHOLD } from '../utils/gameData';

export function useAnswerHandling(gameState, onLevelUp, onEndGame) {
    const [feedback, setFeedback] = useState('');
    const [selectedOption, setSelectedOption] = useState(null);
    const [isAnswering, setIsAnswering] = useState(false);

    const addVisualFeedback = (option, isCorrect) => {
        const optionElements = document.querySelectorAll('.option-button');
        optionElements.forEach(el => {
            if (el.textContent === option) {
                el.classList.add(isCorrect ? 'correct-answer' : 'incorrect-answer');
            }
        });
    };

    const clearVisualFeedback = () => {
        const optionElements = document.querySelectorAll('.option-button');
        optionElements.forEach(el => {
            el.classList.remove('correct-answer', 'incorrect-answer');
        });
    };

    const handleCorrectAnswer = (newScore) => {
        setFeedback('Świetnie! 🎉');
        playCorrectSound();
        
        // Check for level up
        const questionsAnswered = gameState.currentQuestionIndex + 1;
        if (checkLevelUp(newScore, questionsAnswered, LEVEL_UP_THRESHOLD)) {
            setTimeout(() => {
                if (gameState.currentLevel < 12) {
                    onLevelUp(gameState.currentLevel + 1, newScore);
                } else {
                    // Game complete
                    gameState.clearSavedGame();
                    onEndGame(gameState.currentLevel, newScore, true);
                }
            }, 1500);
            return true; // Indicates level up
        }
        return false;
    };

    const handleIncorrectAnswer = () => {
        setFeedback('Spróbuj ponownie! 🤔');
        playIncorrectSound();
    };

    const handleNextQuestion = () => {
        clearVisualFeedback();

        if (gameState.currentQuestionIndex + 1 >= gameState.questionsOrder.length) {
            // End of questions for this level
            const accuracy = gameState.currentScore / gameState.questionsOrder.length;
            if (accuracy < LEVEL_UP_THRESHOLD) {
                onEndGame(gameState.currentLevel, gameState.currentScore, false);
            }
        } else {
            gameState.nextQuestion();
        }
        
        setIsAnswering(false);
    };

    const resetAnswerState = () => {
        setFeedback('');
        setSelectedOption(null);
        setIsAnswering(false);
    };

    const handleOptionClick = async (option, currentQuestion) => {
        if (isAnswering || !currentQuestion) return;
        
        setIsAnswering(true);
        setSelectedOption(option);
        
        const isCorrect = option === currentQuestion;
        addVisualFeedback(option, isCorrect);

        if (isCorrect) {
            const newScore = gameState.updateScore(1);
            const isLevelUp = handleCorrectAnswer(newScore);
            if (isLevelUp) return; // Don't continue if leveling up
        } else {
            handleIncorrectAnswer();
        }

        // Move to next question after delay
        setTimeout(handleNextQuestion, 1500);
    };

    return {
        feedback,
        selectedOption,
        isAnswering,
        handleOptionClick,
        resetAnswerState
    };
}
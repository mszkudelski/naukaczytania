import { useState, useEffect } from 'preact/hooks';
import { gameData, LEVEL_UP_THRESHOLD, NUM_OPTIONS } from '../utils/gameData';
import { generateQuestionsOrder, generateOptions, shuffleArray, checkLevelUp } from '../utils/gameLogic';
import { speakText, playCorrectSound, playIncorrectSound } from '../utils/audio';

export function GameArea({ gameState, onLevelUp, onEndGame, onBackToStart }) {
    const [feedback, setFeedback] = useState('');
    const [options, setOptions] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isAnswering, setIsAnswering] = useState(false);

    const currentLevelData = gameData[gameState.currentLevel];
    const questionsCompleted = gameState.currentQuestionIndex;
    const totalQuestions = gameState.questionsOrder.length;
    const progressPercentage = totalQuestions > 0 ? (questionsCompleted / totalQuestions) * 100 : 0;
    const currentQuestion = gameState.questionsOrder[gameState.currentQuestionIndex];

    // Initialize questions when level changes
    useEffect(() => {
        if (currentLevelData) {
            const questions = generateQuestionsOrder(shuffleArray([...currentLevelData.letters]), 15);
            gameState.setQuestionsOrder(questions);
        }
    }, [gameState.currentLevel]);

    // Generate options when question changes
    useEffect(() => {
        if (currentQuestion && currentLevelData) {
            const newOptions = generateOptions(
                currentQuestion, 
                currentLevelData.distractors, 
                NUM_OPTIONS
            );
            setOptions(newOptions);
            setFeedback('');
            setSelectedOption(null);
            setIsAnswering(false);

            // Auto-speak for audio levels
            if (currentLevelData.useAudio) {
                setTimeout(() => {
                    speakText(currentQuestion);
                }, 500);
            }
        }
    }, [currentQuestion, currentLevelData]);

    const handleOptionClick = async (option) => {
        if (isAnswering || !currentQuestion) return;
        
        setIsAnswering(true);
        setSelectedOption(option);
        
        const isCorrect = option === currentQuestion;
        
        // Add visual feedback
        const optionElements = document.querySelectorAll('.option-button');
        optionElements.forEach(el => {
            if (el.textContent === option) {
                el.classList.add(isCorrect ? 'correct-answer' : 'incorrect-answer');
            }
        });

        if (isCorrect) {
            setFeedback('Świetnie! 🎉');
            playCorrectSound();
            const newScore = gameState.updateScore(1);
            
            // Check for level up
            const questionsAnswered = gameState.currentQuestionIndex + 1;
            if (checkLevelUp(newScore, questionsAnswered, LEVEL_UP_THRESHOLD)) {
                // Level up logic
                setTimeout(() => {
                    if (gameState.currentLevel < 12) {
                        onLevelUp(gameState.currentLevel + 1, newScore);
                    } else {
                        // Game complete
                        gameState.clearSavedGame();
                        onEndGame(gameState.currentLevel, newScore, true);
                    }
                }, 1500);
                return;
            }
        } else {
            setFeedback('Spróbuj ponownie! 🤔');
            playIncorrectSound();
        }

        // Move to next question or end game
        setTimeout(() => {
            // Clear visual feedback
            optionElements.forEach(el => {
                el.classList.remove('correct-answer', 'incorrect-answer');
            });

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
        }, 1500);
    };

    const handleTargetClick = () => {
        if (currentQuestion && currentLevelData.useAudio) {
            speakText(currentQuestion);
        }
    };

    if (!currentLevelData) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <div className="text-center mb-6">
                <h2 className="level-title">{currentLevelData.title}</h2>
            </div>

            <div className="game-card">
                <div className="progress-container">
                    <div 
                        className="progress-bar" 
                        style={{ width: `${progressPercentage}%` }}
                    ></div>
                </div>

                <div className="instruction">{currentLevelData.instruction}</div>

                <div 
                    id="target-letter"
                    onClick={handleTargetClick}
                    style={{ cursor: currentLevelData.useAudio ? 'pointer' : 'default' }}
                >
                    {currentLevelData.useAudio ? '🔊' : currentQuestion}
                </div>

                <div className="options-grid">
                    {options.map((option, index) => (
                        <button
                            key={index}
                            className="option-button"
                            onClick={() => handleOptionClick(option)}
                            disabled={isAnswering}
                        >
                            {option}
                        </button>
                    ))}
                </div>

                <div className="feedback">{feedback}</div>

                <div className="score">
                    Wynik: <span className="score-value">{gameState.currentScore}</span>
                </div>

                <button 
                    className="btn btn-gray" 
                    style={{ marginTop: '1rem' }}
                    onClick={onBackToStart}
                >
                    Powrót do menu
                </button>
            </div>
        </>
    );
}
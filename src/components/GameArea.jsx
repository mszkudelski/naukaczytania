import { useEffect } from 'preact/hooks';
import { gameData } from '../utils/gameData';
import { useGameQuestion } from '../hooks/useGameQuestion';
import { useAnswerHandling } from '../hooks/useAnswerHandling';

export function GameArea({ gameState, onLevelUp, onEndGame, onBackToStart }) {
    const { 
        options, 
        currentQuestion, 
        currentLevelData, 
        handleTargetClick 
    } = useGameQuestion(gameState.currentLevel, gameData, gameState);

    const { 
        feedback, 
        isAnswering, 
        handleOptionClick, 
        resetAnswerState 
    } = useAnswerHandling(gameState, onLevelUp, onEndGame);

    // Reset answer state when question changes
    useEffect(() => {
        resetAnswerState();
    }, [currentQuestion]);

    if (!currentLevelData) {
        return <div>Loading...</div>;
    }

    const questionsCompleted = gameState.currentQuestionIndex;
    const totalQuestions = gameState.questionsOrder.length;
    const progressPercentage = totalQuestions > 0 ? (questionsCompleted / totalQuestions) * 100 : 0;

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
                            onClick={() => handleOptionClick(option, currentQuestion)}
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
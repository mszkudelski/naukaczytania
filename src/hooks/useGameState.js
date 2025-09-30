import { useState, useEffect } from 'preact/hooks';
import { STORAGE_KEY_LEVEL, STORAGE_KEY_SCORE } from '../utils/gameData';

export function useGameState() {
    const [currentLevel, setCurrentLevel] = useState(1);
    const [currentScore, setCurrentScore] = useState(0);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [questionsOrder, setQuestionsOrder] = useState([]);
    const [showResumeModal, setShowResumeModal] = useState(false);
    const [savedGame, setSavedGame] = useState(null);

    // Check for saved game on component mount
    useEffect(() => {
        const savedLevel = localStorage.getItem(STORAGE_KEY_LEVEL);
        const savedScore = localStorage.getItem(STORAGE_KEY_SCORE);

        if (savedLevel && savedScore !== null) {
            const levelNum = parseInt(savedLevel);
            const scoreNum = parseInt(savedScore);
            
            setSavedGame({ level: levelNum, score: scoreNum });
            setShowResumeModal(true);
        }
    }, []);

    const saveGameState = (level, score) => {
        localStorage.setItem(STORAGE_KEY_LEVEL, level.toString());
        localStorage.setItem(STORAGE_KEY_SCORE, score.toString());
    };

    const clearSavedGame = () => {
        localStorage.removeItem(STORAGE_KEY_LEVEL);
        localStorage.removeItem(STORAGE_KEY_SCORE);
    };

    const initGame = (level, resumeScore = 0) => {
        setCurrentLevel(level);
        setCurrentScore(resumeScore);
        setCurrentQuestionIndex(0);
        setShowResumeModal(false);
        
        // Save initial state if starting fresh
        if (resumeScore === 0) {
            clearSavedGame();
        }
    };

    const resumeGame = () => {
        if (savedGame) {
            initGame(savedGame.level, savedGame.score);
        }
        setShowResumeModal(false);
    };

    const startNewGame = () => {
        clearSavedGame();
        initGame(1);
    };

    const nextQuestion = () => {
        setCurrentQuestionIndex(prev => prev + 1);
    };

    const updateScore = (points) => {
        const newScore = currentScore + points;
        setCurrentScore(newScore);
        saveGameState(currentLevel, newScore);
        return newScore;
    };

    const levelUp = (newLevel) => {
        setCurrentLevel(newLevel);
        setCurrentScore(0);
        setCurrentQuestionIndex(0);
        saveGameState(newLevel, 0);
    };

    return {
        currentLevel,
        currentScore,
        currentQuestionIndex,
        questionsOrder,
        showResumeModal,
        savedGame,
        setQuestionsOrder,
        initGame,
        resumeGame,
        startNewGame,
        nextQuestion,
        updateScore,
        levelUp,
        clearSavedGame,
        saveGameState
    };
}
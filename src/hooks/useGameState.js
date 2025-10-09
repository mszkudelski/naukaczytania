import { useState, useEffect } from 'preact/hooks';
import { STORAGE_KEY_LEVEL, STORAGE_KEY_SCORE, STORAGE_KEY_QUESTION_INDEX, STORAGE_KEY_QUESTIONS_ORDER } from '../utils/gameData';

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
        const savedQuestionIndex = localStorage.getItem(STORAGE_KEY_QUESTION_INDEX);
        const savedQuestionsOrder = localStorage.getItem(STORAGE_KEY_QUESTIONS_ORDER);

        if (savedLevel && savedScore !== null) {
            const levelNum = parseInt(savedLevel);
            const scoreNum = parseInt(savedScore);
            const questionIndex = savedQuestionIndex ? parseInt(savedQuestionIndex) : 0;
            const questionsOrder = savedQuestionsOrder ? JSON.parse(savedQuestionsOrder) : [];
            
            setSavedGame({ 
                level: levelNum, 
                score: scoreNum, 
                questionIndex: questionIndex,
                questionsOrder: questionsOrder
            });
            setShowResumeModal(true);
        }
    }, []);

    const saveGameState = (level, score, questionIndex = 0, questionsOrder = []) => {
        localStorage.setItem(STORAGE_KEY_LEVEL, level.toString());
        localStorage.setItem(STORAGE_KEY_SCORE, score.toString());
        localStorage.setItem(STORAGE_KEY_QUESTION_INDEX, questionIndex.toString());
        localStorage.setItem(STORAGE_KEY_QUESTIONS_ORDER, JSON.stringify(questionsOrder));
    };

    const clearSavedGame = () => {
        localStorage.removeItem(STORAGE_KEY_LEVEL);
        localStorage.removeItem(STORAGE_KEY_SCORE);
        localStorage.removeItem(STORAGE_KEY_QUESTION_INDEX);
        localStorage.removeItem(STORAGE_KEY_QUESTIONS_ORDER);
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
            // Restore the question index and questions order after initGame
            setCurrentQuestionIndex(savedGame.questionIndex);
            setQuestionsOrder(savedGame.questionsOrder);
        }
        setShowResumeModal(false);
    };

    const startNewGame = () => {
        clearSavedGame();
        initGame(1);
    };

    const nextQuestion = () => {
        setCurrentQuestionIndex(prev => {
            const newIndex = prev + 1;
            // Save the new question index
            saveGameState(currentLevel, currentScore, newIndex, questionsOrder);
            return newIndex;
        });
    };

    const updateScore = (points) => {
        const newScore = currentScore + points;
        setCurrentScore(newScore);
        saveGameState(currentLevel, newScore, currentQuestionIndex, questionsOrder);
        return newScore;
    };

    const levelUp = (newLevel) => {
        setCurrentLevel(newLevel);
        setCurrentScore(0);
        setCurrentQuestionIndex(0);
        // Clear questions order when leveling up, will be regenerated
        setQuestionsOrder([]);
        saveGameState(newLevel, 0, 0, []);
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
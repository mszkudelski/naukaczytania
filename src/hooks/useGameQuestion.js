import { useState, useEffect } from 'preact/hooks';
import { generateQuestionsOrder, generateOptions, shuffleArray } from '../utils/gameLogic';
import { speakText } from '../utils/audio';
import { NUM_OPTIONS } from '../utils/gameData';

export function useGameQuestion(currentLevel, gameData, gameState) {
    const [options, setOptions] = useState([]);
    
    const currentLevelData = gameData[currentLevel];
    const currentQuestion = gameState.questionsOrder[gameState.currentQuestionIndex];

    // Initialize questions when level changes
    useEffect(() => {
        if (currentLevelData) {
            const questions = generateQuestionsOrder(shuffleArray([...currentLevelData.letters]), 15);
            gameState.setQuestionsOrder(questions);
        }
    }, [currentLevel]);

    // Generate options when question changes
    useEffect(() => {
        if (currentQuestion && currentLevelData) {
            const newOptions = generateOptions(
                currentQuestion, 
                currentLevelData.distractors, 
                NUM_OPTIONS
            );
            setOptions(newOptions);

            // Auto-speak for all levels - always read the word/syllable/letter
            setTimeout(() => {
                speakText(currentQuestion);
            }, 500);
        }
    }, [currentQuestion, currentLevelData]);

    const handleTargetClick = () => {
        if (currentQuestion) {
            speakText(currentQuestion);
        }
    };

    return {
        options,
        currentQuestion,
        currentLevelData,
        handleTargetClick
    };
}
// Game logic utilities
export function shuffleArray(array) {
    let newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

export function generateOptions(correctAnswer, distractors, numOptions = 3) {
    const availableDistractors = distractors.filter(item => item !== correctAnswer);
    const shuffledDistractors = shuffleArray(availableDistractors);
    const selectedDistractors = shuffledDistractors.slice(0, numOptions - 1);
    
    const allOptions = [correctAnswer, ...selectedDistractors];
    return shuffleArray(allOptions);
}

export function generateQuestionsOrder(letters, numQuestions = 15) {
    if (letters.length === 0) return [];
    
    const questionsOrder = [];
    const shuffledLetters = shuffleArray(letters);
    
    for (let i = 0; i < numQuestions; i++) {
        questionsOrder.push(shuffledLetters[i % shuffledLetters.length]);
    }
    
    return questionsOrder;
}

export function checkLevelUp(score, questionsAnswered, threshold = 0.9) {
    if (questionsAnswered === 0) return false;
    const accuracy = score / questionsAnswered;
    return accuracy >= threshold && questionsAnswered >= 10;
}
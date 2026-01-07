// Reading mode data - basic Polish words for level 1
const level1Words = ['mama', 'tata', 'kot', 'pies', 'dom', 'ma', 'lubi', 'sok', 'mleko'];
const level1Verbs = ['ma', 'lubi', 'widzi', 'woła'];
const level1Nouns = ['mama', 'tata', 'kot', 'pies', 'dom', 'sok', 'mleko', 'balon', 'auto'];

// Function to generate text with repeated words (2-3 sentences)
export function getRandomSentence() {
    // Pick 2-3 common words to repeat
    const commonWords = [];
    const numCommonWords = Math.floor(Math.random() * 2) + 2; // 2 or 3 common words
    
    // Shuffle and pick unique words
    const shuffledNouns = [...level1Nouns].sort(() => Math.random() - 0.5);
    for (let i = 0; i < Math.min(numCommonWords, shuffledNouns.length); i++) {
        commonWords.push(shuffledNouns[i]);
    }
    
    // Generate 2-3 sentences using these common words
    const sentences = [];
    const numSentences = Math.floor(Math.random() * 2) + 2; // 2 or 3 sentences
    
    for (let i = 0; i < numSentences; i++) {
        const subject = commonWords[i % commonWords.length];
        const verb = level1Verbs[Math.floor(Math.random() * level1Verbs.length)];
        const object = level1Nouns[Math.floor(Math.random() * level1Nouns.length)];
        
        // Capitalize first letter
        const capitalizedSubject = subject.charAt(0).toUpperCase() + subject.slice(1);
        sentences.push(`${capitalizedSubject} ${verb} ${object}.`);
    }
    
    return sentences.join(' ');
}

// Function to split sentence into words
export function sentenceToWords(sentence) {
    return sentence.split(' ');
}

// Function to find similar words in a sentence
// Returns indices of words that are exactly the same as the target word
export function findSimilarWords(targetWord, allWords) {
    const similar = [];
    const targetLower = targetWord.toLowerCase().replace(/[.,!?;:'"„""()[\]{}]/g, '').trim();
    
    allWords.forEach((word, index) => {
        const wordLower = word.toLowerCase().replace(/[.,!?;:'"„""()[\]{}]/g, '').trim();
        
        // Highlight words that are exactly the same (ignoring punctuation)
        if (wordLower === targetLower) {
            similar.push(index);
        }
    });
    
    return similar;
}

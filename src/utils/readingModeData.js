// Reading mode data - Polish words organized by complexity
const words = {
    level1: {
        nouns: ['mama', 'tata', 'kot', 'pies', 'dom'],
        verbs: ['ma', 'je'],
    },
    level2: {
        nouns: ['mama', 'tata', 'kot', 'pies', 'dom', 'sok', 'mleko'],
        verbs: ['ma', 'je', 'lubi'],
    },
    level3: {
        nouns: ['mama', 'tata', 'kot', 'pies', 'dom', 'sok', 'mleko', 'balon', 'auto'],
        verbs: ['ma', 'je', 'lubi', 'widzi'],
    },
    level4: {
        nouns: ['mama', 'tata', 'kot', 'pies', 'dom', 'sok', 'mleko', 'balon', 'auto', 'park', 'piłka'],
        verbs: ['ma', 'je', 'lubi', 'widzi', 'woła', 'bierze'],
    },
    level5: {
        nouns: ['mama', 'tata', 'kot', 'pies', 'dom', 'sok', 'mleko', 'balon', 'auto', 'park', 'piłka', 'książka', 'zabawka'],
        verbs: ['ma', 'je', 'lubi', 'widzi', 'woła', 'bierze', 'czyta', 'daje'],
    }
};

// Function to generate text with repeated words (complexity 1-5)
export function getRandomSentence(level = 1) {
    const complexity = Math.max(1, Math.min(5, level)); // Ensure level is 1-5
    const levelData = words[`level${complexity}`];
    
    // Number of sentences increases with complexity
    const numSentences = Math.min(complexity + 1, 4); // 2-5 sentences
    
    // Pick 2-3 common words to repeat
    const commonWords = [];
    const numCommonWords = Math.floor(Math.random() * 2) + 2; // 2 or 3 common words
    
    // Shuffle and pick unique words
    const shuffledNouns = [...levelData.nouns].sort(() => Math.random() - 0.5);
    for (let i = 0; i < Math.min(numCommonWords, shuffledNouns.length); i++) {
        commonWords.push(shuffledNouns[i]);
    }
    
    // Generate sentences using these common words
    const sentences = [];
    
    for (let i = 0; i < numSentences; i++) {
        const subject = commonWords[i % commonWords.length];
        const verb = levelData.verbs[Math.floor(Math.random() * levelData.verbs.length)];
        const object = levelData.nouns[Math.floor(Math.random() * levelData.nouns.length)];
        
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

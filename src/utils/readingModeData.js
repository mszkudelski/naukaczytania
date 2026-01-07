// Reading mode data - basic Polish sentences for level 1
export const level1Sentences = [
    "Mama ma kota.",
    "Tata ma dom.",
    "Ala ma lalę.",
    "Kot ma mleko.",
    "Pies ma dom.",
    "Ryba ma wodę.",
    "Mama ma sok.",
    "Tata ma auto.",
    "Ola ma balon.",
    "Kot ma rybę.",
    "Ala ma piłkę.",
    "Mama lubi sok.",
    "Tata lubi dom.",
    "Kot lubi rybę.",
    "Pies lubi park."
];

// Function to get a random sentence for level 1
export function getRandomSentence() {
    const randomIndex = Math.floor(Math.random() * level1Sentences.length);
    return level1Sentences[randomIndex];
}

// Function to split sentence into words
export function sentenceToWords(sentence) {
    return sentence.split(' ');
}

// Function to find similar words in a sentence
// For now, similar means words that share at least 2 characters
export function findSimilarWords(targetWord, allWords) {
    const similar = [];
    const targetLower = targetWord.toLowerCase();
    
    // Create character frequency map for target word
    const targetCharFreq = {};
    for (let char of targetLower) {
        targetCharFreq[char] = (targetCharFreq[char] || 0) + 1;
    }
    
    allWords.forEach((word, index) => {
        const wordLower = word.toLowerCase();
        if (wordLower === targetLower) return; // Skip the same word
        
        // Count common characters using frequency map
        let commonChars = 0;
        const wordCharFreq = {};
        for (let char of wordLower) {
            wordCharFreq[char] = (wordCharFreq[char] || 0) + 1;
        }
        
        // Count overlapping characters
        for (let char in targetCharFreq) {
            if (wordCharFreq[char]) {
                commonChars += Math.min(targetCharFreq[char], wordCharFreq[char]);
            }
        }
        
        // If at least 2 characters match, consider it similar
        if (commonChars >= 2) {
            similar.push(index);
        }
    });
    
    return similar;
}

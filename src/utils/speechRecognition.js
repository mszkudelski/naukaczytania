// Speech Recognition utilities using Web Speech API
let recognition = null;

// Check if speech recognition is supported
export function isSpeechRecognitionSupported() {
    return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
}

// Initialize speech recognition
export function initializeSpeechRecognition() {
    if (!isSpeechRecognitionSupported()) {
        console.warn('Speech Recognition is not supported in this browser');
        return null;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    
    // Configure for Polish language
    recognition.lang = 'pl-PL';
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 3;
    
    return recognition;
}

// Start listening for speech
export function startListening(onResult, onEnd, onError) {
    if (!recognition) {
        recognition = initializeSpeechRecognition();
    }
    
    if (!recognition) {
        onError && onError(new Error('Speech Recognition not supported'));
        return;
    }

    recognition.onresult = (event) => {
        const results = [];
        for (let i = 0; i < event.results.length; i++) {
            const result = event.results[i];
            if (result.isFinal) {
                results.push({
                    transcript: result[0].transcript.trim(),
                    confidence: result[0].confidence,
                    isFinal: true
                });
            } else {
                results.push({
                    transcript: result[0].transcript.trim(),
                    confidence: result[0].confidence,
                    isFinal: false
                });
            }
        }
        onResult && onResult(results);
    };

    recognition.onend = () => {
        onEnd && onEnd();
    };

    recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        onError && onError(event.error);
    };

    try {
        recognition.start();
    } catch (error) {
        console.error('Failed to start recognition:', error);
        onError && onError(error);
    }
}

// Stop listening
export function stopListening() {
    if (recognition) {
        try {
            recognition.stop();
        } catch (error) {
            console.error('Failed to stop recognition:', error);
        }
    }
}

// Check if word matches (case insensitive, punctuation removed, preserving Polish characters)
// If multiple words are spoken, takes only the LAST word
export function checkWordMatch(spokenText, targetWord) {
    const normalize = (word) => {
        return word.toLowerCase()
            .replace(/[.,!?;:'"„""()[\]{}]/g, '') // Remove common punctuation while preserving letters
            .trim();
    };
    
    // Split into words and take only the last one
    const words = normalize(spokenText).split(/\s+/).filter(w => w.length > 0);
    const lastWord = words.length > 0 ? words[words.length - 1] : '';
    const normalizedTarget = normalize(targetWord);
    
    return lastWord === normalizedTarget;
}

import { useState, useEffect, useRef } from 'preact/hooks';
import { getRandomSentence, sentenceToWords, findSimilarWords } from '../utils/readingModeData';
import { speakText } from '../utils/audio';
import { 
    isSpeechRecognitionSupported, 
    startListening, 
    stopListening, 
    checkWordMatch 
} from '../utils/speechRecognition';

const WAIT_TIME = 10000; // 10 seconds
const SPEECH_DELAY = 500; // Delay before speaking
const NEXT_WORD_DELAY = 2000; // Delay before moving to next word
const SENTENCE_COMPLETE_DELAY = 3000; // Delay before loading new sentence
const WORD_CORRECT_DELAY = 1000; // Delay after correct word
const RECOGNITION_RETRY_DELAY = 100; // Delay before retrying recognition

export function ReadingModeArea({ onBackToStart }) {
    const [sentence, setSentence] = useState('');
    const [words, setWords] = useState([]);
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [isListening, setIsListening] = useState(false);
    const [recognizedText, setRecognizedText] = useState('');
    const [feedback, setFeedback] = useState('');
    const [score, setScore] = useState(0);
    const [highlightSimilar, setHighlightSimilar] = useState(false);
    const [similarWordIndices, setSimilarWordIndices] = useState([]);
    const [isWaiting, setIsWaiting] = useState(false);
    const [timeLeft, setTimeLeft] = useState(WAIT_TIME / 1000);
    
    const timerRef = useRef(null);
    const waitTimerRef = useRef(null);
    const isMountedRef = useRef(true);

    // Initialize with a random sentence
    useEffect(() => {
        loadNewSentence();
    }, []);

    // Start waiting for word when sentence is loaded
    useEffect(() => {
        if (words.length > 0 && currentWordIndex === 0 && !isWaiting) {
            startWaitingForWord(0, words);
        }
    }, [words]);

    // Update similar words when current word changes
    useEffect(() => {
        if (highlightSimilar && words.length > 0 && currentWordIndex < words.length) {
            const similar = findSimilarWords(words[currentWordIndex], words);
            setSimilarWordIndices(similar);
        } else {
            setSimilarWordIndices([]);
        }
    }, [currentWordIndex, words, highlightSimilar]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            isMountedRef.current = false;
            stopListening();
            if (timerRef.current) clearTimeout(timerRef.current);
            if (waitTimerRef.current) clearInterval(waitTimerRef.current);
        };
    }, []);

    const loadNewSentence = () => {
        const newSentence = getRandomSentence();
        const newWords = sentenceToWords(newSentence);
        setSentence(newSentence);
        setWords(newWords);
        setCurrentWordIndex(0);
        setRecognizedText('');
        setFeedback('');
        setIsWaiting(false);
        setTimeLeft(WAIT_TIME / 1000);
        
        if (timerRef.current) clearTimeout(timerRef.current);
        if (waitTimerRef.current) clearInterval(waitTimerRef.current);
    };

    const startWaitingForWord = (wordIndex, wordsArray) => {
        const idx = wordIndex !== undefined ? wordIndex : currentWordIndex;
        const wordsToUse = wordsArray || words;
        
        if (idx >= wordsToUse.length) {
            // All words completed
            setFeedback('Świetnie! Przeczytałeś całe zdanie! 🎉');
            setTimeout(() => {
                loadNewSentence();
            }, SENTENCE_COMPLETE_DELAY);
            return;
        }

        setIsWaiting(true);
        setTimeLeft(WAIT_TIME / 1000);
        setRecognizedText('');
        setFeedback('Posłuchaj:');

        // First, read the word aloud
        setTimeout(() => {
            if (words[currentWordIndex]) {
                speakText(words[currentWordIndex]);
            }
            
            // After reading, start listening and countdown
            setTimeout(() => {
                setFeedback('Teraz ty przeczytaj to słowo:');
                
                // Start countdown timer
                let timeRemaining = WAIT_TIME / 1000;
                waitTimerRef.current = setInterval(() => {
                    timeRemaining--;
                    setTimeLeft(timeRemaining);
                    if (timeRemaining <= 0) {
                        clearInterval(waitTimerRef.current);
                    }
                }, 1000);

                // Start listening
                if (isSpeechRecognitionSupported()) {
                    startListeningForWord();
                }

                // Set timer to read aloud again after WAIT_TIME
                timerRef.current = setTimeout(() => {
                    stopListening();
                    setIsWaiting(false);
                    setIsListening(false);
                    setFeedback('Posłuchaj jeszcze raz:');
                    
                    // Check if we still have valid words and index
                    if (words.length > 0 && currentWordIndex < words.length) {
                        // Read the current word aloud again
                        setTimeout(() => {
                            speakText(words[currentWordIndex]);
                            
                            // Move to next word after reading
                            setTimeout(() => {
                                setCurrentWordIndex(prev => prev + 1);
                            }, NEXT_WORD_DELAY);
                        }, SPEECH_DELAY);
                    }
                }, WAIT_TIME);
            }, 1500); // Wait 1.5s after first reading before starting to listen
        }, SPEECH_DELAY);
    };

    const startListeningForWord = () => {
        setIsListening(true);
        
        startListening(
            (results) => {
                // Handle speech recognition results
                if (results && results.length > 0) {
                    const latestResult = results[results.length - 1];
                    setRecognizedText(latestResult.transcript);
                    
                    // Check if the spoken word matches the current word
                    if (latestResult.isFinal) {
                        const isCorrect = checkWordMatch(latestResult.transcript, words[currentWordIndex]);
                        
                        if (isCorrect) {
                            // Correct word spoken!
                            stopListening();
                            setIsListening(false);
                            setIsWaiting(false);
                            if (timerRef.current) clearTimeout(timerRef.current);
                            if (waitTimerRef.current) clearInterval(waitTimerRef.current);
                            
                            setFeedback('Świetnie! ✓');
                            setScore(prev => prev + 1);
                            
                            // Move to next word
                            setTimeout(() => {
                                setCurrentWordIndex(prev => prev + 1);
                            }, WORD_CORRECT_DELAY);
                        }
                    }
                }
            },
            () => {
                // On end - restart listening if still waiting
                // Only restart if component is mounted, still waiting, and no errors occurred
                if (!isMountedRef.current) return;
                
                setTimeout(() => {
                    if (isMountedRef.current && isWaiting && currentWordIndex < words.length && isListening) {
                        startListeningForWord();
                    }
                }, RECOGNITION_RETRY_DELAY);
            },
            (error) => {
                console.error('Speech recognition error:', error);
                setIsListening(false);
                // Don't restart on permission errors
                if (error === 'not-allowed') {
                    return;
                }
            }
        );
    };

    // Restart waiting when word index changes
    // Note: startWaitingForWord is intentionally not in the dependency array
    // to avoid infinite re-renders. It uses current state values when called.
    useEffect(() => {
        if (currentWordIndex > 0 && currentWordIndex < words.length) {
            startWaitingForWord();
        }
    }, [currentWordIndex, words]);

    const getWordClassName = (index) => {
        const classes = ['reading-word'];
        if (index === currentWordIndex) {
            classes.push('reading-word-current');
        }
        if (index < currentWordIndex) {
            classes.push('reading-word-completed');
        }
        if (highlightSimilar && similarWordIndices.includes(index)) {
            classes.push('reading-word-similar');
        }
        return classes.join(' ');
    };

    return (
        <>
            <div className="text-center mb-6">
                <h2 className="level-title">Tryb Czytania - Poziom 1</h2>
            </div>

            <div className="game-card">
                <div className="instruction">
                    Najpierw posłuchaj, potem przeczytaj słowo na głos. Podświetlone słowo podąża za Twoim czytaniem.
                </div>

                <div className="reading-sentence">
                    {words.map((word, index) => (
                        <span key={index} className={getWordClassName(index)}>
                            {word}
                        </span>
                    ))}
                </div>

                {isWaiting && (
                    <div className="reading-timer">
                        Czas: {timeLeft}s
                    </div>
                )}

                {isListening && (
                    <div className="reading-listening">
                        🎤 Słucham...
                    </div>
                )}

                {recognizedText && (
                    <div className="reading-recognized">
                        Usłyszałem: "{recognizedText}"
                    </div>
                )}

                <div className="feedback">{feedback}</div>

                <div className="score">
                    Przeczytane słowa: <span className="score-value">{score}</span>
                </div>

                <div className="reading-controls">
                    <label className="reading-checkbox-label">
                        <input
                            type="checkbox"
                            checked={highlightSimilar}
                            onChange={(e) => setHighlightSimilar(e.target.checked)}
                        />
                        <span>Podświetl takie same słowa</span>
                    </label>

                    <button 
                        className="btn btn-secondary" 
                        style={{ marginTop: '1rem' }}
                        onClick={loadNewSentence}
                    >
                        Nowe zdanie
                    </button>

                    <button 
                        className="btn btn-gray" 
                        style={{ marginTop: '0.5rem' }}
                        onClick={onBackToStart}
                    >
                        Powrót do menu
                    </button>
                </div>

                {!isSpeechRecognitionSupported() && (
                    <div className="warning-message">
                        ⚠️ Twoja przeglądarka nie obsługuje rozpoznawania mowy. 
                        Spróbuj użyć Chrome lub Edge.
                    </div>
                )}
            </div>
        </>
    );
}

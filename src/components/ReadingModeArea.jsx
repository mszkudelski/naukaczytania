import { useState, useEffect, useRef } from 'preact/hooks';
import { getRandomSentence, sentenceToWords, findSimilarWords } from '../utils/readingModeData';
import { speakText } from '../utils/audio';
import { 
    isSpeechRecognitionSupported, 
    startListening, 
    stopListening, 
    checkWordMatch,
    getLastWord
} from '../utils/speechRecognition';

const WAIT_TIME = 10000; // 10 seconds - only used if no input detected
const NO_INPUT_THRESHOLD = 2000; // 2 seconds - wait for user to start speaking
const SPEECH_DELAY = 500; // Delay before speaking
const NEXT_WORD_DELAY = 2000; // Delay before moving to next word
const SENTENCE_COMPLETE_DELAY = 3000; // Delay before loading new sentence
const WORD_CORRECT_DELAY = 1000; // Delay for visual feedback after correct word (increased for smoother transition)
const WORD_INCORRECT_DELAY = 2000; // Delay after showing incorrect feedback
const RECOGNITION_RETRY_DELAY = 100; // Delay before retrying recognition

export function ReadingModeArea({ onBackToStart }) {
    const [sentence, setSentence] = useState('');
    const [words, setWords] = useState([]);
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [isListening, setIsListening] = useState(false);
    const [recognizedText, setRecognizedText] = useState('');
    const [feedback, setFeedback] = useState('');
    const [correctCount, setCorrectCount] = useState(0);
    const [incorrectCount, setIncorrectCount] = useState(0);
    const [highlightSimilar, setHighlightSimilar] = useState(false);
    const [skipFirstReading, setSkipFirstReading] = useState(false);
    const [complexityLevel, setComplexityLevel] = useState(1);
    const [similarWordIndices, setSimilarWordIndices] = useState([]);
    const [isWaiting, setIsWaiting] = useState(false);
    const [timeLeft, setTimeLeft] = useState(WAIT_TIME / 1000);
    const [hasReceivedInput, setHasReceivedInput] = useState(false);
    
    const timerRef = useRef(null);
    const waitTimerRef = useRef(null);
    const isMountedRef = useRef(true);
    const wordMatchedRef = useRef(false); // Prevent double counting same word
    const inputTimeoutRef = useRef(null); // Track when user starts speaking

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
        const newSentence = getRandomSentence(complexityLevel);
        const newWords = sentenceToWords(newSentence);
        setSentence(newSentence);
        setWords(newWords);
        setCurrentWordIndex(0);
        setRecognizedText('');
        setFeedback('');
        setIsWaiting(false);
        setHasReceivedInput(false);
        setTimeLeft(WAIT_TIME / 1000);
        
        if (timerRef.current) clearTimeout(timerRef.current);
        if (waitTimerRef.current) clearInterval(waitTimerRef.current);
    };

    const startWaitingForWord = (wordIndex, wordsArray) => {
        const idx = wordIndex !== undefined ? wordIndex : currentWordIndex;
        const wordsToUse = wordsArray || words;
        
        if (idx >= wordsToUse.length) {
            // All words completed
            setFeedback('🎉 Wspaniale! Przeczytałeś cały tekst!');
            setTimeout(() => {
                loadNewSentence();
            }, SENTENCE_COMPLETE_DELAY);
            return;
        }

        setIsWaiting(true);
        setTimeLeft(WAIT_TIME / 1000);
        setRecognizedText('');
        setHasReceivedInput(false);
        wordMatchedRef.current = false; // Reset flag for new word

        // Function to start listening phase
        const startListeningPhase = () => {
            setFeedback('🎤 Przeczytaj to słowo:');
            
            // Start listening
            if (isSpeechRecognitionSupported()) {
                startListeningForWord();
            }

            // Set shorter timeout to check if user has started speaking
            inputTimeoutRef.current = setTimeout(() => {
                // If no input received after 2 seconds, extend wait time
                if (!hasReceivedInput && !wordMatchedRef.current) {
                    // Continue waiting up to full WAIT_TIME
                    const remainingTime = WAIT_TIME - NO_INPUT_THRESHOLD;
                    timerRef.current = setTimeout(() => {
                        if (!wordMatchedRef.current) {
                            handleIncorrectOrTimeout();
                        }
                    }, remainingTime);
                }
            }, NO_INPUT_THRESHOLD);
        };

        // Handle incorrect or timeout case
        const handleIncorrectOrTimeout = () => {
            stopListening();
            setIsWaiting(false);
            setIsListening(false);
            setFeedback('❌ Nie udało się.');
            setIncorrectCount(prev => prev + 1);
            
            // Show feedback for 2 seconds, then read word and move on
            setTimeout(() => {
                if (words.length > 0 && currentWordIndex < words.length) {
                    setFeedback('👂 Posłuchaj jeszcze raz:');
                    speakText(words[currentWordIndex]);
                    
                    // Move to next word after reading
                    setTimeout(() => {
                        setCurrentWordIndex(prev => prev + 1);
                    }, NEXT_WORD_DELAY);
                }
            }, WORD_INCORRECT_DELAY);
        };

        // Start with or without first reading based on option
        if (skipFirstReading) {
            // Skip first reading, go straight to listening
            startListeningPhase();
        } else {
            // Read the word first
            setFeedback('👂 Posłuchaj uważnie:');
            setTimeout(() => {
                if (wordsToUse[idx]) {
                    speakText(wordsToUse[idx]);
                }
                
                // After reading, start listening phase
                setTimeout(() => {
                    startListeningPhase();
                }, 1500);
            }, SPEECH_DELAY);
        }
    };

    const handleIncorrectWord = () => {
        stopListening();
        setIsWaiting(false);
        setIsListening(false);
        setFeedback('❌ Spróbuj jeszcze raz!');
        setIncorrectCount(prev => prev + 1);
        
        // Show feedback for 2 seconds, then continue
        setTimeout(() => {
            setFeedback('');
            // Don't repeat - just move to next word
            setCurrentWordIndex(prev => prev + 1);
        }, WORD_INCORRECT_DELAY);
    };

    const startListeningForWord = () => {
        setIsListening(true);
        
        startListening(
            (results) => {
                // Handle speech recognition results
                if (results && results.length > 0) {
                    const latestResult = results[results.length - 1];
                    
                    // Mark that we received input
                    if (!hasReceivedInput) {
                        setHasReceivedInput(true);
                        // Clear the input timeout since user started speaking
                        if (inputTimeoutRef.current) {
                            clearTimeout(inputTimeoutRef.current);
                        }
                        // Set new timeout for incorrect word (2s after receiving input)
                        timerRef.current = setTimeout(() => {
                            if (!wordMatchedRef.current) {
                                // User spoke but word was incorrect
                                handleIncorrectWord();
                            }
                        }, NO_INPUT_THRESHOLD);
                    }
                    
                    // Extract only the last word from the transcript for display
                    const lastWord = getLastWord(latestResult.transcript);
                    setRecognizedText(lastWord);
                    
                    // Check if the spoken word matches the current word (check on every result, not just final)
                    // But only process if we haven't already matched this word
                    if (!wordMatchedRef.current) {
                        const isCorrect = checkWordMatch(latestResult.transcript, words[currentWordIndex]);
                        
                        if (isCorrect) {
                            // Correct word spoken! Mark as matched to prevent double counting
                            wordMatchedRef.current = true;
                            
                            // Stop listening and clear timers
                            stopListening();
                            setIsListening(false);
                            setIsWaiting(false);
                            if (timerRef.current) clearTimeout(timerRef.current);
                            if (waitTimerRef.current) clearInterval(waitTimerRef.current);
                            if (inputTimeoutRef.current) clearTimeout(inputTimeoutRef.current);
                            
                            setFeedback('✅ Świetnie!');
                            setCorrectCount(prev => prev + 1);
                            
                            // Move to next word with smooth transition
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
                <h2 className="level-title">Tryb Czytania - Poziom {complexityLevel}</h2>
            </div>

            <div className="game-card">
                <div className="instruction">
                    {skipFirstReading 
                        ? 'Przeczytaj słowo na głos. Podświetlone słowo podąża za Twoim czytaniem.'
                        : 'Najpierw posłuchaj, potem przeczytaj słowo na głos. Podświetlone słowo podąża za Twoim czytaniem.'
                    }
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

                {/* Counters hidden as requested - tracking still happens in background */}
                {false && (
                    <div className="score-container">
                        <div className="score-item score-correct">
                            ✅ Poprawne: <span className="score-value">{correctCount}</span>
                        </div>
                        <div className="score-item score-incorrect">
                            ❌ Błędne: <span className="score-value">{incorrectCount}</span>
                        </div>
                    </div>
                )}

                <div className="reading-controls">
                    <label className="reading-checkbox-label">
                        <input
                            type="checkbox"
                            checked={highlightSimilar}
                            onChange={(e) => setHighlightSimilar(e.target.checked)}
                        />
                        <span>Podświetl takie same słowa</span>
                    </label>

                    <label className="reading-checkbox-label">
                        <input
                            type="checkbox"
                            checked={skipFirstReading}
                            onChange={(e) => setSkipFirstReading(e.target.checked)}
                        />
                        <span>Pomiń pierwsze czytanie</span>
                    </label>

                    <div className="reading-complexity-control">
                        <label htmlFor="complexity">Poziom trudności: {complexityLevel}</label>
                        <input
                            id="complexity"
                            type="range"
                            min="1"
                            max="5"
                            value={complexityLevel}
                            onChange={(e) => setComplexityLevel(parseInt(e.target.value))}
                            className="complexity-slider"
                        />
                    </div>

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

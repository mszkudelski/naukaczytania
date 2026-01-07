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

    // Initialize with a random sentence
    useEffect(() => {
        loadNewSentence();
    }, []);

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
        
        // Start waiting and listening for the first word
        startWaitingForWord();
    };

    const startWaitingForWord = () => {
        if (currentWordIndex >= words.length) {
            // All words completed
            setFeedback('Świetnie! Przeczytałeś całe zdanie! 🎉');
            setTimeout(() => {
                loadNewSentence();
            }, 3000);
            return;
        }

        setIsWaiting(true);
        setTimeLeft(WAIT_TIME / 1000);
        setRecognizedText('');
        setFeedback('');

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

        // Set timer to read aloud after WAIT_TIME
        timerRef.current = setTimeout(() => {
            stopListening();
            setIsWaiting(false);
            setIsListening(false);
            setFeedback('Posłuchaj jak się czyta to słowo:');
            
            // Read the current word aloud
            setTimeout(() => {
                speakText(words[currentWordIndex]);
                
                // Move to next word after reading
                setTimeout(() => {
                    setCurrentWordIndex(prev => prev + 1);
                }, 2000);
            }, 500);
        }, WAIT_TIME);
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
                            }, 1000);
                        }
                    }
                }
            },
            () => {
                // On end - restart listening if still waiting
                if (isWaiting && currentWordIndex < words.length) {
                    setTimeout(() => {
                        if (isWaiting) {
                            startListeningForWord();
                        }
                    }, 100);
                }
            },
            (error) => {
                console.error('Speech recognition error:', error);
                setIsListening(false);
            }
        );
    };

    // Restart waiting when word index changes
    useEffect(() => {
        if (currentWordIndex > 0 && currentWordIndex < words.length) {
            startWaitingForWord();
        }
    }, [currentWordIndex]);

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
                    Przeczytaj słowo na głos. Podświetlone słowo to słowo, które powinieneś przeczytać.
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
                        <span>Podświetl podobne słowa</span>
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

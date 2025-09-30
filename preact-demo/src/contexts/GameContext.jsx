import { createContext } from 'preact';
import { useContext, useReducer, useEffect } from 'preact/hooks';

// Game data constants (migrated from original app)
const LEVEL_UP_THRESHOLD = 0.9;
const NUM_OPTIONS = 3;
const STORAGE_KEY_LEVEL = 'readingGame_currentLevel';
const STORAGE_KEY_SCORE = 'readingGame_currentScore';

const basicLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'R', 'S', 'T', 'U', 'W', 'Y', 'Z'];
const polishChars = ['Ą', 'Ć', 'Ę', 'Ł', 'Ń', 'Ó', 'Ś', 'Ź', 'Ż'];

// Game state reducer
const gameReducer = (state, action) => {
  switch (action.type) {
    case 'START_GAME':
      return {
        ...state,
        currentLevel: action.level,
        score: 0,
        currentQuestionIndex: 0,
        questionsOrder: generateQuestionsOrder(action.level),
        isPlaying: true
      };
    
    case 'ANSWER_QUESTION':
      const newScore = action.isCorrect ? state.score + 1 : state.score;
      return {
        ...state,
        score: newScore,
        currentQuestionIndex: state.currentQuestionIndex + 1,
        lastAnswerCorrect: action.isCorrect
      };
    
    case 'END_GAME':
      return {
        ...state,
        isPlaying: false,
        gameEnded: true
      };
    
    case 'NEXT_LEVEL':
      return {
        ...state,
        currentLevel: state.currentLevel + 1,
        score: 0,
        currentQuestionIndex: 0,
        questionsOrder: generateQuestionsOrder(state.currentLevel + 1),
        gameEnded: false
      };
    
    case 'RESET_GAME':
      return {
        ...initialGameState,
        currentLevel: 1
      };
    
    default:
      return state;
  }
};

// Helper function to generate questions for a level
const generateQuestionsOrder = (level) => {
  let sourceData = [];
  
  switch (level) {
    case 1:
    case 2:
      sourceData = basicLetters;
      break;
    case 3:
      sourceData = [...basicLetters, ...polishChars];
      break;
    // Add more levels as needed
    default:
      sourceData = basicLetters;
  }
  
  return shuffleArray([...sourceData]).slice(0, 10); // 10 questions per level
};

// Utility function
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const initialGameState = {
  currentLevel: 1,
  score: 0,
  currentQuestionIndex: 0,
  questionsOrder: [],
  isPlaying: false,
  gameEnded: false,
  lastAnswerCorrect: null
};

const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [gameState, dispatch] = useReducer(gameReducer, initialGameState);

  // Save game state to localStorage
  useEffect(() => {
    if (gameState.isPlaying) {
      localStorage.setItem(STORAGE_KEY_LEVEL, gameState.currentLevel);
      localStorage.setItem(STORAGE_KEY_SCORE, gameState.score);
    }
  }, [gameState.currentLevel, gameState.score, gameState.isPlaying]);

  const actions = {
    startGame: (level = 1) => {
      dispatch({ type: 'START_GAME', level });
    },
    
    answerQuestion: (isCorrect) => {
      dispatch({ type: 'ANSWER_QUESTION', isCorrect });
      
      // Check if game should end
      const nextQuestionIndex = gameState.currentQuestionIndex + 1;
      if (nextQuestionIndex >= gameState.questionsOrder.length) {
        setTimeout(() => dispatch({ type: 'END_GAME' }), 1500);
      }
    },
    
    nextLevel: () => {
      dispatch({ type: 'NEXT_LEVEL' });
    },
    
    resetGame: () => {
      localStorage.removeItem(STORAGE_KEY_LEVEL);
      localStorage.removeItem(STORAGE_KEY_SCORE);
      dispatch({ type: 'RESET_GAME' });
    }
  };

  const contextValue = {
    ...gameState,
    actions,
    constants: {
      LEVEL_UP_THRESHOLD,
      NUM_OPTIONS,
      basicLetters,
      polishChars
    }
  };

  return (
    <GameContext.Provider value={contextValue}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
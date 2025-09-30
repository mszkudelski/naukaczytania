import { useState, useEffect } from 'preact/hooks';
import { useGameState } from '../hooks/useGameState';
import { initializeAudio } from '../utils/audio';
import { StartScreen } from './StartScreen';
import { GameArea } from './GameArea';
import { ResumeModal } from './ResumeModal';
import { MasterModeModal } from './MasterModeModal';
import { LevelUpModal } from './LevelUpModal';
import { EndGameModal } from './EndGameModal';

export function App() {
    const gameState = useGameState();
    const [currentScreen, setCurrentScreen] = useState('start'); // 'start' | 'game'
    const [showMasterModal, setShowMasterModal] = useState(false);
    const [showLevelUpModal, setShowLevelUpModal] = useState(false);
    const [showEndGameModal, setShowEndGameModal] = useState(false);
    const [levelUpData, setLevelUpData] = useState(null);
    const [endGameData, setEndGameData] = useState(null);

    // Initialize audio on mount
    useEffect(() => {
        initializeAudio();
    }, []);

    const handleStartGame = (level = 1) => {
        gameState.initGame(level);
        setCurrentScreen('game');
        setShowMasterModal(false);
    };

    const handleResumeGame = () => {
        gameState.resumeGame();
        setCurrentScreen('game');
    };

    const handleNewGame = () => {
        gameState.startNewGame();
        setCurrentScreen('game');
    };

    const handleBackToStart = () => {
        setCurrentScreen('start');
        setShowLevelUpModal(false);
        setShowEndGameModal(false);
    };

    const handleLevelUp = (nextLevel, previousScore) => {
        setLevelUpData({ nextLevel, previousScore });
        setShowLevelUpModal(true);
    };

    const handleStartNextLevel = () => {
        if (levelUpData) {
            gameState.levelUp(levelUpData.nextLevel);
            setShowLevelUpModal(false);
            // Stay on game screen, game will reinitialize
        }
    };

    const handleEndGame = (level, score, isComplete = false) => {
        setEndGameData({ level, score, isComplete });
        setShowEndGameModal(true);
    };

    const handleRestartFromEnd = () => {
        gameState.startNewGame();
        setShowEndGameModal(false);
        // Stay on game screen
    };

    return (
        <div className="container">
            {currentScreen === 'start' && (
                <StartScreen
                    onStartGame={handleStartGame}
                    onShowMasterMode={() => setShowMasterModal(true)}
                />
            )}

            {currentScreen === 'game' && (
                <GameArea
                    gameState={gameState}
                    onLevelUp={handleLevelUp}
                    onEndGame={handleEndGame}
                    onBackToStart={handleBackToStart}
                />
            )}

            {/* Modals */}
            {gameState.showResumeModal && (
                <ResumeModal
                    savedGame={gameState.savedGame}
                    onResume={handleResumeGame}
                    onNewGame={handleNewGame}
                />
            )}

            {showMasterModal && (
                <MasterModeModal
                    onStartLevel={handleStartGame}
                    onClose={() => setShowMasterModal(false)}
                />
            )}

            {showLevelUpModal && levelUpData && (
                <LevelUpModal
                    nextLevel={levelUpData.nextLevel}
                    previousScore={levelUpData.previousScore}
                    onStartNextLevel={handleStartNextLevel}
                    onRestartGame={handleBackToStart}
                />
            )}

            {showEndGameModal && endGameData && (
                <EndGameModal
                    level={endGameData.level}
                    score={endGameData.score}
                    isComplete={endGameData.isComplete}
                    onRestart={handleRestartFromEnd}
                />
            )}

            {/* Persistent Master Mode Button */}
            <button
                id="persistent-master-mode-button"
                className="btn btn-secondary"
                onClick={() => setShowMasterModal(true)}
            >
                Tryb Mistrza
            </button>
        </div>
    );
}
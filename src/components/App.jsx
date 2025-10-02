import { useEffect } from 'preact/hooks';
import { useGameState } from '../hooks/useGameState';
import { useModalManager } from '../hooks/useModalManager';
import { useScreenNavigation } from '../hooks/useScreenNavigation';
import { initializeAudio } from '../utils/audio';
import { StartScreen } from './StartScreen';
import { GameArea } from './GameArea';
import { ResumeModal } from './ResumeModal';
import { MasterModeModal } from './MasterModeModal';
import { LevelUpModal } from './LevelUpModal';
import { EndGameModal } from './EndGameModal';

export function App() {
    const gameState = useGameState();
    const navigation = useScreenNavigation();
    const modals = useModalManager();

    // Initialize audio on mount
    useEffect(() => {
        initializeAudio();
    }, []);

    const handleStartGame = (level = 1) => {
        gameState.initGame(level);
        navigation.goToGame();
        modals.closeMasterModal();
    };

    const handleResumeGame = () => {
        gameState.resumeGame();
        navigation.goToGame();
    };

    const handleNewGame = () => {
        gameState.startNewGame();
        navigation.goToGame();
    };

    const handleBackToStart = () => {
        navigation.goToStart();
        modals.closeAllModals();
    };

    const handleLevelUp = (nextLevel, previousScore) => {
        modals.openLevelUpModal(nextLevel, previousScore);
    };

    const handleStartNextLevel = () => {
        if (modals.levelUpData) {
            gameState.levelUp(modals.levelUpData.nextLevel);
            modals.closeLevelUpModal();
        }
    };

    const handleEndGame = (level, score, isComplete = false) => {
        modals.openEndGameModal(level, score, isComplete);
    };

    const handleRestartFromEnd = () => {
        gameState.startNewGame();
        modals.closeEndGameModal();
    };

    return (
        <div className="container">
            {navigation.isOnStartScreen && (
                <StartScreen
                    onStartGame={handleStartGame}
                    onShowMasterMode={modals.openMasterModal}
                />
            )}

            {navigation.isOnGameScreen && (
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

            {modals.showMasterModal && (
                <MasterModeModal
                    onStartLevel={handleStartGame}
                    onClose={modals.closeMasterModal}
                />
            )}

            {modals.showLevelUpModal && modals.levelUpData && (
                <LevelUpModal
                    nextLevel={modals.levelUpData.nextLevel}
                    previousScore={modals.levelUpData.previousScore}
                    onStartNextLevel={handleStartNextLevel}
                    onRestartGame={handleBackToStart}
                />
            )}

            {modals.showEndGameModal && modals.endGameData && (
                <EndGameModal
                    level={modals.endGameData.level}
                    score={modals.endGameData.score}
                    isComplete={modals.endGameData.isComplete}
                    onRestart={handleRestartFromEnd}
                />
            )}

            {/* Persistent Master Mode Button */}
            <button
                id="persistent-master-mode-button"
                className="btn btn-secondary"
                onClick={modals.openMasterModal}
            >
                Tryb Mistrza
            </button>
        </div>
    );
}
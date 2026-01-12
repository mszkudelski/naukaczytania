import { useState } from 'preact/hooks';

export function useScreenNavigation() {
    const [currentScreen, setCurrentScreen] = useState('start'); // 'start' | 'game' | 'reading'

    const goToStart = () => setCurrentScreen('start');
    const goToGame = () => setCurrentScreen('game');
    const goToReadingMode = () => setCurrentScreen('reading');

    return {
        currentScreen,
        goToStart,
        goToGame,
        goToReadingMode,
        isOnStartScreen: currentScreen === 'start',
        isOnGameScreen: currentScreen === 'game',
        isOnReadingMode: currentScreen === 'reading'
    };
}
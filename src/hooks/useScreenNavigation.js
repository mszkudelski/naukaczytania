import { useState } from 'preact/hooks';

export function useScreenNavigation() {
    const [currentScreen, setCurrentScreen] = useState('start'); // 'start' | 'game'

    const goToStart = () => setCurrentScreen('start');
    const goToGame = () => setCurrentScreen('game');

    return {
        currentScreen,
        goToStart,
        goToGame,
        isOnStartScreen: currentScreen === 'start',
        isOnGameScreen: currentScreen === 'game'
    };
}
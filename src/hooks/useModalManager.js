import { useState } from 'preact/hooks';

export function useModalManager() {
    const [showMasterModal, setShowMasterModal] = useState(false);
    const [showLevelUpModal, setShowLevelUpModal] = useState(false);
    const [showEndGameModal, setShowEndGameModal] = useState(false);
    const [levelUpData, setLevelUpData] = useState(null);
    const [endGameData, setEndGameData] = useState(null);

    const openMasterModal = () => setShowMasterModal(true);
    const closeMasterModal = () => setShowMasterModal(false);

    const openLevelUpModal = (nextLevel, previousScore) => {
        setLevelUpData({ nextLevel, previousScore });
        setShowLevelUpModal(true);
    };

    const closeLevelUpModal = () => {
        setShowLevelUpModal(false);
        setLevelUpData(null);
    };

    const openEndGameModal = (level, score, isComplete = false) => {
        setEndGameData({ level, score, isComplete });
        setShowEndGameModal(true);
    };

    const closeEndGameModal = () => {
        setShowEndGameModal(false);
        setEndGameData(null);
    };

    const closeAllModals = () => {
        setShowMasterModal(false);
        setShowLevelUpModal(false);
        setShowEndGameModal(false);
        setLevelUpData(null);
        setEndGameData(null);
    };

    return {
        // State
        showMasterModal,
        showLevelUpModal,
        showEndGameModal,
        levelUpData,
        endGameData,
        
        // Actions
        openMasterModal,
        closeMasterModal,
        openLevelUpModal,
        closeLevelUpModal,
        openEndGameModal,
        closeEndGameModal,
        closeAllModals
    };
}
import { useGameLogic } from '../hooks/useGameLogic';
import LevelHeader from './LevelHeader';
import GameContent from './GameContent';
import LoadingScreen from './LoadingScreen';
import MasterModeButton from './MasterModeButton';

const GameScreen = ({ onBackToStart }) => {
  const {
    currentLevel,
    currentQuestion,
    progressPercentage,
    score,
    isPlaying,
    gameEnded,
    handleOptionClick,
    handleTargetClick
  } = useGameLogic();

  const handleMasterModeClick = () => {
    console.log('Master mode clicked - modal should open here');
  };

  if (!isPlaying || !currentQuestion) {
    return <LoadingScreen />;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <LevelHeader currentLevel={currentLevel} />
      
      <GameContent
        currentLevel={currentLevel}
        currentQuestion={currentQuestion}
        progressPercentage={progressPercentage}
        score={score}
        onOptionClick={handleOptionClick}
        onTargetClick={handleTargetClick}
      />
      
      <MasterModeButton onClick={handleMasterModeClick} />
    </div>
  );
};

export default GameScreen;
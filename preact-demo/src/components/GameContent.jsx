import ProgressBar from './ProgressBar';
import TargetDisplay from './TargetDisplay';
import OptionsGrid from './OptionsGrid';
import FeedbackDisplay from './FeedbackDisplay';
import ScoreDisplay from './ScoreDisplay';
import { useLevelConfig } from '../hooks/useLevelConfig';
import { useQuestionGeneration } from '../hooks/useQuestionGeneration';

const GameContent = ({ 
  currentLevel, 
  currentQuestion, 
  progressPercentage, 
  score, 
  onOptionClick, 
  onTargetClick 
}) => {
  const { getInstruction } = useLevelConfig();
  const options = useQuestionGeneration(currentQuestion);

  return (
    <div className="bg-white rounded-2xl p-6 md:p-8 max-w-2xl w-full mx-4 shadow-2xl">
      <ProgressBar percentage={progressPercentage} />
      
      <div className="text-center mb-6">
        <div className="text-lg text-gray-600 mb-2">
          {getInstruction(currentLevel)}
        </div>
        
        <TargetDisplay 
          target={currentQuestion} 
          onClick={onTargetClick}
        />
        
        <OptionsGrid 
          options={options} 
          onOptionClick={onOptionClick}
        />
        
        <FeedbackDisplay />
        
        <ScoreDisplay score={score} />
      </div>
    </div>
  );
};

export default GameContent;
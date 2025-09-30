import { useLevelConfig } from '../hooks/useLevelConfig';

const LevelHeader = ({ currentLevel }) => {
  const { getLevelTitle } = useLevelConfig();

  return (
    <div className="text-center mb-6">
      <h2 className="text-3xl md:text-4xl font-black text-white drop-shadow-lg">
        {getLevelTitle(currentLevel)}
      </h2>
    </div>
  );
};

export default LevelHeader;
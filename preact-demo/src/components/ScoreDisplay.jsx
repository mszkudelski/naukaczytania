const ScoreDisplay = ({ score }) => {
  return (
    <div className="text-xl text-gray-600">
      Punkty: <span className="font-bold text-gray-800">{score}</span>
    </div>
  );
};

export default ScoreDisplay;
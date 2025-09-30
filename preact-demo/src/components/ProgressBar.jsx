const ProgressBar = ({ percentage }) => {
  return (
    <div className="w-full bg-gray-200 rounded-full h-5 mb-6 shadow-inner">
      <div 
        className="bg-green-500 h-5 rounded-full transition-all duration-500 ease-out"
        style={{ width: `${Math.max(0, Math.min(100, percentage))}%` }}
      />
    </div>
  );
};

export default ProgressBar;
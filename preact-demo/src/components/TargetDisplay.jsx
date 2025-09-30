const TargetDisplay = ({ target, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="cursor-pointer select-none text-6xl md:text-8xl font-black text-purple-600 h-32 flex items-center justify-center mb-8 hover:opacity-80 transition-opacity duration-200 break-all"
      title="Kliknij, aby usłyszeć"
    >
      {target}
    </div>
  );
};

export default TargetDisplay;
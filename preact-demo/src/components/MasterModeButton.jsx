const MasterModeButton = ({ onClick }) => {
  return (
    <button 
      onClick={onClick}
      className="fixed bottom-5 right-5 bg-purple-500 hover:bg-purple-400 text-white font-bold px-6 py-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
    >
      Tryb Mistrza
    </button>
  );
};

export default MasterModeButton;
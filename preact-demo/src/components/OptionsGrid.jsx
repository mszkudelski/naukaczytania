import { useState } from 'preact/hooks';

const OptionsGrid = ({ options, onOptionClick }) => {
  const [disabledButtons, setDisabledButtons] = useState(false);

  const handleOptionClick = (option) => {
    if (disabledButtons) return;
    
    setDisabledButtons(true);
    onOptionClick(option);
    
    // Re-enable buttons after feedback delay
    setTimeout(() => {
      setDisabledButtons(false);
    }, 1500);
  };

  return (
    <div className="grid grid-cols-3 gap-3 mb-6">
      {options.map((option, index) => (
        <button
          key={`${option}-${index}`}
          onClick={() => handleOptionClick(option)}
          disabled={disabledButtons}
          className={`
            bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold text-xl p-4 rounded-xl
            transition-all duration-200 transform hover:scale-105 active:scale-95
            disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
            min-h-16 flex items-center justify-center
            shadow-md hover:shadow-lg
          `}
        >
          {option}
        </button>
      ))}
    </div>
  );
};

export default OptionsGrid;
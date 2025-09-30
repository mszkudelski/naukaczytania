import { createContext } from 'preact';
import { useContext, useState, useEffect } from 'preact/hooks';
import * as Tone from 'tone';

const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [voices, setVoices] = useState([]);
  const [correctSound, setCorrectSound] = useState(null);
  const [incorrectSound, setIncorrectSound] = useState(null);

  // Initialize audio on first user interaction
  const initializeAudio = async () => {
    if (isInitialized) return;

    try {
      // Initialize Tone.js
      await Tone.start();
      
      // Create sound effects
      const correctSynth = new Tone.Synth().toDestination();
      const incorrectSynth = new Tone.Synth({
        oscillator: { type: 'sawtooth' },
        envelope: { attack: 0.01, decay: 0.2, sustain: 0, release: 0.2 }
      }).toDestination();

      setCorrectSound(correctSynth);
      setIncorrectSound(incorrectSynth);
      setIsInitialized(true);
    } catch (error) {
      console.error('Audio initialization failed:', error);
    }
  };

  // Populate voice list for speech synthesis
  const populateVoiceList = () => {
    const availableVoices = speechSynthesis.getVoices();
    const polishVoices = availableVoices.filter(voice => 
      voice.lang.includes('pl') || voice.name.toLowerCase().includes('polish')
    );
    
    setVoices(polishVoices.length > 0 ? polishVoices : availableVoices.slice(0, 5));
  };

  // Text-to-speech function
  const speakText = (text, rate = 0.7) => {
    if (!text || typeof speechSynthesis === 'undefined') return;

    speechSynthesis.cancel(); // Cancel any ongoing speech
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    // Use Polish voice if available
    const polishVoice = voices.find(voice => 
      voice.lang.includes('pl') || voice.name.toLowerCase().includes('polish')
    );
    
    if (polishVoice) {
      utterance.voice = polishVoice;
    }

    speechSynthesis.speak(utterance);
  };

  // Play correct answer sound
  const playCorrectSound = () => {
    if (correctSound) {
      correctSound.triggerAttackRelease('C5', '0.2');
      setTimeout(() => correctSound.triggerAttackRelease('E5', '0.2'), 100);
      setTimeout(() => correctSound.triggerAttackRelease('G5', '0.3'), 200);
    }
  };

  // Play incorrect answer sound
  const playIncorrectSound = () => {
    if (incorrectSound) {
      incorrectSound.triggerAttackRelease('C3', '0.3');
    }
  };

  // Initialize voices when component mounts
  useEffect(() => {
    populateVoiceList();
    
    if (typeof speechSynthesis !== 'undefined' && speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = populateVoiceList;
    }
    
    return () => {
      if (typeof speechSynthesis !== 'undefined') {
        speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  const contextValue = {
    isInitialized,
    voices,
    initializeAudio,
    speakText,
    playCorrectSound,
    playIncorrectSound
  };

  return (
    <AudioContext.Provider value={contextValue}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};
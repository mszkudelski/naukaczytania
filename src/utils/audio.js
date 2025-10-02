// Audio utilities
let correctSound, incorrectSound;
let audioInitialized = false;
const synth = window.speechSynthesis;
let voices = [];

export function populateVoiceList() {
    if (typeof speechSynthesis === 'undefined') return;
    voices = synth.getVoices();
    if (voices.length === 0 && synth.onvoiceschanged !== undefined) {
        synth.onvoiceschanged = populateVoiceList;
    }
}

export function initializeAudio() {
    if (typeof Tone === 'undefined' || audioInitialized) return;
    
    return Tone.start().then(() => {
        correctSound = new Tone.Synth({ 
            oscillator: { type: 'sine' }, 
            envelope: { attack: 0.01, decay: 0.1, sustain: 0.01, release: 0.2 } 
        }).toDestination();
        
        incorrectSound = new Tone.Synth({ 
            oscillator: { type: 'square' }, 
            envelope: { attack: 0.01, decay: 0.1, sustain: 0.01, release: 0.2 } 
        }).toDestination();
        
        audioInitialized = true;
    }).catch(e => console.error("Tone.start() failed:", e));
}

export function playCorrectSound() {
    if (correctSound && audioInitialized && Tone.context.state === 'running') {
        correctSound.triggerAttackRelease("C5", "8n", Tone.now());
    }
}

export function playIncorrectSound() {
    if (incorrectSound && audioInitialized && Tone.context.state === 'running') {
        incorrectSound.triggerAttackRelease("A2", "8n", Tone.now());
    }
}

export function speakText(text) {
    if (synth.speaking) synth.cancel();
    if (text === '') return;
    
    const textToSpeak = text.toLowerCase();
    const utterThis = new SpeechSynthesisUtterance(textToSpeak);
    utterThis.lang = 'pl-PL';

    const PREFERRED_VOICE_NAME = "";
    
    let selectedVoice = null;
    if (PREFERRED_VOICE_NAME) {
        selectedVoice = voices.find(voice => voice.name === PREFERRED_VOICE_NAME && voice.lang === 'pl-PL');
    }

    if (!selectedVoice) {
        selectedVoice = voices.find(voice => voice.lang === 'pl-PL' && voice.localService);
        if (!selectedVoice) {
            selectedVoice = voices.find(voice => voice.lang === 'pl-PL');
        }
    }
    
    if (selectedVoice) {
        utterThis.voice = selectedVoice;
    }
    
    utterThis.pitch = 1;
    utterThis.rate = 0.8;
    synth.speak(utterThis);
}

// Initialize voices
populateVoiceList();
if (typeof speechSynthesis !== 'undefined' && speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = populateVoiceList;
}
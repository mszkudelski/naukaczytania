// Game configuration and data
export const LEVEL_UP_THRESHOLD = 0.9;
export const NUM_OPTIONS = 3;

// localStorage keys
export const STORAGE_KEY_LEVEL = 'readingGame_currentLevel';
export const STORAGE_KEY_SCORE = 'readingGame_currentScore';
export const STORAGE_KEY_QUESTION_INDEX = 'readingGame_currentQuestionIndex';
export const STORAGE_KEY_QUESTIONS_ORDER = 'readingGame_questionsOrder';

// Letter arrays
export const basicLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'R', 'S', 'T', 'U', 'W', 'Y', 'Z'];
export const polishChars = ['Ą', 'Ć', 'Ę', 'Ł', 'Ń', 'Ó', 'Ś', 'Ź', 'Ż'];

// Game level data
export const gameData = {
    1: {
        title: "Poziom 1: Jaka to litera?",
        instruction: "Posłuchaj i wybierz pokazaną literę:",
        letters: [...basicLetters],
        distractors: [...basicLetters],
        useAudio: false
    },
    2: {
        title: "Poziom 2: Posłuchaj i wybierz literę",
        instruction: "Posłuchaj i wybierz poprawną literę:",
        letters: [...basicLetters],
        distractors: [...basicLetters],
        useAudio: true
    },
    3: {
        title: "Poziom 3: Polskie litery ze słuchem",
        instruction: "Posłuchaj i wybierz polską literę:",
        letters: [...basicLetters, ...polishChars],
        distractors: [...basicLetters, ...polishChars],
        useAudio: true
    },
    4: {
        title: "Poziom 4: Sylaby dwuliterowe",
        instruction: "Posłuchaj i wybierz pokazaną sylabę:",
        letters: ['MA', 'TA', 'LA', 'DA', 'PA', 'BA', 'KO', 'TO', 'LO', 'DO', 'PO', 'BO', 'ME', 'TE', 'LE', 'DE', 'PE', 'BE', 'MU', 'TU', 'LU', 'DU', 'PU', 'BU', 'SA', 'ZA', 'RA', 'FA', 'WA'],
        distractors: ['MA', 'TA', 'LA', 'DA', 'PA', 'BA', 'KO', 'TO', 'LO', 'DO', 'PO', 'BO', 'ME', 'TE', 'LE', 'DE', 'PE', 'BE', 'MU', 'TU', 'LU', 'DU', 'PU', 'BU', 'SA', 'ZA', 'RA', 'FA', 'WA'],
        useAudio: false
    },
    5: {
        title: "Poziom 5: Sylaby dwuliterowe ze słuchem",
        instruction: "Posłuchaj i wybierz sylabę:",
        letters: ['MA', 'TA', 'LA', 'DA', 'PA', 'BA', 'KO', 'TO', 'LO', 'DO', 'PO', 'BO', 'ME', 'TE', 'LE', 'DE', 'PE', 'BE', 'MU', 'TU', 'LU', 'DU', 'PU', 'BU', 'SA', 'ZA', 'RA', 'FA', 'WA'],
        distractors: ['MA', 'TA', 'LA', 'DA', 'PA', 'BA', 'KO', 'TO', 'LO', 'DO', 'PO', 'BO', 'ME', 'TE', 'LE', 'DE', 'PE', 'BE', 'MU', 'TU', 'LU', 'DU', 'PU', 'BU', 'SA', 'ZA', 'RA', 'FA', 'WA'],
        useAudio: true
    },
    6: {
        title: "Poziom 6: Sylaby trzyliterowe",
        instruction: "Posłuchaj i wybierz pokazaną sylabę:",
        letters: ['MAK', 'KOT', 'LAS', 'DOM', 'TOR', 'RAK', 'NOS', 'LIS', 'LOK', 'BAL', 'PAS', 'SEN', 'SOK', 'TYL', 'SAD', 'MOL', 'LOT', 'RAM', 'NUR', 'KAS', 'DAL', 'KOS', 'MYK', 'RYM', 'SER'],
        distractors: ['MAK', 'KOT', 'LAS', 'DOM', 'TOR', 'RAK', 'NOS', 'LIS', 'LOK', 'BAL', 'PAS', 'SEN', 'SOK', 'TYL', 'SAD', 'MOL', 'LOT', 'RAM', 'NUR', 'KAS', 'DAL', 'KOS', 'MYK', 'RYM', 'SER'],
        useAudio: false
    },
    7: {
        title: "Poziom 7: Sylaby trzyliterowe ze słuchem",
        instruction: "Posłuchaj i wybierz sylabę:",
        letters: ['MAK', 'KOT', 'LAS', 'DOM', 'TOR', 'RAK', 'NOS', 'LIS', 'LOK', 'BAL', 'PAS', 'SEN', 'SOK', 'TYL', 'SAD', 'MOL', 'LOT', 'RAM', 'NUR', 'KAS', 'DAL', 'KOS', 'MYK', 'RYM', 'SER'],
        distractors: ['MAK', 'KOT', 'LAS', 'DOM', 'TOR', 'RAK', 'NOS', 'LIS', 'LOK', 'BAL', 'PAS', 'SEN', 'SOK', 'TYL', 'SAD', 'MOL', 'LOT', 'RAM', 'NUR', 'KAS', 'DAL', 'KOS', 'MYK', 'RYM', 'SER'],
        useAudio: true
    },
    8: {
        title: "Poziom 8: Sylaby dwuliterowe PL ze słuchem",
        instruction: "Posłuchaj i wybierz polską sylabę:",
        letters: ['ŁA', 'MĄ', 'SĘ', 'CIĘ', 'ŻY', 'RÓ', 'BÓ', 'GĘ', 'ŻÓ', 'ŚI', 'NIĄ', 'DZIĘ', 'PÓ', 'WĘ', 'ZIĄ'],
        distractors: ['ŁA', 'MĄ', 'SĘ', 'CIĘ', 'ŻY', 'RÓ', 'BÓ', 'GĘ', 'ŻÓ', 'ŚI', 'NIĄ', 'DZIĘ', 'PÓ', 'WĘ', 'ZIĄ', 'MA', 'TA', 'LA', 'DA', 'PA', 'BA'],
        useAudio: true
    },
    9: {
        title: "Poziom 9: Sylaby trzyliterowe PL ze słuchem",
        instruction: "Posłuchaj i wybierz polską sylabę:",
        letters: ['ŁOŚ', 'MĄŻ', 'WĄŻ', 'ŻÓŁĆ', 'ĆMA', 'DĄB', 'KRĄG', 'MÓZG', 'PĄK', 'RÓG', 'SĄD', 'ŚMIG', 'WĘCH', 'ŹLE', 'ŻLEB'],
        distractors: ['ŁOŚ', 'MĄŻ', 'WĄŻ', 'ŻÓŁĆ', 'ĆMA', 'DĄB', 'KRĄG', 'MÓZG', 'PĄK', 'RÓG', 'SĄD', 'ŚMIG', 'WĘCH', 'ŹLE', 'ŻLEB', 'MAK', 'KOT', 'LAS'],
        useAudio: true
    },
    10: {
        title: "Poziom 10: Słowa dwusylabowe ze słuchem",
        instruction: "Posłuchaj i wybierz słowo:",
        letters: ['MAMA', 'TATA', 'LALA', 'KURA', 'DOMY', 'KOTY', 'LASY', 'RYBA', 'SOWA', 'FOKA', 'MAPA', 'NOGA', 'OKNO', 'AUTO', 'LATO', 'BALON', 'ROBOT', 'KAWA', 'MASA', 'PUMA'],
        distractors: ['MAMA', 'TATA', 'LALA', 'KURA', 'DOMY', 'KOTY', 'LASY', 'RYBA', 'SOWA', 'FOKA', 'MAPA', 'NOGA', 'OKNO', 'AUTO', 'LATO', 'BALON', 'ROBOT', 'KAWA', 'MASA', 'PUMA'],
        useAudio: true
    },
    11: {
        title: "Poziom 11: Słowa dwusylabowe PL ze słuchem",
        instruction: "Posłuchaj i wybierz polskie słowo:",
        letters: ['JABŁKO', 'ĆWIREK', 'ŹRÓDŁO', 'ŻÓŁWIE', 'KSIĄŻKA', 'ĆWICZĘ', 'ŹREBIĘ', 'ŻAGIEL', 'ŁAŃCUCH', 'ŚWIĘTO', 'ŚLICZNY', 'TAŃCZY', 'RÓŻOWY', 'ŚWIŃSKA', 'ĆWIERĆ'],
        distractors: ['JABŁKO', 'ĆWIREK', 'ŹRÓDŁO', 'ŻÓŁWIE', 'KSIĄŻKA', 'ĆWICZĘ', 'ŹREBIĘ', 'ŻAGIEL', 'ŁAŃCUCH', 'ŚWIĘTO', 'ŚLICZNY', 'TAŃCZY', 'RÓŻOWY', 'ŚWIŃSKA', 'ĆWIERĆ'],
        useAudio: true
    },
    12: {
        title: "Poziom 12: Słowa trzysylabowe PL ze słuchem",
        instruction: "Posłuchaj i wybierz polskie słowo:",
        letters: ['PRZYGODA', 'KSIĄŻECZKA', 'MOTYLEK', 'ŚLIMACZEK', 'KOLOROWY', 'WESOŁOŚĆ', 'PRZYJAŹŃ', 'MIŁOŚĆ', 'NAUKOWY', 'WIEWIÓRKA', 'DZIECIŃSTWO', 'SZCZĘŚCIE', 'ODKRYWCA', 'PODRÓŻNIK', 'PRZYSZŁOŚĆ'],
        distractors: ['PRZYGODA', 'KSIĄŻECZKA', 'MOTYLEK', 'ŚLIMACZEK', 'KOLOROWY', 'WESOŁOŚĆ', 'PRZYJAŹŃ', 'MIŁOŚĆ', 'NAUKOWY', 'WIEWIÓRKA', 'DZIECIŃSTWO', 'SZCZĘŚCIE', 'ODKRYWCA', 'PODRÓŻNIK', 'PRZYSZŁOŚĆ'],
        useAudio: true
    }
};
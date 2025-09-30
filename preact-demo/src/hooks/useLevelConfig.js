/**
 * Custom hook for level configuration and text
 */
export const useLevelConfig = () => {
  const getLevelTitle = (level) => {
    const titles = {
      1: "Poziom 1 (Litery bez PL)",
      2: "Poziom 2 (Litery bez PL, słuch)",
      3: "Poziom 3 (Litery z PL, słuch)",
      4: "Poziom 4 (Sylaby 2-lit.)",
      5: "Poziom 5 (Sylaby 2-lit., słuch)",
      6: "Poziom 6 (Sylaby 3-lit.)",
      7: "Poziom 7 (Sylaby 3-lit., słuch)",
      8: "Poziom 8 (Sylaby 2-lit. PL, słuch)",
      9: "Poziom 9 (Sylaby 3-lit. PL, słuch)",
      10: "Poziom 10 (Słowa 2-syl. bez PL, słuch)",
      11: "Poziom 11 (Słowa 2-syl. PL, słuch)",
      12: "Poziom 12 (Słowa 3-syl. PL, słuch)"
    };
    return titles[level] || `Poziom ${level}`;
  };

  const getInstruction = (level) => {
    if (level === 1) {
      return "Posłuchaj i wybierz pokazaną literę:";
    } else if (level <= 3) {
      return "Posłuchaj i wybierz pokazaną literę:";
    } else if (level <= 9) {
      return "Posłuchaj i wybierz pokazaną sylabę:";
    } else {
      return "Posłuchaj i wybierz pokazane słowo:";
    }
  };

  return {
    getLevelTitle,
    getInstruction
  };
};
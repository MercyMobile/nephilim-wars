import { useState, useCallback } from 'react';
import { getCompleteCharacter, setCompleteCharacter } from '../utils/storage';

export function useCharacter() {
  const [character, setCharacter] = useState(() => getCompleteCharacter());

  const updateCharacter = useCallback((updates) => {
    setCharacter(prev => {
      if (!prev) return prev;
      const next = typeof updates === 'function' ? updates(prev) : { ...prev, ...updates };
      setCompleteCharacter(next);
      return next;
    });
  }, []);

  const createCharacter = useCallback((newChar) => {
    setCharacter(newChar);
    setCompleteCharacter(newChar);
    return newChar;
  }, []);

  const deleteCharacter = useCallback(() => {
    setCharacter(null);
    localStorage.removeItem('completeCharacter');
  }, []);

  return { character, updateCharacter, createCharacter, deleteCharacter };
}
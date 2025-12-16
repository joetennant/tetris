/**
 * useKeyboard Hook
 * 
 * Tracks keyboard state for game controls
 */

import { useEffect, useRef, useCallback } from 'react';

export function useKeyboard() {
  const keysPressed = useRef<Set<string>>(new Set());
  const keyHandlers = useRef<Map<string, () => void>>(new Map());

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default for game keys
      const gameKeys = ['ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp', ' ', 'z', 'x', 'c', 'p'];
      if (gameKeys.includes(e.key)) {
        e.preventDefault();
      }

      if (!keysPressed.current.has(e.key)) {
        keysPressed.current.add(e.key);
        
        // Call registered handler if exists
        const handler = keyHandlers.current.get(e.key);
        if (handler) {
          handler();
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.key);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const isKeyPressed = useCallback((key: string): boolean => {
    return keysPressed.current.has(key);
  }, []);

  const onKey = useCallback((key: string, handler: () => void) => {
    keyHandlers.current.set(key, handler);
  }, []);

  return { isKeyPressed, onKey };
}

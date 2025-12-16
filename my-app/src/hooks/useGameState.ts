/**
 * useGameState Hook
 * 
 * Wraps GameStateManager and exposes state and control functions to React
 */

import { useState, useRef, useCallback, useEffect } from 'react';
import { GameStateManager } from '../game/GameState';
import type { GameState, Input } from '../game/types';

export function useGameState() {
  const gameManager = useRef<GameStateManager | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);

  // Initialize game manager
  useEffect(() => {
    gameManager.current = new GameStateManager();
    setGameState(gameManager.current.getState());
  }, []);

  const handleInput = useCallback((input: Input) => {
    if (gameManager.current) {
      gameManager.current.handleInput(input);
      setGameState({ ...gameManager.current.getState() });
    }
  }, []);

  const update = useCallback((deltaTime: number) => {
    if (gameManager.current) {
      gameManager.current.update(deltaTime);
      setGameState({ ...gameManager.current.getState() });
    }
  }, []);

  const startGame = useCallback(() => {
    if (gameManager.current) {
      gameManager.current.start();
      setGameState({ ...gameManager.current.getState() });
    }
  }, []);

  const pauseGame = useCallback(() => {
    if (gameManager.current) {
      gameManager.current.pause();
      setGameState({ ...gameManager.current.getState() });
    }
  }, []);

  const resumeGame = useCallback(() => {
    if (gameManager.current) {
      gameManager.current.resume();
      setGameState({ ...gameManager.current.getState() });
    }
  }, []);

  return {
    gameState,
    handleInput,
    update,
    startGame,
    pauseGame,
    resumeGame,
  };
}

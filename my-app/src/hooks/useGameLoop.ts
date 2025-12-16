/**
 * useGameLoop Hook
 * 
 * Provides a smooth 60 FPS game loop using requestAnimationFrame
 */

import { useEffect, useRef } from 'react';

export type GameLoopCallback = (deltaTime: number, elapsedTime: number) => void;

export function useGameLoop(callback: GameLoopCallback, isActive = true) {
  const animationId = useRef<number>();
  const lastTime = useRef<number>(performance.now());
  const startTime = useRef<number>(performance.now());
  const callbackRef = useRef<GameLoopCallback>(callback);

  // Keep callback ref up to date
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!isActive) {
      if (animationId.current) {
        cancelAnimationFrame(animationId.current);
      }
      return;
    }

    function tick(currentTime: number) {
      const delta = currentTime - lastTime.current;
      lastTime.current = currentTime;
      
      callbackRef.current(delta, currentTime - startTime.current);
      
      animationId.current = requestAnimationFrame(tick);
    }

    animationId.current = requestAnimationFrame(tick);

    return () => {
      if (animationId.current) {
        cancelAnimationFrame(animationId.current);
      }
    };
  }, [isActive]);
}

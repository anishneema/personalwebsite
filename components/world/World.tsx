'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createGame } from './game.js';
import {
  DetailPanel,
  InspectPrompt,
  MiniMap,
  HomeButton,
  Joystick,
  MobileInteractButton,
  type Experience,
  type MiniMapState,
} from './ui';

type Game = {
  dispose: () => void;
  closePanel: () => void;
  interact: () => void;
  getState: () => MiniMapState | null;
  setMoveAxis: (x: number, y: number) => void;
};

export default function World() {
  const router = useRouter();
  const mountRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Game | null>(null);

  // Smooth black-fade back to the homepage (mirrors the site's AnimatedLink).
  const goHome = useCallback(() => {
    const overlay = document.createElement('div');
    Object.assign(overlay.style, {
      position: 'fixed',
      inset: '0',
      width: '100%',
      height: '100%',
      backgroundColor: 'black',
      zIndex: '9999',
      opacity: '0',
      transition: 'opacity 0.2s ease-out',
    });
    document.body.appendChild(overlay);
    requestAnimationFrame(() => {
      overlay.style.opacity = '1';
    });
    setTimeout(() => {
      router.push('/');
      // Fade the overlay back out once the homepage has mounted, then remove it.
      setTimeout(() => {
        overlay.style.opacity = '0';
        setTimeout(() => overlay.remove(), 300);
      }, 200);
    }, 220);
  }, [router]);

  const [hasEntered, setHasEntered] = useState(false);
  const [isTouch, setIsTouch] = useState(false);
  const [nearExp, setNearExp] = useState<Experience | null>(null);
  const [activeExp, setActiveExp] = useState<Experience | null>(null);

  useEffect(() => {
    setIsTouch(
      typeof window !== 'undefined' &&
        (window.matchMedia?.('(pointer: coarse)').matches || 'ontouchstart' in window)
    );
  }, []);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const game = createGame(container) as Game;
    gameRef.current = game;

    const onEntered = () => setHasEntered(true);
    const onNear = (e: Event) => setNearExp((e as CustomEvent).detail.exp);
    const onPanel = (e: Event) => setActiveExp((e as CustomEvent).detail.exp);

    container.addEventListener('world-entered', onEntered);
    container.addEventListener('world-near', onNear);
    container.addEventListener('world-panel', onPanel);

    return () => {
      container.removeEventListener('world-entered', onEntered);
      container.removeEventListener('world-near', onNear);
      container.removeEventListener('world-panel', onPanel);
      game.dispose();
    };
  }, []);

  const getState = useCallback(() => gameRef.current?.getState() ?? null, []);
  const onJoystick = useCallback((x: number, y: number) => {
    gameRef.current?.setMoveAxis(x, y);
  }, []);

  const panelOpen = !!activeExp;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        background: '#050510',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <div ref={mountRef} style={{ position: 'absolute', inset: 0 }} />

      {/* Return Home button */}
      <HomeButton onClick={goHome} />

      {/* Mini-map */}
      <MiniMap getState={getState} />

      {/* Floating "E to inspect" prompt — desktop only (mobile uses the button) */}
      {!isTouch && (
        <InspectPrompt
          exp={panelOpen ? null : nearExp}
          onTap={() => gameRef.current?.interact()}
        />
      )}

      {/* Slide-up detail panel */}
      <DetailPanel exp={activeExp} onClose={() => gameRef.current?.closePanel()} />

      {/* Mobile controls */}
      {isTouch && hasEntered && !panelOpen && <Joystick onChange={onJoystick} />}
      {isTouch && (
        <MobileInteractButton
          visible={!!nearExp && !panelOpen}
          onTap={() => gameRef.current?.interact()}
        />
      )}

      {/* First-load intro overlay (only before the very first entry) */}
      {!hasEntered && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            color: '#ffffff',
            textAlign: 'center',
            pointerEvents: 'none',
            background: 'radial-gradient(circle at center, rgba(5,5,16,0) 40%, rgba(5,5,16,0.6) 100%)',
          }}
        >
          <div style={{ fontSize: 13, letterSpacing: 2, color: '#7eb8ff', textTransform: 'uppercase' }}>
            Anish&apos;s World
          </div>
          <div style={{ fontSize: 28, fontWeight: 700 }}>
            {isTouch ? 'Tap to enter' : 'Click to enter'}
          </div>
          <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>
            {isTouch
              ? 'Joystick to move · drag to look · Inspect to view'
              : 'WASD / arrows to move · drag to look · E to inspect'}
          </div>
        </div>
      )}

      {/* Persistent control hint (desktop) */}
      {!isTouch && (
        <div
          style={{
            position: 'absolute',
            bottom: 16,
            left: 16,
            fontSize: 12,
            color: 'rgba(255,255,255,0.5)',
            pointerEvents: 'none',
          }}
        >
          WASD to move · Drag to look · E to inspect
        </div>
      )}
    </div>
  );
}

import { useEffect, useRef, useCallback, useMemo } from 'react';
import { gsap } from 'gsap';
import './TargetCursor.css';

const TargetCursor = ({
  targetSelector = '.cursor-target',
  spinDuration = 2,
  hideDefaultCursor = true,
  hoverDuration = 0.2,
  parallaxOn = true
}) => {
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const cornersRef = useRef<NodeListOf<HTMLElement> | null>(null);
  const spinTl = useRef<gsap.core.Timeline | null>(null);
  const dotRef = useRef<HTMLDivElement | null>(null);
  const isActiveRef = useRef(false);
  const targetCornerPositionsRef = useRef<{ x: number; y: number }[] | null>(null);
  const tickerFnRef = useRef<(() => void) | null>(null);
  const activeStrengthRef = useRef<number>(0);

  const isMobile = useMemo(() => {
    if (typeof window === 'undefined') return false; // Guard against SSR
    const hasTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isSmallScreen = window.innerWidth <= 768;
    const userAgent = (navigator.userAgent || (navigator as any).vendor) as string;
    const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
    const isMobileUserAgent = mobileRegex.test(userAgent.toLowerCase());
    return (hasTouchScreen && isSmallScreen) || isMobileUserAgent;
  }, []);

  const constants = useMemo(
    () => ({
      borderWidth: 3,
      cornerSize: 12
    }),
    []
  );

  const moveCursor = useCallback((x: number, y: number) => {
    if (!cursorRef.current) return;
    gsap.to(cursorRef.current, {
      x,
      y,
      duration: 0.1,
      ease: 'power3.out'
    });
  }, []);

  useEffect(() => {
    if (isMobile || !cursorRef.current) return;

    const originalCursor = document.body.style.cursor;
    if (hideDefaultCursor) {
      document.body.style.cursor = 'none';
    }

    const cursor = cursorRef.current as HTMLDivElement;
    cornersRef.current = cursor.querySelectorAll('.target-cursor-corner');
    let activeTarget: HTMLElement | null = null;
    let currentLeaveHandler: (() => void) | null = null;
    let resumeTimeout: number | null = null;
    let suppressActivationUntil = 0; // prevent immediate relock after clicking out

    const cleanupTarget = (target: HTMLElement) => {
      if (currentLeaveHandler) {
        target.removeEventListener('mouseleave', currentLeaveHandler);
      }
      currentLeaveHandler = null;
    };

    gsap.set(cursor, {
      xPercent: -50,
      yPercent: -50,
      x: window.innerWidth / 2,
      y: window.innerHeight / 2
    });

    const createSpinTimeline = () => {
      if (spinTl.current) {
        spinTl.current.kill();
      }
      spinTl.current = gsap
        .timeline({ repeat: -1 })
        .to(cursor, { rotation: '+=360', duration: spinDuration, ease: 'none' });
    };

    createSpinTimeline();

    const tickerFn = () => {
      if (!targetCornerPositionsRef.current || !cursorRef.current || !cornersRef.current) {
        return;
      }

      // Check if the active target still exists in the DOM
      // If it was removed (e.g., page content changed), unlock the cursor
      if (activeTarget && !document.contains(activeTarget)) {
        // Target element was removed from DOM, unlock immediately
        if (currentLeaveHandler) {
          currentLeaveHandler();
        }
        return;
      }

      const strength = activeStrengthRef.current;
      if (strength === 0) return;

      const cursorX = Number(gsap.getProperty(cursorRef.current, 'x'));
      const cursorY = Number(gsap.getProperty(cursorRef.current, 'y'));
      const corners = Array.from(cornersRef.current as NodeListOf<HTMLElement>);

      corners.forEach((corner, i) => {
        const targetX = (targetCornerPositionsRef.current as { x: number; y: number }[])[i].x - cursorX;
        const targetY = (targetCornerPositionsRef.current as { x: number; y: number }[])[i].y - cursorY;
        
        // If strength is 1 (immediate/click), set directly without interpolation
        if (strength >= 0.99) {
          gsap.set(corner as any, {
            x: targetX,
            y: targetY
          });
        } else {
          // For hover animation, interpolate
          const currentX = Number(gsap.getProperty(corner, 'x'));
          const currentY = Number(gsap.getProperty(corner, 'y'));
          const finalX = currentX + (targetX - currentX) * strength;
          const finalY = currentY + (targetY - currentY) * strength;
          
          gsap.to(corner as any, {
            x: finalX,
            y: finalY,
            duration: 0.05,
            ease: 'power1.out',
            overwrite: 'auto'
          });
        }
      });
    };

    tickerFnRef.current = tickerFn;

    const moveHandler = (e: MouseEvent) => moveCursor(e.clientX, e.clientY);
    window.addEventListener('mousemove', moveHandler);

    const scrollHandler = () => {
      if (!activeTarget || !cursorRef.current) return;
      const mouseX = Number(gsap.getProperty(cursorRef.current, 'x'));
      const mouseY = Number(gsap.getProperty(cursorRef.current, 'y'));
      const elementUnderMouse = document.elementFromPoint(mouseX, mouseY);
      const isStillOverTarget =
        elementUnderMouse &&
        (elementUnderMouse === activeTarget || elementUnderMouse.closest(targetSelector) === activeTarget);

      if (!isStillOverTarget) {
        if (currentLeaveHandler) {
          currentLeaveHandler();
        }
      }
    };

    window.addEventListener('scroll', scrollHandler, { passive: true });

    const activateTarget = (target: HTMLElement, immediate: boolean = false) => {
      if (!target || !cursorRef.current || !cornersRef.current) return;

      // Clean up previous target
      if (activeTarget && activeTarget !== target) {
        cleanupTarget(activeTarget);
      }

      // Clear any resume timeout
      if (resumeTimeout) {
        clearTimeout(resumeTimeout);
        resumeTimeout = null;
      }

      activeTarget = target;

      const corners = Array.from(cornersRef.current as NodeListOf<HTMLElement>);
      corners.forEach(corner => gsap.killTweensOf(corner));
      gsap.killTweensOf(cursorRef.current, 'rotation');
      if (spinTl.current) {
        spinTl.current.pause();
      }
      gsap.set(cursorRef.current, { rotation: 0 });

      const rect = target.getBoundingClientRect();
      const { borderWidth, cornerSize } = constants;
      const cursorX = Number(gsap.getProperty(cursorRef.current, 'x'));
      const cursorY = Number(gsap.getProperty(cursorRef.current, 'y'));

      targetCornerPositionsRef.current = [
        { x: rect.left - borderWidth, y: rect.top - borderWidth },
        { x: rect.right + borderWidth - cornerSize, y: rect.top - borderWidth },
        { x: rect.right + borderWidth - cornerSize, y: rect.bottom + borderWidth - cornerSize },
        { x: rect.left - borderWidth, y: rect.bottom + borderWidth - cornerSize }
      ];

      isActiveRef.current = true;
      
      // Start ticker for corner animation
      if (tickerFnRef.current) {
        gsap.ticker.add(tickerFnRef.current);
      }

      if (immediate) {
        // For clicks: set strength to 1 immediately
        activeStrengthRef.current = 1;
        // The ticker will handle updating corners immediately since strength is 1
        // Force an immediate update to make it visible right away
        if (tickerFnRef.current) {
          tickerFnRef.current();
        }
      } else {
        // For hovers: start at 0, will be animated in enterHandler
        activeStrengthRef.current = 0;
      }

      // Set up leave handler
      const leaveHandler = () => {
        // Only unlock if this is still the active target
        if (activeTarget !== target) {
          return;
        }

        if (tickerFnRef.current) {
          gsap.ticker.remove(tickerFnRef.current);
        }
        isActiveRef.current = false;
        targetCornerPositionsRef.current = null;
        gsap.set(activeStrengthRef, { current: 0, overwrite: true });
        activeTarget = null;

        if (cornersRef.current) {
          const corners = Array.from(cornersRef.current as NodeListOf<HTMLElement>);
          gsap.killTweensOf(corners);
          const { cornerSize } = constants;
          const positions = [
            { x: -cornerSize * 1.5, y: -cornerSize * 1.5 },
            { x: cornerSize * 0.5, y: -cornerSize * 1.5 },
            { x: cornerSize * 0.5, y: cornerSize * 0.5 },
            { x: -cornerSize * 1.5, y: cornerSize * 0.5 }
          ];

          const tl = gsap.timeline();
          corners.forEach((corner, index) => {
            tl.to(
              corner as any,
              {
                x: positions[index].x,
                y: positions[index].y,
                duration: 0.3,
                ease: 'power3.out'
              },
              0
            );
          });
        }

        // Immediately resume spinning animation
        if (cursorRef.current && spinTl.current) {
          const currentRotation = Number(gsap.getProperty(cursorRef.current, 'rotation')) || 0;
          const normalizedRotation = ((currentRotation % 360) + 360) % 360;
          if (spinTl.current) {
            spinTl.current.kill();
          }
          spinTl.current = gsap
            .timeline({ repeat: -1 })
            .to(cursorRef.current, { rotation: '+=360', duration: spinDuration, ease: 'none' });
          gsap.set(cursorRef.current, { rotation: normalizedRotation });
          if (spinTl.current) {
            spinTl.current.restart();
          }
        }

        cleanupTarget(target);
      };

      currentLeaveHandler = leaveHandler;
      target.addEventListener('mouseleave', leaveHandler);
    };

    const mouseDownHandler = (e: MouseEvent) => {
      if (!dotRef.current || !cursorRef.current) return;
      
      // Always scale down on click for visual feedback
      gsap.to(dotRef.current, { scale: 0.7, duration: 0.2, ease: 'power2.out' });
      gsap.to(cursorRef.current, { scale: 0.95, duration: 0.15, ease: 'power2.out' });

      // If clicking on a target element, activate immediately (no delay)
      const target = (e.target as HTMLElement)?.closest?.(targetSelector) as HTMLElement | null;
      if (target) {
        // Clear suppression to allow immediate activation
        suppressActivationUntil = 0;
        
        // Activate synchronously - must happen immediately before React state updates
        activateTarget(target, true);
      }
    };

    const mouseUpHandler = (e: MouseEvent) => {
      if (!dotRef.current) return;
      gsap.to(dotRef.current, { scale: 1, duration: 0.2, ease: 'power2.out' });
      gsap.to(cursorRef.current, { scale: 1, duration: 0.15, ease: 'power2.out' });
      
      // Only suppress if NOT clicking on a target (prevents relock when clicking outside)
      const target = (e.target as HTMLElement)?.closest?.(targetSelector) as HTMLElement | null;
      if (!target) {
        // Suppress activation for a short period so it doesn't immediately relock when clicking outside
        suppressActivationUntil = Date.now() + 150;
      }
    };

    window.addEventListener('mousedown', mouseDownHandler);
    window.addEventListener('mouseup', mouseUpHandler);

    const enterHandler = (e: MouseEvent) => {
      // Skip if suppression is active (but not if clicking directly - handled in mouseDownHandler)
      if (Date.now() < suppressActivationUntil) {
        return;
      }
      
      const directTarget = e.target as HTMLElement;
      const allTargets: HTMLElement[] = [];
      let current: HTMLElement | null = directTarget;

      while (current && current !== document.body) {
        if (current.matches(targetSelector)) {
          allTargets.push(current);
        }
        current = current.parentElement;
      }

      const target = (allTargets[0] as HTMLElement) || null;
      if (!target) return;
      if (activeTarget === target) return;

      // Use the shared activation function (not immediate for hover)
      activateTarget(target, false);

      // Animate strength smoothly for hover
      gsap.to(activeStrengthRef, {
        current: 1,
        duration: hoverDuration,
        ease: 'power2.out'
      });

      // Animate corners smoothly for hover
      const cursorX = Number(gsap.getProperty(cursorRef.current, 'x'));
      const cursorY = Number(gsap.getProperty(cursorRef.current, 'y'));
      const corners = Array.from(cornersRef.current as NodeListOf<HTMLElement>);
      corners.forEach((corner, i) => {
        gsap.to(corner as any, {
          x: (targetCornerPositionsRef.current as { x: number; y: number }[])[i].x - cursorX,
          y: (targetCornerPositionsRef.current as { x: number; y: number }[])[i].y - cursorY,
          duration: 0.2,
          ease: 'power2.out'
        });
      });
    };

    window.addEventListener('mouseover', enterHandler as any, { passive: true } as any);

    return () => {
      if (tickerFnRef.current) {
        gsap.ticker.remove(tickerFnRef.current as any);
      }
      window.removeEventListener('mousemove', moveHandler);
      window.removeEventListener('mouseover', enterHandler as any);
      window.removeEventListener('scroll', scrollHandler);
      window.removeEventListener('mousedown', mouseDownHandler);
      window.removeEventListener('mouseup', mouseUpHandler);
      if (activeTarget) {
        cleanupTarget(activeTarget);
      }
      spinTl.current?.kill();
      document.body.style.cursor = originalCursor;
      isActiveRef.current = false;
      targetCornerPositionsRef.current = null;
      activeStrengthRef.current = 0;
    };
  }, [targetSelector, spinDuration, moveCursor, constants, hideDefaultCursor, isMobile, hoverDuration, parallaxOn]);

  useEffect(() => {
    if (isMobile || !cursorRef.current || !spinTl.current) return;
    if (spinTl.current.isActive()) {
      spinTl.current.kill();
      spinTl.current = gsap
        .timeline({ repeat: -1 })
        .to(cursorRef.current, { rotation: '+=360', duration: spinDuration, ease: 'none' });
    }
  }, [spinDuration, isMobile]);

  if (isMobile) {
    return null;
  }

  return (
    <div ref={cursorRef} className="target-cursor-wrapper">
      <div ref={dotRef} className="target-cursor-dot" />
      <div className="target-cursor-corner corner-tl" />
      <div className="target-cursor-corner corner-tr" />
      <div className="target-cursor-corner corner-br" />
      <div className="target-cursor-corner corner-bl" />
    </div>
  );
};

export default TargetCursor;


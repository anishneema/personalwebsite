'use client';

import { useEffect, useRef } from 'react';

// UI layer for the 3D world: the floating "inspect" prompt and the
// slide-up experience detail panel.

export interface Experience {
  id: number;
  title: string;
  company: string;
  period: string;
  desc: string;
  skills: string[];
  color: string;
}

// Floating prompt shown when the player is near a frame.
export function InspectPrompt({
  exp,
  onTap,
}: {
  exp: Experience | null;
  onTap: () => void;
}) {
  return (
    <div
      onClick={exp ? onTap : undefined}
      style={{
        position: 'absolute',
        bottom: '22%',
        left: '50%',
        transform: `translateX(-50%) translateY(${exp ? '0' : '12px'})`,
        opacity: exp ? 1 : 0,
        transition: 'opacity 0.25s ease, transform 0.25s ease',
        pointerEvents: exp ? 'auto' : 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '10px 18px',
        borderRadius: 999,
        background: 'rgba(5,5,20,0.85)',
        border: '1px solid rgba(68,136,255,0.6)',
        boxShadow: '0 0 24px rgba(68,136,255,0.35)',
        color: '#ffffff',
        fontSize: 15,
        fontFamily: 'system-ui, -apple-system, sans-serif',
        whiteSpace: 'nowrap',
      }}
    >
      <kbd
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: 24,
          height: 24,
          padding: '0 6px',
          borderRadius: 6,
          background: 'rgba(68,136,255,0.18)',
          border: '1px solid #4488ff',
          color: '#7eb8ff',
          fontSize: 13,
          fontWeight: 700,
        }}
      >
        E
      </kbd>
      <span>to inspect</span>
    </div>
  );
}

// Slide-up detail panel for a selected experience.
export function DetailPanel({
  exp,
  onClose,
}: {
  exp: Experience | null;
  onClose: () => void;
}) {
  const open = !!exp;

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        transform: open ? 'translateY(0)' : 'translateY(110%)',
        transition: 'transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
        pointerEvents: open ? 'auto' : 'none',
        background: 'rgba(5,5,20,0.96)',
        borderTop: '2px solid #4488ff',
        boxShadow: '0 -20px 60px rgba(0,0,0,0.6)',
        backdropFilter: 'blur(8px)',
        color: '#ffffff',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        padding: '28px clamp(20px, 6vw, 80px) 40px',
        maxHeight: '55vh',
        overflowY: 'auto',
      }}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        aria-label="Close"
        style={{
          position: 'absolute',
          top: 16,
          right: 16,
          width: 36,
          height: 36,
          borderRadius: 8,
          background: 'rgba(68,136,255,0.12)',
          border: '1px solid rgba(68,136,255,0.5)',
          color: '#7eb8ff',
          fontSize: 18,
          lineHeight: 1,
          cursor: 'pointer',
        }}
      >
        ✕
      </button>

      <div style={{ maxWidth: 820 }}>
        <div
          style={{
            display: 'inline-block',
            width: 36,
            height: 4,
            borderRadius: 2,
            background: exp?.color ?? '#4488ff',
            marginBottom: 16,
          }}
        />
        <h2 style={{ margin: 0, fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 700, color: '#ffffff' }}>
          {exp?.title}
        </h2>
        <div style={{ marginTop: 6, fontSize: 14, color: '#7eb8ff' }}>
          {exp?.company} &nbsp;·&nbsp; {exp?.period}
        </div>
        <p
          style={{
            marginTop: 18,
            fontSize: 16,
            lineHeight: 1.65,
            color: 'rgba(255,255,255,0.82)',
            maxWidth: 680,
          }}
        >
          {exp?.desc}
        </p>

        <div style={{ marginTop: 22, display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {exp?.skills.map((skill) => (
            <span
              key={skill}
              style={{
                padding: '6px 14px',
                borderRadius: 999,
                fontSize: 13,
                background: 'rgba(68,136,255,0.15)',
                border: '1px solid #4488ff',
                color: '#cfe0ff',
              }}
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Mini-map ───────────────────────────────────────────────────────
export interface MiniMapState {
  px: number;
  pz: number;
  facing: number;
  room: { width: number; depth: number };
  frames: { x: number; z: number; color: string; active: boolean }[];
}

export function MiniMap({ getState }: { getState: () => MiniMapState | null }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const SIZE = 140;
    const PAD = 12;
    let raf = 0;

    const draw = () => {
      const st = getState();
      if (st) {
        const { width, depth } = st.room;
        const inner = SIZE - PAD * 2;
        const toX = (x: number) => PAD + ((x + width / 2) / width) * inner;
        const toY = (z: number) => PAD + ((z + depth / 2) / depth) * inner;

        ctx.clearRect(0, 0, SIZE, SIZE);

        // Backdrop
        ctx.fillStyle = 'rgba(5,5,20,0.7)';
        ctx.fillRect(0, 0, SIZE, SIZE);

        // Room outline
        ctx.strokeStyle = 'rgba(68,136,255,0.7)';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(PAD, PAD, inner, inner);

        // Frame dots
        for (const fr of st.frames) {
          ctx.beginPath();
          ctx.arc(toX(fr.x), toY(fr.z), fr.active ? 4.5 : 3, 0, Math.PI * 2);
          ctx.fillStyle = fr.color;
          ctx.globalAlpha = fr.active ? 1 : 0.7;
          ctx.fill();
          ctx.globalAlpha = 1;
        }

        // Player dot with facing wedge
        const px = toX(st.px);
        const py = toY(st.pz);
        ctx.save();
        ctx.translate(px, py);
        ctx.rotate(-st.facing); // top-down: rotate marker to facing
        ctx.beginPath();
        ctx.moveTo(0, -6);
        ctx.lineTo(4, 4);
        ctx.lineTo(-4, 4);
        ctx.closePath();
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.restore();
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, [getState]);

  return (
    <canvas
      ref={canvasRef}
      width={140}
      height={140}
      style={{
        position: 'absolute',
        bottom: 16,
        right: 16,
        width: 140,
        height: 140,
        borderRadius: 10,
        border: '1px solid rgba(68,136,255,0.4)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
        pointerEvents: 'none',
      }}
    />
  );
}

// ── Return Home button ──────────────────────────────────────────────
export function HomeButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        position: 'absolute',
        top: 16,
        right: 16,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: '10px 16px',
        borderRadius: 10,
        background: 'rgba(68,136,255,0.15)',
        border: '1px solid #4488ff',
        color: '#cfe0ff',
        fontSize: 14,
        fontWeight: 600,
        cursor: 'pointer',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        backdropFilter: 'blur(6px)',
      }}
    >
      ← Return Home
    </button>
  );
}

// ── Mobile virtual joystick (bottom-left) ───────────────────────────
export function Joystick({ onChange }: { onChange: (x: number, y: number) => void }) {
  const baseRef = useRef<HTMLDivElement>(null);
  const knobRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef({ active: false, id: -1, cx: 0, cy: 0 });

  const RADIUS = 52;

  useEffect(() => {
    const base = baseRef.current;
    const knob = knobRef.current;
    if (!base || !knob) return;

    const setKnob = (dx: number, dy: number) => {
      knob.style.transform = `translate(${dx}px, ${dy}px)`;
    };

    const start = (e: TouchEvent) => {
      const t = e.changedTouches[0];
      const rect = base.getBoundingClientRect();
      stateRef.current = {
        active: true,
        id: t.identifier,
        cx: rect.left + rect.width / 2,
        cy: rect.top + rect.height / 2,
      };
    };

    const move = (e: TouchEvent) => {
      const s = stateRef.current;
      if (!s.active) return;
      const t = Array.from(e.touches).find((x) => x.identifier === s.id);
      if (!t) return;
      let dx = t.clientX - s.cx;
      let dy = t.clientY - s.cy;
      const dist = Math.hypot(dx, dy);
      if (dist > RADIUS) {
        dx = (dx / dist) * RADIUS;
        dy = (dy / dist) * RADIUS;
      }
      setKnob(dx, dy);
      onChange(dx / RADIUS, dy / RADIUS);
    };

    const end = (e: TouchEvent) => {
      const s = stateRef.current;
      const ended = Array.from(e.changedTouches).some((x) => x.identifier === s.id);
      if (!ended) return;
      stateRef.current.active = false;
      setKnob(0, 0);
      onChange(0, 0);
    };

    base.addEventListener('touchstart', start, { passive: true });
    window.addEventListener('touchmove', move, { passive: true });
    window.addEventListener('touchend', end);
    window.addEventListener('touchcancel', end);
    return () => {
      base.removeEventListener('touchstart', start);
      window.removeEventListener('touchmove', move);
      window.removeEventListener('touchend', end);
      window.removeEventListener('touchcancel', end);
    };
  }, [onChange]);

  return (
    <div
      ref={baseRef}
      style={{
        position: 'absolute',
        bottom: 28,
        left: 28,
        width: 120,
        height: 120,
        borderRadius: '50%',
        background: 'rgba(68,136,255,0.08)',
        border: '1px solid rgba(68,136,255,0.4)',
        touchAction: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        ref={knobRef}
        style={{
          width: 52,
          height: 52,
          borderRadius: '50%',
          background: 'rgba(68,136,255,0.45)',
          border: '1px solid #7eb8ff',
        }}
      />
    </div>
  );
}

// ── Mobile interact button (bottom-right, when near a frame) ─────────
export function MobileInteractButton({
  visible,
  onTap,
}: {
  visible: boolean;
  onTap: () => void;
}) {
  if (!visible) return null;
  return (
    <button
      onClick={onTap}
      style={{
        position: 'absolute',
        bottom: 40,
        right: 28,
        width: 76,
        height: 76,
        borderRadius: '50%',
        background: 'rgba(68,136,255,0.2)',
        border: '2px solid #4488ff',
        color: '#ffffff',
        fontSize: 15,
        fontWeight: 700,
        touchAction: 'none',
        boxShadow: '0 0 24px rgba(68,136,255,0.4)',
      }}
    >
      Inspect
    </button>
  );
}

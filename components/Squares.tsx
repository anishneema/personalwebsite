import { useRef, useEffect } from 'react';
import './Squares.css';

const Squares = ({
  direction = 'right',
  speed = 1,
  borderColor = '#999',
  squareSize = 40,
  hoverFillColor = '#222',
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number | null>(null);
  const numSquaresX = useRef<number>(0);
  const numSquaresY = useRef<number>(0);
  const gridOffset = useRef({ x: 0, y: 0 });
  const hoveredSquare = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (!parent) {
        canvas.width = 800;
        canvas.height = 600;
        numSquaresX.current = Math.ceil(800 / squareSize) + 1;
        numSquaresY.current = Math.ceil(600 / squareSize) + 1;
        return;
      }
      
      // Get dimensions from parent
      const rect = parent.getBoundingClientRect();
      let width = Math.max(rect.width, 400);
      let height = Math.max(rect.height, 400);
      
      if (width === 0 || height === 0 || !isFinite(width) || !isFinite(height)) {
        width = parent.offsetWidth || parent.clientWidth || 800;
        height = parent.offsetHeight || parent.clientHeight || 600;
      }
      
      width = Math.max(width, 400);
      height = Math.max(height, 400);
      
      canvas.width = width;
      canvas.height = height;
      
      numSquaresX.current = Math.ceil(width / squareSize) + 1;
      numSquaresY.current = Math.ceil(height / squareSize) + 1;
    };

    const drawGrid = () => {
      if (canvas.width === 0 || canvas.height === 0) {
        resizeCanvas();
        if (canvas.width === 0 || canvas.height === 0) return;
      }
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const startX = Math.floor(gridOffset.current.x / squareSize) * squareSize;
      const startY = Math.floor(gridOffset.current.y / squareSize) * squareSize;

      ctx.lineWidth = 1.5;
      ctx.imageSmoothingEnabled = false;
      ctx.strokeStyle = borderColor;

      for (let x = startX; x < canvas.width + squareSize; x += squareSize) {
        for (let y = startY; y < canvas.height + squareSize; y += squareSize) {
          const squareX = x - (gridOffset.current.x % squareSize);
          const squareY = y - (gridOffset.current.y % squareSize);

          if (
            hoveredSquare.current &&
            Math.floor((x - startX) / squareSize) === hoveredSquare.current.x &&
            Math.floor((y - startY) / squareSize) === hoveredSquare.current.y
          ) {
            ctx.fillStyle = hoverFillColor;
            ctx.fillRect(squareX, squareY, squareSize, squareSize);
          }

          ctx.strokeRect(squareX + 0.5, squareY + 0.5, squareSize - 1, squareSize - 1);
        }
      }
    };

    const updateAnimation = () => {
      const effectiveSpeed = Math.max(speed, 0.1);

      switch (direction) {
        case 'right':
          gridOffset.current.x = (gridOffset.current.x - effectiveSpeed + squareSize) % squareSize;
          break;
        case 'left':
          gridOffset.current.x = (gridOffset.current.x + effectiveSpeed + squareSize) % squareSize;
          break;
        case 'up':
          gridOffset.current.y = (gridOffset.current.y + effectiveSpeed + squareSize) % squareSize;
          break;
        case 'down':
          gridOffset.current.y = (gridOffset.current.y - effectiveSpeed + squareSize) % squareSize;
          break;
        case 'diagonal':
          gridOffset.current.x = (gridOffset.current.x - effectiveSpeed + squareSize) % squareSize;
          gridOffset.current.y = (gridOffset.current.y - effectiveSpeed + squareSize) % squareSize;
          break;
        default:
          break;
      }

      drawGrid();
      requestRef.current = requestAnimationFrame(updateAnimation);
    };

    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;
      const startX = Math.floor(gridOffset.current.x / squareSize) * squareSize;
      const startY = Math.floor(gridOffset.current.y / squareSize) * squareSize;
      const hoveredSquareX = Math.floor((mouseX + gridOffset.current.x - startX) / squareSize);
      const hoveredSquareY = Math.floor((mouseY + gridOffset.current.y - startY) / squareSize);

      if (
        !hoveredSquare.current ||
        hoveredSquare.current.x !== hoveredSquareX ||
        hoveredSquare.current.y !== hoveredSquareY
      ) {
        hoveredSquare.current = { x: hoveredSquareX, y: hoveredSquareY };
      }
    };

    const handleMouseLeave = () => {
      hoveredSquare.current = null;
    };

    // Initialize
    resizeCanvas();
    drawGrid();
    
    // Start animation
    requestRef.current = requestAnimationFrame(updateAnimation);
    
    // Setup observers and events
    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        resizeCanvas();
        drawGrid();
      });
      const parent = canvas.parentElement;
      if (parent) {
        resizeObserver.observe(parent);
      }
    }
    
    window.addEventListener('resize', resizeCanvas);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    
    // Retry initialization after delays to ensure DOM is ready
    const timeout1 = setTimeout(() => {
      resizeCanvas();
      drawGrid();
    }, 100);
    
    const timeout2 = setTimeout(() => {
      resizeCanvas();
      drawGrid();
    }, 500);

    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
      window.removeEventListener('resize', resizeCanvas);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [direction, speed, borderColor, hoverFillColor, squareSize]);

  return <canvas ref={canvasRef} className={`squares-canvas ${className}`}></canvas>;
};

export default Squares;

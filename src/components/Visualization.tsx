import { motion } from "motion/react";
import { useEffect, useState } from "react";

interface VisualizationProps {
  angle: number; // degrees
  colorHex: string;
  didSlide: boolean;
  time: number | null;
  runId: string | null;
}

// Pick stroke/fill colors that read well in both themes by reading the
// `dark` class off <html>. Re-evaluated on each render so theme toggles
// from the parent frame propagate immediately.
function isDarkMode(): boolean {
  if (typeof document === 'undefined') return false;
  return document.documentElement.classList.contains('dark');
}

export function Visualization({ angle, colorHex, didSlide, time, runId }: VisualizationProps) {
  const [animating, setAnimating] = useState(false);
  const [key, setKey] = useState(0);
  // Re-render when the dark class on <html> changes (parent posts a theme).
  const [, setThemeTick] = useState(0);

  useEffect(() => {
    if (runId) {
      setAnimating(true);
      setKey((prev) => prev + 1);
    }
  }, [runId]);

  useEffect(() => {
    const observer = new MutationObserver(() => setThemeTick(t => t + 1));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const dark = isDarkMode();
  const groundColor = dark ? '#475569' : '#cbd5e1';
  const rampFill    = dark ? '#334155' : '#e2e8f0';
  const rampStroke  = dark ? '#64748b' : '#94a3b8';
  const labelColor  = dark ? '#94a3b8' : '#64748b';
  const blockStroke = dark ? '#cbd5e1' : '#1e293b';

  const R = 240;
  const angleRad = (angle * Math.PI) / 180;
  const W = R * Math.cos(angleRad);
  const H = R * Math.sin(angleRad);

  const boxSize = 28;
  const containerW = 320;
  const containerH = 260;

  const startX = 20;
  const startY = containerH - 10 - H;

  let animationProps = {};
  if (animating) {
    if (didSlide && time) {
      animationProps = {
        x: [0, R - boxSize],
        transition: { duration: time, ease: "easeIn" }
      };
    } else {
      animationProps = {
        x: [0, 3, -3, 3, 0],
        transition: { duration: 0.4, ease: "easeInOut" }
      };
    }
  } else {
    animationProps = { x: 0, transition: { duration: 0 }};
  }

  return (
    <div className="w-full bg-slate-100 rounded-xl border border-slate-200 overflow-hidden flex items-center justify-center p-4 dark:bg-slate-900 dark:border-slate-800">
      <svg width={containerW} height={containerH} viewBox={`0 0 ${containerW} ${containerH}`} className="drop-shadow-sm">

        <line x1="0" y1={containerH - 10} x2={containerW} y2={containerH - 10} stroke={groundColor} strokeWidth="4" />

        <polygon
          points={`${startX},${startY} ${startX + W},${containerH - 10} ${startX},${containerH - 10}`}
          fill={rampFill}
          stroke={rampStroke}
          strokeWidth="2"
        />

        <text x={startX + W - 30} y={containerH - 15} fontSize="12" fill={labelColor} className="font-mono">
          {angle}°
        </text>

        <g transform={`translate(${startX}, ${startY}) rotate(${angle})`}>
          <motion.rect
            key={key}
            y={-boxSize}
            width={boxSize}
            height={boxSize}
            fill={colorHex}
            stroke={blockStroke}
            strokeWidth="1.5"
            rx="2"
            animate={animationProps}
            onAnimationComplete={() => setAnimating(false)}
          />
        </g>
      </svg>
    </div>
  );
}

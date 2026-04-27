import { motion } from "motion/react";
import { useEffect, useState } from "react";

interface VisualizationProps {
  angle: number; // degrees
  colorHex: string;
  didSlide: boolean;
  time: number | null;
  runId: string | null;
}

export function Visualization({ angle, colorHex, didSlide, time, runId }: VisualizationProps) {
  const [animating, setAnimating] = useState(false);
  const [key, setKey] = useState(0);

  useEffect(() => {
    if (runId) {
      setAnimating(true);
      setKey((prev) => prev + 1);
    }
  }, [runId]);

  // Ramp geometry
  // We'll use a fixed hypotenuse length for the visual to ensure it always fits beautifully.
  const R = 240; 
  const angleRad = (angle * Math.PI) / 180;
  const W = R * Math.cos(angleRad);
  const H = R * Math.sin(angleRad);

  const boxSize = 28;
  const containerW = 320;
  const containerH = 260;

  // Starting pos of the group
  const startX = 20;
  const startY = containerH - 10 - H; // 10px padding from bottom

  // Define animation
  let animationProps = {};
  if (animating) {
    if (didSlide && time) {
      animationProps = {
        x: [0, R - boxSize],
        transition: { duration: time, ease: "easeIn" }
      };
    } else {
      // Jiggle if it fails to slide
      animationProps = {
        x: [0, 3, -3, 3, 0],
        transition: { duration: 0.4, ease: "easeInOut" }
      };
    }
  } else {
    // Initial state
    animationProps = { x: 0, transition: { duration: 0 }};
  }

  return (
    <div className="w-full bg-slate-100 rounded-xl border border-slate-200 overflow-hidden flex items-center justify-center p-4">
      <svg width={containerW} height={containerH} viewBox={`0 0 ${containerW} ${containerH}`} className="drop-shadow-sm">
        
        {/* Background Ground Line */}
        <line x1="0" y1={containerH - 10} x2={containerW} y2={containerH - 10} stroke="#cbd5e1" strokeWidth="4" />
        
        {/* Ramp Body */}
        <polygon 
          points={`${startX},${startY} ${startX + W},${containerH - 10} ${startX},${containerH - 10}`} 
          fill="#e2e8f0" 
          stroke="#94a3b8" 
          strokeWidth="2"
        />

        {/* Angle Text Indicator */}
        <text x={startX + W - 30} y={containerH - 15} fontSize="12" fill="#64748b" className="font-mono">
          {angle}°
        </text>

        {/* Moving Block Group */}
        <g transform={`translate(${startX}, ${startY}) rotate(${angle})`}>
          {/* Surface line just for reference or slightly overlapping the box */}
          
          <motion.rect
            key={key}
            y={-boxSize} // resting on the x axis
            width={boxSize}
            height={boxSize}
            fill={colorHex}
            stroke="#1e293b"
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

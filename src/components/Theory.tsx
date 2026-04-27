import { useState } from "react";
import { BookOpen, ChevronDown, ChevronUp } from "lucide-react";

export function Theory() {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden text-sm dark:bg-slate-900 dark:border-slate-800">
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-slate-50 transition-colors dark:hover:bg-slate-800"
      >
        <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-100">
          <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span>Physics Theory Reference</span>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-slate-500 dark:text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-500 dark:text-slate-400" />}
      </button>

      {open && (
        <div className="p-4 border-t border-slate-100 bg-slate-50 text-slate-700 space-y-4 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
          <div>
            <h4 className="font-semibold text-slate-900 mb-1 dark:text-slate-100">1. Kinematics of Constant Acceleration</h4>
            <p>
              When an object slides from rest (<span className="font-mono">v₀ = 0</span>), the distance traveled <span className="font-mono">d</span> is related to acceleration <span className="font-mono">a</span> and time <span className="font-mono">t</span> by:
            </p>
            <div className="bg-white p-2 rounded border border-slate-200 my-2 text-center font-mono dark:bg-slate-900 dark:border-slate-800 dark:text-slate-200">
              d = ½ a t²  ⇒  a = 2d / t²
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-1 dark:text-slate-100">2. Newton's Second Law & Friction</h4>
            <p>
              The forces acting along the ramp direction are gravity (pulling down) and kinetic friction (resisting motion).
              The net force is <span className="font-mono">F_net = m·a</span>.
            </p>
            <ul className="list-disc pl-5 mt-1 space-y-1">
              <li>Gravity component along ramp: <span className="font-mono">F_g = mg sin(θ)</span></li>
              <li>Normal force: <span className="font-mono">N = mg cos(θ)</span></li>
              <li>Kinetic friction: <span className="font-mono">f_k = μ_k N = μ_k mg cos(θ)</span></li>
            </ul>
            <div className="bg-white p-2 rounded border border-slate-200 my-2 text-center font-mono dark:bg-slate-900 dark:border-slate-800 dark:text-slate-200">
              mg sin(θ) - μ_k mg cos(θ) = ma
            </div>
            <p>Notice that mass (<span className="font-mono">m</span>) appears in every term and therefore cancels out! Mass does not affect the acceleration of the sliding object.</p>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-1 dark:text-slate-100">3. Solving for the Coefficient (μ_k)</h4>
            <p>By dividing the Newton equation by mass and isolating <span className="font-mono">μ_k</span>, we obtain:</p>
            <div className="bg-white p-2 text-center font-mono rounded border border-slate-200 mt-2 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-200">
              μ_k = (g·sin(θ) - a) / (g·cos(θ))
            </div>
            <p className="text-xs text-slate-500 mt-2 dark:text-slate-400">* Use standard gravity g = 9.81 m/s².</p>
          </div>
        </div>
      )}
    </div>
  );
}

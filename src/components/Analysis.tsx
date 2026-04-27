import { useState, useEffect } from "react";
import { RunResult } from "../types";
import { Calculator } from "lucide-react";

interface AnalysisProps {
  latestResult: RunResult | null;
}

export function Analysis({ latestResult }: AnalysisProps) {
  const [guess, setGuess] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [status, setStatus] = useState<"idle" | "error" | "success">("idle");
  const [feedback, setFeedback] = useState("");
  const [showSolution, setShowSolution] = useState(false);

  // Reset state when new result comes in
  useEffect(() => {
    setGuess("");
    setAttempts(0);
    setStatus("idle");
    setFeedback("");
    setShowSolution(false);
  }, [latestResult?.id]);

  if (!latestResult) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 text-center text-slate-500 py-8 h-full flex items-center justify-center min-h-[200px]">
        Run an experiment to unlock the analysis module.
      </div>
    );
  }

  if (!latestResult.didSlide || latestResult.calculatedMuk === null || latestResult.time === null) {
    return (
      <div className="bg-orange-50 rounded-xl border border-orange-200 p-4 h-full flex flex-col justify-center min-h-[200px]">
        <h3 className="font-bold text-orange-800 flex items-center gap-2 mb-2">
          <Calculator className="w-5 h-5" />
          Analysis module unavailable
        </h3>
        <p className="text-sm text-orange-700">
          The object did not slide! To determine the kinetic friction coefficient, you must collect data from a successful slide. 
          Try increasing the ramp angle or changing materials.
        </p>
      </div>
    );
  }

  const handleCheck = () => {
    const val = parseFloat(guess);
    if (isNaN(val)) {
      setStatus("error");
      setFeedback("Please enter a valid number.");
      return;
    }

    const currentAttempts = attempts + 1;
    setAttempts(currentAttempts);

    // Give a generous tolerance to account for rounding errors.
    const tolerance = 0.05; 
    const diff = Math.abs(val - latestResult.calculatedMuk!);

    if (diff <= tolerance) {
      setStatus("success");
      setFeedback("Correct! You accurately determined the kinetic friction coefficient based on the experimental data.");
      setShowSolution(true); // Show them their awesome work
    } else {
      setStatus("error");
      if (currentAttempts === 1) {
        setFeedback("Not quite out! Remember to first calculate acceleration using d = ½at². Note that mass is a distractor and isn't needed.");
      } else if (currentAttempts === 2) {
        setFeedback("Still a bit off. Use g=9.81 m/s² and double check your trigonometric functions (make sure your calculator is in DEGREES!).");
      } else {
        setFeedback("Let's review the complete solution together to see how it's done.");
        setShowSolution(true);
      }
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full min-h-[200px]">
      <div className="px-4 py-3 border-b border-slate-100 bg-blue-50/50">
         <h3 className="font-bold text-slate-800 flex items-center gap-2">
           <Calculator className="w-4 h-4 text-blue-600" />
           Determine Coefficient (Run #{latestResult.num})
         </h3>
      </div>
      
      <div className="p-4 flex-1 text-sm bg-slate-50/30 overflow-auto">
        {!showSolution ? (
          <div className="space-y-4">
            <p className="text-slate-600">
              Using the data from <strong className="text-slate-800">Run #{latestResult.num}</strong>, calculate the coefficient of kinetic friction (<span className="font-mono">μ_k</span>).
            </p>
            
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Your Calculation for μ_k</label>
              <div className="flex gap-2">
                <input 
                  type="number" step="0.01" placeholder="e.g. 0.25"
                  value={guess}
                  onChange={e => setGuess(e.target.value)}
                  className="flex-1 border border-slate-300 rounded-md p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm transition-shadow outline-none"
                  onKeyDown={e => e.key === 'Enter' && handleCheck()}
                />
                <button 
                  onClick={handleCheck}
                  className="bg-slate-800 text-white px-4 py-2 rounded-md hover:bg-slate-700 font-medium transition-colors whitespace-nowrap shadow-sm"
                >
                  Verify
                </button>
              </div>
            </div>

            {status !== "idle" && (
              <div className={`p-3 rounded-md text-sm border-l-4 ${status === 'error' ? 'bg-red-50 border-red-500 text-red-700' : 'bg-green-50 border-green-500 text-green-800'}`}>
                {feedback}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {status === 'success' && (
              <div className="p-3 bg-green-50 border border-green-200 text-green-800 rounded-md text-sm font-medium text-center">
                Excellent work! Your calculation was correct.
              </div>
            )}
            {status === 'error' && (
              <div className="p-3 bg-slate-100 border border-slate-200 text-slate-700 rounded-md text-sm font-medium text-center">
                Don't worry! Friction equations can be tricky. Here is the step-by-step calculation.
              </div>
            )}

            <div className="bg-white border border-slate-200 rounded-md p-4 space-y-3 font-mono text-[13px] overflow-x-auto shadow-inner text-slate-700 leading-snug">
              <p className="text-blue-600 font-sans font-bold text-sm border-b pb-2">Analysis Steps</p>
              
              <div>
                <span className="text-slate-400 font-sans text-xs uppercase tracking-wider font-semibold">1) Experimental inputs:</span><br/>
                θ = {latestResult.params.angle}°<br/>
                d = {latestResult.params.distance.toFixed(2)} m<br/>
                t = {latestResult.time.toFixed(3)} s
              </div>

              <div>
                <span className="text-slate-400 font-sans text-xs uppercase tracking-wider font-semibold">2) Find acceleration (d = ½at²):</span><br/>
                a = (2 * {latestResult.params.distance.toFixed(2)}) / ({latestResult.time.toFixed(3)})²<br/>
                {(() => {
                  const a = (2 * latestResult.params.distance) / (latestResult.time * latestResult.time);
                  return <span className="font-bold">a ≈ {a.toFixed(3)} m/s²</span>;
                })()}
              </div>

              <div>
                <span className="text-slate-400 font-sans text-xs uppercase tracking-wider font-semibold">3) Newton's equations to isolate μ_k:</span><br/>
                μ_k = (g·sin(θ) - a) / (g·cos(θ))<br/>
                μ_k = (9.81 * sin({latestResult.params.angle}°) - {((2 * latestResult.params.distance) / (latestResult.time * latestResult.time)).toFixed(3)}) / (9.81 * cos({latestResult.params.angle}°))
              </div>

              <div className="pt-2 border-t font-bold text-sm text-green-600">
                μ_k ≈ {latestResult.calculatedMuk.toFixed(3)}
              </div>
              <p className="text-slate-400 text-[10px] font-sans italic mt-1 leading-tight">
                * Note: The true theoretical coefficient for these materials is {latestResult.trueMuk}. 
                Experimental error ({(Math.abs((latestResult.time / (latestResult.time/latestResult.noiseFactor)) - 1) * 100).toFixed(1)}%) was introducted to simulate real-world variance.
              </p>
            </div>
            
            <button 
              onClick={() => {
                setShowSolution(false);
                setStatus("idle");
                setGuess("");
                setAttempts(0);
              }}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium py-2 rounded-md transition-colors"
            >
              Hide Solution and Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

import { useState } from "react";
import { AppState, RunResult } from "./types";
import { calculateExperiment, COLORS } from "./lib/physics";
import { Visualization } from "./components/Visualization";
import { Controls } from "./components/Controls";
import { DataTable } from "./components/DataTable";
import { Theory } from "./components/Theory";
import { Analysis } from "./components/Analysis";
import { FlaskConical } from "lucide-react";

export default function App() {
  const [state, setState] = useState<AppState>({
    objectMat: 'Wood',
    rampMat: 'Steel',
    angle: 30,
    distance: 2.0,
    mass: 5.0,
    colorName: 'Red'
  });

  const [results, setResults] = useState<RunResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const colorHex = COLORS.find(c => c.name === state.colorName)?.hex || '#ef4444';

  const handleRun = () => {
    setIsRunning(true);
    const { didSlide, time, calculatedMuk, noiseFactor, trueMuk } = calculateExperiment(
      state.objectMat,
      state.rampMat,
      state.angle,
      state.distance
    );

    const animationTime = didSlide && time ? Math.min(time, 2) : 0.5;

    const runId = Math.random().toString(36).substring(7);

    const temperature = 20 + Math.floor(Math.random() * 5);
    const pressure = 101.3 + (Math.random() - 0.5);

    const newResult: RunResult = {
      id: runId,
      num: results.length + 1,
      params: { ...state },
      didSlide,
      time,
      calculatedMuk,
      trueMuk,
      noiseFactor,
      temperature,
      pressure
    };

    setTimeout(() => {
      setResults(prev => [...prev, newResult]);
      setIsRunning(false);
    }, animationTime * 1000);
  };

  const latestResult = results.length > 0 ? results[results.length - 1] : null;

  return (
    <div className="font-sans text-slate-800 pb-16 dark:text-slate-200">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20 dark:bg-slate-900 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg dark:bg-blue-500">
              <FlaskConical className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-xl leading-tight dark:text-slate-100">Friction Lab</h1>
              <p className="text-xs text-slate-500 font-medium dark:text-slate-400">The Inclined Plane Experiment</p>
            </div>
          </div>
          <div className="hidden lg:block text-sm text-slate-400 font-mono dark:text-slate-500">
            v1.0.0
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Left Column: Experiment Controls */}
          <div className="lg:col-span-5 space-y-6">
            <section>
              <h2 className="text-lg font-bold mb-3 flex items-center gap-2 dark:text-slate-100">
                1. Setup & Execute
              </h2>
              <Visualization
                angle={state.angle}
                colorHex={colorHex}
                didSlide={latestResult?.didSlide ?? false}
                time={latestResult?.time ?? null}
                runId={!isRunning ? latestResult?.id || null : "animating"}
              />
              <Controls
                state={state}
                setState={setState}
                onRun={handleRun}
                isRunning={isRunning}
              />
            </section>
          </div>

          {/* Right Column: Data & Analysis */}
          <div className="lg:col-span-7 space-y-6">
            <section>
               <h2 className="text-lg font-bold mb-3 dark:text-slate-100">2. Physics Reference</h2>
               <Theory />
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
              <div className="flex flex-col">
                <h2 className="text-lg font-bold mb-3 dark:text-slate-100">3. Collected Data</h2>
                <div className="flex-1">
                  <DataTable results={results} />
                </div>
              </div>

              <div className="flex flex-col">
                <h2 className="text-lg font-bold mb-3 dark:text-slate-100">4. Verify Coefficient</h2>
                <div className="flex-1">
                  <Analysis latestResult={latestResult} />
                </div>
              </div>
            </section>
          </div>

        </div>
      </main>
    </div>
  );
}

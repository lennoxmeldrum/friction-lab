import React from 'react';
import { AppState } from "../types";
import { COLORS, OBJECT_MATERIALS, RAMP_MATERIALS } from "../lib/physics";

interface ControlsProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  onRun: () => void;
  isRunning: boolean;
}

export function Controls({ state, setState, onRun, isRunning }: ControlsProps) {
  const handleChange = (field: keyof AppState, value: any) => {
    setState(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="flex flex-col gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm mt-4 text-sm">
      <div className="grid grid-cols-2 gap-4">
        {/* Object Material */}
        <div>
          <label className="block font-semibold text-slate-700 mb-1">Object Material</label>
          <select 
            value={state.objectMat}
            onChange={e => handleChange('objectMat', e.target.value)}
            className="w-full border-slate-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
            disabled={isRunning}
          >
            {OBJECT_MATERIALS.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>

        {/* Ramp Material */}
        <div>
          <label className="block font-semibold text-slate-700 mb-1">Ramp Material</label>
          <select 
            value={state.rampMat}
            onChange={e => handleChange('rampMat', e.target.value)}
            className="w-full border-slate-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
            disabled={isRunning}
          >
            {RAMP_MATERIALS.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Object Color (Distractor) */}
        <div>
          <label className="block font-semibold text-slate-700 mb-1 flex justify-between">
            <span>Color</span>
            <span className="text-slate-400 font-normal text-xs">(Visual Only)</span>
          </label>
          <select 
            value={state.colorName}
            onChange={e => handleChange('colorName', e.target.value)}
            className="w-full border-slate-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
            disabled={isRunning}
          >
            {COLORS.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
          </select>
        </div>

        {/* Mass (Distractor) */}
        <div>
          <label className="block font-semibold text-slate-700 mb-1 flex justify-between">
            <span>Mass (kg)</span>
            <span className="text-blue-600 w-8 text-right font-mono">{state.mass}</span>
          </label>
          <input 
            type="range" min="0.1" max="20" step="0.1" 
            value={state.mass} 
            onChange={e => handleChange('mass', parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer mt-2" 
            disabled={isRunning}
          />
        </div>
      </div>

      <div className="border-t border-slate-100 pt-3">
        {/* Angle */}
        <div className="mb-4">
          <label className="block font-semibold text-slate-700 mb-1 flex justify-between">
            <span>Ramp Angle (θ)</span>
            <span className="text-blue-600 font-mono">{state.angle}°</span>
          </label>
          <input 
            type="range" min="5" max="80" step="1" 
            value={state.angle} 
            onChange={e => handleChange('angle', parseInt(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer mt-2" 
            disabled={isRunning}
          />
        </div>

        {/* Distance */}
        <div className="mb-4">
          <label className="block font-semibold text-slate-700 mb-1 flex justify-between">
            <span>Sliding Distance (Δx)</span>
            <span className="text-blue-600 font-mono">{state.distance.toFixed(1)} m</span>
          </label>
          <input 
            type="range" min="1" max="10" step="0.5" 
            value={state.distance} 
            onChange={e => handleChange('distance', parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer mt-2" 
            disabled={isRunning}
          />
        </div>
      </div>

      <button 
        onClick={onRun}
        disabled={isRunning}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg shadow transition-colors focus:ring-4 focus:ring-blue-300 disabled:opacity-50 mt-2 flex items-center justify-center gap-2 uppercase tracking-wide"
      >
        Run Experiment
      </button>

      <p className="text-xs text-slate-400 text-center mt-1">Hint: Ensure the angle is steep enough to overcome static friction!</p>
    </div>
  );
}

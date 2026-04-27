import { RunResult } from "../types";

interface DataTableProps {
  results: RunResult[];
}

export function DataTable({ results }: DataTableProps) {
  if (results.length === 0) {
    return (
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-center text-slate-500 italic h-full flex items-center justify-center min-h-[200px]">
        No experimental data collected yet. Configure parameters and run the experiment.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-full max-h-[350px]">
      <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50 rounded-t-xl flex justify-between items-center">
         <h3 className="font-bold text-slate-800">Experimental Data</h3>
         <span className="text-xs px-2 py-1 bg-slate-200 text-slate-600 rounded-full font-medium">{results.length} trials</span>
      </div>
      <div className="overflow-auto flex-1">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-500 bg-slate-50 sticky top-0 uppercase z-10 shadow-sm shadow-slate-100">
            <tr>
              <th className="px-3 py-2 font-semibold">Run</th>
              <th className="px-3 py-2 font-semibold">θ (°)</th>
              <th className="px-3 py-2 font-semibold">Dist (m)</th>
              <th className="px-3 py-2 font-semibold">Mass (kg)</th>
              <th className="px-3 py-2 font-semibold">Time (s)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {/* Show newest first */}
            {[...results].reverse().map((run) => (
              <tr key={run.id} className="hover:bg-blue-50/50 transition-colors group">
                <td className="px-3 py-2 font-mono text-slate-600">#{run.num}</td>
                <td className="px-3 py-2">{run.params.angle}°</td>
                <td className="px-3 py-2">{run.params.distance.toFixed(1)}</td>
                <td className="px-3 py-2">{run.params.mass.toFixed(1)}</td>
                <td className="px-3 py-2 font-mono font-medium text-slate-900">
                  {run.time !== null ? run.time.toFixed(3) : <span className="text-red-500 text-xs">NO SLIDE</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import React from 'react';
import type { Point, UnitSystem } from '../types';
import { convertFromFeet } from '../types';

interface NodeTableProps {
  nodes: Point[];
  unit: UnitSystem;
}

export const NodeTable: React.FC<NodeTableProps> = ({ nodes, unit }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-3">
      <div className="text-xs font-semibold text-slate-300 mb-2 flex items-center justify-between">
        <span>Node Schedule ({unit.toUpperCase()})</span>
        <span className="text-[10px] font-mono text-slate-500">{nodes.length} Vertices</span>
      </div>
      <div className="max-h-36 overflow-y-auto border border-slate-800 rounded bg-slate-950">
        <table className="w-full text-left font-mono text-xs">
          <thead className="bg-slate-900/80 text-slate-400 sticky top-0">
            <tr>
              <th className="p-1.5 border-b border-slate-800">Node</th>
              <th className="p-1.5 border-b border-slate-800">X ({unit})</th>
              <th className="p-1.5 border-b border-slate-800">Y ({unit})</th>
              <th className="p-1.5 border-b border-slate-800 text-right">Length</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50 text-slate-300">
            {nodes.map((node, idx) => {
              const prev = idx > 0 ? nodes[idx - 1] : null;
              const lenFt = prev ? Math.hypot(node.x - prev.x, node.y - prev.y) : 0;
              
              const xVal = convertFromFeet(node.x, unit).toFixed(unit === 'm' ? 1 : 0);
              const yVal = convertFromFeet(node.y, unit).toFixed(unit === 'm' ? 1 : 0);
              const lenVal = convertFromFeet(lenFt, unit).toFixed(unit === 'm' ? 1 : 0);

              return (
                <tr key={idx} className="hover:bg-slate-900/50">
                  <td className="p-1.5 font-bold text-cyan-400">N{idx + 1}</td>
                  <td className="p-1.5">{xVal}</td>
                  <td className="p-1.5">{yVal}</td>
                  <td className="p-1.5 text-right text-amber-400">{lenFt > 0 ? `${lenVal} ${unit}` : '-'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
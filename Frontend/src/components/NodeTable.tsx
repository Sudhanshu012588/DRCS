import React from 'react';
import type { Point, UnitSystem } from '../types';
import { convertFromFeet } from '../types';

interface NodeTableProps {
  nodes: Point[];
  unit: UnitSystem;
}

export const NodeTable: React.FC<NodeTableProps> = ({ nodes, unit }) => {
  return (
    <div className="bg-[#0B0F19] border border-slate-800 rounded-2xl p-3 shadow-sm font-mono flex flex-col flex-1 min-h-0">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2 flex-shrink-0">
        <span className="text-xs font-bold text-slate-200 tracking-wider uppercase">
          Node Schedule ({unit.toUpperCase()})
        </span>
        <span className="text-[10px] bg-slate-800 text-cyan-400 font-bold px-2 py-0.5 rounded-md border border-slate-700">
          {nodes.length} Vertices
        </span>
      </div>

      <div className="overflow-y-auto flex-1 pr-1 custom-scrollbar">
        <table className="w-full text-left text-xs">
          <thead className="sticky top-0 bg-[#0B0F19] border-b border-slate-800">
            <tr className="text-slate-400 text-[10px] uppercase">
              <th className="pb-1 font-bold">Node</th>
              <th className="pb-1 font-bold">X ({unit})</th>
              <th className="pb-1 font-bold">Y ({unit})</th>
              <th className="pb-1 font-bold text-right">Length</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {nodes.map((node, idx) => {
              const xUnit = convertFromFeet(node.x, unit).toFixed(unit === 'm' ? 1 : 0);
              const yUnit = convertFromFeet(node.y, unit).toFixed(unit === 'm' ? 1 : 0);

              let lengthStr = '-';
              if (idx > 0) {
                const prev = nodes[idx - 1];
                const distFt = Math.hypot(node.x - prev.x, node.y - prev.y);
                lengthStr = `${convertFromFeet(distFt, unit).toFixed(unit === 'm' ? 1 : 0)} ${unit}`;
              }

              return (
                <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-1.5 font-bold text-cyan-400">N{idx + 1}</td>
                  <td className="py-1.5 text-slate-200">{xUnit}</td>
                  <td className="py-1.5 text-slate-200">{yUnit}</td>
                  <td className="py-1.5 text-right font-bold text-amber-400">{lengthStr}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
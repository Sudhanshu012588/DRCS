import React, { useState, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import type { Point, UnitSystem } from '../types';
import { convertToFeet, convertFromFeet } from '../types';
import { MetricsPanel } from '../components/MetricsPanel';
import { DrawingControls } from '../components/DrawingControls';
import { PlotCanvas } from '../components/PlotCanvas';
import { NodeTable } from '../components/NodeTable';
import { BhkSelector } from '../components/BhkSelector';
import { FloorPlanViewer } from '../components/FloorPlanViewer';
import { Toast, type ToastMessage } from '../components/Toast';
import { sendOuterCoordinates, type BasePlanPayload } from '../services/api';
import type { FloorPlanResponse } from '../types/FloorPlan';
import { Send, Loader2, Layers } from 'lucide-react';

export const PlannerPage: React.FC = () => {
  const { userId: urlUserId } = useParams<{ userId?: string }>();

  const [unit, setUnit] = useState<UnitSystem>('ft');
  const [gridDomainInput, setGridDomainInput] = useState<string>('60');
  
  const [history, setHistory] = useState<Point[][]>([[{ x: 0, y: 0 }]]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);
  const [isClosed, setIsClosed] = useState<boolean>(false);

  const [userId, setUserId] = useState<string>(urlUserId || 'usr_101');
  const [bhk, setBhk] = useState<number>(3);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [floorPlanData, setFloorPlanData] = useState<FloorPlanResponse | null>(null);

  useEffect(() => {
    if (urlUserId) {
      setUserId(urlUserId);
    }
  }, [urlUserId]);

  const nodes = history[historyIndex] || [{ x: 0, y: 0 }];

  const gridDomainInUnit = useMemo(() => {
    const val = parseFloat(gridDomainInput);
    return isNaN(val) || val <= 0 ? 60 : val;
  }, [gridDomainInput]);

  const gridDomainFt = useMemo(() => {
    return convertToFeet(gridDomainInUnit, unit);
  }, [gridDomainInUnit, unit]);

  const handleUnitChange = (newUnit: UnitSystem) => {
    if (newUnit === unit) return;
    const currentValInFt = convertToFeet(gridDomainInUnit, unit);
    const newValInUnit = convertFromFeet(currentValInFt, newUnit);
    setGridDomainInput(Math.round(newValInUnit).toString());
    setUnit(newUnit);
  };

  const areaSqFt = useMemo(() => {
    if (nodes.length < 3) return 0;
    let area = 0;
    for (let i = 0; i < nodes.length; i++) {
      const j = (i + 1) % nodes.length;
      area += nodes[i].x * nodes[j].y;
      area -= nodes[j].x * nodes[i].y;
    }
    return Math.abs(Math.round(area / 2));
  }, [nodes]);

  const perimeterFt = useMemo(() => {
    if (nodes.length < 2) return 0;
    let total = 0;
    for (let i = 0; i < nodes.length - 1; i++) {
      total += Math.hypot(nodes[i + 1].x - nodes[i].x, nodes[i + 1].y - nodes[i].y);
    }
    return Math.round(total);
  }, [nodes]);

  const pushNewNodes = (newNodes: Point[], closed = false) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newNodes);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    if (closed) setIsClosed(true);
  };

  const handleCanvasClickNode = (p: Point) => {
    if (isClosed) return;
    if (nodes.length > 2 && p.x === 0 && p.y === 0) {
      pushNewNodes([...nodes, { x: 0, y: 0 }], true);
      return;
    }
    pushNewNodes([...nodes, p]);
  };

  const handleCloseLoop = () => {
    if (nodes.length < 3 || isClosed) return;
    pushNewNodes([...nodes, { x: 0, y: 0 }], true);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setIsClosed(false);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
    }
  };

  const handleClear = () => {
    setHistory([[{ x: 0, y: 0 }]]);
    setHistoryIndex(0);
    setIsClosed(false);
    setFloorPlanData(null);
  };

  const handleSendToBackend = async () => {
    try {
      setIsSubmitting(true);
      setToast(null);

      const formattedCoordinates: number[][] = nodes.map(n => [
        parseFloat(convertFromFeet(n.x, unit).toFixed(2)),
        parseFloat(convertFromFeet(n.y, unit).toFixed(2))
      ]);

      const payload: BasePlanPayload = {
        userId: userId,
        Outer_Coodinates: formattedCoordinates,
        BHK: bhk
      };

      const res: FloorPlanResponse = await sendOuterCoordinates(payload);
      setFloorPlanData(res);

      setToast({
        id: Date.now().toString(),
        type: 'success',
        title: 'Floor Plan Generated',
        detail: `Floor plan generated successfully.`
      });
    } catch (err: any) {
      setToast({
        id: Date.now().toString(),
        type: 'error',
        title: 'API Error Response',
        detail: err.message || 'An unexpected error occurred.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] bg-slate-50 text-slate-900 p-3 font-sans overflow-hidden">
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* 3-Column Balanced Workspace Grid */}
      <div className="h-full grid grid-cols-1 lg:grid-cols-12 gap-3 min-h-0">
        
        {/* LEFT COLUMN: Metrics, Units, Grid Extent, Node Schedule */}
        <div className="lg:col-span-3 flex flex-col gap-2.5 h-full min-h-0">
          <MetricsPanel
            areaSqFt={areaSqFt}
            perimeterFt={perimeterFt}
            isClosed={isClosed}
            nodeCount={nodes.length}
            unit={unit}
          />

          <DrawingControls
            gridDomainInput={gridDomainInput}
            setGridDomainInput={setGridDomainInput}
            unit={unit}
            setUnit={handleUnitChange}
          />

          <NodeTable nodes={nodes} unit={unit} />
        </div>

        {/* CENTER COLUMN: Hero AutoCAD CAD Viewport */}
        <div className="lg:col-span-6 flex flex-col h-full min-h-0">
          <PlotCanvas
            gridDomainFt={gridDomainFt}
            gridDomainInUnit={gridDomainInUnit}
            nodes={nodes}
            onCanvasClickNode={handleCanvasClickNode}
            isClosed={isClosed}
            unit={unit}
            onUndo={handleUndo}
            onRedo={handleRedo}
            canUndo={historyIndex > 0}
            canRedo={historyIndex < history.length - 1}
            onCloseLoop={handleCloseLoop}
            onClear={handleClear}
          />
        </div>

        {/* RIGHT COLUMN: Room Configuration (BHK) & Generated Floor Plan Viewer */}
        <div className="lg:col-span-3 flex flex-col gap-3 h-full min-h-0 overflow-y-auto pr-0.5">
          <div className="bg-white border border-slate-200/80 p-3.5 rounded-2xl shadow-sm space-y-4 flex-shrink-0">
            <BhkSelector bhk={bhk} setBhk={setBhk} />

            <button
              onClick={handleSendToBackend}
              disabled={!isClosed || isSubmitting}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-bold rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm"
            >
              {isSubmitting ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
              Generate Floor Plan
            </button>
          </div>

          {/* Generated Floor Plan Display */}
          {floorPlanData ? (
            <div className="flex-1 min-h-0">
              <FloorPlanViewer data={floorPlanData} />
            </div>
          ) : (
            <div className="flex-1 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-6 text-center text-slate-400 bg-white/50">
              <Layers size={28} className="mb-2 text-slate-300" />
              <span className="text-xs font-semibold text-slate-600">No Floor Plan Generated</span>
              <p className="text-[10px] text-slate-400 mt-1 max-w-[180px]">
                Close your boundary on the CAD canvas and click Generate Floor Plan.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
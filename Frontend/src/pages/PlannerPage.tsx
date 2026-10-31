import React, { useState, useMemo } from 'react';
import type { Direction, Point, PlotPreset, UnitSystem } from '../types';
import { convertToFeet, convertFromFeet } from '../types';
import { MetricsPanel } from '../components/MetricsPanel';
import { DrawingControls } from '../components/DrawingControls';
import { PlotCanvas } from '../components/PlotCanvas';
import { NodeTable } from '../components/NodeTable';
import { PresetToolbar } from '../components/PresetToolbar';
import { BhkSelector } from '../components/BhkSelector';
import { FloorPlanViewer } from '../components/FloorPlanViewer';
import { Toast, type ToastMessage } from '../components/Toast';
import { sendOuterCoordinates, type BasePlanPayload } from '../services/api';
import type { FloorPlanResponse } from '../types/FloorPlan';
import { Send, Loader2, User } from 'lucide-react';

export const PlannerPage: React.FC = () => {
  const [unit, setUnit] = useState<UnitSystem>('ft');
  const [gridDomainInput, setGridDomainInput] = useState<string>('60');
  const [nodes, setNodes] = useState<Point[]>([{ x: 0, y: 0 }]);
  const [selectedDir, setSelectedDir] = useState<Direction>('RIGHT');
  const [stepLengthInput, setStepLengthInput] = useState<string>('30');
  const [isClosed, setIsClosed] = useState<boolean>(false);

  // User & BHK Input state
  const [userId, setUserId] = useState<string>('usr_101');
  const [bhk, setBhk] = useState<number>(3);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // State to store backend generated floor plan
  const [floorPlanData, setFloorPlanData] = useState<FloorPlanResponse | null>(null);

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

  const handleAddSegment = () => {
    if (isClosed || !stepLengthInput) return;
    const val = parseFloat(stepLengthInput);
    if (isNaN(val) || val <= 0) return;

    const stepInFt = convertToFeet(val, unit);
    const last = nodes[nodes.length - 1];
    let nextX = last.x;
    let nextY = last.y;

    if (selectedDir === 'UP') nextY += stepInFt;
    if (selectedDir === 'DOWN') nextY -= stepInFt;
    if (selectedDir === 'RIGHT') nextX += stepInFt;
    if (selectedDir === 'LEFT') nextX -= stepInFt;

    nextX = Math.max(0, Math.min(gridDomainFt, nextX));
    nextY = Math.max(0, Math.min(gridDomainFt, nextY));

    if (nodes.length > 2 && nextX === 0 && nextY === 0) {
      setIsClosed(true);
    }

    setNodes(prev => [...prev, { x: nextX, y: nextY }]);
  };

  const handleCanvasClickNode = (p: Point) => {
    if (isClosed) return;
    if (nodes.length > 2 && p.x === 0 && p.y === 0) {
      setNodes(prev => [...prev, { x: 0, y: 0 }]);
      setIsClosed(true);
      return;
    }
    setNodes(prev => [...prev, p]);
  };

  const handleCloseLoop = () => {
    if (nodes.length < 3) return;
    setNodes(prev => [...prev, { x: 0, y: 0 }]);
    setIsClosed(true);
  };

  const handleUndo = () => {
    if (nodes.length <= 1) return;
    setNodes(prev => prev.slice(0, -1));
    setIsClosed(false);
  };

  const handleClear = () => {
    setNodes([{ x: 0, y: 0 }]);
    setIsClosed(false);
    setFloorPlanData(null);
  };

  const handleLoadPreset = (preset: PlotPreset) => {
    const domainInActiveUnit = convertFromFeet(preset.gridSize, unit);
    setGridDomainInput(Math.round(domainInActiveUnit).toString());
    setNodes(preset.nodes);
    setIsClosed(true);
    setFloorPlanData(null);
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ unit, gridDomainInUnit, nodes, areaSqFt, perimeterFt }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "plot_boundary_model.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
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

      // Save backend response to render FloorPlanViewer
      setFloorPlanData(res);

      setToast({
        id: Date.now().toString(),
        type: 'success',
        title: 'Floor Plan Generated',
        detail: `Floor plan for ${res.userId || userId} successfully created.`
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
    <div className="p-4 max-w-7xl mx-auto relative">
      <Toast toast={toast} onClose={() => setToast(null)} />

      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
        <div>
          <h1 className="text-lg font-bold text-slate-100 tracking-tight flex items-center gap-2">
            <span className="bg-cyan-500 text-slate-950 text-xs px-2 py-0.5 rounded font-mono font-black">BIM</span>
            Parametric Plot Boundary Generator
          </h1>
          <p className="text-xs text-slate-400">Step 1: Define plot coordinate boundaries and BHK requirements.</p>
        </div>
      </div>

      <PresetToolbar
        onLoadPreset={handleLoadPreset}
        onExportJSON={handleExportJSON}
        isClosed={isClosed}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div>
            <MetricsPanel
              areaSqFt={areaSqFt}
              perimeterFt={perimeterFt}
              isClosed={isClosed}
              nodeCount={nodes.length}
              unit={unit}
            />

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg mb-4 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-1.5">
                  <User size={14} className="text-cyan-400" /> User Identifier
                </label>
                <input
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-400"
                  placeholder="Enter user ID"
                />
              </div>

              <BhkSelector bhk={bhk} setBhk={setBhk} />

              <button
                onClick={handleSendToBackend}
                disabled={!isClosed || isSubmitting}
                className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 font-bold rounded text-xs flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-cyan-500/10"
              >
                {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                Generate Floor Plan via Backend
              </button>
            </div>

            <DrawingControls
              gridDomainInput={gridDomainInput}
              setGridDomainInput={setGridDomainInput}
              selectedDir={selectedDir}
              setSelectedDir={setSelectedDir}
              stepLengthInput={stepLengthInput}
              setStepLengthInput={setStepLengthInput}
              unit={unit}
              setUnit={handleUnitChange}
              onAddSegment={handleAddSegment}
              onCloseLoop={handleCloseLoop}
              onUndo={handleUndo}
              onClear={handleClear}
              isClosed={isClosed}
              nodesLength={nodes.length}
            />
          </div>

          <div className="mt-4">
            <NodeTable nodes={nodes} unit={unit} />
          </div>
        </div>

        {/* Right Viewport Panel: Displays Plot Boundary or Generated Floor Plan */}
        <div className="lg:col-span-7 space-y-6">
          <PlotCanvas
            gridDomainFt={gridDomainFt}
            gridDomainInUnit={gridDomainInUnit}
            nodes={nodes}
            onCanvasClickNode={handleCanvasClickNode}
            isClosed={isClosed}
            unit={unit}
          />

          {/* Render FloorPlanViewer when data is returned from backend */}
          {floorPlanData && <FloorPlanViewer data={floorPlanData} />}
        </div>
      </div>
    </div>
  );
};
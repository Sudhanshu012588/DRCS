export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export interface Point {
  x: number;
  y: number;
}

export interface NodePoint extends Point {
  id: string;
}

export interface Segment {
  start: Point;
  end: Point;
  length: number;
  direction: Direction;
}

export interface PlotPreset {
  name: string;
  gridSize: number;
  nodes: Point[];
}

export const PRESETS: PlotPreset[] = [
  {
    name: '30 × 50 ft Standard',
    gridSize: 60,
    nodes: [
      { x: 0, y: 0 },
      { x: 30, y: 0 },
      { x: 30, y: 50 },
      { x: 0, y: 50 },
      { x: 0, y: 0 }
    ]
  },
  {
    name: '40 × 60 ft Villa',
    gridSize: 80,
    nodes: [
      { x: 0, y: 0 },
      { x: 40, y: 0 },
      { x: 40, y: 60 },
      { x: 0, y: 60 },
      { x: 0, y: 0 }
    ]
  },
  {
    name: '35 × 50 ft L-Shape',
    gridSize: 60,
    nodes: [
      { x: 0, y: 0 },
      { x: 35, y: 0 },
      { x: 35, y: 30 },
      { x: 20, y: 30 },
      { x: 20, y: 50 },
      { x: 0, y: 50 },
      { x: 0, y: 0 }
    ]
  }
];

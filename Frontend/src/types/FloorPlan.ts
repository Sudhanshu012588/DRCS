export interface Room {
  name: string;
  type: 'living_room' | 'dining' | 'kitchen' | 'bathroom' | 'circulation' | 'bedroom' | string;
  corners: number[][]; // Coordinates as [[x1, y1], [x2, y2], ...]
}

export interface FloorPlanData {
  plot_coordinates: number[][];
  rooms: Room[];
}

export interface FloorPlanResponse {
  status: string;
  userId: string;
  floor_plan: FloorPlanData;
}

// Room Color Themes
export const ROOM_STYLES: Record<string, { fill: string; stroke: string; badgeBg: string; textColor: string }> = {
  living_room: {
    fill: 'rgba(6, 182, 212, 0.18)',
    stroke: '#06B6D4',
    badgeBg: '#083344',
    textColor: '#22D3EE',
  },
  dining: {
    fill: 'rgba(16, 185, 129, 0.18)',
    stroke: '#10B981',
    badgeBg: '#064E3B',
    textColor: '#34D399',
  },
  kitchen: {
    fill: 'rgba(245, 158, 11, 0.18)',
    stroke: '#F59E0B',
    badgeBg: '#451A03',
    textColor: '#FBBF24',
  },
  bedroom: {
    fill: 'rgba(99, 102, 241, 0.18)',
    stroke: '#6366F1',
    badgeBg: '#1E1B4B',
    textColor: '#818CF8',
  },
  bathroom: {
    fill: 'rgba(244, 63, 94, 0.18)',
    stroke: '#F43F5E',
    badgeBg: '#4C0519',
    textColor: '#FB7185',
  },
  circulation: {
    fill: 'rgba(148, 163, 184, 0.12)',
    stroke: '#64748B',
    badgeBg: '#0F172A',
    textColor: '#94A3B8',
  },
  default: {
    fill: 'rgba(100, 116, 139, 0.15)',
    stroke: '#94A3B8',
    badgeBg: '#1E293B',
    textColor: '#CBD5E1',
  },
};

export interface Room {
  name: string;
  type: 'living_room' | 'dining' | 'kitchen' | 'bathroom' | 'circulation' | 'bedroom' | string;
  corners: number[][];
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

// Editorial Black & White Room Palette
export const ROOM_STYLES: Record<string, { fill: string; stroke: string; badgeBg: string; textColor: string }> = {
  living_room: {
    fill: 'rgba(255, 255, 255, 0.12)',
    stroke: '#FFFFFF',
    badgeBg: '#171717',
    textColor: '#FFFFFF',
  },
  bedroom: {
    fill: 'rgba(255, 255, 255, 0.08)',
    stroke: '#E5E5E5',
    badgeBg: '#171717',
    textColor: '#E5E5E5',
  },
  kitchen: {
    fill: 'rgba(255, 255, 255, 0.15)',
    stroke: '#FFFFFF',
    badgeBg: '#262626',
    textColor: '#FFFFFF',
  },
  dining: {
    fill: 'rgba(255, 255, 255, 0.06)',
    stroke: '#D4D4D4',
    badgeBg: '#171717',
    textColor: '#D4D4D4',
  },
  bathroom: {
    fill: 'rgba(255, 255, 255, 0.04)',
    stroke: '#A3A3A3',
    badgeBg: '#0A0A0A',
    textColor: '#A3A3A3',
  },
  circulation: {
    fill: 'rgba(255, 255, 255, 0.02)',
    stroke: '#525252',
    badgeBg: '#0A0A0A',
    textColor: '#737373',
  },
  default: {
    fill: 'rgba(255, 255, 255, 0.05)',
    stroke: '#A3A3A3',
    badgeBg: '#171717',
    textColor: '#D4D4D4',
  },
};
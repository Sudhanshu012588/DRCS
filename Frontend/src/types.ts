export type UnitSystem = 'ft' | 'm';

export interface Point {
  x: number; // Native internal storage in Feet
  y: number;
}

export interface NodePoint extends Point {
  id: string;
}

// Unit conversion helpers
export const convertFromFeet = (valInFt: number, unit: UnitSystem): number => {
  return unit === 'm' ? valInFt * 0.3048 : valInFt;
};

export const convertToFeet = (val: number, unit: UnitSystem): number => {
  return unit === 'm' ? val / 0.3048 : val;
};
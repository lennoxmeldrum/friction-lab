export interface AppState {
  objectMat: import('./lib/physics').ObjectMaterial;
  rampMat: import('./lib/physics').RampMaterial;
  angle: number;
  distance: number;
  mass: number;
  colorName: string;
}

export interface RunResult {
  id: string;
  num: number;
  params: AppState;
  didSlide: boolean;
  time: number | null;
  calculatedMuk: number | null;
  trueMuk: number;
  noiseFactor: number;
  temperature: number; // distractor
  pressure: number;    // distractor
}

export const OBJECT_MATERIALS = ['Wood', 'Steel', 'Rubber', 'Ice'] as const;
export const RAMP_MATERIALS = ['Wood', 'Steel', 'Concrete', 'Ice'] as const;

export type ObjectMaterial = typeof OBJECT_MATERIALS[number];
export type RampMaterial = typeof RAMP_MATERIALS[number];

export const FRICTION_COEFFICIENTS: Record<ObjectMaterial, Record<RampMaterial, { mus: number, muk: number }>> = {
  Wood: {
    Wood: { mus: 0.45, muk: 0.30 },
    Steel: { mus: 0.30, muk: 0.20 },
    Concrete: { mus: 0.65, muk: 0.50 },
    Ice: { mus: 0.10, muk: 0.05 },
  },
  Steel: {
    Wood: { mus: 0.30, muk: 0.20 },
    Steel: { mus: 0.60, muk: 0.45 },
    Concrete: { mus: 0.55, muk: 0.45 },
    Ice: { mus: 0.05, muk: 0.02 },
  },
  Rubber: {
    Wood: { mus: 0.80, muk: 0.65 },
    Steel: { mus: 0.90, muk: 0.70 },
    Concrete: { mus: 1.00, muk: 0.85 },
    Ice: { mus: 0.20, muk: 0.15 },
  },
  Ice: {
    Wood: { mus: 0.10, muk: 0.05 },
    Steel: { mus: 0.05, muk: 0.02 },
    Concrete: { mus: 0.10, muk: 0.05 },
    Ice: { mus: 0.05, muk: 0.02 },
  }
};

export const COLORS = [
  { name: 'Red', hex: '#ef4444' },
  { name: 'Blue', hex: '#3b82f6' },
  { name: 'Green', hex: '#22c55e' },
  { name: 'Yellow', hex: '#eab308' },
  { name: 'Purple', hex: '#a855f7' },
];

export const G = 9.81;

export function calculateExperiment(
  objectMat: ObjectMaterial,
  rampMat: RampMaterial,
  angleDeg: number,
  distance: number
) {
  const angleRad = (angleDeg * Math.PI) / 180;
  const { mus, muk } = FRICTION_COEFFICIENTS[objectMat][rampMat];

  // Check if it slides
  // mg sin(theta) > mus * mg * cos(theta) => tan(theta) > mus
  const forceDown = Math.sin(angleRad);
  const maxFriction = mus * Math.cos(angleRad);
  
  const didSlide = forceDown > maxFriction;
  
  if (!didSlide) {
    return { didSlide: false, time: null, calculatedMuk: null, noiseFactor: 0, trueMuk: muk };
  }

  // Calculate generic acceleration
  // a = g * (sin(theta) - muk * cos(theta))
  const a = G * (Math.sin(angleRad) - muk * Math.cos(angleRad));
  
  // If muk is very high and angle is such that forceDown > maxStaticFriction, 
  // but somehow dynamic friction is higher than downhill force (rare but possible conceptually if mus < muk which shouldn't happen)
  if (a <= 0) {
     return { didSlide: false, time: null, calculatedMuk: null, noiseFactor: 0, trueMuk: muk };
  }

  // d = 0.5 * a * t^2  => t = sqrt(2d / a)
  const trueTime = Math.sqrt((2 * distance) / a);
  
  // Add small experimental noise (± 2%)
  const noiseFactor = 1 + (Math.random() - 0.5) * 0.04;
  const noisyTime = trueTime * noiseFactor;

  // Calculate what muk *would be* from the noisy time
  const aExp = (2 * distance) / (noisyTime * noisyTime);
  const calculatedMuk = (Math.sin(angleRad) - (aExp / G)) / Math.cos(angleRad);

  return { didSlide: true, time: noisyTime, calculatedMuk, noiseFactor, trueMuk: muk };
}

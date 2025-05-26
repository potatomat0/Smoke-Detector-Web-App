
export interface BoundingBox {
  x1: number; // percentage (0.0 to 1.0)
  y1: number;
  x2: number;
  y2: number;
}

export enum DetectionType {
  SMOKE = 'smoke',
  FIRE = 'fire',
}

export interface Detection {
  type: DetectionType;
  description: string;
  boundingBox: BoundingBox;
}

export interface GeminiDetectionResponse {
  detections: Detection[];
}

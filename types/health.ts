export type HealthGrade = "A" | "B" | "C" | "D" | "E";

export interface HealthBreakdown {
  engine: number;
  electrical: number;
  brakes: number;
  fuel: number;
}

export interface HealthFactor {
  parameter: string;
  impact: number;
  status: string;
}

export interface HealthIndex {
  score: number;
  grade: HealthGrade;
  breakdown: HealthBreakdown;
  topFactors: HealthFactor[];
}

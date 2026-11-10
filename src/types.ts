export type AspirationCategory =
  | "Wealth"
  | "Fame"
  | "Image"
  | "Personal growth"
  | "Relationships"
  | "Community"
  | "Health";

export interface AspirationGoal {
  id: number; // 1 to 35
  category: AspirationCategory;
  text: string;
}

export interface GoalRatings {
  importance: number; // 1 to 7
  likelihood: number; // 1 to 7
  attainment: number; // 1 to 7
}

export interface CategoryScore {
  importance: number;
  likelihood: number;
  attainment: number;
}

export interface FactorScores {
  intrinsicImportance: number;
  extrinsicImportance: number;
  intrinsicLikelihood: number;
  extrinsicLikelihood: number;
  intrinsicAttainment: number;
  extrinsicAttainment: number;
  relativeIntrinsicIndex: number; // intrinsicImportance - extrinsicImportance
}

export interface StudentProfile {
  ageGroup: string;
  demographic: string;
  mainAspiration: string;
}

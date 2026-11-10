export type AspirationCategory =
  | "Personal growth"
  | "Relationships"
  | "Community"
  | "Wealth"
  | "Fame"
  | "Image"
  | "Health";

export type AspirationFactor = "intrinsic" | "extrinsic" | "health";

export type RatingDimension = "importance" | "likelihood" | "attainment";

export type PsychologicalNeed = "autonomy" | "competence" | "relatedness";

export interface AspirationGoal {
  id: number; // 1 to 35 (Kasser & Ryan canonical order)
  category: AspirationCategory;
  text: string;
}

export interface GoalRatings {
  importance: number; // 1 to 7
  likelihood: number; // 1 to 7
  attainment: number; // 1 to 7
}

export interface PartialGoalRatings {
  importance?: number;
  likelihood?: number;
  attainment?: number;
}

export interface CategoryMeta {
  name: AspirationCategory;
  factor: AspirationFactor;
  icon: "Sprout" | "Users" | "HeartHandshake" | "Coins" | "Sparkles" | "Eye" | "Activity";
  accentText: string;
  accentBg: string;
  accentBorder: string;
  barColor: string;
  shortSummary: string;
  sdtExplanation: string;
  needsConnection: string;
  primaryNeeds: PsychologicalNeed[];
  healthyReframe: string;
}

export interface CategoryScore {
  importance: number;
  likelihood: number;
  attainment: number;
  /** Kasser & Ryan mean-centered importance: subscale importance minus overall mean across all 35 items */
  centeredImportance: number;
  /** Aspiration-attainment gap: importance minus current attainment */
  gap: number;
}

export interface FactorAggregate {
  importance: number;
  likelihood: number;
  attainment: number;
  centeredImportance: number;
}

export interface AssessmentAnalysis {
  overallMeanImportance: number;
  categories: Record<AspirationCategory, CategoryScore>;
  intrinsic: FactorAggregate;
  extrinsic: FactorAggregate;
  /** Intrinsic Importance minus Extrinsic Importance */
  relativeIntrinsicIndex: number;
  highestOverall: AspirationCategory;
  highestIntrinsic: AspirationCategory;
  highestExtrinsic: AspirationCategory;
  largestGapCategory: AspirationCategory;
  strongestAnchorCategory: AspirationCategory;
}

export interface ReflectionPrompt {
  id: string;
  tag: string;
  sdtConcept: string;
  title: string;
  personalContext: string;
  question: string;
}

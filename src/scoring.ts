import { ASPIRATION_CATEGORIES, ASPIRATION_GOALS } from "./data";
import {
  AspirationCategory,
  AspirationFactor,
  AssessmentAnalysis,
  CategoryScore,
  FactorAggregate,
  GoalRatings,
  ReflectionPrompt,
} from "./types";

const INTRINSIC_CATEGORIES: AspirationCategory[] = [
  "Personal growth",
  "Relationships",
  "Community",
];

const EXTRINSIC_CATEGORIES: AspirationCategory[] = ["Wealth", "Fame", "Image"];

export function analyzeAspirations(
  ratings: Record<number, GoalRatings>,
): AssessmentAnalysis {
  // 1. Overall mean importance across all 35 items (for Kasser & Ryan relative centering)
  let totalAllImportance = 0;
  ASPIRATION_GOALS.forEach((goal) => {
    const r = ratings[goal.id] ?? { importance: 4, likelihood: 4, attainment: 4 };
    totalAllImportance += r.importance;
  });
  const overallMeanImportance = totalAllImportance / ASPIRATION_GOALS.length;

  // 2. Subscale averages + centered importance + attainment gap
  const categories = {} as Record<AspirationCategory, CategoryScore>;

  ASPIRATION_CATEGORIES.forEach((cat) => {
    const items = ASPIRATION_GOALS.filter((g) => g.category === cat.name);
    let imp = 0;
    let like = 0;
    let att = 0;

    items.forEach((item) => {
      const r = ratings[item.id] ?? { importance: 4, likelihood: 4, attainment: 4 };
      imp += r.importance;
      like += r.likelihood;
      att += r.attainment;
    });

    const importance = imp / items.length;
    const likelihood = like / items.length;
    const attainment = att / items.length;

    categories[cat.name] = {
      importance,
      likelihood,
      attainment,
      centeredImportance: importance - overallMeanImportance,
      gap: importance - attainment,
    };
  });

  // 3. Factor composites
  const averageFactor = (list: AspirationCategory[]): FactorAggregate => {
    const n = list.length;
    return {
      importance: list.reduce((s, c) => s + categories[c].importance, 0) / n,
      likelihood: list.reduce((s, c) => s + categories[c].likelihood, 0) / n,
      attainment: list.reduce((s, c) => s + categories[c].attainment, 0) / n,
      centeredImportance:
        list.reduce((s, c) => s + categories[c].centeredImportance, 0) / n,
    };
  };

  const intrinsic = averageFactor(INTRINSIC_CATEGORIES);
  const extrinsic = averageFactor(EXTRINSIC_CATEGORIES);

  // 4. Key landmarks for tailored learning insights
  const pickMax = (
    pool: AspirationCategory[],
    selector: (c: AspirationCategory) => number,
  ): AspirationCategory =>
    pool.reduce((best, cur) => (selector(cur) > selector(best) ? cur : best), pool[0]);

  const allSixCore = [...INTRINSIC_CATEGORIES, ...EXTRINSIC_CATEGORIES];
  const highestOverall = pickMax(allSixCore, (c) => categories[c].importance);
  const highestIntrinsic = pickMax(INTRINSIC_CATEGORIES, (c) => categories[c].importance);
  const highestExtrinsic = pickMax(EXTRINSIC_CATEGORIES, (c) => categories[c].importance);

  const allSeven = ASPIRATION_CATEGORIES.map((c) => c.name);
  const valuedDomains = allSeven.filter((c) => categories[c].importance >= 4.0);
  const gapPool = valuedDomains.length > 0 ? valuedDomains : allSeven;
  const largestGapCategory = pickMax(gapPool, (c) => categories[c].gap);

  const anchorPool: AspirationCategory[] = [...INTRINSIC_CATEGORIES, "Health"];
  const strongestAnchorCategory = pickMax(
    anchorPool,
    (c) => categories[c].attainment * 0.7 + categories[c].importance * 0.3,
  );

  return {
    overallMeanImportance,
    categories,
    intrinsic,
    extrinsic,
    relativeIntrinsicIndex: intrinsic.importance - extrinsic.importance,
    highestOverall,
    highestIntrinsic,
    highestExtrinsic,
    largestGapCategory,
    strongestAnchorCategory,
  };
}

export interface OrientationPortrait {
  headline: string;
  badge: string;
  summary: string;
  keyTakeaway: string;
}

export function buildOrientationPortrait(
  analysis: AssessmentAnalysis,
): OrientationPortrait {
  const idx = analysis.relativeIntrinsicIndex;
  const topInt = analysis.highestIntrinsic;
  const topExt = analysis.highestExtrinsic;
  const topExtScore = analysis.categories[topExt].importance;
  const gapCat = analysis.largestGapCategory;
  const gapVal = analysis.categories[gapCat].gap;

  if (idx >= 1.5) {
    return {
      headline: "Strongly Intrinsic Orientation",
      badge: `Relative Intrinsic Index: +${idx.toFixed(2)}`,
      summary: `Your priorities lean clearly toward intrinsic life goals (${analysis.intrinsic.importance.toFixed(2)}/7) over extrinsic markers (${analysis.extrinsic.importance.toFixed(2)}/7), led by ${topInt} (${analysis.categories[topInt].importance.toFixed(2)}/7). In Self-Determination Theory, this pattern means your compass points directly toward Autonomy, Competence, and Relatedness rather than contingent social approval.`,
      keyTakeaway:
        gapVal > 1.0
          ? `Your largest room for alignment is in ${gapCat} (value ${analysis.categories[gapCat].importance.toFixed(1)} vs. current attainment ${analysis.categories[gapCat].attainment.toFixed(1)}). Because your values are already intrinsically anchored, small regular investments here tend to yield outsized vitality.`
          : `Your current attainment tracks closely with what you value—a pattern Kasser & Ryan associate with grounded everyday well-being.`,
    };
  }

  if (idx >= 0.4) {
    return {
      headline: "Intrinsic-Leaning Pragmatic Balance",
      badge: `Relative Intrinsic Index: +${idx.toFixed(2)}`,
      summary: `You place higher priority on intrinsic aspirations (${analysis.intrinsic.importance.toFixed(2)}/7, especially ${topInt}) while still valuing practical external goals like ${topExt} (${topExtScore.toFixed(2)}/7). SDT research shows that valuing material or career goals works well psychologically when they remain supporting tools for growth and relationships rather than the main measure of self-worth.`,
      keyTakeaway: `Pay attention to moments of stress or time scarcity: when schedules tighten, extrinsic urgency (${topExt.toLowerCase()}) can quietly crowd out slower, deeper priorities like ${topInt.toLowerCase()}.`,
    };
  }

  if (idx > -0.5) {
    return {
      headline: "Dual Intrinsic & Extrinsic Focus",
      badge: `Relative Intrinsic Index: ${idx >= 0 ? "+" : ""}${idx.toFixed(2)}`,
      summary: `You assign nearly equal weight to intrinsic aspirations (${analysis.intrinsic.importance.toFixed(2)}/7, led by ${topInt}) and extrinsic aspirations (${analysis.extrinsic.importance.toFixed(2)}/7, led by ${topExt}). Holding both sets of goals at high intensity can feel energizing, yet in SDT studies it often creates internal tug-of-wars over how you spend your best attention.`,
      keyTakeaway: `Use the 'What vs. Why' lens below: examine whether pursuing ${topExt.toLowerCase()} serves your freedom and loved ones (autonomous motive) or feels like pressure to prove yourself (controlled motive).`,
    };
  }

  return {
    headline: "Extrinsic-Prioritized Profile",
    badge: `Relative Intrinsic Index: ${idx.toFixed(2)}`,
    summary: `Right now, extrinsic aspirations (${analysis.extrinsic.importance.toFixed(2)}/7, led by ${topExt} at ${topExtScore.toFixed(2)}/7) sit higher in your ratings than intrinsic domains (${analysis.intrinsic.importance.toFixed(2)}/7). Competitive environments, economic pressure, and media culture heavily reward external scoreboards—so this pattern is common and understandable, not a personal flaw.`,
    keyTakeaway: `SDT's key finding is worth testing in your own life: even when extrinsic goals are achieved, their boost fades quickly unless Autonomy, Competence, and Relatedness (${topInt.toLowerCase()}) are nourished alongside them.`,
  };
}

export function describeCategoryPattern(
  category: AspirationCategory,
  score: CategoryScore,
  factor: AspirationFactor,
): { label: string; insight: string } {
  const { importance, likelihood, attainment, gap } = score;

  if (importance >= 5.0 && attainment >= 4.8 && gap <= 1.2) {
    return {
      label: "Active Anchor (High Value · Strong Attainment)",
      insight:
        factor === "extrinsic"
          ? `You value ${category.toLowerCase()} highly and feel substantial progress already. Notice how enduring that satisfaction feels day-to-day, and how it supports your deeper autonomy or relationships.`
          : `${category} is both deeply valued and actively experienced in your life right now—serving as a reliable source of psychological nourishment.`,
    };
  }

  if (importance >= 5.0 && gap > 1.2 && likelihood >= 4.8) {
    return {
      label: "Energizing Horizon (High Value · High Optimism · Room to Grow)",
      insight: `You care deeply about ${category.toLowerCase()} (${importance.toFixed(1)}/7), haven't fully realized it yet (${attainment.toFixed(1)}/7), and feel optimistic (${likelihood.toFixed(1)}/7). For students and learners, this gap often represents healthy forward momentum.`,
    };
  }

  if (importance >= 4.8 && gap > 1.2 && likelihood < 4.5) {
    return {
      label: "Pinched Priority (High Value · Lower Expectation)",
      insight: `You rate ${category.toLowerCase()} as important (${importance.toFixed(1)}/7), yet both current attainment (${attainment.toFixed(1)}/7) and expected likelihood (${likelihood.toFixed(1)}/7) are lower. In SDT, this signals a need for smaller, self-directed steps within your immediate control.`,
    };
  }

  if (importance < 3.8 && attainment >= 4.2) {
    return {
      label: "Sufficient Baseline (Low Priority · Solid Attainment)",
      insight: `You feel reasonably satisfied in ${category.toLowerCase()} without treating it as a central life pursuit—freeing mental energy for higher priorities.`,
    };
  }

  if (importance < 3.5) {
    return {
      label: "Low Salience (Consciously De-prioritized)",
      insight:
        factor === "extrinsic"
          ? `Setting ${category.toLowerCase()} low (${importance.toFixed(1)}/7) frees you from external status pressure and leaves more room for self-endorsed goals.`
          : `Right now ${category.toLowerCase()} sits lower on your radar (${importance.toFixed(1)}/7) relative to other areas of life.`,
    };
  }

  return {
    label: "Moderate / Developing Priority",
    insight: `Your importance (${importance.toFixed(1)}/7), likelihood (${likelihood.toFixed(1)}/7), and attainment (${attainment.toFixed(1)}/7) in ${category.toLowerCase()} sit in a moderate range without sharp tension.`,
  };
}

export function generateReflectionPrompts(
  analysis: AssessmentAnalysis,
): ReflectionPrompt[] {
  const topInt = analysis.highestIntrinsic;
  const topIntScore = analysis.categories[topInt];
  const topExt = analysis.highestExtrinsic;
  const topExtScore = analysis.categories[topExt];
  const gapCat = analysis.largestGapCategory;
  const gapScore = analysis.categories[gapCat];
  const healthScore = analysis.categories["Health"];

  return [
    {
      id: "values-calendar",
      tag: "Prompt 1 · Priority vs. Everyday Attention",
      sdtConcept: "Autonomy & Goal Alignment",
      title: `Giving ${topInt} room to breathe`,
      personalContext: `${topInt} is your highest-rated intrinsic domain (${topIntScore.importance.toFixed(2)}/7, ${topIntScore.centeredImportance >= 0 ? "+" : ""}${topIntScore.centeredImportance.toFixed(2)} relative to your personal baseline of ${analysis.overallMeanImportance.toFixed(2)}).`,
      question: `If someone looked only at how you spent your energy over the past seven days, would they guess that ${topInt.toLowerCase()} matters this much to you? What is one small commitment you choose freely—not out of obligation—that honors it this week?`,
    },
    {
      id: "aspiration-gap",
      tag: "Prompt 2 · Navigating Your Largest Gap",
      sdtConcept: "Competence & Self-Directed Progress",
      title: `Closing the gap in ${gapCat} (${gapScore.importance.toFixed(1)} valued vs. ${gapScore.attainment.toFixed(1)} attained)`,
      personalContext: `Your largest gap between importance and current attainment appears in ${gapCat} (+${gapScore.gap.toFixed(1)} difference; future likelihood rated ${gapScore.likelihood.toFixed(1)}/7).`,
      question: `Aspiration gaps feel discouraging when we focus on distant outcomes outside our control, and energizing when we focus on daily practices we own. What does a realistic, joyful 'version 1' of practicing ${gapCat.toLowerCase()} look like right where you are now?`,
    },
    {
      id: "what-vs-why",
      tag: "Prompt 3 · Unpacking 'What' vs. 'Why'",
      sdtConcept: "Autonomous vs. Controlled Motivation",
      title: `Looking underneath ${topExt}`,
      personalContext: `Among extrinsic domains, ${topExt} ranked highest for you (${topExtScore.importance.toFixed(2)}/7 importance, ${topExtScore.attainment.toFixed(2)}/7 attainment).`,
      question: `Think of a concrete goal you hold related to ${topExt.toLowerCase()}. If nobody else ever knew you achieved it—no applause, status, or comparison—which part of that goal would you still genuinely want, and which basic need (autonomy, competence, or relatedness) is it really trying to serve?`,
    },
    {
      id: "vitality-anchor",
      tag: "Prompt 4 · Vitality & Support Systems",
      sdtConcept: "Relatedness & Somatic Vitality",
      title: "Protecting your energy and connection",
      personalContext: `You rated Health at ${healthScore.importance.toFixed(2)}/7 importance (${healthScore.attainment.toFixed(2)}/7 current attainment) alongside ${analysis.strongestAnchorCategory} as a key personal anchor.`,
      question: `When academic, work, or social pressures spike, what tends to be the first restorative habit or relationship you sacrifice—and what boundary or support would help keep that anchor intact?`,
    },
  ];
}

import {
  AspirationCategory,
  AspirationGoal,
  CategoryMeta,
  GoalRatings,
  PsychologicalNeed,
} from "./types";

export const BASIC_NEEDS: {
  id: PsychologicalNeed;
  name: string;
  tagline: string;
  definition: string;
  nourishedWhen: string;
  thwartedWhen: string;
  linkedCategories: AspirationCategory[];
}[] = [
  {
    id: "autonomy",
    name: "Autonomy",
    tagline: "Self-endorsement & volitional choice",
    definition:
      "Feeling that your actions come from your own genuine interests and values—not from external pressure, guilt, or trying to prove your worth.",
    nourishedWhen:
      "You choose goals because they genuinely matter to you, reflect on why you act, and have room to chart your own course.",
    thwartedWhen:
      "You feel pushed along by expectations, social comparison, or pressure to maintain an image.",
    linkedCategories: ["Personal growth"],
  },
  {
    id: "competence",
    name: "Competence",
    tagline: "Mastery, growth & effectiveness",
    definition:
      "Experiencing yourself as capable of learning, growing, and navigating meaningful challenges in the world.",
    nourishedWhen:
      "You stretch your understanding, build real skills, and measure progress against your own growth rather than status rankings.",
    thwartedWhen:
      "Success is defined solely by beating others, accumulating trophies, or chasing moving financial/popularity benchmarks.",
    linkedCategories: ["Personal growth", "Community"],
  },
  {
    id: "relatedness",
    name: "Relatedness",
    tagline: "Mutual care, belonging & contribution",
    definition:
      "Feeling genuinely known, valued for who you are, and meaningfully connected to individuals and a broader community.",
    nourishedWhen:
      "You invest in honest friendships, intimate trust, and helping others without expecting praise or return.",
    thwartedWhen:
      "Connection becomes transactional—seeking admiration, followers, or envy instead of mutual closeness.",
    linkedCategories: ["Relationships", "Community"],
  },
];

export const ASPIRATION_CATEGORIES: CategoryMeta[] = [
  {
    name: "Personal growth",
    factor: "intrinsic",
    icon: "Sprout",
    accentText: "text-emerald-700 dark:text-emerald-400",
    accentBg: "bg-emerald-50 dark:bg-emerald-950/30",
    accentBorder: "border-emerald-200 dark:border-emerald-800/60",
    barColor: "bg-emerald-600 dark:bg-emerald-500",
    shortSummary: "Self-knowledge, autonomy, lifelong curiosity, and psychological maturity.",
    sdtExplanation:
      "In Self-Determination Theory, personal growth is a quintessential intrinsic aspiration. Because learning, self-acceptance, and choosing your own path are inherently rewarding in the moment—not just at some distant finish line—pursuing them directly feeds psychological vitality.",
    needsConnection:
      "Directly nourishes Autonomy (self-direction and authenticity) and Competence (curiosity and expanding understanding).",
    primaryNeeds: ["autonomy", "competence"],
    healthyReframe:
      "Notice whether self-improvement feels like curious exploration (autonomous) or harsh self-criticism (controlled). Growth thrives on curiosity, not perfectionism.",
  },
  {
    name: "Relationships",
    factor: "intrinsic",
    icon: "Users",
    accentText: "text-teal-700 dark:text-teal-400",
    accentBg: "bg-teal-50 dark:bg-teal-950/30",
    accentBorder: "border-teal-200 dark:border-teal-800/60",
    barColor: "bg-teal-600 dark:bg-teal-500",
    shortSummary: "Deep, trusting, and mutually supportive bonds with friends, family, and partners.",
    sdtExplanation:
      "Close relationships satisfy our fundamental human need for Relatedness. Across dozens of cultures (Bradshaw et al., 2023), prioritizing authentic closeness over social status is one of the strongest predictors of life satisfaction and emotional resilience.",
    needsConnection:
      "Directly nourishes Relatedness (mutual care and belonging) and supports Autonomy when loved ones value the real you.",
    primaryNeeds: ["relatedness", "autonomy"],
    healthyReframe:
      "Depth matters more than breadth: even one or two relationships where you can drop polished appearances satisfy relatedness far better than broad popularity.",
  },
  {
    name: "Community",
    factor: "intrinsic",
    icon: "HeartHandshake",
    accentText: "text-cyan-700 dark:text-cyan-400",
    accentBg: "bg-cyan-50 dark:bg-cyan-950/30",
    accentBorder: "border-cyan-200 dark:border-cyan-800/60",
    barColor: "bg-cyan-600 dark:bg-cyan-500",
    shortSummary: "Generativity—helping others without strings attached and improving society.",
    sdtExplanation:
      "Community contribution extends relatedness outward while reinforcing competence and autonomy: when we freely help others, we experience ourselves as capable agents whose choices matter beyond ourselves.",
    needsConnection:
      "Unites all three needs—Relatedness (caring for others), Competence (making a tangible difference), and Autonomy (giving freely).",
    primaryNeeds: ["relatedness", "competence", "autonomy"],
    healthyReframe:
      "Sustainable contribution starts small and local. You do not need grand scale to experience the psychological lift of helping someone directly.",
  },
  {
    name: "Wealth",
    factor: "extrinsic",
    icon: "Coins",
    accentText: "text-amber-700 dark:text-amber-400",
    accentBg: "bg-amber-50 dark:bg-amber-950/30",
    accentBorder: "border-amber-200 dark:border-amber-800/60",
    barColor: "bg-amber-500 dark:bg-amber-400",
    shortSummary: "Financial affluence, luxury possessions, and material accumulation.",
    sdtExplanation:
      "Kasser & Ryan classify wealth items as extrinsic because money and possessions are external instruments rather than direct psychological nutriments. Once basic living needs are met, placing wealth *above* growth and relationships tends to trigger upward social comparison ('the hedonic treadmill').",
    needsConnection:
      "Neutral on its own, but crowds out Autonomy and Relatedness when treated as a scoreboard of personal worth.",
    primaryNeeds: [],
    healthyReframe:
      "Ask 'Wealth for what?' Seeking financial stability to buy freedom over your time (Autonomy) or support family/community (Relatedness) has very different effects than chasing luxury to impress others.",
  },
  {
    name: "Fame",
    factor: "extrinsic",
    icon: "Sparkles",
    accentText: "text-rose-700 dark:text-rose-400",
    accentBg: "bg-rose-50 dark:bg-rose-950/30",
    accentBorder: "border-rose-200 dark:border-rose-800/60",
    barColor: "bg-rose-500 dark:bg-rose-400",
    shortSummary: "Public recognition, widespread admiration, and visibility in media or status hierarchies.",
    sdtExplanation:
      "Fame depends on other people's reactions—something fundamentally outside your direct control. SDT research distinguishes *being admired from afar* (fame) from *being known and loved up close* (relatedness); the former often leaves people feeling fragile and evaluated.",
    needsConnection:
      "Can mimic Relatedness and Competence from the outside while leaving genuine belonging and inner security unmet.",
    primaryNeeds: [],
    healthyReframe:
      "Shift focus from 'being known' to 'sharing useful work.' Visibility is healthiest when it is a byproduct of contributing ideas or craft you genuinely care about.",
  },
  {
    name: "Image",
    factor: "extrinsic",
    icon: "Eye",
    accentText: "text-violet-700 dark:text-violet-400",
    accentBg: "bg-violet-50 dark:bg-violet-950/30",
    accentBorder: "border-violet-200 dark:border-violet-800/60",
    barColor: "bg-violet-500 dark:bg-violet-400",
    shortSummary: "Attractive appearance, fashion trends, hiding aging, and winning praise for one's look.",
    sdtExplanation:
      "Image goals place self-worth in the hands of external observers and shifting cultural standards. In SDT studies, strong preoccupation with image is linked to self-consciousness and contingent self-esteem—feeling good only when validated.",
    needsConnection:
      "Often creates controlled self-monitoring that undermines Autonomy (feeling free and unselfconscious).",
    primaryNeeds: [],
    healthyReframe:
      "Distinguish playful personal style (autonomous self-expression) from anxious appearance management aimed at winning approval.",
  },
  {
    name: "Health",
    factor: "health",
    icon: "Activity",
    accentText: "text-sky-700 dark:text-sky-400",
    accentBg: "bg-sky-50 dark:bg-sky-950/30",
    accentBorder: "border-sky-200 dark:border-sky-800/60",
    barColor: "bg-sky-600 dark:bg-sky-500",
    shortSummary: "Physical vitality, fitness, freedom from illness, and sustainable daily habits.",
    sdtExplanation:
      "Why isn't Health bundled into Intrinsic or Extrinsic? Factor analyses by Kasser & Ryan found that people value physical health for mixed reasons: sometimes for energy and vitality (intrinsic), and sometimes out of bodily anxiety or appearance concerns (extrinsic). Researchers therefore treat Health as an independent vitality anchor.",
    needsConnection:
      "Supports all three needs by providing the physical energy required to learn, connect, and contribute.",
    primaryNeeds: ["autonomy", "competence"],
    healthyReframe:
      "Frame movement, rest, and nutrition around how you want to *feel and function* today rather than rigid rules or appearance ideals.",
  },
];

/**
 * Complete 35-item Aspiration Index (Kasser & Ryan, 1996) in canonical item order.
 * Cycles smoothly across all 7 domains (5 items per domain).
 */
export const ASPIRATION_GOALS: AspirationGoal[] = [
  { id: 1, category: "Wealth", text: "To be a very wealthy person." },
  { id: 2, category: "Personal growth", text: "To grow and learn new things." },
  { id: 3, category: "Fame", text: "To have my name known by many people." },
  { id: 4, category: "Relationships", text: "To have good friends that I can count on." },
  { id: 5, category: "Image", text: "To successfully hide the signs of aging." },
  { id: 6, category: "Community", text: "To work for the betterment of society." },
  { id: 7, category: "Health", text: "To be physically healthy." },
  { id: 8, category: "Wealth", text: "To have many expensive possessions." },
  {
    id: 9,
    category: "Personal growth",
    text: "At the end of my life, to be able to look back on my life as meaningful and complete.",
  },
  { id: 10, category: "Fame", text: "To be admired by many people." },
  { id: 11, category: "Relationships", text: "To share my life with someone I love." },
  { id: 12, category: "Image", text: "To have people comment often about how attractive I look." },
  { id: 13, category: "Community", text: "To assist people who need it, asking nothing in return." },
  { id: 14, category: "Health", text: "To feel good about my level of physical fitness." },
  { id: 15, category: "Wealth", text: "To be financially successful." },
  {
    id: 16,
    category: "Personal growth",
    text: "To choose what I do, instead of being pushed along by life.",
  },
  { id: 17, category: "Fame", text: "To be famous." },
  { id: 18, category: "Relationships", text: "To have committed, intimate relationships." },
  { id: 19, category: "Image", text: "To keep up with fashions in hair and clothing." },
  { id: 20, category: "Community", text: "To work to make the world a better place." },
  { id: 21, category: "Health", text: "To keep myself healthy and well." },
  { id: 22, category: "Wealth", text: "To be rich." },
  { id: 23, category: "Personal growth", text: "To know and accept who I really am." },
  { id: 24, category: "Fame", text: "To have my name appear frequently in the media." },
  {
    id: 25,
    category: "Relationships",
    text: "To feel that there are people who really love me, and whom I love.",
  },
  { id: 26, category: "Image", text: 'To achieve the "look" I\'ve been after.' },
  { id: 27, category: "Community", text: "To help others improve their lives." },
  { id: 28, category: "Health", text: "To be relatively free from sickness." },
  { id: 29, category: "Wealth", text: "To have enough money to buy everything I want." },
  {
    id: 30,
    category: "Personal growth",
    text: "To gain increasing insight into why I do the things I do.",
  },
  { id: 31, category: "Fame", text: "To be admired by lots of different people." },
  { id: 32, category: "Relationships", text: "To have deep enduring relationships." },
  { id: 33, category: "Image", text: "To have an image that others find appealing." },
  { id: 34, category: "Community", text: "To help people in need." },
  { id: 35, category: "Health", text: "To have a physically healthy lifestyle." },
];

export interface WhatVsWhyScenario {
  id: string;
  relatedCategory: AspirationCategory | "Learning";
  surfaceGoal: string;
  controlledWhy: {
    label: string;
    motive: string;
    psychologicalEffect: string;
  };
  autonomousWhy: {
    label: string;
    motive: string;
    psychologicalEffect: string;
  };
}

export const WHAT_VS_WHY_SCENARIOS: WhatVsWhyScenario[] = [
  {
    id: "wealth",
    relatedCategory: "Wealth",
    surfaceGoal: "Building strong financial earnings",
    controlledWhy: {
      label: "Extrinsic / Controlled 'Why'",
      motive:
        "To prove I am more successful than peers, afford status symbols, and feel worthy of respect.",
      psychologicalEffect:
        "Comparison never ends—each income milestone introduces a wealthier reference group, keeping satisfaction fragile.",
    },
    autonomousWhy: {
      label: "Intrinsic / Autonomous 'Why'",
      motive:
        "To secure independence over my time, reduce family stress, and fund projects or causes I care about.",
      psychologicalEffect:
        "Money acts as a finite tool serving Autonomy and Relatedness; once sufficiency is met, energy returns to living well.",
    },
  },
  {
    id: "fame",
    relatedCategory: "Fame",
    surfaceGoal: "Sharing work publicly & building a reputation",
    controlledWhy: {
      label: "Extrinsic / Controlled 'Why'",
      motive:
        "To be admired, rack up metrics/praise, and feel important when people recognize my name.",
      psychologicalEffect:
        "Creates fear of irrelevance and nudges you toward crowd-pleasing rather than honest, original work.",
    },
    autonomousWhy: {
      label: "Intrinsic / Autonomous 'Why'",
      motive:
        "To teach, connect with collaborators who care about the same problems, and contribute useful ideas.",
      psychologicalEffect:
        "Fosters Competence and Relatedness even when audiences are small, because the craft itself is meaningful.",
    },
  },
  {
    id: "image",
    relatedCategory: "Image",
    surfaceGoal: "Caring about fitness, presentation & style",
    controlledWhy: {
      label: "Extrinsic / Controlled 'Why'",
      motive:
        "To avoid judgment, hide flaws, and earn compliments on how attractive or put-together I look.",
      psychologicalEffect:
        "Turns mirrors and social settings into evaluations, breeding self-consciousness and burnout.",
    },
    autonomousWhy: {
      label: "Intrinsic / Autonomous 'Why'",
      motive:
        "To feel energized and strong in my body, and dress in ways that feel comfortable and authentic to me.",
      psychologicalEffect:
        "Supports sustainable habits and bodily appreciation because the reward—vitality—is felt immediately.",
    },
  },
  {
    id: "learning",
    relatedCategory: "Personal growth",
    surfaceGoal: "Excelling in courses, research, or career skills",
    controlledWhy: {
      label: "Extrinsic / Controlled 'Why'",
      motive:
        "To protect my GPA/resume, satisfy others' expectations, or avoid feeling inferior.",
      psychologicalEffect:
        "Encourages surface memorization, safe choices, and relief rather than joy when a task ends.",
    },
    autonomousWhy: {
      label: "Intrinsic / Autonomous 'Why'",
      motive:
        "To understand how people and systems work, wrestle with interesting questions, and build real capability.",
      psychologicalEffect:
        "Produces deeper conceptual retention, creative transfer, and lasting intellectual curiosity.",
    },
  },
];

/**
 * Deterministic, realistic sample dataset for learners or instructors who want
 * to explore the SDT Learning Lab before taking the full 35-item scale.
 */
export function createSampleRatings(): Record<number, GoalRatings> {
  const sampleByGoalId: Record<number, GoalRatings> = {
    1: { importance: 4, likelihood: 4, attainment: 2 },
    2: { importance: 7, likelihood: 6, attainment: 5 },
    3: { importance: 2, likelihood: 2, attainment: 2 },
    4: { importance: 7, likelihood: 6, attainment: 5 },
    5: { importance: 2, likelihood: 3, attainment: 3 },
    6: { importance: 6, likelihood: 5, attainment: 3 },
    7: { importance: 6, likelihood: 6, attainment: 5 },
    8: { importance: 3, likelihood: 3, attainment: 2 },
    9: { importance: 7, likelihood: 6, attainment: 4 },
    10: { importance: 3, likelihood: 3, attainment: 3 },
    11: { importance: 7, likelihood: 6, attainment: 5 },
    12: { importance: 3, likelihood: 3, attainment: 3 },
    13: { importance: 6, likelihood: 6, attainment: 4 },
    14: { importance: 6, likelihood: 5, attainment: 3 },
    15: { importance: 5, likelihood: 5, attainment: 3 },
    16: { importance: 7, likelihood: 5, attainment: 4 },
    17: { importance: 1, likelihood: 1, attainment: 1 },
    18: { importance: 6, likelihood: 6, attainment: 4 },
    19: { importance: 2, likelihood: 3, attainment: 3 },
    20: { importance: 6, likelihood: 5, attainment: 3 },
    21: { importance: 6, likelihood: 5, attainment: 4 },
    22: { importance: 3, likelihood: 3, attainment: 2 },
    23: { importance: 7, likelihood: 6, attainment: 4 },
    24: { importance: 1, likelihood: 2, attainment: 1 },
    25: { importance: 7, likelihood: 6, attainment: 6 },
    26: { importance: 3, likelihood: 4, attainment: 3 },
    27: { importance: 6, likelihood: 5, attainment: 4 },
    28: { importance: 6, likelihood: 5, attainment: 5 },
    29: { importance: 4, likelihood: 3, attainment: 2 },
    30: { importance: 6, likelihood: 6, attainment: 5 },
    31: { importance: 3, likelihood: 3, attainment: 3 },
    32: { importance: 7, likelihood: 6, attainment: 5 },
    33: { importance: 4, likelihood: 4, attainment: 4 },
    34: { importance: 6, likelihood: 5, attainment: 3 },
    35: { importance: 6, likelihood: 5, attainment: 4 },
  };
  return sampleByGoalId;
}

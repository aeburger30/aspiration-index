import { useState } from "react";
import { ASPIRATION_CATEGORIES, ASPIRATION_GOALS } from "../data";
import { describeCategoryPattern } from "../scoring";
import {
  AspirationCategory,
  AssessmentAnalysis,
  CategoryMeta,
  GoalRatings,
  RatingDimension,
} from "../types";
import {
  Activity,
  Coins,
  Eye,
  HeartHandshake,
  Info,
  Scale,
  SlidersHorizontal,
  Sparkles,
  Sprout,
  Users,
} from "lucide-react";

interface VisualizersProps {
  analysis: AssessmentAnalysis;
  ratings: Record<number, GoalRatings>;
}

function CategoryIcon({
  icon,
  className,
}: {
  icon: CategoryMeta["icon"];
  className?: string;
}) {
  const props = { size: 16, className };
  switch (icon) {
    case "Sprout":
      return <Sprout {...props} />;
    case "Users":
      return <Users {...props} />;
    case "HeartHandshake":
      return <HeartHandshake {...props} />;
    case "Coins":
      return <Coins {...props} />;
    case "Sparkles":
      return <Sparkles {...props} />;
    case "Eye":
      return <Eye {...props} />;
    case "Activity":
      return <Activity {...props} />;
  }
}

export default function Visualizers({ analysis, ratings }: VisualizersProps) {
  const [scoringView, setScoringView] = useState<"raw" | "centered">("raw");
  const [balanceDimension, setBalanceDimension] = useState<RatingDimension>("importance");
  const [selectedCategory, setSelectedCategory] = useState<AspirationCategory>(
    analysis.highestOverall,
  );

  const intrinsicVal = analysis.intrinsic[balanceDimension];
  const extrinsicVal = analysis.extrinsic[balanceDimension];
  const totalPair = intrinsicVal + extrinsicVal;
  const intrinsicShare = totalPair > 0 ? (intrinsicVal / totalPair) * 100 : 50;
  const diff = intrinsicVal - extrinsicVal;

  const selectedMeta =
    ASPIRATION_CATEGORIES.find((c) => c.name === selectedCategory) ?? ASPIRATION_CATEGORIES[0];
  const selectedScore = analysis.categories[selectedCategory];
  const selectedPattern = describeCategoryPattern(
    selectedCategory,
    selectedScore,
    selectedMeta.factor,
  );
  const selectedItems = ASPIRATION_GOALS.filter((g) => g.category === selectedCategory);

  const renderCategoryCard = (meta: CategoryMeta) => {
    const score = analysis.categories[meta.name];
    const isSelected = selectedCategory === meta.name;
    const centered = score.centeredImportance;
    // Clamp centered visualization within [-3, +3]
    const centeredWidthPct = Math.min(Math.abs(centered) / 3, 1) * 50;

    return (
      <button
        key={meta.name}
        type="button"
        onClick={() => setSelectedCategory(meta.name)}
        className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer ${
          isSelected
            ? "border-indigo-500 dark:border-indigo-400 bg-indigo-50/30 dark:bg-indigo-950/25 ring-1 ring-indigo-500/20"
            : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:border-slate-300 dark:hover:border-slate-700"
        }`}
      >
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <CategoryIcon icon={meta.icon} className={meta.accentText} />
            <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
              {meta.name}
            </span>
          </div>

          {scoringView === "raw" ? (
            <div className="flex items-center gap-1.5 text-[11px]">
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {score.importance.toFixed(2)}
              </span>
              <span className="text-slate-400">/ 7</span>
              {score.gap > 1.0 && (
                <span className="ml-1 px-1.5 py-0.5 rounded bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60 text-[10px] font-semibold">
                  Gap +{score.gap.toFixed(1)}
                </span>
              )}
            </div>
          ) : (
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded ${
                centered >= 0
                  ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400"
                  : "bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400"
              }`}
            >
              {centered >= 0 ? "+" : ""}
              {centered.toFixed(2)} vs. mean
            </span>
          )}
        </div>

        {scoringView === "raw" ? (
          <div className="space-y-1.5">
            {/* Dual overlay bar: translucent fill + marker = Importance, inner solid bar = Current Attainment */}
            <div className="relative h-3 w-full rounded-md bg-slate-100 dark:bg-slate-900 overflow-hidden border border-slate-200/60 dark:border-slate-800">
              <div
                className="absolute inset-y-0 left-0 bg-indigo-500/15 dark:bg-indigo-400/20 border-r-2 border-indigo-600 dark:border-indigo-400 transition-all duration-300"
                style={{ width: `${(score.importance / 7) * 100}%` }}
                title={`Importance: ${score.importance.toFixed(2)} / 7`}
              />
              <div
                className={`relative h-1.5 my-auto mt-[2px] rounded-r-sm transition-all duration-300 ${meta.barColor}`}
                style={{ width: `${(score.attainment / 7) * 100}%` }}
                title={`Current Attainment: ${score.attainment.toFixed(2)} / 7`}
              />
            </div>

            <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400">
              <span>
                Attained: <strong className="text-slate-700 dark:text-slate-300">{score.attainment.toFixed(1)}</strong>
              </span>
              <span>
                Likely: <strong className="text-slate-700 dark:text-slate-300">{score.likelihood.toFixed(1)}</strong>
              </span>
              <span>
                Value: <strong className="text-indigo-600 dark:text-indigo-400">{score.importance.toFixed(1)}</strong>
              </span>
            </div>
          </div>
        ) : (
          /* Zero-centered relative priority bar */
          <div className="space-y-1">
            <div className="relative h-2.5 w-full rounded-full bg-slate-100 dark:bg-slate-900 overflow-hidden border border-slate-200/60 dark:border-slate-800">
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-slate-400 dark:bg-slate-600 z-10" />
              {centered >= 0 ? (
                <div
                  className="absolute top-0 bottom-0 bg-emerald-600 dark:bg-emerald-500 rounded-r-full transition-all duration-300"
                  style={{ left: "50%", width: `${centeredWidthPct}%` }}
                />
              ) : (
                <div
                  className="absolute top-0 bottom-0 bg-slate-400 dark:bg-slate-500 rounded-l-full transition-all duration-300"
                  style={{ right: "50%", width: `${centeredWidthPct}%` }}
                />
              )}
            </div>
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>Below your average</span>
              <span>0</span>
              <span>Above your average</span>
            </div>
          </div>
        )}
      </button>
    );
  };

  return (
    <div className="space-y-6">
      {/* 1. Intrinsic vs. Extrinsic Balance across the 3 rating dimensions */}
      <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Scale size={16} className="text-indigo-600 dark:text-indigo-400" />
              Intrinsic vs. Extrinsic Composite Balance
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Compare how you value, expect, and currently experience intrinsic vs. extrinsic goals.
            </p>
          </div>

          <div className="inline-flex rounded-lg bg-slate-100 dark:bg-slate-900 p-0.5 border border-slate-200 dark:border-slate-800 self-start">
            {(["importance", "likelihood", "attainment"] as const).map((dim) => (
              <button
                key={dim}
                type="button"
                onClick={() => setBalanceDimension(dim)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold capitalize transition-colors cursor-pointer ${
                  balanceDimension === dim
                    ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-xs"
                    : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
                }`}
              >
                {dim}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
          <div className="p-3.5 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/70 dark:border-emerald-800/50">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 block">
              Intrinsic Composite
            </span>
            <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {intrinsicVal.toFixed(2)}
              <span className="text-xs font-normal text-slate-400"> / 7</span>
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
              Growth · Relationships · Community
            </span>
          </div>

          <div className="space-y-2 text-center">
            <div className="relative h-4 w-full rounded-full bg-slate-100 dark:bg-slate-900 overflow-hidden flex border border-slate-200 dark:border-slate-800">
              <div
                className="h-full bg-emerald-600 dark:bg-emerald-500 transition-all duration-300"
                style={{ width: `${intrinsicShare}%` }}
              />
              <div
                className="h-full bg-amber-500/80 dark:bg-amber-500/70 transition-all duration-300"
                style={{ width: `${100 - intrinsicShare}%` }}
              />
              <div className="absolute left-1/2 inset-y-0 w-0.5 bg-white dark:bg-slate-950" />
            </div>
            <span className="inline-block text-[11px] font-semibold text-slate-600 dark:text-slate-300">
              Difference ({balanceDimension}):{" "}
              <strong
                className={
                  diff >= 0
                    ? "text-emerald-700 dark:text-emerald-400"
                    : "text-amber-700 dark:text-amber-400"
                }
              >
                {diff >= 0 ? "+" : ""}
                {diff.toFixed(2)}
              </strong>{" "}
              toward {diff >= 0 ? "Intrinsic" : "Extrinsic"}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/70 dark:border-amber-800/50 sm:text-right">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 block">
              Extrinsic Composite
            </span>
            <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {extrinsicVal.toFixed(2)}
              <span className="text-xs font-normal text-slate-400"> / 7</span>
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
              Wealth · Fame · Image
            </span>
          </div>
        </div>
      </div>

      {/* 2. Interactive 7-Subscale Explorer with Raw vs. Mean-Centered Psychometric Toggle */}
      <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <SlidersHorizontal size={16} className="text-indigo-600 dark:text-indigo-400" />
              Explore All 7 Subscales (Click any domain to inspect its 5 items)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {scoringView === "raw"
                ? "Vertical indigo line = Importance; inner colored bar = Current Attainment."
                : `Centered around your overall importance baseline (${analysis.overallMeanImportance.toFixed(2)}/7 across all 35 items).`}
            </p>
          </div>

          <div className="inline-flex rounded-lg bg-slate-100 dark:bg-slate-900 p-0.5 border border-slate-200 dark:border-slate-800 self-start">
            <button
              type="button"
              onClick={() => setScoringView("raw")}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer ${
                scoringView === "raw"
                  ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-xs"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
              }`}
            >
              Raw &amp; Gaps (1–7)
            </button>
            <button
              type="button"
              onClick={() => setScoringView("centered")}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer ${
                scoringView === "centered"
                  ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-xs"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
              }`}
            >
              Relative Priority (Centered)
            </button>
          </div>
        </div>

        {/* Educational note when viewing Mean-Centered scores */}
        {scoringView === "centered" && (
          <div className="p-3.5 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/60 flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
            <Info size={15} className="text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Research Method Note (Mean-Centering):</strong> Some people rate almost every
              goal 6–7, while others rate everything 3–4. Kasser &amp; Ryan subtract your personal
              mean across all 35 goals (<strong>{analysis.overallMeanImportance.toFixed(2)}</strong>)
              from each subscale so you can see what you prioritize <em>most</em> and{" "}
              <em>least</em> relative to yourself.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Intrinsic Column */}
          <div className="space-y-3">
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
              Intrinsic Aspirations
            </h3>
            {ASPIRATION_CATEGORIES.filter((c) => c.factor === "intrinsic").map(renderCategoryCard)}
          </div>

          {/* Extrinsic Column */}
          <div className="space-y-3">
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-amber-700 dark:text-amber-400">
              Extrinsic Aspirations
            </h3>
            {ASPIRATION_CATEGORIES.filter((c) => c.factor === "extrinsic").map(renderCategoryCard)}
          </div>
        </div>

        {/* Health Anchor */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
          <h3 className="text-[11px] font-bold uppercase tracking-widest text-sky-700 dark:text-sky-400">
            Physical Vitality Anchor (Scored Independently)
          </h3>
          {ASPIRATION_CATEGORIES.filter((c) => c.factor === "health").map(renderCategoryCard)}
        </div>

        {/* Selected Subscale Deep-Dive & Unmasked 5 Items */}
        <div className="mt-4 p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${selectedMeta.accentBg} ${selectedMeta.accentBorder} ${selectedMeta.accentText}`}
              >
                <CategoryIcon icon={selectedMeta.icon} />
                {selectedMeta.name} Debrief
              </span>
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                {selectedPattern.label}
              </span>
            </div>

            <span className="text-xs text-slate-500 dark:text-slate-400">
              Value <strong>{selectedScore.importance.toFixed(2)}</strong> · Likely{" "}
              <strong>{selectedScore.likelihood.toFixed(2)}</strong> · Attained{" "}
              <strong>{selectedScore.attainment.toFixed(2)}</strong>
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
            {selectedPattern.insight}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-1">
              <span className="font-bold text-slate-900 dark:text-slate-100 block">
                Why SDT Categorizes This Here
              </span>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {selectedMeta.sdtExplanation}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-1">
              <span className="font-bold text-slate-900 dark:text-slate-100 block">
                Needs Connection &amp; Healthy Lens
              </span>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {selectedMeta.needsConnection} {selectedMeta.healthyReframe}
              </p>
            </div>
          </div>

          {/* Unmasked 5 items belonging to this subscale */}
          <div className="space-y-2 pt-1">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Your 5 Survey Items in {selectedMeta.name}
            </h4>
            <div className="divide-y divide-slate-200/70 dark:divide-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-hidden">
              {selectedItems.map((item) => {
                const r = ratings[item.id];
                return (
                  <div
                    key={item.id}
                    className="px-3.5 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                  >
                    <span className="text-slate-700 dark:text-slate-200">
                      <span className="text-slate-400 font-mono mr-1.5">#{item.id}</span>
                      {item.text}
                    </span>
                    {r && (
                      <div className="flex items-center gap-2 shrink-0 text-[11px] text-slate-500 dark:text-slate-400">
                        <span>
                          Val <strong className="text-slate-800 dark:text-slate-200">{r.importance}</strong>
                        </span>
                        <span>·</span>
                        <span>
                          Lik <strong className="text-slate-800 dark:text-slate-200">{r.likelihood}</strong>
                        </span>
                        <span>·</span>
                        <span>
                          Att <strong className="text-slate-800 dark:text-slate-200">{r.attainment}</strong>
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { AspirationCategory, CategoryScore, FactorScores } from "../types";
import { ASPIRATION_CATEGORIES } from "../data";
import { useState } from "react";
import * as Icons from "lucide-react";

interface VisualizersProps {
  scores: Record<AspirationCategory, CategoryScore>;
  factorScores: FactorScores;
}

export default function Visualizers({ scores, factorScores }: VisualizersProps) {
  const [activeTab, setActiveTab] = useState<"importance" | "likelihood" | "attainment">("importance");
  const [hoveredCategory, setHoveredCategory] = useState<AspirationCategory | null>(null);

  // Helper dynamically select lucide icons
  const renderIcon = (iconName: string, className: string) => {
    switch (iconName) {
      case "Sprout":
        return <Icons.Sprout className={className} size={18} />;
      case "Users2":
        return <Icons.Users className={className} size={18} />;
      case "HeartHandshake":
        return <Icons.HeartHandshake className={className} size={18} />;
      case "Coins":
        return <Icons.Coins className={className} size={18} />;
      case "Sparkles":
        return <Icons.Sparkles className={className} size={18} />;
      case "Shirt":
        return <Icons.Shirt className={className} size={18} />;
      case "Activity":
        return <Icons.Activity className={className} size={18} />;
      default:
        return <Icons.HelpCircle className={className} size={18} />;
    }
  };

  const getMetricLabel = (tab: typeof activeTab) => {
    switch (tab) {
      case "importance":
        return "Importance (What you value)";
      case "likelihood":
        return "Likelihood (What you expect)";
      case "attainment":
        return "Attainment (What you feel satisfied with)";
    }
  };

  // Compute balance indicators
  const intrinsicVal =
    activeTab === "importance"
      ? factorScores.intrinsicImportance
      : activeTab === "likelihood"
      ? factorScores.intrinsicLikelihood
      : factorScores.intrinsicAttainment;

  const extrinsicVal =
    activeTab === "importance"
      ? factorScores.extrinsicImportance
      : activeTab === "likelihood"
      ? factorScores.extrinsicLikelihood
      : factorScores.extrinsicAttainment;

  const totalBalance = intrinsicVal + extrinsicVal;
  const intrinsicPercent = totalBalance > 0 ? (intrinsicVal / totalBalance) * 100 : 50;

  return (
    <div className="space-y-8" id="visualizers-dashboard">
      {/* Intrinsic vs Extrinsic Dial Balance Indicator */}
      <div className="p-6 bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <h3 className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-4 text-center">
          Core Motivation Balance (Based on {getMetricLabel(activeTab)})
        </h3>

        <div className="flex flex-col sm:flex-row items-center justify-around gap-6">
          <div className="text-center sm:text-right w-full sm:w-1/3">
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest block">
              Intrinsic Drivers
            </span>
            <span className="text-3xl font-black text-slate-800 dark:text-slate-100">
              {intrinsicVal.toFixed(2)}
            </span>
            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">Focus on personal growth, meaningful relationships, and community contribution.</p>
          </div>

          {/* Balance Scale Meter */}
          <div className="w-full sm:w-1/3 flex flex-col items-center">
            <div className="relative w-full h-4 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden flex shadow-inner border border-slate-200/50 dark:border-slate-800/50 animate-pulse-slow">
              <div
                className="h-full bg-indigo-600 transition-all duration-500"
                style={{ width: `${intrinsicPercent}%` }}
              />
              <div
                className="h-full bg-slate-400 transition-all duration-500"
                style={{ width: `${100 - intrinsicPercent}%` }}
              />
              {/* Center Divider Anchor */}
              <div className="absolute left-1/2 top-0 transform -translate-x-1/2 w-1 h-full bg-white dark:bg-slate-950 shadow-sm" />
            </div>

            <div className="flex justify-between w-full mt-2 text-[9px] font-bold tracking-wider text-slate-400 uppercase">
              <span>Intrinsic</span>
              <span>Extrinsic</span>
            </div>

            {/* Scale visual readout */}
            <div className="mt-3 text-[10px] font-bold text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900 px-3 py-1 rounded-full border border-slate-250 dark:border-slate-800">
              {intrinsicPercent > 55 ? (
                <span className="text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wider">
                  Strong Intrinsic Focus (+{((intrinsicPercent - 50) * 2).toFixed(0)}% relative focus)
                </span>
              ) : intrinsicPercent < 45 ? (
                <span className="text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider">
                  Extrinsic Focus Focus (+{((50 - intrinsicPercent) * 2).toFixed(0)}% relative focus)
                </span>
              ) : (
                <span className="text-slate-500 dark:text-slate-300 font-bold uppercase tracking-wider font-medium">
                  Harmoniously Balanced Focus (~50/50 Ratio)
                </span>
              )}
            </div>
          </div>

          <div className="text-center sm:text-left w-full sm:w-1/3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest block">
              Extrinsic Drivers
            </span>
            <span className="text-3xl font-black text-slate-850 dark:text-slate-100">
              {extrinsicVal.toFixed(2)}
            </span>
            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">Focus on wealth, fame, and physical image relative to others.</p>
          </div>
        </div>
      </div>

      {/* Tabs selector */}
      <div className="flex border-b border-slate-200 dark:border-slate-800">
        {(["importance", "likelihood", "attainment"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 px-1 text-center font-bold text-xs uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
              activeTab === tab
                ? "border-slate-900 text-slate-900 dark:border-white dark:text-white"
                : "border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Grouped Category Breakdown Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Intrinsic Factor Column */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
            <div className="w-2 h-2 rounded-full bg-slate-900 dark:bg-white" />
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-200 uppercase tracking-widest">
              Intrinsic Aspirations
            </h4>
          </div>

          <div className="space-y-4">
            {ASPIRATION_CATEGORIES.filter((c) => c.type === "intrinsic").map((category) => {
              const score = scores[category.name][activeTab];
              const scorePercent = (score / 7) * 100;
              const isHovered = hoveredCategory === category.name;

              return (
                <div
                  key={category.name}
                  onMouseEnter={() => setHoveredCategory(category.name)}
                  onMouseLeave={() => setHoveredCategory(null)}
                  className={`p-4 rounded-xl border transition-all duration-250 cursor-pointer ${
                    isHovered
                      ? "border-slate-400 bg-slate-50/50 dark:border-slate-700/50 dark:bg-slate-900/30"
                      : "border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-950"
                  }`}
                >
                  <div className="flex justify-between items-center mb-1.5">
                    <div className="flex items-center gap-2">
                      {renderIcon(category.icon, "text-slate-700 dark:text-slate-350")}
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        {category.name}
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-900 px-2.5 py-0.5 rounded border border-slate-200 dark:border-slate-800">
                      {score.toFixed(2)} / 7
                    </span>
                  </div>

                  {/* Progressive Bar */}
                  <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden flex border border-slate-150 dark:border-slate-800">
                    <div
                      className="h-full bg-indigo-600 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${scorePercent}%` }}
                    />
                  </div>

                  {isHovered && (
                    <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed animate-fade-in">
                      {category.description}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Extrinsic Factor Column */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
            <div className="w-2 h-2 rounded-full bg-slate-400" />
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Extrinsic Aspirations
            </h4>
          </div>

          <div className="space-y-4">
            {ASPIRATION_CATEGORIES.filter((c) => c.type === "extrinsic").map((category) => {
              const score = scores[category.name][activeTab];
              const scorePercent = (score / 7) * 100;
              const isHovered = hoveredCategory === category.name;

              return (
                <div
                  key={category.name}
                  onMouseEnter={() => setHoveredCategory(category.name)}
                  onMouseLeave={() => setHoveredCategory(null)}
                  className={`p-4 rounded-xl border transition-all duration-250 cursor-pointer ${
                    isHovered
                      ? "border-slate-400 bg-slate-50/50 dark:border-slate-700/50 dark:bg-slate-900/30"
                      : "border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-950"
                  }`}
                >
                  <div className="flex justify-between items-center mb-1.5">
                    <div className="flex items-center gap-2">
                      {renderIcon(category.icon, "text-slate-500 dark:text-slate-450")}
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        {category.name}
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-900 px-2.5 py-0.5 rounded border border-slate-200 dark:border-slate-800">
                      {score.toFixed(2)} / 7
                    </span>
                  </div>

                  {/* Progressive Bar */}
                  <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden flex border border-slate-150 dark:border-slate-800">
                    <div
                      className="h-full bg-slate-400 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${scorePercent}%` }}
                    />
                  </div>

                  {isHovered && (
                    <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed animate-fade-in">
                      {category.description}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Health - Neutral Anchor */}
      <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-2xl p-6">
        {ASPIRATION_CATEGORIES.filter((c) => c.type === "neutral").map((category) => {
          const score = scores[category.name][activeTab];
          const scorePercent = (score / 7) * 100;

          return (
            <div
              key={category.name}
              onMouseEnter={() => setHoveredCategory(category.name)}
              onMouseLeave={() => setHoveredCategory(null)}
              className="cursor-help"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-slate-300" />
                  {renderIcon(category.icon, "text-slate-600 dark:text-slate-400")}
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Health Anchor Metric (Independent baseline)
                  </h4>
                </div>
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-300 bg-slate-50 dark:bg-slate-900 px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-800">
                  {score.toFixed(2)} / 7
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden flex border border-slate-150 dark:border-slate-800">
                <div
                  className="h-full bg-slate-500 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${scorePercent}%` }}
                />
              </div>
              <p className="mt-3 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                {category.description} Cognitive psychologists treat physical healthcare as a foundational vital sign of a balanced student lifecycle.
              </p>
            </div>
          );
        })}
      </div>

      {/* Aspiration Attainment Gap Section */}
      <div className="p-6 bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
          <Icons.GitCompare size={16} /> Motivational Relationship Analysis
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
          The alignment below measures the ratio of your underlying values (Importance) with what you actually manifest in active life (Attainment). Large gaps are potent opportunities for alignment.
        </p>

        <div className="space-y-4">
          {ASPIRATION_CATEGORIES.map((cat) => {
            const importanceScore = scores[cat.name].importance;
            const attainmentScore = scores[cat.name].attainment;

            const gap = importanceScore - attainmentScore;

            return (
              <div key={cat.name} className="space-y-1">
                <div className="flex justify-between text-[11px] font-semibold text-slate-700 dark:text-slate-400">
                  <span>{cat.name}</span>
                  <span className="font-medium text-[10px] text-slate-500">
                    Value: <strong className="text-slate-800 dark:text-slate-200">{importanceScore.toFixed(1)}</strong> |
                    Manifest: <strong className="text-slate-800 dark:text-slate-200">{attainmentScore.toFixed(1)}</strong>
                    {gap > 1 ? (
                      <span className="ml-2 text-indigo-600 dark:text-indigo-400 font-bold bg-slate-100 dark:bg-slate-900 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-800">
                        Gap: +{gap.toFixed(1)}
                      </span>
                    ) : gap < -0.5 ? (
                      <span className="ml-2 text-emerald-600 dark:text-emerald-400 font-bold bg-slate-100 dark:bg-slate-900 px-1.5 py-0.5 rounded border border-slate-250 dark:border-slate-800">
                        Surplus
                      </span>
                    ) : (
                      <span className="ml-2 text-slate-400 italic font-medium">Aligned</span>
                    )}
                  </span>
                </div>

                <div className="relative w-full h-3 bg-slate-50 dark:bg-slate-900 rounded flex overflow-hidden border border-slate-200/50 dark:border-slate-800/50">
                  {/* Importance Fill (Translucent line representation) */}
                  <div
                    className="absolute top-0 left-0 h-full bg-indigo-500/10 dark:bg-indigo-400/10 border-r-2 border-indigo-550 transition-all duration-300"
                    style={{ width: `${(importanceScore / 7) * 100}%` }}
                  />

                  {/* Attainment Solid Fill Bar */}
                  <div
                    className={`h-1.5 my-auto ml-1 rounded-sm transition-all duration-300 ${
                      cat.type === "intrinsic"
                        ? "bg-slate-800 dark:bg-slate-300"
                        : "bg-slate-400"
                    }`}
                    style={{ width: `${Math.max(3, (attainmentScore / 7) * 98)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

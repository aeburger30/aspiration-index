import { useState } from "react";
import { BASIC_NEEDS, WHAT_VS_WHY_SCENARIOS } from "../data";
import { AssessmentAnalysis } from "../types";
import { Compass, GitBranch, Heart, ShieldAlert, Sparkles } from "lucide-react";

interface SdtLearningLabProps {
  analysis: AssessmentAnalysis;
}

export default function SdtLearningLab({ analysis }: SdtLearningLabProps) {
  const defaultScenarioId =
    analysis.highestExtrinsic === "Wealth"
      ? "wealth"
      : analysis.highestExtrinsic === "Fame"
      ? "fame"
      : "image";

  const [activeScenarioId, setActiveScenarioId] = useState<string>(defaultScenarioId);
  const activeScenario =
    WHAT_VS_WHY_SCENARIOS.find((s) => s.id === activeScenarioId) ?? WHAT_VS_WHY_SCENARIOS[0];

  return (
    <div className="space-y-6">
      {/* 1. Basic Psychological Needs mapped to the learner's scores */}
      <section className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-5">
        <div className="space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
            <Heart size={13} /> Core SDT Concept 1 · Basic Psychological Needs
          </span>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
            How Your Goals Connect to Autonomy, Competence &amp; Relatedness
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Across 90+ studies and 70,000+ participants worldwide (Bradshaw et al., 2023),
            prioritizing intrinsic aspirations predicts greater well-being because those goals feed
            three basic psychological needs directly—whereas extrinsic goals offer only indirect
            substitutes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {BASIC_NEEDS.map((need) => {
            const avgAttainment =
              need.linkedCategories.reduce(
                (sum, cat) => sum + analysis.categories[cat].attainment,
                0,
              ) / need.linkedCategories.length;
            const avgImportance =
              need.linkedCategories.reduce(
                (sum, cat) => sum + analysis.categories[cat].importance,
                0,
              ) / need.linkedCategories.length;

            return (
              <div
                key={need.id}
                className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      {need.name}
                    </h3>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
                      Val {avgImportance.toFixed(1)} · Att {avgAttainment.toFixed(1)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {need.definition}
                  </p>
                </div>

                <div className="pt-2.5 border-t border-slate-200/70 dark:border-slate-800 space-y-1.5 text-[11px]">
                  <p className="text-slate-600 dark:text-slate-300">
                    <strong className="text-emerald-700 dark:text-emerald-400">Nourished:</strong>{" "}
                    {need.nourishedWhen}
                  </p>
                  <p className="text-slate-500 dark:text-slate-400">
                    <strong className="text-rose-600 dark:text-rose-400">Crowded out:</strong>{" "}
                    {need.thwartedWhen}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 2. Interactive "What" vs. "Why" Lab */}
      <section className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-5">
        <div className="space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
            <GitBranch size={13} /> Core SDT Concept 2 · Goal Content (&ldquo;What&rdquo;) vs.
            Motive (&ldquo;Why&rdquo;)
          </span>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
            Does SDT Mean Financial or Career Ambition Is Bad? No—Check the &ldquo;Why&rdquo;
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            A crucial insight in Self-Determination Theory is separating <strong>what</strong> goal
            you pursue from <strong>why</strong> you pursue it. Two students can pursue the exact
            same outward milestone with completely different psychological outcomes. Your highest
            extrinsic subscale is <strong>{analysis.highestExtrinsic}</strong>—explore how the
            underlying motive changes the experience:
          </p>
        </div>

        {/* Scenario selector pills */}
        <div className="flex flex-wrap gap-2">
          {WHAT_VS_WHY_SCENARIOS.map((scenario) => {
            const isActive = scenario.id === activeScenario.id;
            const isUserTopExtrinsic = scenario.relatedCategory === analysis.highestExtrinsic;
            return (
              <button
                key={scenario.id}
                type="button"
                onClick={() => setActiveScenarioId(scenario.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors cursor-pointer inline-flex items-center gap-1.5 ${
                  isActive
                    ? "bg-slate-900 dark:bg-white text-white dark:text-slate-950 border-slate-900 dark:border-white"
                    : "bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-400"
                }`}
              >
                <span>{scenario.surfaceGoal}</span>
                {isUserTopExtrinsic && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded ${
                      isActive
                        ? "bg-white/20 text-white dark:bg-slate-900/15 dark:text-slate-900"
                        : "bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300"
                    }`}
                  >
                    Your top extrinsic
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Side-by-side comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-amber-50/40 dark:bg-amber-950/15 border border-amber-200/80 dark:border-amber-800/50 space-y-2.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 dark:text-amber-400">
              <ShieldAlert size={15} />
              {activeScenario.controlledWhy.label}
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed">
              <strong>Underlying motive:</strong> &ldquo;{activeScenario.controlledWhy.motive}
              &rdquo;
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed pt-2 border-t border-amber-200/50 dark:border-amber-800/40">
              <strong>What research finds:</strong>{" "}
              {activeScenario.controlledWhy.psychologicalEffect}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50/40 dark:bg-emerald-950/15 border border-emerald-200/80 dark:border-emerald-800/50 space-y-2.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-400">
              <Compass size={15} />
              {activeScenario.autonomousWhy.label}
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed">
              <strong>Underlying motive:</strong> &ldquo;{activeScenario.autonomousWhy.motive}
              &rdquo;
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed pt-2 border-t border-emerald-200/50 dark:border-emerald-800/40">
              <strong>What research finds:</strong>{" "}
              {activeScenario.autonomousWhy.psychologicalEffect}
            </p>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800 flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
          <Sparkles size={14} className="text-indigo-500 shrink-0 mt-0.5" />
          <span>
            <strong>Takeaway for learners:</strong> Instead of forcing yourself to stop caring about{" "}
            {analysis.highestExtrinsic.toLowerCase()}, trace the goal one layer deeper until it
            connects to freedom of choice (autonomy), real capability (competence), or people you
            care about (relatedness).
          </span>
        </div>
      </section>
    </div>
  );
}

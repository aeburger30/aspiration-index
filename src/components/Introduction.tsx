import { BASIC_NEEDS } from "../data";
import {
  ArrowRight,
  BookOpen,
  Compass,
  EyeOff,
  History,
  Layers,
  Sparkles,
} from "lucide-react";

interface IntroductionProps {
  onStart: () => void;
  onLoadSample: () => void;
  draftCount: number;
  onResume: () => void;
  hasSavedResults: boolean;
  onViewResults: () => void;
}

export default function Introduction({
  onStart,
  onLoadSample,
  draftCount,
  onResume,
  hasSavedResults,
  onViewResults,
}: IntroductionProps) {
  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
      {/* Hero */}
      <section className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="space-y-3">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 px-3 py-1 rounded-full">
            <Compass size={13} /> Self-Determination Theory · Goal Contents Lab
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-950 dark:text-slate-50">
            What do your life goals actually nourish?
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Developed by psychologists <strong>Tim Kasser</strong> and{" "}
            <strong>Richard M. Ryan</strong>, the <strong>Aspiration Index</strong> explores a
            deceptively simple question in motivation science:{" "}
            <em>do all goals bring equal well-being once we achieve them?</em> Rate 35 life goals
            honestly, then uncover how your priorities map onto human psychological needs.
          </p>
        </div>

        {/* Resume / View existing banner */}
        {(draftCount > 0 || hasSavedResults) && (
          <div className="p-4 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-200">
              <History size={16} className="text-indigo-600 dark:text-indigo-400 shrink-0" />
              <span>
                {draftCount > 0
                  ? `You have an unfinished questionnaire in progress (${draftCount} of 35 goals rated).`
                  : "Your completed assessment and learning report are saved in this browser."}
              </span>
            </div>
            <div className="flex gap-2 shrink-0">
              {draftCount > 0 && (
                <button
                  type="button"
                  onClick={onResume}
                  className="px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  Resume ({draftCount}/35)
                </button>
              )}
              {hasSavedResults && (
                <button
                  type="button"
                  onClick={onViewResults}
                  className="px-3.5 py-2 rounded-lg bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                >
                  Open Results & Lab
                </button>
              )}
            </div>
          </div>
        )}

        {/* Primary CTA + Sample preview */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-1">
          <button
            type="button"
            onClick={onStart}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 text-sm font-semibold shadow-sm transition-colors cursor-pointer"
          >
            {hasSavedResults || draftCount > 0 ? "Start Fresh Assessment" : "Start 35-Item Assessment"}
            <ArrowRight size={16} />
          </button>

          <button
            type="button"
            onClick={onLoadSample}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors cursor-pointer"
          >
            <Sparkles size={14} className="text-indigo-500" />
            Explore learning lab with sample profile
          </button>
        </div>

        {/* How the instrument works */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/70 dark:border-slate-800">
            <div className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5 mb-1">
              <Layers size={14} className="text-indigo-600 dark:text-indigo-400" />
              35 Goals · 3 Lenses
            </div>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
              For each goal, rate how <strong>important</strong> it is, how <strong>likely</strong>{" "}
              you are to reach it, and how much you&apos;ve <strong>already attained</strong>.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/70 dark:border-slate-800">
            <div className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5 mb-1">
              <EyeOff size={14} className="text-emerald-600 dark:text-emerald-400" />
              Blind Subscales First
            </div>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
              Category labels stay hidden while you answer so social desirability doesn&apos;t skew
              your ratings—then all 7 subscales unlock in your debrief.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/70 dark:border-slate-800">
            <div className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5 mb-1">
              <BookOpen size={14} className="text-amber-600 dark:text-amber-400" />
              100% Local & Private
            </div>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
              No accounts, servers, or tracking. Every score, chart, and journal note stays strictly
              in your own browser.
            </p>
          </div>
        </div>
      </section>

      {/* Core Concept Primer: The 3 Basic Psychological Needs */}
      <section className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-5">
        <div className="space-y-1.5">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">
            The Theoretical Lens · Deci &amp; Ryan (2000)
          </h2>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            Why Some Goals Energize Us More Than Others
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Just as plants need sunlight, water, and soil to thrive, Self-Determination Theory
            identifies <strong>three universal psychological needs</strong>.{" "}
            <strong className="text-emerald-700 dark:text-emerald-400">Intrinsic aspirations</strong>{" "}
            (personal growth, close relationships, community contribution) satisfy these needs
            directly, whereas{" "}
            <strong className="text-amber-700 dark:text-amber-400">extrinsic aspirations</strong>{" "}
            (wealth, fame, image) depend on external comparison and others&apos; approval.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {BASIC_NEEDS.map((need) => (
            <div
              key={need.id}
              className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-2"
            >
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {need.name}
                </h4>
                <span className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400">
                  {need.tagline}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {need.definition}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

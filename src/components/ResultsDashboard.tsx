import { useEffect, useState } from "react";
import { analyzeAspirations, buildOrientationPortrait, generateReflectionPrompts } from "../scoring";
import { GoalRatings } from "../types";
import SdtLearningLab from "./SdtLearningLab";
import Visualizers from "./Visualizers";
import {
  BarChart3,
  BookOpen,
  Compass,
  PenLine,
  Pencil,
  Printer,
  RotateCcw,
  Sparkles,
} from "lucide-react";

interface ResultsDashboardProps {
  ratings: Record<number, GoalRatings>;
  isSample: boolean;
  onEditAnswers: () => void;
  onStartOwnAssessment: () => void;
  onReset: () => void;
}

const REFLECTIONS_STORAGE_KEY = "aspiration_index_reflections_v1";

export default function ResultsDashboard({
  ratings,
  isSample,
  onEditAnswers,
  onStartOwnAssessment,
  onReset,
}: ResultsDashboardProps) {
  const [activeSection, setActiveSection] = useState<"scores" | "concepts" | "reflections">(
    "scores",
  );
  const [notes, setNotes] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem(REFLECTIONS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    if (!isSample) {
      localStorage.setItem(REFLECTIONS_STORAGE_KEY, JSON.stringify(notes));
    }
  }, [notes, isSample]);

  const analysis = analyzeAspirations(ratings);
  const portrait = buildOrientationPortrait(analysis);
  const prompts = generateReflectionPrompts(analysis);

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Sample Mode Banner */}
      {isSample && (
        <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 print:hidden">
          <div className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-200">
            <Sparkles size={16} className="text-indigo-600 dark:text-indigo-400 shrink-0" />
            <span>
              <strong>Sample Profile Active:</strong> You are exploring the learning lab with
              illustrative ratings. Take the assessment anytime to generate your own profile.
            </span>
          </div>
          <button
            type="button"
            onClick={onStartOwnAssessment}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shrink-0 transition-colors cursor-pointer"
          >
            Take Your Own Assessment
          </button>
        </div>
      )}

      {/* Personalized Orientation Portrait Header */}
      <section className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
                <Compass size={12} /> {portrait.badge}
              </span>
              <span className="text-[11px] font-medium text-slate-400">
                Personal Mean Importance: {analysis.overallMeanImportance.toFixed(2)} / 7
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-950 dark:text-slate-50">
              {portrait.headline}
            </h1>
          </div>

          <div className="flex flex-wrap gap-2 shrink-0 print:hidden">
            {!isSample && (
              <button
                type="button"
                onClick={onEditAnswers}
                className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Review or revise your 35 answers"
              >
                <Pencil size={13} /> Edit Answers
              </button>
            )}
            <button
              type="button"
              onClick={() => window.print()}
              className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Print report and reflection notes"
            >
              <Printer size={13} /> Print
            </button>
            <button
              type="button"
              onClick={onReset}
              className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-600 dark:text-rose-400 border border-slate-200 dark:border-slate-800 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Clear saved scores"
            >
              <RotateCcw size={13} /> {isSample ? "Exit Sample" : "Reset"}
            </button>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          {portrait.summary}
        </p>

        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
          <strong className="text-slate-900 dark:text-slate-100">Learning Lens:</strong>{" "}
          {portrait.keyTakeaway}
        </div>
      </section>

      {/* Interactive Learning Section Switcher */}
      <nav
        aria-label="Learning lab sections"
        className="grid grid-cols-3 gap-2 bg-slate-100 dark:bg-slate-900 p-1 rounded-2xl border border-slate-200 dark:border-slate-800 print:hidden"
      >
        <button
          type="button"
          onClick={() => setActiveSection("scores")}
          className={`py-2.5 px-3 rounded-xl text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
            activeSection === "scores"
              ? "bg-white dark:bg-slate-950 text-slate-950 dark:text-white shadow-xs"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
          }`}
        >
          <BarChart3 size={14} />
          <span>1. Scores &amp; Gaps</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection("concepts")}
          className={`py-2.5 px-3 rounded-xl text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
            activeSection === "concepts"
              ? "bg-white dark:bg-slate-950 text-slate-950 dark:text-white shadow-xs"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
          }`}
        >
          <BookOpen size={14} />
          <span>2. SDT Concepts</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection("reflections")}
          className={`py-2.5 px-3 rounded-xl text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
            activeSection === "reflections"
              ? "bg-white dark:bg-slate-950 text-slate-950 dark:text-white shadow-xs"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
          }`}
        >
          <PenLine size={14} />
          <span>3. Guided Reflection</span>
        </button>
      </nav>

      {/* Section 1: Score & Subscale Explorer (always visible when printing) */}
      <div className={activeSection === "scores" ? "block" : "hidden print:block"}>
        <Visualizers analysis={analysis} ratings={ratings} />
      </div>

      {/* Section 2: SDT Concepts Lab (always visible when printing) */}
      <div className={activeSection === "concepts" ? "block" : "hidden print:block"}>
        <SdtLearningLab analysis={analysis} />
      </div>

      {/* Section 3: Guided Self-Reflection Prompts & Local Journal (always visible when printing) */}
      <div className={activeSection === "reflections" ? "block" : "hidden print:block"}>
        <section className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-5">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              Applied Self-Reflection · Tailored to Your Scores
            </span>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
              Turn Your Scores Into Personal Insight
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Use these four questions for personal journaling or seminar discussion. Anything you
              write below stays strictly in this browser (and prints cleanly if you save as PDF).
            </p>
          </div>

          <div className="space-y-4">
            {prompts.map((prompt) => (
              <div
                key={prompt.id}
                className="p-5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    {prompt.tag}
                  </span>
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/60">
                    {prompt.sdtConcept}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {prompt.title}
                </h3>

                <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                  {prompt.personalContext}
                </p>

                <p className="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
                  {prompt.question}
                </p>

                <textarea
                  rows={3}
                  value={notes[prompt.id] ?? ""}
                  onChange={(e) =>
                    setNotes((prev) => ({
                      ...prev,
                      [prompt.id]: e.target.value,
                    }))
                  }
                  placeholder="Jot down your thoughts or class reflection notes here (optional, saved locally)..."
                  className="w-full rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3.5 py-2.5 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/25 resize-y"
                />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

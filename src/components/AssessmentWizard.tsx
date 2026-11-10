import { useEffect, useRef, useState } from "react";
import { ASPIRATION_GOALS } from "../data";
import { GoalRatings, PartialGoalRatings, RatingDimension } from "../types";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Keyboard,
  LayoutList,
  Rows3,
} from "lucide-react";

interface AssessmentWizardProps {
  initialDraft: Record<number, PartialGoalRatings>;
  onSaveDraft: (draft: Record<number, PartialGoalRatings>, currentIndex: number) => void;
  onComplete: (ratings: Record<number, GoalRatings>) => void;
  onCancel: () => void;
  initialIndex?: number;
}

const DIMENSIONS: {
  key: RatingDimension;
  shortLabel: string;
  question: string;
  lowAnchor: string;
  midAnchor: string;
  highAnchor: string;
}[] = [
  {
    key: "importance",
    shortLabel: "Importance",
    question: "How important is this goal to you?",
    lowAnchor: "Not at all",
    midAnchor: "Moderately",
    highAnchor: "Very important",
  },
  {
    key: "likelihood",
    shortLabel: "Likelihood",
    question: "How likely is it that you will attain this goal in your future?",
    lowAnchor: "Very unlikely",
    midAnchor: "Moderately",
    highAnchor: "Very likely",
  },
  {
    key: "attainment",
    shortLabel: "Attainment",
    question: "How much have you already achieved this goal so far?",
    lowAnchor: "Not at all",
    midAnchor: "Moderately",
    highAnchor: "Completely",
  },
];

function isGoalComplete(entry?: PartialGoalRatings): entry is GoalRatings {
  return Boolean(
    entry &&
      typeof entry.importance === "number" &&
      typeof entry.likelihood === "number" &&
      typeof entry.attainment === "number",
  );
}

export default function AssessmentWizard({
  initialDraft,
  onSaveDraft,
  onComplete,
  onCancel,
  initialIndex = 0,
}: AssessmentWizardProps) {
  const totalGoals = ASPIRATION_GOALS.length;
  const [viewMode, setViewMode] = useState<"card" | "batch">("card");
  const [autoAdvance, setAutoAdvance] = useState<boolean>(true);
  const [currentIndex, setCurrentIndex] = useState<number>(() =>
    Math.min(Math.max(initialIndex, 0), totalGoals - 1),
  );
  const [activeDim, setActiveDim] = useState<RatingDimension>("importance");
  const [draft, setDraft] = useState<Record<number, PartialGoalRatings>>(initialDraft);
  const advanceTimerRef = useRef<number | null>(null);

  const currentGoal = ASPIRATION_GOALS[currentIndex];
  const completedCount = ASPIRATION_GOALS.filter((g) => isGoalComplete(draft[g.id])).length;
  const firstIncompleteIndex = ASPIRATION_GOALS.findIndex((g) => !isGoalComplete(draft[g.id]));

  // Persist draft whenever ratings or index change
  useEffect(() => {
    onSaveDraft(draft, currentIndex);
  }, [draft, currentIndex, onSaveDraft]);

  // Clean up any pending auto-advance timeout on unmount
  useEffect(() => {
    return () => {
      if (advanceTimerRef.current !== null) {
        window.clearTimeout(advanceTimerRef.current);
      }
    };
  }, []);

  // Sync keyboard focus row to the first unanswered dimension when changing cards
  useEffect(() => {
    const entry = draft[currentGoal.id];
    if (!entry?.importance) setActiveDim("importance");
    else if (!entry?.likelihood) setActiveDim("likelihood");
    else setActiveDim("attainment");
  }, [currentIndex, currentGoal.id]);

  const setGoalRating = (goalId: number, dimension: RatingDimension, value: number) => {
    if (advanceTimerRef.current !== null) {
      window.clearTimeout(advanceTimerRef.current);
      advanceTimerRef.current = null;
    }

    const prevEntry = draft[goalId] ?? {};
    const wasAlreadyComplete = isGoalComplete(prevEntry);
    const updatedEntry: PartialGoalRatings = {
      ...prevEntry,
      [dimension]: value,
    };

    const nextDraft = {
      ...draft,
      [goalId]: updatedEntry,
    };
    setDraft(nextDraft);

    if (viewMode === "card" && goalId === currentGoal.id) {
      if (!updatedEntry.importance) {
        setActiveDim("importance");
      } else if (!updatedEntry.likelihood) {
        setActiveDim("likelihood");
      } else if (!updatedEntry.attainment) {
        setActiveDim("attainment");
      } else if (autoAdvance && !wasAlreadyComplete && currentIndex < totalGoals - 1) {
        advanceTimerRef.current = window.setTimeout(() => {
          setCurrentIndex((idx) => Math.min(idx + 1, totalGoals - 1));
          advanceTimerRef.current = null;
        }, 220);
      }
    }
  };

  // Keyboard support in Focused Card mode: 1-7 rates active dimension, arrows navigate
  useEffect(() => {
    if (viewMode !== "card") return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key >= "1" && e.key <= "7") {
        e.preventDefault();
        setGoalRating(currentGoal.id, activeDim, Number(e.key));
      } else if (e.key === "ArrowLeft" && currentIndex > 0) {
        e.preventDefault();
        setCurrentIndex((i) => i - 1);
      } else if (e.key === "ArrowRight" && currentIndex < totalGoals - 1) {
        e.preventDefault();
        setCurrentIndex((i) => i + 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  const handleFinish = () => {
    if (firstIncompleteIndex !== -1) {
      setCurrentIndex(firstIncompleteIndex);
      return;
    }
    const finalRatings: Record<number, GoalRatings> = {};
    ASPIRATION_GOALS.forEach((g) => {
      const entry = draft[g.id];
      if (isGoalComplete(entry)) {
        finalRatings[g.id] = entry;
      }
    });
    onComplete(finalRatings);
  };

  // Batch (5 per page) pagination helpers
  const batchSize = 5;
  const currentBatchPage = Math.floor(currentIndex / batchSize);
  const totalBatchPages = Math.ceil(totalGoals / batchSize);
  const batchGoals = ASPIRATION_GOALS.slice(
    currentBatchPage * batchSize,
    currentBatchPage * batchSize + batchSize,
  );

  return (
    <div className="max-w-2xl mx-auto space-y-5 animate-fade-in">
      {/* Top Control Bar */}
      <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 flex flex-wrap items-center justify-between gap-3 shadow-sm">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-colors cursor-pointer"
        >
          <ArrowLeft size={14} /> Save &amp; Exit
        </button>

        <div className="flex items-center gap-2">
          {/* View mode toggle */}
          <div className="inline-flex rounded-lg bg-slate-100 dark:bg-slate-900 p-0.5 border border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setViewMode("card")}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer ${
                viewMode === "card"
                  ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-xs"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
              }`}
              title="One goal at a time with keyboard shortcuts"
            >
              <Rows3 size={12} /> Single Card
            </button>
            <button
              type="button"
              onClick={() => setViewMode("batch")}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer ${
                viewMode === "batch"
                  ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-xs"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
              }`}
              title="Rate 5 goals per page"
            >
              <LayoutList size={12} /> 5 per Page
            </button>
          </div>

          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800">
            {completedCount} / {totalGoals} complete
          </span>
        </div>
      </div>

      {/* Interactive 35-item Step Rail */}
      <div className="space-y-1.5">
        <div
          className="grid gap-1"
          style={{ gridTemplateColumns: `repeat(${totalGoals}, minmax(0, 1fr))` }}
          aria-label="Questionnaire progress"
        >
          {ASPIRATION_GOALS.map((goal, idx) => {
            const done = isGoalComplete(draft[goal.id]);
            const isActive =
              viewMode === "card"
                ? idx === currentIndex
                : Math.floor(idx / batchSize) === currentBatchPage;
            return (
              <button
                key={goal.id}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                title={`Goal ${idx + 1}${done ? " (rated)" : " (unrated)"}`}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  isActive
                    ? "bg-indigo-600 dark:bg-indigo-400 ring-2 ring-indigo-500/30"
                    : done
                    ? "bg-emerald-500 dark:bg-emerald-500/80 hover:bg-emerald-600"
                    : "bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700"
                }`}
              />
            );
          })}
        </div>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 flex justify-between">
          <span>Answer honestly for your life as it is—there are no right or wrong scores.</span>
          {completedCount === totalGoals && (
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
              All 35 goals rated!
            </span>
          )}
        </p>
      </div>

      {/* SINGLE CARD MODE */}
      {viewMode === "card" && (
        <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              Life Goal {currentIndex + 1} of {totalGoals}
            </span>

            <label className="inline-flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={autoAdvance}
                onChange={(e) => setAutoAdvance(e.target.checked)}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              Auto-next card
            </label>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-950 dark:text-slate-50 leading-snug">
            &ldquo;{currentGoal.text}&rdquo;
          </h2>

          {/* Three Rating Dimensions */}
          <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800">
            {DIMENSIONS.map((dim) => {
              const selectedValue = draft[currentGoal.id]?.[dim.key];
              const isFocusedRow = activeDim === dim.key;

              return (
                <div
                  key={dim.key}
                  onClick={() => setActiveDim(dim.key)}
                  className={`p-3.5 rounded-xl border transition-colors ${
                    isFocusedRow
                      ? "border-indigo-300 dark:border-indigo-700 bg-indigo-50/30 dark:bg-indigo-950/20"
                      : "border-slate-200/70 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/30"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span className="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200">
                      {dim.question}
                    </span>
                    {typeof selectedValue === "number" ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800/60 shrink-0">
                        <Check size={11} /> {selectedValue}/7
                      </span>
                    ) : (
                      <span className="text-[11px] font-medium text-slate-400 shrink-0">
                        Select 1–7
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
                    {[1, 2, 3, 4, 5, 6, 7].map((num) => {
                      const active = selectedValue === num;
                      return (
                        <button
                          key={num}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setGoalRating(currentGoal.id, dim.key, num);
                          }}
                          className={`h-10 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                            active
                              ? "bg-slate-900 dark:bg-white text-white dark:text-slate-950 shadow-xs scale-[1.02]"
                              : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500"
                          }`}
                        >
                          {num}
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex justify-between text-[10px] font-medium text-slate-400 mt-1.5 px-0.5">
                    <span>1 · {dim.lowAnchor}</span>
                    <span>4 · {dim.midAnchor}</span>
                    <span>7 · {dim.highAnchor}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-slate-400 pt-1">
            <Keyboard size={13} />
            <span>
              Tip: Press keys <strong>1–7</strong> to rate the highlighted row, and{" "}
              <strong>← / →</strong> to move between goals.
            </span>
          </div>
        </div>
      )}

      {/* 5-PER-PAGE BATCH MODE */}
      {viewMode === "batch" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              Page {currentBatchPage + 1} of {totalBatchPages} (Goals{" "}
              {currentBatchPage * batchSize + 1}–
              {Math.min((currentBatchPage + 1) * batchSize, totalGoals)})
            </span>
            <span>Scale: 1 (Not at all) · 4 (Moderately) · 7 (Very much)</span>
          </div>

          {batchGoals.map((goal) => {
            const entry = draft[goal.id];
            const complete = isGoalComplete(entry);
            return (
              <div
                key={goal.id}
                className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Goal {goal.id}
                    </span>
                    <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                      &ldquo;{goal.text}&rdquo;
                    </h3>
                  </div>
                  {complete && (
                    <CheckCircle2
                      size={18}
                      className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-1"
                    />
                  )}
                </div>

                <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                  {DIMENSIONS.map((dim) => {
                    const selected = entry?.[dim.key];
                    return (
                      <div
                        key={dim.key}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                      >
                        <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                          <strong className="text-slate-800 dark:text-slate-100">
                            {dim.shortLabel}:
                          </strong>{" "}
                          {dim.question}
                        </span>
                        <div className="grid grid-cols-7 gap-1 shrink-0 sm:w-64">
                          {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                            <button
                              key={num}
                              type="button"
                              onClick={() => setGoalRating(goal.id, dim.key, num)}
                              className={`h-8 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                                selected === num
                                  ? "bg-slate-900 dark:bg-white text-white dark:text-slate-950"
                                  : "bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-slate-400"
                              }`}
                            >
                              {num}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Bottom Navigation & Completion Action */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
        {viewMode === "card" ? (
          <>
            <button
              type="button"
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
              className="px-4 py-3 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft size={14} /> Previous Goal
            </button>

            {currentIndex < totalGoals - 1 && completedCount < totalGoals ? (
              <button
                type="button"
                onClick={() => setCurrentIndex((i) => Math.min(totalGoals - 1, i + 1))}
                className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold inline-flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer"
              >
                Next Goal <ArrowRight size={14} />
              </button>
            ) : completedCount === totalGoals ? (
              <button
                type="button"
                onClick={handleFinish}
                className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold inline-flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer"
              >
                Reveal Subscales &amp; Learning Report <ArrowRight size={14} />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setCurrentIndex(firstIncompleteIndex)}
                className="px-5 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold inline-flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer"
              >
                Jump to Unrated Goal #{firstIncompleteIndex + 1} ({totalGoals - completedCount} left)
              </button>
            )}
          </>
        ) : (
          <>
            <button
              type="button"
              disabled={currentBatchPage === 0}
              onClick={() => setCurrentIndex(Math.max(0, (currentBatchPage - 1) * batchSize))}
              className="px-4 py-3 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft size={14} /> Previous Page
            </button>

            {currentBatchPage < totalBatchPages - 1 && completedCount < totalGoals ? (
              <button
                type="button"
                onClick={() =>
                  setCurrentIndex(Math.min(totalGoals - 1, (currentBatchPage + 1) * batchSize))
                }
                className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold inline-flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer"
              >
                Next Page <ArrowRight size={14} />
              </button>
            ) : completedCount === totalGoals ? (
              <button
                type="button"
                onClick={handleFinish}
                className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold inline-flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer"
              >
                Reveal Subscales &amp; Learning Report <ArrowRight size={14} />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setCurrentIndex(firstIncompleteIndex)}
                className="px-5 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold inline-flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer"
              >
                Go to Unrated Goal #{firstIncompleteIndex + 1} ({totalGoals - completedCount} left)
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

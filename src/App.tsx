import { useCallback, useState } from "react";
import AssessmentWizard from "./components/AssessmentWizard";
import Introduction from "./components/Introduction";
import ResultsDashboard from "./components/ResultsDashboard";
import { ASPIRATION_GOALS, createSampleRatings } from "./data";
import { GoalRatings, PartialGoalRatings } from "./types";
import { Compass } from "lucide-react";

const STORAGE_KEYS = {
  results: "aspiration_index_results",
  draft: "aspiration_index_draft",
  draftIndex: "aspiration_index_draft_index",
  reflections: "aspiration_index_reflections_v1",
} as const;

function readJsonStorage<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function countCompletedDraftItems(draft: Record<number, PartialGoalRatings>): number {
  return ASPIRATION_GOALS.filter((g) => {
    const entry = draft[g.id];
    return (
      entry &&
      typeof entry.importance === "number" &&
      typeof entry.likelihood === "number" &&
      typeof entry.attainment === "number"
    );
  }).length;
}

export default function App() {
  const [completedRatings, setCompletedRatings] = useState<Record<number, GoalRatings> | null>(() =>
    readJsonStorage<Record<number, GoalRatings>>(STORAGE_KEYS.results),
  );
  const [draftRatings, setDraftRatings] = useState<Record<number, PartialGoalRatings>>(
    () => readJsonStorage<Record<number, PartialGoalRatings>>(STORAGE_KEYS.draft) ?? {},
  );
  const [draftIndex, setDraftIndex] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.draftIndex);
    const parsed = saved ? Number.parseInt(saved, 10) : 0;
    return Number.isFinite(parsed) ? parsed : 0;
  });

  const [mode, setMode] = useState<"intro" | "wizard" | "results">(() =>
    readJsonStorage<Record<number, GoalRatings>>(STORAGE_KEYS.results) ? "results" : "intro",
  );
  const [isViewingSample, setIsViewingSample] = useState<boolean>(false);

  const handleSaveDraft = useCallback(
    (nextDraft: Record<number, PartialGoalRatings>, index: number) => {
      setDraftRatings(nextDraft);
      setDraftIndex(index);
      if (Object.keys(nextDraft).length > 0) {
        localStorage.setItem(STORAGE_KEYS.draft, JSON.stringify(nextDraft));
        localStorage.setItem(STORAGE_KEYS.draftIndex, String(index));
      }
    },
    [],
  );

  const handleStartFresh = () => {
    setIsViewingSample(false);
    setDraftRatings({});
    setDraftIndex(0);
    localStorage.removeItem(STORAGE_KEYS.draft);
    localStorage.removeItem(STORAGE_KEYS.draftIndex);
    setMode("wizard");
  };

  const handleResumeDraft = () => {
    setIsViewingSample(false);
    setMode("wizard");
  };

  const handleLoadSample = () => {
    setIsViewingSample(true);
    setMode("results");
  };

  const handleWizardComplete = (finalRatings: Record<number, GoalRatings>) => {
    setCompletedRatings(finalRatings);
    setIsViewingSample(false);
    setDraftRatings({});
    setDraftIndex(0);
    localStorage.setItem(STORAGE_KEYS.results, JSON.stringify(finalRatings));
    localStorage.removeItem(STORAGE_KEYS.draft);
    localStorage.removeItem(STORAGE_KEYS.draftIndex);
    setMode("results");
  };

  const handleEditAnswers = () => {
    if (!completedRatings) return;
    setDraftRatings(completedRatings);
    setDraftIndex(0);
    setIsViewingSample(false);
    setMode("wizard");
  };

  const handleReset = () => {
    if (isViewingSample) {
      setIsViewingSample(false);
      setMode("intro");
      return;
    }

    if (
      window.confirm(
        "Clear your saved ratings and reflection notes from this browser and start fresh?",
      )
    ) {
      setCompletedRatings(null);
      setDraftRatings({});
      setDraftIndex(0);
      setIsViewingSample(false);
      localStorage.removeItem(STORAGE_KEYS.results);
      localStorage.removeItem(STORAGE_KEYS.draft);
      localStorage.removeItem(STORAGE_KEYS.draftIndex);
      localStorage.removeItem(STORAGE_KEYS.reflections);
      // Clean up legacy storage keys from earlier versions if present
      localStorage.removeItem("aspiration_index_profile");
      localStorage.removeItem("aspiration_index_ai_feedback");
      setMode("intro");
    }
  };

  const draftCount = countCompletedDraftItems(draftRatings);
  const activeResultsRatings = isViewingSample ? createSampleRatings() : completedRatings;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-sans">
      <header className="sticky top-0 z-40 bg-white/85 dark:bg-slate-950/85 backdrop-blur border-b border-slate-200 dark:border-slate-800 print:hidden">
        <div className="max-w-5xl mx-auto px-4 py-3.5 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => setMode("intro")}
            className="flex items-center gap-2.5 text-left group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-slate-900 dark:bg-white flex items-center justify-center text-white dark:text-slate-900 shadow-xs">
              <Compass size={16} />
            </div>
            <div>
              <span className="font-bold text-sm tracking-tight text-slate-950 dark:text-slate-100 block group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                Aspiration Index
              </span>
              <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 block -mt-0.5">
                Self-Determination Theory Lab
              </span>
            </div>
          </button>

          <div className="flex items-center gap-2 text-xs">
            {mode !== "intro" && (
              <button
                type="button"
                onClick={() => setMode("intro")}
                className="px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 font-medium transition-colors cursor-pointer"
              >
                Overview
              </button>
            )}
            {completedRatings && mode !== "results" && (
              <button
                type="button"
                onClick={() => {
                  setIsViewingSample(false);
                  setMode("results");
                }}
                className="px-3 py-1.5 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-semibold transition-colors cursor-pointer"
              >
                Your Results
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 sm:py-10 print:py-0">
        {mode === "intro" && (
          <Introduction
            onStart={handleStartFresh}
            onLoadSample={handleLoadSample}
            draftCount={draftCount}
            onResume={handleResumeDraft}
            hasSavedResults={Boolean(completedRatings)}
            onViewResults={() => {
              setIsViewingSample(false);
              setMode("results");
            }}
          />
        )}

        {mode === "wizard" && (
          <AssessmentWizard
            initialDraft={draftRatings}
            initialIndex={draftIndex}
            onSaveDraft={handleSaveDraft}
            onComplete={handleWizardComplete}
            onCancel={() => setMode("intro")}
          />
        )}

        {mode === "results" && activeResultsRatings && (
          <ResultsDashboard
            ratings={activeResultsRatings}
            isSample={isViewingSample}
            onEditAnswers={handleEditAnswers}
            onStartOwnAssessment={handleStartFresh}
            onReset={handleReset}
          />
        )}
      </main>
    </div>
  );
}

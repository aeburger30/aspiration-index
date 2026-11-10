import { useState, useEffect } from "react";
import { AspirationCategory, CategoryScore, FactorScores, GoalRatings, StudentProfile } from "./types";
import { ASPIRATION_CATEGORIES, ASPIRATION_GOALS } from "./data";
import Introduction from "./components/Introduction";
import AssessmentWizard from "./components/AssessmentWizard";
import ResultsDashboard from "./components/ResultsDashboard";
import { Compass, Sparkles, BookOpen, User } from "lucide-react";

export default function App() {
  const [appMode, setAppMode] = useState<"intro" | "wizard" | "results">("intro");
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [ratings, setRatings] = useState<Record<number, GoalRatings>>({});

  // 1. Initial State Hydration from Browser LocalStorage on Mount
  useEffect(() => {
    const savedProfile = localStorage.getItem("aspiration_index_profile");
    const savedRatings = localStorage.getItem("aspiration_index_results");

    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }

    if (savedRatings) {
      setRatings(JSON.parse(savedRatings));
      setAppMode("results");
    } else {
      // Check if there is an active wizard progress draft
      const activeDraft = localStorage.getItem("aspiration_index_draft");
      if (activeDraft) {
        setRatings(JSON.parse(activeDraft));
      }
    }
  }, []);

  // Sync draft and profile data when profile updates
  useEffect(() => {
    if (profile) {
      localStorage.setItem("aspiration_index_profile", JSON.stringify(profile));
    } else {
      localStorage.removeItem("aspiration_index_profile");
    }
  }, [profile]);

  // Check state to deduce active buttons in intro screen
  const hasSavedSession = localStorage.getItem("aspiration_index_draft") !== null;
  const hasSavedResults = localStorage.getItem("aspiration_index_results") !== null;

  const handleStart = (studentProfile: StudentProfile) => {
    setProfile(studentProfile);
    setAppMode("wizard");
  };

  const handleResumeProgress = () => {
    const draft = localStorage.getItem("aspiration_index_draft");
    if (draft) {
      setRatings(JSON.parse(draft));
    }
    setAppMode("wizard");
  };

  const handleViewResults = () => {
    const saved = localStorage.getItem("aspiration_index_results");
    if (saved) {
      setRatings(JSON.parse(saved));
    }
    setAppMode("results");
  };

  const handleWizardComplete = (finalRatings: Record<number, GoalRatings>) => {
    setRatings(finalRatings);
    // Write completed assessments directly into localstorage
    localStorage.setItem("aspiration_index_results", JSON.stringify(finalRatings));
    // Clear the active draft since progress is finished
    localStorage.removeItem("aspiration_index_draft");
    localStorage.removeItem("aspiration_index_draft_index");
    setAppMode("results");
  };

  const handleWizardCancel = () => {
    setAppMode("intro");
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to clear your current progress and results? This deletes your offline ratings from your browser storage to protect your privacy.")) {
      setRatings({});
      setProfile(null);
      setAppMode("intro");
      localStorage.removeItem("aspiration_index_results");
      localStorage.removeItem("aspiration_index_profile");
      localStorage.removeItem("aspiration_index_draft");
      localStorage.removeItem("aspiration_index_draft_index");
      localStorage.removeItem("aspiration_index_ai_feedback");
    }
  };

  // 2. Core Scoring Framework (Self-Determination Theory Matrix Parsing)
  const computeAspirationScores = (): Record<AspirationCategory, CategoryScore> => {
    const scores: Record<AspirationCategory, CategoryScore> = {} as any;

    ASPIRATION_CATEGORIES.forEach((cat) => {
      const catGoals = ASPIRATION_GOALS.filter((g) => g.category === cat.name);
      let totalImportance = 0;
      let totalLikelihood = 0;
      let totalAttainment = 0;

      catGoals.forEach((goal) => {
        const rating = ratings[goal.id] || { importance: 4, likelihood: 4, attainment: 4 };
        totalImportance += rating.importance;
        totalLikelihood += rating.likelihood;
        totalAttainment += rating.attainment;
      });

      scores[cat.name] = {
        importance: totalImportance / catGoals.length,
        likelihood: totalLikelihood / catGoals.length,
        attainment: totalAttainment / catGoals.length,
      };
    });

    return scores;
  };

  const computeFactorScores = (scores: Record<AspirationCategory, CategoryScore>): FactorScores => {
    const intrinsicCats: AspirationCategory[] = ["Personal growth", "Relationships", "Community"];
    const extrinsicCats: AspirationCategory[] = ["Wealth", "Fame", "Image"];

    const getAverageForList = (cats: AspirationCategory[], metric: keyof CategoryScore): number => {
      const sum = cats.reduce((acc, cat) => acc + scores[cat][metric], 0);
      return sum / cats.length;
    };

    const intrinsicImportance = getAverageForList(intrinsicCats, "importance");
    const extrinsicImportance = getAverageForList(extrinsicCats, "importance");

    return {
      intrinsicImportance,
      extrinsicImportance,
      intrinsicLikelihood: getAverageForList(intrinsicCats, "likelihood"),
      extrinsicLikelihood: getAverageForList(extrinsicCats, "likelihood"),
      intrinsicAttainment: getAverageForList(intrinsicCats, "attainment"),
      extrinsicAttainment: getAverageForList(extrinsicCats, "attainment"),
      relativeIntrinsicIndex: intrinsicImportance - extrinsicImportance,
    };
  };

  const finalScores = appMode === "results" ? computeAspirationScores() : null;
  const factorScores = finalScores ? computeFactorScores(finalScores) : null;

  return (
    <div className="min-h-screen bg-slate-55 dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-sans transition-colors duration-200">
      {/* Upper Navigation Bar */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur border-b border-slate-200/50 dark:border-slate-800/50 print:hidden select-none">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-slate-900 dark:bg-white flex items-center justify-center text-white dark:text-slate-900 shadow-sm border border-slate-200 dark:border-slate-800">
              <Compass size={16} />
            </div>
            <div>
              <span className="font-semibold text-sm tracking-tight text-slate-950 dark:text-slate-100 block">Aspirations Index Lab</span>
              <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block -mt-1">Self-Determination Research</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {profile && (
              <div className="hidden sm:flex items-center gap-1.5 text-[10px] font-bold text-slate-500 bg-slate-50 dark:bg-slate-900 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 font-medium">
                <User size={12} />
                <span>{profile.ageGroup}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 dark:bg-slate-905 px-2.5 py-1 rounded border border-slate-200 dark:border-slate-800">
              <BookOpen size={11} className="text-slate-500" />
              <span>Offline Persistence</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container Stage */}
      <main className="max-w-6xl mx-auto px-4 py-10 print:py-0">
        {appMode === "intro" && (
          <Introduction
            onStart={handleStart}
            hasSavedSession={hasSavedSession}
            onResume={handleResumeProgress}
            hasSavedResults={hasSavedResults}
            onViewResults={handleViewResults}
          />
        )}

        {appMode === "wizard" && (
          <AssessmentWizard
            onComplete={handleWizardComplete}
            onCancel={handleWizardCancel}
            savedRatings={ratings}
          />
        )}

        {appMode === "results" && finalScores && factorScores && profile && (
          <ResultsDashboard
            scores={finalScores}
            factorScores={factorScores}
            profile={profile}
            onReset={handleReset}
          />
        )}
      </main>
    </div>
  );
}

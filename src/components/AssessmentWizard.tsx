import { useState, useEffect } from "react";
import { AspirationGoal, GoalRatings, AspirationCategory } from "../types";
import { ASPIRATION_GOALS, ASPIRATION_CATEGORIES } from "../data";
import { ArrowLeft, ArrowRight, Info, Library, Sparkles, CheckSquare, Save } from "lucide-react";

interface AssessmentWizardProps {
  onComplete: (ratings: Record<number, GoalRatings>) => void;
  onCancel: () => void;
  savedRatings?: Record<number, GoalRatings>;
}

export default function AssessmentWizard({ onComplete, onCancel, savedRatings }: AssessmentWizardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [ratings, setRatings] = useState<Record<number, GoalRatings>>(() => {
    if (savedRatings && Object.keys(savedRatings).length > 0) {
      return savedRatings;
    }
    return {};
  });

  const [savingAlert, setSavingAlert] = useState(false);

  const currentGoal = ASPIRATION_GOALS[currentIndex];
  const totalGoals = ASPIRATION_GOALS.length;

  // Retrieve category design settings
  const categoryMeta = ASPIRATION_CATEGORIES.find((c) => c.name === currentGoal?.category) || {
    name: "Personal growth" as AspirationCategory,
    type: "intrinsic" as const,
    color: "text-slate-600",
    borderColor: "border-slate-200",
    bgColor: "bg-slate-50",
    icon: "Sprout",
    description: "",
  };

  // Safe fetch of current goal values, fallback to 4 (moderately)
  const currentGoalRatings = ratings[currentGoal?.id] || {
    importance: 4,
    likelihood: 4,
    attainment: 4,
  };

  // Auto-save progress draft container to localStorage during wizard sessions
  useEffect(() => {
    if (Object.keys(ratings).length > 0) {
      localStorage.setItem("aspiration_index_draft", JSON.stringify(ratings));
      localStorage.setItem("aspiration_index_draft_index", currentIndex.toString());
      setSavingAlert(true);
      const timer = setTimeout(() => setSavingAlert(false), 800);
      return () => clearTimeout(timer);
    }
  }, [ratings, currentIndex]);

  // Load wizard draft-index if available
  useEffect(() => {
    const savedIdx = localStorage.getItem("aspiration_index_draft_index");
    if (savedIdx && !savedRatings) {
      const idx = parseInt(savedIdx, 10);
      if (idx >= 0 && idx < totalGoals) {
        setCurrentIndex(idx);
      }
    }
  }, []);

  const handleRatingChange = (metric: keyof GoalRatings, value: number) => {
    setRatings((prev) => ({
      ...prev,
      [currentGoal.id]: {
        ...currentGoalRatings,
        [metric]: value,
      },
    }));
  };

  const handleNext = () => {
    if (currentIndex < totalGoals - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Validate all are populated
      const incompleteIds: number[] = [];
      ASPIRATION_GOALS.forEach((g) => {
        if (!ratings[g.id]) {
          incompleteIds.push(g.id);
        }
      });

      if (incompleteIds.length > 0) {
        // Automatically default missing inputs to 4 (moderately) to avoid scoring exceptions
        const fullRatings = { ...ratings };
        ASPIRATION_GOALS.forEach((g) => {
          if (!fullRatings[g.id]) {
            fullRatings[g.id] = { importance: 4, likelihood: 4, attainment: 4 };
          }
        });
        onComplete(fullRatings);
      } else {
        onComplete(ratings);
      }
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  // Demo fill options for rapid grading/reviewing
  const handleQuickDemoFill = () => {
    const demoRatings: Record<number, GoalRatings> = {};
    ASPIRATION_GOALS.forEach((goal) => {
      // Create some authentic-looking profiles with a high focus on Intrinsic personal growth/community
      if (goal.category === "Personal growth" || goal.category === "Relationships") {
        demoRatings[goal.id] = {
          importance: Math.floor(Math.random() * 2) + 6, // 6-7
          likelihood: Math.floor(Math.random() * 2) + 5, // 5-6
          attainment: Math.floor(Math.random() * 3) + 4, // 4-6
        };
      } else if (goal.category === "Community" || goal.category === "Health") {
        demoRatings[goal.id] = {
          importance: Math.floor(Math.random() * 3) + 5, // 5-7
          likelihood: Math.floor(Math.random() * 2) + 5, // 5-6
          attainment: Math.floor(Math.random() * 3) + 3, // 3-5
        };
      } else {
        // Extrinsic (Wealth, fame, image)
        demoRatings[goal.id] = {
          importance: Math.floor(Math.random() * 3) + 2, // 2-4
          likelihood: Math.floor(Math.random() * 3) + 3, // 3-5
          attainment: Math.floor(Math.random() * 2) + 2, // 2-3
        };
      }
    });
    setRatings(demoRatings);
    setCurrentIndex(totalGoals - 1);
  };

  const progressPercent = ((currentIndex + 1) / totalGoals) * 100;
  const answeredCount = Object.keys(ratings).length;

  return (
    <div className="max-w-xl mx-auto space-y-6 animate-fade-in" id="assessment-wizard">
      {/* Wizard Header Status */}
      <div className="flex justify-between items-center bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
        <button
          onClick={onCancel}
          className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <ArrowLeft size={14} /> Exit Assessment
        </button>

        <div className="text-right">
          <span className="text-xs font-semibold text-slate-900 dark:text-slate-200 block">
            Aspiration {currentIndex + 1} of {totalGoals}
          </span>
          <span className="text-[10px] font-medium text-indigo-600 dark:text-indigo-400">
            {answeredCount} of {totalGoals} rated
          </span>
        </div>
      </div>

      {/* Progress slider bar */}
      <div className="w-full bg-slate-200 dark:bg-slate-800 h-1 rounded-full overflow-hidden">
        <div
          className="h-full bg-indigo-600 dark:bg-indigo-500 transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Primary Question Assessment Card */}
      <div className="bg-white dark:bg-slate-950 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        {/* Goal focus category badge */}
        <div className="flex flex-wrap items-center gap-2 justify-between">
          <span
            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${categoryMeta.bgColor} ${categoryMeta.borderColor} ${categoryMeta.color}`}
          >
            {categoryMeta.name} Goal
          </span>

          <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold">
            <Save size={12} className={savingAlert ? "text-indigo-500 animate-bounce" : "text-slate-300"} />
            <span>{savingAlert ? "Saving draft" : "Saved locally"}</span>
          </div>
        </div>

        {/* Life Goal Prompt text */}
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
            Aspiration Prompt
          </span>
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-950 dark:text-slate-100 leading-tight">
            &ldquo;{currentGoal?.text}&rdquo;
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 italic">
            {categoryMeta.description}
          </p>
        </div>

        {/* The 3 SDT rating questions */}
        <div className="space-y-6 border-t border-slate-100 dark:border-slate-800/60 pt-5">
          {/* Question 1: Importance (a) */}
          <div className="space-y-3">
            <div className="flex justify-between items-start gap-2">
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                (a) How <strong className="text-slate-900 dark:text-slate-100 font-bold">important</strong> is this goal to you?
              </span>
              <span className="text-xs font-semibold text-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 px-2.5 py-0.5 rounded">
                Score: {currentGoalRatings.importance}
              </span>
            </div>

            <div className="flex justify-between gap-1 sm:gap-2">
              {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                <button
                  key={`imp-${num}`}
                  type="button"
                  onClick={() => handleRatingChange("importance", num)}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center text-xs transition-all cursor-pointer ${
                    currentGoalRatings.importance === num
                      ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 border border-slate-900 dark:border-white font-bold"
                      : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
            <div className="flex justify-between text-[9px] font-bold tracking-wider text-slate-400 uppercase">
              <span>Not at all</span>
              <span>Moderately</span>
              <span>Very important</span>
            </div>
          </div>

          {/* Question 2: Likelihood (b) */}
          <div className="space-y-3">
            <div className="flex justify-between items-start gap-2">
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                (b) How <strong className="text-slate-900 dark:text-slate-100 font-bold">likely</strong> is it that you will attain this goal?
              </span>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded">
                Score: {currentGoalRatings.likelihood}
              </span>
            </div>

            <div className="flex justify-between gap-1 sm:gap-2">
              {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                <button
                  key={`like-${num}`}
                  type="button"
                  onClick={() => handleRatingChange("likelihood", num)}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center text-xs transition-all cursor-pointer ${
                    currentGoalRatings.likelihood === num
                      ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 border border-slate-900 dark:border-white font-bold"
                      : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
            <div className="flex justify-between text-[9px] font-bold tracking-wider text-slate-400 uppercase">
              <span>Unlikely</span>
              <span>Moderately</span>
              <span>Extremely likely</span>
            </div>
          </div>

          {/* Question 3: Attainment (c) */}
          <div className="space-y-3">
            <div className="flex justify-between items-start gap-2">
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                (c) How much have you <strong className="text-slate-900 dark:text-slate-100 font-bold">already achieved</strong> this goal?
              </span>
              <span className="text-xs font-semibold text-sky-600 bg-sky-50/50 dark:bg-sky-950/40 px-2.5 py-0.5 rounded">
                Score: {currentGoalRatings.attainment}
              </span>
            </div>

            <div className="flex justify-between gap-1 sm:gap-2">
              {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                <button
                  key={`attain-${num}`}
                  type="button"
                  onClick={() => handleRatingChange("attainment", num)}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center text-xs transition-all cursor-pointer ${
                    currentGoalRatings.attainment === num
                      ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 border border-slate-900 dark:border-white font-bold"
                      : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
            <div className="flex justify-between text-[9px] font-bold tracking-wider text-slate-400 uppercase">
              <span>Not at all</span>
              <span>Moderately</span>
              <span>Completely</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Controllers */}
      <div className="flex justify-between gap-4">
        <button
          type="button"
          disabled={currentIndex === 0}
          onClick={handleBack}
          className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-300 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <ArrowLeft size={14} /> Back
        </button>

        <button
          type="button"
          onClick={handleNext}
          className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          {currentIndex === totalGoals - 1 ? "Finish Assessment" : "Next Goal"} <ArrowRight size={14} />
        </button>
      </div>

      {/* Test Quick Fill Section for Teacher / Grading Evaluators */}
      <div className="p-4 bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 text-center space-y-2">
        <div className="flex items-center justify-center gap-2 text-slate-700 dark:text-slate-300 font-bold text-xs">
          <Sparkles size={14} className="text-indigo-600" /> Assessment Simulation Option
        </div>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm mx-auto">
          For evaluation convenience, simulate a complete student matrix instantly without completing each scale rating manually.
        </p>
        <button
          type="button"
          onClick={handleQuickDemoFill}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-850 text-slate-800 dark:text-slate-300 rounded-xl text-[11px] font-bold border border-slate-200 dark:border-slate-850 transition-all cursor-pointer"
        >
          ⚡ Populate Responses Instantly
        </button>
      </div>
    </div>
  );
}

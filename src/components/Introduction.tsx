import { useState, useEffect } from "react";
import { StudentProfile } from "../types";
import { Sprout, ShieldCheck, GraduationCap, History } from "lucide-react";

interface IntroductionProps {
  onStart: (profile: StudentProfile) => void;
  hasSavedSession: boolean;
  onResume: () => void;
  hasSavedResults: boolean;
  onViewResults: () => void;
}

export default function Introduction({
  onStart,
  hasSavedSession,
  onResume,
  hasSavedResults,
  onViewResults,
}: IntroductionProps) {
  const [ageGroup, setAgeGroup] = useState<string>("Undergraduate Student");
  const [demographic, setDemographic] = useState<string>("");
  const [mainAspiration, setMainAspiration] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStart({
      ageGroup,
      demographic: demographic.trim(),
      mainAspiration: mainAspiration.trim(),
    });
  };

  return (
    <div className="max-w-xl mx-auto space-y-8 animate-fade-in" id="intro-component">
      {/* Introduction Hero Section */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100 dark:bg-emerald-950/20 dark:border-emerald-900/30">
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
          <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-widest">
            Privacy Guaranteed: Client-Side Only
          </span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 dark:text-slate-100">
          Aspiration Index Assessment
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto leading-relaxed">
          Evaluate your life goals under the framework of Self-Determination Theory (SDT). Understand the alignment of your intrinsic values against extrinsic motivations.
        </p>
      </div>

      {/* SDT Brief Explanation Panel */}
      <div className="p-6 bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <Sprout className="text-indigo-600 dark:text-indigo-400" size={16} /> Scale Information
        </h3>
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          Developed by researchers Tim Kasser and Richard M. Ryan, the Aspiration Index measures the relative weight you place on different life directions and how they contribute to well-being.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-slate-50 dark:bg-slate-900/30 rounded-xl border border-slate-250 dark:border-slate-800/60">
            <span className="font-bold text-slate-950 dark:text-slate-200 block mb-1">
              🌱 Intrinsic Goals
            </span>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Meaningful relationships, personal growths, and community contributions. Directly promotes internal vitalities.
            </p>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-900/30 rounded-xl border border-slate-250 dark:border-slate-800/60">
            <span className="font-bold text-slate-950 dark:text-slate-200 block mb-1">
              💎 Extrinsic Goals
            </span>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Financial wealth, social fame, and public appearance. Often tied to external validations or praise.
            </p>
          </div>
        </div>
      </div>

      {/* Session Resume Panel if it exists */}
      {(hasSavedSession || hasSavedResults) && (
        <div className="p-5 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="text-indigo-600 dark:text-indigo-400" size={16} />
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Draft or previous assessment records found in this browser.
            </span>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            {hasSavedSession && (
              <button
                type="button"
                onClick={onResume}
                className="flex-1 sm:flex-initial px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-sm transition-all cursor-pointer"
              >
                Resume Progress
              </button>
            )}
            {hasSavedResults && (
              <button
                type="button"
                onClick={onViewResults}
                className="flex-1 sm:flex-initial px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-300 rounded-lg text-xs font-bold shadow-sm transition-all cursor-pointer"
              >
                View Results
              </button>
            )}
          </div>
        </div>
      )}

      {/* Educational Profile Configuration */}
      <form onSubmit={handleSubmit} className="p-6 bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800/80 pb-2">
          Assessment Profile
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-600 dark:text-slate-400">
              Student / Professional Level
            </label>
            <select
              value={ageGroup}
              onChange={(e) => setAgeGroup(e.target.value)}
              className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2.5 text-slate-700 dark:text-slate-300 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="Middle School Student">Middle School Student</option>
              <option value="High School Student">High School / K-12 Student</option>
              <option value="Undergraduate Student">Undergraduate / College Student</option>
              <option value="Graduate / PHD Fellow">Graduate / PhD Fellow</option>
              <option value="Adult Learner">Adult Learner</option>
              <option value="Academic Researcher">Academic Researcher</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-600 dark:text-slate-400">
              Major / Subject Field
            </label>
            <input
              type="text"
              placeholder="e.g. Psychology, Business, General Art"
              value={demographic}
              onChange={(e) => setDemographic(e.target.value)}
              className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2.5 text-slate-700 dark:text-slate-300 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label className="text-xs font-medium text-slate-600 dark:text-slate-400 block">
              What is your primary personal goal or dream right now?
            </label>
            <span className="text-[10px] text-slate-400 font-medium">(Optional context)</span>
          </div>
          <textarea
            rows={2}
            placeholder="e.g. To learn psychological research patterns to assist educational organizations..."
            value={mainAspiration}
            onChange={(e) => setMainAspiration(e.target.value)}
            className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2.5 text-slate-700 dark:text-slate-300 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm transition-all cursor-pointer"
        >
          Begin Scale Assessment
        </button>
      </form>
    </div>
  );
}


import { useState, useEffect } from "react";
import { AspirationCategory, CategoryScore, FactorScores, StudentProfile } from "../types";
import { getOfflineFeedback } from "../data";
import Visualizers from "./Visualizers";
import ReactMarkdown from "react-markdown";
import {
  Sparkles,
  ShieldCheck,
  RotateCcw,
  Printer,
  ChevronDown,
  ChevronUp,
  Brain,
  Download,
  Share2,
  FileText,
  BookmarkCheck,
} from "lucide-react";

interface ResultsDashboardProps {
  scores: Record<AspirationCategory, CategoryScore>;
  factorScores: FactorScores;
  profile: StudentProfile;
  onReset: () => void;
}

export default function ResultsDashboard({ scores, factorScores, profile, onReset }: ResultsDashboardProps) {
  const [aiFeedback, setAiFeedback] = useState<string>("");
  const [loadingAi, setLoadingAi] = useState<boolean>(false);
  const [aiError, setAiError] = useState<string>("");
  const [showTechnicalScores, setShowTechnicalScores] = useState<boolean>(false);

  // Load offline analysis directly
  const { title: offlineTitle, profile: offlineProfile, advice: offlineAdvice } = getOfflineFeedback(
    factorScores.relativeIntrinsicIndex,
    findExtremeCategory("highest"),
    findExtremeCategory("lowest")
  );

  // Helper find extreme categories based on importance ratings
  function findExtremeCategory(type: "highest" | "lowest"): AspirationCategory {
    let targetCat: AspirationCategory = "Personal growth";
    let targetVal = type === "highest" ? -1 : 99;

    Object.entries(scores).forEach(([cat, score]) => {
      if (cat === "Health") return; // Keep Health separate
      const val = score.importance;
      if (type === "highest" && val > targetVal) {
        targetVal = val;
        targetCat = cat as AspirationCategory;
      } else if (type === "lowest" && val < targetVal) {
        targetVal = val;
        targetCat = cat as AspirationCategory;
      }
    });

    return targetCat;
  }

  // Request secure AI report from proxy API
  const generateAiReport = async () => {
    setLoadingAi(true);
    setAiError("");
    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          scores,
          factorScores,
          ageGroup: profile.ageGroup,
          demographic: profile.demographic,
          mainAspiration: profile.mainAspiration,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "The server failed to formulate your AI portrait.");
      }

      setAiFeedback(data.feedback);
      // Cache the response in localStorage of the browser to avoid losing it on reload
      localStorage.setItem("aspiration_index_ai_feedback", data.feedback);
    } catch (err: any) {
      console.error(err);
      setAiError(err?.message || "Could not synchronize with Gemini. Please check your network connection.");
    } finally {
      setLoadingAi(false);
    }
  };

  // Try retrieving cached AI portrait on load
  useEffect(() => {
    const cached = localStorage.getItem("aspiration_index_ai_feedback");
    if (cached) {
      setAiFeedback(cached);
    }
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(
      JSON.stringify({
        completedAt: new Date().toISOString(),
        profile,
        scores,
        factorScores,
        localSummary: {
          title: offlineTitle,
          profile: offlineProfile,
          advice: offlineAdvice
        }
      }, null, 2)
    );
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `aspiration_index_results_${new Date().getFullYear()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in print:p-0" id="results-dashboard">
      {/* Student Profile Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-950 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm print:border-none print:shadow-none print:p-0">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-bold uppercase tracking-widest bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 px-2.5 py-0.5 rounded border border-slate-200 dark:border-slate-800">
              {profile.ageGroup}
            </span>
            {profile.demographic && (
              <span className="text-[9px] font-bold uppercase tracking-widest bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 px-2.5 py-0.5 rounded border border-slate-200 dark:border-slate-800">
                {profile.demographic}
              </span>
            )}
          </div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-950 dark:text-slate-100">
            Aspiration Study Report
          </h1>
          {profile.mainAspiration && (
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Primary life dream: <strong className="text-slate-800 dark:text-slate-350 italic font-medium">&ldquo;{profile.mainAspiration}&rdquo;</strong>
            </p>
          )}
        </div>

        <div className="flex gap-2 shrink-0 print:hidden">
          <button
            onClick={handlePrint}
            className="p-2 px-3 bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer shadow-sm flex items-center gap-1.5 text-xs font-bold transition-all"
            title="Print Report"
          >
            <Printer size={14} /> Print
          </button>
          <button
            onClick={handleExportData}
            className="p-2 px-3 bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer shadow-sm flex items-center gap-1.5 text-xs font-bold transition-all"
            title="Download JSON Data"
          >
            <Download size={14} /> Export
          </button>
          <button
            onClick={onReset}
            className="p-2 px-3 bg-white hover:bg-slate-50 text-rose-600 dark:hover:bg-rose-950/20 dark:text-rose-400 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer text-xs font-bold transition-all"
            title="Clear and retake test"
          >
            <RotateCcw size={14} /> Reset
          </button>
        </div>
      </div>

      {/* Visual Analytics section */}
      <section className="bg-white dark:bg-slate-950 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm print:shadow-none print:border-none print:p-0">
        <h2 className="text-base font-semibold tracking-wide text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-6">
          <Brain size={18} className="text-slate-700 dark:text-slate-400" /> Aspiration Index Visuals
        </h2>
        <Visualizers scores={scores} factorScores={factorScores} />
      </section>

      {/* Local SDT Diagnostic Report */}
      <div className="p-6 bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <span className="text-[9px] font-bold uppercase tracking-widest text-slate-450 block">
              Instantly Calculated Local Profile
            </span>
            <h3 className="text-base font-semibold tracking-tight text-slate-900 dark:text-slate-200 flex items-center gap-2 mt-1">
              <BookmarkCheck className="text-indigo-600" size={16} /> {offlineTitle}
            </h3>
          </div>
          <span className="text-xs font-bold text-slate-700 dark:text-slate-350 bg-slate-50 dark:bg-slate-900 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-800 shadow-sm">
            Self-Determination Index: {factorScores.relativeIntrinsicIndex.toFixed(2)}
          </span>
        </div>

        <p className="text-xs text-slate-550 dark:text-slate-300 leading-relaxed">
          {offlineProfile}
        </p>

        <div className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
          <h4 className="text-[10px] font-bold text-slate-650 dark:text-slate-400 uppercase tracking-widest mb-1.5">
            Path Guidance Reflection
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed">
            {offlineAdvice}
          </p>
        </div>
      </div>

      {/* Gemini AI feedback report */}
      <section className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm print:hidden">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <div className="space-y-1">
            <h3 className="text-base font-semibold tracking-tight text-slate-950 dark:text-slate-200 flex items-center gap-2">
              <Sparkles className="text-indigo-650" size={18} /> Deep AI motivational analysis
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Synthesizes your entire subscale matrix to generate an personalized psychological orientation portrait.
            </p>
          </div>

          {!aiFeedback && !loadingAi && (
            <button
              onClick={generateAiReport}
              className="py-2.5 px-5 bg-slate-950 hover:bg-slate-900 text-white dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 rounded-xl text-xs font-semibold cursor-pointer inline-flex items-center gap-1.5 transition-all"
            >
              <Sparkles size={14} /> Request Secure AI Report
            </button>
          )}

          {aiFeedback && !loadingAi && (
            <button
              onClick={generateAiReport}
              className="py-2 px-4 bg-slate-50 hover:bg-slate-100 text-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-300 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-800 cursor-pointer inline-flex items-center gap-1.5 transition-all"
            >
              <RotateCcw size={13} /> Refresh AI Report
            </button>
          )}
        </div>

        {/* Loading layout state */}
        {loadingAi && (
          <div className="py-12 flex flex-col items-center justify-center space-y-4 text-center">
            <div className="w-8 h-8 border-2 border-slate-900/10 border-t-slate-900 dark:border-white/10 dark:border-t-white rounded-full animate-spin" />
            <div className="space-y-1 select-none">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-250 block animate-pulse">
                Evaluating Aspiration Matrix...
              </span>
              <p className="text-[11px] text-slate-500 max-w-xs">
                Analyzing intrinsic factors, measuring commitment gaps, and generating deep path recommendations securely.
              </p>
            </div>
          </div>
        )}

        {/* Error notification */}
        {aiError && (
          <div className="p-4 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-205">
            <h4 className="font-bold mb-1">Failed to query AI module</h4>
            <p className="text-slate-500">{aiError}</p>
            <button
              onClick={generateAiReport}
              className="mt-2 text-indigo-600 dark:text-indigo-400 font-bold hover:underline bg-white dark:bg-slate-900 px-3 py-1 rounded border border-rose-200 dark:border-rose-800"
            >
              Try Again
            </button>
          </div>
        )}

        {/* AI report output display */}
        {aiFeedback && !loadingAi && (
          <div className="p-6 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl prose prose-slate max-w-none dark:prose-invert">
            <div className="text-slate-700 dark:text-slate-300 text-xs sm:text-sm prose-p:leading-relaxed prose-headings:font-semibold prose-headings:tracking-tight prose-a:text-indigo-600 dark:prose-a:text-indigo-400">
              <ReactMarkdown>{aiFeedback}</ReactMarkdown>
            </div>
          </div>
        )}

        {/* Secure offline reminder */}
        <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800/50 rounded-xl flex items-center gap-2 text-[10px] text-slate-400 dark:text-slate-550">
          <ShieldCheck size={14} className="text-slate-500 shrink-0" />
          <span>Stateless Privacy: Your scores are sent securely in the payload, processed transiently, and never stored.</span>
        </div>
      </section>

      {/* Details/technical summary collapse */}
      <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm bg-white dark:bg-slate-950">
        <button
          onClick={() => setShowTechnicalScores(!showTechnicalScores)}
          className="w-full flex justify-between items-center px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors text-slate-700 dark:text-slate-300 font-semibold text-xs uppercase tracking-wider cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <FileText size={14} /> Technical score metrics breakdown
          </span>
          {showTechnicalScores ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        {showTechnicalScores && (
          <div className="px-6 pb-6 pt-2 overflow-x-auto text-xs animate-slide-down">
            <table className="w-full min-w-[500px] border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-[9px] uppercase text-slate-400 font-bold tracking-wider">
                  <th className="py-2.5">Aspiration Sub-Scale</th>
                  <th className="py-2.5">Category factor</th>
                  <th className="py-2.5 text-center">Importance</th>
                  <th className="py-2.5 text-center">Likelihood</th>
                  <th className="py-2.5 text-center">Attainment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-900">
                {Object.entries(scores).map(([category, value]) => {
                  const factorType =
                    category === "Wealth" || category === "Fame" || category === "Image"
                      ? "Extrinsic"
                      : category === "Health"
                      ? "Health Anchor"
                      : "Intrinsic";

                  return (
                    <tr
                      key={category}
                      className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 text-slate-700 dark:text-slate-350"
                    >
                      <td className="py-2.5 font-bold">{category}</td>
                      <td className="py-2.5">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[9px] font-bold border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400`}
                        >
                          {factorType}
                        </span>
                      </td>
                      <td className="py-2.5 text-center font-bold">{value.importance.toFixed(2)}</td>
                      <td className="py-2.5 text-center font-bold">{value.likelihood.toFixed(2)}</td>
                      <td className="py-2.5 text-center font-bold">{value.attainment.toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Retake & Footer Section */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-400 py-3 border-t border-slate-250 dark:border-slate-800 print:hidden select-none">
        <span>Aspiration Index Scale Lab &copy; {new Date().getFullYear()}</span>
        <button
          onClick={onReset}
          className="text-indigo-650 dark:text-indigo-400 font-bold hover:underline cursor-pointer"
        >
          Retake Scale / Reset Profile
        </button>
      </div>
    </div>
  );
}

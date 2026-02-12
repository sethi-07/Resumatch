import { useState, useEffect } from "react";

export default function Home() {
  const [resume, setResume] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [missingKeywords, setMissingKeywords] = useState([]);

  const analyze = async () => {
    setError("");
    setResult(null);

    if (!resume.trim() || !jobDesc.trim()) {
      setError("Both fields are required.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("https://resumatch-5ssz.onrender.com/api/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resume: resume,
          job_description: jobDesc,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || "Something went wrong.");
      }

      const data = await res.json();
      setResult(data);
      setMissingKeywords(data.missing_keywords || []);
    } catch (err) {
      setError(err.message || "Server took too long to respond.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">
            Resumatch
          </h1>
          <div className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
            <span className="text-sm text-white/80">ATS Optimizer</span>
          </div>
        </div>

        <div className="grid gap-6">
          {/* Resume Input */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2 ml-1">
              📄 Resume
            </label>
            <textarea
              className="w-full p-5 rounded-xl bg-white/95 dark:bg-zinc-900/95
              text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600
              border border-white/20 dark:border-zinc-800
              focus:border-teal-400 focus:ring-2 focus:ring-teal-400/30
              transition-all duration-200 resize-none shadow-lg"
              rows="6"
              placeholder="Paste your resume here..."
              value={resume}
              onChange={(e) => setResume(e.target.value)}
            />
          </div>

          {/* Job Description Input */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2 ml-1">
              💼 Job Description
            </label>
            <textarea
              className="w-full p-5 rounded-xl bg-white/95 dark:bg-zinc-900/95
              text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600
              border border-white/20 dark:border-zinc-800
              focus:border-teal-400 focus:ring-2 focus:ring-teal-400/30
              transition-all duration-200 resize-none shadow-lg"
              rows="6"
              placeholder="Paste job description here..."
              value={jobDesc}
              onChange={(e) => setJobDesc(e.target.value)}
            />
          </div>

          {/* Simple Analyze Button */}
          <button
            onClick={analyze}
            disabled={loading}
            className="px-6 py-3 bg-teal-600 hover:bg-teal-700 
            text-white font-medium rounded-lg
            transition-colors duration-200 disabled:opacity-50 
            disabled:cursor-not-allowed shadow-md w-full"
          >
            {loading ? "Analyzing..." : "Analyze Match"}
          </button>

          {/* Error */}
          {error && (
            <div className="bg-red-500/10 backdrop-blur-sm border border-red-500/30 
            text-red-200 px-4 py-3 rounded-lg">
              <div className="flex items-center gap-2">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Results */}
          {result && !error && (
            <div className="mt-6 p-6 rounded-2xl bg-white/95 dark:bg-zinc-900/95 backdrop-blur-sm 
            border border-white/20 dark:border-zinc-800 shadow-xl">
              <h2 className="text-2xl font-bold mb-6 text-zinc-800 dark:text-white">
                ATS Match Analysis
              </h2>

              {/* Main Score */}
              <div className="flex flex-col items-center justify-center mb-8">
                <div className={`text-5xl font-bold mb-2 ${result.final_match_percentage >= 75
                  ? "text-emerald-500"
                  : result.final_match_percentage >= 50
                    ? "text-amber-500"
                    : "text-rose-500"
                  }`}>
                  {result.final_match_percentage}%
                </div>
                <p className="text-zinc-500 dark:text-zinc-400">
                  Overall Match Score
                </p>
              </div>

              {/* Score Cards - Each with distinct colors */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 rounded-lg bg-sky-100/80 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800">
                  <h3 className="text-sm font-medium text-sky-700 dark:text-sky-300 mb-1">
                    Semantic Score
                  </h3>
                  <p className="text-2xl font-bold text-sky-600 dark:text-sky-400">
                    {result.semantic_score}%
                  </p>
                  <p className="text-xs text-sky-600/70 dark:text-sky-400/70 mt-1">
                    Context understanding
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-violet-100/80 dark:bg-violet-950/30 border border-violet-200 dark:border-violet-800">
                  <h3 className="text-sm font-medium text-violet-700 dark:text-violet-300 mb-1">
                    Skill Overlap
                  </h3>
                  <p className="text-2xl font-bold text-violet-600 dark:text-violet-400">
                    {result.skill_overlap_score}%
                  </p>
                  <p className="text-xs text-violet-600/70 dark:text-violet-400/70 mt-1">
                    Technical match
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-amber-100/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
                  <h3 className="text-sm font-medium text-amber-700 dark:text-amber-300 mb-1">
                    Impact Score
                  </h3>
                  <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                    {result.impact_score}%
                  </p>
                  <p className="text-xs text-amber-600/70 dark:text-amber-400/70 mt-1">
                    Experience relevance
                  </p>
                </div>
              </div>

              {/* Missing Keywords */}
              {result.missing_keywords?.length > 0 && (
                <div className="mt-4 p-4 rounded-lg bg-rose-500/10 border border-rose-500/30">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-rose-400">⚠️</span>
                    <h3 className="font-semibold text-zinc-800 dark:text-white">
                      Missing Keywords
                    </h3>
                    <span className="px-2 py-0.5 text-xs rounded-full bg-rose-500/20 text-rose-400">
                      {result.missing_keywords.length}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {result.missing_keywords.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 text-sm rounded-lg bg-rose-500/10 
                        text-rose-400 border border-rose-500/30"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
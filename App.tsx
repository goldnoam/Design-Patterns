
import React, { useState, useMemo, useEffect } from 'react';
import Layout from './components/Layout';
import PatternCard from './components/PatternCard';
import PatternDetail from './components/PatternDetail';
import { DESIGN_PATTERNS } from './constants';
import { DesignPattern, SuggestionResult } from './types';
import { Search, MessageSquare, Wand2, Terminal, AlertCircle, Loader2, Sparkles, Code2 } from 'lucide-react';
import { suggestPattern, explainCode } from './services/gemini';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'patterns' | 'ai' | 'explain'>('patterns');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPattern, setSelectedPattern] = useState<DesignPattern | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  // AI Suggestor State
  const [problemDesc, setProblemDesc] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<SuggestionResult | null>(null);

  // AI Explainer State
  const [explainCodeInput, setExplainCodeInput] = useState('');
  const [explainLoading, setExplainLoading] = useState(false);
  const [explanation, setExplanation] = useState<string | null>(null);

  const filteredPatterns = useMemo(() => {
    return DESIGN_PATTERNS.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const handleSuggest = async () => {
    if (!problemDesc.trim()) return;
    setAiLoading(true);
    setSuggestion(null);
    try {
      const res = await suggestPattern(problemDesc);
      setSuggestion(res);
    } catch (err) {
      console.error(err);
    } finally {
      setAiLoading(false);
    }
  };

  const handleExplain = async () => {
    if (!explainCodeInput.trim()) return;
    setExplainLoading(true);
    setExplanation(null);
    try {
      const res = await explainCode(explainCodeInput);
      setExplanation(res);
    } catch (err) {
      console.error(err);
    } finally {
      setExplainLoading(false);
    }
  };

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <Layout 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isDarkMode={isDarkMode} 
        toggleTheme={toggleTheme}
      >
        {activeTab === 'patterns' && (
          <div className="space-y-10">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-2">
                <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white">Pattern Library</h2>
                <p className="text-slate-500 dark:text-slate-400 text-lg">Browse standard C++ architectural solutions.</p>
              </div>
              <div className="relative w-full md:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={20} />
                <input 
                  type="text"
                  placeholder="Search patterns or categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl py-3 pl-12 pr-4 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                />
              </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPatterns.length > 0 ? (
                filteredPatterns.map(pattern => (
                  <PatternCard 
                    key={pattern.id} 
                    pattern={pattern} 
                    onClick={setSelectedPattern}
                  />
                ))
              ) : (
                <div className="col-span-full py-20 text-center space-y-4">
                  <div className="inline-block p-4 bg-slate-100 dark:bg-slate-900 rounded-full text-slate-400 dark:text-slate-600">
                    <AlertCircle size={40} />
                  </div>
                  <p className="text-slate-500 dark:text-slate-500 text-lg">No patterns match your search.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'ai' && (
          <div className="max-w-3xl mx-auto space-y-10">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center justify-center p-3 bg-purple-600/10 dark:bg-purple-600/20 rounded-2xl text-purple-600 dark:text-purple-400 mb-4">
                <Wand2 size={32} />
              </div>
              <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white">Pattern Suggestor</h2>
              <p className="text-slate-500 dark:text-slate-400 text-lg">Describe your problem and let Gemini suggest the best C++ pattern.</p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center">
                  <MessageSquare size={16} className="mr-2" />
                  Problem Description
                </label>
                <textarea 
                  rows={5}
                  value={problemDesc}
                  onChange={(e) => setProblemDesc(e.target.value)}
                  placeholder="e.g., I need a way to manage multiple payment providers that have different interfaces, but my system should interact with them consistently..."
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                />
              </div>

              <button 
                onClick={handleSuggest}
                disabled={aiLoading || !problemDesc.trim()}
                className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-500 text-white font-bold py-4 rounded-2xl flex items-center justify-center space-x-2 transition-all shadow-lg hover:shadow-purple-900/40"
              >
                {aiLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    <span>Analyzing architecture...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={20} />
                    <span>Get AI Suggestion</span>
                  </>
                )}
              </button>
            </div>

            {suggestion && (
              <div className="bg-white dark:bg-slate-900 border border-purple-500/30 rounded-3xl p-8 shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Recommended Pattern</h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-purple-600 dark:text-purple-400 font-mono text-lg font-bold">
                        {DESIGN_PATTERNS.find(p => p.id === suggestion.patternId)?.name || suggestion.patternId}
                      </span>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      const pattern = DESIGN_PATTERNS.find(p => p.id === suggestion.patternId);
                      if (pattern) setSelectedPattern(pattern);
                    }}
                    className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors"
                  >
                    View Implementation
                  </button>
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-950 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 italic">
                  "{suggestion.reasoning}"
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'explain' && (
          <div className="max-w-4xl mx-auto space-y-10">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center justify-center p-3 bg-emerald-600/10 dark:bg-emerald-600/20 rounded-2xl text-emerald-600 dark:text-emerald-400 mb-4">
                <Terminal size={32} />
              </div>
              <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white">Code Explainer</h2>
              <p className="text-slate-500 dark:text-slate-400 text-lg">Paste C++ code to understand the underlying patterns and design principles.</p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center">
                  <Code2 size={16} className="mr-2" />
                  C++ Source Code
                </label>
                <textarea 
                  rows={10}
                  value={explainCodeInput}
                  onChange={(e) => setExplainCodeInput(e.target.value)}
                  placeholder="class MyClass { ... };"
                  className="w-full font-mono text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 text-emerald-600 dark:text-emerald-400 placeholder-slate-300 dark:placeholder-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all"
                />
              </div>

              <button 
                onClick={handleExplain}
                disabled={explainLoading || !explainCodeInput.trim()}
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-500 text-white font-bold py-4 rounded-2xl flex items-center justify-center space-x-2 transition-all shadow-lg hover:shadow-emerald-900/40"
              >
                {explainLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    <span>Decoding patterns...</span>
                  </>
                ) : (
                  <>
                    <Code2 size={20} />
                    <span>Explain Code</span>
                  </>
                )}
              </button>
            </div>

            {explanation && (
              <div className="bg-white dark:bg-slate-900 border border-emerald-500/30 rounded-3xl p-8 shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-500 prose dark:prose-invert max-w-none">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
                  <Sparkles className="mr-2 text-emerald-600 dark:text-emerald-400" size={24} />
                  AI Analysis
                </h3>
                <div className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed bg-slate-50 dark:bg-slate-950 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 font-medium">
                  {explanation}
                </div>
              </div>
            )}
          </div>
        )}

        {selectedPattern && (
          <PatternDetail 
            pattern={selectedPattern} 
            onClose={() => setSelectedPattern(null)} 
          />
        )}
      </Layout>
    </div>
  );
};

export default App;

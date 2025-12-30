import React, { useState } from 'react';
import { DesignPattern } from '../types';
import { X, CheckCircle2, Copy, Check, Bookmark, ChevronLeft, ChevronRight, Image as ImageIcon, Maximize2 } from 'lucide-react';

interface PatternDetailProps {
  pattern: DesignPattern;
  onClose: () => void;
  isBookmarked?: boolean;
  onBookmarkToggle?: (id: string) => void;
  onNext?: () => void;
  onPrev?: () => void;
}

const PatternDetail: React.FC<PatternDetailProps> = ({ 
  pattern, 
  onClose, 
  isBookmarked, 
  onBookmarkToggle,
  onNext,
  onPrev
}) => {
  const [copied, setCopied] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(pattern.codeExample);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleZoom = () => {
    if (pattern.visualAidUrl) {
      setIsZoomed(!isZoomed);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in duration-300">
          {/* Header */}
          <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
            <div className="flex items-center space-x-4">
               <div className="flex items-center space-x-1">
                  <button 
                    onClick={onPrev}
                    className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-all border border-slate-700/50"
                    title="Previous Pattern"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button 
                    onClick={onNext}
                    className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-all border border-slate-700/50"
                    title="Next Pattern"
                  >
                    <ChevronRight size={20} />
                  </button>
               </div>
               <div>
                  <div className="flex items-center space-x-3 mb-1">
                    <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">{pattern.name}</h2>
                    <span className="hidden sm:inline-block text-xs font-mono bg-blue-600/20 text-blue-400 px-2.5 py-1 rounded-full border border-blue-500/20">
                      Pattern
                    </span>
                  </div>
                  <p className="text-slate-400 text-sm">{pattern.category} Design Pattern</p>
               </div>
            </div>
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => onBookmarkToggle?.(pattern.id)}
                className={`p-2 rounded-xl border transition-all ${
                  isBookmarked 
                    ? 'bg-rose-500/10 border-rose-500/30 text-rose-500' 
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                }`}
                title={isBookmarked ? "Remove Bookmark" : "Add Bookmark"}
              >
                <Bookmark size={20} fill={isBookmarked ? "currentColor" : "none"} />
              </button>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-all"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-10">
            <div className="grid lg:grid-cols-2 gap-10">
              <div className="space-y-8">
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-white flex items-center">
                      <span className="w-8 h-8 rounded-lg bg-blue-600/20 flex items-center justify-center mr-3 text-blue-500">
                        <CheckCircle2 size={18} />
                      </span>
                      Intent
                    </h3>
                  </div>
                  <p className="text-slate-300 leading-relaxed text-lg">
                    {pattern.description}
                  </p>
                </section>

                <div className="grid sm:grid-cols-2 gap-6">
                  <section>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-emerald-400 mb-4 flex items-center">
                      Pros
                    </h3>
                    <ul className="space-y-3">
                      {pattern.pros.map((pro, i) => (
                        <li key={i} className="flex items-start text-slate-400 text-sm leading-relaxed">
                          <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 mr-3 shrink-0" />
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </section>
                  <section>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-rose-400 mb-4 flex items-center">
                      Cons
                    </h3>
                    <ul className="space-y-3">
                      {pattern.cons.map((con, i) => (
                        <li key={i} className="flex items-start text-slate-400 text-sm leading-relaxed">
                          <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-rose-500 mr-3 shrink-0" />
                          {con}
                        </li>
                      ))}
                    </ul>
                  </section>
                </div>

                <section>
                  <h3 className="text-xl font-semibold text-white mb-4">When to use</h3>
                  <div className="bg-slate-800/30 rounded-2xl p-6 border border-slate-800/50">
                    <ul className="space-y-4">
                      {pattern.whenToUse.map((reason, i) => (
                        <li key={i} className="flex items-start text-slate-300 group">
                          <div className="mt-2 w-1.5 h-1.5 rounded-full bg-blue-500/50 group-hover:bg-blue-500 mr-4 shrink-0 transition-colors" />
                          <span className="text-sm leading-relaxed">{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>
              </div>

              {/* Visual Aid Section */}
              <div className="space-y-4">
                 <h3 className="text-xl font-semibold text-white flex items-center">
                  <span className="w-8 h-8 rounded-lg bg-purple-600/20 flex items-center justify-center mr-3 text-purple-500">
                    <ImageIcon size={18} />
                  </span>
                  Architectural Diagram
                </h3>
                <div 
                  onClick={toggleZoom}
                  className={`aspect-video bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 group relative shadow-inner cursor-zoom-in`}
                >
                  {pattern.visualAidUrl ? (
                    <>
                      <img 
                        src={pattern.visualAidUrl} 
                        alt={`${pattern.name} Diagram`} 
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                      />
                      <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-sm p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                        <Maximize2 size={16} className="text-white" />
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-600 p-8 text-center">
                      <ImageIcon size={48} className="mb-4 opacity-20" />
                      <p className="text-sm italic">Illustration pending visualization</p>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent pointer-events-none" />
                  <div className="absolute bottom-4 left-4 right-4 text-[10px] text-slate-400 font-mono uppercase tracking-widest bg-slate-900/80 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-slate-700/50 w-fit">
                     Pattern Topology Concept
                  </div>
                </div>
                <p className="text-xs text-slate-500 text-center italic">Click image to enlarge</p>
              </div>
            </div>

            {/* Implementation Section */}
            <section className="pt-6 border-t border-slate-800">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h3 className="text-xl font-semibold text-white flex items-center">
                  <span className="w-8 h-8 rounded-lg bg-emerald-600/20 flex items-center justify-center mr-3 text-emerald-500">
                    <Check size={18} />
                  </span>
                  C++ Implementation
                </h3>
                <button 
                  onClick={copyCode}
                  className="w-full sm:w-auto flex items-center justify-center space-x-2 text-xs font-bold text-slate-200 transition-all bg-emerald-600 hover:bg-emerald-500 px-5 py-2.5 rounded-xl border border-emerald-500/50 shadow-lg shadow-emerald-900/20"
                >
                  {copied ? <Check size={14} className="text-white" /> : <Copy size={14} />}
                  <span>{copied ? 'Copied to Clipboard!' : 'Copy All Code'}</span>
                </button>
              </div>
              <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl relative">
                <div className="absolute top-0 right-0 p-3 flex space-x-1.5 opacity-50">
                  <div className="w-2 h-2 rounded-full bg-slate-800" />
                  <div className="w-2 h-2 rounded-full bg-slate-800" />
                  <div className="w-2 h-2 rounded-full bg-slate-800" />
                </div>
                <pre className="p-4 md:p-8 overflow-x-auto text-sm leading-relaxed text-blue-100/90 font-mono">
                  <code>{pattern.codeExample}</code>
                </pre>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Zoomed Modal */}
      {isZoomed && pattern.visualAidUrl && (
        <div 
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 p-4 md:p-20 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={toggleZoom}
        >
          <button className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors">
            <X size={40} />
          </button>
          <img 
            src={pattern.visualAidUrl} 
            alt={`${pattern.name} Large Diagram`}
            className="max-w-full max-h-full object-contain rounded-xl shadow-2xl animate-in zoom-in-95 duration-300"
          />
        </div>
      )}
    </>
  );
};

export default PatternDetail;
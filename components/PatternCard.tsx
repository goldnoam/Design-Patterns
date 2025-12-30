import React from 'react';
import { DesignPattern, PatternCategory } from '../types';
import { ChevronRight, Layers, Boxes, Workflow, Bookmark } from 'lucide-react';

interface PatternCardProps {
  pattern: DesignPattern;
  onClick: (pattern: DesignPattern) => void;
  isBookmarked?: boolean;
  onBookmarkToggle?: (id: string) => void;
}

const PatternCard: React.FC<PatternCardProps> = ({ pattern, onClick, isBookmarked, onBookmarkToggle }) => {
  const getIcon = () => {
    switch(pattern.category) {
      case PatternCategory.CREATIONAL: return <Boxes className="text-blue-500 dark:text-blue-400" size={20} />;
      case PatternCategory.STRUCTURAL: return <Layers className="text-purple-500 dark:text-purple-400" size={20} />;
      case PatternCategory.BEHAVIORAL: return <Workflow className="text-emerald-500 dark:text-emerald-400" size={20} />;
    }
  };

  const getCategoryColor = () => {
    switch(pattern.category) {
      case PatternCategory.CREATIONAL: return 'bg-blue-100 dark:bg-blue-400/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-400/20';
      case PatternCategory.STRUCTURAL: return 'bg-purple-100 dark:bg-purple-400/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-400/20';
      case PatternCategory.BEHAVIORAL: return 'bg-emerald-100 dark:bg-emerald-400/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-400/20';
    }
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onBookmarkToggle) {
      onBookmarkToggle(pattern.id);
    }
  };

  return (
    <div 
      onClick={() => onClick(pattern)}
      className="group bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 cursor-pointer hover:border-blue-300 dark:hover:border-slate-700 hover:bg-white dark:hover:bg-slate-800/50 transition-all shadow-md hover:shadow-xl flex flex-col h-full relative"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
          {getIcon()}
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={handleBookmark}
            className={`p-1.5 rounded-lg border transition-all ${
              isBookmarked 
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-500' 
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 hover:text-600 dark:hover:text-slate-200'
            }`}
          >
            <Bookmark size={16} fill={isBookmarked ? "currentColor" : "none"} />
          </button>
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${getCategoryColor()}`}>
            {pattern.category}
          </span>
        </div>
      </div>
      
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
        {pattern.name}
      </h3>
      
      <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-3 mb-6 flex-grow">
        {pattern.description}
      </p>

      {/* Trade-off Indicators with Custom Tooltips */}
      <div className="pt-4 mt-auto border-t border-slate-200 dark:border-slate-800/50 mb-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex flex-col space-y-1">
            <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500">Pros</span>
            <div className="flex flex-wrap gap-1">
              {pattern.pros.map((pro, i) => (
                <div key={i} className="group/tooltip relative">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)] cursor-help" />
                  <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover/tooltip:block z-[100] pointer-events-none">
                    <div className="bg-slate-800 text-white text-[10px] px-2 py-1.5 rounded-lg shadow-2xl border border-slate-700 min-w-[120px] max-w-[200px] whitespace-normal leading-tight animate-in fade-in slide-in-from-bottom-1 duration-200">
                      {pro}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-800" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col space-y-1">
            <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500">Cons</span>
            <div className="flex flex-wrap gap-1">
              {pattern.cons.map((con, i) => (
                <div key={i} className="group/tooltip relative">
                  <div className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.4)] cursor-help" />
                  <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover/tooltip:block z-[100] pointer-events-none">
                    <div className="bg-slate-800 text-white text-[10px] px-2 py-1.5 rounded-lg shadow-2xl border border-slate-700 min-w-[120px] max-w-[200px] whitespace-normal leading-tight animate-in fade-in slide-in-from-bottom-1 duration-200">
                      {con}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-800" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center text-blue-600 dark:text-blue-500 font-bold text-sm">
        <span>Learn more</span>
        <ChevronRight size={16} className="ml-1 transform group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  );
};

export default PatternCard;

import React, { useState, useMemo, useEffect } from 'react';
import Layout from './components/Layout';
import PatternCard from './components/PatternCard';
import PatternDetail from './components/PatternDetail';
import { DESIGN_PATTERNS } from './constants';
import { DesignPattern } from './types';
import { Search, AlertCircle, Bookmark } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'patterns' | 'bookmarks'>('patterns');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPattern, setSelectedPattern] = useState<DesignPattern | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  
  // Load bookmarks on mount
  useEffect(() => {
    const saved = localStorage.getItem('cpp-pattern-bookmarks');
    if (saved) {
      try {
        setBookmarks(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse bookmarks", e);
      }
    }
  }, []);

  // Save bookmarks on change
  useEffect(() => {
    localStorage.setItem('cpp-pattern-bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  const toggleBookmark = (id: string) => {
    setBookmarks(prev => 
      prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]
    );
  };

  const filteredPatterns = useMemo(() => {
    const source = activeTab === 'bookmarks' 
      ? DESIGN_PATTERNS.filter(p => bookmarks.includes(p.id))
      : DESIGN_PATTERNS;

    return source.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, activeTab, bookmarks]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <Layout 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isDarkMode={isDarkMode} 
        toggleTheme={toggleTheme}
      >
        <div className="space-y-10">
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white">
                {activeTab === 'bookmarks' ? 'Your Bookmarks' : 'Pattern Library'}
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-lg">
                {activeTab === 'bookmarks' 
                  ? 'Your collection of saved C++ patterns.' 
                  : 'Browse standard C++ architectural solutions.'}
              </p>
            </div>
            <div className="relative w-full md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={20} />
              <input 
                type="text"
                placeholder="Search patterns..."
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
                  isBookmarked={bookmarks.includes(pattern.id)}
                  onBookmarkToggle={toggleBookmark}
                  onClick={setSelectedPattern}
                />
              ))
            ) : (
              <div className="col-span-full py-20 text-center space-y-4">
                <div className="inline-block p-4 bg-slate-100 dark:bg-slate-900 rounded-full text-slate-400 dark:text-slate-600">
                  {activeTab === 'bookmarks' ? <Bookmark size={40} /> : <AlertCircle size={40} />}
                </div>
                <p className="text-slate-500 dark:text-slate-500 text-lg">
                  {activeTab === 'bookmarks' 
                    ? "You haven't bookmarked any patterns yet." 
                    : "No patterns match your search."}
                </p>
              </div>
            )}
          </div>
        </div>

        {selectedPattern && (
          <PatternDetail 
            pattern={selectedPattern} 
            isBookmarked={bookmarks.includes(selectedPattern.id)}
            onBookmarkToggle={toggleBookmark}
            onClose={() => setSelectedPattern(null)} 
          />
        )}
      </Layout>
    </div>
  );
};

export default App;

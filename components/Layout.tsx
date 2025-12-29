
import React, { useState, useEffect, useRef } from 'react';
import { Book, Cpu, Github, Sun, Moon, Bookmark, ArrowUp } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: 'patterns' | 'bookmarks';
  setActiveTab: (tab: 'patterns' | 'bookmarks') => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  activeTab, 
  setActiveTab, 
  isDarkMode, 
  toggleTheme 
}) => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (mainRef.current) {
        setShowScrollTop(mainRef.current.scrollTop > 300);
      }
    };

    const container = mainRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const scrollToTop = () => {
    mainRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen transition-colors duration-300">
      {/* Sidebar */}
      <nav className="w-full md:w-64 bg-slate-50 dark:bg-slate-900 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 p-6 flex flex-col space-y-8 sticky top-0 h-auto md:h-screen z-40">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg shadow-lg shadow-blue-500/20">
              <Cpu className="text-white w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">C++ Patterns</h1>
          </div>
          <button 
            onClick={toggleTheme}
            className="p-2 md:hidden bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-300"
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

        <div className="flex-1 space-y-2">
          <button
            onClick={() => setActiveTab('patterns')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === 'patterns' 
                ? 'bg-blue-600/10 text-blue-600 dark:text-blue-400 border border-blue-600/20 dark:border-blue-600/30' 
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <Book size={20} />
            <span className="font-medium">Pattern Library</span>
          </button>

          <button
            onClick={() => setActiveTab('bookmarks')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === 'bookmarks' 
                ? 'bg-rose-600/10 text-rose-600 dark:text-rose-400 border border-rose-600/20 dark:border-rose-600/30' 
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <Bookmark size={20} />
            <span className="font-medium">Bookmarks</span>
          </button>
        </div>

        <div className="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-800">
          <button 
            onClick={toggleTheme}
            className="hidden md:flex w-full items-center space-x-3 px-4 py-3 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            <span className="font-medium">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
          
          <a 
            href="https://github.com" 
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-3 px-4 py-1 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          >
            <Github size={18} />
            <span className="text-sm">Contribute</span>
          </a>
        </div>
      </nav>

      {/* Main Content */}
      <main ref={mainRef} className="flex-1 bg-white dark:bg-slate-950 overflow-y-auto relative scroll-smooth">
        <div className="max-w-6xl mx-auto p-6 md:p-10">
          {children}
        </div>

        {/* Go to Top Button */}
        <button
          onClick={scrollToTop}
          className={`fixed bottom-8 right-8 z-50 p-4 rounded-full shadow-2xl transition-all duration-500 ease-in-out transform ${
            showScrollTop 
              ? 'opacity-100 translate-y-0 scale-100' 
              : 'opacity-0 translate-y-10 scale-50 pointer-events-none'
          } bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 flex items-center justify-center group`}
          aria-label="Go to top"
        >
          <ArrowUp size={24} className="group-hover:-translate-y-1 transition-transform duration-300" />
        </button>
      </main>
    </div>
  );
};

export default Layout;

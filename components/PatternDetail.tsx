
import React, { useState, useEffect, useRef } from 'react';
import { DesignPattern } from '../types';
import { X, CheckCircle2, AlertCircle, Copy, Check, Image as ImageIcon, Loader2, Sparkles, Maximize2, Volume2, Square } from 'lucide-react';
import { generateDiagram, generateSpeech, decodeBase64, decodeAudioData } from '../services/gemini';

interface PatternDetailProps {
  pattern: DesignPattern;
  onClose: () => void;
}

const PatternDetail: React.FC<PatternDetailProps> = ({ pattern, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [diagramUrl, setDiagramUrl] = useState<string | null>(null);
  const [isGeneratingDiagram, setIsGeneratingDiagram] = useState(false);
  
  // TTS State
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isTtsLoading, setIsTtsLoading] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);

  useEffect(() => {
    const fetchDiagram = async () => {
      setIsGeneratingDiagram(true);
      const url = await generateDiagram(pattern.name, pattern.description);
      setDiagramUrl(url);
      setIsGeneratingDiagram(false);
    };

    fetchDiagram();
    
    return () => {
      stopSpeaking();
    };
  }, [pattern]);

  const copyCode = () => {
    navigator.clipboard.writeText(pattern.codeExample);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeak = async () => {
    if (isSpeaking) {
      stopSpeaking();
      return;
    }

    setIsTtsLoading(true);
    try {
      const audioBase64 = await generateSpeech(`${pattern.name}. ${pattern.description}`);
      if (audioBase64) {
        if (!audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        }
        
        const audioData = decodeBase64(audioBase64);
        const buffer = await decodeAudioData(audioData, audioContextRef.current, 24000, 1);
        
        const source = audioContextRef.current.createBufferSource();
        source.buffer = buffer;
        source.connect(audioContextRef.current.destination);
        source.onended = () => {
          setIsSpeaking(false);
          sourceNodeRef.current = null;
        };
        
        sourceNodeRef.current = source;
        source.start(0);
        setIsSpeaking(true);
      }
    } catch (err) {
      console.error("Speech playback failed", err);
    } finally {
      setIsTtsLoading(false);
    }
  };

  const stopSpeaking = () => {
    if (sourceNodeRef.current) {
      sourceNodeRef.current.stop();
      sourceNodeRef.current = null;
    }
    setIsSpeaking(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
          <div>
            <div className="flex items-center space-x-3 mb-1">
              <h2 className="text-3xl font-bold text-white tracking-tight">{pattern.name}</h2>
              <span className="text-xs font-mono bg-blue-600/20 text-blue-400 px-2.5 py-1 rounded-full border border-blue-500/20">
                Pattern
              </span>
            </div>
            <p className="text-slate-400">{pattern.category} Design Pattern</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-all"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-10">
          
          <div className="grid lg:grid-cols-2 gap-10">
            {/* Left Column: Intent & Trade-offs */}
            <div className="space-y-8">
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-white flex items-center">
                    <span className="w-8 h-8 rounded-lg bg-blue-600/20 flex items-center justify-center mr-3 text-blue-500">
                      <CheckCircle2 size={18} />
                    </span>
                    Intent
                  </h3>
                  <button 
                    onClick={handleSpeak}
                    disabled={isTtsLoading}
                    className={`flex items-center space-x-2 text-xs font-bold px-3 py-1.5 rounded-full transition-all border ${
                      isSpeaking 
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-rose-500/20' 
                        : 'bg-blue-600/10 text-blue-400 border-blue-600/20 hover:bg-blue-600/20'
                    }`}
                  >
                    {isTtsLoading ? (
                      <Loader2 className="animate-spin" size={14} />
                    ) : isSpeaking ? (
                      <Square size={14} fill="currentColor" />
                    ) : (
                      <Volume2 size={14} />
                    )}
                    <span>{isSpeaking ? 'Stop Reading' : 'Read Aloud'}</span>
                  </button>
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

            {/* Right Column: AI Generated Diagram */}
            <section className="flex flex-col h-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white flex items-center">
                  <span className="w-8 h-8 rounded-lg bg-purple-600/20 flex items-center justify-center mr-3 text-purple-500">
                    <ImageIcon size={18} />
                  </span>
                  Architectural Blueprint
                </h3>
                {diagramUrl && (
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center">
                    <Sparkles size={10} className="mr-1" />
                    Generated by AI
                  </span>
                )}
              </div>
              
              <div className="relative flex-1 min-h-[400px] bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden group shadow-inner">
                {isGeneratingDiagram ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4 bg-slate-950/50">
                    <div className="relative">
                      <Loader2 className="animate-spin text-purple-500" size={48} strokeWidth={1} />
                      <div className="absolute inset-0 animate-ping opacity-20 bg-purple-500 rounded-full scale-150"></div>
                    </div>
                    <div className="text-center">
                      <p className="text-purple-400 font-medium animate-pulse">Rendering schematic...</p>
                      <p className="text-slate-500 text-xs mt-1">Generating structural relationships</p>
                    </div>
                  </div>
                ) : diagramUrl ? (
                  <>
                    <img 
                      src={diagramUrl} 
                      alt={`${pattern.name} Diagram`}
                      className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-700 backdrop-blur-sm cursor-zoom-in">
                        <Maximize2 size={16} className="text-slate-300" />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center text-slate-600">
                    <AlertCircle size={40} strokeWidth={1} className="mb-4" />
                    <p>Failed to generate schematic.</p>
                    <button 
                      onClick={() => window.location.reload()}
                      className="mt-4 text-xs text-blue-500 underline"
                    >
                      Retry Generation
                    </button>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Implementation Section */}
          <section className="pt-6 border-t border-slate-800">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-white flex items-center">
                <span className="w-8 h-8 rounded-lg bg-emerald-600/20 flex items-center justify-center mr-3 text-emerald-500">
                  <Check size={18} />
                </span>
                C++ Implementation
              </h3>
              <button 
                onClick={copyCode}
                className="flex items-center space-x-2 text-xs font-bold text-slate-200 transition-all bg-emerald-600 hover:bg-emerald-500 px-5 py-2.5 rounded-xl border border-emerald-500/50 shadow-lg shadow-emerald-900/20"
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
              <pre className="p-8 overflow-x-auto text-sm leading-relaxed text-blue-100/90 font-mono">
                <code>{pattern.codeExample}</code>
              </pre>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PatternDetail;

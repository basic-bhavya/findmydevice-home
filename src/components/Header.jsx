import React, { useState, useEffect } from 'react';
import { 
  Wifi, 
  Plus, 
  HelpCircle, 
  Maximize2, 
  Minimize2, 
  Volume2, 
  VolumeX,
  Smartphone,
  Settings
} from 'lucide-react';
import { sound } from '../utils/audio';

export default function Header({ 
  onAddDevice, 
  onOpenGuide, 
  onOpenSettings,
  deviceCount 
}) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(sound.muted);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleFullscreen = () => {
    sound.playTap();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  const toggleMute = () => {
    sound.muted = !sound.muted;
    setIsMuted(sound.muted);
    if (!sound.muted) sound.playTap();
  };

  const formattedTime = currentTime.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit',
    second: '2-digit'
  });

  const formattedDate = currentTime.toLocaleDateString([], { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  });

  return (
    <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-6 py-4 sticky top-0 z-30 shadow-lg">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        {/* Brand & Network Pill */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Smartphone className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white">Find My Phone Hub</h1>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                {deviceCount} {deviceCount === 1 ? 'Phone' : 'Phones'}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <Wifi className="w-3.5 h-3.5 text-emerald-400" />
              <span>Home Wi-Fi (2.4 & 5 GHz)</span>
            </div>
          </div>
        </div>

        {/* Live Clock (Ideal for Wall Tablet) */}
        <div className="hidden md:flex flex-col items-center px-4 py-1.5 rounded-xl bg-slate-800/50 border border-slate-700/50">
          <span className="text-2xl font-mono font-bold tracking-wider text-slate-100">
            {formattedTime}
          </span>
          <span className="text-xs text-slate-400 font-medium">
            {formattedDate}
          </span>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center gap-2">
          {/* Sound Toggle */}
          <button
            onClick={toggleMute}
            title={isMuted ? "Unmute tablet sound" : "Mute tablet sound"}
            className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition active:scale-95 border border-slate-700/60"
          >
            {isMuted ? <VolumeX className="w-5 h-5 text-rose-400" /> : <Volume2 className="w-5 h-5" />}
          </button>

          {/* Setup Guide */}
          <button
            onClick={() => { sound.playTap(); onOpenGuide(); }}
            title="Setup Guide"
            className="flex items-center gap-2 px-3.5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition active:scale-95 border border-slate-700/60 text-sm font-medium"
          >
            <HelpCircle className="w-5 h-5 text-amber-400" />
            <span className="hidden sm:inline">Setup Guide</span>
          </button>

          {/* Settings */}
          <button
            onClick={() => { sound.playTap(); onOpenSettings(); }}
            title="Settings & Backup"
            className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition active:scale-95 border border-slate-700/60"
          >
            <Settings className="w-5 h-5 text-slate-400" />
          </button>

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            title="Toggle Fullscreen"
            className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition active:scale-95 border border-slate-700/60"
          >
            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>

          {/* Add Device */}
          <button
            onClick={() => { sound.playTap(); onAddDevice(); }}
            className="flex items-center gap-2 px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition active:scale-95 shadow-lg shadow-blue-600/30 text-sm"
          >
            <Plus className="w-5 h-5" />
            <span>Add Phone</span>
          </button>
        </div>
      </div>
    </header>
  );
}

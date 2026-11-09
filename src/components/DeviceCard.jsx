import React, { useState, useEffect } from 'react';
import { 
  Smartphone, 
  Tablet as TabletIcon,
  Volume2, 
  Bell, 
  QrCode, 
  MoreVertical, 
  Square, 
  Check, 
  Clock, 
  AlertTriangle,
  Loader2,
  Trash2,
  Edit2
} from 'lucide-react';
import { sound } from '../utils/audio';
import { sendPing, sendDismiss } from '../utils/ntfy';

const COLOR_MAP = {
  blue: {
    bg: 'from-blue-500/20 to-indigo-500/10',
    border: 'border-blue-500/30 hover:border-blue-500/60',
    accent: 'text-blue-400',
    pill: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    button: 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/30'
  },
  emerald: {
    bg: 'from-emerald-500/20 to-teal-500/10',
    border: 'border-emerald-500/30 hover:border-emerald-500/60',
    accent: 'text-emerald-400',
    pill: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    button: 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/30'
  },
  purple: {
    bg: 'from-purple-500/20 to-fuchsia-500/10',
    border: 'border-purple-500/30 hover:border-purple-500/60',
    accent: 'text-purple-400',
    pill: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    button: 'bg-purple-600 hover:bg-purple-500 shadow-purple-600/30'
  },
  amber: {
    bg: 'from-amber-500/20 to-orange-500/10',
    border: 'border-amber-500/30 hover:border-amber-500/60',
    accent: 'text-amber-400',
    pill: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    button: 'bg-amber-600 hover:bg-amber-500 shadow-amber-600/30'
  },
  rose: {
    bg: 'from-rose-500/20 to-pink-500/10',
    border: 'border-rose-500/30 hover:border-rose-500/60',
    accent: 'text-rose-400',
    pill: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    button: 'bg-rose-600 hover:bg-rose-500 shadow-rose-600/30'
  },
  cyan: {
    bg: 'from-cyan-500/20 to-sky-500/10',
    border: 'border-cyan-500/30 hover:border-cyan-500/60',
    accent: 'text-cyan-400',
    pill: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    button: 'bg-cyan-600 hover:bg-cyan-500 shadow-cyan-600/30'
  }
};

export default function DeviceCard({ 
  device, 
  onEdit, 
  onDelete, 
  onShowQr 
}) {
  const [isRinging, setIsRinging] = useState(false);
  const [ringSeconds, setRingSeconds] = useState(0);
  const [loadingAction, setLoadingAction] = useState(null); // 'loud' | 'chime' | 'stop'
  const [lastPingStatus, setLastPingStatus] = useState(null); // { time: string, type: string, error?: string }
  const [showMenu, setShowMenu] = useState(false);

  const colors = COLOR_MAP[device.color] || COLOR_MAP.blue;

  useEffect(() => {
    let interval = null;
    if (isRinging) {
      interval = setInterval(() => {
        setRingSeconds(s => s + 1);
      }, 1000);
    } else {
      setRingSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isRinging]);

  const handleRingAlarm = async () => {
    sound.playSiren();
    setLoadingAction('loud');
    try {
      await sendPing({
        server: device.server || 'https://ntfy.sh',
        topic: device.topic,
        deviceName: device.name,
        isLoudAlarm: true
      });
      setIsRinging(true);
      setLastPingStatus({
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'Loud Alarm'
      });
    } catch (err) {
      setLastPingStatus({
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'Failed',
        error: err.message
      });
    } finally {
      setLoadingAction(null);
    }
  };

  const handleChime = async () => {
    sound.playPing();
    setLoadingAction('chime');
    try {
      await sendPing({
        server: device.server || 'https://ntfy.sh',
        topic: device.topic,
        deviceName: device.name,
        isLoudAlarm: false
      });
      setLastPingStatus({
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'Gentle Chime'
      });
    } catch (err) {
      setLastPingStatus({
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'Failed',
        error: err.message
      });
    } finally {
      setLoadingAction(null);
    }
  };

  const handleStopRinging = async () => {
    sound.playTap();
    setLoadingAction('stop');
    try {
      await sendDismiss({
        server: device.server || 'https://ntfy.sh',
        topic: device.topic,
        deviceName: device.name
      });
      setIsRinging(false);
    } catch {
      setIsRinging(false);
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className={`relative rounded-3xl bg-gradient-to-b ${colors.bg} bg-slate-900 border ${isRinging ? 'border-rose-500 animate-ring-siren' : colors.border} p-6 transition-all duration-300 shadow-xl flex flex-col justify-between overflow-hidden group`}>
      {/* Background Accent Glow */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-36 h-36 rounded-full bg-white/5 blur-2xl pointer-events-none" />

      {/* Top Details & Menu */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-14 h-14 rounded-2xl bg-slate-800/90 border border-slate-700/80 flex items-center justify-center shadow-md ${isRinging ? 'animate-bounce text-rose-500' : colors.accent}`}>
              {device.type === 'tablet' ? (
                <TabletIcon className="w-7 h-7" />
              ) : (
                <Smartphone className="w-7 h-7" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight leading-snug">
                {device.name}
              </h2>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-slate-400 font-mono">
                  {device.owner || 'Family Member'}
                </span>
                <span className="text-slate-600">•</span>
                <button 
                  onClick={() => onShowQr(device)}
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition underline decoration-slate-600 hover:decoration-white"
                  title="View Connect QR Code"
                >
                  <QrCode className="w-3.5 h-3.5 text-blue-400" />
                  <span>Connect</span>
                </button>
              </div>
            </div>
          </div>

          {/* Card Context Menu */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition"
            >
              <MoreVertical className="w-5 h-5" />
            </button>

            {showMenu && (
              <>
                <div 
                  className="fixed inset-0 z-20" 
                  onClick={() => setShowMenu(false)} 
                />
                <div className="absolute right-0 mt-1 w-44 rounded-2xl bg-slate-800 border border-slate-700 shadow-2xl py-2 z-30 animate-in fade-in zoom-in-95 duration-150">
                  <button
                    onClick={() => { setShowMenu(false); onShowQr(device); }}
                    className="w-full text-left px-4 py-2.5 text-sm text-slate-200 hover:bg-slate-700/70 flex items-center gap-2"
                  >
                    <QrCode className="w-4 h-4 text-blue-400" />
                    <span>Show QR Code</span>
                  </button>
                  <button
                    onClick={() => { setShowMenu(false); onEdit(device); }}
                    className="w-full text-left px-4 py-2.5 text-sm text-slate-200 hover:bg-slate-700/70 flex items-center gap-2"
                  >
                    <Edit2 className="w-4 h-4 text-amber-400" />
                    <span>Edit Device</span>
                  </button>
                  <div className="my-1 border-t border-slate-700" />
                  <button
                    onClick={() => { setShowMenu(false); onDelete(device.id); }}
                    className="w-full text-left px-4 py-2.5 text-sm text-rose-400 hover:bg-rose-500/10 flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Remove Device</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Status / Last Ping Info */}
        <div className="mb-6 px-3.5 py-2 rounded-xl bg-slate-950/40 border border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5 truncate">
            {isRinging ? (
              <span className="flex items-center gap-1.5 text-rose-400 font-semibold animate-pulse">
                <Volume2 className="w-4 h-4 animate-bounce" />
                <span>Ringing now ({ringSeconds}s)...</span>
              </span>
            ) : lastPingStatus ? (
              <span className="flex items-center gap-1.5 truncate">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate">{lastPingStatus.type} sent at {lastPingStatus.time}</span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>Ready to ping</span>
              </span>
            )}
          </div>
          <span className="text-[10px] font-mono text-slate-500 truncate max-w-[100px] text-right" title={device.topic}>
            {device.topic.slice(0, 10)}...
          </span>
        </div>
      </div>

      {/* Main Touch Actions */}
      <div className="space-y-3">
        {/* BIG LOUD ALARM BUTTON */}
        {!isRinging ? (
          <button
            onClick={handleRingAlarm}
            disabled={loadingAction !== null}
            className="w-full h-16 rounded-2xl bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 active:scale-[0.98] text-white font-extrabold text-lg flex items-center justify-center gap-3 shadow-xl shadow-rose-900/40 transition-all border border-rose-500/30 disabled:opacity-50"
          >
            {loadingAction === 'loud' ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                <span>WAKING PHONE...</span>
              </>
            ) : (
              <>
                <Volume2 className="w-6 h-6 animate-pulse" />
                <span>RING PHONE (LOUD)</span>
              </>
            )}
          </button>
        ) : (
          <button
            onClick={handleStopRinging}
            disabled={loadingAction === 'stop'}
            className="w-full h-16 rounded-2xl bg-slate-800 hover:bg-slate-700 active:scale-[0.98] text-white font-bold text-lg flex items-center justify-center gap-3 shadow-xl transition-all border-2 border-slate-600"
          >
            {loadingAction === 'stop' ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <Square className="w-6 h-6 fill-current text-rose-500" />
            )}
            <span>STOP RINGING</span>
          </button>
        )}

        {/* SECONDARY GENTLE CHIME BUTTON */}
        <button
          onClick={handleChime}
          disabled={loadingAction !== null}
          className="w-full h-12 rounded-xl bg-slate-800/80 hover:bg-slate-700/90 active:scale-[0.98] text-slate-200 hover:text-white font-semibold text-sm flex items-center justify-center gap-2 transition border border-slate-700/60 disabled:opacity-50"
        >
          {loadingAction === 'chime' ? (
            <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
          ) : (
            <Bell className="w-4 h-4 text-amber-400" />
          )}
          <span>Send Gentle Chime</span>
        </button>
      </div>
    </div>
  );
}

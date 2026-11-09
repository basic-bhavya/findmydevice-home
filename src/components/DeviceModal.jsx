import React, { useState, useEffect } from 'react';
import { X, RefreshCw, Smartphone, Tablet as TabletIcon, Sparkles } from 'lucide-react';
import { sound } from '../utils/audio';
import { generateRandomTopic } from '../utils/ntfy';

const COLORS = [
  { id: 'blue', label: 'Blue', class: 'bg-blue-500' },
  { id: 'emerald', label: 'Emerald', class: 'bg-emerald-500' },
  { id: 'purple', label: 'Purple', class: 'bg-purple-500' },
  { id: 'amber', label: 'Amber', class: 'bg-amber-500' },
  { id: 'rose', label: 'Rose', class: 'bg-rose-500' },
  { id: 'cyan', label: 'Cyan', class: 'bg-cyan-500' },
];

export default function DeviceModal({ 
  device, 
  isOpen, 
  onClose, 
  onSave 
}) {
  const [name, setName] = useState('');
  const [owner, setOwner] = useState('');
  const [type, setType] = useState('phone');
  const [color, setColor] = useState('blue');
  const [topic, setTopic] = useState('');
  const [server, setServer] = useState('https://ntfy.sh');
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    if (device) {
      setName(device.name || '');
      setOwner(device.owner || '');
      setType(device.type || 'phone');
      setColor(device.color || 'blue');
      setTopic(device.topic || '');
      setServer(device.server || 'https://ntfy.sh');
    } else {
      setName('');
      setOwner('');
      setType('phone');
      setColor('blue');
      setTopic(generateRandomTopic('home'));
      setServer('https://ntfy.sh');
    }
  }, [device, isOpen]);

  if (!isOpen) return null;

  const handleRegenerateTopic = () => {
    sound.playTap();
    setTopic(generateRandomTopic(name || 'phone'));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    sound.playTap();
    onSave({
      id: device ? device.id : Date.now().toString(),
      name: name.trim(),
      owner: owner.trim() || 'Family',
      type,
      color,
      topic: topic.trim() || generateRandomTopic(name),
      server: server.trim() || 'https://ntfy.sh'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-700 p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <button
          onClick={() => { sound.playTap(); onClose(); }}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-bold text-white mb-1">
          {device ? 'Edit Phone' : 'Add New Phone'}
        </h3>
        <p className="text-xs text-slate-400 mb-6">
          Configure the device name and private notification channel.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Device Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Phone / Device Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Dad's Galaxy S23, Mom's Phone, My Pixel"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition text-sm"
            />
          </div>

          {/* Owner Label */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Owner / Tag
            </label>
            <input
              type="text"
              placeholder="e.g. Dad, Mom, Bhavya, Living Room"
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition text-sm"
            />
          </div>

          {/* Device Type */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Device Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => { sound.playTap(); setType('phone'); }}
                className={`py-3 px-4 rounded-xl border flex items-center justify-center gap-2 text-sm font-semibold transition ${
                  type === 'phone'
                    ? 'bg-blue-600/20 border-blue-500 text-blue-400'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span>Smartphone</span>
              </button>
              <button
                type="button"
                onClick={() => { sound.playTap(); setType('tablet'); }}
                className={`py-3 px-4 rounded-xl border flex items-center justify-center gap-2 text-sm font-semibold transition ${
                  type === 'tablet'
                    ? 'bg-blue-600/20 border-blue-500 text-blue-400'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <TabletIcon className="w-4 h-4" />
                <span>Tablet</span>
              </button>
            </div>
          </div>

          {/* Theme Color */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Tile Accent Color
            </label>
            <div className="flex items-center gap-3">
              {COLORS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => { sound.playTap(); setColor(c.id); }}
                  className={`w-9 h-9 rounded-xl ${c.class} transition flex items-center justify-center ${
                    color === c.id ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-900 scale-110' : 'opacity-70 hover:opacity-100'
                  }`}
                  title={c.label}
                />
              ))}
            </div>
          </div>

          {/* ntfy Topic */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Private Topic Name
              </label>
              <button
                type="button"
                onClick={handleRegenerateTopic}
                className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 transition"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Generate Random</span>
              </button>
            </div>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="Unique secret topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-blue-400 font-mono text-sm focus:outline-none focus:border-blue-500 transition"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Keep this unique to your household so others don't accidentally ping your phone.
            </p>
          </div>

          {/* Advanced Server Toggle */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-xs text-slate-400 hover:text-slate-200 underline"
            >
              {showAdvanced ? 'Hide Advanced Server Settings' : 'Advanced (Self-Hosted Server)'}
            </button>
            {showAdvanced && (
              <div className="mt-2">
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  ntfy Server URL
                </label>
                <input
                  type="url"
                  value={server}
                  onChange={(e) => setServer(e.target.value)}
                  placeholder="https://ntfy.sh"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-blue-500"
                />
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="pt-4 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => { sound.playTap(); onClose(); }}
              className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold shadow-lg shadow-blue-600/30 transition active:scale-95 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{device ? 'Save Changes' : 'Create Phone Card'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

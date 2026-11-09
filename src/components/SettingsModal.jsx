import React, { useState } from 'react';
import { X, Download, Upload, RotateCcw, Check, AlertCircle } from 'lucide-react';
import { sound } from '../utils/audio';

export default function SettingsModal({ 
  isOpen, 
  onClose, 
  devices, 
  onImportDevices, 
  onResetDefaults 
}) {
  const [importJson, setImportJson] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleExport = () => {
    sound.playTap();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(devices, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `findmydevice-backup-${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleCopyJson = () => {
    sound.playTap();
    navigator.clipboard.writeText(JSON.stringify(devices, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleImportSubmit = (e) => {
    e.preventDefault();
    try {
      const parsed = JSON.parse(importJson);
      if (!Array.isArray(parsed)) {
        throw new Error('Config must be a JSON array of devices');
      }
      sound.playTap();
      onImportDevices(parsed);
      setError('');
      setImportJson('');
      onClose();
    } catch (err) {
      setError(err.message || 'Invalid JSON format');
    }
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

        <h3 className="text-xl font-bold text-white mb-1">Hub Settings & Backup</h3>
        <p className="text-xs text-slate-400 mb-6">
          Backup or restore your configured family phones across devices.
        </p>

        <div className="space-y-6">
          {/* Export Section */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
            <h4 className="text-sm font-semibold text-white flex items-center gap-2">
              <Download className="w-4 h-4 text-blue-400" />
              <span>Backup Devices</span>
            </h4>
            <p className="text-xs text-slate-400">
              Download your configured phones as a JSON file to transfer to another tablet or browser.
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleExport}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-2 transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Backup</span>
              </button>
              <button
                onClick={handleCopyJson}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-2 transition border border-slate-700"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : null}
                <span>{copied ? 'Copied to Clipboard' : 'Copy JSON'}</span>
              </button>
            </div>
          </div>

          {/* Import Section */}
          <form onSubmit={handleImportSubmit} className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
            <h4 className="text-sm font-semibold text-white flex items-center gap-2">
              <Upload className="w-4 h-4 text-emerald-400" />
              <span>Restore / Import Configuration</span>
            </h4>
            <p className="text-xs text-slate-400">
              Paste the exported JSON to restore your phone list.
            </p>
            <textarea
              rows={3}
              value={importJson}
              onChange={(e) => setImportJson(e.target.value)}
              placeholder='[ { "id": "1", "name": "Phone", "topic": "..." } ]'
              className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 font-mono text-xs focus:outline-none focus:border-blue-500"
            />
            {error && (
              <div className="flex items-center gap-1.5 text-rose-400 text-xs">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}
            <button
              type="submit"
              disabled={!importJson.trim()}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white text-xs font-semibold flex items-center gap-2 transition"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Restore Backup</span>
            </button>
          </form>

          {/* Reset Section */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            <div className="text-xs text-slate-500">
              Reset device list to defaults
            </div>
            <button
              onClick={() => {
                if (window.confirm('Reset all devices to default list?')) {
                  sound.playTap();
                  onResetDefaults();
                  onClose();
                }
              }}
              className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-medium border border-rose-500/20 flex items-center gap-1.5 transition"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset to Defaults</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

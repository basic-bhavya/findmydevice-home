import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import DeviceCard from './components/DeviceCard';
import DeviceModal from './components/DeviceModal';
import QrModal from './components/QrModal';
import SetupGuideModal from './components/SetupGuideModal';
import SettingsModal from './components/SettingsModal';
import { generateRandomTopic } from './utils/ntfy';
import { Plus, HelpCircle, ShieldCheck } from 'lucide-react';
import { sound } from './utils/audio';

const STORAGE_KEY = 'fmd_home_devices_v1';

const DEFAULT_DEVICES = [
  {
    id: 'dev-1',
    name: "Dad's Phone",
    owner: 'Dad',
    type: 'phone',
    color: 'blue',
    topic: generateRandomTopic('dad'),
    server: 'https://ntfy.sh'
  },
  {
    id: 'dev-2',
    name: "Mom's Phone",
    owner: 'Mom',
    type: 'phone',
    color: 'emerald',
    topic: generateRandomTopic('mom'),
    server: 'https://ntfy.sh'
  },
  {
    id: 'dev-3',
    name: "My Phone",
    owner: 'Bhavya',
    type: 'phone',
    color: 'purple',
    topic: generateRandomTopic('bhavya'),
    server: 'https://ntfy.sh'
  }
];

export default function App() {
  const [devices, setDevices] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load devices from localStorage', e);
    }
    return DEFAULT_DEVICES;
  });

  const [deviceModalOpen, setDeviceModalOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState(null);
  const [qrModalDevice, setQrModalDevice] = useState(null);
  const [guideModalOpen, setGuideModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);

  // Sync with localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(devices));
    } catch (e) {
      console.error('Failed to save devices to localStorage', e);
    }
  }, [devices]);

  const handleAddDevice = () => {
    setEditingDevice(null);
    setDeviceModalOpen(true);
  };

  const handleEditDevice = (device) => {
    setEditingDevice(device);
    setDeviceModalOpen(true);
  };

  const handleSaveDevice = (deviceData) => {
    setDevices(prev => {
      const exists = prev.some(d => d.id === deviceData.id);
      if (exists) {
        return prev.map(d => d.id === deviceData.id ? deviceData : d);
      }
      return [...prev, deviceData];
    });
  };

  const handleDeleteDevice = (deviceId) => {
    if (window.confirm('Are you sure you want to remove this phone from the hub?')) {
      sound.playTap();
      setDevices(prev => prev.filter(d => d.id !== deviceId));
    }
  };

  const handleImportDevices = (newDevices) => {
    setDevices(newDevices);
  };

  const handleResetDefaults = () => {
    setDevices(DEFAULT_DEVICES);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-blue-500 selection:text-white">
      {/* Top Tablet Navigation Header */}
      <Header
        deviceCount={devices.length}
        onAddDevice={handleAddDevice}
        onOpenGuide={() => setGuideModalOpen(true)}
        onOpenSettings={() => setSettingsModalOpen(true)}
      />

      {/* Main Grid View */}
      <main className="max-w-7xl w-full mx-auto px-6 py-8 flex-1">
        {devices.length === 0 ? (
          <div className="h-96 flex flex-col items-center justify-center text-center p-8 rounded-3xl border-2 border-dashed border-slate-800 bg-slate-900/30">
            <div className="w-16 h-16 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-4">
              <Plus className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white mb-1">No Phones Added Yet</h3>
            <p className="text-sm text-slate-400 max-w-sm mb-6">
              Add your family members' Android phones to start ringing them with one tap from this tablet.
            </p>
            <button
              onClick={handleAddDevice}
              className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 font-bold text-white text-sm transition shadow-lg shadow-blue-600/30 active:scale-95 flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add First Phone</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {devices.map(device => (
              <DeviceCard
                key={device.id}
                device={device}
                onEdit={handleEditDevice}
                onDelete={handleDeleteDevice}
                onShowQr={(dev) => setQrModalDevice(dev)}
              />
            ))}

            {/* Quick Add Card on Grid */}
            <button
              onClick={() => { sound.playTap(); handleAddDevice(); }}
              className="min-h-[280px] rounded-3xl border-2 border-dashed border-slate-800 hover:border-slate-700 hover:bg-slate-900/40 p-6 flex flex-col items-center justify-center gap-3 text-slate-400 hover:text-slate-200 transition group active:scale-[0.99]"
            >
              <div className="w-14 h-14 rounded-2xl bg-slate-800/80 group-hover:bg-slate-700/80 flex items-center justify-center text-slate-400 group-hover:text-blue-400 transition shadow-inner">
                <Plus className="w-7 h-7" />
              </div>
              <div className="text-center">
                <span className="font-bold text-base block text-slate-300 group-hover:text-white">Add Another Phone</span>
                <span className="text-xs text-slate-500 mt-0.5 block">Configure custom name & topic</span>
              </div>
            </button>
          </div>
        )}
      </main>

      {/* Bottom Kiosk Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 px-6 py-4 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>High-Priority FCM Push • Bypasses DND • 0% Background Battery Drain</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => { sound.playTap(); setGuideModalOpen(true); }}
              className="hover:text-slate-300 transition flex items-center gap-1"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>How it works</span>
            </button>
            <span>•</span>
            <span>Home Hub Kiosk v1.0</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <DeviceModal
        isOpen={deviceModalOpen}
        device={editingDevice}
        onClose={() => setDeviceModalOpen(false)}
        onSave={handleSaveDevice}
      />

      <QrModal
        device={qrModalDevice}
        onClose={() => setQrModalDevice(null)}
      />

      <SetupGuideModal
        isOpen={guideModalOpen}
        onClose={() => setGuideModalOpen(false)}
      />

      <SettingsModal
        isOpen={settingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
        devices={devices}
        onImportDevices={handleImportDevices}
        onResetDefaults={handleResetDefaults}
      />
    </div>
  );
}

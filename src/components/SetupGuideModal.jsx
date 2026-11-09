import React from 'react';
import { X, Smartphone, BellRing, Volume2, ShieldCheck, CheckCircle2, Tablet } from 'lucide-react';
import { sound } from '../utils/audio';

export default function SetupGuideModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-3xl bg-slate-900 border border-slate-700 p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
        <button
          onClick={() => { sound.playTap(); onClose(); }}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
            <BellRing className="w-5 h-5" />
          </div>
          <h3 className="text-2xl font-bold text-white">How to Setup Target Phones</h3>
        </div>
        <p className="text-sm text-slate-400 mb-6">
          Follow these 3 quick steps on each family member's phone so it rings out loud even when set to silent.
        </p>

        <div className="space-y-6">
          {/* STEP 1 */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex gap-4">
            <div className="w-8 h-8 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold text-sm shrink-0">
              1
            </div>
            <div>
              <h4 className="text-base font-semibold text-white flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-blue-400" />
                <span>Install "ntfy" on the Smartphone</span>
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Download the free <b>ntfy</b> app from the <b>Google Play Store</b>. (The Google Play edition uses Google's battery-saving push channel so it uses <b>0% extra battery</b> in the background).
              </p>
            </div>
          </div>

          {/* STEP 2 */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex gap-4">
            <div className="w-8 h-8 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold text-sm shrink-0">
              2
            </div>
            <div>
              <h4 className="text-base font-semibold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Subscribe to the Phone's Topic</span>
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                In the ntfy app, tap the <b>+</b> button. Either tap the <b>QR scanner icon</b> to scan the QR code from this tablet, or type in the topic name (e.g. <code>fmd-dad-89f2</code>).
              </p>
            </div>
          </div>

          {/* STEP 3 (CRITICAL) */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex gap-4">
            <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center justify-center font-bold text-sm shrink-0">
              3
            </div>
            <div>
              <h4 className="text-base font-semibold text-amber-200 flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-amber-400" />
                <span>Crucial: Enable Continuous Alarm & DND Bypass</span>
              </h4>
              <ul className="text-xs text-amber-300/80 mt-1.5 space-y-1.5 list-disc list-inside">
                <li>
                  <b>In ntfy topic settings:</b> Toggle ON <b>"Keep alerting until dismissed"</b>. This ensures the siren plays in a continuous loop like a phone call or alarm until found.
                </li>
                <li>
                  <b>In Android Phone Settings:</b> Long-press the ntfy app &rarr; <i>App Info &rarr; Notifications</i>. Ensure Urgent/Max notifications are allowed to <b>Bypass Do Not Disturb</b> and have sound enabled.
                </li>
              </ul>
            </div>
          </div>

          {/* TABLET KIOSK TIP */}
          <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60 flex gap-4">
            <div className="w-8 h-8 rounded-full bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center font-bold text-sm shrink-0">
              💡
            </div>
            <div>
              <h4 className="text-base font-semibold text-purple-200 flex items-center gap-2">
                <Tablet className="w-4 h-4 text-purple-400" />
                <span>Old Tablet Pro-Tip (Wall / Desk Kiosk)</span>
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                On your old Android tablet, install <b>Fully Kiosk Browser</b> from the Play Store and set the start URL to this dashboard. Fully Kiosk keeps the screen on, auto-wakes when motion is detected using the front camera, and prevents accidental app exits!
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={() => { sound.playTap(); onClose(); }}
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition shadow-lg shadow-blue-600/30"
          >
            Got it, Let's Go!
          </button>
        </div>
      </div>
    </div>
  );
}

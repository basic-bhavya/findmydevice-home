import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { X, Copy, Check, ExternalLink, Smartphone } from 'lucide-react';
import { sound } from '../utils/audio';

export default function QrModal({ device, onClose }) {
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [copied, setCopied] = useState(false);

  const server = device?.server || 'https://ntfy.sh';
  const subscribeUrl = `${server.replace(/\/+$/, '')}/${device?.topic}`;

  useEffect(() => {
    if (device?.topic) {
      QRCode.toDataURL(subscribeUrl, {
        width: 320,
        margin: 2,
        color: {
          dark: '#0f172a',
          light: '#ffffff'
        }
      })
      .then(url => setQrDataUrl(url))
      .catch(err => console.error(err));
    }
  }, [device, subscribeUrl]);

  if (!device) return null;

  const copyTopic = () => {
    sound.playTap();
    navigator.clipboard.writeText(device.topic);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl bg-slate-900 border border-slate-700 p-6 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={() => { sound.playTap(); onClose(); }}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center">
            <Smartphone className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white">Connect {device.name}</h3>
          <p className="text-xs text-slate-400 mt-1">
            Scan this QR code from the phone or type the topic into the ntfy app.
          </p>
        </div>

        {/* QR Code Container */}
        <div className="bg-white p-4 rounded-2xl flex items-center justify-center shadow-inner mb-6 mx-auto w-fit">
          {qrDataUrl ? (
            <img src={qrDataUrl} alt="Connect QR Code" className="w-60 h-60 rounded-lg" />
          ) : (
            <div className="w-60 h-60 flex items-center justify-center text-slate-400 text-sm">
              Generating QR...
            </div>
          )}
        </div>

        {/* Topic Pill & Copy */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3.5 mb-6 flex items-center justify-between gap-3">
          <div className="truncate">
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 block">Topic Name</span>
            <span className="text-sm font-mono font-semibold text-blue-400 truncate block">
              {device.topic}
            </span>
          </div>
          <button
            onClick={copyTopic}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition shrink-0 border border-slate-700"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        {/* Quick Instructions */}
        <div className="text-xs text-slate-400 bg-slate-800/40 p-3.5 rounded-xl border border-slate-800 space-y-1">
          <p className="font-semibold text-slate-300">How to link this phone:</p>
          <ol className="list-decimal list-inside space-y-0.5 text-slate-400">
            <li>Open the <b>ntfy</b> app on {device.name}.</li>
            <li>Tap <b>+ (Subscribe)</b> & scan this QR code.</li>
            <li>Enable <b>"Keep alerting until dismissed"</b> in topic settings.</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

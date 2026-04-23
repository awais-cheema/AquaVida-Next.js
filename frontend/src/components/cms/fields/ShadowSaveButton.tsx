'use client';

import React, { useEffect, useRef } from 'react';
import { extractValues } from '@/lib/cms-utils';

/**
 * ShadowSaveButton
 * Broadcasts the current session data to any open preview windows.
 * Implements a handshake system to ensure new windows get the current data immediately.
 */
export default function ShadowSaveButton({ data, type, to = '/' }: { data?: any, type?: string, to?: string }) {
  const [status, setStatus] = React.useState<'idle' | 'broadcasting' | 'success'>('idle');
  const channelRef = useRef<BroadcastChannel | null>(null);

  // 1. Setup Channel and Listener for requests
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const channel = new BroadcastChannel('keystatic-shadow-preview');
    channelRef.current = channel;

    channel.onmessage = (event) => {
      if (event.data === 'REQUEST_DATA' && data) {
        console.log('[ShadowStream] Preview window requested data. Sending...');
        const flatData = extractValues(data);
        channel.postMessage({ type, data: flatData, to });
      }
    };

    return () => {
      channel.close();
      channelRef.current = null;
    };
  }, [data, type, to]);

  // 2. Broadcast data whenever it changes
  useEffect(() => {
    if (channelRef.current && data) {
      const flatData = extractValues(data);
      channelRef.current.postMessage({ type, data: flatData, to });
    }
  }, [data, type, to]);

  const handleOpenPreview = () => {
    setStatus('broadcasting');
    
    // Open viewer
    const previewUrl = `/preview/live?to=${encodeURIComponent(to)}&type=${type}`;
    window.open(previewUrl, '_blank');
    
    setStatus('success');
    setTimeout(() => setStatus('idle'), 2000);
  };

  return (
    <div className="bg-[#05070A] border border-amber-500/20 rounded-2xl p-6 shadow-2xl overflow-hidden relative group">
      {/* Decorative background glow */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/10 blur-[80px] rounded-full pointer-events-none" />
      
      <div className="relative z-10 flex flex-col gap-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
               <div className={`w-2 h-2 rounded-full bg-amber-500 ${status === 'broadcasting' ? 'animate-ping' : 'animate-pulse'}`} />
               <h3 className="text-amber-500 font-black text-[11px] uppercase tracking-[0.3em]">
                 Shadow Stream Engine
               </h3>
            </div>
            <p className="text-white/40 text-[11px] leading-relaxed max-w-[260px] font-medium">
              Changes are broadcasted in real-time to your preview windows.
            </p>
          </div>
          
          <button
            onClick={handleOpenPreview}
            className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-white/50 hover:text-white"
            title="Open Preview Window"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3">
          <button
            onClick={() => {
              setStatus('broadcasting');
              const flatData = extractValues(data);
              channelRef.current?.postMessage({ type, data: flatData, to });
              setTimeout(() => setStatus('success'), 800);
              setTimeout(() => setStatus('idle'), 2000);
            }}
            className={`
              w-full py-4 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-3
              ${status === 'success' ? 'bg-green-600 text-white shadow-[0_0_30px_rgba(22,163,74,0.4)]' : 
                'bg-amber-500 text-black hover:bg-amber-400 active:scale-[0.98] shadow-[0_0_40px_rgba(245,158,11,0.2)]'}
            `}
          >
            {status === 'broadcasting' ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Syncing...
              </span>
            ) : status === 'success' ? 'Synchronized!' : 'Broadcasting Changes'}
          </button>
          
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-4">
              <div className="flex flex-col">
                <span className="text-[8px] text-white/20 uppercase font-bold tracking-widest mb-0.5">Target Route</span>
                <span className="text-[10px] text-white/40 font-mono italic">{to}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[8px] text-white/20 uppercase font-bold tracking-widest mb-0.5">Data Type</span>
                <span className="text-[10px] text-white/40 font-mono italic">{type}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-white/20" />
              <span className="text-[9px] text-white/20 font-bold uppercase tracking-widest">v2.1 Stable</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

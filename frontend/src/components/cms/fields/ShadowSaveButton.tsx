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
    <div className="p-5 border border-amber-500/30 bg-amber-500/5 rounded-xl mb-10 backdrop-blur-sm shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
             <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
             <h3 className="text-amber-500 font-black text-[10px] uppercase tracking-[0.2em]">
               Shadow Live Engine
             </h3>
          </div>
          <p className="text-white/40 text-[10px] leading-relaxed max-w-[240px]">
            Syncing live with your preview windows. No Git commits required.
          </p>
        </div>
        
        <button
          onClick={handleOpenPreview}
          className={`
            px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300
            ${status === 'success' ? 'bg-green-500 text-white' : 
              'bg-amber-500 text-black hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(245,158,11,0.3)]'}
          `}
        >
          {status === 'success' ? 'SYNCED!' : 'OPEN LIVE PREVIEW'}
        </button>
      </div>
      
      <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
        <span className="text-[9px] text-white/20 uppercase font-bold tracking-widest">
          Route: {to}
        </span>
        <button 
          onClick={() => {
            const flatData = extractValues(data);
            channelRef.current?.postMessage({ type, data: flatData, to });
          }}
          className="text-[9px] text-amber-500/50 hover:text-amber-500 uppercase font-black transition-colors"
        >
          Force Manual Sync
        </button>
      </div>
    </div>
  );
}

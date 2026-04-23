'use client';

import React from 'react';

/**
 * ShadowSaveButton
 * A button that takes the current live fields from Keystatic,
 * saves them to a temporary cache, and opens a full-page live preview.
 */
export default function ShadowSaveButton({ data, type }: { data?: any, type?: string }) {
  const [status, setStatus] = React.useState<'idle' | 'saving' | 'success' | 'error'>('idle');

  const handleShadowSave = async () => {
    if (!data) {
      console.error('No data provided to ShadowSaveButton');
      return;
    }

    setStatus('saving');
    try {
      // 1. POST the current live data to our temporary cache
      const res = await fetch('/api/preview/cache', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          data,
          timestamp: Date.now()
        }),
      });

      if (!res.ok) throw new Error('Failed to cache draft');
      
      const { draftId } = await res.json();

      // 2. Open the Live Preview route with this draft ID
      // This allows seeing the ACTUAL site layout with unsaved CMS data
      const previewUrl = `/api/preview/live?draftId=${draftId}`;
      window.open(previewUrl, '_blank');
      
      setStatus('success');
      setTimeout(() => setStatus('idle'), 2000);
    } catch (e) {
      console.error(e);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <div className="p-5 border border-amber-500/30 bg-amber-500/5 rounded-xl mb-10 backdrop-blur-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-amber-500 font-black text-xs uppercase tracking-[0.2em] mb-1">
            Shadow Preview System
          </h3>
          <p className="text-white/40 text-[10px] leading-relaxed max-w-[240px]">
            View your changes on the actual site layout <span className="text-amber-500/50 italic">without</span> a Git commit.
          </p>
        </div>
        
        <button
          onClick={handleShadowSave}
          disabled={status === 'saving'}
          className={`
            px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300
            ${status === 'saving' ? 'bg-amber-500/20 text-amber-500 animate-pulse' : 
              status === 'success' ? 'bg-green-500 text-white' : 
              'bg-amber-500 text-black hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(245,158,11,0.3)]'}
          `}
        >
          {status === 'saving' ? 'GENERATING...' : status === 'success' ? 'OPENED!' : 'OPEN LIVE PREVIEW'}
        </button>
      </div>
      
      {status === 'error' && (
        <p className="text-red-500 text-[10px] mt-2 font-bold uppercase tracking-tighter">
          Error: Could not generate draft. Please try again.
        </p>
      )}
    </div>
  );
}

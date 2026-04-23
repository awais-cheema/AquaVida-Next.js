'use client';

import React from 'react';
import ShadowSaveButton from '../fields/ShadowSaveButton';

/**
 * SimplePreview
 * A minimal preview component that just shows the Shadow Save button.
 * Used for pages that don't have a full visual preview yet.
 */
export default function SimplePreview(props: any) {
  const { fields } = props;

  return (
    <div className="w-full h-full overflow-auto bg-[#05070A] flex flex-col items-center justify-start pt-20 px-8 text-center">
      <div className="max-w-md w-full">
        <ShadowSaveButton data={fields} type="generic" />
        
        <div className="mt-12 pt-12 border-t border-white/5">
          <p className="text-white/30 text-xs uppercase tracking-[0.2em] font-black mb-4">
            Live Preview Status
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
            <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-white/40 text-[10px] font-bold uppercase tracking-wider">
              Rich Visual Preview coming soon
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ServicesClient from '@/app/services/ServicesClient';
import BlogPostPreview from '@/components/cms/previews/BlogPostPreview';
import AboutClient from '@/app/about/AboutClient';
import FinancingClient from '@/app/finance/FinancingClient';
import ContactClient from '@/app/contact/ContactClient';
import PrivacyPolicyClient from '@/app/privacy-policy/PrivacyPolicyClient';
import TermsConditionsClient from '@/app/terms-conditions/TermsConditionsClient';
import BlogClient from '@/app/blog/BlogClient';
import PortfolioClient from '@/app/portfolio/PortfolioClient';
import PortfolioProjectShell from '@/components/portfolio/PortfolioProjectShell';

/**
 * LivePreviewContent
 * A client-side viewer that listens for data broadcasts from the Keystatic Admin.
 */
function LivePreviewContent() {
  const searchParams = useSearchParams();
  const type = searchParams.get('type') || 'generic';
  
  const [previewData, setPreviewData] = useState<any>(null);
  const [lastSync, setLastSync] = useState<number>(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. Establish the listener
    const channel = new BroadcastChannel('keystatic-shadow-preview');
    
    channel.onmessage = (event) => {
      // Handle handshake requests (ignore if we are a viewer)
      if (event.data === 'REQUEST_DATA') return;

      if (event.data && event.data.data) {
        console.log('[LivePreview] Syncing update at', new Date().toLocaleTimeString());
        setPreviewData(event.data.data);
        setLastSync(Date.now());
      }
    };

    // 2. Request current data state immediately and periodically until connected
    channel.postMessage('REQUEST_DATA');
    const interval = setInterval(() => {
       if (!previewData) {
         channel.postMessage('REQUEST_DATA');
       }
    }, 1500);

    return () => {
      channel.close();
      clearInterval(interval);
    };
  }, [previewData]);

  if (!previewData) {
    return (
      <div className="min-h-screen bg-[#05070A] flex flex-col items-center justify-center text-white font-allomira">
        <div className="flex flex-col items-center gap-6 max-w-sm text-center">
          <div className="relative">
             <div className="w-16 h-16 border-2 border-amber-500/20 rounded-full" />
             <div className="absolute inset-0 w-16 h-16 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          </div>
          <div>
            <h1 className="text-xl font-bold uppercase tracking-[0.2em] mb-3 text-amber-500">Live Link Initializing</h1>
            <p className="text-white/40 text-[10px] leading-relaxed uppercase tracking-wider font-medium">
               Waiting for data from the Keystatic Admin... <br />
               Keep the Admin window open and active.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const PreviewStatus = ({ type }: { type: string }) => (
    <div className="fixed top-0 left-0 right-0 bg-amber-500 py-1.5 px-4 z-[9999] flex items-center justify-center gap-4 shadow-xl border-b border-black/10">
       <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
       <span className="text-black text-[10px] font-black uppercase tracking-[0.2em]">
         Live {type} Sync — {new Date(lastSync).toLocaleTimeString()}
       </span>
    </div>
  )

  // --- RENDERING LOGIC ---
  
  // 1. Services Page
  if (type === 'services' || type === 'servicePages') {
    return (
      <div className="min-h-screen bg-[#05070A]">
        <PreviewStatus type="Service Architecture" />
        <ServicesClient
          initialServices={previewData?.services} 
          initialTestimonials={previewData?.testimonials}
          initialFaqItems={previewData?.faqItems}
          heroImage={previewData?.heroImage}
          heroTitle={previewData?.heroTitle}
          heroTitleRight={previewData?.heroTitleRight}
          expertiseLabel={previewData?.expertiseLabel}
          expertiseTitle={previewData?.expertiseTitle}
          expertiseDescription={previewData?.expertiseDescription}
          corePrinciplesTitle={previewData?.corePrinciplesTitle}
          corePrinciples={previewData?.corePrinciples}
          ctaLabel={previewData?.ctaLabel}
          ctaHeading={previewData?.ctaHeading}
          ctaButtonText={previewData?.ctaButtonText}
          ctaButtonHref={previewData?.ctaButtonHref}
        />
      </div>
    );
  }

  // 2. Blog Post
  if (type === 'posts') {
    return (
      <div className="min-h-screen">
        <PreviewStatus type="Article" />
        <BlogPostPreview fields={previewData} />
      </div>
    );
  }

  // 3. Blog Listing
  if (type === 'blog') {
    return (
      <div className="min-h-screen">
        <PreviewStatus type="Blog Index" />
        <BlogClient 
          initialPosts={[]} 
          faqItems={previewData?.faqItems} 
          categories={previewData?.categories}
          headerLabel={previewData?.headerLabel}
          headerTitle={previewData?.headerTitle}
          headerDescription={previewData?.headerDescription}
        />
      </div>
    );
  }

  // 4. About Page
  if (type === 'about' || type === 'aboutPage') {
     return (
      <div className="min-h-screen">
        <PreviewStatus type="About" />
        <AboutClient data={previewData} />
      </div>
     );
  }

  // 4a. Portfolio Listing
  if (type === 'portfolio' || type === 'portfolioListingPage') {
    return (
      <div className="min-h-screen">
        <PreviewStatus type="Portfolio Archive" />
        <PortfolioClient 
          faqItems={previewData?.faqItems}
          headerLabel={previewData?.headerLabel}
          headerTitle={previewData?.headerTitle}
          headerDescription={previewData?.headerDescription}
          curationLabel={previewData?.curationLabel}
          curationValue={previewData?.curationValue}
          focusLabel={previewData?.focusLabel}
          focusValue={previewData?.focusValue}
          projects={previewData?.projects}
          ctaTitle={previewData?.ctaTitle}
          ctaDescription={previewData?.ctaDescription}
          ctaButtonText={previewData?.ctaButtonText}
          ctaButtonHref={previewData?.ctaButtonHref}
        />
      </div>
    );
  }

  // 4b. Portfolio Project
  if (type === 'portfolioProject' || (type === 'portfolio' && previewData?.philosophyTitle)) {
    return (
      <div className="min-h-screen">
        <PreviewStatus type="Portfolio Project" />
        <PortfolioProjectShell p={{
          ...previewData,
          id: previewData?.slug || 'preview',
          // Ensure description and bodies are treated correctly by CmsContent inside the shell
        }} />
      </div>
    );
  }

  // 5. Finance Page
  if (type === 'finance') {
    return (
      <div className="min-h-screen">
        <PreviewStatus type="Financing" />
        <FinancingClient 
          partners={previewData?.partners} 
          faqItems={previewData?.faqItems} 
          comparison={previewData?.comparison}
          heroLabel={previewData?.heroLabel}
          heroTitle={previewData?.heroTitle}
          heroDescription={previewData?.heroDescription}
          heroImage={previewData?.heroImage}
        />
      </div>
    )
  }

  // 6. Contact Page
  if (type === 'contact') {
    return (
      <div className="min-h-screen">
        <PreviewStatus type="Contact" />
        <ContactClient data={previewData} />
      </div>
    )
  }

  // 7. Privacy/Terms
  if (type === 'privacy') {
    return (
      <div className="min-h-screen">
        <PreviewStatus type="Privacy Policy" />
        <PrivacyPolicyClient data={previewData} />
      </div>
    )
  }
  if (type === 'terms') {
    return (
      <div className="min-h-screen">
        <PreviewStatus type="Terms & Conditions" />
        <TermsConditionsClient data={previewData} />
      </div>
    )
  }

  return (
    <div className="p-20 text-white bg-[#05070A] min-h-screen">
      <div className="flex items-center gap-4 mb-6">
         <div className="px-3 py-1 bg-amber-500 text-black text-[10px] font-black uppercase">Generic Preview</div>
         <h1 className="text-2xl font-bold uppercase tracking-widest leading-none">Content Stream</h1>
      </div>
      <p className="text-white/40 mb-10 text-sm">Previewing raw data for type: <span className="text-white font-bold">{type}</span></p>
      <div className="bg-white/5 p-8 rounded-xl border border-white/10 font-mono text-[11px] leading-relaxed text-amber-500/80">
        <pre>{JSON.stringify(previewData, null, 2)}</pre>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense>
      <LivePreviewContent />
    </Suspense>
  );
}

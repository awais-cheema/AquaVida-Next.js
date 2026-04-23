'use client';

import { DocumentRenderer } from '@keystatic/core/renderer';
import { Clock, User, Calendar, ArrowLeft } from 'lucide-react';
import ShadowSaveButton from '../fields/ShadowSaveButton';

export default function BlogPostPreview(props: any) {
  const { fields } = props;
  
  const title = fields.title.value;
  const excerpt = fields.excerpt.value;
  const content = fields.content.value;
  const featuredImage = fields.featured_image.value;
  const category = fields.category.value;
  const authorName = fields.author_name.value;
  const publishedAt = fields.published_at.value;
  const readTime = fields.read_time.value;

  return (
    <div className="w-full h-full overflow-auto bg-[#05070A] text-[#DCE3F0] font-sans selection:bg-white/20">
      <div className="max-w-[900px] mx-auto px-6 md:px-12 py-16">
        <ShadowSaveButton data={fields} type="blog" />
        {/* Mock Navigation */}
        <div className="inline-flex items-center gap-2 text-white/40 text-sm tracking-widest uppercase font-bold mb-16 opacity-50">
          <ArrowLeft size={14} />
          All Articles (Preview Mode)
        </div>

        {/* Featured image */}
        {featuredImage && (
          <div className="relative aspect-video rounded-[40px] overflow-hidden mb-16 border border-white/5">
            <img
              src={featuredImage}
              alt={title || ''}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Header */}
        <div className="mb-16">
          <span className="inline-block px-6 py-2 rounded-full bg-[#0D5699]/20 text-[#0D5699] text-sm font-bold tracking-widest uppercase mb-8">
            {category || 'Uncategorized'}
          </span>
          <h1 className="text-[clamp(36px,4vw,64px)] font-black leading-[0.95] tracking-tighter uppercase mb-10 text-white">
            {title || 'Untitled Post'}
          </h1>
          {excerpt && (
            <p className="text-xl text-white/50 font-light leading-relaxed mb-10">
              {excerpt}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-8 text-sm text-white/30 tracking-widest uppercase font-bold pt-8 border-t border-white/5">
            <span className="flex items-center gap-2">
              <User size={14} /> {authorName || 'AquaVida Author'}
            </span>
            <span className="flex items-center gap-2">
              <Calendar size={14} />
              {publishedAt ? new Date(publishedAt).toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric',
              }) : 'Draft Date'}
            </span>
            <span className="flex items-center gap-2">
              <Clock size={14} /> {readTime || '5 min read'}
            </span>
          </div>
        </div>

        {/* Body content */}
        <div className="prose prose-invert prose-lg max-w-none
            prose-headings:font-black prose-headings:tracking-tight prose-headings:uppercase
            prose-p:text-white/70 prose-p:leading-relaxed
            prose-a:text-[#0D5699] prose-a:no-underline
            prose-strong:text-white prose-hr:border-white/10
            prose-img:rounded-[24px]">
          <DocumentRenderer document={content} />
        </div>
      </div>
    </div>
  );
}

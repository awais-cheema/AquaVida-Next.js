'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Clock, User, Calendar, Search } from 'lucide-react';
import FAQ from '@/components/layout/FAQ';
import { BlogPost } from '@/lib/api';

interface BlogClientProps {
    initialPosts: BlogPost[];
    faqItems?: { question: string; answer: any }[];
    categories?: string[];
}

const BLOG_FAQS = [
    {
        question: "Do you offer architectural consultation through the blog?",
        answer: "Our articles are designed to inspire and educate. For specific project consultations, we recommend engaging directly with our design lab through the Contact page."
    },
    {
        question: "Can I contribute to the AquaVida design philosophy?",
        answer: "We are always looking for visionary voices in architectural design and aquatic engineering. Reach out to our editor for guest contribution guidelines."
    }
];

const kineticEntry = {
    initial: { opacity: 0, y: 40, scale: 0.98 },
    whileInView: { 
        opacity: 1, 
        y: 0, 
        scale: 1,
        transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } 
    } as any,
    viewport: { once: true } as any
};

export default function BlogClient({ initialPosts = [], faqItems, categories }: BlogClientProps) {
    const activeFaqs = faqItems?.length ? faqItems : BLOG_FAQS
    const activeCategories = categories?.length ? ['All', ...categories] : ['All', 'Design', 'Engineering', 'Lighting', 'Sustainability']
    const [selectedCategory, setSelectedCategory] = useState('All');
    
    const featuredPost = initialPosts.find(p => p.is_featured) || initialPosts[0];
    const filteredPosts = initialPosts.filter(p => {
        const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
        return matchesCategory && p.id !== featuredPost?.id;
    });

    return (
        <div className="min-h-screen bg-[#05070A] text-[#DCE3F0] font-allomira selection:bg-[#0D5699] selection:text-white select-text pt-[12vh]">
            
            {/* ── SEARCH & FILTER BAR ─────────────────────────────────────────── */}
            <div className="max-w-[1800px] mx-auto px-6 md:px-16 lg:px-24 mb-24">
                <div className="flex flex-col md:flex-row justify-between items-center gap-12 p-8 rounded-[40px] border border-white/5 bg-white/[0.02] backdrop-blur-3xl">
                    <div className="relative w-full md:w-1/2">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/30" size={20} />
                        <input 
                            type="text" 
                            placeholder="Search articles, engineering, design..." 
                            className="w-full bg-white/5 border border-white/10 rounded-full py-5 pl-16 pr-8 focus:outline-none focus:border-[#0D5699] transition-all text-xl font-light"
                        />
                    </div>
                    <div className="flex gap-4 overflow-x-auto w-full md:w-auto scrollbar-hide">
                        {activeCategories.map(cat => (
                            <button 
                                key={cat} 
                                onClick={() => setSelectedCategory(cat)}
                                className={`btn px-8 py-4 rounded-full border text-lg font-medium transition-all whitespace-nowrap ${
                                    selectedCategory === cat 
                                    ? 'bg-[#0D5699] border-transparent text-white' 
                                    : 'border-white/10 hover:border-white/40 text-white/60 hover:text-white'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── EMPTY STATE ────────────────────────────────────────────────── */}
            {initialPosts.length === 0 && (
                <section className="px-6 md:px-16 lg:px-24 max-w-[1800px] mx-auto mb-32 text-center py-64">
                    <h2 className="text-4xl font-light text-white/20 uppercase tracking-widest">Generating Digital Manifesto...</h2>
                    <p className="text-xl text-white/10 mt-8">Dynamic editorial content is currently being synchronized.</p>
                </section>
            )}

            {/* ── FEATURED POST ────────────────────────────────────────────── */}
            {featuredPost && (
                <section className="px-6 md:px-16 lg:px-24 max-w-[1800px] mx-auto mb-32 group">
                    <Link href={`/blog/${featuredPost.slug || featuredPost.id}`}>
                        <motion.div 
                            {...kineticEntry}
                            className="relative h-[80vh] rounded-[80px] overflow-hidden flex items-end p-12 md:p-24"
                        >
                            {featuredPost.featured_image_url && (
                                <Image src={featuredPost.featured_image_url} alt="" fill className="object-cover transition-transform duration-1000 group-hover:scale-105" />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#05070A] via-[#05070A]/40 to-transparent" />
                            
                            <div className="relative z-10 max-w-5xl">
                                <span className="inline-block px-6 py-2 rounded-full bg-[#0D5699] text-white text-sm font-bold tracking-widest uppercase mb-8">Featured Article</span>
                                <h2 className="text-[clamp(40px,5vw,90px)] font-black leading-[0.9] tracking-tighter mb-8 uppercase">
                                    {featuredPost.title}
                                </h2>
                                <p className="text-2xl md:text-3xl text-white/60 font-light mb-12 max-w-4xl line-clamp-2">
                                    {featuredPost.excerpt}
                                </p>
                                <div className="flex items-center gap-12 text-lg text-white/40">
                                    <span className="flex items-center gap-2"><User size={18} /> {featuredPost.author_name}</span>
                                    <span className="flex items-center gap-2"><Calendar size={18} /> {new Date(featuredPost.published_at).toLocaleDateString()}</span>
                                    <span className="flex items-center gap-2"><Clock size={18} /> {featuredPost.read_time}</span>
                                </div>
                            </div>
                        </motion.div>
                    </Link>
                </section>
            )}

            {/* ── POSTS GRID ───────────────────────────────────────────────── */}
            <section className="px-6 md:px-16 lg:px-24 max-w-[1800px] mx-auto mb-64">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {filteredPosts.map((post, i) => (
                        <motion.div 
                            key={post.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: i * 0.1 }}
                            viewport={{ once: true }}
                            className="group flex flex-col h-full"
                        >
                            <Link href={`/blog/${post.slug || post.id}`} className="flex flex-col h-full">
                                <div className="relative aspect-[4/3] rounded-[48px] overflow-hidden mb-12">
                                    {post.featured_image_url && (
                                        <Image src={post.featured_image_url} alt="" fill className="object-cover transition-transform duration-1000 group-hover:scale-110" />
                                    )}
                                    <div className="absolute top-8 left-8">
                                        <span className="px-6 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-bold tracking-widest uppercase">{post.category}</span>
                                    </div>
                                </div>
                                <div className="flex-1 flex flex-col">
                                    <h3 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight leading-tight group-hover:text-white transition-colors">{post.title}</h3>
                                    <p className="text-xl text-white/40 font-light mb-8 line-clamp-3">
                                        {post.excerpt}
                                    </p>
                                    <div className="mt-auto flex items-center justify-between pt-8 border-t border-white/5">
                                        <div className="flex items-center gap-6 text-sm text-white/30 tracking-widest uppercase font-bold">
                                            <span>{new Date(post.published_at).toLocaleDateString()}</span>
                                            <span>•</span>
                                            <span>{post.read_time}</span>
                                        </div>
                                        <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-[#0D5699] group-hover:border-transparent transition-all">
                                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ── NEWSLETTER ───────────────────────────────────────────────── */}
            <section className="px-6 md:px-16 lg:px-24 max-w-[1800px] mx-auto mb-64">
                <motion.div 
                    {...kineticEntry}
                    className="p-16 md:p-32 rounded-[80px] bg-gradient-to-br from-[#0D5699]/20 to-transparent border border-white/5 text-center flex flex-col items-center"
                >
                    <span className="text-[#0D5699] font-black tracking-[0.6em] uppercase text-sm mb-8 block">The Liquid Manifesto</span>
                    <h2 className="text-[clamp(40px,5vw,80px)] font-black tracking-tighter leading-[0.9] mb-12 uppercase">
                        Subscribe to<br />Design Intelligence
                    </h2>
                    <p className="text-2xl text-white/40 font-light max-w-3xl mb-16 leading-relaxed">
                        Curated monthly architectural insights and technological breakthroughs in aquatic engineering delivered to your inbox.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-6 w-full max-w-2xl">
                        <input 
                            type="email" 
                            placeholder="email@example.com" 
                            className="flex-1 bg-white/5 border border-white/10 rounded-full py-6 px-12 focus:outline-none focus:border-[#0D5699] transition-all text-xl"
                        />
                        <button className="btn px-16 py-6 bg-white text-black rounded-full font-black text-xl hover:bg-white/90 transition-all shadow-xl">
                            Subscribe
                        </button>
                    </div>
                </motion.div>
            </section>

            {/* ── FAQ ────────────────────────────────────────────────────────── */}
            <section className="snap-start">
                <FAQ items={activeFaqs} theme="dark" accentColor="#0D5699" />
            </section>

        </div>
    );
}

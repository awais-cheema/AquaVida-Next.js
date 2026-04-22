'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import CmsContent from '@/components/cms/CmsContent';

interface FAQItem {
    question: string;
    answer: string;
}

interface FAQProps {
    items: FAQItem[];
    accentColor?: string;
    theme?: 'light' | 'dark' | 'glass' | 'finance';
}

export default function FAQ({ items, accentColor = '#91792C', theme = 'dark' }: FAQProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const getThemeStyles = () => {
        switch (theme) {
            case 'finance':
                return {
                    bg: 'rgba(255, 255, 255, 0.02)',
                    border: 'rgba(255, 255, 255, 0.05)',
                    text: 'text-white/80',
                    questionText: 'text-white',
                };
            case 'glass':
                return {
                    bg: 'rgba(255, 255, 255, 0.05)',
                    border: 'rgba(255, 255, 255, 0.1)',
                    text: 'text-white/70',
                    questionText: 'text-white',
                };
            default: // dark
                return {
                    bg: 'rgba(255, 255, 255, 0.02)',
                    border: 'rgba(255, 255, 255, 0.05)',
                    text: 'text-white/60',
                    questionText: 'text-white/90',
                };
        }
    };

    const styles = getThemeStyles();

    return (
        <section className="py-32 px-6 md:px-16 lg:px-24 max-w-[1400px] mx-auto w-full">
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                viewport={{ once: true }}
                className="mb-20"
            >
                <span className="font-bold tracking-[0.4em] uppercase text-xl  mb-6 block" style={{ color: '#A68A33' }}>
                    Clarification
                </span>
                <h2 className="text-[clamp(40px,5vw,90px)] font-bold tracking-normal leading-[1] uppercase text-white">
                    Frequently asked<br />questions
                </h2>
            </motion.div>

            <div className="space-y-6">
                {items.map((item, index) => {
                    const isOpen = openIndex === index;
                    return (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="rounded-[32px] overflow-hidden transition-all duration-500"
                            style={{ 
                                background: styles.bg,
                                border: `1px solid ${styles.border}`,
                                boxShadow: isOpen ? `0 20px 60px rgba(0,0,0,0.3)` : 'none'
                            }}
                        >
                            <button
                                onClick={() => setOpenIndex(isOpen ? null : index)}
                                className="w-full p-5  md:px-10 md:py-4 flex items-center justify-between gap-8 text-left group"
                            >
                                <span className={`lg:text-[1.6vw] md:text-[2vw]  font-bold tracking-normal transition-colors duration-300 ${styles.questionText} ${isOpen ? '' : 'group-hover:text-white'}`}>
                                    {item.question}
                                </span>
                                <div 
                                    className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-500"
                                    style={{ 
                                        backgroundColor: isOpen ? accentColor : 'rgba(255,255,255,0.05)',
                                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                                    }}
                                >
                                    {isOpen ? <Minus size={24} className="text-white" /> : <Plus size={24} className="text-white/40 group-hover:text-white" />}
                                </div>
                            </button>

                            <AnimatePresence>
                                {isOpen && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                    >
                                        <div className="px-5 md:px-7 pb-7">
                                            <div className="w-full h-px bg-white/5 mb-8" />
                                            <CmsContent 
                                                content={item.answer} 
                                                className={`text-[1vw] md:text-[1.3vw] leading-relaxed font-light ${styles.text}`}
                                            />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    );
                })}
            </div>
        </section>
    );
}

"use client";

import { useState, useRef, useEffect } from 'react';
import { Info, ChevronRight, MapPin, Phone, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ContactPage() {
  const [isServiceOpen, setIsServiceOpen] = useState(false);
  const [selectedService, setSelectedService] = useState("");
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const services = [
    { id: "pool-design", label: "Pool design" },
    { id: "pool-construction", label: "Pool construction" },
    { id: "outdoor-kitchens", label: "Outdoor kitchens" },
    { id: "fire-pits", label: "Fir pits/ fire places" },
    { id: "pool-remodeling", label: "Pool remodeling" },
    { id: "pergola-design", label: "Pergola design" },
  ];

  useEffect(() => {
    setMounted(true);
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsServiceOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!mounted) return <div className="min-h-screen bg-[#0A0E16]" />;

  return (
    <main className="h-screen w-screen bg-[#0A0E16] text-black font-sans selection:bg-black selection:text-white flex flex-col overflow-hidden">
      {/* Header Space (10vh) */}
      <div className="h-[11vh] w-full flex-shrink-0" />

      {/* Main Content Area */}
      <div className="flex-grow flex items-center justify-center p-4 md:p-6 overflow-hidden">
        <div className="w-full max-w-7xl max-h-full bg-gradient-to-br from-white/100 via-white/80 to-white/20 backdrop-blur-3xl rounded-[30px] p-6 md:p-8 lg:p-10 shadow-[0_30px_60px_rgba(0,0,0,0.7)] border border-white/40 overflow-y-auto lg:overflow-hidden scrollbar-hide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 py-4 lg:py-8">
          
          {/* Left Column: Heading & Contact Info */}
          <div className="flex flex-col justify-start">
            <h1 className="text-[56px] md:text-[72px] lg:text-[88px] font-[family-name:var(--font-display)] font-black leading-[0.9] uppercase tracking-[0.02em] mb-8 lg:mb-12 max-w-md text-black">
              Let's Create Spaces That Inspire
            </h1>
            
            <div className="space-y-6">
              <h2 className="text-lg md:text-xl font-[family-name:var(--font-display)] font-bold uppercase tracking-wide border-b border-black/10 pb-2 w-fit text-black">
                Reach out to us
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3 group">
                  <div className="bg-black/5 p-2 rounded-lg group-hover:bg-black/10 transition-colors">
                    <MapPin className="w-5 h-5 text-black/70" />
                  </div>
                  <div>
                    <p className="text-s uppercase tracking-widest font-bold text-black/40 mb-0.5">Location</p>
                    <p className="text-base md:text-xl font-semibold leading-relaxed max-w-[280px] text-black">
                      2100 N Greenville Ave, Richardson, TX 75082, USA
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 group">
                  <div className="bg-black/5 p-2 rounded-lg group-hover:bg-black/10 transition-colors">
                    <Phone className="w-5 h-5 text-black/70" />
                  </div>
                  <div>
                    <p className="text-s uppercase tracking-widest font-bold text-black/40 mb-0.5">Phone</p>
                    <p className="text-base md:text-xl font-semibold text-black">
                      +1 469-587-6255
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="flex flex-col">
            <form className="space-y-3 md:space-y-4" onSubmit={(e) => e.preventDefault()}>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                {/* Full Name */}
                <div className="group">
                  <label htmlFor="fullName" className="block text-xl font-bold mb-2">Full Name*</label>
                  <input type="text" id="fullName" required placeholder="John Doe" className="w-full px-0 py-2 text-base bg-transparent border-0 border-b border-black placeholder:text-[#AwA4A4] placeholder:text-xl focus:outline-none focus:border-b focus:border-black transition-colors" />
                </div>

                {/* Phone Number */}
                <div className="group">
                  <label htmlFor="phone" className="block text-xl font-bold mb-2">Phone number*</label>
                  <input type="tel" id="phone" required placeholder="+1 234 567 890" className="w-full px-0 py-2 text-base bg-transparent border-0 border-b border-black placeholder:text-[#AwA4A4] placeholder:text-xl focus:outline-none focus:border-b focus:border-black transition-colors" />
                </div>

                {/* Email Address */}
                <div className="group">
                  <label htmlFor="email" className="block text-xl font-bold mb-2">Email address*</label>
                  <input type="email" id="email" required placeholder="email@example.com" className="w-full px-0 py-2 text-base bg-transparent border-0 border-b border-black placeholder:text-[#AwA4A4] placeholder:text-xl focus:outline-none focus:border-b focus:border-black transition-colors" />
                </div>

                {/* Street Address */}
                <div className="group">
                  <label htmlFor="address" className="block text-xl font-bold mb-2">Street Address*</label>
                  <input type="text" id="address" required placeholder="123 Main St" className="w-full px-0 py-2 text-base bg-transparent border-0 border-b border-black placeholder:text-[#AwA4A4] placeholder:text-xl focus:outline-none focus:border-b focus:border-black transition-colors" />
                </div>

                {/* Service Dropdown */}
                <div className="group relative" ref={dropdownRef}>
                  <label htmlFor="service" className="block text-xl font-bold mb-2">Service*</label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsServiceOpen(!isServiceOpen)}
                      className="w-full px-0 py-2 text-base bg-transparent border-b-2 border-black focus:outline-none focus:border-b-2 focus:border-black transition-colors flex items-center justify-between cursor-pointer"
                    >
                      <span className={`${selectedService ? "text-black" : "text-[#00000080]"} text-xl`}>
                        {selectedService ? services.find(s => s.id === selectedService)?.label : "e.g. Pool construction"}
                      </span>
                      <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isServiceOpen ? 'rotate-180' : ''} text-black/40`} />
                    </button>
                    
                    <input type="hidden" name="service" value={selectedService} required />

                    <AnimatePresence>
                      {isServiceOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute z-50 left-0 right-0 mt-2 bg-white/95 backdrop-blur-2xl border border-white/60 rounded-2xl shadow-2xl overflow-hidden p-2"
                        >
                          <div className="max-h-60 overflow-y-auto scrollbar-hide">
                            {services.map((service) => (
                              <button
                                key={service.id}
                                type="button"
                                onClick={() => {
                                  setSelectedService(service.id);
                                  setIsServiceOpen(false);
                                }}
                                className="w-full text-left px-4 py-3 text-lg font-medium hover:bg-black/5 rounded-xl transition-colors"
                              >
                                {service.label}
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Budget */}
                <div className="group">
                  <label htmlFor="budget" className="block text-xl font-bold mb-2">Budget</label>
                  <input type="text" id="budget" placeholder="e.g. $5000" className="w-full px-0 py-2 text-base bg-transparent border-0 border-b border-black placeholder:text-[#AwA4A4] placeholder:text-xl focus:outline-none focus:border-b focus:border-black transition-colors" />
                </div>

                {/* Free of Charge (FOC) Design consultation */}
                <div className="group md:col-span-2">
                  <label htmlFor="consultation" className="block text-xl font-bold mb-2">Free of Charge (FOC) Design consultation</label>
                  <input type="datetime-local" id="consultation" className="w-full px-0 py-2 text-base bg-transparent border-0 border-b border-black focus:outline-none focus:border-b focus:border-black transition-colors cursor-pointer" />
                </div>
              </div>

              {/* Comments */}
              <div className="group">
                <label htmlFor="comments" className="block text-xl font-bold mb-2">Comments</label>
                  <textarea id="comments" rows={1} placeholder="Your additional thoughts..." className="w-full px-0 py-2 text-base bg-transparent border-0 border-b border-black placeholder:text-[#00000065] placeholder:text-xl focus:outline-none focus:border-b focus:border-black transition-colors resize-none overflow-hidden scrollbar-hide" />
              </div>

              {/* Terms & Info */}
              <div className="flex items-start gap-3 pt-1">
                <Info className="w-4 h-4 mt-1 flex-shrink-0" />
                <p className="text-m leading-relaxed font-medium text-black/80">
                  By sending the form you agree to the Terms & Conditions and Privacy Policy.
                </p>
              </div>

              {/* Submit Button */}
              <div className="pt-1">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn flex items-center gap-4 bg-white/80 backdrop-blur-md px-8 py-4 rounded-full shadow-lg group hover:shadow-xl transition-all duration-300 border border-white/50"
                >
                  <span className="text-xl font-bold">Reach Out</span>
                  <div className="bg-[#1A1A1A] text-white p-2 rounded-full group-hover:translate-x-1 transition-transform duration-300">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </motion.button>
              </div>

            </form>
          </div>

          </div>
        </div>
      </div>
    </main>
  );
}
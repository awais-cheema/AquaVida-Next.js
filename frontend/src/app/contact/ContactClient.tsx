"use client";

import { useState, useRef, useEffect } from 'react';
import { Info, ChevronRight, MapPin, Phone, ChevronDown, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DEFAULT_HEADING = "Let's Create Spaces That Inspire"
const DEFAULT_ADDRESS = '2100 N Greenville Ave, Richardson, TX 75082, USA'
const DEFAULT_PHONE = '+1 469-587-6255'
const DEFAULT_SERVICES = [
  { id: "pool-design",        label: "Pool design" },
  { id: "pool-construction",  label: "Pool construction" },
  { id: "outdoor-grill",      label: "Outdoor kitchens" },
  { id: "fire-pits",          label: "Fire pits / fire places" },
  { id: "pool-remodeling",    label: "Pool remodeling" },
  { id: "pergola-design",     label: "Pergola design" },
]

interface ContactData {
  heading?: string
  address?: string
  phone?: string
  services?: ReadonlyArray<{ readonly id: string; readonly label: string }> | { id: string; label: string }[]
}

type Status = 'idle' | 'loading' | 'success' | 'error' | 'cooldown';

const COOLDOWN_KEY = 'aqv_contact_until'; // localStorage key

export default function ContactClient({ data }: { data?: ContactData | null }) {
  const heading  = data?.heading  || DEFAULT_HEADING
  const address  = data?.address  || DEFAULT_ADDRESS
  const phone    = data?.phone    || DEFAULT_PHONE
  const services = data?.services?.length ? data.services : DEFAULT_SERVICES

  const [isServiceOpen,    setIsServiceOpen]    = useState(false);
  const [selectedService,  setSelectedService]  = useState('');
  const [mounted,          setMounted]          = useState(false);
  const [status,           setStatus]           = useState<Status>('idle');
  const [countdown,        setCountdown]        = useState(0); // seconds remaining
  const dropdownRef  = useRef<HTMLDivElement>(null);
  const formRef      = useRef<HTMLFormElement>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startCooldown = (ms: number) => {
    const until = Date.now() + ms;
    localStorage.setItem(COOLDOWN_KEY, String(until));
    setStatus('cooldown');
    setCountdown(Math.ceil(ms / 1000));
    countdownRef.current = setInterval(() => {
      const left = Math.ceil((until - Date.now()) / 1000);
      if (left <= 0) {
        clearInterval(countdownRef.current!);
        countdownRef.current = null;
        localStorage.removeItem(COOLDOWN_KEY);
        setStatus('idle');
        setCountdown(0);
      } else {
        setCountdown(left);
      }
    }, 1000);
  };

  useEffect(() => {
    setMounted(true);
    // Restore cooldown from a previous session / page refresh
    const until = Number(localStorage.getItem(COOLDOWN_KEY) ?? 0);
    if (until > Date.now()) startCooldown(until - Date.now());

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsServiceOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === 'loading') return;

    const form = e.currentTarget;
    const data = new FormData(form);

    if (!selectedService) {
      setStatus('error');
      return;
    }

    setStatus('loading');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName:     data.get('fullName'),
          phone:        data.get('phone'),
          email:        data.get('email'),
          address:      data.get('address'),
          service:      services.find(s => s.id === selectedService)?.label ?? selectedService,
          budget:       data.get('budget'),
          consultation: data.get('consultation'),
          comments:     data.get('comments'),
        }),
      });

      if (res.ok) {
        setStatus('success');
        form.reset();
        setSelectedService('');
        startCooldown(5 * 60 * 1000); // lock for 5 min after success
      } else if (res.status === 429) {
        const data = await res.json().catch(() => ({}));
        startCooldown(data.retryAfterMs ?? 5 * 60 * 1000);
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  if (!mounted) return <div className="min-h-screen bg-[#05070A]" />;

  return (
    <main className="min-h-screen w-screen bg-[#05070A] text-black font-sans selection:bg-black selection:text-white flex flex-col">
      {/* Header Space */}
      <div className="h-[11vh] w-full flex-shrink-0" />

      {/* Main Content Area */}
      <div className="flex-grow flex items-center justify-center p-4 md:p-6 py-6">
        <div className="w-full max-w-7xl bg-gradient-to-br from-white/100 via-white/80 to-white/20 backdrop-blur-3xl rounded-[30px] p-5 md:p-8 lg:p-10 shadow-[0_30px_60px_rgba(0,0,0,0.7)] border border-white/40">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 py-2 lg:py-4">

            {/* Left Column: Heading & Contact Info */}
            <div className="flex flex-col justify-start mb-8 md:mb-0">
              <h1 className="text-[10vw] md:text-[6.5vw] font-allomira font-black leading-[0.9] uppercase tracking-[0.02em] mb-10 lg:mb-8 text-black">
                {heading}
              </h1>

              <div className="space-y-4">
                <h2 className="text-[4vw] md:text-[1.4vw] font-allomira font-bold uppercase tracking-wide border-b border-black/10 pb-2 w-fit text-black">
                  Reach out to us
                </h2>

                <div className="space-y-3">
                  <div className="flex items-start gap-3 group">
                    <div className="bg-black/5 p-2 rounded-lg group-hover:bg-black/10 transition-colors shrink-0">
                      <MapPin className="w-4 h-4 text-black/70" />
                    </div>
                    <div>
                      <p className="text-[3.5vw] md:text-[1vw] uppercase tracking-widest font-bold text-black/40 mb-0.5">Location</p>
                      <p className="text-[4vw] md:text-[1.4vw] font-semibold leading-normal text-black">{address}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 group">
                    <div className="bg-black/5 p-2 rounded-lg group-hover:bg-black/10 transition-colors shrink-0">
                      <Phone className="w-4 h-4 text-black/70" />
                    </div>
                    <div>
                      <p className="text-[3.5vw] md:text-[1vw] uppercase tracking-widest font-bold text-black/40 mb-0.5">Phone</p>
                      <p className="text-[4vw] md:text-[1.4vw] font-semibold text-black">{phone}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Contact Form */}
            <div className="flex flex-col">
              <form ref={formRef} className="space-y-3" onSubmit={handleSubmit}>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div className="group">
                    <label htmlFor="fullName" className="block text-[5vw] md:text-[1.4vw] font-bold mb-1">Full Name*</label>
                    <input name="fullName" type="text" id="fullName" required placeholder="John Doe"
                      className="w-full px-0 py-1.5 text-[4vw] md:text-[1.2vw] bg-transparent border-0 border-b border-black placeholder:text-black/30 focus:outline-none transition-colors" />
                  </div>

                  {/* Phone Number */}
                  <div className="group">
                    <label htmlFor="phone" className="block text-[5vw] md:text-[1.4vw] font-bold mb-1">Phone number*</label>
                    <input name="phone" type="tel" id="phone" required placeholder="+1 234 567 890"
                      className="w-full px-0 py-1.5 text-[4vw] md:text-[1.2vw] bg-transparent border-0 border-b border-black placeholder:text-black/30 focus:outline-none transition-colors" />
                  </div>

                  {/* Email Address */}
                  <div className="group">
                    <label htmlFor="email" className="block text-[5vw] md:text-[1.4vw] font-bold mb-1">Email address*</label>
                    <input name="email" type="email" id="email" required placeholder="email@example.com"
                      className="w-full px-0 py-1.5 text-[4vw] md:text-[1.2vw] bg-transparent border-0 border-b border-black placeholder:text-black/30 focus:outline-none transition-colors" />
                  </div>

                  {/* Street Address */}
                  <div className="group">
                    <label htmlFor="address" className="block text-[5vw] md:text-[1.4vw] font-bold mb-1">Street Address*</label>
                    <input name="address" type="text" id="address" required placeholder="123 Main St"
                      className="w-full px-0 py-1.5 text-[4vw] md:text-[1.2vw] bg-transparent border-0 border-b border-black placeholder:text-black/30 focus:outline-none transition-colors" />
                  </div>

                  {/* Service Dropdown */}
                  <div className="group relative" ref={dropdownRef}>
                    <label className="block text-[5vw] md:text-[1.4vw] font-bold mb-1">Service*</label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setIsServiceOpen(!isServiceOpen)}
                        className="w-full px-0 py-1.5 text-[3.5vw] md:text-[1.4vw] bg-transparent border-b border-black focus:outline-none transition-colors flex items-center justify-between cursor-pointer"
                      >
                        <span className={`text-[4vw] md:text-[1.2vw] ${selectedService ? 'text-black' : 'text-black/30'}`}>
                          {selectedService ? services.find(s => s.id === selectedService)?.label : 'e.g. Pool construction'}
                        </span>
                        <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isServiceOpen ? 'rotate-180' : ''} text-black/40`} />
                      </button>

                      <AnimatePresence>
                        {isServiceOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute z-50 left-0 right-0 mt-2 bg-white/95 backdrop-blur-2xl border border-white/60 rounded-2xl shadow-2xl overflow-hidden p-2"
                          >
                            <div className="max-h-48 overflow-y-auto scrollbar-hide">
                              {services.map((service) => (
                                <button
                                  key={service.id}
                                  type="button"
                                  onClick={() => { setSelectedService(service.id); setIsServiceOpen(false); }}
                                  className="w-full text-left px-4 py-2 text-[5vw] md:text-[1.4vw] font-medium hover:bg-black/5 rounded-xl transition-colors"
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
                    <label htmlFor="budget" className="block text-[5vw] md:text-[1.4vw] font-bold mb-1">Budget</label>
                    <input name="budget" type="text" id="budget" placeholder="e.g. $5000"
                      className="w-full px-0 py-1.5 text-[4vw] md:text-[1.2vw] bg-transparent border-0 border-b border-black placeholder:text-black/30 focus:outline-none transition-colors" />
                  </div>

                  {/* FOC Design Consultation */}
                  <div className="group md:col-span-2">
                    <label htmlFor="consultation" className="block text-[5vw] md:text-[1.4vw] font-bold mb-1">Free of Charge (FOC) Design consultation</label>
                    <input name="consultation" type="datetime-local" id="consultation"
                      className="w-full px-0 py-1.5 text-[4vw] md:text-[1.2vw] bg-transparent border-0 border-b border-black focus:outline-none transition-colors cursor-pointer" />
                  </div>
                </div>

                {/* Comments */}
                <div className="group">
                  <label htmlFor="comments" className="block text-[5vw] md:text-[1.4vw] font-bold mb-1">Comments</label>
                  <textarea name="comments" id="comments" rows={1} placeholder="Your additional thoughts..."
                    className="w-full px-0 py-1.5 text-[4vw] md:text-[1.2vw] bg-transparent border-0 border-b border-black placeholder:text-black/30 focus:outline-none resize-none overflow-hidden scrollbar-hide" />
                </div>

                {/* Terms & Info */}
                <div className="flex items-start gap-2 pt-1">
                  <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                  <p className="text-[2.5vw] md:text-[1vw] leading-relaxed font-medium text-black/70">
                    By sending the form you agree to the Terms & Conditions and Privacy Policy.
                  </p>
                </div>

                {/* Status messages */}
                <AnimatePresence mode="wait">
                  {status === 'success' && (
                    <motion.div key="success"
                      initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="flex items-center gap-2 text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3"
                    >
                      <CheckCircle className="w-4 h-4 shrink-0" />
                      <span className="text-[3.5vw] md:text-[1vw] font-semibold">Message sent! We&apos;ll be in touch soon.</span>
                    </motion.div>
                  )}
                  {status === 'error' && (
                    <motion.div key="error"
                      initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="flex items-center gap-2 text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-3"
                    >
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span className="text-[3.5vw] md:text-[1vw] font-semibold">
                        {!selectedService ? 'Please select a service.' : 'Something went wrong. Please try again.'}
                      </span>
                    </motion.div>
                  )}
                  {status === 'cooldown' && (
                    <motion.div key="cooldown"
                      initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="flex items-center gap-2 text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3"
                    >
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span className="text-[3.5vw] md:text-[1vw] font-semibold">
                        You can submit again in {Math.floor(countdown / 60)}:{String(countdown % 60).padStart(2, '0')}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit Button */}
                <div className="pt-1">
                  <motion.button
                    type="submit"
                    disabled={status === 'loading' || status === 'cooldown'}
                    whileHover={status === 'idle' || status === 'error' ? { scale: 1.02 } : {}}
                    whileTap={status === 'idle' || status === 'error' ? { scale: 0.98 } : {}}
                    className="btn flex items-center gap-3 bg-white/80 backdrop-blur-md px-6 py-3 rounded-full shadow-lg group hover:shadow-xl transition-all duration-300 border border-white/50 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {status === 'loading' ? (
                      <>
                        <span className="text-[3.5vw] md:text-[1.2vw] font-bold">Sending…</span>
                        <Loader2 className="w-4 h-4 animate-spin" />
                      </>
                    ) : (
                      <>
                        <span className="text-[3.5vw] md:text-[1.2vw] font-bold">Reach Out</span>
                        <div className="bg-[#1A1A1A] text-white p-1.5 rounded-full group-hover:translate-x-1 transition-transform duration-300">
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </>
                    )}
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

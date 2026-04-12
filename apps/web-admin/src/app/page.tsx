"use client";

import { useState } from 'react';
import { Sparkles, ScanLine, Smartphone, ArrowRight, ShieldCheck, Zap, LogOut, X, Box, BadgeCheck } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';

export default function LandingPage() {
  const [isHovering, setIsHovering] = useState(false);
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Gradients & Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-600/20 blur-[120px] rounded-full point-events-none -z-10" />
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-purple-600/10 blur-[120px] rounded-full point-events-none -z-10" />

      {/* Navigation */}
      <nav className="container mx-auto px-6 py-6 flex justify-between items-center relative z-10 w-full">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 overflow-hidden rounded-lg">
            <Image 
              src="/logo.png" 
              alt="Make Use Logo" 
              fill 
              className="object-contain"
              priority
            />
          </div>
          <span className="font-bold text-xl tracking-tight text-white">Make Use</span>
        </div>
        <div className="flex items-center gap-6">
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-400 hidden md:inline-block">
                Welcome, <span className="text-slate-200 font-medium">{user.name}</span>
              </span>
              <Link href={user.role === "ADMIN" ? "/admin" : "/profile"} className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-full text-sm font-medium transition-all shadow-lg hover:shadow-blue-500/25">
                {user.role === "ADMIN" ? "Dashboard" : "Account"}
              </Link>
              <Link href="/profile" className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white hover:scale-110 transition-all active:scale-95 shadow-lg shadow-blue-500/25 border border-white/10 ml-2">
                {user.name?.[0]}
              </Link>
              <button onClick={logout} className="text-slate-400 hover:text-red-400 transition-colors bg-white/5 hover:bg-white/10 p-2 rounded-full border border-white/10 backdrop-blur-sm" title="Sign Out">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link href="/auth" className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-full text-sm font-medium transition-all shadow-lg hover:shadow-blue-500/25">
              Sign In
            </Link>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <main className="container mx-auto px-6 pt-24 pb-32 text-center relative z-10 flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Sparkles className="w-3.5 h-3.5 text-green-500" />
          Don't trash it, cash it
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight max-w-4xl text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
          Turn your old devices into <br className="hidden md:block" /> instant cash
        </h1>

        <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
          Turn your old electronics into instant cash. Get an AI-driven valuation in seconds and we'll pick it up within 24 hours.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
          <Link
            href="/offer"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            className="group relative px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-semibold text-lg transition-all shadow-[0_0_40px_-10px_rgba(37,99,235,0.5)] hover:shadow-[0_0_60px_-15px_rgba(37,99,235,0.7)] flex items-center justify-center gap-2"
          >
            <span>Get your offer</span>
            <ArrowRight className={`w-5 h-5 transition-transform duration-300 ${isHovering ? 'translate-x-1' : ''}`} />
          </Link>

          <button
            onClick={() => setShowHowItWorks(true)}
            className="px-8 py-4 bg-white/5 border border-white/10 hover:bg-white/10 rounded-full font-semibold text-lg text-slate-200 transition-colors flex items-center justify-center gap-2 backdrop-blur-sm"
          >
            <span>How it works</span>
          </button>
        </div>

        {/* Floating Device UI Mockup */}
        <div className="mt-24 relative w-full max-w-5xl mx-auto perspective-[2000px]">
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent z-10" />
          <div className="relative rounded-2xl md:rounded-[2.5rem] bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden aspect-video transform-gpu rotate-x-[5deg] scale-100 hover:scale-[1.02] hover:rotate-x-[2deg] transition-all duration-700 ease-out flex items-center justify-center">

            <div className="absolute inset-0 bg-grid-slate-800/[0.2] bg-[size:20px_20px]" />
            <div className="relative z-10 text-center">
              <ScanLine className="w-16 h-16 text-blue-500 mx-auto mb-6 animate-pulse" />
              <div className="h-2 w-64 bg-slate-800 rounded-full overflow-hidden mx-auto mb-4">
                <div className="h-full bg-blue-500 w-1/2 animate-[progress_2s_ease-in-out_infinite]" />
              </div>
              <p className="text-slate-400 font-medium">Scanning device condition...</p>
            </div>
          </div>
        </div>
      </main>

      {/* Features Grid */}
      <section className="container mx-auto px-6 py-24 border-t border-slate-800/50">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            {
              icon: Zap,
              title: "Instant AI Pricing",
              description: "Our advanced agents analyze real-time market trends to offer you the most competitive payout instantly."
            },
            {
              icon: Smartphone,
              title: "Visual Diagnostics",
              description: "Use your camera to let our Vision model assess the pristine condition of your device securely."
            },
            {
              icon: ShieldCheck,
              title: "White-glove Service",
              description: "For complex devices, our certified engineers visit you within 24 hours to hand over the cash."
            }
          ].map((feature, i) => (
            <div key={i} className="flex flex-col items-center md:items-start text-center md:text-left group cursor-pointer">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-6 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300 shadow-lg">
                <feature.icon className="w-7 h-7 text-blue-400 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-100 group-hover:text-white transition-colors">{feature.title}</h3>
              <p className="text-slate-400 leading-relaxed text-base">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-slate-800/50 py-8 text-center text-slate-500 text-sm">
        <p>© 2026 Make Use Marketplace. Don't trash it, cash it.</p>
      </footer>

      {/* How it Works Modal */}
      {showHowItWorks && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setShowHowItWorks(false)} />

          <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-8 overflow-hidden animate-in zoom-in-95 duration-300">
            {/* Modal Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full point-events-none" />

            <button
              onClick={() => setShowHowItWorks(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-800 rounded-full transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-3xl font-bold mb-2 text-white flex items-center gap-3">
              <Box className="w-8 h-8 text-blue-500" />
              The Marketplace Journey
            </h2>
            <p className="text-slate-400 mb-8 border-b border-slate-800/60 pb-6">
              Make Use eliminates the friction of selling your electronics. No haggling, no scams, just data-driven payouts.
            </p>

            <div className="space-y-8 relative before:absolute before:inset-y-0 before:left-[19px] before:w-0.5 before:bg-slate-800 ml-2">
              {[
                {
                  icon: ScanLine,
                  title: "1. The AI Assessment",
                  desc: "Start by entering your device metadata. Our conversational AI agent will seamlessly guide you and request a visual diagnostic scan via your device camera to detect dents or scratches."
                },
                {
                  icon: Zap,
                  title: "2. Instant Valuation",
                  desc: "Our Claude 3.5 Sonnet agent processes your inputs against live market data, depreciating standard wear and generating an instant, highly-competitive cash offer."
                },
                {
                  icon: ShieldCheck,
                  title: "3. Condition Logic & SLAs",
                  desc: "If your device is in 'Mint' condition, we arrange a standard mail-in. If the condition is 'Poor' or 'Complex', the AI automatically dispatches a certified engineer to your location within 24 hours to securely verify the device and handover the cash."
                },
                {
                  icon: BadgeCheck,
                  title: "4. The Admin Command Center",
                  desc: "Behind the scenes, our enterprise ticketing system tracks every SLA deadline ensuring you get paid and supported exactly on time."
                }
              ].map((step, idx) => (
                <div key={idx} className="relative pl-12 flex flex-col items-start group">
                  <div className="absolute left-[3px] top-1 w-8 h-8 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center group-hover:bg-blue-600 group-hover:border-blue-500 transition-colors shadow-lg shadow-black/50">
                    <step.icon className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-200 group-hover:text-blue-400 transition-colors mb-2">{step.title}</h3>
                  <p className="text-slate-400 leading-relaxed text-sm">{step.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 pt-6 border-t border-slate-800/60 flex justify-end">
              <Link
                href="/offer"
                onClick={() => setShowHowItWorks(false)}
                className="bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-full text-sm font-semibold text-white transition-all hover:scale-105 shadow-[0_0_20px_-5px_rgba(37,99,235,0.5)] flex items-center gap-2"
              >
                Start selling <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

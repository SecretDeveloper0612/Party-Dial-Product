'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Users, Target, Rocket, Award, ShieldCheck,
  Zap, ArrowRight, Heart, Globe, Users2
} from 'lucide-react';

export default function AboutPage() {
  return (
    <div suppressHydrationWarning className="bg-white min-h-screen">

      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-slate-900 border-b border-white/5">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-pd-pink text-[10px] font-black uppercase tracking-[0.4em] mb-8"
          >
            <Users size={12} className="fill-pd-pink/10" /> Our Identity v2.0
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-7xl font-black text-white italic uppercase leading-none mb-8"
          >
            Building the future <br />
            <span className="pd-gradient-text not-italic">of Venue Growth.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto text-slate-400 text-lg font-medium leading-relaxed"
          >
            PartyDial is India's first tech-first venue growth platform. We don't just list venues—we build the infrastructure for your success.
          </motion.p>
        </div>

        {/* Abstract background shapes */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-pd-blue/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-pd-pink/20 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2 opacity-20"></div>
      </section>

      {/* CORE VALUES */}
      <section className="py-24 md:py-32 px-6">
        <div className="max-w-[1440px] mx-auto lg:px-12">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-black text-[#0F172A] uppercase italic mb-4">
              Our <span className="pd-gradient-text not-italic">DNA.</span>
            </h2>
            <p className="text-slate-500 font-medium">The principles that drive every lead we deliver.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                title: "Transparency First",
                icon: <ShieldCheck size={32} className="text-pd-pink" />,
                desc: "We believe in total visibility. From ad spends to lead verification, you know exactly what you're paying for."
              },
              {
                title: "Tech-Driven",
                icon: <Zap size={32} className="text-pd-blue" />,
                desc: "Our platform uses AI-powered routing and direct line integration to ensure you connect with customers instantly."
              },
              {
                title: "Partner Obsessed",
                icon: <Heart size={32} className="text-pd-pink" />,
                desc: "Your growth is our only metric. We don't rotation leads—we build exclusive relationships for long-term scale."
              }
            ].map((value, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-10 rounded-[32px] bg-slate-50 border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
              >
                <div className="mb-6">{value.icon}</div>
                <h3 className="text-xl font-black text-[#0F172A] uppercase italic mb-4">{value.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* THE MISSION */}
      <section className="py-24 md:py-32 bg-slate-900 relative overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 lg:grid lg:grid-cols-2 gap-20 items-center relative z-10">
          <div>
            <span className="text-pd-pink text-[10px] font-black uppercase tracking-[0.4em] mb-8 block">Project North Star</span>
            <h2 className="text-4xl md:text-6xl font-black text-white italic uppercase leading-tight mb-8">
              Empowering <span className="pd-gradient-text not-italic">5,000+ Venues</span> <br />
              by 2027.
            </h2>
            <p className="text-lg text-slate-400 font-medium leading-relaxed mb-10">
              We are on a mission to democratize venue marketing. By providing high-end tech tools previously reserved for global hotel chains to local event spaces, we're leveling the playing field.
            </p>

            <div className="grid grid-cols-2 gap-8">
              <div>
                <div className="text-3xl font-black text-white italic mb-1">500+</div>
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Partners</div>
              </div>
              <div>
                <div className="text-3xl font-black text-white italic mb-1">150k+</div>
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Monthly Queries</div>
              </div>
            </div>
          </div>

          <div className="mt-16 lg:mt-0 relative group">
            <div className="aspect-square bg-white/[0.02] rounded-[60px] border border-white/10 flex items-center justify-center p-12 overflow-hidden shadow-4xl backdrop-blur-3xl">
              <Globe className="text-pd-pink/20 absolute -right-20 -bottom-20 w-[400px] h-[400px] animate-pulse" />
              <div className="relative z-10 text-center">
                <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center mb-8 mx-auto shadow-2xl">
                  <Target size={40} className="text-slate-900" />
                </div>
                <h4 className="text-white text-2xl font-black italic uppercase mb-2">Total Dominance.</h4>
                <p className="text-slate-500 font-bold uppercase tracking-widest text-[11px]">Active in 12 Major Cities</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PREET TECH ADVANTAGE */}
      <section className="py-24 md:py-32 bg-slate-50 border-y border-slate-100 px-6">
        <div className="max-w-[1440px] mx-auto lg:px-12 lg:grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <span className="text-pd-red text-[10px] font-black uppercase tracking-[0.4em] mb-8 block">Corporate Foundation</span>
            <h2 className="text-3xl md:text-5xl font-black text-[#0F172A] uppercase italic mb-8">
              A <span className="pd-gradient-text not-italic">Preet Tech OPC Private Limited</span> Venture.
            </h2>
            <p className="text-lg text-slate-600 font-medium leading-relaxed mb-10 text-justify">
              PartyDial is a flagship ecosystem developed and operated by <strong>Preet Tech OPC Private Limited </strong>.
              Our corporate foundation provides the technological stability and legal compliance required to manage high-volume transactions and enterprise-level venue partnerships across India.
            </p>

            <div className="space-y-6">
              {[
                { t: "Unified Billing", d: "All payments and financial operations are securely managed under the Preet Tech OPC Private Limited corporate umbrella, ensuring 100% tax compliance and transparent invoicing." },
                { t: "Proprietary Tech", d: "Our platform is built on Preet Tech OPC Private Limited's proprietary CRM and routing architecture, optimized specifically for the Indian event industry." },
                { t: "Administrative HQ", d: "Strategically headquartered in Dehradun, Uttarakhand, our administrative team ensures seamless support for partners nationwide." }
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="shrink-0 w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center">
                    <Award size={14} />
                  </div>
                  <div>
                    <h4 className="text-sm font-black uppercase italic text-slate-900 mb-1">{item.t}</h4>
                    <p className="text-sm text-slate-500 font-medium">{item.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-16 lg:mt-0 relative">
            <div className="aspect-[4/3] bg-slate-900 rounded-[40px] shadow-2xl p-12 flex flex-col justify-center overflow-hidden group">
              {/* Visual Representation of Corporate Strength */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-pd-pink/10 transition-colors"></div>
              <div className="relative z-10">
                <div className="text-white/20 text-6xl font-black uppercase italic mb-4 group-hover:text-pd-pink/20 transition-colors tracking-tighter">PREET TECH</div>
                <h4 className="text-white text-3xl font-black italic uppercase leading-none mb-6">India's Lead <br />Gen Standard.</h4>
                <div className="flex items-center gap-4 text-slate-500">
                  <div className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10">ISO COMPLIANT</div>
                  <div className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10">EST 2026</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TEAM / CULTURE */}
      <section className="py-24 md:py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <Users2 size={48} className="text-pd-pink mx-auto mb-8" />
          <h2 className="text-3xl md:text-5xl font-black text-[#0F172A] uppercase italic mb-8">
            A Team of <br />
            <span className="pd-gradient-text not-italic">Market Disruptors.</span>
          </h2>
          <p className="text-lg text-slate-500 font-medium leading-relaxed mb-12">
            Headquartered in the heart of Uttrakhand and reaching across India, our team comprises world-class designers, aggressive marketers, and expert engineers dedicated to your growth.
          </p>
        </div>
      </section>

    </div>
  );
}

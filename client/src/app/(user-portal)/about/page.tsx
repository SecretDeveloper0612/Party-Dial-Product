import React from 'react';
import { Building2, Users, ShieldCheck, HeartHandshake, ArrowRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function AboutUsPage() {
  return (
    <main className="min-h-screen bg-white">
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 px-6 overflow-hidden bg-slate-50">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="relative max-w-7xl mx-auto text-center z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pd-pink/10 text-pd-pink text-sm font-bold tracking-wide uppercase mb-6">
            Our Mission
          </div>
          <h1 className="text-5xl md:text-7xl font-semibold text-slate-900 mb-6 tracking-tight leading-tight">
            We're building the future of <br className="hidden md:block" />
            <span className="pd-gradient-text">Event Celebrations</span>
          </h1>
          <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            PartyDial is on a mission to simplify how people discover, compare, and book the perfect venues for their most cherished moments.
          </p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 md:py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
            <div className="relative">
              <div className="absolute -inset-4 bg-linear-to-tr from-pd-pink/20 to-pd-blue/20 rounded-3xl blur-2xl opacity-50"></div>
              <img 
                src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1469&auto=format&fit=crop" 
                alt="Celebration" 
                className="relative rounded-3xl shadow-2xl object-cover aspect-[4/5] w-full"
              />
              <div className="absolute -bottom-8 -right-8 bg-white p-6 rounded-3xl shadow-xl border border-slate-100 hidden md:block">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                    <CheckCircle2 size={28} />
                  </div>
                  <div>
                    <p className="text-2xl font-black text-slate-900">100%</p>
                    <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Verified Venues</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-8">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">Our Story</h2>
              <div className="space-y-6 text-lg text-slate-600 leading-relaxed">
                <p>
                  Planning an event is supposed to be a joyous occasion, but finding the right venue often turns into a stressful chore of endless phone calls, tiresome site visits, and confusing price quotes. 
                </p>
                <p>
                  PartyDial was born out of a simple idea: bringing absolute transparency and convenience to the venue booking industry. We saw hosts struggling to find reliable spaces, and venue owners struggling to connect with the right clients. 
                </p>
                <p>
                  Today, we are bridging that gap. By combining cutting-edge technology with a human-centric approach, we aim to connect hosts with incredible spaces seamlessly, making the planning process as delightful as the event itself.
                </p>
              </div>
              <div className="pt-4">
                <Link href="/venues" className="inline-flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-colors">
                  Explore Venues <ArrowRight size={20} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values / Features */}
      <section className="py-24 px-6 bg-white text-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Why Choose PartyDial?</h2>
            <p className="text-slate-500 text-lg">We provide a premium, end-to-end experience that guarantees peace of mind for your grand celebrations.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1 transition-all">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6">
                <ShieldCheck size={28} />
              </div>
              <h3 className="text-xl font-bold mb-4">Verified Venues</h3>
              <p className="text-slate-600 leading-relaxed text-sm">Every venue on our platform is personally verified by our expert team to ensure the highest quality standards.</p>
            </div>
            
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1 transition-all">
              <div className="w-14 h-14 rounded-2xl bg-pd-pink/10 text-pd-pink flex items-center justify-center mb-6">
                <Building2 size={28} />
              </div>
              <h3 className="text-xl font-bold mb-4">Extensive Options</h3>
              <p className="text-slate-600 leading-relaxed text-sm">From grand banquet halls for weddings to cozy cafes for intimate birthdays, we cover every category you need.</p>
            </div>
            
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1 transition-all">
              <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-6">
                <HeartHandshake size={28} />
              </div>
              <h3 className="text-xl font-bold mb-4">Direct Connections</h3>
              <p className="text-slate-600 leading-relaxed text-sm">We eliminate the middleman. Connect directly with venue managers to negotiate the best possible packages.</p>
            </div>
            
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1 transition-all">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-6">
                <Users size={28} />
              </div>
              <h3 className="text-xl font-bold mb-4">Dedicated Support</h3>
              <p className="text-slate-600 leading-relaxed text-sm">Our event planning experts are always on standby to assist you if you need help finding the perfect match.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Corporate Foundation */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="bg-slate-900 rounded-[2.5rem] p-10 md:p-16 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-pd-blue/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-pd-pink/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
          
          <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white/90 text-xs font-bold tracking-widest uppercase mb-6 border border-white/20">
                A Preet Tech OPC Private Limited Venture
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">Corporate Foundation</h2>
              <p className="text-slate-300 text-lg leading-relaxed">
                PartyDial is a flagship ecosystem developed and operated by <strong className="text-white">Preet Tech OPC Private Limited</strong>. Our corporate foundation provides the technological stability and legal compliance required to manage high-volume transactions and enterprise-level venue partnerships across India.
              </p>
            </div>
            
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 border border-white/5">
                  <span className="text-pd-pink font-black text-xl">1</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Unified Billing</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">All payments and financial operations are securely managed under the Preet Tech OPC Private Limited corporate umbrella, ensuring 100% tax compliance and transparent invoicing.</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 border border-white/5">
                  <span className="text-pd-blue font-black text-xl">2</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Proprietary Tech</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">Our platform is built on Preet Tech OPC Private Limited's proprietary CRM and routing architecture, optimized specifically for the Indian event industry.</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 border border-white/5">
                  <span className="text-pd-purple font-black text-xl">3</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Administrative HQ</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">Strategically headquartered in Dehradun, Uttarakhand, our administrative team ensures seamless support for partners nationwide.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision */}
      <section className="py-24 px-6 md:py-32 bg-slate-50 text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-pd-pink/5 rounded-full blur-3xl"></div>
        <div className="relative max-w-4xl mx-auto z-10">
          <h2 className="text-4xl md:text-6xl font-bold text-slate-900 mb-8 tracking-tight">Our Vision</h2>
          <p className="text-slate-600 text-xl md:text-2xl leading-relaxed">
            To be the most trusted and user-friendly platform in India for discovering and booking event venues, ensuring every celebration starts with the perfect setting.
          </p>
          <div className="mt-12">
            <Link href="/" className="inline-flex items-center gap-2 text-pd-pink font-bold hover:gap-3 transition-all">
              Return to Homepage <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}

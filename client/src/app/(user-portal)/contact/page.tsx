"use client";

import React from 'react';
import { Mail, MapPin, Phone, Send, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white">
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 px-6 overflow-hidden bg-slate-50">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="relative max-w-7xl mx-auto text-center z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pd-blue/10 text-pd-blue text-sm font-bold tracking-wide uppercase mb-6">
            Get in touch
          </div>
          <h1 className="text-5xl md:text-7xl font-semibold text-slate-900 mb-6 tracking-tight leading-tight">
            We'd love to hear <br className="hidden md:block" />
            <span className="pd-gradient-text">from you</span>
          </h1>
          <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Whether you have a question about our platform, need help finding a venue, or want to partner with us—our team is here to assist you.
          </p>
        </div>
      </section>

      <section className="py-20 md:py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            
            {/* Contact Details */}
            <div className="space-y-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 tracking-tight">Contact Information</h2>
                <p className="text-slate-600 text-lg leading-relaxed">
                  Fill out the form and our team will get back to you within 24 hours. If you need immediate assistance, please don't hesitate to call us.
                </p>
              </div>

              <div className="space-y-8">
                <div className="flex gap-6 items-start">
                  <div className="w-14 h-14 rounded-2xl bg-pd-pink/10 text-pd-pink flex items-center justify-center shrink-0">
                    <MapPin size={28} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Our Headquarters</h3>
                    <p className="text-slate-600 leading-relaxed">
                      Near Krishna Hospital, Subhash Nagar,<br />
                      Bhotia Parao, Haldwani,<br />
                      Uttarakhand 263139
                    </p>
                  </div>
                </div>

                <div className="flex gap-6 items-start">
                  <div className="w-14 h-14 rounded-2xl bg-pd-blue/10 text-pd-blue flex items-center justify-center shrink-0">
                    <Phone size={28} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Phone Support</h3>
                    <p className="text-slate-600 leading-relaxed mb-1">+91 8679933302</p>
                    <p className="text-slate-500 text-sm">Mon-Fri from 9am to 6pm IST</p>
                  </div>
                </div>

                <div className="flex gap-6 items-start">
                  <div className="w-14 h-14 rounded-2xl bg-pd-purple/10 text-pd-purple flex items-center justify-center shrink-0">
                    <Mail size={28} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Email Us</h3>
                    <p className="text-slate-600 leading-relaxed mb-1">support@partydial.com</p>
                    <p className="text-slate-500 text-sm">We'll respond within 24 hours</p>
                  </div>
                </div>
              </div>

              <div className="pt-8">
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <h4 className="font-bold text-slate-900 mb-2">Venue Owner?</h4>
                  <p className="text-slate-600 text-sm mb-4">Want to list your venue on PartyDial and reach thousands of potential customers?</p>
                  <Link href="https://partner.partydial.com/login" className="inline-flex items-center gap-2 text-pd-pink font-semibold hover:gap-3 transition-all text-sm">
                    Register Your Venue <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-slate-200/50 border border-slate-100 relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-pd-pink/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              
              <div className="relative z-10">
                <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8">Send a Message</h3>
                
                <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert("Thanks for reaching out! We'll get back to you soon."); }}>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700">First Name</label>
                      <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 focus:outline-none focus:border-pd-pink focus:ring-1 focus:ring-pd-pink transition-all" placeholder="John" required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700">Last Name</label>
                      <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 focus:outline-none focus:border-pd-pink focus:ring-1 focus:ring-pd-pink transition-all" placeholder="Doe" required />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Email Address</label>
                    <input type="email" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 focus:outline-none focus:border-pd-pink focus:ring-1 focus:ring-pd-pink transition-all" placeholder="john@example.com" required />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Phone Number (Optional)</label>
                    <input type="tel" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 focus:outline-none focus:border-pd-pink focus:ring-1 focus:ring-pd-pink transition-all" placeholder="+91 98765 43210" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Message</label>
                    <textarea rows={5} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 focus:outline-none focus:border-pd-pink focus:ring-1 focus:ring-pd-pink transition-all resize-none" placeholder="How can we help you?" required></textarea>
                  </div>
                  
                  <button type="submit" className="w-full bg-slate-900 text-white font-bold rounded-xl px-6 py-4 hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 mt-4 shadow-lg shadow-slate-900/20">
                    <Send size={18} /> Send Message
                  </button>
                </form>
              </div>
            </div>

          </div>
        </div>
      </section>

    </main>
  );
}

'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  ChevronRight,
  ArrowRight,
  Globe,
  Instagram,
  Facebook,
  Twitter,
  Building2,
  Users
} from 'lucide-react';

export default function ContactUs() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    subject: '',
    inquiryType: 'General Inquiry',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      // Reset form if needed or show success message
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const fadeUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6, ease: "easeOut" as const }
  };

  return (
    <main className="bg-white min-h-screen font-sans selection:bg-pd-red/10 selection:text-pd-red">
      {/* 1. HERO SECTION */}
      <section className="relative pt-24 pb-16 md:pt-40 md:pb-28 bg-gradient-to-b from-slate-50 to-white overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-pd-red/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-pd-purple/5 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block bg-pd-red/10 text-pd-red text-[10px] md:text-xs font-bold px-4 py-1.5 rounded-full mb-6 uppercase tracking-wider">Get In Touch</span>
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight">
              Contact <span className="text-pd-red italic opacity-90">Us</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
              We&apos;re here to help you find the perfect venue or assist you with any questions. Our team is ready to make your event a reality.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 2. MAIN CONTACT SECTION (TWO COLUMNS) */}
      <section className="py-16 md:py-24 px-6 bg-white relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
            
            {/* Left Column: Contact Form */}
            <motion.div 
              {...fadeUp}
              className="bg-white p-8 md:p-10 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100"
            >
              {isSubmitted ? (
                <div className="text-center py-20 px-4">
                  <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner ring-8 ring-emerald-50">
                    <CheckCircle2 size={40} />
                  </div>
                  <h2 className="text-3xl font-black text-slate-900 mb-4">Message Sent!</h2>
                  <p className="text-slate-500 font-medium mb-10 max-w-sm mx-auto">
                    Thank you for reaching out. We&apos;ve received your message and will get back to you within 24 hours.
                  </p>
                  <button 
                    onClick={() => setIsSubmitted(false)}
                    className="bg-slate-900 text-white px-8 py-3.5 rounded-xl font-bold text-sm transition-all hover:bg-black active:scale-95 shadow-lg shadow-slate-200"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <>
                  <div className="mb-10">
                    <h2 className="text-2xl font-black text-slate-900 mb-2">Send Us a Message</h2>
                    <p className="text-slate-500 text-sm font-medium">Fill out the form below and we&apos;ll get back to you shortly.</p>
                  </div>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="fullName" className="text-xs font-black uppercase tracking-widest text-slate-400">Full Name</label>
                        <input 
                          type="text" 
                          id="fullName" 
                          name="fullName" 
                          required 
                          value={formData.fullName}
                          onChange={handleChange}
                          placeholder="Ex: Rahul Sharma" 
                          className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pd-red/20 focus:border-pd-red/30 transition-all placeholder:text-slate-300"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-xs font-black uppercase tracking-widest text-slate-400">Email Address</label>
                        <input 
                          type="email" 
                          id="email" 
                          name="email" 
                          required 
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="rahul@example.com" 
                          className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pd-red/20 focus:border-pd-red/30 transition-all placeholder:text-slate-300"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="phone" className="text-xs font-black uppercase tracking-widest text-slate-400">Phone Number</label>
                        <input 
                          type="tel" 
                          id="phone" 
                          name="phone" 
                          required 
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+91 98765 43210" 
                          className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pd-red/20 focus:border-pd-red/30 transition-all placeholder:text-slate-300"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="inquiryType" className="text-xs font-black uppercase tracking-widest text-slate-400">Inquiry Type</label>
                        <select 
                          id="inquiryType" 
                          name="inquiryType" 
                          required 
                          value={formData.inquiryType}
                          onChange={handleChange}
                          className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pd-red/20 focus:border-pd-red/30 transition-all appearance-none cursor-pointer"
                        >
                          <option value="General Inquiry">General Inquiry</option>
                          <option value="Venue Support">Venue Support</option>
                          <option value="Venue Registration">Venue Registration</option>
                          <option value="Partnership Request">Partnership Request</option>
                          <option value="Technical Support">Technical Support</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="subject" className="text-xs font-black uppercase tracking-widest text-slate-400">Subject</label>
                      <input 
                        type="text" 
                        id="subject" 
                        name="subject" 
                        required 
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="How can we help you?" 
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pd-red/20 focus:border-pd-red/30 transition-all placeholder:text-slate-300"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="message" className="text-xs font-black uppercase tracking-widest text-slate-400">Message</label>
                      <textarea 
                        id="message" 
                        name="message" 
                        rows={5} 
                        required 
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Share the details of your inquiry..." 
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pd-red/20 focus:border-pd-red/30 transition-all placeholder:text-slate-300 resize-none"
                      ></textarea>
                    </div>
                    
                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center gap-2 bg-pd-red hover:bg-red-600 text-white px-8 py-4 rounded-xl font-black text-sm uppercase tracking-widest transition-all active:scale-95 disabled:opacity-70 shadow-lg shadow-pd-red/20 group"
                    >
                      {isSubmitting ? 'Sending...' : (
                        <>
                          Send Message
                          <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}
            </motion.div>
            
            {/* Right Column: Contact Info */}
            <div className="flex flex-col justify-center space-y-12">
              <motion.div {...fadeUp} transition={{ delay: 0.1 }}>
                <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight uppercase italic">Our <span className="text-pd-red">HQ</span></h2>
                <p className="text-slate-500 font-medium mb-10 max-w-md italic">
                  Have a specific question or want to visit us? Here is where we dial up the celebration magic.
                </p>
                
                <div className="space-y-8">
                  <div className="flex items-start gap-5">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-pd-red flex-shrink-0 border border-slate-100 shadow-sm">
                      <MapPin size={22} />
                    </div>
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Office Address</h4>
                      <p className="text-slate-800 font-bold leading-relaxed">123 Celebration Plaza, Bandra West,<br />Mumbai, MH 400050, India</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-5">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-emerald-500 flex-shrink-0 border border-slate-100 shadow-sm">
                      <Phone size={22} />
                    </div>
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Phone Number</h4>
                      <p className="text-slate-800 font-bold">+91 98765 43210</p>
                      <p className="text-slate-400 text-xs font-medium">Mon - Sun, 9am - 9pm</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-5">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-pd-purple flex-shrink-0 border border-slate-100 shadow-sm">
                      <Mail size={22} />
                    </div>
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Support Email</h4>
                      <p className="text-slate-800 font-bold">hello@partydial.com</p>
                      <p className="text-slate-400 text-xs font-medium">Quick responses guaranteed</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-5">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-blue-500 flex-shrink-0 border border-slate-100 shadow-sm">
                      <Clock size={22} />
                    </div>
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Business Hours</h4>
                      <p className="text-slate-800 font-bold">Monday - Friday: 9am - 6pm</p>
                      <p className="text-slate-800 font-bold">Saturday: 10am - 4pm</p>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                {...fadeUp} 
                transition={{ delay: 0.2 }}
                className="p-8 bg-slate-900 rounded-[2rem] text-white overflow-hidden relative"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-pd-red/20 blur-3xl pointer-events-none"></div>
                <h4 className="text-lg font-black italic uppercase tracking-tighter mb-6">Quick Contact</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <a href="tel:+919876543210" className="flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 px-5 py-4 rounded-xl transition-all group">
                    <Phone size={18} className="text-emerald-400" />
                    <span className="text-sm font-bold">Call Us</span>
                  </a>
                  <a href="mailto:hello@partydial.com" className="flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 px-5 py-4 rounded-xl transition-all group">
                    <Mail size={18} className="text-pd-red" />
                    <span className="text-sm font-bold">Email Support</span>
                  </a>
                  <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 bg-emerald-500 hover:bg-emerald-600 px-5 py-4 rounded-xl transition-all col-span-1 sm:col-span-2 shadow-lg shadow-emerald-500/20">
                    <MessageSquare size={18} />
                    <span className="text-sm font-black uppercase tracking-widest">Chat on WhatsApp</span>
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. GOOGLE MAP INTEGRATION */}
      <section className="py-2 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            {...fadeUp}
            className="w-full h-[400px] md:h-[500px] rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-100 relative group"
          >
            {/* Placeholder for Google Map - In real app, replace with actual iframe or Google Maps SDK */}
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d120662.33306935742!2d72.7668615!3d19.0759837!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c6306644edc1%3A0x5da4ed8f8d648c69!2sMumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1710780000000!5m2!1sen!2sin" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={true} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full border-0 transition-all duration-700"
            ></iframe>
          </motion.div>
        </div>
      </section>


      {/* 5. CALL TO ACTION SECTION */}
      <section className="pb-16 md:pb-24 px-6 md:px-10">
        <motion.div 
          {...fadeUp}
          className="max-w-7xl mx-auto bg-slate-900 rounded-[3rem] p-10 md:p-20 text-center relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-pd-red/20 via-transparent to-pd-purple/20 pointer-events-none"></div>
          <div className="relative z-10">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-pd-red mx-auto mb-8 border border-white/10 backdrop-blur-sm">
                <Building2 size={32} />
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight">Are You a <span className="text-pd-red">Venue Owner?</span></h2>
            <p className="text-white/60 font-medium mb-12 max-w-xl mx-auto text-sm md:text-lg italic">
              Join India&apos;s leading platform and start receiving high-quality leads directly. List your banquet hall, hotel, or resort today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="https://partner.partydial.com/signup" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto bg-pd-red hover:bg-red-600 text-white px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-pd-red/20 active:scale-95">
                  Register Your Venue
                </button>
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </main>
  );
}

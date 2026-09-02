import React from 'react';
import { ArrowLeft, FileText, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 px-6 overflow-hidden bg-slate-50">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="relative max-w-4xl mx-auto text-center z-10">
          <Link href="/" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pd-pink/10 text-pd-pink text-sm font-bold tracking-wide mb-8 hover:bg-pd-pink/20 transition-colors">
            <ArrowLeft size={16} /> Back to Home
          </Link>
          <h1 className="text-5xl md:text-7xl font-semibold text-slate-900 mb-6 tracking-tight leading-tight">
            Terms of <span className="pd-gradient-text">Service</span>
          </h1>
          <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Please read these terms and conditions carefully before using our platform. They outline your rights and responsibilities.
          </p>
          <div className="mt-8 flex items-center justify-center gap-2 text-slate-400 text-sm font-medium">
            <FileText size={16} /> Last updated: {new Date().toLocaleDateString()}
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20 md:py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-slate prose-lg md:prose-xl max-w-none">
            
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-pd-pink/10 text-pd-pink flex items-center justify-center text-lg shrink-0">1</span>
                Introduction
              </h2>
              <p className="text-slate-600 leading-relaxed text-lg">
                Welcome to PartyDial. By accessing or using our website and services, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access our services.
              </p>
            </div>

            <div className="mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-pd-blue/10 text-pd-blue flex items-center justify-center text-lg shrink-0">2</span>
                Use of Services
              </h2>
              <p className="text-slate-600 leading-relaxed text-lg">
                PartyDial connects users with verified event venues. We act as an intermediary to help you discover, compare, and connect with venues. The actual agreement for venue booking is between you and the respective venue owner.
              </p>
            </div>

            <div className="mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-pd-purple/10 text-pd-purple flex items-center justify-center text-lg shrink-0">3</span>
                User Accounts
              </h2>
              <p className="text-slate-600 leading-relaxed text-lg mb-6">
                When you create an account with us, you must provide accurate, complete, and current information. Failure to do so constitutes a breach of the terms, which may result in immediate termination of your account.
              </p>
              <ul className="space-y-4">
                {[
                  "You are responsible for safeguarding your password.",
                  "You agree not to disclose your password to any third party.",
                  "You must notify us immediately upon becoming aware of any security breach."
                ].map((item, i) => (
                  <li key={i} className="flex gap-4 text-slate-600 text-lg">
                    <CheckCircle2 className="text-pd-pink shrink-0 mt-1" size={20} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-pd-pink/10 text-pd-pink flex items-center justify-center text-lg shrink-0">4</span>
                Venues and Bookings
              </h2>
              <p className="text-slate-600 leading-relaxed text-lg bg-pd-blue/5 p-6 rounded-2xl border border-pd-blue/10">
                While we strive to verify all venues on our platform, we do not guarantee the quality, safety, or legality of the venues. Any issues regarding the venue services, cancellations, or refunds must be addressed directly with the venue management according to their specific policies.
              </p>
            </div>

            <div className="mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-pd-blue/10 text-pd-blue flex items-center justify-center text-lg shrink-0">5</span>
                Intellectual Property
              </h2>
              <p className="text-slate-600 leading-relaxed text-lg">
                The service and its original content, features, and functionality are and will remain the exclusive property of PartyDial and its licensors. Our trademarks may not be used in connection with any product or service without our prior written consent.
              </p>
            </div>

            <div className="mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-pd-purple/10 text-pd-purple flex items-center justify-center text-lg shrink-0">6</span>
                Limitation of Liability
              </h2>
              <p className="text-slate-600 leading-relaxed text-lg">
                In no event shall PartyDial, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the service.
              </p>
            </div>

            <div className="pt-8 border-t border-slate-100">
              <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-pd-pink/10 text-pd-pink flex items-center justify-center text-lg shrink-0">7</span>
                Contact Us
              </h2>
              <p className="text-slate-600 leading-relaxed text-lg mb-6">
                If you have any questions about these Terms, please contact us at:
              </p>
              <a href="mailto:support@partydial.com" className="inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors">
                support@partydial.com
              </a>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}

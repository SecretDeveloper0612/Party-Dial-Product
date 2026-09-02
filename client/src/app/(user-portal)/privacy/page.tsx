import React from 'react';
import { ArrowLeft, Shield, Lock, Eye, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function PrivacyPolicyPage() {
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
            Privacy <span className="pd-gradient-text">Policy</span>
          </h1>
          <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Your privacy is critically important to us. This policy describes how we collect, use, and protect your information.
          </p>
          <div className="mt-8 flex items-center justify-center gap-2 text-slate-400 text-sm font-medium">
            <Shield size={16} /> Last updated: {new Date().toLocaleDateString()}
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
                PartyDial ("we", "our", or "us") respects your privacy and is committed to protecting it through our compliance with this policy. This Privacy Policy describes how we collect, use, and share information about you when you visit our website or use our services.
              </p>
            </div>

            <div className="mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-pd-blue/10 text-pd-blue flex items-center justify-center text-lg shrink-0">2</span>
                Information We Collect
              </h2>
              <p className="text-slate-600 leading-relaxed text-lg mb-6">
                We collect several types of information from and about users of our Website, including:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <UserIcon /> Personal Data
                  </h3>
                  <p className="text-slate-600 text-sm">Name, email address, phone number, and account credentials when you register or submit an inquiry.</p>
                </div>
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <MonitorIcon /> Usage Data
                  </h3>
                  <p className="text-slate-600 text-sm">Information about your internet connection, the equipment you use to access our website, and usage details.</p>
                </div>
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 md:col-span-2">
                  <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <CalendarIcon /> Booking Information
                  </h3>
                  <p className="text-slate-600 text-sm">Event dates, guest capacity, budget preferences, and special requests.</p>
                </div>
              </div>
            </div>

            <div className="mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-pd-purple/10 text-pd-purple flex items-center justify-center text-lg shrink-0">3</span>
                How We Use Your Information
              </h2>
              <p className="text-slate-600 leading-relaxed text-lg mb-6">
                We use information that we collect about you or that you provide to us to:
              </p>
              <ul className="space-y-4">
                {[
                  "Provide you with the Website and its contents, and any other information, products, or services that you request from us.",
                  "Fulfill inquiries and forward your requests directly to venue owners and managers.",
                  "Notify you about changes to our Website or any products or services we offer or provide.",
                  "Improve our platform, customer service, and overall user experience."
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
                Sharing Your Information
              </h2>
              <p className="text-slate-600 leading-relaxed text-lg bg-pd-pink/5 p-6 rounded-2xl border border-pd-pink/10">
                <strong>We do not sell or rent your personal data to third parties.</strong> We only share your information with venue owners or partners explicitly when you submit a booking inquiry so they can fulfill your request. We may also disclose your personal information to comply with any court order, law, or legal process.
              </p>
            </div>

            <div className="mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-pd-blue/10 text-pd-blue flex items-center justify-center text-lg shrink-0">5</span>
                Data Security
              </h2>
              <p className="text-slate-600 leading-relaxed text-lg">
                We have implemented measures designed to secure your personal information from accidental loss and from unauthorized access, use, alteration, and disclosure. However, the transmission of information via the internet is not completely secure, and we cannot guarantee the security of your personal information transmitted to our Website.
              </p>
            </div>

            <div className="mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-pd-purple/10 text-pd-purple flex items-center justify-center text-lg shrink-0">6</span>
                Your Rights
              </h2>
              <p className="text-slate-600 leading-relaxed text-lg">
                Depending on your location, you may have rights under applicable data protection laws to access, correct, delete, or restrict the processing of your personal data. You can exercise these rights by contacting us.
              </p>
            </div>

            <div className="pt-8 border-t border-slate-100">
              <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-pd-pink/10 text-pd-pink flex items-center justify-center text-lg shrink-0">7</span>
                Contact Information
              </h2>
              <p className="text-slate-600 leading-relaxed text-lg mb-6">
                To ask questions or comment about this privacy policy and our privacy practices, please contact us.
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

// Minimal Icons for UI
const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);
const MonitorIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/></svg>
);
const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
);

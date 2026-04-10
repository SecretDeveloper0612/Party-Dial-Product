import React from 'react';
import Link from 'next/link';

export default function RefundPolicy() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-20 font-sans text-slate-800 leading-relaxed">
      <h1 className="text-3xl font-bold mb-8 border-b-2 border-slate-100 pb-4 uppercase tracking-tight">
        Refund / Cancellation / Return Policy
      </h1>
      
      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-bold mb-4 text-red-600">1. No Refund Policy</h2>
          <p className="mb-4 font-semibold italic">
            In this SaaS, we do not have any return or refund policy.
          </p>
          <p>
            At PartyDial, we strive to provide the best possible event discovery and management services. To maintain high-quality operations and platform security, all transactions processed through our system are final. Once a payment is confirmed, no refunds, returns, or credits will be issued under any circumstances.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4">2. Subscription Services</h2>
          <p>
            For venue owners and partners, all subscription fees and promotional offers are strictly non-refundable. 
          </p>
          <ul className="list-disc ml-6 mt-4 space-y-2">
            <li>Immediate access to platform features is granted upon payment, which constitutes completion of the service.</li>
            <li>Users can cancel their membership at any time to prevent future renewals, but no partial refunds will be given for the remaining period of an active subscription.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4">3. Cancellation Policy</h2>
          <p>
            Users may choose to stop using our services or delete their listings at any time. However:
          </p>
          <ul className="list-disc ml-6 mt-4 space-y-2">
            <li>Cancellation of an account does not entitle the user to a refund of any previously paid fees.</li>
            <li>In the case of venue bookings initiated through our platform, any cancellation must be handled directly with the specific venue owner. PartyDial is not responsible for the refund policies of individual venue partners.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4">4. Return Policy</h2>
          <p>
            Since PartyDial is a Software-as-a-Service (SaaS) platform providing digital listings and discovery services, there are no physical goods to be "returned." All digital access and lead-generation tools provided to vendors are considered consumed upon purchase.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4">5. Platform & Service Fees</h2>
          <p>
            Any administrative or service fees charged by PartyDial for processing inquiries or managing platform operations are 100% non-refundable. These fees cover the cost of technology, server maintenance, and operational support provided by Preet Tech.
          </p>
        </section>

        <div className="mt-12 p-8 bg-slate-50 rounded-xl border border-slate-200">
          <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-4 italic">Management Information:</h2>
          <p className="text-sm text-slate-700 leading-relaxed mb-4">
            This platform and all its financial operations are managed exclusively by <strong>Preet Tech</strong> 
          </p>
          <p className="text-sm text-slate-600">
            For any billing-related clarifications, please contact us at: <br />
            <strong>Email:</strong> support@partydial.com <br />
            <strong>Helpline:</strong> +91 90589 88455
          </p>
        </div>

        <div className="mt-16 pt-8 border-t border-slate-100 flex items-center justify-between text-sm text-slate-400 font-bold">
          <p>© 2026 PARTYDIAL | PREET TECH</p>
          <Link href="/" className="text-blue-600 hover:text-blue-800 transition-colors">
            Return to Homepage
          </Link>
        </div>
      </div>
    </main>
  );
}

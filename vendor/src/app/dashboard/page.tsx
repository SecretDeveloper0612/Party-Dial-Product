'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, 
  Users, 
  Star, 
  Zap, 
  Building2, 
  ImageIcon, 
  IndianRupee, 
  MessageSquare, 
  ExternalLink,
  Bell,
  Search,
  ChevronRight,
  TrendingUp,
  MapPin,
  Clock,
  CalendarDays,
  MoreVertical,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  ShieldCheck,
  Settings,
  LogOut,
  User,
  CheckCircle2,
  X,
  Sparkle,
  Wallet,
  PieChart,
  HelpCircle,
  MessageSquareQuote,
  Filter,
  Download,
  Plus,
  Minus,
  Menu,
  ArrowLeft,
  ChevronLeft,
  History,
  FileText,
  Calculator,
  Send,
  Phone,
  MessageCircle,
  Mail,
  ChevronDown
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import logo from '../logo.jpg';

const tabs = [
  { id: 'overview', label: 'Overview', icon: <BarChart3 size={18} /> },
  { id: 'leads', label: 'Leads', icon: <Zap size={18} /> },
  { id: 'calendar', label: 'Calendar', icon: <CalendarDays size={18} /> },
  { id: 'reviews', label: 'Reviews', icon: <MessageSquareQuote size={18} /> },
  { id: 'finance', label: 'Finance', icon: <Wallet size={18} /> },
  { id: 'analytics', label: 'Analytics', icon: <PieChart size={18} /> },
  { id: 'history', label: 'History', icon: <History size={18} /> },
  { id: 'quotation', label: 'Quotation', icon: <Calculator size={18} /> },
];

const secondaryTabs = [
  { id: 'support', label: 'Support', icon: <HelpCircle size={18} /> },
  { id: 'settings', label: 'Settings', icon: <Settings size={18} /> },
];

const stats = [
  { label: 'Active Leads', value: '48', icon: <Zap size={20} />, color: 'bg-emerald-50 text-emerald-600', trend: '+12.5%', isUp: true },
  { label: 'Profile Views', value: '2,840', icon: <BarChart3 size={20} />, color: 'bg-blue-50 text-blue-600', trend: '+5.2%', isUp: true },
  { label: 'Average Rating', value: '4.8', icon: <Star size={20} />, color: 'bg-amber-50 text-amber-600', trend: '0.0%', isUp: true },
  { label: 'Total Sales', value: '₹1.2M', icon: <IndianRupee size={20} />, color: 'bg-pink-50 text-pink-600', trend: '-2.1%', isUp: false },
];

const recentLeads = [
  { id: 1, name: 'Anjali Sharma', event: 'Wedding Ceremony', guests: '500', date: '21 Oct 2026', time: '11:16 AM', status: 'New', location: 'Haldwani', title: 'Mobile Application Developers', starred: true, unread: true, color: 'bg-blue-100 text-blue-700' },
  { id: 2, name: 'Vikram Mehta', event: 'Corporate Launch', guests: '200', date: '15 Nov 2026', time: '02:30 PM', status: 'Booked', location: 'Mumbai', title: 'Marketing Director', starred: false, unread: false, color: 'bg-emerald-100 text-emerald-700' },
  { id: 3, name: 'Surbhi Gupta', event: 'Birthday Bash', guests: '50', date: '02 Dec 2026', time: '09:45 AM', status: 'In-Progress', location: 'Delhi', title: 'Event Planner', starred: true, unread: true, color: 'bg-amber-100 text-amber-700' },
  { id: 4, name: 'Rahul Khanna', event: 'Private Party', guests: '120', date: '10 Jan 2027', time: '06:15 PM', status: 'New', location: 'Bangalore', title: 'Software Architect', starred: false, unread: false, color: 'bg-blue-100 text-blue-700' },
  { id: 5, name: 'Priya Singh', event: 'Engagement', guests: '300', date: '25 Dec 2026', time: '04:20 PM', status: 'Booked', location: 'Jaipur', title: 'Fashion Designer', starred: true, unread: false, color: 'bg-emerald-100 text-emerald-700' },
];

const pastActivities = [
  { id: 1, type: 'Payout Released', title: '₹45,000 sent to Bank Account (****9821)', time: '2 hours ago', icon: <Wallet className="text-emerald-500" size={16} /> },
  { id: 2, type: 'Lead Received', title: 'New inquiry for Wedding (Rohan Varma)', time: '5 hours ago', icon: <Zap className="text-pd-pink" size={16} /> },
  { id: 3, type: 'Booking Completed', title: 'Payment for Royal Suite confirmed', time: 'Yesterday', icon: <CheckCircle2 className="text-emerald-500" size={16} /> },
  { id: 4, type: 'Charge Deducted', title: 'Premium Plan Monthly Renewal (₹1,500)', time: '2 days ago', icon: <Minus className="text-slate-900" size={16} /> },
  { id: 5, type: 'Refund Processed', title: 'Security deposit returned to cliente #PD-882', time: '3 days ago', icon: <ArrowDownRight className="text-amber-500" size={16} /> },
];

export default function VendorDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [leadFilter, setLeadFilter] = useState('All');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);

  // Removed checkAuth effect - functionality merged into setupAuthAndRealtime below

  const handleLogout = async () => {
    try {
      // Use 127.0.0.1 for more reliable local calls (avoids potential IPv6/v4 mismatch)
      await fetch('http://127.0.0.1:5000/api/auth/logout', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        mode: 'cors'
      });
    } catch (err) {
      // Silently log the error; the logout should still proceed for the user.
      console.warn('Backend logout call failed (expected if server is offline or blocked):', err);
    } finally {
      try {
        const { account } = await import('@/lib/appwrite');
        await account.deleteSession('current');
      } catch (err) {
        // Session might not exist in SDK, ignore
      }
      localStorage.removeItem('auth_session');
      localStorage.removeItem('user');
      localStorage.removeItem('onboardingComplete');
      router.push('/login');
    }
  };

  const [replyTarget, setReplyTarget] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isAdvancedFilterOpen, setIsAdvancedFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEventTypes, setSelectedEventTypes] = useState<string[]>([]);
  const [guestRange, setGuestRange] = useState({ min: 0, max: 1000 });
  const [calendarView, setCalendarView] = useState('Monthly');
  
  const [quoteData, setQuoteData] = useState({
    client: 'Aditya Raj',
    event: 'Imperial Wedding',
    gstRate: 18,
    lineItems: [
       { id: 1, label: 'Grand Ballroom Rental', amount: 150000 },
       { id: 2, label: 'Standard Catering (500 pax)', amount: 450000 },
       { id: 3, label: 'Floral Arrangement & Decor', amount: 75000 },
    ]
  });

  const filteredAdvancedLeads = useMemo(() => {
    return [...recentLeads].filter(lead => {
      const matchesStatus = leadFilter === 'All' || lead.status === leadFilter;
      const matchesSearch = searchTerm === '' || 
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        lead.event.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesEvent = selectedEventTypes.length === 0 || 
        selectedEventTypes.some(t => lead.event.includes(t));
      const matchesGuests = parseInt(lead.guests) <= guestRange.max;
      return matchesStatus && matchesSearch && matchesEvent && matchesGuests;
    }).sort((a, b) => b.id - a.id);
  }, [searchTerm, leadFilter, selectedEventTypes, guestRange]);

  const subtotal = quoteData.lineItems.reduce((acc, item) => acc + item.amount, 0);
  const gstAmount = (subtotal * quoteData.gstRate) / 100;
  const totalWithTax = subtotal + gstAmount;

  const [isFinalizing, setIsFinalizing] = useState(false);
  const [qtnSuccess, setQtnSuccess] = useState(false);

  const handleFinalize = () => {
    setIsFinalizing(true);
    setTimeout(() => {
       setIsFinalizing(false);
       setQtnSuccess(true);
       // Reset or show success
       setTimeout(() => setQtnSuccess(false), 3000);
    }, 1500);
  };

  const handleDownload = () => {
     window.print(); // Simple way for the user to download as PDF immediately
  };

  const handleSend = () => {
     alert(`Quotation successfully dispatched to ${quoteData.client}`);
  };

  useEffect(() => {
    let unsubscribe: () => void;

    const setupAuthAndRealtime = async () => {
      try {
        const { client, account, databases, DATABASE_ID, VENUES_COLLECTION_ID } = await import('@/lib/appwrite');
        const { Query } = await import('appwrite');
        
        // 1. Live Auth Check
        const user = await account.get().catch(() => null);
        if (!user) {
          router.push('/login');
          return;
        }
        
        localStorage.setItem('user', JSON.stringify(user));
        setIsAuthorized(true);

        // 2. Initial Fetch Status
        const fetchStatus = async () => {
          const result = await databases.listDocuments(
            DATABASE_ID,
            VENUES_COLLECTION_ID,
            [Query.equal('userId', user.$id)]
          );
          
          if (result.documents.length > 0) {
            const profile = result.documents[0];
            setShowOnboarding(!profile.onboardingComplete);
          } else {
            setShowOnboarding(true);
          }
        };

        await fetchStatus();

        // 3. Realtime Subscription
        unsubscribe = client.subscribe(
          `databases.${DATABASE_ID}.collections.${VENUES_COLLECTION_ID}.documents`,
          (response) => {
            const doc = response.payload as any;
            if (doc.userId === user.$id) {
              if (response.events.some(e => e.includes('update') || e.includes('create'))) {
                setShowOnboarding(!doc.onboardingComplete);
              }
            }
          }
        );

      } catch (err) {
        console.error('Project synchronization failed:', err);
        router.push('/login');
      }
    };

    setupAuthAndRealtime();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [router]);

  const [selectedDay, setSelectedDay] = useState(20);
  const [currentMonth, setCurrentMonth] = useState('March');
  const [calendarEvents, setCalendarEvents] = useState([
     { day: 14, type: 'Wedding Reception', host: 'R. Malhotra', pax: 450, time: '04:00 PM - 12:00 AM', status: 'Confirmed' },
     { day: 26, type: 'Marriage Anniversary', host: 'Aditya Gupta', pax: 200, time: '07:00 PM - 11:30 PM', status: 'Confirmed' },
     { day: 6, type: 'Maintenance', host: 'Facility Team', pax: 0, time: '09:00 AM - 02:00 PM', status: 'Maintenance' },
     { day: 20, type: 'Corporate Workshop', host: 'Google India', pax: 150, time: '10:00 AM - 02:00 PM', status: 'In-Progress' },
     { day: 20, type: 'Engagement Party', host: 'Kapoor Family', pax: 300, time: '04:30 PM - 10:30 PM', status: 'Confirmed' },
     { day: 20, type: 'Setup & Logistics', host: 'Operations', pax: 0, time: '09:00 PM - 11:00 PM', status: 'Pending' }
  ]);

  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [newBookingDay, setNewBookingDay] = useState<number | null>(null);

  const selectedDayEvents = calendarEvents.filter(e => e.day === selectedDay);

  const completeOnboarding = () => {
    localStorage.setItem('onboardingComplete', 'true');
    setShowOnboarding(false);
  };

  if (!isAuthorized) return null;

  return (
    <div className="min-h-screen bg-slate-50 font-pd flex relative">
      
      {/* SIDEBAR */}
      <motion.aside 
        initial={false}
        animate={{ width: sidebarOpen ? 280 : 0, opacity: sidebarOpen ? 1 : 0 }}
        className={`bg-[#0F172A] flex flex-col sticky top-0 h-screen z-50 overflow-hidden no-print ${!sidebarOpen ? 'pointer-events-none' : ''}`}
      >
         <div className="p-8 pb-4 flex-1 w-[280px] scrollbar-hide overflow-y-auto">
            <div className="flex items-center justify-between mb-12">
               <Link href="/">
                  <div className="flex flex-col items-start group cursor-pointer group">
                     <div className="w-36 h-12 relative -mb-2">
                        <Image src={logo} alt="Logo" fill className="object-contain object-left" />
                     </div>
                     <span className="text-[9px] font-black uppercase text-pd-pink tracking-[0.4em] ml-1 opacity-80 italic">Partner</span>
                  </div>
               </Link>
               <button 
                  onClick={() => setSidebarOpen(false)}
                  className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:bg-white hover:text-slate-900 transition-all border border-white/10"
               >
                  <X size={14} />
               </button>
            </div>

            <div className="space-y-1">
               <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 pl-4 mb-4 block opacity-50">Main Menu</span>
                {tabs.map(item => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[12px] font-bold transition-all ${
                      activeTab === item.id 
                      ? 'bg-pd-pink text-white shadow-lg shadow-pd-pink/20' 
                      : 'text-slate-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    {item.icon}
                    <span className="tracking-wide uppercase text-[10px]">{item.label}</span>
                  </button>
                ))}
             </div>

             <div className="space-y-1 mt-6">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-4 mb-2 block">Listing Management</span>
                {[
                  { id: 'profile', label: 'View Profile', icon: <User size={18} />, href: '/dashboard/onboarding/profile' },
                  { id: 'photos', label: 'Photos', icon: <ImageIcon size={18} />, href: '/dashboard/onboarding/photos' },
                  { id: 'pricing', label: 'Pricing', icon: <IndianRupee size={18} />, href: '/dashboard/onboarding/pricing' },
                  { id: 'subscription', label: 'Subscription', icon: <ShieldCheck size={18} />, href: '/dashboard/onboarding/subscription' },
                ].map(item => (
                  <Link key={item.id} href={item.href || '#'}>
                    <div className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-[13px] font-bold italic text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all cursor-pointer">
                      {item.icon}
                      {item.label}
                    </div>
                  </Link>
                ))}
             </div>

             <div className="space-y-1 mt-6">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-4 mb-2 block">System</span>
                {secondaryTabs.map(item => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-[13px] font-bold italic transition-all ${
                      activeTab === item.id 
                      ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/10' 
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                ))}
             </div>
         </div>

         <div className="mt-auto p-6">
            <div className="p-4 bg-slate-900 rounded-[28px] text-white overflow-hidden relative group">
               <div className="relative z-10 flex flex-col gap-3">
                  <div className="w-8 h-8 rounded-lg bg-pd-pink/20 flex items-center justify-center text-pd-pink">
                    <Sparkles size={16} />
                  </div>
                  <div>
                    <h4 className="text-[11px] font-black uppercase tracking-widest italic mb-1">Boost Listing</h4>
                    <p className="text-[9px] text-slate-400 font-medium">Get 5x more visibility today.</p>
                  </div>
                  <button className="w-full py-2 bg-pd-pink text-[10px] font-black uppercase italic rounded-xl shadow-lg shadow-pd-pink/20">Upgrade Now</button>
               </div>
               <div className="absolute top-0 right-0 w-24 h-24 bg-pd-pink/10 rounded-full blur-2xl group-hover:scale-125 transition-transform"></div>
            </div>
            
            <button 
               onClick={handleLogout}
               className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold italic text-red-500 hover:bg-red-50 mt-4 transition-all"
            >
               <LogOut size={20} />
               Sign Out
            </button>

         </div>
      </motion.aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 min-h-screen flex flex-col max-h-screen overflow-y-auto printable-main">
         
         <header className="h-16 bg-white border-b border-slate-100 px-8 flex items-center justify-between sticky top-0 z-40 no-print">
            
            {/* Left Section: Context & Navigation */}
            <div className="flex items-center gap-6">
               {!sidebarOpen && (
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSidebarOpen(true)}
                    className="w-10 h-10 rounded-lg bg-slate-900 flex items-center justify-center text-white shadow-lg shadow-slate-900/10 hover:bg-pd-pink transition-all"
                  >
                     <Menu size={18} />
                  </motion.button>
               )}
               
               <div className="flex flex-col">
                  <h1 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none mb-1">
                     Friday, 20 Mar 2026
                  </h1>
                  <p className="text-sm font-black text-slate-900 uppercase italic tracking-tight">
                     Vendor <span className="text-pd-pink">Console</span> / {activeTab}
                  </p>
               </div>
            </div>

            {/* Center Section: Command Search */}
            <div className="hidden xl:flex items-center gap-4 bg-slate-100/50 hover:bg-white px-5 py-2.5 rounded-2xl border border-transparent hover:border-pd-pink/20 w-80 lg:w-[450px] group transition-all duration-500 shadow-inner">
               <Search size={16} className="text-slate-400 group-focus-within:text-pd-pink transition-colors" />
               <input 
                  type="text" 
                  placeholder="Type to search anything..." 
                  className="bg-transparent border-none outline-none text-[13px] font-bold text-slate-900 w-full placeholder:text-slate-300 italic" 
               />
               <div className="flex items-center gap-1.5 px-2 py-0.5 bg-slate-200/50 rounded-lg text-[10px] font-black text-slate-400 border border-slate-300/20 group-hover:bg-pd-pink/10 group-hover:text-pd-pink group-hover:border-pd-pink/20 transition-all">
                  <span className="mb-0.5">⌘</span>
                  <span>K</span>
               </div>
            </div>

            {/* Right Section: System Actions & Profile */}
            <div className="flex items-center gap-4">
               <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-[20px] border border-slate-100/50 mr-2">
                  {[
                     { icon: <Bell size={18} />, count: 3, id: 'notif' },
                     { icon: <HelpCircle size={18} />, count: 0, id: 'help' }
                  ].map(item => (
                     <button key={item.id} className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-slate-400 hover:text-pd-pink hover:bg-pd-pink/5 hover:scale-105 transition-all relative border border-slate-100 shadow-sm">
                        {item.icon}
                        {item.count > 0 && (
                           <span className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-pd-pink text-white text-[8px] font-black flex items-center justify-center rounded-full border-[3px] border-white shadow-lg shadow-pd-pink/20">
                              {item.count}
                           </span>
                        )}
                     </button>
                  ))}
               </div>
               
               <div className="h-8 w-[1px] bg-slate-200/50 mx-1"></div>

               <div className="flex items-center gap-3 pl-3 cursor-pointer group hover:translate-x-1 transition-all">
                  <div className="text-right hidden sm:block">
                     <p className="text-[13px] font-black text-slate-900 italic tracking-tighter uppercase whitespace-nowrap leading-none mb-1">Grand Imperial</p>
                     <div className="flex items-center gap-2 justify-end">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        <p className="text-[10px] text-emerald-500 font-black uppercase tracking-widest leading-none">Premium</p>
                     </div>
                  </div>
                  <div className="flex relative">
                     <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-pd-pink to-purple-500 p-[2px] shadow-lg shadow-pd-pink/20 group-hover:scale-105 transition-all">
                        <div className="w-full h-full rounded-[14px] bg-white overflow-hidden flex items-center justify-center">
                           <Image src="https://i.pravatar.cc/100?u=grand-imperial" alt="Venue Profile" width={44} height={44} className="grayscale-[0.4] group-hover:grayscale-0 transition-all duration-500" />
                        </div>
                     </div>
                     <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-xl shadow-md flex items-center justify-center border border-slate-100">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
                     </div>
                  </div>
               </div>
            </div>
         </header>

         {/* DASHBOARD CONTENT */}
         <div className="p-8">
            {activeTab === 'overview' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                  
                  {/* Executive Hero Banner */}
                  <div className="relative overflow-hidden bg-white border border-slate-100 rounded-[30px] p-12 mb-10 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                     <div className="absolute top-0 right-0 w-1/4 h-full bg-slate-50/50"></div>
                     <div className="absolute top-0 right-0 w-[1px] h-full bg-slate-100"></div>
                     
                     <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-10">
                        <div>
                           <div className="flex items-center gap-3 mb-8">
                              <span className="w-10 h-[3px] bg-pd-pink"></span>
                              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Executive Briefing</span>
                           </div>
                           <h1 className="text-5xl lg:text-6xl font-black text-slate-900 uppercase italic tracking-tighter mb-6 leading-none">
                              Grand <span className="text-pd-pink">Imperial</span>
                           </h1>
                           <div className="flex flex-wrap gap-4">
                              <div className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-[9px] font-black uppercase tracking-widest">
                                 12 New Inquiries
                              </div>
                              <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-lg text-[9px] font-black uppercase tracking-widest">
                                 Top 10% Listing
                              </div>
                           </div>
                        </div>
                        
                        <div className="flex flex-col gap-3">
                           <button className="h-14 px-10 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] italic hover:bg-pd-pink transition-all shadow-xl shadow-slate-900/5">
                              Launch Inquiry Manager
                           </button>
                        </div>
                     </div>
                  </div>

                  {/* Minimal Stats Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                    {stats.map((stat, i) => (
                       <motion.div
                         key={i}
                         className="bg-white p-8 rounded-[24px] border border-slate-100 shadow-[0_1px_2px_rgba(0,0,0,0.01)] hover:border-pd-pink transition-all"
                       >
                          <div className="flex items-center justify-between mb-10">
                             <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center`}>
                                {stat.icon}
                             </div>
                             <span className={`text-[9px] font-black uppercase tracking-widest ${stat.isUp ? 'text-emerald-500' : 'text-red-500'}`}>
                                {stat.trend}
                             </span>
                          </div>
                          <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">{stat.label}</h4>
                          <p className="text-2xl font-black italic text-slate-900 tracking-tight">{stat.value}</p>
                       </motion.div>
                    ))}
                  </div>

                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-white rounded-[32px] border border-slate-100 p-10">
                       <div className="flex items-center justify-between mb-10">
                          <h2 className="text-xl font-black italic tracking-tighter uppercase leading-none">
                             Live <span className="text-pd-pink">Inquiry Feed</span>
                          </h2>
                          <button onClick={() => setActiveTab('leads')} className="text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-pd-pink transition-colors">View All History</button>
                       </div>
                       
                       <div className="grid grid-cols-1 gap-4">
                          {[...recentLeads].sort((a,b) => b.id - a.id).slice(0, 4).map((lead, i) => (
                            <motion.div 
                              key={lead.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.1 }}
                              className="group p-5 bg-white border border-slate-50 rounded-[20px] flex items-center justify-between hover:border-pd-pink transition-all cursor-pointer"
                            >
                               <div className="flex items-center gap-5">
                                  <div className="w-12 h-12 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-pd-pink/10 group-hover:text-pd-pink transition-all border border-slate-100 group-hover:border-pd-pink/20">
                                     <Users size={20} />
                                  </div>
                                  <div>
                                     <h4 className="text-sm font-black italic uppercase tracking-tight text-slate-900 leading-none mb-1.5">{lead.name}</h4>
                                     <div className="flex items-center gap-2">
                                        <span className="text-[9px] font-bold text-slate-400 flex items-center gap-1 italic lowercase">
                                           <Clock size={10} /> {lead.date}
                                        </span>
                                        <span className="w-1 h-1 rounded-full bg-slate-200"></span>
                                        <span className="text-[8px] font-black text-pd-pink uppercase tracking-widest leading-none">{lead.event}</span>
                                     </div>
                                  </div>
                               </div>
                               <div className="flex flex-col items-end gap-2">
                                  <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest ${lead.color}`}>
                                     {lead.status}
                                  </span>
                               </div>
                            </motion.div>
                          ))}
                       </div>
                    </div>

                    {/* Performance Profile Sidebar */}
                    <div className="space-y-8">
                       <div className="bg-[#0F172A] rounded-[32px] p-8 text-white relative overflow-hidden group">
                          <header className="flex items-center justify-between mb-8">
                             <div>
                                <h3 className="text-[9px] font-black italic uppercase tracking-[0.2em] text-pd-pink mb-1">Listing Velocity</h3>
                                <p className="text-xl font-black italic tracking-tighter leading-none">85.4%</p>
                             </div>
                             <div className="w-12 h-12 rounded-lg border border-white/20 flex items-center justify-center">
                                <TrendingUp size={18} className="text-emerald-400" />
                             </div>
                          </header>
                          <p className="text-[10px] text-slate-400 font-medium leading-relaxed mb-8 italic">Your storefront is performing in the <span className="text-white font-bold underline decoration-pd-pink decoration-2 underline-offset-4">Top Tier</span> of Luxury Venues.</p>
                          <button className="w-full py-4 bg-pd-pink text-[9px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-pd-pink/20">Expand Reach</button>
                       </div>
                       
                       <div className="bg-white border border-slate-100 rounded-[32px] p-8">
                          <div className="flex items-center justify-between mb-6">
                             <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-900">Quick Wins</h4>
                             <Sparkles size={14} className="text-pd-pink" />
                          </div>
                          <div className="space-y-4">
                             <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                <p className="text-[10px] font-bold text-slate-500 italic leading-snug">Average response time is <span className="text-emerald-500 font-black">2.4 mins</span>. Excellent!</p>
                             </div>
                             <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                <p className="text-[10px] font-bold text-slate-500 italic leading-snug">Update your ballroom photos to increase leads by <span className="text-pd-pink font-black">18%</span>.</p>
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>
              </motion.div>
            )}

            {activeTab === 'leads' && (
              <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-10">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <h1 className="text-3xl font-black text-slate-900 uppercase italic tracking-tight mb-2">Lead Management</h1>
                    <p className="text-sm font-medium text-slate-500 italic">Total <span className="text-pd-pink">{recentLeads.filter(l => leadFilter === 'All' || l.status === leadFilter).length}</span> inquiries found.</p>
                  </div>
                  <div className="flex items-center gap-3">
                     <div className="flex bg-white p-1 rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                        {['All', 'New', 'In-Progress', 'Booked'].map(filter => (
                          <button 
                            key={filter} 
                            onClick={() => setLeadFilter(filter)}
                            className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${leadFilter === filter ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-900'}`}
                          >
                            {filter}
                          </button>
                        ))}
                     </div>
                     <button className="bg-white border border-slate-200 p-2.5 rounded-2xl text-slate-400 hover:text-pd-pink transition-all">
                        <Filter size={20} />
                     </button>
                  </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-4">
                   {[
                      { l: 'New Leads', v: recentLeads.filter(l => l.status === 'New').length, c: 'text-blue-600' },
                      { l: 'Waiting Response', v: recentLeads.filter(l => l.status === 'In-Progress').length, c: 'text-amber-600' },
                      { l: 'Meetings Set', v: '05', c: 'text-emerald-600' },
                      { l: 'Revenue Opp', v: '₹8.4L', c: 'text-pd-pink' }
                   ].map((stat, i) => (
                       <div key={i} className="bg-white px-6 py-4 rounded-[30px] border border-slate-100 shadow-pd-soft">
                          <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">{stat.l}</span>
                          <p className={`text-xl font-black italic tracking-tighter ${stat.c}`}>{stat.v}</p>
                       </div>
                    ))}
                 </div>

                 <div className="space-y-3">
                    {filteredAdvancedLeads.map((lead, i) => (
                      <motion.div 
                        key={lead.id} 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="group bg-white p-6 rounded-[24px] border border-slate-100 hover:border-blue-200 hover:shadow-xl transition-all relative overflow-hidden flex flex-col gap-4 cursor-pointer"
                      >
                         <div className="flex items-start justify-between">
                            <div className="flex gap-6">
                               {/* Left Avatar Section */}
                               <div className="relative">
                                  <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500 border border-blue-100 shadow-inner group-hover:scale-110 transition-transform duration-500">
                                     <User size={28} />
                                  </div>
                                  {lead.unread && (
                                     <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                                     </span>
                                  )}
                               </div>

                               {/* Information Stack */}
                               <div className="space-y-1 text-left">
                                  <div className="flex items-center gap-2">
                                     {lead.unread && (
                                        <span className="bg-blue-100 text-blue-600 text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter shadow-sm border border-blue-200/50">READ</span>
                                     )}
                                     <div className="flex items-center gap-1.5">
                                        {lead.starred && <Star size={14} fill="#FACC15" className="text-yellow-400" />}
                                        <h4 className="text-lg font-black italic text-slate-900 uppercase tracking-tight leading-none">{lead.name}</h4>
                                     </div>
                                     <span className="text-[10px] font-black text-slate-300 italic uppercase tracking-widest ml-1">Recent</span>
                                  </div>
                                  
                                  <p className="text-[13px] font-bold text-slate-600 italic leading-none">{lead.location}</p>
                                  
                                  <div className="flex items-center gap-4 pt-2">
                                     <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-slate-500 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
                                        <CalendarDays size={12} className="text-slate-400" />
                                        {lead.date}
                                     </div>
                                     <div className="text-[11px] font-black text-rose-500 uppercase italic tracking-[0.1em]">{lead.event}</div>
                                  </div>
                               </div>
                            </div>

                            {/* Right Actions & Status */}
                            <div className="flex flex-col items-end justify-between self-stretch">
                               <div className="text-right">
                                  <p className="text-[11px] font-black text-slate-400 uppercase italic tracking-widest">{lead.date.split(' ').slice(0, 2).join(' ')}, {lead.time}</p>
                               </div>

                               <div className="flex items-center gap-3">
                                  <div className="flex items-center gap-2 mr-4 text-left">
                                     <button className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 hover:scale-110 transition-all shadow-lg shadow-blue-200">
                                        <Phone size={18} />
                                     </button>
                                     <button className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center hover:bg-emerald-600 hover:scale-110 transition-all shadow-lg shadow-emerald-200">
                                        <MessageCircle size={18} />
                                     </button>
                                     <button className="w-10 h-10 rounded-xl bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600 hover:scale-110 transition-all shadow-lg shadow-blue-200">
                                        <Mail size={18} />
                                     </button>
                                  </div>

                                  <div className="flex flex-col items-center mr-6">
                                     <span className="text-[9px] font-black uppercase text-slate-300 tracking-[0.2em] mb-1">Guests</span>
                                     <span className="text-lg font-black italic text-slate-900 leading-none">{lead.guests}</span>
                                  </div>

                                  <div className="flex items-center gap-4">
                                     {lead.status === 'New' && (
                                        <span className="px-6 py-2 bg-blue-100 text-blue-700 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl border border-blue-200 shadow-sm animate-pulse">NEW</span>
                                     )}
                                     <button className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-pd-pink hover:border-pd-pink transition-all shadow-sm">
                                        <ChevronRight size={22} />
                                     </button>
                                  </div>
                               </div>
                            </div>
                         </div>

                         {/* Bottom Expandable/Secondary Section */}
                         <div className="mt-2 pt-4 border-t border-slate-50 flex items-center justify-between">
                            <div className="flex items-center gap-6">
                               <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-100 rounded-xl text-[11px] font-black uppercase italic text-slate-700 hover:bg-slate-50 transition-all">
                                  <Sparkle size={14} className="text-yellow-500" />
                                  Send Special Price
                               </button>
                            </div>
                            
                            <div className="flex items-center gap-3">
                               <span className="text-[11px] font-medium text-slate-400 italic">Connected 1 Days Ago</span>
                               <div className="flex bg-blue-50 p-1 rounded-xl border border-blue-100/50">
                                  <button className="px-4 py-1.5 rounded-lg text-[10px] font-black uppercase italic text-slate-600 flex items-center gap-2 bg-white shadow-sm">
                                     <Clock size={12} />
                                     Follow-up
                                  </button>
                                  <button className="px-4 py-1.5 rounded-lg text-[10px] font-black uppercase italic text-slate-400 hover:text-slate-600 transition-all flex items-center gap-2">
                                     <CheckCircle2 size={12} />
                                     Deal Completed
                                  </button>
                                  <button className="w-8 h-8 flex items-center justify-center text-slate-900">
                                     <ChevronDown size={14} strokeWidth={3} />
                                  </button>
                               </div>
                            </div>
                         </div>
                      </motion.div>
                   ))}
                </div>

                <div className="flex items-center justify-center pt-6">
                   <button 
                     onClick={() => setIsAdvancedFilterOpen(true)}
                     className="text-[10px] font-black uppercase tracking-[0.3em] text-pd-pink hover:text-red-600 transition-all italic border-b-2 border-pd-pink pb-1"
                   >
                     Load 50 more inquiries
                   </button>
                </div>
              </motion.div>
            )}
            {activeTab === 'calendar' && (
              <motion.div 
                initial={{ opacity: 0, y: 30 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="flex flex-col xl:flex-row gap-8 min-h-[800px]"
              >
                 {/* LEFT: MASTER SCHEDULE */}
                 <div className="flex-1 space-y-8">
                    <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                       <div>
                          <div className="flex items-center gap-2 mb-3">
                             <div className="w-1.5 h-1.5 rounded-full bg-pd-pink animate-pulse"></div>
                             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-pd-pink">Live Venue Status</span>
                          </div>
                          <h1 className="text-4xl font-black text-slate-900 uppercase italic tracking-tighter leading-none mb-1">
                             {currentMonth} <span className="text-pd-pink">Schedule</span>
                          </h1>
                          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest italic">Spring Ballroom • Grand Imperial Resort</p>
                       </div>
                       
                       <div className="flex items-center gap-3 bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm transition-all duration-300">
                          {['Monthly', 'Weekly', 'Blueprint'].map(view => (
                             <button 
                                key={view} 
                                onClick={() => setCalendarView(view)}
                                className={`px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${calendarView === view ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:text-slate-900'} ${view === 'Blueprint' && calendarView !== view ? 'border border-blue-500/20 text-blue-500' : ''}`}
                             >
                               {view}
                             </button>
                          ))}
                       </div>
                    </header>

                    <div className="bg-white rounded-[40px] border border-slate-100 shadow-pd-soft p-10 min-h-[600px] flex flex-col relative overflow-hidden transition-all duration-500">
                        <div className="flex items-center justify-between mb-8 px-4 shrink-0">
                           <button onClick={() => setCurrentMonth(currentMonth === 'March' ? 'February' : 'March')} className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-50 transition-all shadow-sm">
                              <ChevronLeft size={18} />
                           </button>
                           <span className="text-sm font-black italic uppercase tracking-widest text-slate-900">{currentMonth} 2026</span>
                           <button onClick={() => setCurrentMonth(currentMonth === 'March' ? 'April' : 'March')} className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-50 transition-all shadow-sm">
                              <ChevronRight size={18} />
                           </button>
                        </div>

                        <AnimatePresence mode="wait">
                           {calendarView === 'Monthly' && (
                              <motion.div 
                                key="monthly"
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.02 }}
                                transition={{ duration: 0.2 }}
                                className="grid grid-cols-7 gap-px bg-slate-100 rounded-[28px] overflow-hidden border border-slate-100"
                              >
                                 {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                                    <div key={d} className="bg-slate-50 text-center text-[9px] font-black uppercase tracking-widest text-slate-400 py-6 border-b border-slate-100">{d}</div>
                                 ))}
                                 {Array.from({ length: 31 }).map((_, i) => {
                                    const dayNum = i + 1;
                                    const dayEvents = calendarEvents.filter(e => e.day === dayNum);
                                    const isBooked = dayEvents.some(e => e.status === 'Confirmed' || e.status === 'In-Progress');
                                    const isMaintenance = dayEvents.some(e => e.status === 'Maintenance');
                                    const isToday = dayNum === 20;
                                    const isSelected = selectedDay === dayNum;
                                    
                                    return (
                                       <motion.div 
                                          key={i} 
                                          whileHover={{ scale: 1.02, zIndex: 10 }}
                                          onClick={() => setSelectedDay(dayNum)}
                                          className={`bg-white min-h-[120px] p-5 flex flex-col transition-all cursor-pointer relative group ${isSelected ? 'ring-2 ring-pd-pink ring-inset rounded-2xl z-20 shadow-2xl scale-105' : ''} ${isToday ? 'bg-slate-50 border-pd-pink/10' : ''}`}
                                       >
                                          <div className="flex justify-between items-start mb-4">
                                             <span className={`text-xs font-black italic ${isSelected || isToday ? 'text-pd-pink' : isBooked ? 'text-slate-900' : isMaintenance ? 'text-amber-500' : 'text-slate-300'}`}>
                                                {String(dayNum).padStart(2, '0')}
                                             </span>
                                             {isBooked && <div className="w-1.5 h-1.5 rounded-full bg-pd-pink"></div>}
                                          </div>
                                          
                                          <div className="space-y-2 mt-auto">
                                             {isBooked && dayEvents.filter(e => e.status !== 'Maintenance').slice(0, 1).map((e, idx) => (
                                                <div key={idx} className="px-2.5 py-1.5 bg-pd-pink/10 rounded flex flex-col gap-0.5 border-l-2 border-pd-pink">
                                                   <span className="text-[7px] font-black uppercase text-pd-pink leading-none truncate">{e.type}</span>
                                                   <span className="text-[6px] font-bold text-pd-pink opacity-70 italic leading-none truncate">{e.host}</span>
                                                </div>
                                             ))}
                                          </div>
                                       </motion.div>
                                    );
                                 })}
                              </motion.div>
                           )}

                           {calendarView === 'Weekly' && (
                              <motion.div 
                                key="weekly"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-hide"
                              >
                                 {[16, 17, 18, 19, 20, 21, 22].map(day => {
                                    const events = calendarEvents.filter(e => e.day === day);
                                    const isToday = day === 20;
                                    return (
                                       <motion.div 
                                          key={day} 
                                          whileHover={{ x: 5 }}
                                          className={`p-10 rounded-[45px] border ${isToday ? 'bg-slate-900 text-white shadow-2xl shadow-slate-900/40 border-slate-900' : 'bg-white border-slate-50 shadow-sm'} flex items-center justify-between transition-all cursor-pointer group`}
                                       >
                                          <div className="flex items-center gap-10">
                                             <div className="flex flex-col items-center min-w-[60px]">
                                                <span className={`text-[11px] font-black uppercase tracking-[0.2em] ${isToday ? 'text-pd-pink' : 'text-slate-300'}`}>MAR</span>
                                                <span className="text-5xl font-black italic leading-none tracking-tighter">{day}</span>
                                             </div>
                                             <div className={`w-2 h-2 rounded-full ${isToday ? 'bg-pd-pink animate-pulse' : 'bg-slate-100'}`} />
                                             <div className="space-y-1">
                                                {events.length > 0 ? (
                                                  events.map((e, idx) => (
                                                     <div key={idx} className="flex flex-col">
                                                        <h4 className={`text-xl font-black uppercase italic tracking-tight leading-none mb-1 ${isToday ? 'text-white' : 'text-slate-900'}`}>{e.type}</h4>
                                                        <div className="flex items-center gap-3">
                                                           <span className={`text-[11px] font-black italic tracking-widest ${isToday ? 'text-pd-pink' : 'text-slate-400'}`}>{e.time}</span>
                                                           <span className={`text-[11px] font-medium italic opacity-40 ${isToday ? 'text-white' : 'text-slate-900'}`}>Host: {e.host}</span>
                                                        </div>
                                                     </div>
                                                  ))
                                                ) : (
                                                  <div className="flex flex-col">
                                                     <span className="text-xl font-black italic uppercase text-slate-200 tracking-tighter">Available Blueprint Slot</span>
                                                     <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest leading-none">Open for inquiries</span>
                                                  </div>
                                                )}
                                             </div>
                                          </div>
                                          <div className="flex items-center gap-6">
                                             {events.length === 0 && (
                                                <button className="px-8 py-3.5 bg-pd-pink text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-pd-pink/20 hover:scale-105 transition-all">RESERVE SLOT</button>
                                             )}
                                             <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center transition-all ${isToday ? 'bg-white/10 border-white/20 text-white' : 'bg-slate-50 border-slate-100 text-slate-400'} group-hover:bg-pd-pink group-hover:text-white group-hover:border-pd-pink`}>
                                                <ChevronRight size={20} />
                                             </div>
                                          </div>
                                       </motion.div>
                                    );
                                 })}
                              </motion.div>
                           )}

                           {calendarView === 'Blueprint' && (
                              <motion.div 
                                key="blueprint"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex-1 flex flex-col gap-10"
                              >
                                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    {[
                                       { area: 'Imperial Ballroom', cap: '85', status: 'High Volume' },
                                       { area: 'Royal Terrace', cap: '32', status: 'Available' },
                                       { area: 'Executive Suites', cap: '94', status: 'Peak Occupancy' }
                                    ].map((item, idx) => (
                                       <div key={idx} className="p-10 bg-slate-50 rounded-[50px] border border-slate-100 shadow-inner group hover:bg-white hover:shadow-2xl transition-all duration-500">
                                          <div className="flex justify-between items-start mb-8">
                                             <div className={`w-3 h-3 rounded-full ${parseInt(item.cap) > 90 ? 'bg-pd-pink animate-pulse' : 'bg-emerald-500'}`} />
                                             <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">{item.status}</span>
                                          </div>
                                          <h4 className="text-xs font-black uppercase text-slate-400 mb-6">{item.area}</h4>
                                          <div className="flex items-center gap-6">
                                             <span className="text-5xl font-black italic text-slate-900 leading-none tracking-tighter">{item.cap}<span className="text-xl text-pd-pink">%</span></span>
                                             <div className="flex-1 h-3 bg-white rounded-full overflow-hidden border border-slate-100 shadow-inner">
                                                <motion.div 
                                                  initial={{ width: 0 }}
                                                  animate={{ width: `${item.cap}%` }}
                                                  transition={{ duration: 1, delay: 0.2 }}
                                                  className={`h-full ${parseInt(item.cap) > 90 ? 'bg-pd-pink' : 'bg-slate-900'}`} 
                                                />
                                             </div>
                                          </div>
                                       </div>
                                    ))}
                                 </div>
                                 <div className="flex-1 bg-slate-900 rounded-[60px] p-16 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-2xl">
                                    <div className="absolute inset-0 bg-gradient-to-tr from-pd-pink/20 via-transparent to-blue-500/10 pointer-events-none" />
                                    <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-pd-pink/10 rounded-full blur-[100px]" />
                                    
                                    <div className="w-20 h-20 rounded-3xl bg-white/10 flex items-center justify-center mb-10 relative z-10 border border-white/10">
                                       <Zap size={32} className="text-pd-pink" />
                                    </div>
                                    <h3 className="text-4xl font-black italic uppercase text-white mb-4 relative z-10 tracking-tighter leading-none">Inventory Intelligence <span className="text-pd-pink">Blueprint</span></h3>
                                    <p className="text-[13px] font-medium text-white/40 italic mb-12 relative z-10 max-w-md mx-auto leading-relaxed">Optimize your venue utilization with advanced predictive modeling and real-time inventory tracking architecture.</p>
                                    
                                    <div className="flex gap-4 relative z-10">
                                       <button className="px-12 py-5 bg-pd-pink text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-pd-pink/40 hover:scale-105 transition-all">OPTIMIZE YIELD</button>
                                       <button className="px-12 py-5 bg-white/5 text-white border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/10 transition-all">EXPORT ANALYSIS</button>
                                    </div>
                                 </div>
                              </motion.div>
                           )}
                        </AnimatePresence>
                    </div>
                 </div>

                 {/* RIGHT: DAILY AGENDA & CONTROLS */}
                 <div className="w-full xl:w-[400px] flex flex-col gap-8">
                    {/* Date Details */}
                    <div className="bg-slate-900 rounded-[40px] p-10 text-white shadow-2xl relative overflow-hidden group min-h-[500px]">
                       <div className="absolute top-0 right-0 w-32 h-32 bg-pd-pink/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-700"></div>
                       
                       <div className="relative z-10">
                          <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-pd-pink mb-8 italic">Agenda Detail</h4>
                          <h2 className="text-6xl font-black italic tracking-tighter leading-none mb-2">{selectedDay} <span className="text-pd-pink">{currentMonth.slice(0, 3).toUpperCase()}</span></h2>
                          <p className="text-sm font-medium text-slate-400 italic mb-10">
                             {selectedDayEvents.length > 0 ? `${selectedDayEvents.length} Scheduled Events` : 'No events for this date'}
                          </p>
                          
                          <div className="space-y-6">
                             {selectedDayEvents.length > 0 ? selectedDayEvents.map((evt, i) => (
                                <motion.div 
                                  initial={{ x: 20, opacity: 0 }}
                                  animate={{ x: 0, opacity: 1 }}
                                  transition={{ delay: i * 0.1 }}
                                  key={i} 
                                  className="flex gap-4 p-4 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all cursor-pointer group"
                                >
                                   <div className={`w-1.5 h-12 rounded-full ${evt.status === 'Confirmed' ? 'bg-pd-pink' : evt.status === 'Maintenance' ? 'bg-amber-500' : 'bg-emerald-500'}`}></div>
                                   <div>
                                      <p className="text-[8px] font-black uppercase tracking-widest text-slate-500 leading-none mb-1.5">{evt.time}</p>
                                      <h5 className="text-sm font-black italic uppercase text-white leading-none mb-1 group-hover:text-pd-pink transition-colors">{evt.type}</h5>
                                      <p className="text-[10px] text-slate-400 font-bold italic lowercase opacity-60">host: {evt.host} {evt.pax > 0 && `• ${evt.pax} Pax`}</p>
                                   </div>
                                </motion.div>
                             )) : (
                                <div className="py-12 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-[32px] opacity-40">
                                   <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4">
                                      <Clock size={20} />
                                    </div>
                                   <p className="text-[10px] font-black uppercase tracking-[0.3em]">Pure White Space</p>
                                </div>
                             )}
                          </div>
                          
                          <button 
                            onClick={() => { setIsBookingModalOpen(true); setNewBookingDay(selectedDay); }}
                            className="w-full py-5 bg-white text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] italic mt-12 hover:bg-pd-pink hover:text-white transition-all shadow-xl"
                          >
                             Schedule Intelligence
                          </button>
                       </div>
                    </div>

                    {/* Venue Utilization */}
                    <div className="bg-white rounded-[40px] border border-slate-100 p-10 shadow-pd-soft h-full">
                       <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-900 mb-8">Venue Utilization</h4>
                       <div className="space-y-8">
                          {[
                             { label: 'Occupancy Rate', val: '84%', color: 'bg-pd-pink' },
                             { label: 'Booking Velocity', val: '+12%', color: 'bg-emerald-500' },
                             { label: 'Revenue/Day', val: '₹1.8L', color: 'bg-slate-900' }
                          ].map((stat, i) => (
                             <div key={i}>
                                <div className="flex justify-between items-end mb-3">
                                   <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">{stat.label}</span>
                                   <span className="text-xl font-black italic text-slate-900 tracking-tight">{stat.val}</span>
                                </div>
                                <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                                   <motion.div 
                                      initial={{ width: 0 }}
                                      animate={{ width: stat.val.includes('₹') ? '70%' : stat.val }}
                                      className={`h-full ${stat.color}`}
                                   />
                                </div>
                             </div>
                          ))}
                       </div>
                    </div>
                 </div>
              </motion.div>
            )}

            {activeTab === 'reviews' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                <header className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-black text-slate-900 uppercase italic tracking-tight mb-2">Customer Reviews</h1>
                    <p className="text-sm font-medium text-slate-500">Manage your reputation and interact with your customers.</p>
                  </div>
                  <div className="flex items-center gap-4">
                     <div className="flex items-center gap-1 text-amber-500 font-black italic">
                        <Star size={20} fill="currentColor" />
                        <span className="text-2xl">4.8</span>
                        <span className="text-slate-400 text-xs font-bold uppercase tracking-widest ml-1 mt-1">/ 5.0</span>
                     </div>
                  </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                   {[1,2,3].map(i => (
                     <div key={i} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-pd-soft hover:border-pd-pink transition-all">
                        <div className="flex items-center gap-4 mb-6">
                           <div className="w-12 h-12 rounded-2xl bg-slate-100 overflow-hidden">
                              <img src={`https://i.pravatar.cc/100?u=user${i}`} alt="User" />
                           </div>
                           <div>
                              <h4 className="text-sm font-black italic text-slate-900">Rahul Saxena</h4>
                              <p className="text-[10px] text-slate-400 font-bold">2 days ago</p>
                           </div>
                           <div className="ml-auto flex items-center gap-0.5 text-amber-500">
                              {[1,2,3,4,5].map(s => <Star key={s} size={12} fill="currentColor" />)}
                           </div>
                        </div>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed italic mb-6">
                           &ldquo;The Imperial Grand hall was absolutely stunning for our wedding. The staff was incredibly professional...&rdquo;
                        </p>
                        <button 
                           onClick={() => setReplyTarget({ id: i, name: 'Rahul Saxena', text: 'The Imperial Grand hall was absolutely stunning for our wedding. The staff was incredibly professional...' })}
                           className="text-[10px] font-black uppercase tracking-[0.2em] text-pd-pink hover:underline"
                        >
                           Reply to review
                        </button>
                     </div>
                   ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'finance' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                 <header className="flex items-center justify-between">
                    <div>
                     <h1 className="text-4xl font-black text-slate-900 uppercase italic tracking-tight mb-2">Financial Hub</h1>
                     <p className="text-sm font-medium text-slate-500 italic">Manage your revenue stream and upcoming payouts.</p>
                   </div>
                   <div className="flex gap-4">
                      <button className="flex items-center gap-2 px-8 py-4 bg-white border border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all shadow-pd-soft">
                         <Download size={14} />
                         Export Report
                      </button>
                      <button className="pd-btn-primary flex items-center gap-2 px-8 py-4 rounded-2xl shadow-xl shadow-pd-pink/20">
                         <Plus size={14} strokeWidth={3} />
                         Withdraw
                      </button>
                   </div>
                 </header>

                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                      { label: 'Current Balance', value: '₹4,52,000', delta: '+12%', icon: <Wallet size={24} />, bg: 'bg-emerald-500', text: 'text-white' },
                      { label: 'Pending Payouts', value: '₹85,000', delta: '-$200', icon: <ArrowUpRight size={24} />, bg: 'bg-slate-900', text: 'text-white' },
                      { label: 'YTD Earning', value: '₹12.8L', delta: '+14%', icon: <TrendingUp size={24} />, bg: 'bg-white', text: 'text-slate-900 border border-slate-100' }
                    ].map((item, idx) => (
                       <div key={idx} className={`${item.bg === 'bg-white' ? item.bg : item.bg + ' ' + item.text} p-10 rounded-[50px] shadow-2xl relative overflow-hidden group hover:-translate-y-2 transition-all duration-500`}>
                          <div className="relative z-10">
                             <div className={`w-14 h-14 rounded-2xl ${item.bg === 'bg-white' ? 'bg-slate-50 text-slate-900' : 'bg-white/10 text-white'} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                                {item.icon}
                             </div>
                             <h4 className={`text-[10px] font-black uppercase tracking-[0.2em] ${item.bg === 'bg-white' ? 'text-slate-400' : 'text-white/60'} mb-2`}>{item.label}</h4>
                             <div className="flex items-baseline gap-3">
                                <p className="text-4xl font-black italic tracking-tighter">{item.value}</p>
                                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${item.bg === 'bg-white' ? 'bg-emerald-50 text-emerald-500' : 'bg-white/20'}`}>{item.delta}</span>
                             </div>
                          </div>
                          {item.bg !== 'bg-white' && <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-700" />}
                       </div>
                    ))}
                 </div>

                 <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    <div className="lg:col-span-8 bg-white p-12 rounded-[50px] border border-slate-100 shadow-pd-soft relative overflow-hidden">
                       <div className="flex items-center justify-between mb-12">
                          <h3 className="text-xl font-black italic uppercase text-slate-900 tracking-tight">Recent Transactions</h3>
                           <motion.button 
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setActiveTab('history')} 
                              className="px-8 py-3 rounded-2xl bg-[#0F172A] text-white text-[9px] font-black uppercase tracking-[0.2em] italic hover:bg-pd-pink transition-all shadow-2xl shadow-slate-900/20 flex items-center gap-3 transition-colors group"
                           >
                              <History size={14} className="group-hover:rotate-[-45deg] transition-transform" />
                              View All Records
                           </motion.button>
                       </div>
                       
                       <div className="space-y-4">
                          {[
                             { id: '#PD-9821', name: 'Wedding Booking', date: 'Oct 24, 2026', amt: '+₹45,000', status: 'Completed', type: 'Payout' },
                             { id: '#PD-9822', name: 'Profile Promotion', date: 'Oct 23, 2026', amt: '-₹1,500', status: 'Completed', type: 'Charge' },
                             { id: '#PD-9823', name: 'Silver Plan Renewal', date: 'Oct 22, 2026', amt: '-₹12,000', status: 'Pending', type: 'Charge' },
                             { id: '#PD-9824', name: 'Royal Suite Booking', date: 'Oct 21, 2026', amt: '+₹85,000', status: 'Completed', type: 'Payout' }
                          ].map((t, i) => (
                             <div key={i} className="flex items-center justify-between p-8 bg-slate-50/50 rounded-[40px] border border-slate-100 hover:border-pd-pink transition-all group cursor-default">
                                <div className="flex items-center gap-6">
                                   <div className={`w-14 h-14 rounded-[22px] ${t.amt.startsWith('+') ? 'bg-emerald-50 text-emerald-500' : 'bg-slate-900 text-white'} shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-500`}>
                                      {t.amt.startsWith('+') ? <ArrowUpRight size={24} /> : <Minus size={24} />}
                                   </div>
                                   <div>
                                      <div className="flex items-center gap-3 mb-1">
                                         <h4 className="text-sm font-black italic text-slate-900 uppercase">{t.name}</h4>
                                         <span className="text-[8px] font-black uppercase px-2 py-0.5 bg-white border border-slate-100 rounded-full text-slate-400">{t.id}</span>
                                      </div>
                                      <p className="text-[10px] text-slate-400 font-bold italic tracking-wider">{t.date}</p>
                                   </div>
                                </div>
                                <div className="text-right">
                                   <p className={`text-xl font-black italic mb-1 ${t.amt.startsWith('+') ? 'text-emerald-500' : 'text-slate-900'}`}>{t.amt}</p>
                                   <span className={`text-[8px] font-black uppercase px-2 py-1 rounded-full ${t.status === 'Completed' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>{t.status}</span>
                                </div>
                             </div>
                          ))}
                       </div>
                    </div>

                    <div className="lg:col-span-4 space-y-8">
                       <div className="bg-slate-900 p-10 rounded-[50px] shadow-2xl relative overflow-hidden group h-full">
                          <h3 className="text-lg font-black italic uppercase text-white mb-8 relative z-10">Revenue Goal</h3>
                          <div className="relative z-10">
                             <div className="flex justify-between items-end mb-4">
                                <p className="text-4xl font-black italic text-white leading-none">₹2.4L<span className="text-sm font-black text-white/40 block mt-2 tracking-widest uppercase">Target for Oct</span></p>
                                <div className="text-right">
                                   <p className="text-emerald-400 text-sm font-black italic">65%</p>
                                </div>
                             </div>
                             <div className="h-4 bg-white/10 rounded-full overflow-hidden mb-10 border border-white/5">
                                <motion.div 
                                   initial={{ width: 0 }}
                                   animate={{ width: '65%' }}
                                   transition={{ duration: 1.5, ease: "circOut" }}
                                   className="h-full bg-pd-pink relative"
                                >
                                   <div className="absolute top-0 right-0 w-8 h-full bg-white/30 blur-md" />
                                </motion.div>
                             </div>
                             
                             <div className="p-6 bg-white/5 border border-white/10 rounded-[30px] group-hover:bg-white/10 transition-colors">
                                <p className="text-[10px] text-white/60 font-medium italic leading-relaxed">You are on track to exceed your goal by <span className="text-emerald-400 font-bold">12%</span> if booking velocity remains constant.</p>
                             </div>
                          </div>
                          <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-pd-pink/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
                       </div>
                    </div>
                 </div>
              </motion.div>
            )}

            {activeTab === 'analytics' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
                 <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                       <h1 className="text-4xl font-black text-slate-900 uppercase italic tracking-tighter mb-2 leading-none">Performance <span className="text-pd-pink">Analytics</span></h1>
                       <p className="text-sm font-medium text-slate-500 italic">Advanced tracking of your venue&apos;s digital growth and velocity.</p>
                    </div>
                    <div className="flex bg-white p-1.5 rounded-2xl border border-slate-100 shadow-pd-soft self-start">
                       {['7D', '30D', '90D', '1Y'].map(t => (
                          <button key={t} className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${t === '30D' ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/20' : 'text-slate-400 hover:text-slate-900'}`}>{t}</button>
                       ))}
                    </div>
                 </header>
                 
                 <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Main Chart Card */}
                    <div className="lg:col-span-8 bg-white p-10 rounded-[50px] border border-slate-100 shadow-pd-soft relative overflow-hidden group">
                       <div className="relative z-10">
                          <div className="flex items-center justify-between mb-12">
                             <div>
                                <h3 className="text-xl font-black italic uppercase text-slate-900">Visibility Trend</h3>
                                <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mt-1">+24% vs last month</p>
                             </div>
                             <div className="flex items-center gap-6">
                                <div className="flex items-center gap-2">
                                   <div className="w-2.5 h-2.5 rounded-full bg-pd-pink"></div>
                                   <span className="text-[10px] font-black text-slate-400 uppercase">Views</span>
                                </div>
                                <div className="flex items-center gap-2">
                                   <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
                                   <span className="text-[10px] font-black text-slate-400 uppercase">Leads</span>
                                </div>
                             </div>
                          </div>

                          <div className="h-64 flex items-end gap-3 px-2">
                             {[40, 65, 45, 95, 70, 85, 60, 80, 100, 90, 75, 85].map((h, i) => (
                                <div key={i} className="flex-1 h-full flex flex-col justify-end group/bar cursor-pointer relative">
                                   {/* Tooltip on hover */}
                                   <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-black px-3 py-1.5 rounded-xl opacity-0 group-hover/bar:opacity-100 transition-all scale-75 group-hover/bar:scale-100 whitespace-nowrap z-20 shadow-xl pointer-events-none">
                                      {h * 42} Views
                                   </div>
                                   
                                   <motion.div 
                                      initial={{ height: 0 }} 
                                      animate={{ height: `${h}%` }}
                                      transition={{ delay: i * 0.05, duration: 1, ease: "circOut" }}
                                      className="w-full bg-slate-100/80 rounded-t-2xl group-hover/bar:bg-pd-pink/10 transition-all relative overflow-hidden"
                                   >
                                      {/* Inner progress part */}
                                      <div className="absolute bottom-0 inset-x-0 bg-pd-pink rounded-t-2xl h-1/2 opacity-40 group-hover/bar:h-full group-hover/bar:opacity-100 transition-all duration-500" />
                                      {/* Gloss effect */}
                                      <div className="absolute top-0 inset-x-0 h-full bg-gradient-to-b from-white/40 to-transparent" />
                                   </motion.div>
                                   
                                   <div className="h-1.5 w-full mt-2 rounded-full bg-slate-50 group-hover/bar:bg-pd-pink/20 transition-colors" />
                                </div>
                             ))}
                          </div>
                          
                          <div className="flex justify-between mt-8 border-t border-slate-50 pt-6 px-1">
                             {['Jan', 'Mar', 'May', 'Jul', 'Sep', 'Nov'].map(m => (
                                <span key={m} className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{m}</span>
                             ))}
                          </div>
                       </div>
                       
                       {/* Abstract background shape */}
                       <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-pd-pink/5 rounded-full blur-3xl group-hover:bg-pd-pink/10 transition-all duration-700"></div>
                    </div>
                    
                    {/* Funnel & Conversion Rates */}
                    <div className="lg:col-span-4 flex flex-col gap-8">
                       <div className="bg-slate-900 p-10 rounded-[50px] shadow-2xl relative overflow-hidden flex-1 group">
                          <h3 className="text-lg font-black italic uppercase text-white mb-10 relative z-10">Sales Funnel</h3>
                          
                          <div className="space-y-8 relative z-10">
                             {[
                                { label: 'Visibility', val: '84.2K', p: 100 },
                                { label: 'Profile Clicks', val: '12.4K', p: 65, drop: '14%' },
                                { label: 'Direct Leads', val: '2.8K', p: 35, drop: '22%' },
                                { label: 'Final Booked', val: '142', p: 12, drop: '5%' }
                             ].map((step, idx) => (
                                <div key={idx} className="relative">
                                   <div className="flex justify-between items-end mb-2">
                                      <span className="text-[10px] font-black uppercase text-white/40 tracking-widest">{step.label}</span>
                                      <span className="text-sm font-black italic text-white">{step.val}</span>
                                   </div>
                                   <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                      <motion.div 
                                         initial={{ width: 0 }} 
                                         animate={{ width: `${step.p}%` }}
                                         transition={{ delay: 0.5 + idx * 0.1, duration: 1.5 }}
                                         className="h-full bg-pd-pink"
                                      />
                                   </div>
                                   {step.drop && (
                                      <div className="absolute -bottom-6 left-2 text-[8px] font-black uppercase text-pd-pink/60 italic">
                                         Conv. Rate: {step.drop}
                                      </div>
                                   )}
                                </div>
                             ))}
                          </div>
                          
                          <div className="absolute top-0 right-0 w-48 h-48 bg-pd-pink/10 rounded-full blur-3xl animate-pulse"></div>
                       </div>
                       
                       <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-pd-soft flex items-center justify-between group cursor-pointer hover:border-pd-pink transition-all">
                          <div>
                             <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Overall Conversion</h4>
                             <p className="text-2xl font-black italic text-slate-900">4.82%</p>
                          </div>
                          <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                             <TrendingUp size={24} />
                          </div>
                       </div>
                    </div>
                 </div>

                 {/* Top Categories Grid */}
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                       { label: 'Booking Request', value: '142', sub: 'Last 30 days', color: 'bg-blue-50 text-blue-600' },
                       { label: 'Chat Initiated', value: '2.1K', sub: 'Last 30 days', color: 'bg-pd-pink/10 text-pd-pink' },
                       { label: 'Mobile Views', value: '68%', sub: 'vs 32% Desktop', color: 'bg-slate-100 text-slate-900' },
                       { label: 'Listing ROI', value: '12.4x', sub: 'Premium Plan', color: 'bg-emerald-50 text-emerald-600' }
                    ].map((card, i) => (
                       <div key={i} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-pd-soft hover:-translate-y-1 transition-all">
                          <h4 className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-4">{card.label}</h4>
                          <div className="flex items-baseline gap-2 mb-1">
                             <span className="text-2xl font-black italic text-slate-900 tracking-tight">{card.value}</span>
                             <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded ${card.color}`}>+12%</span>
                          </div>
                          <p className="text-[10px] font-bold italic text-slate-400">{card.sub}</p>
                       </div>
                    ))}
                 </div>
              </motion.div>
            )}

            {activeTab === 'support' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto py-12">
                 <div className="text-center mb-16">
                    <h1 className="text-4xl font-black text-slate-900 uppercase italic tracking-tight mb-4 leading-none">Vendor Help Center</h1>
                    <p className="text-slate-500 font-medium italic">We&apos;re here to help you grow your venue business.</p>
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                    {[
                       { title: 'Chat Support', desc: 'Average response time: 5 mins', icon: <MessageSquare className="text-pd-pink" size={24} /> },
                       { title: 'Knowledge Base', desc: 'Read guides on getting more leads', icon: <HelpCircle className="text-blue-500" size={24} /> }
                    ].map((item, idx) => (
                       <div key={idx} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-pd-soft flex items-center gap-6 hover:border-pd-pink transition-all cursor-pointer">
                          <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100">
                             {item.icon}
                          </div>
                          <div>
                             <h4 className="text-sm font-black italic text-slate-900 uppercase">{item.title}</h4>
                             <p className="text-[10px] text-slate-400 font-bold italic">{item.desc}</p>
                          </div>
                       </div>
                    ))}
                 </div>
                 
                 <div className="bg-slate-900 p-12 rounded-[50px] text-white text-center shadow-2xl">
                    <h3 className="text-2xl font-black italic uppercase mb-4">Dedicated Account Manager</h3>
                    <p className="text-slate-400 text-sm mb-8 italic">Available for <span className="text-emerald-400">Platinum Plus</span> vendors to optimize listings manually.</p>
                    <button className="pd-btn-primary px-10">Email My Manager</button>
                 </div>
              </motion.div>
            )}

            {activeTab === 'settings' && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                 <header>
                    <h1 className="text-3xl font-black text-slate-900 uppercase italic tracking-tight mb-2">Account Settings</h1>
                    <p className="text-sm font-medium text-slate-500">Manage your profile, notifications, and security.</p>
                 </header>
                 
                 <div className="max-w-3xl bg-white rounded-[40px] border border-slate-100 shadow-pd-soft p-12 overflow-hidden">
                    <div className="space-y-10">
                       <section>
                          <h3 className="text-[10px] font-black uppercase tracking-widest text-pd-pink mb-8 italic">Public Profile</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                             <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Venue Display Name</label>
                                <input type="text" defaultValue="Grand Imperial Resort & Spa" className="w-full bg-slate-50 rounded-2xl py-4 px-6 text-sm font-black italic outline-none border border-transparent focus:border-pd-pink transition-all" />
                             </div>
                             <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Primary Category</label>
                                <select className="w-full bg-slate-50 rounded-2xl py-4 px-6 text-sm font-black italic outline-none border border-transparent focus:border-pd-pink transition-all">
                                   <option>Banquet Hall</option>
                                   <option>Resort</option>
                                   <option>Hotel</option>
                                </select>
                             </div>
                          </div>
                       </section>
                       
                       <section>
                          <h3 className="text-[10px] font-black uppercase tracking-widest text-pd-pink mb-8 italic">Notifications</h3>
                          <div className="space-y-4">
                             {[
                                { l: 'Email alerts for new leads', d: true },
                                { l: 'SMS alerts for urgent inquiries', d: true },
                                { l: 'Weekly performance reports', d: false }
                             ].map((n, i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                                   <span className="text-xs font-bold text-slate-600 italic">{n.l}</span>
                                   <div className={`w-10 h-6 rounded-full relative p-1 cursor-pointer transition-colors ${n.d ? 'bg-pd-pink' : 'bg-slate-300'}`}>
                                      <div className={`w-4 h-4 bg-white rounded-full transition-transform ${n.d ? 'translate-x-4' : ''}`} />
                                   </div>
                                </div>
                             ))}
                          </div>
                       </section>
                       
                       <div className="pt-8 border-t border-slate-100 flex justify-end gap-4">
                          <button className="px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">Discard</button>
                          <button className="pd-btn-primary px-10">Save Changes</button>
                       </div>
                    </div>
                 </div>
              </motion.div>
            )}

            {activeTab === 'history' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
                 <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                       <h1 className="text-4xl font-black text-slate-900 uppercase italic tracking-tighter mb-2 leading-none">Activity <span className="text-blue-600">History</span></h1>
                       <p className="text-sm font-medium text-slate-500 italic">Complete chronological log of your venue interactions and events.</p>
                    </div>
                    <div className="flex bg-white p-1.5 rounded-2xl border border-slate-100 shadow-pd-soft self-start">
                       {['All', 'Leads', 'Bookings', 'System'].map(t => (
                          <button key={t} className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${t === 'All' ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/20' : 'text-slate-400 hover:text-slate-900'}`}>{t}</button>
                       ))}
                    </div>
                 </header>

                 <div className="max-w-4xl bg-white rounded-[50px] border border-slate-100 shadow-pd-soft overflow-hidden">
                    <div className="p-10">
                       <div className="space-y-10 relative">
                          {/* Timeline Line */}
                          <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-slate-100"></div>

                          {pastActivities.map((activity, idx) => (
                             <motion.div 
                                key={activity.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="relative pl-16 flex items-start gap-10 group"
                             >
                                {/* Circle on timeline */}
                                <div className="absolute left-[18px] top-4 w-3.5 h-3.5 rounded-full bg-white border-2 border-slate-200 group-hover:border-pd-pink transition-colors z-10 shadow-sm" />
                                
                                <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:bg-white group-hover:shadow-pd-soft transition-all group-hover:scale-110">
                                   {activity.icon}
                                </div>
                                <div className="flex-1 pb-10 border-b border-slate-50 last:border-0">
                                   <div className="flex items-center justify-between mb-2">
                                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-pd-pink transition-colors">{activity.type}</span>
                                      <span className="text-[10px] font-bold text-slate-300 italic">{activity.time}</span>
                                   </div>
                                   <h3 className="text-lg font-black italic tracking-tight text-slate-900 mb-1 leading-none">{activity.title}</h3>
                                   <p className="text-[11px] font-medium text-slate-400 italic">Activity ID: #{activity.id*1234} • Successfully recorded in system</p>
                                </div>
                                <ChevronRight className="mt-4 text-slate-200 group-hover:text-slate-900 transition-colors cursor-pointer" size={20} />
                             </motion.div>
                          ))}
                       </div>
                    </div>
                    
                    <div className="bg-slate-50/50 p-8 text-center border-t border-slate-100">
                       <button className="text-[10px] font-black uppercase tracking-[0.3em] text-pd-pink hover:text-slate-900 transition-all italic">Archive History Log</button>
                    </div>
                 </div>
              </motion.div>
            )}
            {activeTab === 'quotation' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen -mt-10 -mx-4 md:-mx-10 bg-slate-50/50">
                 {/* Executive Status Bar */}
                 <div className="bg-[#0F172A] px-8 py-5 flex items-center justify-between sticky top-0 z-30 shadow-2xl no-print">
                    <div className="flex items-center gap-4">
                       <div className="w-8 h-8 rounded bg-pd-pink flex items-center justify-center text-white">
                          <FileText size={16} />
                       </div>
                       <div>
                          <h1 className="text-sm font-black italic text-white uppercase tracking-wider leading-none">Quote Engine</h1>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1.5">Active Session: #QTN-8821</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-4">
                       <button onClick={() => setActiveTab('overview')} className="text-[9px] font-black uppercase text-slate-400 hover:text-white transition-all tracking-widest">Discard</button>
                       <button 
                         onClick={handleFinalize}
                         disabled={isFinalizing || qtnSuccess}
                         className={`px-8 py-2.5 rounded text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                           qtnSuccess 
                           ? 'bg-emerald-500 text-white' 
                           : isFinalizing 
                             ? 'bg-slate-700 text-slate-300' 
                             : 'bg-white text-slate-900 hover:bg-pd-pink hover:text-white'
                         }`}
                       >
                          {isFinalizing ? (
                             <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          ) : qtnSuccess ? (
                             <CheckCircle2 size={14} />
                          ) : null}
                          {isFinalizing ? 'Processing...' : qtnSuccess ? 'Finalized' : 'Submit & Finalize'}
                       </button>
                    </div>
                 </div>

                 <div className="flex flex-col lg:flex-row h-[calc(100vh-80px)] overflow-hidden printable-container">
                    {/* LEFT: FORM SECTION */}
                    <div className="w-full lg:w-[480px] bg-white border-r border-slate-100 overflow-y-auto p-10 custom-scrollbar no-print">
                       <div className="space-y-12">
                          {/* Entity Section */}
                          <section className="space-y-8">
                             <div className="flex items-center gap-3">
                                <span className="w-2 h-2 rounded-full bg-pd-pink"></span>
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-900">Entity Details</h3>
                             </div>
                             <div className="space-y-6">
                                <div className="space-y-2">
                                   <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Client Identification</label>
                                   <input 
                                      type="text" 
                                      value={quoteData.client}
                                      onChange={(e) => setQuoteData({ ...quoteData, client: e.target.value })}
                                      className="w-full bg-slate-50 border border-slate-100 rounded-xl py-4 px-6 text-sm font-bold text-slate-900 outline-none focus:border-pd-pink focus:bg-white transition-all"
                                      placeholder="e.g. Rahul Varma"
                                   />
                                </div>
                                <div className="space-y-2">
                                   <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Reference Title</label>
                                   <input 
                                      type="text" 
                                      value={quoteData.event}
                                      onChange={(e) => setQuoteData({ ...quoteData, event: e.target.value })}
                                      className="w-full bg-slate-50 border border-slate-100 rounded-xl py-4 px-6 text-sm font-bold text-slate-900 outline-none focus:border-pd-pink focus:bg-white transition-all"
                                      placeholder="e.g. Imperial Wedding Gala"
                                   />
                                </div>
                             </div>
                          </section>

                          {/* Fiscal Section */}
                          <section className="space-y-8">
                             <div className="flex items-center gap-3">
                                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-900">Fiscal Configuration</h3>
                             </div>
                             <div className="grid grid-cols-3 gap-2">
                                {[0, 5, 12, 18, 28].map(r => (
                                   <button 
                                      key={r}
                                      onClick={() => setQuoteData({ ...quoteData, gstRate: r })}
                                      className={`py-3 rounded-xl text-[10px] font-bold border transition-all ${quoteData.gstRate === r ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'}`}
                                   >
                                      {r}% GST
                                   </button>
                                ))}
                                <div className="relative">
                                   <input 
                                      type="number"
                                      placeholder="Custom"
                                      className="w-full h-full bg-slate-50 border border-slate-100 rounded-xl px-3 text-[10px] font-bold outline-none focus:border-pd-pink"
                                      onChange={(e) => setQuoteData({ ...quoteData, gstRate: parseInt(e.target.value) || 0 })}
                                   />
                                </div>
                             </div>
                          </section>

                          {/* Ledger Section */}
                          <section className="space-y-8">
                             <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                   <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                   <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-900">Document Ledger</h3>
                                </div>
                                <button 
                                   onClick={() => setQuoteData({
                                      ...quoteData,
                                      lineItems: [...quoteData.lineItems, { id: Date.now(), label: 'New Line Item', amount: 0 }]
                                   })}
                                   className="text-[9px] font-black text-pd-pink uppercase tracking-widest hover:underline"
                                >
                                   + Appended Item
                                </button>
                             </div>
                             <div className="space-y-4">
                                {quoteData.lineItems.map((item, idx) => (
                                   <div key={item.id} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-4 relative group hover:border-pd-pink transition-all">
                                      <button 
                                         onClick={() => {
                                            const newItems = quoteData.lineItems.filter((_, i) => i !== idx);
                                            setQuoteData({ ...quoteData, lineItems: newItems });
                                         }}
                                         className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-300 hover:text-red-500 shadow-sm opacity-0 group-hover:opacity-100 transition-all z-10"
                                      >
                                         <X size={12} />
                                      </button>
                                      <input 
                                         type="text" 
                                         value={item.label}
                                         onChange={(e) => {
                                            const newItems = [...quoteData.lineItems];
                                            newItems[idx].label = e.target.value;
                                            setQuoteData({ ...quoteData, lineItems: newItems });
                                         }}
                                         className="w-full bg-white border border-slate-100 rounded-xl py-3 px-4 text-xs font-bold text-slate-900 outline-none focus:border-pd-pink"
                                         placeholder="Item Description"
                                      />
                                      <div className="flex items-center gap-3">
                                         <span className="text-[9px] font-black text-slate-400">VALUATION</span>
                                         <div className="flex-1 flex items-center bg-white border border-slate-100 rounded-xl px-4 py-3">
                                            <span className="text-[10px] font-black text-slate-300 mr-2">₹</span>
                                            <input 
                                               type="number" 
                                               value={item.amount}
                                               onChange={(e) => {
                                                  const newItems = [...quoteData.lineItems];
                                                  newItems[idx].amount = parseInt(e.target.value) || 0;
                                                  setQuoteData({ ...quoteData, lineItems: newItems });
                                               }}
                                               className="w-full bg-transparent text-xs font-bold text-slate-900 outline-none"
                                               placeholder="0.00"
                                            />
                                         </div>
                                      </div>
                                   </div>
                                ))}
                             </div>
                          </section>

                          <div className="pt-8 border-t border-slate-100">
                             <div className="p-8 bg-[#0F172A] rounded-[32px] text-white space-y-6 shadow-2xl">
                                <div className="space-y-2">
                                   <div className="flex justify-between items-center text-[9px] font-black uppercase text-slate-500 tracking-widest">
                                      <span>Base Valuation</span>
                                      <span>₹{subtotal.toLocaleString('en-IN')}</span>
                                   </div>
                                   <div className="flex justify-between items-center text-[9px] font-black uppercase text-emerald-400 tracking-widest">
                                      <span>Levy Charge ({quoteData.gstRate}%)</span>
                                      <span>+₹{gstAmount.toLocaleString('en-IN')}</span>
                                   </div>
                                </div>
                                <div className="h-[1px] bg-white/10" />
                                <div className="flex justify-between items-end">
                                   <div>
                                      <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 block mb-1">Final Total</span>
                                      <span className="text-xs font-bold text-white/40 italic">In Indian Rupees</span>
                                   </div>
                                   <span className="text-3xl font-black italic text-pd-pink tracking-tight">₹{totalWithTax.toLocaleString('en-IN')}</span>
                                </div>
                             </div>
                          </div>
                       </div>
                    </div>

                    {/* RIGHT: PREVIEW SECTION */}
                    <div className="flex-1 bg-slate-100 p-8 lg:p-20 overflow-y-auto custom-scrollbar flex flex-col items-center">
                       {/* Floating Action Menu for Preview */}
                       <div className="mb-8 flex items-center gap-4 bg-[#0F172A] p-2 rounded-2xl shadow-xl no-print">
                          <button 
                            onClick={handleDownload}
                            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-slate-900 text-[10px] font-black uppercase tracking-widest hover:bg-pd-pink hover:text-white transition-all"
                          >
                             <Download size={14} />
                             Download PDF
                          </button>
                          <button 
                            onClick={handleSend}
                            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-800 text-white text-[10px] font-black uppercase tracking-widest hover:bg-pd-pink transition-all"
                          >
                             <Send size={14} />
                             Send to Client
                          </button>
                       </div>

                       <motion.div 
                          layout
                          className="w-full max-w-[850px] bg-white shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] p-16 md:p-24 relative min-h-[1100px] flex flex-col print-only"
                       >
                          {/* Formal Document Header */}
                          <div className="flex justify-between items-start mb-24 relative z-10">
                             <div className="flex items-center gap-6">
                              <div className="flex flex-col items-start">
                                 <div className="w-48 h-12 relative -mb-1">
                                    <Image src={logo} alt="Logo" fill className="object-contain object-left" />
                                 </div>
                                 <span className="text-[10px] font-black uppercase text-slate-400 tracking-[0.5em] ml-1 opacity-70 italic">Official Partner</span>
                              </div>
                             </div>
                             <div className="text-right">
                                <h2 className="text-5xl font-black text-slate-900 mb-2 italic tracking-tighter">QTN</h2>
                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em]">#8821B-2026</p>
                             </div>
                          </div>

                          {/* Data Grid */}
                          <div className="grid grid-cols-2 gap-24 mb-24 border-t border-slate-50 pt-16">
                             <div className="space-y-8">
                                <div>
                                   <p className="text-[9px] font-black text-pd-pink uppercase tracking-widest mb-6">Issued By</p>
                                   <p className="text-xl font-black text-slate-900 mb-2 uppercase italic tracking-tight">Grand Imperial Resort</p>
                                   <p className="text-xs font-medium text-slate-500 leading-relaxed italic opacity-80">
                                      Sector 44, Golf Course Extension<br />
                                      Gurgaon, Haryana 122003<br />
                                      GSTIN: 09AAFCP9821G1ZM
                                   </p>
                                </div>
                             </div>
                             <div className="text-right space-y-8">
                                <div className="flex flex-col items-end">
                                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-6">Recipient</p>
                                   <p className="text-xl font-black text-slate-900 mb-2 uppercase italic tracking-tight">{quoteData.client}</p>
                                   <p className="text-xs font-medium text-slate-500 leading-relaxed italic opacity-80">
                                      Reference: {quoteData.event}<br />
                                      Date: {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
                                   </p>
                                </div>
                             </div>
                          </div>

                          {/* Table Ledger */}
                          <div className="flex-1 mb-24">
                             <table className="w-full">
                                <thead>
                                   <tr className="border-b-2 border-slate-900">
                                      <th className="text-left font-black uppercase text-[10px] tracking-[0.3em] py-8 text-slate-400">Description of Deliverables</th>
                                      <th className="text-right font-black uppercase text-[10px] tracking-[0.3em] py-8 text-slate-400">Amount (INR)</th>
                                   </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                   {quoteData.lineItems.map((item, i) => (
                                      <tr key={i} className="group">
                                         <td className="py-10">
                                            <p className="text-sm font-black text-slate-800 mb-1 uppercase italic tracking-tight">{item.label}</p>
                                            <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest italic leading-none">Professional Service Allocation</p>
                                         </td>
                                         <td className="py-10 text-right">
                                            <p className="text-sm font-black text-slate-900 italic tracking-tight">₹{item.amount.toLocaleString('en-IN')}.00</p>
                                         </td>
                                      </tr>
                                   ))}
                                </tbody>
                             </table>
                          </div>

                          {/* Mathematical Summations */}
                          <div className="flex justify-end pt-12 border-t-2 border-slate-900">
                             <div className="w-full md:w-80 space-y-4">
                                <div className="flex justify-between items-center">
                                   <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Gross Total</span>
                                   <span className="text-sm font-black text-slate-900 italic">₹{subtotal.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between items-center py-4 border-y border-slate-100 italic">
                                   <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Tax Provision ({quoteData.gstRate}%)</span>
                                   <span className="text-sm font-black text-slate-900">+₹{gstAmount.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between items-center pt-6">
                                   <span className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em]">Total Amount Payable</span>
                                   <span className="text-4xl font-black italic text-pd-pink tracking-tight">₹{totalWithTax.toLocaleString('en-IN')}</span>
                                </div>
                             </div>
                          </div>

                          {/* Legal Disclaimer */}
                          <div className="mt-auto pt-32 flex justify-between items-end opacity-40 grayscale">
                             <div className="space-y-4">
                                <p className="text-[10px] font-black uppercase text-slate-900 border-b border-slate-900 pb-1 w-fit">Terms of Business</p>
                                <ul className="text-[9px] font-bold text-slate-500 italic space-y-1">
                                   <li>• Validity: 7 Working Days</li>
                                   <li>• Execution contingent on 50% retainer</li>
                                   <li>• E. & O. E.</li>
                                </ul>
                             </div>
                             <div className="text-right">
                                <div className="w-48 h-[1px] bg-slate-900 mb-6 ml-auto" />
                                <p className="text-[10px] font-black uppercase text-slate-900 italic tracking-widest">Authorized Executive</p>
                                <p className="text-[8px] font-black text-slate-300 uppercase tracking-[0.4em] mt-2">Digital Verification: {Math.random().toString(36).substring(7).toUpperCase()}</p>
                             </div>
                          </div>
                       </motion.div>
                    </div>
                 </div>
              </motion.div>
            )}
          </div>

      </main>

      {/* Onboarding Popup Overlay */}
      <AnimatePresence>
        {showOnboarding && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 md:p-10">
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
               onClick={() => setShowOnboarding(false)}
            />
            
            <motion.div 
               initial={{ opacity: 0, scale: 0.95, y: 30 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.95, y: 20 }}
               transition={{ type: "spring", damping: 30, stiffness: 300 }}
               className="relative w-full max-w-[600px] bg-white rounded-[50px] shadow-3xl overflow-hidden z-10"
               style={{ willChange: 'transform, opacity' }}
            >
               {/* Elegant Gradient Accent */}
               <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-pd-pink via-purple-500 to-pd-pink animate-gradient-x" />
               
               <button 
                  onClick={() => setShowOnboarding(false)}
                  className="absolute top-8 right-8 w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white transition-all z-20 shadow-sm"
               >
                  <X size={20} />
               </button>

               <div className="p-12 md:p-16 text-center">
                  <div className="w-24 h-24 bg-pd-pink/10 rounded-[40px] flex items-center justify-center text-pd-pink mx-auto mb-10 relative group">
                     <div className="absolute inset-0 rounded-[40px] border-2 border-pd-pink/20 animate-[ping_3s_linear_infinite] opacity-50"></div>
                     <Sparkle size={44} fill="currentColor" className="group-hover:rotate-180 transition-transform duration-1000" />
                     <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-2xl shadow-lg border border-slate-50 flex items-center justify-center">
                        <Star size={14} fill="#FF5DA4" className="text-pd-pink" />
                     </div>
                  </div>

                  <h2 className="text-4xl md:text-5xl font-black text-slate-900 uppercase italic tracking-tighter mb-6 leading-[0.9]">
                     Welcome to <br />
                     <span className="pd-gradient-text italic">Your Legacy!</span>
                  </h2>
                  <p className="text-sm md:text-base font-medium text-slate-500 leading-relaxed mb-12 italic max-w-sm mx-auto">
                     Your venue storefront is <span className="text-slate-900 font-black">90% ready</span>. Just a few finishing touches to start reaching over <span className="pd-gradient-text font-black">2,500+ local seekers</span> monthly.
                  </p>

                  <div className="grid grid-cols-1 gap-4 mb-12">
                     {[
                        { label: 'Polish Your Story', sub: 'Venue description & amenities', icon: <Building2 className="text-pd-pink" size={18} /> },
                        { label: 'Curate Your Gallery', sub: 'High-definition venue photos', icon: <ImageIcon className="text-blue-500" size={18} /> },
                        { label: 'Set Your Prestige', sub: 'Dynamic pricing for all events', icon: <IndianRupee className="text-emerald-500" size={18} /> }
                     ].map((item, idx) => (
                        <motion.div 
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + idx * 0.1 }}
                          className="flex items-center gap-5 p-4 bg-slate-50/50 rounded-[30px] border border-slate-100 hover:border-pd-pink/20 transition-all text-left group cursor-pointer"
                        >
                           <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center group-hover:bg-pd-pink group-hover:text-white transition-all">
                              {item.icon}
                           </div>
                           <div className="flex-1">
                              <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-900 leading-none mb-1 group-hover:text-pd-pink transition-colors">{item.label}</h4>
                              <p className="text-[10px] font-bold text-slate-400 italic">{item.sub}</p>
                           </div>
                           <ChevronRight size={16} className="text-slate-300 group-hover:text-pd-pink group-hover:translate-x-1 transition-all" />
                        </motion.div>
                     ))}
                  </div>

                  <div className="flex flex-col gap-4">
                     <Link href="/dashboard/onboarding/profile" onClick={completeOnboarding} className="w-full">
                        <button className="pd-btn-primary w-full py-6 rounded-[24px] text-xs font-black uppercase tracking-[0.25em] italic shadow-2xl shadow-pd-pink/30 hover:scale-[1.02] active:scale-95 transition-all">
                           Ignite My Storefront
                        </button>
                     </Link>

                     <button 
                        onClick={completeOnboarding}
                        className="py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-900 transition-all font-pd italic"
                     >
                        I&apos;ll perfect it later
                     </button>
                  </div>
               </div>

               {/* Advanced Progress Bar */}
               <div className="h-2 w-full bg-slate-50 flex overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '35%' }}
                    transition={{ duration: 2, ease: "circOut" }}
                    className="h-full bg-pd-pink shadow-[0_0_15px_rgba(255,93,164,0.5)]"
                   />
                  <div className="h-full w-full bg-slate-100/50"></div>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
         {isAdvancedFilterOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[100] bg-slate-900/40 flex items-center justify-center p-4 md:p-10"
              style={{ willChange: 'opacity' }}
            >
               <motion.div 
                 initial={{ scale: 0.98, opacity: 0 }}
                 animate={{ scale: 1, opacity: 1 }}
                 exit={{ scale: 0.98, opacity: 0 }}
                 transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                 className="bg-white w-full max-w-7xl h-full lg:h-[85vh] rounded-[40px] shadow-2xl overflow-hidden flex flex-col relative z-20"
                 style={{ willChange: 'transform, opacity' }}
               >
                  {/* Header */}
                  <header className="px-10 py-8 border-b border-slate-100 flex items-center justify-between shrink-0">
                     <div className="flex items-center gap-6">
                        <div className="w-12 h-12 rounded-2xl bg-pd-pink flex items-center justify-center text-white shadow-lg shadow-pd-pink/20">
                           <Zap size={24} />
                        </div>
                        <div>
                           <h2 className="text-2xl font-black italic uppercase tracking-tight text-slate-900 leading-none mb-1">Lead <span className="text-pd-pink">Explorer</span></h2>
                           <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">High-Performance Lead Management Architecture</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center gap-2 bg-slate-50 px-4 py-2.5 rounded-2xl border border-slate-100 shadow-inner">
                           <Search size={14} className="text-slate-400" />
                           <input 
                             type="text" 
                             placeholder="Search by name, event..." 
                             value={searchTerm}
                             onChange={(e) => setSearchTerm(e.target.value)}
                             className="bg-transparent border-none outline-none text-[11px] font-bold text-slate-900 w-48 italic"
                           />
                        </div>
                        <button 
                          onClick={() => setIsAdvancedFilterOpen(false)}
                          className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-xl shadow-slate-900/20 hover:bg-pd-pink transition-all"
                        >
                           <X size={20} />
                        </button>
                     </div>
                  </header>

                  <div className="flex-1 flex overflow-hidden">
                     {/* SIDEBAR FILTERS - Light and optimized */}
                     <aside className="w-80 border-r border-slate-100 p-8 space-y-10 overflow-y-auto hidden lg:block shrink-0 scrollbar-hide">
                        <div>
                           <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-900 mb-6 font-pd">Status Categorization</h4>
                           <div className="space-y-2">
                              {['All', 'New', 'In-Progress', 'Booked', 'Archived'].map(status => (
                                 <button 
                                   key={status}
                                   onClick={() => setLeadFilter(status)}
                                   className={`w-full flex items-center justify-between px-5 py-3 rounded-xl text-[11px] font-black uppercase italic transition-all ${leadFilter === status ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}
                                 >
                                    {status}
                                    <span className="text-[9px] opacity-40">({recentLeads.filter(l => status === 'All' || l.status === status).length})</span>
                                 </button>
                              ))}
                           </div>
                        </div>

                        <div>
                           <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-900 mb-6 font-pd">Event Morphology</h4>
                           <div className="grid grid-cols-1 gap-2">
                              {['Wedding', 'Corporate', 'Birthday', 'Engagement'].map(evt => (
                                 <label key={evt} className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-slate-50 cursor-pointer group transition-all">
                                    <input 
                                      type="checkbox" 
                                      checked={selectedEventTypes.includes(evt)}
                                      onChange={(e) => {
                                         if (e.target.checked) setSelectedEventTypes([...selectedEventTypes, evt]);
                                         else setSelectedEventTypes(selectedEventTypes.filter(t => t !== evt));
                                      }}
                                      className="w-4 h-4 rounded border-slate-200 text-pd-pink focus:ring-pd-pink" 
                                    />
                                    <span className="text-[11px] font-black uppercase italic text-slate-500 group-hover:text-slate-900">{evt}</span>
                                 </label>
                              ))}
                           </div>
                        </div>

                        <div>
                           <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-900 mb-6 flex justify-between font-pd">
                              Guest Magnitude 
                              <span className="text-pd-pink font-pd">{guestRange.max}+</span>
                           </h4>
                           <input 
                             type="range" 
                             min="0" 
                             max="2000" 
                             step="50"
                             value={guestRange.max}
                             onChange={(e) => setGuestRange({ ...guestRange, max: parseInt(e.target.value) })}
                             className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-pd-pink"
                           />
                           <div className="flex justify-between mt-2 text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none font-pd">
                              <span>0 Pax</span>
                              <span>2k+ Pax</span>
                           </div>
                        </div>

                        <button 
                          onClick={() => { setSearchTerm(''); setLeadFilter('All'); setSelectedEventTypes([]); setGuestRange({ min: 0, max: 2000 }); }}
                          className="w-full py-4 border border-dashed border-slate-200 rounded-2xl text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-pd-pink hover:border-pd-pink transition-all font-pd"
                        >
                           Reset Intelligence
                        </button>
                     </aside>

                     {/* LEAD LIST - Optimized with hardware acceleration */}
                     <main 
                        className="flex-1 overflow-y-auto p-8 bg-slate-50/30 scroll-smooth" 
                        style={{ WebkitOverflowScrolling: 'touch' }}
                     >
                        <div className="grid grid-cols-1 gap-5 pb-20 max-w-5xl mx-auto">
                           {filteredAdvancedLeads.map((lead) => (
                              <motion.div 
                                key={lead.id} 
                                layout
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.15 }}
                                className="bg-white p-5 rounded-[30px] border border-white shadow-sm hover:shadow-pd-soft hover:border-blue-100 transition-all flex items-center justify-between group cursor-pointer"
                                style={{ transform: 'translateZ(0)' }}
                              >
                                 <div className="flex items-center gap-6 text-left">
                                    <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500 shadow-inner group-hover:scale-110 transition-transform duration-500">
                                       <User size={24} />
                                    </div>
                                    <div>
                                       <div className="flex items-center gap-2 mb-1">
                                          <h4 className="text-base font-black italic text-slate-900 uppercase tracking-tight leading-none">{lead.name}</h4>
                                          {lead.unread && <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>}
                                       </div>
                                       <div className="flex items-center gap-3">
                                          <span className="text-[9px] font-black uppercase text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">{lead.location}</span>
                                          <span className="text-[9px] font-black uppercase text-pd-pink italic">{lead.event}</span>
                                          <span className="text-[9px] font-bold text-slate-300 italic">{lead.date} • {lead.time}</span>
                                       </div>
                                    </div>
                                 </div>

                                 <div className="flex items-center gap-10">
                                    <div className="flex flex-col items-center">
                                       <span className="text-[8px] font-black uppercase text-slate-300">Guests</span>
                                       <span className="text-sm font-black italic text-slate-900 leading-none">{lead.guests}</span>
                                    </div>
                                    <div className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                                       lead.status === 'Booked' ? 'bg-emerald-50 text-emerald-600' : 
                                       lead.status === 'New' ? 'bg-blue-50 text-blue-600 animate-pulse' : 'bg-amber-50 text-amber-600'
                                    }`}>
                                       {lead.status}
                                    </div>
                                    <div className="flex items-center gap-2 pr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                       <button className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-lg hover:bg-pd-pink transition-colors">
                                          <ChevronRight size={18} />
                                       </button>
                                    </div>
                                 </div>
                              </motion.div>
                           ))}
                           
                           {filteredAdvancedLeads.length === 0 && (
                             <div className="py-32 flex flex-col items-center justify-center text-center opacity-40">
                                <Search size={48} className="text-slate-200 mb-6" />
                                <p className="text-[11px] font-black uppercase italic tracking-widest">No matching inquiries found</p>
                             </div>
                           )}
                        </div>
                     </main>
                  </div>
               </motion.div>
            </motion.div>
         )}
      </AnimatePresence>

      {/* REVIEW REPLY MODAL */}
      <AnimatePresence>
        {replyTarget && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
             {/* Backdrop */}
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setReplyTarget(null)}
               className="absolute inset-0 bg-slate-900/40"
             />
             
             {/* Content Modal */}
             <motion.div 
                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: 10 }}
                transition={{ type: "spring", stiffness: 400, damping: 40 }}
                className="bg-white w-full max-w-xl rounded-[40px] md:rounded-[50px] shadow-xl overflow-hidden relative z-10"
                style={{ willChange: 'transform, opacity' }}
             >
                <div className="p-8 md:p-12">
                   <div className="flex items-center justify-between mb-8 md:mb-10">
                      <div>
                         <span className="text-[10px] font-black uppercase tracking-[0.3em] text-pd-pink mb-2 block">Vendor Portal</span>
                         <h3 className="text-2xl md:text-3xl font-black italic uppercase text-slate-900 leading-none">Review Response</h3>
                      </div>
                      <button 
                        onClick={() => setReplyTarget(null)} 
                        className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white transition-all border border-slate-100"
                      >
                         <X size={20} />
                      </button>
                   </div>

                   <div className="bg-slate-50/50 p-6 md:p-8 rounded-[30px] md:rounded-[40px] mb-8 md:mb-10 border border-slate-100 relative overflow-hidden group">
                      <div className="flex items-center gap-4 mb-4 relative z-10 font-pd">
                         <div className="w-8 h-8 md:w-10 md:h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center text-slate-300">
                           <User size={18} />
                         </div>
                         <span className="text-sm font-black italic text-slate-900 uppercase">{replyTarget.name}</span>
                      </div>
                      <p className="text-[11px] md:text-xs text-slate-500 italic font-medium leading-relaxed relative z-10">&ldquo;{replyTarget.text}&rdquo;</p>
                      <div className="absolute top-0 right-0 w-24 h-24 bg-slate-100/30 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
                   </div>

                   <div className="space-y-4">
                      <div className="flex items-center justify-between px-1">
                         <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Response Draft</label>
                         <div className="flex items-center gap-1.5">
                           <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                           <span className="text-[9px] font-black uppercase text-emerald-500 italic">Auto-Saving</span>
                         </div>
                      </div>
                      <textarea 
                         placeholder="Acknowledge their feedback..."
                         className="w-full bg-slate-50 border-2 border-transparent focus:border-pd-pink rounded-[30px] md:rounded-[35px] p-6 md:p-8 min-h-[160px] md:min-h-[180px] text-sm font-medium italic outline-none transition-all placeholder:text-slate-300 shadow-inner"
                      />
                   </div>

                   <div className="flex gap-4 mt-10 md:mt-12">
                      <button onClick={() => setReplyTarget(null)} className="flex-1 py-4 md:py-5 text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all">Cancel</button>
                      <button onClick={() => setReplyTarget(null)} className="flex-1 pd-btn-primary py-4 md:py-5 rounded-2xl uppercase text-[11px] font-black italic shadow-xl shadow-pd-pink/20">Submit Reply</button>
                   </div>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL LAYER (Isolated for performance) */}
      <AnimatePresence>
        {isBookingModalOpen && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
             {/* High Performance Backdrop */}
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               transition={{ duration: 0.15 }}
               onClick={() => setIsBookingModalOpen(false)}
               className="absolute inset-0 bg-slate-900/60" 
             />
             
             {/* Optimized Modal Window */}
             <motion.div 
               initial={{ scale: 0.98, opacity: 0, y: 10 }}
               animate={{ scale: 1, opacity: 1, y: 0 }}
               exit={{ scale: 0.98, opacity: 0, y: 10 }}
               transition={{ type: 'spring', stiffness: 450, damping: 35 }}
               style={{ willChange: 'transform, opacity' }}
               className="relative bg-white w-full max-w-lg rounded-[45px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.4)] overflow-hidden"
             >
                 <div className="bg-[#0F172A] p-10 md:p-12 text-white relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-pd-pink/10 rounded-full blur-3xl -mr-10 -mt-10" />
                    <div className="relative z-10">
                       <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-pd-pink mb-4">Venue Management</h4>
                       <h3 className="text-3xl font-black italic tracking-tighter uppercase leading-none mb-1">Schedule <span className="text-pd-pink">Availability</span></h3>
                       <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest opacity-60 italic">
                          Target Date: {newBookingDay} {currentMonth} 2026
                       </p>
                    </div>
                 </div>
                 
                 <div className="p-10 md:p-12 space-y-8">
                    <div className="space-y-3">
                       <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Account / Client Name</label>
                       <input type="text" placeholder="e.g., Rohan Verma (Wedding Group)" className="w-full bg-slate-50 border-2 border-transparent focus:border-pd-pink/10 rounded-2xl px-6 py-5 text-sm font-bold text-slate-900 outline-none transition-all" />
                    </div>
                    <div className="grid grid-cols-2 gap-5">
                      <div className="space-y-3">
                         <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Event Logic</label>
                         <select className="w-full bg-slate-50 border-2 border-transparent focus:border-pd-pink/10 rounded-2xl px-6 py-5 text-sm font-bold text-slate-900 outline-none appearance-none cursor-pointer">
                            <option>High Scale Wedding</option>
                            <option>Corporate Summit</option>
                            <option>Intimate Social</option>
                         </select>
                      </div>
                      <div className="space-y-3">
                         <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Expected Pax</label>
                         <input type="number" placeholder="450" className="w-full bg-slate-50 border-2 border-transparent focus:border-pd-pink/10 rounded-2xl px-6 py-5 text-sm font-bold text-slate-900 outline-none" />
                      </div>
                    </div>
                    <div className="flex gap-4 pt-4">
                       <button onClick={() => setIsBookingModalOpen(false)} className="flex-1 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all">Discard</button>
                       <button 
                          onClick={() => {
                             setCalendarEvents([...calendarEvents, { day: newBookingDay!, type: 'Confirmed Slot', host: 'Manual Lock', pax: 500, time: '10:00 AM - 10:00 PM', status: 'Confirmed' }]);
                             setIsBookingModalOpen(false);
                          }}
                          className="flex-[2] py-5 bg-[#0F172A] text-white text-[11px] font-black uppercase tracking-widest rounded-2xl hover:bg-pd-pink transition-all shadow-xl shadow-slate-900/10"
                       >
                          Secure Venue Slot
                       </button>
                    </div>
                 </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

    <style jsx global>{`
      @media print {
        /* Reset layout for print */
        html, body {
          height: auto !important;
          overflow: visible !important;
          background: white !important;
        }

        .no-print {
          display: none !important;
        }

        /* Essential to allow overflow through restrictive parents */
        .min-h-screen, .printable-main, .printable-container {
          height: auto !important;
          max-height: none !important;
          overflow: visible !important;
          position: relative !important;
          display: block !important;
        }

        .print-only {
          display: block !important;
          visibility: visible !important;
          width: 100% !important;
          border: none !important;
          box-shadow: none !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          min-height: auto !important;
          margin: 0 !important;
          padding: 2.5cm !important; /* Proper margin according to A4 size */
          page-break-after: always;
        }

        .print-only * {
          visibility: visible !important;
        }
        
        /* High contrast for printing */
        .text-slate-400, .text-slate-500, .text-slate-600 {
          color: #333 !important;
        }
      }
    `}</style>
    </div>
  );
}

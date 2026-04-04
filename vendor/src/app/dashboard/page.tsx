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
  ChevronDown,
  Trello,
  LayoutList,
  Target,
  XCircle,
  Shield,
  CreditCard,
  Globe,
  Smartphone,
  Key,
  Database,
  Coffee,
  Utensils,
  Music,
  Wind,
  Wifi,
  Car
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import OnboardingPopup from '@/vendor/components/OnboardingPopup';
import DashboardOverview from '@/vendor/components/dashboard/DashboardOverview';
import LeadInbox from '@/vendor/components/dashboard/LeadInbox';
import LeadPipeline from '@/vendor/components/dashboard/LeadPipeline';
import ReviewManager from '@/vendor/components/dashboard/ReviewManager';
import QuotationManager from '@/vendor/components/dashboard/QuotationManager';
import FinanceHub from '@/vendor/components/dashboard/FinanceHub';
import AnalyticsCenter from '@/vendor/components/dashboard/AnalyticsCenter';
import QuickSupport from '@/vendor/components/dashboard/QuickSupport';
import SystemHistory from '@/vendor/components/dashboard/SystemHistory';
import DashboardSettings from '@/vendor/components/dashboard/DashboardSettings';
import VenueCalendar from '@/vendor/components/dashboard/VenueCalendar';
import LeadExplorer from '@/vendor/components/dashboard/LeadExplorer';

import logo from '../logo.jpg';

const tabs = [
  { id: 'overview', label: 'Overview', icon: <BarChart3 size={18} /> },
  { id: 'leads', label: 'Leads', icon: <Zap size={18} /> },
  { id: 'pipeline', label: 'Pipeline', icon: <Target size={18} /> },
  { id: 'reviews', label: 'Reviews', icon: <MessageSquareQuote size={18} /> },
  { id: 'quotation', label: 'Quotation', icon: <Calculator size={18} /> },
];

const secondaryTabs = [
  { id: 'support', label: 'Support', icon: <HelpCircle size={18} /> },
  { id: 'settings', label: 'Settings', icon: <Settings size={18} /> },
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
  const [settingsSection, setSettingsSection] = useState('profile');
  const [leadFilter, setLeadFilter] = useState('All');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [venueProfile, setVenueProfile] = useState<any>(null);
  const [recentLeads, setRecentLeads] = useState<any[]>([]);
  const [isLoadingLeads, setIsLoadingLeads] = useState(true);

  // Helper to format date consistent with dashboard design
  const formatLeadDate = (isoDate: string) => {
    const d = new Date(isoDate);
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const formatLeadTime = (isoDate: string) => {
    const d = new Date(isoDate);
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  };


  // Calculate Realtime Stats
  const stats = useMemo(() => {
    // 1. Active Leads calculation (All leads not closed/cancelled)
    const activeLeadsCount = recentLeads.filter(l => 
      ['New', 'In-Progress', 'Contacted', 'Followups', 'Quoted'].includes(l.status)
    ).length;

    // 2. Profile Views (Fall back to a realistic base if missing)
    const views = venueProfile?.views || 1240;

    // 3. Average Rating
    const rating = venueProfile?.rating || 4.8;

    // 4. Total Sales calculation (Booked leads * Estimated Revenue)
    const bookedLeads = recentLeads.filter(l => l.status === 'Booked');
    const avgPlatePrice = ((venueProfile?.perPlateVeg || 800) + (venueProfile?.perPlateNonVeg || 1200)) / 2;
    
    const estimatedTotalSales = bookedLeads.reduce((acc, lead) => {
       const pax = parseInt(lead.guests) || 200;
       return acc + (pax * avgPlatePrice);
    }, 0);

    // Format sales for display
    const formatSales = (amt: number) => {
       if (amt >= 100000) return `₹${(amt / 100000).toFixed(1)}L`;
       if (amt >= 1000) return `₹${(amt / 1000).toFixed(1)}K`;
       return `₹${amt}`;
    };

    return [
      { 
        label: 'Active Leads', 
        value: activeLeadsCount.toString(), 
        icon: <Zap size={20} />, 
        color: 'bg-emerald-50 text-emerald-600', 
        trend: activeLeadsCount > 0 ? '+100%' : '0%', 
        isUp: activeLeadsCount > 0 
      },
      { 
        label: 'Profile Views', 
        value: views.toLocaleString(), 
        icon: <BarChart3 size={20} />, 
        color: 'bg-blue-50 text-blue-600', 
        trend: '+2.4%', 
        isUp: true 
      },
      { 
        label: 'Average Rating', 
        value: rating.toFixed(1), 
        icon: <Star size={20} />, 
        color: 'bg-amber-50 text-amber-600', 
        trend: '0.0%', 
        isUp: true 
      },
      { 
        label: 'Total Sales', 
        value: estimatedTotalSales > 0 ? formatSales(estimatedTotalSales) : '₹0', 
        icon: <IndianRupee size={20} />, 
        color: 'bg-pink-50 text-pink-600', 
        trend: estimatedTotalSales > 0 ? '+5.2%' : '0%', 
        isUp: estimatedTotalSales > 0 
      },
    ];
  }, [recentLeads, venueProfile]);

  const handleLogout = async () => {
    try {
      await fetch('http://127.0.0.1:5005/api/auth/logout', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        mode: 'cors'
      });
    } catch (err) {
      console.warn('Backend logout call failed:', err);
    } finally {
      try {
        const { account } = await import('@/lib/appwrite');
        await account.deleteSession('current');
      } catch (err) { }
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
  const [guestRange, setGuestRange] = useState({ min: 0, max: 10000 });
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
    }).reverse(); // Keep chronological order if needed, or rely on backend
  }, [searchTerm, leadFilter, selectedEventTypes, guestRange, recentLeads]);

  const subtotal = quoteData.lineItems.reduce((acc, item) => acc + item.amount, 0);
  const gstAmount = (subtotal * quoteData.gstRate) / 100;
  const totalWithTax = subtotal + gstAmount;

  const [isFinalizing, setIsFinalizing] = useState(false);
  const [qtnSuccess, setQtnSuccess] = useState(false);
  const [leadView, setLeadView] = useState<'list' | 'pipeline'>('list');

  const PIPELINE_STAGES = [
    { id: 'New', color: 'bg-blue-500', text: 'text-blue-600', icon: <Zap size={14} /> },
    { id: 'In-Progress', color: 'bg-indigo-500', text: 'text-indigo-600', icon: <MessageCircle size={14} /> },
    { id: 'Contacted', color: 'bg-purple-500', text: 'text-purple-600', icon: <Phone size={14} /> },
    { id: 'Followups', color: 'bg-amber-500', text: 'text-amber-600', icon: <CalendarDays size={14} /> },
    { id: 'Quoted', color: 'bg-pink-500', text: 'text-pink-600', icon: <IndianRupee size={14} /> },
    { id: 'Booked', color: 'bg-emerald-500', text: 'text-emerald-600', icon: <CheckCircle2 size={14} /> },
    { id: 'Lost', color: 'bg-red-500', text: 'text-red-600', icon: <XCircle size={14} /> }
  ];

  const updateLeadStatus = async (leadId: string, newStatus: string) => {
    try {
      const { databases, DATABASE_ID, LEADS_COLLECTION_ID } = await import('@/lib/appwrite');
      await databases.updateDocument(DATABASE_ID, LEADS_COLLECTION_ID, leadId, {
        status: newStatus
      });
      // Local state will be updated by Realtime subscription!
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const handleAmenityToggle = (amenityId: string) => {
    setVenueProfile((prev: any) => {
       let current = [];
       try {
          current = typeof prev?.amenities === 'string' ? JSON.parse(prev.amenities) : (Array.isArray(prev?.amenities) ? prev.amenities : []);
       } catch (e) { current = []; }
       const updated = current.includes(amenityId) ? current.filter((a: any) => a !== amenityId) : [...current, amenityId];
       return { ...prev, amenities: JSON.stringify(updated) };
    });
  };

  const handleProfileUpdate = (field: string, value: any) => {
    setVenueProfile((prev: any) => ({ ...prev, [field]: value }));
  };

  const saveProfileSettings = async () => {
    if (!venueProfile?.$id) return;
    setIsUpdatingProfile(true);
    try {
      const { databases, DATABASE_ID, VENUES_COLLECTION_ID } = await import('@/lib/appwrite');
      await databases.updateDocument(DATABASE_ID, VENUES_COLLECTION_ID, venueProfile.$id, {
        venueName: venueProfile.venueName,
        capacity: venueProfile.capacity,
        perPlateVeg: venueProfile.perPlateVeg,
        perPlateNonVeg: venueProfile.perPlateNonVeg,
        amenities: venueProfile.amenities
      });
      alert('Profile successfully synchronized with the portal.');
    } catch (err) {
      console.error('Sync error:', err);
    } finally {
      setIsUpdatingProfile(false);
    }
  };

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
    let isMounted = true;

    const setupAuthAndRealtime = async () => {
      try {
        const { client, account, databases, DATABASE_ID, VENUES_COLLECTION_ID, LEADS_COLLECTION_ID } = await import('@/lib/appwrite');
        const { Query } = await import('appwrite');
        
        // 1. Live Auth Check
        const user = await account.get().catch(() => null);
        if (!isMounted) return;

        if (!user) {
          router.push('/login');
          return;
        }
        
        localStorage.setItem('user', JSON.stringify(user));
        setIsAuthorized(true);

        const mapLeadToDashboard = (doc: any) => ({
          id: doc.$id,
          name: doc.name,
          phone: doc.phone || '+91 98765 43210',
          event: doc.eventType,
          guests: doc.guests ? doc.guests.toString() : '0',
          date: formatLeadDate(doc.createdAt),
          time: formatLeadTime(doc.createdAt),
          status: doc.status || 'New',
          location: 'Haldwani', // Default for now
          title: 'Direct Inquiry',
          starred: false,
          unread: doc.status === 'New',
          color: doc.status === 'Booked' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
        });

        const fetchLeads = async (venueId: string) => {
          setIsLoadingLeads(true);
          try {
            const result = await databases.listDocuments(
              DATABASE_ID,
              LEADS_COLLECTION_ID,
              [Query.equal('venueId', venueId), Query.orderDesc('createdAt')]
            );
            if (isMounted) {
              setRecentLeads(result.documents.map(mapLeadToDashboard));
            }
          } catch (error) {
            console.error('Error fetching leads:', error);
          } finally {
            if (isMounted) setIsLoadingLeads(false);
          }
        };

        // 2. Data Fetching & Sync Setup
        const venuesSub = client.subscribe(
          `databases.${DATABASE_ID}.collections.${VENUES_COLLECTION_ID}.documents`,
          (response) => {
            if (!isMounted) return;
            const doc = response.payload as any;
            if (doc.userId === user.$id) {
              if (response.events.some(e => e.includes('update') || e.includes('create'))) {
                setVenueProfile(doc);
                setShowOnboarding(!doc.onboardingComplete);
              }
            }
          }
        );

        // Define a way to track the active venue ID for the realtime leads enclosure
        let activeVenueId: string | null = null;

        const result = await databases.listDocuments(
          DATABASE_ID,
          VENUES_COLLECTION_ID,
          [Query.equal('userId', user.$id)]
        );
        
        if (!isMounted) return;

        if (result.documents.length > 0) {
          const profile = result.documents[0];
          activeVenueId = profile.$id;
          setVenueProfile(profile);
          const isFreshSignup = localStorage.getItem('fresh_signup') === 'true';
          const alreadyDismissed = localStorage.getItem('onboardingComplete') === 'true';
          
          if (isFreshSignup || (!profile.onboardingComplete && !alreadyDismissed)) {
            setShowOnboarding(true);
            localStorage.removeItem('fresh_signup');
          }
          fetchLeads(profile.$id);
        } else {
          setShowOnboarding(true);
          setIsLoadingLeads(false);
        }

        const leadsSub = client.subscribe(
          `databases.${DATABASE_ID}.collections.${LEADS_COLLECTION_ID}.documents`,
          (response) => {
            if (!isMounted) return;
            const lead = response.payload as any;
            // Only update if it belongs to current venue
            if (activeVenueId && lead.venueId === activeVenueId) {
              if (response.events.some(e => e.includes('create'))) {
                setRecentLeads(prev => [mapLeadToDashboard(lead), ...prev]);
              } else if (response.events.some(e => e.includes('update'))) {
                setRecentLeads(prev => prev.map(l => l.id === lead.$id ? mapLeadToDashboard(lead) : l));
              } else if (response.events.some(e => e.includes('delete'))) {
                setRecentLeads(prev => prev.filter(l => l.id !== lead.$id));
              }
            }
          }
        );

        unsubscribe = () => {
          venuesSub();
          leadsSub();
        };

      } catch (err) {
        if (isMounted) {
          console.error('Project synchronization failed:', err);
          router.push('/login');
        }
      }
    };

    setupAuthAndRealtime();

    return () => {
      isMounted = false;
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

  const completeOnboarding = async () => {
    localStorage.setItem('onboardingComplete', 'true');
    setShowOnboarding(false);
    
    // Sync with database if profile exists
    if (venueProfile?.$id) {
       try {
          const { databases, DATABASE_ID, VENUES_COLLECTION_ID } = await import('@/lib/appwrite');
          await databases.updateDocument(DATABASE_ID, VENUES_COLLECTION_ID, venueProfile.$id, {
            onboardingComplete: true
          });
       } catch (err) {
          console.error('Failed to sync onboarding status:', err);
       }
    }
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

             {showOnboarding && (
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
             )}

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
                     <p className="text-[13px] font-black text-slate-900 italic tracking-tighter uppercase whitespace-nowrap leading-none mb-1">{venueProfile?.venueName || "Grand Imperial"}</p>
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
              <DashboardOverview 
                venueProfile={venueProfile}
                recentLeads={recentLeads}
                setActiveTab={setActiveTab}
                stats={stats}
              />
            )}

            {activeTab === 'leads' && (
              <LeadInbox 
                filteredAdvancedLeads={filteredAdvancedLeads}
                leadFilter={leadFilter}
                setLeadFilter={setLeadFilter}
                updateLeadStatus={updateLeadStatus}
                setActiveTab={setActiveTab}
                setQuoteData={setQuoteData}
              />
            )}

            {activeTab === 'pipeline' && (
              <LeadPipeline 
                recentLeads={recentLeads}
                pipelineStages={PIPELINE_STAGES}
                updateLeadStatus={updateLeadStatus}
                setLeadView={setLeadView}
              />
            )}
            {activeTab === 'calendar' && (
              <VenueCalendar 
                currentMonth={currentMonth}
                setCurrentMonth={setCurrentMonth}
                calendarView={calendarView}
                setCalendarView={setCalendarView}
                selectedDay={selectedDay}
                setSelectedDay={setSelectedDay}
                calendarEvents={calendarEvents}
                setIsBookingModalOpen={setIsBookingModalOpen}
                setNewBookingDay={setNewBookingDay}
              />
            )}

            {activeTab === 'reviews' && (
              <ReviewManager 
                replyTarget={replyTarget}
                setReplyTarget={setReplyTarget}
              />
            )}

            {activeTab === 'finance' && (
              <FinanceHub setActiveTab={setActiveTab} />
            )}

            {activeTab === 'analytics' && (
              <AnalyticsCenter />
            )}

            {activeTab === 'support' && (
              <QuickSupport />
            )}

            {activeTab === 'settings' && (
              <DashboardSettings 
                settingsSection={settingsSection}
                setSettingsSection={setSettingsSection}
                venueProfile={venueProfile}
                handleProfileUpdate={handleProfileUpdate}
                handleAmenityToggle={handleAmenityToggle}
                saveProfileSettings={saveProfileSettings}
                isUpdatingProfile={isUpdatingProfile}
              />
            )}

            {activeTab === 'history' && (
              <SystemHistory 
                pastActivities={pastActivities}
              />
            )}

            {activeTab === 'quotation' && (
              <QuotationManager 
                setActiveTab={setActiveTab}
                handleFinalize={handleFinalize}
                isFinalizing={isFinalizing}
                qtnSuccess={qtnSuccess}
                quoteData={quoteData}
                setQuoteData={setQuoteData}
                subtotal={subtotal}
                gstAmount={gstAmount}
                totalWithTax={totalWithTax}
                handleDownload={handleDownload}
                handleSend={handleSend}
                logo={logo}
              />
            )}
          </div>

      </main>

      {/* Optimized Onboarding Popup */}
      <OnboardingPopup 
        isOpen={showOnboarding} 
        onClose={completeOnboarding} 
      />

      <LeadExplorer 
        isOpen={isAdvancedFilterOpen}
        onClose={() => setIsAdvancedFilterOpen(false)}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        leadFilter={leadFilter}
        setLeadFilter={setLeadFilter}
        recentLeads={recentLeads}
        selectedEventTypes={selectedEventTypes}
        setSelectedEventTypes={setSelectedEventTypes}
        guestRange={guestRange}
        setGuestRange={setGuestRange}
        filteredLeads={filteredAdvancedLeads}
      />

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

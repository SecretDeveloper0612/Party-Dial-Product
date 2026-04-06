'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
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
import NotificationDropdown from '@/vendor/components/dashboard/NotificationDropdown';

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
  const [isMobile, setIsMobile] = useState(false);
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
    const rating = venueProfile?.rating || 0.0;

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
  const [formattedDate, setFormattedDate] = useState('');
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    const updateDate = () => {
      setFormattedDate(new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' }));
    };
    updateDate();
    const interval = setInterval(updateDate, 1000 * 60 * 60); // Check every hour if day changed
    return () => clearInterval(interval);
  }, []);
  
  // Mobile responsiveness effect
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) setSidebarOpen(false);
      else setSidebarOpen(true);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  const [isAdvancedFilterOpen, setIsAdvancedFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEventTypes, setSelectedEventTypes] = useState<string[]>([]);
  const [guestRange, setGuestRange] = useState({ min: 0, max: 10000 });
  const [calendarView, setCalendarView] = useState('Monthly');
  
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [lastClearedTime, setLastClearedTime] = useState(Date.now());
  const unreadLeadsCount = recentLeads.filter(l => l.unread && new Date(l.rawDate).getTime() > lastClearedTime).length;

  useEffect(() => {
    if (activeTab === 'leads' || activeTab === 'pipeline') {
      setLastClearedTime(Date.now());
    }
  }, [activeTab]);
  
  const [quoteData, setQuoteData] = useState({
    client: 'Aditya Raj',
    contact: '9876543210',
    email: 'client@mail.com',
    event: 'Wedding Ceremony',
    eventDate: new Date().toISOString().split('T')[0],
    guestCount: '500',
    specialRequests: 'Need premium floral decoration and valet parking.',
    gstRate: 18,
    discountType: 'percentage' as 'percentage' | 'fixed',
    discountValue: 0,
    extraCharges: 0,
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
    }).sort((a, b) => new Date(b.rawDate).getTime() - new Date(a.rawDate).getTime());
  }, [searchTerm, leadFilter, selectedEventTypes, guestRange, recentLeads]);

  // Derived calculations moved to component for complex logic
  const subtotal = 0;
  const gstAmount = 0;
  const totalWithTax = 0;

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

  const handleEventTypeToggle = (eventTypeId: string) => {
    setVenueProfile((prev: any) => {
       let current = [];
       try {
          current = typeof prev?.eventTypes === 'string' ? JSON.parse(prev.eventTypes) : (Array.isArray(prev?.eventTypes) ? prev.eventTypes : []);
       } catch (e) { current = []; }
       const updated = current.includes(eventTypeId) ? current.filter((a: any) => a !== eventTypeId) : [...current, eventTypeId];
       return { ...prev, eventTypes: JSON.stringify(updated) };
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
        capacity: parseInt(String(venueProfile.capacity || '0')), 
        perPlateVeg: String(venueProfile.perPlateVeg || '0'),
        perPlateNonVeg: String(venueProfile.perPlateNonVeg || '0'),
        amenities: venueProfile.amenities,
        eventTypes: venueProfile.eventTypes
      });
      showToast('Profile successfully synchronized with the portal.', 'success');
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
     showToast(`Quotation successfully dispatched to ${quoteData.client}`, 'success');
  };

  // Connection Status Monitor
  useEffect(() => {
    const handleOnline = () => {
      showToast('Internet connection restored.', 'success');
      // Re-trigger connection attempt
      setConnectionVersion(v => v + 1);
    };
    const handleOffline = () => {
      showToast('You are currently offline. Realtime updates suspended.', 'error');
      setIsRealtimeConnected(false);
    };
 
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
 
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const [isRealtimeConnected, setIsRealtimeConnected] = useState(true);
  const [connectionVersion, setConnectionVersion] = useState(0);

  // Initialization & Realtime Sync
  useEffect(() => {
    let isMounted = true;
    
    const initializeDashboard = async () => {
      try {
        const { account, databases, DATABASE_ID, VENUES_COLLECTION_ID, LEADS_COLLECTION_ID, Query } = await import('@/lib/appwrite');
        
        // 1. Auth Check
        const user = await account.get().catch(() => null);
        if (!isMounted) return;
        if (!user) { router.push('/login'); return; }
        setIsAuthorized(true);

        // 2. Fetch Profile
        const result = await databases.listDocuments(DATABASE_ID, VENUES_COLLECTION_ID, [Query.equal('userId', user.$id)]);
        if (!isMounted) return;

        if (result.documents.length > 0) {
          const profile = result.documents[0];
          setVenueProfile(profile);
          
          setIsLoadingLeads(true);
          const leadsResult = await databases.listDocuments(DATABASE_ID, LEADS_COLLECTION_ID, [
            Query.or([
              Query.equal('venueId', profile.$id),
              Query.equal('venueId', 'BROADCAST')
            ]),
            Query.orderDesc('createdAt')
          ]);
          if (isMounted) {
            setRecentLeads(leadsResult.documents.map(doc => ({
              id: doc.$id,
              name: doc.name,
              phone: doc.phone || '+91 98765 43210',
              event: doc.eventType,
              guests: doc.guests ? doc.guests.toString() : '0',
              date: formatLeadDate(doc.createdAt),
              time: formatLeadTime(doc.createdAt),
              rawDate: doc.createdAt,
              status: doc.status || 'New',
              location: 'Haldwani',
              title: 'Direct Inquiry',
              starred: false,
              unread: doc.status === 'New',
              color: doc.status === 'Booked' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
            })));
            setIsLoadingLeads(false);
          }

          // Handle Onboarding
          const alreadyDismissed = localStorage.getItem('onboardingComplete') === 'true';
          if (!profile.onboardingComplete && !alreadyDismissed) setShowOnboarding(true);
        } else {
          setShowOnboarding(true);
          setIsLoadingLeads(false);
        }
      } catch (err) {
        if (isMounted) router.push('/login');
      }
    };

    initializeDashboard();
    return () => { isMounted = false; };
  }, [router]);

  // Separate Effect for Realtime to avoid WebSocket "Still in CONNECTING" error
  const subscribedId = useRef<string | null>(null);
  useEffect(() => {
    if (!venueProfile?.$id) return;
    
    let isMounted = true;
    let unsubscribe: (() => void) | undefined;
    subscribedId.current = venueProfile.$id;

    const connectRealtime = async () => {
      try {
        const { client, DATABASE_ID, VENUES_COLLECTION_ID, LEADS_COLLECTION_ID } = await import('@/lib/appwrite');
        
        // Safety delay for WebSocket handshake
        await new Promise(resolve => setTimeout(resolve, 800));
        if (!isMounted) return;

        unsubscribe = client.subscribe([
          `databases.${DATABASE_ID}.collections.${VENUES_COLLECTION_ID}.documents.${venueProfile.$id}`,
          `databases.${DATABASE_ID}.collections.${LEADS_COLLECTION_ID}.documents`
        ], (response) => {
          if (!isMounted) return;
          setIsRealtimeConnected(true); // Confirmed activity
          const payload = response.payload as any;

          if (response.events.some(e => e.includes('databases.*.collections.' + VENUES_COLLECTION_ID))) {
            setVenueProfile(payload);
            setShowOnboarding(!payload.onboardingComplete);
          } else if (response.events.some(e => e.includes('databases.*.collections.' + LEADS_COLLECTION_ID))) {
            if (payload.venueId === venueProfile?.$id || payload.venueId === 'BROADCAST') {
               const mapped = {
                  id: payload.$id,
                  name: payload.name,
                  phone: payload.phone || '+91 98765 43210',
                  event: payload.eventType,
                  guests: payload.guests ? payload.guests.toString() : '0',
                  date: formatLeadDate(payload.createdAt),
                  time: formatLeadTime(payload.createdAt),
                  rawDate: payload.createdAt,
                  status: payload.status || 'New',
                  location: 'Haldwani',
                  title: 'Direct Inquiry',
                  starred: false,
                  unread: payload.status === 'New',
                  color: payload.status === 'Booked' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
               };

               if (response.events.some(e => e.includes('create'))) {
                 setRecentLeads(prev => {
                   if (prev.some(l => l.id === payload.$id)) return prev;
                   return [mapped, ...prev];
                 });
               } else if (response.events.some(e => e.includes('update'))) {
                 setRecentLeads(prev => prev.map(l => l.id === payload.$id ? mapped : l));
               } else if (response.events.some(e => e.includes('delete'))) {
                 setRecentLeads(prev => prev.filter(l => l.id !== payload.$id));
               }
            }
          }
        });
      } catch (err) { 
        console.warn('Realtime sync dormant:', err); 
        setIsRealtimeConnected(false);
        subscribedId.current = null;
      }
    };

    connectRealtime();
    return () => { 
      isMounted = false; 
      if (unsubscribe) {
        unsubscribe();
        subscribedId.current = null;
      }
    };
  }, [venueProfile?.$id, connectionVersion]);

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
      
      {/* MOBILE OVERLAY */}
      <AnimatePresence>
        {isMobile && sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* SIDEBAR */}
      <motion.aside 
        initial={false}
        animate={{ 
          width: sidebarOpen ? (isMobile ? 280 : 280) : 0, 
          opacity: sidebarOpen ? 1 : (isMobile ? 0 : 0),
          x: isMobile && !sidebarOpen ? -280 : 0
        }}
        className={`bg-white border-r border-slate-200/60 flex flex-col fixed lg:sticky top-0 h-screen z-[70] lg:z-50 overflow-hidden no-print transition-all duration-300 ${!sidebarOpen && !isMobile ? 'pointer-events-none' : ''}`}
      >
         <div className="p-8 pb-4 flex-1 w-[280px] scrollbar-hide overflow-y-auto">
            <div className="flex items-center justify-between mb-16 px-2">
               <Link href="/" className="group">
                  <div className="flex flex-col items-start gap-1">
                     <div className="w-40 h-10 relative">
                        <Image 
                           src={logo} 
                           alt="PartyDial" 
                           fill 
                           className="object-contain object-left group-hover:scale-105 transition-transform duration-500" 
                        />
                     </div>
                     <div className="flex items-center gap-2 ml-1">
                        <div className="w-4 h-[1px] bg-pd-pink/50"></div>
                        <span className="text-[10px] font-black uppercase text-pd-pink tracking-[0.5em] italic opacity-90">Partner</span>
                     </div>
                  </div>
               </Link>
               <button 
                  onClick={() => setSidebarOpen(false)}
                  className="w-11 h-11 rounded-[20px] bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-pd-pink hover:text-white transition-all border border-slate-100 shadow-sm active:scale-90 group/close"
               >
                  <X size={18} className="group-hover:rotate-90 transition-transform duration-500" />
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
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
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
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-bold tracking-wide uppercase transition-all ${
                      activeTab === item.id 
                      ? 'bg-slate-100 text-slate-900 border border-slate-200' 
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
            <div className="p-4 bg-pd-pink/5 border border-pd-pink/10 rounded-[28px] overflow-hidden relative group">
               <div className="relative z-10 flex flex-col gap-3">
                  <div className="w-8 h-8 rounded-lg bg-pd-pink/10 flex items-center justify-center text-pd-pink">
                    <Sparkles size={16} />
                  </div>
                  <div>
                    <h4 className="text-[11px] font-black uppercase tracking-widest italic mb-1 text-slate-900">Boost Listing</h4>
                    <p className="text-[9px] text-slate-500 font-medium">Get 5x more visibility today.</p>
                  </div>
                  <button className="w-full py-2 bg-pd-pink text-white text-[10px] font-black uppercase italic rounded-xl shadow-lg shadow-pd-pink/20">Upgrade Now</button>
               </div>
               <div className="absolute top-0 right-0 w-24 h-24 bg-white/60 rounded-full blur-2xl group-hover:scale-125 transition-transform"></div>
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
      <main className="flex-1 min-h-screen flex flex-col max-h-screen overflow-y-auto printable-main relative">
         
         <header className="h-20 lg:h-16 bg-white border-b border-slate-100 px-4 lg:px-8 flex items-center justify-between sticky top-0 z-40 no-print">
            
            {/* Left Section: Context & Navigation */}
            <div className="flex items-center gap-3 lg:gap-6">
               {(isMobile || !sidebarOpen) && (
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSidebarOpen(true)}
                    className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-lg shadow-slate-900/10 hover:bg-pd-pink transition-all"
                  >
                     <Menu size={18} />
                  </motion.button>
               )}
               
               <div className="flex flex-col">
                  <h1 className="text-[8px] lg:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none mb-1">
                     {formattedDate || 'Loading...'}
                  </h1>
                  <p className="text-xs lg:text-sm font-black text-slate-900 uppercase italic tracking-tight">
                     <span className="hidden sm:inline">Partner</span> <span className="text-pd-pink">Console</span> / <span className="capitalize">{activeTab}</span>
                  </p>
               </div>
            </div>

            {/* Center Section: Command Search */}


            {/* Right Section: System Actions & Profile */}
            <div className="flex items-center gap-2 lg:gap-4">
               <div className="hidden sm:flex items-center gap-2 bg-slate-50 p-1.5 rounded-[20px] border border-slate-100/50 mr-1 lg:mr-2">
                  <div className="relative">
                    <button 
                      onClick={() => setShowNotifDropdown(!showNotifDropdown)}
                      className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-slate-400 hover:text-pd-pink hover:bg-pd-pink/5 transition-all relative border border-slate-100 shadow-sm"
                    >
                      <Bell size={18} />
                      {unreadLeadsCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-pd-pink text-white text-[8px] font-black flex items-center justify-center rounded-full border-[3px] border-white">
                          {unreadLeadsCount}
                        </span>
                      )}
                    </button>

                    <NotificationDropdown 
                      isOpen={showNotifDropdown}
                      onClose={() => setShowNotifDropdown(false)}
                      notifications={recentLeads}
                      onViewAll={() => setActiveTab('leads')}
                      lastClearedTime={lastClearedTime}
                    />
                  </div>

                  <button className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-slate-400 hover:text-pd-pink hover:bg-pd-pink/5 transition-all relative border border-slate-100 shadow-sm">
                    <HelpCircle size={18} />
                  </button>
               </div>
               
               <div className="hidden lg:block h-8 w-[1px] bg-slate-200/50 mx-1"></div>

               <div 
                  onClick={() => { setActiveTab('settings'); setSettingsSection('profile'); }}
                  className="flex items-center gap-2 lg:gap-3 pl-1 lg:pl-3 cursor-pointer group active:scale-95 transition-transform"
               >
                  <div className="text-right hidden md:block">
                     <p className="text-[11px] lg:text-[13px] font-black text-slate-900 italic tracking-tighter uppercase whitespace-nowrap leading-none mb-1">{venueProfile?.venueName || "Grand Imperial"}</p>
                      <div className="flex items-center gap-2 justify-end">
                        <span className={`w-1.5 h-1.5 rounded-full ${isRealtimeConnected ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></span>
                        <p className={`text-[8px] lg:text-[10px] ${isRealtimeConnected ? 'text-emerald-500' : 'text-rose-500'} font-black uppercase tracking-widest leading-none`}>
                           {isRealtimeConnected ? 'Premium Live' : 'Reconnecting...'}
                        </p>
                      </div>
                  </div>
                  <div className="flex relative scale-90 lg:scale-100">
                     <div className="w-10 h-10 lg:w-11 lg:h-11 rounded-2xl bg-gradient-to-tr from-pd-pink to-purple-500 p-[2px] shadow-lg shadow-pd-pink/20">
                        <div className="w-full h-full rounded-[14px] bg-white overflow-hidden flex items-center justify-center">
                           {(() => {
                              try {
                                 const photos = typeof venueProfile?.photos === 'string' ? JSON.parse(venueProfile.photos) : venueProfile?.photos;
                                 const avatar = Array.isArray(photos) ? photos.find((p: any) => p.category === 'Profile') : null;
                                 if (avatar) {
                                    return (
                                       <Image 
                                          src={`https://sgp.cloud.appwrite.io/v1/storage/buckets/venues_photos/files/${avatar.id}/view?project=69ae84bc001ca4edf8c2`} 
                                          alt="Venue Profile" 
                                          width={44} 
                                          height={44} 
                                          className="object-cover w-full h-full" 
                                       />
                                    );
                                 }
                              } catch (e) { console.error('Failed to parse avatar:', e); }
                              return (
                                 <Image 
                                    src={`https://i.pravatar.cc/100?u=${venueProfile?.venueName || 'partner'}`} 
                                    alt="Default Profile" 
                                    width={44} 
                                    height={44} 
                                    className="grayscale-[0.4]" 
                                 />
                              );
                           })()}
                        </div>
                     </div>
                     <div className="absolute -bottom-1 -right-1 w-4 h-4 lg:w-5 lg:h-5 bg-white rounded-xl shadow-md flex items-center justify-center border border-slate-100">
                        <div className="w-2 h-2 lg:w-2.5 lg:h-2.5 rounded-full bg-emerald-400"></div>
                     </div>
                  </div>
               </div>
            </div>
         </header>

         {/* DASHBOARD CONTENT */}
         <div className="p-4 lg:p-8">
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
                venueId={venueProfile?.$id}
                replyTarget={replyTarget}
                setReplyTarget={setReplyTarget}
                showToast={showToast}
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
                handleEventTypeToggle={handleEventTypeToggle}
                saveProfileSettings={saveProfileSettings}
                isUpdatingProfile={isUpdatingProfile}
                showToast={showToast}
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
                venueProfile={venueProfile}
                showToast={showToast}
              />
            )}
          </div>

      </main>

      {/* Modern Smooth Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20, x: '-50%' }}
            animate={{ opacity: 1, scale: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, scale: 0.9, y: 10, x: '-50%' }}
            className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-[10001] px-6 py-4 rounded-[20px] shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex items-center gap-4 border border-white/10 backdrop-blur-md ${
              toast.type === 'success' 
                ? 'bg-slate-900 text-white' 
                : 'bg-red-950 text-white'
            }`}
          >
            {toast.type === 'success' ? (
              <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                <CheckCircle2 size={18} />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white shadow-lg shadow-red-500/20">
                <XCircle size={18} />
              </div>
            )}
            <div className="flex flex-col">
               <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] leading-none mb-1">System Message</span>
               <p className="text-[12px] font-black uppercase tracking-tight italic">{toast.message}</p>
            </div>
            <button onClick={() => setToast(null)} className="ml-4 p-1 hover:bg-white/10 rounded-lg transition-colors">
               <X size={14} className="text-white/40" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

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

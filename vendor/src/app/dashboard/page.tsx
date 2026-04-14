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
import FinanceHub from '@/vendor/components/dashboard/FinanceHub';
import AnalyticsCenter from '@/vendor/components/dashboard/AnalyticsCenter';
import QuickSupport from '@/vendor/components/dashboard/QuickSupport';
import SystemHistory from '@/vendor/components/dashboard/SystemHistory';
import DashboardSettings from '@/vendor/components/dashboard/DashboardSettings';
import VenueCalendar from '@/vendor/components/dashboard/VenueCalendar';
import LeadExplorer from '@/vendor/components/dashboard/LeadExplorer';
import NotificationDropdown from '@/vendor/components/dashboard/NotificationDropdown';
import PaymentReminderPopup from '@/vendor/components/PaymentReminderPopup';

import logo from '../logo.jpg';

const tabs = [
  { id: 'overview', label: 'Overview', icon: <BarChart3 size={18} /> },
  { id: 'leads', label: 'Leads', icon: <Zap size={18} /> },
  { id: 'pipeline', label: 'Pipeline', icon: <Target size={18} /> },
  { id: 'reviews', label: 'Reviews', icon: <MessageSquareQuote size={18} /> },
];

const secondaryTabs = [
  { id: 'support', label: 'Support', icon: <HelpCircle size={18} /> },
  { id: 'settings', label: 'Settings', icon: <Settings size={18} /> },
];

const planLabels: {[key: string]: string} = {
  'pax_0_50': 'Starter Live',
  'pax_50_100': 'Growth Live',
  'pax_100_200': 'Priority Live',
  'pax_200_500': 'Featured Live',
  'pax_500_1000': 'Premium Live',
  'pax_1000_2000': 'Elite Live',
  'pax_2000_5000': 'Platinum Live',
  'pax_5000': 'Enterprise Live',
  'trial_30': 'Introductory Offer',
  'free': 'Free Live'
};

export default function VendorDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [settingsSection, setSettingsSection] = useState('profile');
  const [leadFilter, setLeadFilter] = useState('All');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showPaymentReminder, setShowPaymentReminder] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [venueProfile, setVenueProfile] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const [recentLeads, setRecentLeads] = useState<any[]>([]);
  const [isLoadingLeads, setIsLoadingLeads] = useState(true);
  const [calendarEvents, setCalendarEvents] = useState<any[]>([]);

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

    // 2. Today's Leads calculation
    const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const todayLeadsCount = recentLeads.filter(l => l.date === today).length;

    // 3. Average Rating
    const rating = venueProfile?.rating || 0.0;

    // 4. Total Sales calculation (Booked leads * Estimated Revenue)
    const bookedLeads = recentLeads.filter(l => l.status === 'Booked');
    const avgPlatePrice = ((venueProfile?.perPlateVeg || 0) + (venueProfile?.perPlateNonVeg || 0)) / 2 || 0;
    
    const estimatedTotalSales = bookedLeads.reduce((acc, lead) => {
       const pax = parseInt(lead.guests) || 0;
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
        label: "Today's Leads", 
        value: todayLeadsCount.toString(), 
        icon: <Users size={20} />, 
        color: 'bg-blue-50 text-blue-600', 
        trend: todayLeadsCount > 0 ? 'New' : 'Static', 
        isUp: todayLeadsCount > 0 
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

  // Subscription Expiry Calculation
  const expiryInfo = useMemo(() => {
    if (!venueProfile) return null;
    const now = new Date();
    
    // Trial Plan specific logic (Expires April 30, 2026)
    if (venueProfile.subscriptionPlan === 'trial_30') {
      const end = new Date('2026-04-30T23:59:59');
      // If today is past April 30, it should have been caught in initializeDashboard, 
      // but we handle it here for safety.
      const diffTime = end.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      // Calculate percentage assuming a window that ends April 30
      const percent = Math.max(0, Math.min(100, (diffDays / 30) * 100));
      return { daysLeft: diffDays, percent, label: 'Introductory Offer' };
    }
    
    // Paid Plans (Assuming 1 Year duration from creation/verification)
    if (venueProfile.subscriptionPlan && venueProfile.subscriptionPlan !== 'free') {
      const start = new Date(venueProfile.$createdAt);
      const end = new Date(start);
      end.setFullYear(end.getFullYear() + 1);
      
      const totalTime = end.getTime() - start.getTime();
      const remainingTime = end.getTime() - now.getTime();
      const diffDays = Math.ceil(remainingTime / (1000 * 60 * 60 * 24));
      const percent = Math.max(0, Math.min(100, (remainingTime / totalTime) * 100));
      
      return { daysLeft: diffDays, percent, label: 'Live Pack' };
    }

    return null;
  }, [venueProfile]);
 
  // Unified Activity History Generation
  const pastActivities = useMemo(() => {
    return recentLeads.map((lead, idx) => ({
      id: idx + 1,
      type: lead.status === 'Booked' ? 'Booking Confirmed' : (lead.status === 'Quotation Send' ? 'Proposal Dispatched' : 'Inquiry Received'),
      title: lead.status === 'Booked' ? `Event booked for ${lead.name}` : `${lead.name} requested details for ${lead.event}`,
      time: `${lead.date} • ${lead.time}`,
      icon: lead.status === 'Booked' ? <CheckCircle2 size={18} className="text-emerald-500" /> : (lead.status === 'Quotation Send' ? <FileText size={18} className="text-blue-500" /> : <Zap size={18} className="text-pd-pink" />)
    }));
  }, [recentLeads]);

  // Automatic Onboarding Completion Check
  const isOnboardingComplete = useMemo(() => {
    if (!venueProfile) return false;
    if (venueProfile.onboardingComplete) return true;

    // Check individual fields for completion
    const hasName = venueProfile.venueName && venueProfile.venueName.length > 3;
    const hasCapacity = parseInt(venueProfile.capacity) > 0;
    const hasPricing = (parseFloat(venueProfile.perPlateVeg) > 0 || parseFloat(venueProfile.perPlateNonVeg) > 0);
    
    let photosCount = 0;
    try {
      const photos = typeof venueProfile.photos === 'string' ? JSON.parse(venueProfile.photos) : (Array.isArray(venueProfile.photos) ? venueProfile.photos : []);
      photosCount = photos.length;
    } catch (e) {}

    let eventTypesCount = 0;
    try {
      const et = typeof venueProfile.eventTypes === 'string' ? JSON.parse(venueProfile.eventTypes) : (Array.isArray(venueProfile.eventTypes) ? venueProfile.eventTypes : []);
      eventTypesCount = et.length;
    } catch (e) {}

    // We consider onboarding complete if name, capacity, pricing, and at least 3 photos & 1 event type are present
    const isComplete = hasName && hasCapacity && hasPricing && photosCount >= 3 && eventTypesCount >= 1;

    return isComplete || venueProfile.onboardingComplete;
  }, [venueProfile]);

  // Auto-update onboarding status in database
  useEffect(() => {
    if (isOnboardingComplete && venueProfile?.$id && !venueProfile?.onboardingComplete) {
      const syncOnboarding = async () => {
        try {
          const { databases, DATABASE_ID, VENUES_COLLECTION_ID } = await import('@/lib/appwrite');
          await databases.updateDocument(DATABASE_ID, VENUES_COLLECTION_ID, venueProfile.$id, {
            onboardingComplete: true
          });
          setVenueProfile((prev: any) => ({ ...prev, onboardingComplete: true }));
          showToast('Onboarding completed! Listing Management moved to Settings.', 'success');
        } catch (err) {
          console.error('Failed to auto-complete onboarding:', err);
        }
      };
      syncOnboarding();
    }
  }, [isOnboardingComplete, venueProfile?.$id, venueProfile?.onboardingComplete]);

  const handleLogout = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://party-dial-product-server.onrender.com/api';
      const serverUrl = baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`;
      await fetch(`${serverUrl}/auth/logout`, { 
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
    client: '',
    contact: '',
    email: '',
    event: 'Wedding Ceremony',
    eventDate: new Date().toISOString().split('T')[0],
    guestCount: '0',
    specialRequests: '',
    gstRate: 18,
    discountType: 'percentage' as 'percentage' | 'fixed',
    discountValue: 0,
    extraCharges: 0,
    lineItems: [
       { id: 1, label: 'Venue Rental', amount: 0 },
       { id: 2, label: 'Catering Service', amount: 0 },
       { id: 3, label: 'Decoration & Setup', amount: 0 },
    ],
    selectedImages: [] as string[],
    leadId: ''
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
    { id: 'Contacted', color: 'bg-purple-500', text: 'text-purple-600', icon: <Phone size={14} /> },
    { id: 'Followups', color: 'bg-amber-500', text: 'text-amber-600', icon: <CalendarDays size={14} /> },
    { id: 'Quotation Send', color: 'bg-pink-500', text: 'text-pink-600', icon: <IndianRupee size={14} /> },
    { id: 'Booked', color: 'bg-emerald-500', text: 'text-emerald-600', icon: <CheckCircle2 size={14} /> },
    { id: 'Lost Leads', color: 'bg-red-500', text: 'text-red-600', icon: <XCircle size={14} /> }
  ];

  const updateLeadStatus = async (leadId: string, newStatus: string) => {
    // 1. Optimistic Update (UI becomes "realtime" instantly)
    const previousLeads = [...recentLeads];
    setRecentLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: newStatus } : l));
    showToast(`Lead successfully moved to ${newStatus}`, 'success');

    try {
      const { databases, DATABASE_ID, LEADS_COLLECTION_ID } = await import('@/lib/appwrite');
      await databases.updateDocument(DATABASE_ID, LEADS_COLLECTION_ID, leadId, {
        status: newStatus
      });
    } catch (error) {
      console.error('Failed to update status:', error);
      // Revert if failed
      setRecentLeads(previousLeads);
      showToast('Offline mode: Could not sync status with server.', 'error');
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
        capacity: !isNaN(parseInt(String(venueProfile.capacity))) ? Math.max(1, Math.min(10000, parseInt(String(venueProfile.capacity)))) : 1, 
        perPlateVeg: String(parseInt(String(venueProfile.perPlateVeg || 0)) || 0),
        perPlateNonVeg: String(parseInt(String(venueProfile.perPlateNonVeg || 0)) || 0),
        description: venueProfile.description || '',
        amenities: venueProfile.amenities,
        eventTypes: venueProfile.eventTypes,
        landmark: venueProfile.landmark || '',
        packages: JSON.stringify({
           packages: Array.isArray(venueProfile.packages) ? venueProfile.packages : [],
           halls: Array.isArray(venueProfile.halls) ? venueProfile.halls : []
        })
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
        setUserData(user);
        setIsAuthorized(true);

        // 2. Fetch Profile
        const result = await databases.listDocuments(DATABASE_ID, VENUES_COLLECTION_ID, [Query.equal('userId', user.$id)]);
        if (!isMounted) return;

        if (result.documents.length > 0) {
          const profile = result.documents[0];
          
          // Unified packages/halls storage workaround
          let p_data: any = { packages: [], halls: [] };
          try {
             if (profile.packages) {
                const parsed = JSON.parse(profile.packages);
                if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
                   p_data = parsed;
                } else {
                   p_data.packages = Array.isArray(parsed) ? parsed : [];
                }
             }
          } catch(e) { console.warn('Failed to parse merged packages data'); }
          
          setVenueProfile({
             ...profile,
             packages: p_data.packages || [],
             halls: p_data.halls || []
          });

          // Hard expiry check for Trial Plan (Expires April 30th)
          if (profile.subscriptionPlan === 'trial_30') {
            const trialDeadline = new Date('2026-04-30T23:59:59');
            if (new Date() > trialDeadline) {
              router.push('/dashboard/onboarding/subscription?expired=true');
              return;
            }
          }
          
          setIsLoadingLeads(true);
          let leadsDocuments: any[] = [];
          
          // Only fetch leads for active paid subscriptions
          if (profile.subscriptionPlan && profile.subscriptionPlan !== 'free') {
            try {
              const leadsResult = await databases.listDocuments(DATABASE_ID, LEADS_COLLECTION_ID, [
                Query.or([
                  Query.equal('venueId', profile.$id),
                  Query.equal('venueId', 'BROADCAST')
                ]),
                Query.orderDesc('$createdAt')
              ]);
              leadsDocuments = leadsResult.documents;
            } catch (leadFetchErr) {
              console.warn('Failed to fetch leads:', leadFetchErr);
            }
          }

          if (isMounted) {
            const leads = leadsDocuments.map(doc => ({
              id: doc.$id,
              name: doc.name,
              phone: doc.phone || '+91 98765 43210',
              event: doc.eventType,
              guests: doc.guests ? doc.guests.toString() : '0',
              date: formatLeadDate(doc.$createdAt),
              time: formatLeadTime(doc.$createdAt),
              rawDate: doc.$createdAt,
              status: doc.status === 'Quoted' ? 'Quotation Send' : (doc.status === 'In-Progress' ? 'Contacted' : (doc.status === 'Lost' ? 'Lost Leads' : (doc.status || 'New'))),
              location: doc.city || 'Haldwani',
              email: doc.email || 'client@mail.com',
              title: 'Direct Inquiry',
              starred: false,
              unread: doc.status === 'New',
              color: doc.status === 'Booked' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
            }));
            
            setRecentLeads(leads);

            // Deriving calendar events from booked leads for the current month
            const events = leads
              .filter(l => l.status === 'Booked' && l.rawDate)
              .map(l => {
                const leadDate = new Date(l.rawDate);
                return {
                  day: leadDate.getDate(),
                  type: l.event || 'Event',
                  host: l.name,
                  pax: parseInt(l.guests) || 0,
                  time: l.time || 'TBD',
                  status: 'Confirmed'
                };
              });
            setCalendarEvents(events);
            setIsLoadingLeads(false);
          }

          // Handle Onboarding & Payment Status
          const alreadyDismissed = localStorage.getItem('onboardingComplete') === 'true';
          const plan = profile.subscriptionPlan || '';
          const isPaidStatus = !!(plan && plan !== 'free');
          const needsPayment = !isPaidStatus;

          if (!profile.onboardingComplete && !alreadyDismissed) {
            setShowOnboarding(true);
          } else if (profile.onboardingComplete && needsPayment) {
            // Use localStorage for precise timing, fallback to $updatedAt for cross-device
            const storedTime = localStorage.getItem('onboardingCompletedAt');
            const completionTime = new Date(storedTime || profile.$updatedAt).getTime();
            const thirtyMinutes = 30 * 60 * 1000;
            const now = Date.now();

            if (now - completionTime >= thirtyMinutes) {
               setShowPaymentReminder(true);
            } else {
               // Schedule popup for later
               const remaining = thirtyMinutes - (now - completionTime);
               setTimeout(() => {
                  setShowPaymentReminder(true);
               }, remaining);
            }
          }
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
            // Auto-hide payment reminder if payment is now complete
            if (payload.isPaid) setShowPaymentReminder(false);
          } else if (response.events.some(e => e.includes('databases.*.collections.' + LEADS_COLLECTION_ID))) {
            const isPaid = venueProfile?.subscriptionPlan && venueProfile?.subscriptionPlan !== 'free';
            if (isPaid && (payload.venueId === venueProfile?.$id || payload.venueId === 'BROADCAST')) {
               const mapped = {
                  id: payload.$id,
                  name: payload.name,
                  phone: payload.phone || '+91 98765 43210',
                  event: payload.eventType,
                  guests: payload.guests ? payload.guests.toString() : '0',
                  date: formatLeadDate(payload.$createdAt),
                  time: formatLeadTime(payload.$createdAt),
                  rawDate: payload.$createdAt,
                  status: payload.status === 'Quoted' ? 'Quotation Send' : (payload.status === 'In-Progress' ? 'Contacted' : (payload.status === 'Lost' || payload.status === 'Lost Leads' ? 'Lost Leads' : (payload.status || 'New'))),
                  location: payload.city || 'Haldwani',
                  email: payload.email || 'client@mail.com',
                  title: 'Direct Inquiry',
                  starred: false,
                  unread: payload.status === 'New',
                  color: payload.status === 'Booked' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
               };

               if (response.events.some(e => e.includes('create'))) {
                 // 1. Play Lead Arrival Sound
                 try {
                   const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
                   audio.volume = 0.5;
                   audio.play();
                   showToast(`New Inquiry from ${payload.name}!`, 'success');
                 } catch (audioErr) {
                   console.log('Audio notification blocked by browser.');
                 }

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
  // Calendar events moved to state and derived from leads

  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [newBookingDay, setNewBookingDay] = useState<number | null>(null);

  const selectedDayEvents = calendarEvents.filter(e => e.day === selectedDay);

  const completeOnboarding = async () => {
    localStorage.setItem('onboardingComplete', 'true');
    localStorage.setItem('onboardingCompletedAt', new Date().toISOString());
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
      
      {/* PAYMENT REMINDER POPUP */}
      <PaymentReminderPopup 
        isOpen={showPaymentReminder} 
        onClose={() => setShowPaymentReminder(false)} 
        venueName={venueProfile?.venueName}
      />

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
        className={`bg-white border-r border-slate-200/60 flex flex-col fixed md:sticky top-0 h-screen z-[70] md:z-50 overflow-hidden no-print transition-all duration-300 ${!sidebarOpen && !isMobile ? 'pointer-events-none' : ''}`}
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

              {/* Listing Management - Only visible during onboarding */}
             {!isOnboardingComplete && (
               <div className="space-y-1 mt-6 px-2">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 pl-4 mb-2 block opacity-60">Listing Management</span>
                  {[
                    { id: 'profile', label: 'Set Profile', icon: <User size={18} />, href: '/dashboard/onboarding/profile' },
                    { id: 'photos', label: 'Upload Photos', icon: <ImageIcon size={18} />, href: '/dashboard/onboarding/photos' },
                    { id: 'pricing', label: 'Manage Pricing', icon: <IndianRupee size={18} />, href: '/dashboard/onboarding/pricing' },
                    { id: 'subscription', label: 'Subscription', icon: <ShieldCheck size={18} />, href: '/dashboard/onboarding/subscription' },
                  ].map(item => (
                    <Link key={item.id} href={item.href || '#'}>
                      <div className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[11px] font-black uppercase tracking-wider text-slate-500 hover:bg-slate-50 hover:text-pd-pink transition-all cursor-pointer">
                        <div className="p-1.5 bg-slate-50 rounded-lg group-hover:bg-white transition-colors">
                           {item.icon}
                        </div>
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

             {/* Mobile Subscription Section */}
             <div className="mt-8 mb-4 px-3 lg:hidden">
                <div className="p-6 bg-slate-900 rounded-[32px] border border-white/10 shadow-2xl relative overflow-hidden group">
                    {/* Background Glow */}
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-pd-pink/20 blur-[40px] rounded-full group-hover:bg-pd-pink/30 transition-all duration-700"></div>
                    
                    {expiryInfo ? (
                      <>
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-4">
                               <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)] animate-pulse"></div>
                               <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 leading-none">{expiryInfo.label} ACTIVE</span>
                            </div>
                            
                            <div className="flex items-end justify-between mb-5">
                                <div className="flex flex-col">
                                   <span className="text-[20px] font-black text-white italic tracking-tighter leading-none mb-1">{expiryInfo.daysLeft}</span>
                                   <span className="text-[8px] font-black uppercase text-slate-500 tracking-[0.1em]">Days Remaining</span>
                                </div>
                                <div className="text-right">
                                   <Zap size={16} className="text-pd-pink fill-pd-pink mb-1 ml-auto" />
                                   <span className="text-[8px] font-black uppercase text-pd-pink tracking-widest italic leading-none">Renewal Required</span>
                                </div>
                            </div>

                            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mb-6">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${expiryInfo.percent}%` }}
                                    className={`h-full rounded-full ${
                                        expiryInfo.daysLeft < 7 
                                        ? 'bg-gradient-to-r from-red-500 to-rose-600' 
                                        : 'bg-gradient-to-r from-emerald-400 to-pd-pink'
                                    }`}
                                />
                            </div>
                        </div>
                      </>
                    ) : (
                        <div className="mb-6 relative z-10 text-center">
                           <span className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-400 block mb-2">Premium Partner</span>
                           <div className="h-1 flex gap-1">
                              {[1,2,3,4,5].map(i => <div key={i} className="flex-1 bg-white/10 rounded-full"></div>)}
                           </div>
                        </div>
                    )}
                    
                    <Link 
                      href="/dashboard/onboarding/subscription"
                      onClick={() => setSidebarOpen(false)}
                      className="relative z-10 w-full h-12 flex items-center justify-center gap-3 bg-white text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-pd-pink hover:text-white transition-all shadow-lg active:scale-95"
                    >
                      <CreditCard size={14} /> 
                      Manage Plan
                    </Link>
                </div>
             </div>
         </div>

         <div className="mt-auto p-6">

            
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

            {/* Center Section: Plan Validity Status */}
            <div className="hidden xl:flex flex-col items-center gap-1.5 min-w-[320px] px-6">
               {expiryInfo ? (
                  <>
                    <div className="flex items-center justify-between w-full px-1">
                       <div className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-pd-pink animate-pulse"></span>
                          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
                             {expiryInfo.label} <span className="text-slate-900 italic">Validity</span>
                          </span>
                       </div>
                       <span className="text-[10px] font-black text-slate-900 italic tracking-tighter">
                          {expiryInfo.daysLeft > 0 ? `${expiryInfo.daysLeft} Days Left` : 'Expired'}
                       </span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/40 p-0.5 shadow-inner">
                       <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${expiryInfo.percent}%` }}
                          transition={{ duration: 1.5, ease: "circOut", delay: 0.5 }}
                          className={`h-full rounded-full shadow-sm ${
                             expiryInfo.daysLeft < 7 
                               ? 'bg-gradient-to-r from-red-500 to-rose-600' 
                               : 'bg-gradient-to-r from-emerald-400 via-pd-pink to-purple-600'
                          }`}
                       />
                    </div>
                  </>
               ) : (
                  <div className="flex flex-col items-center opacity-40">
                     <span className="text-[8px] font-black uppercase tracking-[0.3em] text-slate-400">Premium Partnership Active</span>
                     <div className="flex gap-1 mt-1">
                        {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-6 h-1 bg-slate-200 rounded-full"></div>)}
                     </div>
                  </div>
               )}
            </div>

            <div className="flex items-center gap-2 lg:gap-4">
               <Link 
                  href="/dashboard/onboarding/subscription"
                  className="hidden md:flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-[14px] text-[10px] font-black uppercase tracking-[0.1em] hover:from-pd-pink hover:to-rose-600 transition-all shadow-md group border border-white/10"
               >
                  <CreditCard size={14} className="group-hover:rotate-12 transition-transform" /> 
                  Manage <span className="text-white/50 group-hover:text-white/80">Plan</span>
               </Link>

               <div className="hidden sm:flex items-center gap-3 bg-slate-50 p-1.5 px-3 rounded-[20px] border border-slate-100/50 mr-1 lg:mr-2">
                  <div className="flex items-center gap-2 pr-2 border-r border-slate-200">
                    <div className={`w-2 h-2 rounded-full ${isRealtimeConnected ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Live Sync</span>
                  </div>

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


               </div>
               
               <div className="hidden lg:block h-8 w-[1px] bg-slate-200/50 mx-1"></div>

               <div 
                  onClick={() => { setActiveTab('settings'); setSettingsSection('profile'); }}
                  className="flex items-center gap-2 lg:gap-3 pl-1 lg:pl-3 cursor-pointer group active:scale-95 transition-transform"
               >
                  <div className="text-right hidden md:block">
                     <p className="text-[11px] lg:text-[13px] font-black text-slate-900 italic tracking-tighter uppercase whitespace-nowrap leading-none mb-1">{venueProfile?.venueName || userData?.name || "Your Venue"}</p>
                      <div className="flex items-center gap-2 justify-end">
                        <span className={`w-1.5 h-1.5 rounded-full ${isRealtimeConnected ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></span>
                        <p className={`text-[8px] lg:text-[10px] ${isRealtimeConnected ? 'text-emerald-500' : 'text-rose-500'} font-black uppercase tracking-widest leading-none`}>
                           {isRealtimeConnected ? (planLabels[venueProfile?.subscriptionPlan] || 'Live') : 'Reconnecting...'}
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
                                    src={`https://i.pravatar.cc/100?u=${encodeURIComponent((venueProfile?.venueName || 'partner').trim())}`} 
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
            
            {/* Profile Status Indicator */}
            {venueProfile && (
               <div className="mb-8 flex">
                 {(() => {
                   const status = venueProfile.isVerified 
                     ? { label: "Approved Profile", color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20", icon: <ShieldCheck size={14} className="text-emerald-500" /> }
                     : venueProfile.status === 'rejected'
                     ? { label: "Rejected – Please Update Your Profile", color: "bg-rose-500/10 text-rose-600 border-rose-500/20", icon: <XCircle size={14} className="text-rose-500" /> }
                     : { label: "Waiting for Approval", color: "bg-amber-500/10 text-amber-600 border-amber-500/20", icon: <Clock size={14} className="text-amber-500" /> };
                   
                   return (
                     <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex items-center gap-3 px-5 py-3 rounded-[20px] border ${status.color} backdrop-blur-sm shadow-sm transition-all group hover:scale-[1.02] cursor-default`}
                     >
                        <div className="flex items-center justify-center">
                           {status.icon}
                        </div>
                        <div className="flex flex-col">
                           <span className="text-[8px] font-black opacity-60 uppercase tracking-[0.2em] leading-none mb-1">Listing Status</span>
                           <p className="text-[10px] font-black uppercase tracking-widest italic">{status.label}</p>
                        </div>
                     </motion.div>
                   );
                 })()}
               </div>
            )}

            {activeTab === 'overview' && (
              <DashboardOverview 
                venueProfile={venueProfile}
                userName={userData?.name}
                recentLeads={recentLeads}
                setActiveTab={setActiveTab}
                stats={stats}
              />
            )}

            {activeTab === 'leads' && (
              (venueProfile?.subscriptionPlan && venueProfile?.subscriptionPlan !== 'free') ? (
                <LeadInbox 
                  filteredAdvancedLeads={filteredAdvancedLeads}
                  leadFilter={leadFilter}
                  setLeadFilter={setLeadFilter}
                  updateLeadStatus={updateLeadStatus}
                  setActiveTab={setActiveTab}
                  setQuoteData={setQuoteData}
                />
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center min-h-[500px] bg-white rounded-[40px] border border-slate-100 shadow-pd-soft p-12 text-center"
                >
                   <div className="w-24 h-24 bg-amber-50 rounded-full flex items-center justify-center text-amber-500 mb-8 mx-auto shadow-inner">
                      <Zap size={45} className="fill-amber-500 animate-pulse" />
                   </div>
                   <h3 className="text-3xl font-[900] text-slate-900 uppercase italic tracking-tighter mb-4">Direct Leads Restricted</h3>
                   <p className="text-slate-500 font-medium italic max-w-md mx-auto mb-12 leading-relaxed">
                      Your profile is currently on the <span className="text-slate-900 font-bold">Free Plan</span>. Purchase a subscription to unlock real-time inquiries, lead management tools, and customer contact details.
                   </p>
                   <div className="flex flex-col sm:flex-row gap-4 items-center">
                      <Link href="/dashboard/onboarding/subscription" className="px-10 py-5 bg-slate-900 text-white text-[11px] font-black uppercase tracking-widest rounded-3xl hover:bg-pd-pink transition-all shadow-2xl active:scale-95 flex items-center gap-3">
                         Unlock All Features <ArrowUpRight size={18} />
                      </Link>
                      <button onClick={() => setActiveTab('support')} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">
                         Talk to Support
                      </button>
                   </div>
                </motion.div>
              )
            )}

            {activeTab === 'pipeline' && (
              (venueProfile?.subscriptionPlan && venueProfile?.subscriptionPlan !== 'free') ? (
                <LeadPipeline 
                  recentLeads={recentLeads}
                  pipelineStages={PIPELINE_STAGES}
                  updateLeadStatus={updateLeadStatus}
                  setLeadView={setLeadView}
                />
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center min-h-[500px] bg-white rounded-[40px] border border-white shadow-pd-soft p-12 text-center"
                >
                   <div className="w-24 h-24 bg-pd-purple/5 rounded-full flex items-center justify-center text-pd-purple mb-8 mx-auto">
                      <Target size={45} className="animate-bounce" />
                   </div>
                   <h3 className="text-3xl font-[900] text-slate-900 uppercase italic tracking-tighter mb-4">Pipeline Locked</h3>
                   <p className="text-slate-500 font-medium italic max-w-md mx-auto mb-12 leading-relaxed">
                      Managing your sales pipeline and booking flow requires an active subscription. Upgrade today to start converting inquiries into bookings.
                   </p>
                   <Link href="/dashboard/onboarding/subscription" className="px-10 py-5 bg-pd-purple text-white text-[11px] font-black uppercase tracking-widest rounded-3xl hover:bg-slate-900 transition-all shadow-2xl active:scale-95 flex items-center gap-3">
                      Activate Sales Pipeline <Sparkles size={18} />
                   </Link>
                </motion.div>
              )
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

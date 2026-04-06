export type SystemRole = 
  | 'Sales Head' 
  | 'Zonal Sales Head' 
  | 'State Sales Manager' 
  | 'Regional Sales Manager' 
  | 'BDM' 
  | 'BDE' 
  | 'Telecaller'
  | 'Super Admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: SystemRole;
  status: 'Active' | 'Inactive';
  region?: string; 
  state?: string;
  districts?: string[];
  city?: string;
  lastLogin?: string;
  moduleAccess: string[];
  reportingTo?: string; 
}

export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Proposal Sent' | 'Negotiation' | 'Won' | 'Lost';
export type LeadPriority = 'Hot' | 'Warm' | 'Cold' | 'Urgent';
export type LeadSource = 'Manual' | 'Website' | 'WhatsApp' | 'Facebook' | 'Google' | 'Direct Call';

export interface Lead {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  eventType: string;
  status: LeadStatus;
  priority: LeadPriority;
  source: LeadSource;
  ownerId: string;
  createdAt: string;
  sourceVenueId?: string;
  city: string;
  notes: string[];
  attachments: string[];
}

export interface Account {
  id: string;
  name: string; 
  industry: string;
  website?: string;
  phone: string;
  billingAddress: string;
  city: string;
  ownerId: string;
  createdAt: string;
}

export interface Contact {
  id: string;
  accountId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  designation: string;
  ownerId: string;
}

export type OpportunityStage = 'New Lead' | 'Qualified' | 'Meeting Scheduled' | 'Proposal Sent' | 'Negotiation' | 'Closed Won' | 'Closed Lost';

export interface Opportunity {
  id: string;
  accountId: string;
  contactId: string;
  name: string;
  value: number;
  stage: OpportunityStage;
  probability: number;
  expectedCloseDate: string;
  lostReason?: string;
  wonReason?: string;
  ownerId: string;
  createdAt: string;
  nextFollowUp?: string;
}

export interface Activity {
  id: string;
  entityId: string; // Lead or Opportunity ID
  type: 'Call' | 'Meeting' | 'Message' | 'Note' | 'Email' | 'Task';
  content: string;
  outcome?: string;
  personnelId: string;
  createdAt: string;
  dueDate?: string;
  isCompleted: boolean;
}

export interface AssignmentRule {
  id: string;
  targetType: 'City' | 'Source' | 'Role';
  targetValue: string;
  ownerId: string; // The User/Queue ID
  priority: number;
}

export interface VenueSpace {
  id: string;
  name: string;
  maxCapacity: number;
  photos: string[];
}

export interface GalleryItem {
  url: string;
  category: 'interior' | 'decoration' | 'food' | 'exterior' | 'events';
}

export interface Venue {
  id: string;
  name: string;
  businessName: string;
  location: {
    address: string;
    city: string;
  };
  contactNumber: string;
  startingRates: {
    veg: number;
    nonVeg: number;
  };
  isVerified: boolean;
  hasActivePlan: boolean;
  status: 'Active' | 'Inactive' | 'Suspended';
  subscriptionPlan: '0-50 PAX' | '50-100 PAX' | '100-200 PAX' | '200-500 PAX' | '500+' | 'None';
  totalLeads: number;
  activity: {
    received: number;
    contacted: number;
    booked: number;
    lost: number;
  };
  amenities: string[];
  availableSpaces: VenueSpace[];
  coverPhotos: string[];
  fullGallery: GalleryItem[];
  joinedAt: string;
  ownerEmail: string;
}

export const getAccounts = (): Account[] => [
  { id: "acc1", name: "Imperial Palace Resorts", industry: "Hospitality", website: "imperialpalace.com", phone: "011-223344", billingAddress: "Sector 5, Gurgaon", city: "Gurgaon", ownerId: "u1", createdAt: "2024-01-10" }
];

export const getContacts = (): Contact[] => [
  { id: "con1", accountId: "acc1", firstName: "Anjali", lastName: "Mehta", email: "anjali@imperial.com", phone: "9876543210", designation: "General Manager", ownerId: "u1" }
];

export const getOpportunities = (): Opportunity[] => [
  { id: "opp1", accountId: "acc1", contactId: "con1", name: "Platinum Subscription Renewal", value: 45000, stage: "Negotiation", probability: 75, expectedCloseDate: "2024-05-15", ownerId: "u1", createdAt: "2024-03-20" }
];

export const convertLead = (lead: Lead): { account: Account; contact: Contact; opportunity: Opportunity } => {
  const accountId = `acc_${Date.now()}`;
  const contactId = `con_${Date.now()}`;
  const opportunityId = `opp_${Date.now()}`;

  const account: Account = {
    id: accountId,
    name: lead.customerName + " Group",
    industry: "Lead Conversion",
    phone: lead.phone,
    billingAddress: lead.city,
    city: lead.city,
    ownerId: lead.ownerId,
    createdAt: new Date().toISOString()
  };

  const contact: Contact = {
    id: contactId,
    accountId: accountId,
    firstName: lead.customerName.split(' ')[0],
    lastName: lead.customerName.split(' ')[1] || "",
    email: lead.email,
    phone: lead.phone,
    designation: "Prospect",
    ownerId: lead.ownerId
  };

  const opportunity: Opportunity = {
    id: opportunityId,
    accountId: accountId,
    contactId: contactId,
    name: lead.customerName + " Deal",
    value: 0,
    stage: 'New Lead',
    probability: 10,
    expectedCloseDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    ownerId: lead.ownerId,
    createdAt: new Date().toISOString()
  };

  return { account, contact, opportunity };
};

export const getProbabilityByStage = (stage: OpportunityStage): number => {
  const mapping: Record<OpportunityStage, number> = {
    'New Lead': 10,
    'Qualified': 25,
    'Meeting Scheduled': 50,
    'Proposal Sent': 75,
    'Negotiation': 90,
    'Closed Won': 100,
    'Closed Lost': 0
  };
  return mapping[stage];
};

export const getActivities = (entityId: string): Activity[] => [
  { id: "a1", entityId, type: 'Call', content: "Discovery call with manager", outcome: "Interested in Platinum", personnelId: "u1", createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), isCompleted: true },
  { id: "a2", entityId, type: 'Note', content: "Requires poolside wedding for 200 PAX", personnelId: "u1", createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), isCompleted: true },
  { id: "a3", entityId, type: 'Task', content: "Send Proposal PDF", dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), personnelId: "u2", createdAt: new Date().toISOString(), isCompleted: false },
];

export const getLeads = (): Lead[] => [
  { id: "l1", customerName: "Rahul Sharma", email: "rahul@gmail.com", phone: "9988776655", eventType: "Wedding", status: "New", priority: "Urgent", source: "Website", ownerId: "u1", createdAt: new Date().toISOString(), sourceVenueId: "v1", city: "Delhi", notes: ["Looking for poolside wedding."], attachments: [] },
  { id: "l2", customerName: "Sneha Reddy", email: "sneha@outlook.com", phone: "8877665544", eventType: "Birthday", status: "Contacted", priority: "Hot", source: "WhatsApp", ownerId: "u2", createdAt: new Date().toISOString(), sourceVenueId: "v2", city: "Mumbai", notes: ["Gold package 50 pax."], attachments: [] },
  { id: "l3", customerName: "Amit Patel", email: "amit.p@live.com", phone: "7766554433", eventType: "Corporate", status: "Won", priority: "Cold", source: "Direct Call", ownerId: "u3", createdAt: new Date().toISOString(), sourceVenueId: "v3", city: "Ahmedabad", notes: ["Anniversary meet."], attachments: [] },
];

export const getUsers = (): User[] => [
  { id: "u1", name: "Vikram Malhotra", email: "head@partydial.com", role: "Sales Head", status: "Active", lastLogin: "30m ago", moduleAccess: ["Dashboard", "Venues", "Users", "Leads"] },
  { id: "u2", name: "Sarah Khan", email: "zonal.north@partydial.com", role: "Zonal Sales Head", status: "Active", region: "North", lastLogin: "2h ago", moduleAccess: ["Dashboard", "Venues", "Leads"], reportingTo: "u1" },
  { id: "u3", name: "Siddharth Raj", email: "state.delhi@partydial.com", role: "State Sales Manager", status: "Active", state: "Delhi", lastLogin: "5h ago", moduleAccess: ["Dashboard", "Leads"], reportingTo: "u2" },
];

export const getVenues = (): Venue[] => [
  { 
    id: "v1", name: "The Grand Regency", businessName: "Regency Hospitality", location: { address: "NH-8", city: "Delhi" }, contactNumber: "+91 9988776655", startingRates: { veg: 1200, nonVeg: 1500 }, isVerified: true, hasActivePlan: true, status: "Active", subscriptionPlan: "200-500 PAX", totalLeads: 245, activity: { received: 245, contacted: 210, booked: 45, lost: 12 }, amenities: ["AC"], availableSpaces: [], coverPhotos: ["https://images.unsplash.com/photo-1519167758481-83f550bb49b3"], fullGallery: [], joinedAt: "2023-10-12", ownerEmail: "owner1@regency.com"
  }
];

export const getAlerts = () => [
  { type: "Urgent", message: "Verification Pending: Oceanic Gardens (Mumbai) requires audit.", time: "12m ago" },
  { type: "Payment", message: "Subscription Renewal successful for Q2 2024.", time: "1h ago" },
];

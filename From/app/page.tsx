'use client';

/**
 * Party Inquiry Form
 * High-fidelity form for lead capture and matching.
 */

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Users, 
  MapPin, 
  PartyPopper, 
  Phone, 
  Mail, 
  User,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

// Form Validation Schema
const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  number: z.string().min(10, 'Phone number must be at least 10 digits'),
  eventType: z.string().min(1, 'Please select an event type'),
  guestCapacity: z.string().min(1, 'Please specify guest capacity'),
  pincode: z.string().length(6, 'Pincode must be exactly 6 digits'),
  eventDate: z.string().min(1, 'Please select an event date'),
  eventDetails: z.string().min(10, 'Please tell us more about your event'),
});

type FormData = z.infer<typeof formSchema>;

export default function Home() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Pincode States
  const [pincodeInput, setPincodeInput] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoadingPincode, setIsLoadingPincode] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  // Fetch Pincode Details (Indian Post API)
  useEffect(() => {
    const fetchPincode = async () => {
      if (pincodeInput.length < 3) {
        setSuggestions([]);
        return;
      }

      // Special Case for Haldwani (263139)
      if (pincodeInput === '263139') {
        setSuggestions([
          { display: 'Haldwani-263139', name: 'Haldwani', pincode: '263139' },
          { display: 'Kathgodam-263126', name: 'Kathgodam', pincode: '263126' },
          { display: 'Lalkuan-263131', name: 'Lalkuan', pincode: '263131' },
          { display: 'Mukhani-263139', name: 'Mukhani', pincode: '263139' },
          { display: 'Kaladhungi-263140', name: 'Kaladhungi', pincode: '263140' },
          { display: 'Bhowali-263132', name: 'Bhowali', pincode: '263132' },
          { display: 'Nainital-263001', name: 'Nainital', pincode: '263001' }
        ]);
        return;
      }

      setIsLoadingPincode(true);
      try {
        const url = /^\d+$/.test(pincodeInput) 
          ? `https://api.postalpincode.in/pincode/${pincodeInput}`
          : `https://api.postalpincode.in/postoffice/${pincodeInput}`;
        
        const response = await fetch(url);
        const data = await response.json();

        if (data[0].Status === 'Success') {
          const offices = data[0].PostOffice;
          const formatted = offices
            .filter((o: any) => o.State === 'Uttarakhand')
            .map((o: any) => ({
              display: `${o.Name}-${o.Pincode}`,
              name: o.Name,
              pincode: o.Pincode
            }));
          
          setSuggestions(formatted.slice(0, 8)); // Limit to first 8 matches
        } else {
          setSuggestions([]);
        }
      } catch (e) {
        console.error('Pincode fetch error:', e);
      } finally {
        setIsLoadingPincode(false);
      }
    };

    const timer = setTimeout(fetchPincode, 400);
    return () => clearTimeout(timer);
  }, [pincodeInput]);

  const selectPincode = (suggestion: any) => {
    setPincodeInput(suggestion.pincode);
    setValue('pincode', suggestion.pincode);
    setShowSuggestions(false);
  };

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5005/api'}/leads/public-inquiry`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setIsSubmitted(true);
        reset();
        setPincodeInput('');
      } else {
        alert(result.message || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      alert('Could not connect to the server. Please check your internet or try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
  };

  if (isSubmitted) {
    return (
      <main>
        <motion.div 
          className="glass"
          style={{ textAlign: 'center', maxWidth: '500px', width: '100%' }}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 20 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}
          >
            <div style={{ background: 'rgba(34, 197, 94, 0.1)', padding: '1rem', borderRadius: '50%' }}>
              <CheckCircle2 size={56} color="#22c55e" />
            </div>
          </motion.div>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }} className="gradient-text">Thank You!</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: '1.6' }}>
            Your inquiry has been received. Our event specialists will contact you within 24 hours to help plan your perfect celebration.
          </p>
          <button onClick={() => setIsSubmitted(false)} className="btn-primary">
            Send Another Inquiry
          </button>
        </motion.div>
      </main>
    );
  }

  return (
    <main>
      <div className="container">
        
        {/* Left Side: Content */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="left-content"
          style={{ display: 'flex', flexDirection: 'column' }}
        >
          <motion.div variants={itemVariants} style={{ marginBottom: '1rem' }}>
            <span style={{ 
              background: 'rgba(139, 92, 246, 0.1)', 
              color: 'var(--primary)', 
              padding: '0.4rem 1rem', 
              borderRadius: '100px', 
              fontSize: '0.85rem', 
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.1em'
            }}>
              Event Planning simplified
            </span>
          </motion.div>
          
          <motion.h1 
            variants={itemVariants}
            className="hero-text"
          >
            Plan Your <br />
            <span className="gradient-text">Dream Celebration</span>
          </motion.h1>
          
          <motion.p 
            variants={itemVariants}
            className="hero-para"
          >
            From intimate gatherings to grand galas, Party Dial helps you find the perfect venue and vendors. Fill out the form to get started.
          </motion.p>

          <motion.div variants={itemVariants} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="benefit-item">
              <div className="icon-box">
                <PartyPopper size={20} color="var(--primary)" />
              </div>
              <div style={{ textAlign: 'left' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: '700' }}>Curated Venues</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Top-rated spots across the city</p>
              </div>
            </div>
            
            <div className="benefit-item">
              <div className="icon-box">
                <Users size={20} color="var(--secondary)" />
              </div>
              <div style={{ textAlign: 'left' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: '700' }}>Expert Planners</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Full support for your vision</p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Side: Form */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="glass right-form"
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Name</label>
                <div style={{ position: 'relative' }}>
                  <User size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input {...register('name')} placeholder="John Doe" className="form-input" style={{ paddingLeft: '3rem', width: '100%' }} />
                </div>
                {errors.name && <span className="error-text">{errors.name.message}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Number</label>
                <div style={{ position: 'relative' }}>
                  <Phone size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input {...register('number')} placeholder="+91 99999 99999" className="form-input" style={{ paddingLeft: '3rem', width: '100%' }} />
                </div>
                {errors.number && <span className="error-text">{errors.number.message}</span>}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input {...register('email')} placeholder="john@example.com" className="form-input" style={{ paddingLeft: '3rem', width: '100%' }} />
              </div>
              {errors.email && <span className="error-text">{errors.email.message}</span>}
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Event Type</label>
                <div style={{ position: 'relative' }}>
                  <PartyPopper size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <select {...register('eventType')} className="form-input" style={{ paddingLeft: '3rem', width: '100%', appearance: 'none' }}>
                    <option value="">Select type</option>
                    <option value="Birthday Party">Birthday Party</option>
                    <option value="Wedding Events">Wedding Events</option>
                    <option value="Pre-Wedding Events">Pre-Wedding Events</option>
                    <option value="Anniversary Party">Anniversary Party</option>
                    <option value="Corporate Events">Corporate Events</option>
                    <option value="Kitty Party">Kitty Party</option>
                    <option value="Family Functions">Family Functions</option>
                    <option value="Festival Parties">Festival Parties</option>
                    <option value="Social Gatherings">Social Gatherings</option>
                    <option value="Kids Parties">Kids Parties</option>
                    <option value="Bachelor / Bachelorette Party">Bachelor / Bachelorette Party</option>
                    <option value="Housewarming Party">Housewarming Party</option>
                    <option value="Baby Shower">Baby Shower</option>
                    <option value="Engagement Ceremony">Engagement Ceremony</option>
                    <option value="Entertainment / Theme Parties">Entertainment / Theme Parties</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                {errors.eventType && <span className="error-text">{errors.eventType.message}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Guests</label>
                <div style={{ position: 'relative' }}>
                  <Users size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <select {...register('guestCapacity')} className="form-input" style={{ paddingLeft: '3rem', width: '100%', appearance: 'none' }}>
                    <option value="">Capacity</option>
                    <option value="50">50 guests</option>
                    <option value="50-100">50-100</option>
                    <option value="100-200">100-200</option>
                    <option value="200-500">200-500</option>
                    <option value="500-1000">500-1000</option>
                    <option value="1000-2000">1000-2000</option>
                    <option value="2000-5000">2000-5000</option>
                    <option value="5000+">5000+</option>
                  </select>
                </div>
                {errors.guestCapacity && <span className="error-text">{errors.guestCapacity.message}</span>}
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Pincode</label>
                <div style={{ position: 'relative' }}>
                  <MapPin size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input 
                    {...register('pincode')} 
                    value={pincodeInput}
                    onChange={(e) => {
                      setPincodeInput(e.target.value);
                      setValue('pincode', e.target.value);
                      setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    placeholder="400001" 
                    className="form-input" 
                    style={{ paddingLeft: '3rem', width: '100%' }} 
                    autoComplete="off"
                  />
                  
                  {/* Pincode Suggestions Dropdown */}
                  <AnimatePresence>
                    {showSuggestions && (suggestions.length > 0 || isLoadingPincode) && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="glass"
                        style={{ 
                          position: 'absolute', 
                          top: '110%', 
                          left: 0, 
                          right: 0, 
                          zIndex: 50, 
                          padding: '0.5rem',
                          maxHeight: '200px',
                          overflowY: 'auto',
                          borderRadius: '12px',
                          border: '1px solid var(--card-border)',
                          boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
                        }}
                      >
                        {isLoadingPincode ? (
                          <div style={{ padding: '1rem', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Searching areas...</div>
                        ) : (
                          suggestions.map((s, idx) => (
                            <div
                              key={idx}
                              onClick={() => selectPincode(s)}
                              className="suggestion-item"
                              style={{
                                padding: '0.75rem 1rem',
                                cursor: 'pointer',
                                borderRadius: '8px',
                                fontSize: '0.85rem',
                                color: 'white',
                                transition: 'background 0.2s',
                                borderBottom: idx === suggestions.length - 1 ? 'none' : '1px solid rgba(255,255,255,0.05)'
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(139, 92, 246, 0.2)'}
                              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                            >
                              {s.display}
                            </div>
                          ))
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                {errors.pincode && <span className="error-text">{errors.pincode.message}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Date</label>
                <div style={{ position: 'relative' }}>
                  <Calendar size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input {...register('eventDate')} type="date" className="form-input" style={{ paddingLeft: '3rem', width: '100%' }} />
                </div>
                {errors.eventDate && <span className="error-text">{errors.eventDate.message}</span>}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Details</label>
              <textarea {...register('eventDetails')} placeholder="Any specific requirements?" className="form-input" rows={3} style={{ width: '100%', resize: 'none' }} />
              {errors.eventDetails && <span className="error-text">{errors.eventDetails.message}</span>}
            </div>

            <button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading ? <div className="loader" /> : (
                <>Send Inquiry <ArrowRight size={20} /></>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </main>
  );
}

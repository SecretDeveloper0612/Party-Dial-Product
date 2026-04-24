import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Dimensions,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Search,
  MapPin,
  Calendar,
  Users,
  ArrowRight,
  Star,
  Zap,
  ShieldCheck,
  Building2,
  ChevronDown,
  Clock,
  Send,
  Quote,
  LayoutDashboard,
  Heart,
  Plus,
  Minus,
} from 'lucide-react-native';
import { Colors } from '../../constants/Colors';
import { PopupInquiry } from '../../components/PopupInquiry';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const { width } = Dimensions.get('window');

const CATEGORIES = [
  { name: 'Birthday Party', icon: '🎂', img: 'https://images.unsplash.com/photo-1464347719102-11db6282f854?w=400&h=400' },
  { name: 'Wedding Events', icon: '💍', img: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=400' },
  { name: 'Corporate Events', icon: '🏢', img: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=400' },
  { name: 'Family Events', icon: '🏠', img: 'https://images.unsplash.com/photo-1467307983825-619715426c70?w=400&h=400' },
  { name: 'Engagement', icon: '💎', img: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=400&h=400' },
];

const TESTIMONIALS = [
  {
    name: "Rahul Malhotra",
    role: "Wedding Host",
    text: "PartyDial made our wedding planning so much easier! We received 5 quotes within 2 hours and booked a beautiful palace hotel that was right in our budget.",
    avatar: "https://i.pravatar.cc/150?u=user1"
  },
  {
    name: "Sneha Kapoor",
    role: "Corporate Planner",
    text: "As a corporate event planner, I need quick responses. PartyDial delivered! Found an amazing rooftop venue for our team's annual meet in just a day.",
    avatar: "https://i.pravatar.cc/150?u=user2"
  }
];

const FAQS = [
  { q: "How does PartyDial help me find the right venue?", a: "We match you with the best venues based on your event type, guest count, and budget. You receive real-time quotes instantly." },
  { q: "Is there any charge for using PartyDial services?", a: "No, PartyDial is completely free for event organizers. We connect you directly with venues without any brokerage." },
  { q: "Are the venues on PartyDial personally verified?", a: "Yes, our team personally visits and verifies each venue for quality standards and credibility before listing." }
];

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [inquiryVisible, setInquiryVisible] = useState(false);

  useEffect(() => {
     // Auto-trigger after 3 seconds like web
     const timer = setTimeout(() => {
        setInquiryVisible(true);
     }, 3000);
     return () => clearTimeout(timer);
  }, []);

  const toggleFaq = (index: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* HERO SECTION */}
        <View style={styles.heroWrapper}>
          <View style={styles.heroTextContainer}>
            <Text style={styles.branding}>PARTYDIAL</Text>
            <Text style={styles.heroTitle}>
              Find the <Text style={{ color: Colors.primary }}>Perfect Venue</Text> for Your Event
            </Text>
            <Text style={styles.heroSubtitle}>
              Get free customized quotes from top venues in minutes. Direct connections. Zero brokerage.
            </Text>
            
            <View style={styles.trustBadge}>
              <View style={styles.avatarStack}>
                {[1, 2, 3, 4].map((i) => (
                  <Image key={i} source={{ uri: `https://i.pravatar.cc/100?u=${i}` }} style={styles.avatar} />
                ))}
              </View>
              <Text style={styles.trustText}>Trusted by 50,000+ happy hosts</Text>
            </View>
          </View>

          {/* LEAD FORM CARD */}
          <View style={styles.formCard}>
            <View style={styles.formBorder} />
            <Text style={styles.formTitle}>Get Free Quotes Now</Text>
            
            <View style={styles.formGrid}>
               <View style={styles.inputGroup}>
                  <Text style={styles.label}>Event Type</Text>
                  <TouchableOpacity style={styles.formInput} onPress={() => setInquiryVisible(true)}>
                     <Text style={styles.placeholderText}>Select Event</Text>
                     <ChevronDown size={14} color={Colors.slate[400]} />
                  </TouchableOpacity>
               </View>

               <View style={styles.inputGroup}>
                  <Text style={styles.label}>City / Location</Text>
                  <TouchableOpacity style={styles.formInput} onPress={() => setInquiryVisible(true)}>
                     <MapPin size={16} color={Colors.primary} />
                     <View style={styles.textInput}>
                        <Text style={styles.placeholderText}>Enter Pincode</Text>
                     </View>
                  </TouchableOpacity>
               </View>

               <View style={styles.inputGroup}>
                  <Text style={styles.label}>Event Date</Text>
                  <TouchableOpacity style={styles.formInput} onPress={() => setInquiryVisible(true)}>
                     <Calendar size={16} color={Colors.purple} />
                     <View style={styles.textInput}>
                        <Text style={styles.placeholderText}>Select Date</Text>
                     </View>
                  </TouchableOpacity>
               </View>

               <View style={styles.inputGroup}>
                  <Text style={styles.label}>Guest Count</Text>
                  <TouchableOpacity style={styles.formInput} onPress={() => setInquiryVisible(true)}>
                     <Users size={16} color={Colors.blue} />
                     <View style={styles.textInput}>
                        <Text style={styles.placeholderText}>Select Capacity</Text>
                     </View>
                  </TouchableOpacity>
               </View>
            </View>

            <TouchableOpacity style={styles.primaryBtnWrapper} onPress={() => setInquiryVisible(true)}>
               <LinearGradient
                  colors={Colors.gradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.primaryBtn}
               >
                  <Text style={styles.primaryBtnText}>GET FREE QUOTES NOW</Text>
                  <ArrowRight size={18} color="white" />
               </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {/* STATS SECTION */}
        <View style={styles.statsRow}>
           <View style={styles.statItem}>
              <View style={[styles.statIcon, { backgroundColor: Colors.primary + '10' }]}>
                 <Building2 size={18} color={Colors.primary} />
              </View>
              <Text style={styles.statVal}>500+</Text>
              <Text style={styles.statLabel}>Venues</Text>
           </View>
           <View style={[styles.statItem, styles.statBorder]}>
              <View style={[styles.statIcon, { backgroundColor: Colors.purple + '10' }]}>
                 <Users size={18} color={Colors.purple} />
              </View>
              <Text style={styles.statVal}>10k+</Text>
              <Text style={styles.statLabel}>Inquiries</Text>
           </View>
           <View style={styles.statItem}>
              <View style={[styles.statIcon, { backgroundColor: Colors.blue + '10' }]}>
                 <MapPin size={18} color={Colors.blue} />
              </View>
              <Text style={styles.statVal}>7</Text>
              <Text style={styles.statLabel}>Cities</Text>
           </View>
        </View>

        {/* POPULAR CATEGORIES */}
        <View style={styles.sectionHeader}>
           <View>
              <Text style={styles.sectionTitle}>Popular Event Categories</Text>
              <View style={styles.titleUnderline} />
           </View>
           <TouchableOpacity style={styles.exploreBtn}>
              <Text style={styles.exploreBtnText}>EXPLORE ALL</Text>
           </TouchableOpacity>
        </View>

        <ScrollView 
           horizontal 
           showsHorizontalScrollIndicator={false}
           contentContainerStyle={styles.catScroll}
        >
           {CATEGORIES.map((cat, i) => (
              <TouchableOpacity key={i} style={styles.catCard}>
                 <Image source={{ uri: cat.img }} style={styles.catImg} />
                 <View style={styles.catOverlay} />
                 <View style={styles.catBadge}>
                    <Text style={styles.catBadgeText}>Live</Text>
                 </View>
                 <Text style={styles.catName}>{cat.name}</Text>
              </TouchableOpacity>
           ))}
        </ScrollView>

        {/* TOP VENUES */}
        <View style={styles.sectionHeader}>
           <View>
              <Text style={styles.sectionTitle}>Top Venues <Text style={{ color: Colors.primary }}>Near You</Text></Text>
              <Text style={styles.sectionSub}>Personally verified luxury venues for you.</Text>
           </View>
        </View>

        <View style={styles.venueContainer}>
           {[1, 2].map((id) => (
              <TouchableOpacity key={id} style={styles.pdCard}>
                 <View style={styles.venueImageWrapper}>
                    <Image source={{ uri: `https://picsum.photos/seed/${id + 10}/600/400` }} style={styles.venueImg} />
                    <View style={styles.venuePriceBadge}>
                       <Text style={styles.venuePriceText}>₹{id === 1 ? '800' : '1500'}/plate</Text>
                    </View>
                 </View>
                 <View style={styles.pdCardBody}>
                    <View style={styles.venueHeaderCol}>
                       <View style={styles.venueNameRow}>
                          <Text style={styles.venueName}>Royal Orchid Palace</Text>
                          <View style={styles.vBadge}>
                             <ShieldCheck size={12} color="white" />
                          </View>
                       </View>
                       <Text style={styles.venueLoc}>Nainital Road, Haldwani</Text>
                    </View>
                    <View style={styles.venueStats}>
                       <View style={styles.vStat}>
                          <Star size={14} color="#FACC15" fill="#FACC15" />
                          <Text style={styles.vStatText}>4.8 (120+)</Text>
                       </View>
                       <View style={styles.vStat}>
                          <Clock size={14} color={Colors.slate[400]} />
                          <Text style={styles.vStatText}>Responds in 2h</Text>
                       </View>
                    </View>
                 </View>
              </TouchableOpacity>
           ))}
        </View>

        {/* HOW IT WORKS */}
        <View style={styles.howItWorks}>
           <Text style={styles.howTitle}>HOW IT <Text style={{ color: Colors.primary }}>WORKS</Text></Text>
           <View style={styles.stepsRow}>
              {[
                 { icon: <Send size={24} color="white" />, title: 'Submit' },
                 { icon: <Clock size={24} color="white" />, title: 'Receive' },
                 { icon: <Zap size={24} color="white" />, title: 'Book' }
              ].map((step, i) => (
                 <View key={i} style={styles.stepItem}>
                    <LinearGradient colors={Colors.gradient} style={styles.stepCircle}>
                       {step.icon}
                    </LinearGradient>
                    <Text style={styles.stepText}>{step.title}</Text>
                 </View>
              ))}
           </View>
        </View>

        {/* TESTIMONIALS */}
        <View style={styles.testimonialsSection}>
           <View style={styles.centerHeader}>
              <Text style={styles.sectionTitleCenter}>Happy <Text style={{ color: Colors.primary }}>Celebrators</Text></Text>
              <Text style={styles.centerSub}>Real stories from our valued clients</Text>
           </View>
           
           <ScrollView 
             horizontal 
             showsHorizontalScrollIndicator={false}
             contentContainerStyle={styles.testimonialContainer}
           >
              {TESTIMONIALS.map((t, i) => (
                 <View key={i} style={styles.testimonialCard}>
                    <Quote size={40} color={Colors.slate[100]} style={styles.quoteIcon} />
                    <View style={styles.testUserRow}>
                       <Image source={{ uri: t.avatar }} style={styles.userAvatar} />
                       <View>
                          <Text style={styles.userName}>{t.name}</Text>
                          <Text style={styles.userRole}>{t.role}</Text>
                       </View>
                    </View>
                    <Text style={styles.testText}>"{t.text}"</Text>
                 </View>
              ))}
           </ScrollView>
        </View>

        {/* FAQS */}
        <View style={styles.faqSection}>
           <View style={styles.centerHeader}>
              <Text style={styles.sectionTitleCenter}>Got <Text style={{ color: Colors.primary }}>Questions?</Text></Text>
              <View style={[styles.titleUnderline, { alignSelf: 'center' }]} />
           </View>

           <View style={styles.faqList}>
              {FAQS.map((faq, i) => (
                 <View key={i} style={styles.faqItem}>
                    <TouchableOpacity 
                      style={styles.faqHeader} 
                      onPress={() => toggleFaq(i)}
                    >
                       <Text style={styles.faqQuestion}>{faq.q}</Text>
                       <View style={[styles.faqToggleIcon, openFaq === i && styles.faqToggleIconActive]}>
                          <ChevronDown size={16} color={openFaq === i ? 'white' : Colors.slate[400]} />
                       </View>
                    </TouchableOpacity>
                    {openFaq === i && (
                       <View style={styles.faqAnswerContainer}>
                          <Text style={styles.faqAnswer}>{faq.a}</Text>
                       </View>
                    )}
                 </View>
              ))}
           </View>
        </View>

        {/* FINAL CTA */}
        <View style={styles.finalCtaWrapper}>
           <LinearGradient colors={Colors.gradient} style={styles.finalCtaCard}>
              <View style={styles.ctaTextContent}>
                 <Text style={styles.ctaTitle}>Ready to Plan the Grand Celebration?</Text>
                 <Text style={styles.ctaSub}>Submit your requirements and get free quotes from 5,000+ luxury venues near you.</Text>
                 <TouchableOpacity style={styles.ctaBtn}>
                    <Text style={styles.ctaBtnText}>SUBMIT REQUIREMENT</Text>
                 </TouchableOpacity>
                 <Text style={styles.ctaTimer}>Average Response Time: 15 Mins</Text>
              </View>
              <View style={styles.ctaIllustration}>
                 <LayoutDashboard size={120} color="rgba(255,255,255,0.1)" />
                 <Heart size={40} color="white" fill="white" style={styles.ctaHeart} />
              </View>
           </LinearGradient>
        </View>

        {/* FOOTER */}
        <View style={styles.footerBranding}>
           <Text style={styles.footerPD}>PARTYDIAL</Text>
           <Text style={styles.footerCopy}>© 2026 PartyDial. All rights reserved.</Text>
           <View style={styles.footerLinks}>
              <Text style={styles.fLink}>Privacy</Text>
              <Text style={styles.fLink}>Terms</Text>
              <Text style={styles.fLink}>Contact</Text>
           </View>
        </View>

        <View style={{ height: 50 }} />
      </ScrollView>

      <PopupInquiry 
        visible={inquiryVisible} 
        onClose={() => setInquiryVisible(false)} 
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  heroWrapper: {
    padding: 20,
    paddingTop: 30,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: Colors.slate[50],
  },
  heroTextContainer: {
    marginBottom: 30,
  },
  branding: {
    fontSize: 12,
    fontWeight: '900',
    color: Colors.slate[400],
    letterSpacing: 2,
    marginBottom: 10,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: Colors.slate[900],
    lineHeight: 40,
    marginBottom: 15,
  },
  heroSubtitle: {
    fontSize: 16,
    color: Colors.slate[500],
    fontWeight: '500',
    lineHeight: 24,
    marginBottom: 25,
  },
  trustBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarStack: {
    flexDirection: 'row',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'white',
    marginLeft: -10,
  },
  trustText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.slate[800],
  },
  formCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.1,
    shadowRadius: 30,
    elevation: 20,
    borderWidth: 1,
    borderColor: Colors.slate[50],
    position: 'relative',
  },
  formBorder: {
    position: 'absolute',
    top: 25,
    left: 10,
    bottom: 25,
    width: 4,
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: Colors.slate[900],
    marginBottom: 25,
    paddingLeft: 15,
  },
  formGrid: {
     gap: 20,
  },
  inputGroup: {
     gap: 8,
  },
  label: {
     fontSize: 10,
     fontWeight: '800',
     color: Colors.slate[400],
     textTransform: 'uppercase',
     letterSpacing: 1,
  },
  formInput: {
     height: 55,
     backgroundColor: Colors.slate[50],
     borderRadius: 12,
     flexDirection: 'row',
     alignItems: 'center',
     paddingHorizontal: 15,
     borderWidth: 1,
     borderColor: Colors.slate[100],
     gap: 10,
     justifyContent: 'space-between',
  },
  textInput: {
     flex: 1,
     fontSize: 14,
     fontWeight: '700',
     color: Colors.slate[900],
  },
  placeholderText: {
     fontSize: 14,
     fontWeight: '700',
     color: Colors.slate[400],
  },
  primaryBtnWrapper: {
     marginTop: 30,
     borderRadius: 12,
     overflow: 'hidden',
     shadowColor: Colors.pink,
     shadowOffset: { width: 0, height: 10 },
     shadowOpacity: 0.3,
     shadowRadius: 15,
     elevation: 8,
  },
  primaryBtn: {
     height: 60,
     flexDirection: 'row',
     alignItems: 'center',
     justifyContent: 'center',
     gap: 10,
  },
  primaryBtnText: {
     color: 'white',
     fontSize: 14,
     fontWeight: '900',
     fontStyle: 'italic',
     letterSpacing: 1,
  },
  statsRow: {
     flexDirection: 'row',
     padding: 20,
     backgroundColor: 'white',
     borderBottomWidth: 1,
     borderBottomColor: Colors.slate[50],
  },
  statItem: {
     flex: 1,
     alignItems: 'center',
     gap: 4,
  },
  statBorder: {
     borderLeftWidth: 1,
     borderRightWidth: 1,
     borderColor: Colors.slate[100],
  },
  statIcon: {
     width: 40,
     height: 40,
     borderRadius: 12,
     alignItems: 'center',
     justifyContent: 'center',
     marginBottom: 5,
  },
  statVal: {
     fontSize: 18,
     fontWeight: '900',
     color: Colors.slate[900],
  },
  statLabel: {
     fontSize: 10,
     fontWeight: '800',
     color: Colors.slate[400],
     textTransform: 'uppercase',
  },
  sectionHeader: {
     flexDirection: 'row',
     justifyContent: 'space-between',
     alignItems: 'flex-start',
     padding: 25,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: Colors.slate[900],
  },
  sectionSub: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.slate[400],
    marginTop: 4,
  },
  titleUnderline: {
     width: 40,
     height: 4,
     backgroundColor: Colors.primary,
     borderRadius: 2,
     marginTop: 8,
  },
  exploreBtn: {
     paddingVertical: 10,
     paddingHorizontal: 20,
     backgroundColor: 'white',
     borderRadius: 10,
     borderWidth: 1,
     borderColor: Colors.slate[200],
  },
  exploreBtnText: {
     fontSize: 10,
     fontWeight: '900',
     color: Colors.slate[600],
     letterSpacing: 1,
     fontStyle: 'italic',
  },
  catScroll: {
     paddingLeft: 25,
     paddingRight: 10,
  },
  catCard: {
     width: 160,
     height: 220,
     borderRadius: 12,
     overflow: 'hidden',
     marginRight: 15,
     position: 'relative',
     backgroundColor: Colors.slate[100],
  },
  catImg: {
     width: '100%',
     height: '100%',
  },
  catOverlay: {
     ...StyleSheet.absoluteFillObject,
     backgroundColor: 'rgba(0,0,0,0.4)',
  },
  catBadge: {
     position: 'absolute',
     top: 15,
     right: 15,
     backgroundColor: Colors.primary,
     paddingHorizontal: 10,
     paddingVertical: 4,
     borderRadius: 20,
  },
  catBadgeText: {
     color: 'white',
     fontSize: 10,
     fontWeight: '900',
  },
  catName: {
     position: 'absolute',
     bottom: 15,
     left: 15,
     color: 'white',
     fontSize: 14,
     fontWeight: '900',
     textTransform: 'uppercase',
     letterSpacing: 1,
  },
  venueContainer: {
     paddingHorizontal: 25,
  },
  pdCard: {
     backgroundColor: 'white',
     borderRadius: 12,
     marginBottom: 25,
     borderWidth: 1,
     borderColor: Colors.slate[100],
     shadowColor: '#000',
     shadowOffset: { width: 0, height: 10 },
     shadowOpacity: 0.08,
     shadowRadius: 20,
     elevation: 5,
  },
  venueImageWrapper: {
     position: 'relative',
  },
  venueImg: {
     width: '100%',
     height: 200,
     borderTopLeftRadius: 12,
     borderTopRightRadius: 12,
  },
  venuePriceBadge: {
     position: 'absolute',
     bottom: 15,
     right: 15,
     backgroundColor: Colors.primary,
     paddingHorizontal: 12,
     paddingVertical: 6,
     borderRadius: 8,
  },
  venuePriceText: {
     color: 'white',
     fontSize: 12,
     fontWeight: '900',
  },
  pdCardBody: {
     padding: 20,
  },
  venueHeaderCol: {
     marginBottom: 15,
  },
  venueNameRow: {
     flexDirection: 'row',
     alignItems: 'center',
     gap: 8,
  },
  venueName: {
     fontSize: 18,
     fontWeight: '900',
     color: Colors.slate[900],
  },
  vBadge: {
     backgroundColor: Colors.primary,
     padding: 3,
     borderRadius: 5,
  },
  venueLoc: {
     fontSize: 14,
     color: Colors.slate[500],
     fontWeight: '600',
     marginTop: 4,
  },
  venueStats: {
     flexDirection: 'row',
     gap: 20,
     borderTopWidth: 1,
     borderTopColor: Colors.slate[50],
     paddingTop: 15,
  },
  vStat: {
     flexDirection: 'row',
     alignItems: 'center',
     gap: 6,
  },
  vStatText: {
     fontSize: 12,
     fontWeight: '700',
     color: Colors.slate[800],
  },
  howItWorks: {
     padding: 40,
     alignItems: 'center',
  },
  howTitle: {
     fontSize: 24,
     fontWeight: '900',
     color: Colors.slate[900],
     letterSpacing: 2,
     marginBottom: 40,
  },
  stepsRow: {
     flexDirection: 'row',
     justifyContent: 'space-between',
     width: '100%',
  },
  stepItem: {
     alignItems: 'center',
     gap: 15,
  },
  stepCircle: {
     width: 60,
     height: 60,
     borderRadius: 30,
     alignItems: 'center',
     justifyContent: 'center',
     shadowColor: Colors.pink,
     shadowOffset: { width: 0, height: 10 },
     shadowOpacity: 0.3,
     shadowRadius: 10,
  },
  stepText: {
     fontSize: 12,
     fontWeight: '900',
     color: Colors.slate[900],
     textTransform: 'uppercase',
  },
  testimonialsSection: {
     paddingVertical: 60,
     backgroundColor: Colors.slate[50],
  },
  centerHeader: {
     alignItems: 'center',
     marginBottom: 40,
     paddingHorizontal: 20,
  },
  sectionTitleCenter: {
     fontSize: 28,
     fontWeight: '900',
     color: Colors.slate[900],
     textAlign: 'center',
  },
  centerSub: {
     fontSize: 12,
     fontWeight: '800',
     color: Colors.slate[400],
     textTransform: 'uppercase',
     letterSpacing: 1,
     marginTop: 8,
  },
  testimonialContainer: {
     paddingLeft: 25,
     paddingRight: 10,
  },
  testimonialCard: {
     width: 300,
     backgroundColor: 'white',
     borderRadius: 20,
     padding: 25,
     marginRight: 20,
     borderWidth: 1,
     borderColor: Colors.slate[100],
     position: 'relative',
  },
  quoteIcon: {
     position: 'absolute',
     top: 20,
     right: 20,
  },
  testUserRow: {
     flexDirection: 'row',
     alignItems: 'center',
     gap: 15,
     marginBottom: 20,
  },
  userAvatar: {
     width: 50,
     height: 50,
     borderRadius: 25,
  },
  userName: {
     fontSize: 16,
     fontWeight: '900',
     color: Colors.slate[900],
  },
  userRole: {
     fontSize: 10,
     fontWeight: '800',
     color: Colors.primary,
     textTransform: 'uppercase',
  },
  testText: {
     fontSize: 14,
     color: Colors.slate[600],
     fontStyle: 'italic',
     lineHeight: 22,
     fontWeight: '600',
  },
  faqSection: {
     padding: 25,
     backgroundColor: 'white',
  },
  faqList: {
     gap: 15,
  },
  faqItem: {
     borderWidth: 1,
     borderColor: Colors.slate[100],
     borderRadius: 15,
     overflow: 'hidden',
  },
  faqHeader: {
     flexDirection: 'row',
     justifyContent: 'space-between',
     alignItems: 'center',
     padding: 20,
  },
  faqQuestion: {
     flex: 1,
     fontSize: 14,
     fontWeight: '900',
     color: Colors.slate[700],
     paddingRight: 15,
  },
  faqToggleIcon: {
     width: 28,
     height: 28,
     borderRadius: 14,
     backgroundColor: Colors.slate[50],
     alignItems: 'center',
     justifyContent: 'center',
  },
  faqToggleIconActive: {
     backgroundColor: Colors.primary,
     transform: [{ rotate: '180deg' }],
  },
  faqAnswerContainer: {
     padding: 20,
     paddingTop: 0,
     borderTopWidth: 1,
     borderTopColor: Colors.slate[50],
  },
  faqAnswer: {
     fontSize: 14,
     color: Colors.slate[500],
     fontWeight: '600',
     lineHeight: 22,
     fontStyle: 'italic',
  },
  finalCtaWrapper: {
     padding: 25,
  },
  finalCtaCard: {
     borderRadius: 30,
     padding: 30,
     flexDirection: 'row',
     overflow: 'hidden',
     position: 'relative',
  },
  ctaTextContent: {
     flex: 1,
     zIndex: 10,
  },
  ctaTitle: {
     fontSize: 24,
     fontWeight: '900',
     color: 'white',
     lineHeight: 32,
     marginBottom: 10,
  },
  ctaSub: {
     fontSize: 12,
     color: 'rgba(255,255,255,0.8)',
     fontWeight: '600',
     marginBottom: 20,
  },
  ctaBtn: {
     backgroundColor: 'white',
     paddingVertical: 15,
     paddingHorizontal: 25,
     borderRadius: 12,
     alignSelf: 'flex-start',
     marginBottom: 15,
  },
  ctaBtnText: {
     fontSize: 12,
     fontWeight: '900',
     color: Colors.slate[900],
  },
  ctaTimer: {
     fontSize: 8,
     fontWeight: '900',
     color: 'rgba(255,255,255,0.6)',
     textTransform: 'uppercase',
  },
  ctaIllustration: {
     position: 'absolute',
     right: -20,
     bottom: -20,
     opacity: 0.2,
  },
  ctaHeart: {
     position: 'absolute',
     top: '40%',
     left: '40%',
  },
  footerBranding: {
     padding: 40,
     alignItems: 'center',
     backgroundColor: 'white',
  },
  footerPD: {
     fontSize: 14,
     fontWeight: '900',
     color: Colors.slate[900],
     letterSpacing: 3,
     marginBottom: 10,
  },
  footerCopy: {
     fontSize: 10,
     color: Colors.slate[400],
     fontWeight: '700',
     marginBottom: 20,
  },
  footerLinks: {
     flexDirection: 'row',
     gap: 20,
  },
  fLink: {
     fontSize: 12,
     fontWeight: '800',
     color: Colors.slate[600],
  }
});

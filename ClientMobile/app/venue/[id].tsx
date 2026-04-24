import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  MapPin, 
  Star, 
  Users, 
  ChevronLeft, 
  Share2, 
  Heart,
  CheckCircle2,
  Building2,
  Zap,
  Clock,
  ArrowRight,
  ShieldCheck
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../constants/Colors';

const { width } = Dimensions.get('window');

export default function VenueDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const venue = {
    id: id,
    name: 'Royal Orchid Palace',
    location: 'Plot No. 45, Nainital Road, Haldwani',
    rating: 4.8,
    reviews: 120,
    price: 800,
    capacity: '500-1000',
    type: 'Luxury Banquet Hall',
    description: 'The Royal Orchid Palace is a premier event destination in Haldwani, offering exquisite architecture and world-class amenities for weddings, corporate events, and social gatherings. Experience unparalleled luxury and service.',
    amenities: ['Centralized AC', 'Power Backup', 'In-house Catering', 'Valet Parking', 'Changing Rooms', 'Security'],
    images: [
      'https://picsum.photos/seed/11/1200/800',
      'https://picsum.photos/seed/12/1200/800',
    ],
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* IMAGE HERO */}
        <View style={styles.imageHeader}>
          <Image source={{ uri: venue.images[0] }} style={styles.mainImg} />
          <LinearGradient
            colors={['rgba(0,0,0,0.4)', 'transparent', 'rgba(0,0,0,0.6)']}
            style={styles.imgOverlay}
          />
          
          <SafeAreaView style={styles.topActions} edges={['top']}>
            <TouchableOpacity onPress={() => router.back()} style={styles.roundBtn}>
              <ChevronLeft size={24} color={Colors.slate[900]} />
            </TouchableOpacity>
            <View style={styles.topRight}>
              <TouchableOpacity style={styles.roundBtn}>
                <Share2 size={20} color={Colors.slate[900]} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.roundBtn}>
                <Heart size={20} color={Colors.primary} />
              </TouchableOpacity>
            </View>
          </SafeAreaView>

          <View style={styles.imgBadge}>
             <Text style={styles.imgBadgeText}>1 / {venue.images.length}</Text>
          </View>
        </View>

        {/* CONTENT */}
        <View style={styles.contentCard}>
          <View style={styles.contentHeader}>
            <View style={{ flex: 1 }}>
               <View style={styles.nameRow}>
                  <Text style={styles.venueName}>{venue.name}</Text>
                  <View style={styles.vBadge}>
                     <ShieldCheck size={14} color="white" />
                  </View>
               </View>
               <View style={styles.locRow}>
                  <MapPin size={16} color={Colors.primary} />
                  <Text style={styles.locText}>{venue.location}</Text>
               </View>
            </View>
            <View style={styles.ratingBox}>
               <Star size={18} color="#FACC15" fill="#FACC15" />
               <Text style={styles.ratingVal}>{venue.rating}</Text>
            </View>
          </View>

          {/* STATS BAR */}
          <View style={styles.statsBar}>
             <View style={styles.statItem}>
                <Users size={22} color={Colors.slate[400]} />
                <View>
                   <Text style={styles.statLabel}>Capacity</Text>
                   <Text style={styles.statValue}>{venue.capacity}</Text>
                </View>
             </View>
             <View style={[styles.statItem, styles.statBorder]}>
                <Building2 size={22} color={Colors.slate[400]} />
                <View>
                   <Text style={styles.statLabel}>Type</Text>
                   <Text style={styles.statValue}>Banquet</Text>
                </View>
             </View>
             <View style={styles.statItem}>
                <Zap size={22} color={Colors.slate[400]} />
                <View>
                   <Text style={styles.statLabel}>Response</Text>
                   <Text style={styles.statValue}>Fast</Text>
                </View>
             </View>
          </View>

          {/* ABOUT SECTION */}
          <View style={styles.section}>
             <View style={styles.sectionTitleRow}>
                <Text style={styles.sectionTitle}>About Venue</Text>
                <View style={styles.titleUnderline} />
             </View>
             <Text style={styles.description}>{venue.description}</Text>
          </View>

          {/* AMENITIES */}
          <View style={styles.section}>
             <View style={styles.sectionTitleRow}>
                <Text style={styles.sectionTitle}>Amenities</Text>
                <View style={styles.titleUnderline} />
             </View>
             <View style={styles.amenitiesGrid}>
                {venue.amenities.map((item, idx) => (
                   <View key={idx} style={styles.amenityChip}>
                      <CheckCircle2 size={16} color={Colors.primary} />
                      <Text style={styles.amenityText}>{item}</Text>
                   </View>
                ))}
             </View>
          </View>

          <View style={{ height: 150 }} />
        </View>
      </ScrollView>

      {/* FOOTER ACTION BAR */}
      <View style={styles.footer}>
         <View style={styles.footerPrice}>
            <Text style={styles.fPriceLabel}>Starting Price</Text>
            <Text style={styles.fPriceValue}>₹{venue.price} <Text style={styles.fPriceSub}>per plate</Text></Text>
         </View>
         <TouchableOpacity style={styles.actionBtnWrapper}>
            <LinearGradient
               colors={Colors.gradient}
               start={{ x: 0, y: 0 }}
               end={{ x: 1, y: 0 }}
               style={styles.actionBtn}
            >
               <Text style={styles.actionBtnText}>GET FREE QUOTES</Text>
               <ArrowRight size={20} color="white" />
            </LinearGradient>
         </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  imageHeader: {
    height: 400,
    width: '100%',
    position: 'relative',
  },
  mainImg: {
    width: '100%',
    height: '100%',
  },
  imgOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  topActions: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  topRight: {
    flexDirection: 'row',
    gap: 12,
  },
  roundBtn: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  imgBadge: {
     position: 'absolute',
     bottom: 40,
     right: 20,
     backgroundColor: 'rgba(255,255,255,0.9)',
     paddingHorizontal: 12,
     paddingVertical: 6,
     borderRadius: 10,
  },
  imgBadgeText: {
     fontSize: 12,
     fontWeight: '800',
     color: Colors.slate[900],
  },
  contentCard: {
    marginTop: -30,
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 25,
  },
  contentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 30,
  },
  nameRow: {
     flexDirection: 'row',
     alignItems: 'center',
     gap: 10,
  },
  venueName: {
    fontSize: 26,
    fontWeight: '900',
    color: Colors.slate[900],
    flexShrink: 1,
  },
  vBadge: {
     backgroundColor: Colors.primary,
     padding: 4,
     borderRadius: 6,
  },
  locRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 6,
  },
  locText: {
    fontSize: 16,
    color: Colors.slate[500],
    fontWeight: '600',
  },
  ratingBox: {
    backgroundColor: Colors.slate[50],
    borderWidth: 1,
    borderColor: Colors.slate[100],
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 15,
    alignItems: 'center',
    gap: 4,
  },
  ratingVal: {
    fontSize: 18,
    fontWeight: '900',
    color: Colors.slate[900],
  },
  statsBar: {
     flexDirection: 'row',
     backgroundColor: Colors.slate[50],
     borderRadius: 20,
     padding: 20,
     marginBottom: 35,
  },
  statItem: {
     flex: 1,
     flexDirection: 'row',
     alignItems: 'center',
     gap: 12,
  },
  statBorder: {
     borderLeftWidth: 1,
     borderRightWidth: 1,
     borderColor: Colors.slate[200],
     marginHorizontal: 15,
     paddingHorizontal: 15,
  },
  statLabel: {
     fontSize: 10,
     fontWeight: '800',
     color: Colors.slate[400],
     textTransform: 'uppercase',
  },
  statValue: {
     fontSize: 14,
     fontWeight: '900',
     color: Colors.slate[900],
  },
  section: {
     marginBottom: 35,
  },
  sectionTitleRow: {
     marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: Colors.slate[900],
  },
  titleUnderline: {
     width: 35,
     height: 4,
     backgroundColor: Colors.primary,
     borderRadius: 2,
     marginTop: 6,
  },
  description: {
    fontSize: 16,
    color: Colors.slate[500],
    lineHeight: 26,
    fontWeight: '500',
  },
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  amenityChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF1F2',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
    minWidth: '47%',
  },
  amenityText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
  },
  footer: {
     position: 'absolute',
     bottom: 0,
     left: 0,
     right: 0,
     backgroundColor: 'white',
     paddingHorizontal: 25,
     paddingTop: 15,
     paddingBottom: 40,
     flexDirection: 'row',
     justifyContent: 'space-between',
     alignItems: 'center',
     borderTopWidth: 1,
     borderTopColor: Colors.slate[50],
     shadowColor: '#000',
     shadowOffset: { width: 0, height: -15 },
     shadowOpacity: 0.1,
     shadowRadius: 20,
     elevation: 20,
  },
  footerPrice: {
     flex: 1,
  },
  fPriceLabel: {
     fontSize: 12,
     fontWeight: '700',
     color: Colors.slate[400],
  },
  fPriceValue: {
     fontSize: 22,
     fontWeight: '900',
     color: Colors.primary,
  },
  fPriceSub: {
     fontSize: 12,
     color: Colors.slate[400],
     fontWeight: '600',
  },
  actionBtnWrapper: {
     flex: 1.5,
     borderRadius: 15,
     overflow: 'hidden',
     shadowColor: Colors.pink,
     shadowOffset: { width: 0, height: 10 },
     shadowOpacity: 0.3,
     shadowRadius: 15,
     elevation: 10,
  },
  actionBtn: {
     height: 60,
     flexDirection: 'row',
     alignItems: 'center',
     justifyContent: 'center',
     gap: 10,
  },
  actionBtnText: {
     color: 'white',
     fontSize: 14,
     fontWeight: '900',
     letterSpacing: 1,
     fontStyle: 'italic',
  }
});

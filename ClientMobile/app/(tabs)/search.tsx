import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search as SearchIcon, MapPin, SlidersHorizontal, Star, ShieldCheck, Clock } from 'lucide-react-native';
import { Colors } from '../../constants/Colors';

const MOCK_VENUES = [
  {
    id: '1',
    name: 'Royal Orchid Palace',
    location: 'Nainital Road, Haldwani',
    price: '₹800',
    rating: 4.8,
    reviews: 120,
    type: 'Luxury Banquet Hall',
    image: 'https://picsum.photos/seed/11/600/400',
    verified: true,
  },
  {
    id: '2',
    name: 'The Grande Resort',
    location: 'Talli Bamauri, Haldwani',
    price: '1500',
    rating: 4.5,
    reviews: 85,
    type: 'Premium Resort',
    image: 'https://picsum.photos/seed/12/600/400',
    verified: true,
  },
  {
    id: '3',
    name: 'Silver Oak Gardens',
    location: 'Kathgodam, Uttarakhand',
    price: '600',
    rating: 4.2,
    reviews: 45,
    type: 'Open Lawn',
    image: 'https://picsum.photos/seed/13/600/400',
    verified: false,
  },
];

export default function SearchScreen() {
  const [search, setSearch] = useState('');

  const renderVenueItem = ({ item }: { item: typeof MOCK_VENUES[0] }) => (
    <TouchableOpacity style={styles.pdCard}>
      <View style={styles.venueImageWrapper}>
        <Image source={{ uri: item.image }} style={styles.venueImg} />
        <View style={styles.venuePriceBadge}>
          <Text style={styles.venuePriceText}>₹{item.price}/plate</Text>
        </View>
      </View>
      <View style={styles.pdCardBody}>
        <View style={styles.venueHeaderCol}>
          <View style={styles.venueNameRow}>
            <Text style={styles.venueName}>{item.name}</Text>
            {item.verified && (
              <View style={styles.vBadge}>
                <ShieldCheck size={12} color="white" />
              </View>
            )}
          </View>
          <View style={styles.locRow}>
             <MapPin size={12} color={Colors.primary} />
             <Text style={styles.venueLoc}>{item.location}</Text>
          </View>
        </View>
        <View style={styles.venueStats}>
          <View style={styles.vStat}>
            <Star size={14} color="#FACC15" fill="#FACC15" />
            <Text style={styles.vStatText}>{item.rating} ({item.reviews}+)</Text>
          </View>
          <View style={styles.vStat}>
            <Text style={[styles.venueType, { color: Colors.blue }]}>{item.type}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Find Your Venue</Text>
        <View style={styles.searchBar}>
          <SearchIcon size={20} color={Colors.slate[400]} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by venue name or city..."
            placeholderTextColor={Colors.slate[400]}
            value={search}
            onChangeText={setSearch}
          />
          <TouchableOpacity style={styles.filterBtn}>
            <SlidersHorizontal size={20} color={Colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={MOCK_VENUES}
        renderItem={renderVenueItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={() => (
           <View style={styles.listHeader}>
              <Text style={styles.resultCount}>Showing {MOCK_VENUES.length} Verified Venues</Text>
              <View style={styles.countUnderline} />
           </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    padding: 25,
    backgroundColor: 'white',
    gap: 15,
  },
  headerTitle: {
     fontSize: 24,
     fontWeight: '900',
     color: Colors.slate[900],
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.slate[50],
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 55,
    borderWidth: 1,
    borderColor: Colors.slate[100],
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    fontWeight: '700',
    color: Colors.slate[900],
  },
  filterBtn: {
    padding: 5,
  },
  listContent: {
    paddingHorizontal: 25,
    paddingBottom: 40,
  },
  listHeader: {
     marginBottom: 25,
  },
  resultCount: {
    fontSize: 12,
    fontWeight: '900',
    color: Colors.slate[400],
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  countUnderline: {
     width: 30,
     height: 3,
     backgroundColor: Colors.primary,
     marginTop: 6,
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
  locRow: {
     flexDirection: 'row',
     alignItems: 'center',
     gap: 5,
     marginTop: 5,
  },
  venueLoc: {
    fontSize: 14,
    color: Colors.slate[500],
    fontWeight: '600',
  },
  venueStats: {
    flexDirection: 'row',
    gap: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.slate[50],
    paddingTop: 15,
    justifyContent: 'space-between',
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
  venueType: {
     fontSize: 11,
     fontWeight: '900',
     textTransform: 'uppercase',
     letterSpacing: 1,
  }
});

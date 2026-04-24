import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  User, 
  Settings, 
  Heart, 
  Bell, 
  HelpCircle, 
  LogOut,
  ChevronRight,
  ShieldAlert
} from 'lucide-react-native';
import { Colors } from '../../constants/Colors';

export default function ProfileScreen() {
  const MENU_ITEMS = [
    { icon: <Heart size={20} color={Colors.text} />, label: 'Favorites', badge: '5' },
    { icon: <Bell size={20} color={Colors.text} />, label: 'Notifications', badge: '2' },
    { icon: <ShieldAlert size={20} color={Colors.text} />, label: 'Privacy Policy' },
    { icon: <HelpCircle size={20} color={Colors.text} />, label: 'Help Center' },
    { icon: <Settings size={20} color={Colors.text} />, label: 'Settings' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Profile Header */}
        <View style={styles.header}>
          <View style={styles.profileImageContainer}>
            <Image
              source={{ uri: 'https://i.pravatar.cc/150?u=haldwani' }}
              style={styles.profileImage}
            />
            <TouchableOpacity style={styles.editBtn}>
              <Text style={styles.editBtnText}>Edit</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.profileName}>Guest User</Text>
          <Text style={styles.profileEmail}>Sign in to save your preferences</Text>
          
          <TouchableOpacity style={styles.loginBtn}>
            <Text style={styles.loginBtnText}>Login / Signup</Text>
          </TouchableOpacity>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {MENU_ITEMS.map((item, index) => (
            <TouchableOpacity key={index} style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <View style={styles.iconContainer}>{item.icon}</View>
                <Text style={styles.menuLabel}>{item.label}</Text>
              </View>
              <View style={styles.menuItemRight}>
                {item.badge && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{item.badge}</Text>
                  </View>
                )}
                <ChevronRight size={20} color={Colors.border} />
              </View>
            </TouchableOpacity>
          ))}
          
          <TouchableOpacity style={[styles.menuItem, { marginTop: 20 }]}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.iconContainer, { backgroundColor: '#FEE2E2' }]}>
                <LogOut size={20} color={Colors.primary} />
              </View>
              <Text style={[styles.menuLabel, { color: Colors.primary }]}>Logout</Text>
            </View>
          </TouchableOpacity>
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.versionText}>Version 1.0.0</Text>
          <Text style={styles.brandingText}>Partydial © 2026</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: '#F8FAFC',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: 'white',
  },
  editBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'white',
  },
  editBtnText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  profileName: {
    fontSize: 22,
    fontWeight: '900',
    color: Colors.text,
  },
  profileEmail: {
    fontSize: 14,
    color: Colors.textMuted,
    marginTop: 5,
    fontWeight: '600',
  },
  loginBtn: {
    marginTop: 25,
    backgroundColor: Colors.text,
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 12,
  },
  loginBtnText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '800',
  },
  menuContainer: {
    padding: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  menuLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  badge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '900',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  versionText: {
    fontSize: 12,
    color: Colors.border,
    fontWeight: '700',
  },
  brandingText: {
    fontSize: 10,
    color: Colors.border,
    fontWeight: '900',
    marginTop: 5,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
});

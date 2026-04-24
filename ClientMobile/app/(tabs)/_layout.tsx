import { Tabs } from 'expo-router';
import { Home, Search, User, Heart, Zap } from 'lucide-react-native';
import { View, StyleSheet } from 'react-native';
import { Colors } from '../../constants/Colors';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.slate[400],
        tabBarShowLabel: true,
        tabBarLabelStyle: {
           fontSize: 10,
           fontWeight: '900',
           marginBottom: 8,
           textTransform: 'uppercase',
           letterSpacing: 0.5,
        },
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: Colors.slate[100],
          height: 70,
          paddingTop: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -10 },
          shadowOpacity: 0.05,
          shadowRadius: 15,
          elevation: 10,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconContainer, focused && styles.activeIcon]}>
               <Home size={focused ? 24 : 22} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color, focused }) => (
             <View style={[styles.iconContainer, focused && styles.activeIcon]}>
                <Search size={focused ? 24 : 22} color={color} />
             </View>
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Faves',
          tabBarIcon: ({ color, focused }) => (
             <View style={[styles.iconContainer, focused && styles.activeIcon]}>
                <Heart size={focused ? 24 : 22} color={color} />
             </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
             <View style={[styles.iconContainer, focused && styles.activeIcon]}>
                <User size={focused ? 24 : 22} color={color} />
             </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
   iconContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      width: 40,
      height: 40,
   },
   activeIcon: {
      backgroundColor: Colors.primary + '10',
      borderRadius: 12,
   }
});

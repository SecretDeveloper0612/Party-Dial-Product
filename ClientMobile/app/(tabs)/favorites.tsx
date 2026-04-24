import { StyleSheet, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Heart } from 'lucide-react-native';
import { Colors } from '../../constants/Colors';

export default function FavoritesScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Heart size={64} color={Colors.border} />
        </View>
        <Text style={styles.title}>No Favorites Yet</Text>
        <Text style={styles.subtitle}>Start exploring venues and save your favorites here!</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  iconContainer: {
    marginBottom: 20,
    opacity: 0.5,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: Colors.text,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textMuted,
    textAlign: 'center',
    fontWeight: '600',
    lineHeight: 22,
  },
});

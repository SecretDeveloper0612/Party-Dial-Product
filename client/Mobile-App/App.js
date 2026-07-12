import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  Platform,
  ActivityIndicator,
  Animated,
  Easing,
  Dimensions,
  Image,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Constants from 'expo-constants';

const { width, height } = Dimensions.get('window');

// Detect the local IP address for physical device testing
const getLocalUrl = () => {
  const debuggerHost = Constants.expoConfig?.hostUri || '';
  const ip = debuggerHost.split(':')[0];
  if (!ip) return 'http://10.0.2.2:3000';
  return `http://${ip}:3000`;
};

const PWA_URL = getLocalUrl();

// ─── Particle component ─────────────────────────────────────────────────────
function Particle({ delay, startX, startY, size, color }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 1,
            duration: 400,
            easing: Easing.out(Easing.back(1.5)),
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(translateY, {
            toValue: -(80 + Math.random() * 60),
            duration: 1200 + Math.random() * 600,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(translateX, {
            toValue: (Math.random() - 0.5) * 60,
            duration: 1200 + Math.random() * 600,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0,
            duration: 1200,
            delay: 300,
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 0.2,
            duration: 1200,
            delay: 300,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(translateY, { toValue: 0, duration: 0, useNativeDriver: true }),
          Animated.timing(translateX, { toValue: 0, duration: 0, useNativeDriver: true }),
          Animated.timing(scale, { toValue: 0, duration: 0, useNativeDriver: true }),
        ]),
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      style={{
        position: 'absolute',
        left: startX,
        top: startY,
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: color,
        opacity,
        transform: [{ translateY }, { translateX }, { scale }],
      }}
    />
  );
}

// ─── Splash Screen ───────────────────────────────────────────────────────────
function SplashScreen({ onFinish }) {
  // Animations
  const bgScale = useRef(new Animated.Value(1.2)).current;
  const bgOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoRotate = useRef(new Animated.Value(0)).current;
  const glowOpacity = useRef(new Animated.Value(0)).current;
  const glowScale = useRef(new Animated.Value(0.6)).current;
  const ring1Scale = useRef(new Animated.Value(0)).current;
  const ring1Opacity = useRef(new Animated.Value(0)).current;
  const ring2Scale = useRef(new Animated.Value(0)).current;
  const ring2Opacity = useRef(new Animated.Value(0)).current;
  const screenOpacity = useRef(new Animated.Value(1)).current;
  const shimmer = useRef(new Animated.Value(0)).current;

  // Particles config
  const particles = [
    { delay: 600, startX: width * 0.2, startY: height * 0.58, size: 8, color: '#FF6BF8' },
    { delay: 800, startX: width * 0.75, startY: height * 0.55, size: 6, color: '#6B8BFF' },
    { delay: 1000, startX: width * 0.45, startY: height * 0.62, size: 10, color: '#FF9F6B' },
    { delay: 1200, startX: width * 0.3, startY: height * 0.52, size: 7, color: '#6BFFD8' },
    { delay: 700, startX: width * 0.65, startY: height * 0.6, size: 9, color: '#FFE46B' },
    { delay: 900, startX: width * 0.5, startY: height * 0.56, size: 5, color: '#FF6B9F' },
    { delay: 1100, startX: width * 0.15, startY: height * 0.5, size: 8, color: '#B06BFF' },
    { delay: 1300, startX: width * 0.82, startY: height * 0.53, size: 6, color: '#6BDFFF' },
  ];

  useEffect(() => {
    // 1. Fade in splash (no background scale needed now)
    Animated.timing(bgOpacity, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    // 2. Glow pulse
    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(glowOpacity, { toValue: 0.6, duration: 1000, useNativeDriver: true }),
          Animated.timing(glowScale, { toValue: 1.15, duration: 1000, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(glowOpacity, { toValue: 0.3, duration: 1000, useNativeDriver: true }),
          Animated.timing(glowScale, { toValue: 0.95, duration: 1000, useNativeDriver: true }),
        ]),
      ])
    ).start();

    // 3. Logo entrance — spring bounce
    Animated.sequence([
      Animated.delay(300),
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 60,
          friction: 6,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(logoRotate, {
          toValue: 1,
          duration: 600,
          easing: Easing.out(Easing.back(1.5)),
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // 4. Expanding rings
    Animated.sequence([
      Animated.delay(500),
      Animated.parallel([
        Animated.timing(ring1Scale, { toValue: 1.8, duration: 1200, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        Animated.timing(ring1Opacity, { toValue: 0, duration: 1200, useNativeDriver: true }),
      ]),
    ]).start();

    Animated.sequence([
      Animated.delay(750),
      Animated.parallel([
        Animated.timing(ring2Scale, { toValue: 2.2, duration: 1400, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        Animated.timing(ring2Opacity, { toValue: 0, duration: 1400, useNativeDriver: true }),
        Animated.timing(ring1Opacity, { toValue: 0.5, duration: 0, useNativeDriver: true }),
        Animated.timing(ring1Scale, { toValue: 1, duration: 0, useNativeDriver: true }),
      ]),
    ]).start();

    // Reset + re-pulse rings
    Animated.loop(
      Animated.sequence([
        Animated.delay(500),
        Animated.parallel([
          Animated.timing(ring1Scale, { toValue: 1, duration: 0, useNativeDriver: true }),
          Animated.timing(ring1Opacity, { toValue: 0.5, duration: 0, useNativeDriver: true }),
          Animated.timing(ring2Scale, { toValue: 1, duration: 0, useNativeDriver: true }),
          Animated.timing(ring2Opacity, { toValue: 0.3, duration: 0, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(ring1Scale, { toValue: 2, duration: 1400, easing: Easing.out(Easing.quad), useNativeDriver: true }),
          Animated.timing(ring1Opacity, { toValue: 0, duration: 1400, useNativeDriver: true }),
          Animated.timing(ring2Scale, { toValue: 2.4, duration: 1800, easing: Easing.out(Easing.quad), useNativeDriver: true }),
          Animated.timing(ring2Opacity, { toValue: 0, duration: 1800, useNativeDriver: true }),
        ]),
        Animated.delay(600),
      ])
    ).start();

    // 5. Shimmer effect
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, { toValue: 1, duration: 1500, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(shimmer, { toValue: 0, duration: 1500, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ])
    ).start();

    // 6. Exit after 3s — fade out
    const exitTimer = setTimeout(() => {
      Animated.timing(screenOpacity, {
        toValue: 0,
        duration: 600,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }).start(() => onFinish());
    }, 3200);

    return () => clearTimeout(exitTimer);
  }, []);

  const spin = logoRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['-15deg', '0deg'],
  });

  const shimmerOpacity = shimmer.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0.15, 0],
  });

  return (
    <Animated.View style={[styles.splashContainer, { opacity: screenOpacity }]}>
      {/* Particles */}
      {particles.map((p, i) => (
        <Particle key={i} {...p} />
      ))}

      {/* Expanding rings */}
      <Animated.View
        style={[
          styles.ring,
          {
            opacity: ring1Opacity,
            transform: [{ scale: ring1Scale }],
            borderColor: 'rgba(176, 107, 255, 0.6)',
          },
        ]}
      />
      <Animated.View
        style={[
          styles.ring,
          {
            opacity: ring2Opacity,
            transform: [{ scale: ring2Scale }],
            borderColor: 'rgba(255, 107, 248, 0.4)',
          },
        ]}
      />

      {/* Pulsing glow behind logo */}
      <Animated.View
        style={[
          styles.glowCircle,
          {
            opacity: glowOpacity,
            transform: [{ scale: glowScale }],
          },
        ]}
      />

      {/* Logo */}
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: logoOpacity,
            transform: [{ scale: logoScale }, { rotate: spin }],
          },
        ]}
      >
        <Image
          source={require('./assets/party-dial-logo.jpg')}
          style={styles.logo}
          resizeMode="cover"
        />

        {/* Shimmer overlay */}
        <Animated.View
          style={[
            StyleSheet.absoluteFillObject,
            {
              backgroundColor: 'white',
              opacity: shimmerOpacity,
              borderRadius: 36,
            },
          ]}
        />
      </Animated.View>
    </Animated.View>
  );
}

// ─── Main App ────────────────────────────────────────────────────────────────
export default function App() {
  const [splashDone, setSplashDone] = useState(false);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" backgroundColor="#FFFFFF" />

        {!splashDone && (
          <SplashScreen onFinish={() => setSplashDone(true)} />
        )}

        {splashDone && (
          <View style={styles.content}>
            <WebView
              source={{ uri: PWA_URL }}
              style={styles.webview}
              startInLoadingState={true}
              renderLoading={() => (
                <View style={styles.loader}>
                  <ActivityIndicator size="large" color="#6366F1" />
                </View>
              )}
              allowsBackForwardNavigationGestures={true}
              domStorageEnabled={true}
              javaScriptEnabled={true}
              userAgent="Mozilla/5.0 (Mobile) PartyDialMobileApp"
            />
          </View>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const LOGO_SIZE = 170;
const RING_SIZE = LOGO_SIZE + 20;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
  loader: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },

  // Splash
  splashContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    zIndex: 999,
    overflow: 'hidden',
  },


  // Rings
  ring: {
    position: 'absolute',
    width: RING_SIZE,
    height: RING_SIZE,
    borderRadius: RING_SIZE / 2,
    borderWidth: 2,
  },

  // Glow circle
  glowCircle: {
    position: 'absolute',
    width: LOGO_SIZE + 60,
    height: LOGO_SIZE + 60,
    borderRadius: (LOGO_SIZE + 60) / 2,
    backgroundColor: 'transparent',
    shadowColor: '#B06BFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 50,
    elevation: 30,
    // Colored glow via bg
    backgroundColor: 'rgba(176, 107, 255, 0.18)',
  },

  // Logo
  logoContainer: {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
    borderRadius: 36,
    overflow: 'hidden',
    shadowColor: '#FF6BF8',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.7,
    shadowRadius: 30,
    elevation: 25,
  },
  logo: {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
    borderRadius: 36,
  },
});

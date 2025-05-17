import React, { useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  FadeIn,
  FadeInDown
} from 'react-native-reanimated';
import AuthPanel from '../components/AuthPanel';
import { ICONS, Icon } from '../components/Icons';

const { width, height } = Dimensions.get('window');

export default function AuthScreen() {
  const navigation = useNavigation();
  
  const logoOpacity = useSharedValue(0);
  const logoTranslateX = useSharedValue(-20);

  const logoAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: logoOpacity.value,
      transform: [{ translateX: logoTranslateX.value }]
    };
  });
  
  useEffect(() => {
    logoOpacity.value = withTiming(1, { duration: 600 });
    logoTranslateX.value = withTiming(0, { duration: 600 });
  }, []);

  //useEffect(() => {
  //  if (user && !isLoading) {
  //    // @ts-ignore - we'll handle typing for navigation later
  //    navigation.navigate('Main');
  //  }
  //}, [user, isLoading, navigation]);

  const features = [
    {
      icon: ICONS.MAP,
      title: 'Real-time Traffic Updates',
      description: 'Get live traffic data and avoid congestion'
    },
    {
      icon: ICONS.WARNING,
      title: 'Community Incident Reports',
      description: 'Be warned about accidents and hazards ahead'
    },
    {
      icon: ICONS.ROUTE,
      title: 'Smart Route Calculation',
      description: 'Multiple route options based on your preferences'
    },
    {
      icon: ICONS.SHARE,
      title: 'Easy Route Sharing',
      description: 'Share routes via QR code or direct links'
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['rgba(0,118,255,0.3)', 'transparent', 'rgba(128,0,255,0.4)']}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
        <View style={styles.logoIconContainer}>
          <LinearGradient
            colors={['#0070f3', '#0055b3']}
            style={styles.logoIconGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Icon name={ICONS.NAVIGATION} size={24} color="white" />
          </LinearGradient>
        </View>
        
        <View style={styles.logoTextContainer}>
          <Text style={styles.logoTitle}>SupMap</Text>
          <Text style={styles.logoSubtitle}>Navigate together</Text>
        </View>
      </Animated.View>
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={true}
        bounces={true}
      >
        <Animated.View 
          entering={FadeInDown.delay(300).duration(700)}
          style={styles.authPanelContainer}
        >
          <AuthPanel />
        </Animated.View>
        
        <View style={styles.featuresContainer}>
          <Animated.Text 
            entering={FadeIn.delay(400).duration(700)}
            style={styles.featuresTitle}
          >
            Real-time Navigation with Community Power
          </Animated.Text>
          
          {features.map((feature, index) => (
            <Animated.View 
              key={feature.title}
              entering={FadeInDown.delay(500 + index * 100).duration(700)}
              style={styles.featureCard}
            >
              <View style={styles.featureIconContainer}>
                <LinearGradient
                  colors={['#0070f3', '#0055b3']}
                  style={styles.featureIconGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Icon name={feature.icon} size={24} color="white" />
                </LinearGradient>
              </View>
              
              <View style={styles.featureTextContainer}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </View>
            </Animated.View>
          ))}
        </View>
        
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  scrollView: {
    flex: 1,
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  logoContainer: {
    position: 'absolute',
    top: 40,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoIconContainer: {
    marginRight: 12,
  },
  logoIconGradient: {
    padding: 12,
    borderRadius: 50,
    shadowColor: '#0070f3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  logoTextContainer: {
    marginLeft: 8,
  },
  logoTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  logoSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 2,
  },
  content: {
    paddingTop: 100,
    flexDirection: 'column',
    flexGrow: 1,
  },
  authPanelContainer: {
    padding: 24,
    marginHorizontal: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(136, 56, 56, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
    marginBottom: 30,
    minHeight: 400
  },
  featuresContainer: {
    padding: 24,
  },
  featuresTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 24,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  featureIconContainer: {
    marginRight: 16,
  },
  featureIconGradient: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 112, 243, 0.2)',
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  bottomSpacer: {
    height: 40,
  }
});
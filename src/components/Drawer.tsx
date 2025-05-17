import { useEffect, useRef, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Animated, 
  Dimensions, 
  ScrollView 
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

type DrawerProps = {
  isOpen: boolean;
  onClose: () => void;
};

const { width, height } = Dimensions.get('window');

const Drawer = ({ isOpen, onClose }: DrawerProps) => {
  const navigation = useNavigation();
  const menuAnimation = useRef(new Animated.Value(-width * 0.8)).current;
  const overlayAnimation = useRef(new Animated.Value(0)).current;
  const [isRendered, setIsRendered] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setIsRendered(true);
      Animated.parallel([
        Animated.timing(menuAnimation, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(overlayAnimation, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Fermer le drawer
      Animated.parallel([
        Animated.timing(menuAnimation, {
          toValue: -width * 0.8,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(overlayAnimation, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setIsRendered(false);
      });
    }
  }, [isOpen]);

  const menuItems = [
    { name: 'Profil', screen: 'Profil', icon: 'user' },
    { name: 'Carte', screen: 'Carte', icon: 'map' },
    { name: 'Trajets', screen: 'Trips', icon: 'navigation' },
    { name: 'Statistiques', screen: 'Statistiques', icon: 'activity' },
    { name: 'Paramètres', screen: 'Settings', icon: 'settings' },
    { name: 'Aides', screen: 'Aides', icon: 'help-circle' },
  ];

  const navigateTo = (screen: string) => {
    onClose();
    setTimeout(() => {
      // @ts-ignore - we'll fix typing later
      navigation.navigate(screen);
    }, 300);
  };

  if (!isRendered) {
    return null;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <Animated.View 
          style={[
            styles.overlayBackground,
            { opacity: overlayAnimation }
          ]} 
        />
      </TouchableOpacity>

      <Animated.View
        style={[
          styles.menuContainer,
          {
            transform: [{ translateX: menuAnimation }],
          },
        ]}
      >
        <View style={styles.menuHeader}>
          <View style={styles.headerContent}>
            <Text style={styles.menuTitle}>SupMap</Text>
            <Text style={styles.menuSubtitle}>Navigation en temps réel</Text>
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Feather name="x" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.menuItems}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.name}
              style={styles.menuItem}
              onPress={() => navigateTo(item.screen)}
            >
              <Feather name={item.icon as any} size={20} color="#fff" />
              <Text style={styles.menuItemText}>{item.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.menuFooter}>
          <TouchableOpacity style={styles.logoutButton}>
            <Feather name="log-out" size={18} color="#ff5252" />
            <Text style={styles.logoutText}>Déconnexion</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  overlayBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  menuContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width * 0.8,
    height: height,
    backgroundColor: '#1a1a1a',
    paddingTop: 50,
    flexDirection: 'column',
  },
  menuHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerContent: {
    flex: 1,
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  menuTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  menuSubtitle: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    marginTop: 4,
  },
  menuItems: {
    flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  menuItemText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 16,
  },
  menuFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutText: {
    color: '#ff5252',
    marginLeft: 12,
    fontSize: 16,
  },
});

export default Drawer;
// Layout.tsx
import React, { ReactNode, useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import Drawer from './Drawer';

type Props = {
  children: ReactNode;
};

const Layout = ({ children }: Props) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Juste le bouton hamburger */}
      <View style={styles.menuButtonWrapper}>
        <TouchableOpacity onPress={toggleDrawer} style={styles.menuButton}>
          <Feather name="menu" size={24} color="#fff" />
        </TouchableOpacity>
      </View>


      {/* Contenu principal */}
      <View style={styles.content}>
        {children}
      </View>

      {/* Drawer menu */}
      <Drawer isOpen={drawerOpen} onClose={closeDrawer} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  }, menuButtonWrapper: {
    position: 'absolute',
    top: 40,
    left: 10,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 20,
    padding: 8,
  },
  menuButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
});

export default Layout;

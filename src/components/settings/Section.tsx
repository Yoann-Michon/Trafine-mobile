import { ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface SettingSectionProps {
  title: string;
  titleColor: string;
  children: ReactNode;
}

const SettingSection = ({ title, titleColor, children }: SettingSectionProps) => {
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: titleColor }]}>{title}</Text>
      <View style={styles.sectionContent}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    marginLeft: 4,
  },
  sectionContent: {
    borderRadius: 12,
    overflow: 'hidden',
  },
});

export default SettingSection;
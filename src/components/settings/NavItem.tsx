import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ComponentProps } from 'react';

type MaterialCommunityIconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

interface SettingNavItemProps {
  title: string;
  iconName: MaterialCommunityIconName;
  backgroundColor: string;
  primaryColor: string;
  textColor: string;
  description: string;
  onPress: () => void;
  showChevron?: boolean;
}

const SettingNavItem = ({ 
  title, 
  iconName, 
  backgroundColor, 
  primaryColor, 
  textColor, 
  description, 
  onPress, 
  showChevron = true 
}: SettingNavItemProps) => {
  return (
    <TouchableOpacity 
      style={[styles.settingItem, { backgroundColor }]}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.settingLeft}>
        <MaterialCommunityIcons name={iconName} size={24} color={primaryColor} style={styles.settingIcon} />
        <Text style={[styles.settingTitle, { color: textColor }]}>{title}</Text>
      </View>
      <View style={styles.settingRight}>
        {description !== "" && (
          <Text style={styles.settingDescription}>{description}</Text>
        )}
        {showChevron && (
          <MaterialCommunityIcons name="chevron-right" size={20} color="#777" />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingDescription: {
    fontSize: 14,
    color: '#777',
    marginRight: 8,
  },
});

export default SettingNavItem;
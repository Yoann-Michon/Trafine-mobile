import { ComponentProps } from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type MaterialCommunityIconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

interface SettingToggleProps {
  title: string;
  iconName: MaterialCommunityIconName;
  value: boolean;
  onValueChange: (value: boolean) => void;
  backgroundColor: string;
  primaryColor: string;
  textColor: string;
}

const SettingToggle = ({ 
  title, 
  iconName, 
  value, 
  onValueChange, 
  backgroundColor, 
  primaryColor, 
  textColor 
}: SettingToggleProps) => {
  return (
    <View style={[styles.settingItem, { backgroundColor }]}>
      <View style={styles.settingLeft}>
        <MaterialCommunityIcons name={iconName} size={24} color={primaryColor} style={styles.settingIcon} />
        <Text style={[styles.settingTitle, { color: textColor }]}>{title}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#767577', true: `${primaryColor}80` }}
        thumbColor={value ? primaryColor : '#f4f3f4'}
        ios_backgroundColor="#3e3e3e"
      />
    </View>
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
});

export default SettingToggle;
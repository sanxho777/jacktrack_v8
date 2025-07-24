import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Bluetooth, Bell, MapPin, Shield, CircleHelp as HelpCircle, User, Settings as SettingsIcon, ChevronRight, Trash2, Download } from 'lucide-react-native';

export default function SettingsScreen() {
  const [bluetoothEnabled, setBluetoothEnabled] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [locationTracking, setLocationTracking] = useState(true);
  const [autoSave, setAutoSave] = useState(true);

  const handleDeleteAllData = () => {
    Alert.alert(
      'Delete All Data',
      'This will permanently delete all your game history, settings, and tracked balls. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Success', 'All data has been deleted.');
          },
        },
      ]
    );
  };

  const handleExportData = () => {
    Alert.alert(
      'Export Data',
      'Export your game history and settings to share or backup.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Export',
          onPress: () => {
            Alert.alert('Success', 'Data exported successfully!');
          },
        },
      ]
    );
  };

  const handleAbout = () => {
    Alert.alert(
      'About JackTrack',
      'JackTrack v1.0.0\n\nNever lose a golf ball again! Track your balls, keep score, and improve your game.\n\n© 2025 JackTrack Golf Solutions',
      [{ text: 'OK' }]
    );
  };

  const SettingsSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContent}>{children}</View>
    </View>
  );

  const SettingsItem = ({
    icon,
    title,
    subtitle,
    onPress,
    hasSwitch = false,
    switchValue,
    onSwitchChange,
  }: {
    icon: React.ReactNode;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    hasSwitch?: boolean;
    switchValue?: boolean;
    onSwitchChange?: (value: boolean) => void;
  }) => (
    <TouchableOpacity
      style={styles.settingsItem}
      onPress={onPress}
      activeOpacity={hasSwitch ? 1 : 0.7}>
      <View style={styles.itemLeft}>
        <View style={styles.iconContainer}>{icon}</View>
        <View style={styles.itemText}>
          <Text style={styles.itemTitle}>{title}</Text>
          {subtitle && <Text style={styles.itemSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      <View style={styles.itemRight}>
        {hasSwitch ? (
          <Switch
            value={switchValue}
            onValueChange={onSwitchChange}
            trackColor={{ false: '#D1D5DB', true: '#86EFAC' }}
            thumbColor={switchValue ? '#22C55E' : '#F3F4F6'}
          />
        ) : (
          <ChevronRight size={20} color="#9CA3AF" />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#F0FDF4', '#DCFCE7']}
        style={styles.headerGradient}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Settings</Text>
          <View style={styles.headerIcon}>
            <SettingsIcon size={24} color="#22C55E" />
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <SettingsSection title="Device & Connectivity">
          <SettingsItem
            icon={<Bluetooth size={20} color="#3B82F6" />}
            title="Bluetooth Tracking"
            subtitle="Enable ball tracking via Bluetooth"
            hasSwitch
            switchValue={bluetoothEnabled}
            onSwitchChange={setBluetoothEnabled}
          />
          <SettingsItem
            icon={<MapPin size={20} color="#22C55E" />}
            title="Location Services"
            subtitle="Allow location tracking for course mapping"
            hasSwitch
            switchValue={locationTracking}
            onSwitchChange={setLocationTracking}
          />
        </SettingsSection>

        <SettingsSection title="Game Preferences">
          <SettingsItem
            icon={<Bell size={20} color="#F59E0B" />}
            title="Notifications"
            subtitle="Ball found alerts and game reminders"
            hasSwitch
            switchValue={notifications}
            onSwitchChange={setNotifications}
          />
          <SettingsItem
            icon={<Download size={20} color="#6B7280" />}
            title="Auto-Save Scorecards"
            subtitle="Automatically save completed rounds"
            hasSwitch
            switchValue={autoSave}
            onSwitchChange={setAutoSave}
          />
        </SettingsSection>

        <SettingsSection title="Account & Data">
          <SettingsItem
            icon={<User size={20} color="#8B5CF6" />}
            title="Profile"
            subtitle="Manage your player profile"
            onPress={() => Alert.alert('Profile', 'Profile settings coming soon!')}
          />
          <SettingsItem
            icon={<Download size={20} color="#22C55E" />}
            title="Export Data"
            subtitle="Backup your game history and settings"
            onPress={handleExportData}
          />
          <SettingsItem
            icon={<Trash2 size={20} color="#EF4444" />}
            title="Delete All Data"
            subtitle="Permanently remove all app data"
            onPress={handleDeleteAllData}
          />
        </SettingsSection>

        <SettingsSection title="Support & Information">
          <SettingsItem
            icon={<HelpCircle size={20} color="#3B82F6" />}
            title="Help & Support"
            subtitle="Get help using JackTrack"
            onPress={() => Alert.alert('Help', 'Support documentation coming soon!')}
          />
          <SettingsItem
            icon={<Shield size={20} color="#6B7280" />}
            title="Privacy Policy"
            subtitle="How we protect your data"
            onPress={() => Alert.alert('Privacy', 'Privacy policy coming soon!')}
          />
          <SettingsItem
            icon={<SettingsIcon size={20} color="#9CA3AF" />}
            title="About JackTrack"
            subtitle="App version and information"
            onPress={handleAbout}
          />
        </SettingsSection>

        <View style={styles.footer}>
          <Text style={styles.footerText}>JackTrack Golf Solutions</Text>
          <Text style={styles.footerVersion}>Version 1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  headerGradient: {
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1F2937',
  },
  headerIcon: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 12,
  },
  sectionContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  itemText: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  itemSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  itemRight: {
    marginLeft: 12,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingBottom: 60,
  },
  footerText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  footerVersion: {
    fontSize: 12,
    color: '#D1D5DB',
    marginTop: 4,
  },
});
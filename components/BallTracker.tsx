import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Navigation, Battery, Wifi, WifiOff } from 'lucide-react-native';

interface Ball {
  id: string;
  name: string;
  x: number;
  y: number;
  connected: boolean;
  batteryLevel: number;
}

interface BallTrackerProps {
  ball: Ball;
  playerPosition: { x: number; y: number };
  onNavigate: () => void;
  isSelected: boolean;
}

export function BallTracker({ ball, playerPosition, onNavigate, isSelected }: BallTrackerProps) {
  const distance = Math.floor(
    Math.sqrt(
      Math.pow(ball.x - playerPosition.x, 2) +
        Math.pow(ball.y - playerPosition.y, 2)
    ) * 2
  );

  const getBatteryColor = (level: number) => {
    if (level > 60) return '#22C55E';
    if (level > 30) return '#F59E0B';
    return '#EF4444';
  };

  const getSignalStrength = (distance: number) => {
    if (distance < 50) return 'Strong';
    if (distance < 100) return 'Good';
    if (distance < 200) return 'Fair';
    return 'Weak';
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        isSelected && styles.selectedContainer,
      ]}
      onPress={onNavigate}
      activeOpacity={0.7}>
      <LinearGradient
        colors={
          isSelected
            ? ['#FEF3C7', '#FBBF24']
            : ball.connected
            ? ['#F0FDF4', '#DCFCE7']
            : ['#FEF2F2', '#FECACA']
        }
        style={styles.gradient}>
        <View style={styles.header}>
          <View style={styles.ballInfo}>
            <Text style={styles.ballName}>{ball.name}</Text>
            <View style={styles.statusIndicator}>
              {ball.connected ? (
                <Wifi size={12} color="#22C55E" />
              ) : (
                <WifiOff size={12} color="#EF4444" />
              )}
              <Text
                style={[
                  styles.statusText,
                  { color: ball.connected ? '#22C55E' : '#EF4444' },
                ]}>
                {ball.connected ? getSignalStrength(distance) : 'Disconnected'}
              </Text>
            </View>
          </View>
          
          <TouchableOpacity style={styles.navigateButton} onPress={onNavigate}>
            <Navigation size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.details}>
          <View style={styles.distanceContainer}>
            <Text style={styles.distanceLabel}>Distance</Text>
            <Text style={styles.distanceValue}>{distance} yds</Text>
          </View>

          <View style={styles.batteryContainer}>
            <Battery
              size={14}
              color={getBatteryColor(ball.batteryLevel)}
            />
            <Text
              style={[
                styles.batteryText,
                { color: getBatteryColor(ball.batteryLevel) },
              ]}>
              {ball.batteryLevel}%
            </Text>
          </View>
        </View>

        {ball.connected && (
          <View style={styles.lastSeenContainer}>
            <Text style={styles.lastSeenText}>Last updated: Just now</Text>
          </View>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedContainer: {
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  gradient: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  ballInfo: {
    flex: 1,
  },
  ballName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    marginLeft: 4,
    fontSize: 12,
    fontWeight: '600',
  },
  navigateButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 20,
    padding: 8,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  distanceContainer: {
    flex: 1,
  },
  distanceLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  distanceValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1F2937',
  },
  batteryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  batteryText: {
    marginLeft: 4,
    fontSize: 12,
    fontWeight: '600',
  },
  lastSeenContainer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  lastSeenText: {
    fontSize: 10,
    color: '#9CA3AF',
    fontWeight: '500',
  },
});
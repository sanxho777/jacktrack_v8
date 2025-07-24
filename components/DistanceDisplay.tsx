import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Target, MapPin } from 'lucide-react-native';

interface Ball {
  id: string;
  name: string;
  x: number;
  y: number;
  connected: boolean;
  batteryLevel: number;
}

interface DistanceDisplayProps {
  playerPosition: { x: number; y: number };
  holePosition: { x: number; y: number };
  trackedBalls: Ball[];
}

export function DistanceDisplay({
  playerPosition,
  holePosition,
  trackedBalls,
}: DistanceDisplayProps) {
  const distanceToHole = Math.floor(
    Math.sqrt(
      Math.pow(holePosition.x - playerPosition.x, 2) +
        Math.pow(holePosition.y - playerPosition.y, 2)
    ) * 2
  );

  const nearestBall = trackedBalls.reduce((nearest, ball) => {
    if (!ball.connected) return nearest;
    
    const distance = Math.sqrt(
      Math.pow(ball.x - playerPosition.x, 2) +
        Math.pow(ball.y - playerPosition.y, 2)
    );
    
    if (!nearest || distance < nearest.distance) {
      return { ball, distance: distance * 2 };
    }
    return nearest;
  }, null);

  return (
    <View style={styles.container}>
      <View style={styles.distanceCard}>
        <View style={styles.iconContainer}>
          <Target size={20} color="#22C55E" />
        </View>
        <View style={styles.distanceInfo}>
          <Text style={styles.distanceLabel}>To Hole</Text>
          <Text style={styles.distanceValue}>{distanceToHole} yds</Text>
        </View>
      </View>

      {nearestBall && (
        <View style={styles.distanceCard}>
          <View style={[styles.iconContainer, { backgroundColor: '#FEF3C7' }]}>
            <MapPin size={20} color="#F59E0B" />
          </View>
          <View style={styles.distanceInfo}>
            <Text style={styles.distanceLabel}>Nearest Ball</Text>
            <Text style={styles.distanceValue}>
              {Math.floor(nearestBall.distance)} yds
            </Text>
            <Text style={styles.ballName}>{nearestBall.ball.name}</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 12,
  },
  distanceCard: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0FDF4',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  distanceInfo: {
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
  ballName: {
    fontSize: 10,
    color: '#9CA3AF',
    fontWeight: '500',
  },
});
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  MapPin,
  Target,
  Navigation,
  Bluetooth,
  Plus,
  Minus,
  RotateCcw,
} from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { CourseMap } from '@/components/CourseMap';
import { BallTracker } from '@/components/BallTracker';
import { DistanceDisplay } from '@/components/DistanceDisplay';

export default function CourseScreen() {
  const [currentHole, setCurrentHole] = useState(1);
  const [trackedBalls, setTrackedBalls] = useState([
    {
      id: 'ball1',
      name: 'Player 1',
      x: 150,
      y: 200,
      connected: true,
      batteryLevel: 85,
    },
    {
      id: 'ball2',
      name: 'Player 2',
      x: 180,
      y: 220,
      connected: true,
      batteryLevel: 72,
    },
  ]);
  const [playerPosition, setPlayerPosition] = useState({ x: 100, y: 180 });
  const [selectedBall, setSelectedBall] = useState(null);
  const [bluetoothConnected, setBluetoothConnected] = useState(true);

  const pulseAnimation = useSharedValue(1);
  const bluetoothAnimation = useSharedValue(0);

  useEffect(() => {
    pulseAnimation.value = withRepeat(
      withTiming(1.2, { duration: 1000 }),
      -1,
      true
    );

    bluetoothAnimation.value = bluetoothConnected ? 1 : 0;
  }, [bluetoothConnected]);

  const animatedPulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseAnimation.value }],
  }));

  const animatedBluetoothStyle = useAnimatedStyle(() => ({
    opacity: withSpring(bluetoothAnimation.value),
  }));

  const handleAddBall = () => {
    Alert.alert(
      'Add New Ball',
      'Scan for nearby trackable golf balls',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Scan',
          onPress: () => {
            // Simulate adding a new ball
            const newBall = {
              id: `ball${trackedBalls.length + 1}`,
              name: `Player ${trackedBalls.length + 1}`,
              x: Math.random() * 300,
              y: Math.random() * 400,
              connected: true,
              batteryLevel: Math.floor(Math.random() * 50) + 50,
            };
            setTrackedBalls([...trackedBalls, newBall]);
          },
        },
      ]
    );
  };

  const handleNavigateToBall = (ball) => {
    setSelectedBall(ball);
    Alert.alert(
      'Navigate to Ball',
      `Distance: ${Math.floor(
        Math.sqrt(
          Math.pow(ball.x - playerPosition.x, 2) +
            Math.pow(ball.y - playerPosition.y, 2)
        )
      )} yards\n\nStart turn-by-turn navigation?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Navigate', onPress: () => console.log('Starting navigation') },
      ]
    );
  };

  const toggleBluetooth = () => {
    setBluetoothConnected(!bluetoothConnected);
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#F0FDF4', '#DCFCE7']}
        style={styles.headerGradient}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.courseName}>Pebble Beach Golf Links</Text>
            <View style={styles.holeSelector}>
              <TouchableOpacity
                style={styles.holeButton}
                onPress={() => setCurrentHole(Math.max(1, currentHole - 1))}>
                <Minus size={16} color="#22C55E" />
              </TouchableOpacity>
              <Text style={styles.holeText}>Hole {currentHole}</Text>
              <TouchableOpacity
                style={styles.holeButton}
                onPress={() => setCurrentHole(Math.min(18, currentHole + 1))}>
                <Plus size={16} color="#22C55E" />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={styles.bluetoothButton}
              onPress={toggleBluetooth}>
              <Animated.View style={animatedBluetoothStyle}>
                <Bluetooth
                  size={24}
                  color={bluetoothConnected ? '#22C55E' : '#EF4444'}
                />
              </Animated.View>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.mapContainer}>
        <CourseMap
          holeNumber={currentHole}
          playerPosition={playerPosition}
          trackedBalls={trackedBalls}
          selectedBall={selectedBall}
          onBallPress={setSelectedBall}
        />
        
        <Animated.View style={[styles.playerIndicator, animatedPulseStyle]}>
          <MapPin size={20} color="#3B82F6" />
        </Animated.View>
      </View>

      <ScrollView style={styles.bottomPanel} showsVerticalScrollIndicator={false}>
        <View style={styles.distanceSection}>
          <Text style={styles.sectionTitle}>Distances</Text>
          <DistanceDisplay
            playerPosition={playerPosition}
            holePosition={{ x: 250, y: 100 }}
            trackedBalls={trackedBalls}
          />
        </View>

        <View style={styles.ballSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Tracked Balls</Text>
            <TouchableOpacity style={styles.addButton} onPress={handleAddBall}>
              <Plus size={16} color="#FFFFFF" />
              <Text style={styles.addButtonText}>Add Ball</Text>
            </TouchableOpacity>
          </View>
          
          {trackedBalls.map((ball) => (
            <BallTracker
              key={ball.id}
              ball={ball}
              playerPosition={playerPosition}
              onNavigate={() => handleNavigateToBall(ball)}
              isSelected={selectedBall?.id === ball.id}
            />
          ))}
        </View>

        <TouchableOpacity style={styles.refreshButton}>
          <RotateCcw size={16} color="#6B7280" />
          <Text style={styles.refreshText}>Refresh Locations</Text>
        </TouchableOpacity>
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
    paddingTop: Platform.OS === 'ios' ? 0 : 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerLeft: {
    flex: 1,
  },
  courseName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  holeSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: 'flex-start',
  },
  holeButton: {
    padding: 4,
  },
  holeText: {
    marginHorizontal: 12,
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  headerRight: {
    alignItems: 'center',
  },
  bluetoothButton: {
    padding: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  playerIndicator: {
    position: 'absolute',
    top: 180,
    left: 100,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  bottomPanel: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 20,
    maxHeight: 300,
  },
  distanceSection: {
    marginBottom: 20,
  },
  ballSection: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#22C55E',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginBottom: 20,
  },
  refreshText: {
    marginLeft: 6,
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '500',
  },
});
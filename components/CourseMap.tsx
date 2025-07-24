import React from 'react';
import { View, StyleSheet, Text, Pressable } from 'react-native';
import Svg, {
  Rect,
  Circle,
  Path,
  Defs,
  LinearGradient as SvgLinearGradient,
  Stop,
  G,
} from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

interface Ball {
  id: string;
  name: string;
  x: number;
  y: number;
  connected: boolean;
  batteryLevel: number;
}

interface CourseMapProps {
  holeNumber: number;
  playerPosition: { x: number; y: number };
  trackedBalls: Ball[];
  selectedBall: Ball | null;
  onBallPress: (ball: Ball) => void;
}

export function CourseMap({
  holeNumber,
  playerPosition,
  trackedBalls,
  selectedBall,
  onBallPress,
}: CourseMapProps) {
  const holePosition = { x: 250, y: 100 };
  const teePosition = { x: 100, y: 350 };

  const selectedBallAnimation = useSharedValue(1);

  React.useEffect(() => {
    if (selectedBall) {
      selectedBallAnimation.value = withRepeat(
        withTiming(1.3, { duration: 500 }),
        -1,
        true
      );
    } else {
      selectedBallAnimation.value = 1;
    }
  }, [selectedBall]);

  const animatedSelectedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: selectedBallAnimation.value }],
  }));

  return (
    <View style={styles.container}>
      <Svg width="100%" height="100%" viewBox="0 0 350 400">
        <Defs>
          <SvgLinearGradient id="fairwayGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#22C55E" stopOpacity="0.3" />
            <Stop offset="100%" stopColor="#16A34A" stopOpacity="0.5" />
          </SvgLinearGradient>
          <SvgLinearGradient id="greenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#16A34A" stopOpacity="0.6" />
            <Stop offset="100%" stopColor="#15803D" stopOpacity="0.8" />
          </SvgLinearGradient>
        </Defs>

        {/* Course Background */}
        <Rect x="0" y="0" width="350" height="400" fill="#F0FDF4" />

        {/* Fairway */}
        <Path
          d={`M ${teePosition.x} ${teePosition.y} 
              Q 175 300 ${holePosition.x} ${holePosition.y + 50}
              Q 275 80 ${holePosition.x} ${holePosition.y}
              Q 225 80 175 200
              Q 125 280 ${teePosition.x} ${teePosition.y}`}
          fill="url(#fairwayGradient)"
          stroke="#16A34A"
          strokeWidth="2"
        />

        {/* Green */}
        <Circle
          cx={holePosition.x}
          cy={holePosition.y}
          r="30"
          fill="url(#greenGradient)"
          stroke="#15803D"
          strokeWidth="2"
        />

        {/* Hole */}
        <Circle cx={holePosition.x} cy={holePosition.y} r="3" fill="#000000" />
        
        {/* Flag */}
        <Path
          d={`M ${holePosition.x + 3} ${holePosition.y} 
              L ${holePosition.x + 3} ${holePosition.y - 20}
              L ${holePosition.x + 15} ${holePosition.y - 15}
              L ${holePosition.x + 3} ${holePosition.y - 10}`}
          fill="#EF4444"
          stroke="#DC2626"
          strokeWidth="1"
        />

        {/* Tee Box */}
        <Rect
          x={teePosition.x - 15}
          y={teePosition.y - 10}
          width="30"
          height="20"
          rx="5"
          fill="#A3A3A3"
          stroke="#737373"
          strokeWidth="1"
        />

        {/* Sand Traps */}
        <Circle cx="200" cy="250" r="20" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="1" />
        <Circle cx="120" cy="180" r="15" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="1" />

        {/* Water Hazard */}
        <Path
          d="M 280 200 Q 320 220 310 260 Q 290 280 270 260 Q 260 240 280 200"
          fill="#DBEAFE"
          stroke="#3B82F6"
          strokeWidth="2"
        />

        {/* Player Position */}
        <Circle
          cx={playerPosition.x}
          cy={playerPosition.y}
          r="8"
          fill="#3B82F6"
          stroke="#FFFFFF"
          strokeWidth="3"
        />

        {/* Tracked Balls */}
        {trackedBalls.map((ball) => (
          <G key={ball.id}>
            {/* Ball */}
            <Pressable onPress={() => onBallPress(ball)}>
              <Circle
                cx={ball.x}
                cy={ball.y}
                r="6"
                fill={ball.connected ? '#F97316' : '#6B7280'}
                stroke="#FFFFFF"
                strokeWidth="2"
              />
            </Pressable>
            
            {/* Connection Line */}
            {ball.connected && (
              <Path
                d={`M ${playerPosition.x} ${playerPosition.y} L ${ball.x} ${ball.y}`}
                stroke="#F97316"
                strokeWidth="1"
                strokeDasharray="5,5"
                opacity="0.6"
              />
            )}

            {/* Ball Label */}
            <Text
              x={ball.x}
              y={ball.y - 15}
              textAnchor="middle"
              fontSize="10"
              fill="#374151"
              fontWeight="600">
              {ball.name}
            </Text>
          </G>
        ))}

        {/* Distance Lines */}
        <Path
          d={`M ${playerPosition.x} ${playerPosition.y} L ${holePosition.x} ${holePosition.y}`}
          stroke="#6B7280"
          strokeWidth="1"
          strokeDasharray="3,3"
          opacity="0.4"
        />
      </Svg>

      {/* Hole Info */}
      <View style={styles.holeInfo}>
        <Text style={styles.holeNumber}>{holeNumber}</Text>
        <Text style={styles.holePar}>Par 4</Text>
        <Text style={styles.holeYardage}>385 yds</Text>
      </View>

      {/* Distance to Hole */}
      <View style={styles.distanceInfo}>
        <Text style={styles.distanceLabel}>To Hole</Text>
        <Text style={styles.distanceValue}>
          {Math.floor(
            Math.sqrt(
              Math.pow(holePosition.x - playerPosition.x, 2) +
                Math.pow(holePosition.y - playerPosition.y, 2)
            ) * 2
          )} yds
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0FDF4',
    position: 'relative',
  },
  holeInfo: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  holeNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: '#22C55E',
    textAlign: 'center',
  },
  holePar: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    textAlign: 'center',
  },
  holeYardage: {
    fontSize: 10,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  distanceInfo: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  distanceLabel: {
    fontSize: 10,
    color: '#6B7280',
    textAlign: 'center',
  },
  distanceValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
  },
});
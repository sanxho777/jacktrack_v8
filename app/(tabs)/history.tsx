import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Calendar,
  Trophy,
  TrendingUp,
  TrendingDown,
  Target,
  MapPin,
  ChevronRight,
  Trash2,
} from 'lucide-react-native';

interface GameHistory {
  id: string;
  courseName: string;
  date: string;
  totalScore: number;
  par: number;
  holesPlayed: number;
  duration: string;
  bestHole: number;
  worstHole: number;
}

export default function HistoryScreen() {
  const [gameHistory] = useState<GameHistory[]>([
    {
      id: '1',
      courseName: 'Pebble Beach Golf Links',
      date: '2025-01-15',
      totalScore: 85,
      par: 72,
      holesPlayed: 18,
      duration: '4h 15m',
      bestHole: 3,
      worstHole: 7,
    },
    {
      id: '2',
      courseName: 'Augusta National',
      date: '2025-01-10',
      totalScore: 92,
      par: 72,
      holesPlayed: 18,
      duration: '4h 45m',
      bestHole: 12,
      worstHole: 5,
    },
    {
      id: '3',
      courseName: 'St. Andrews Old Course',
      date: '2025-01-05',
      totalScore: 78,
      par: 72,
      holesPlayed: 18,
      duration: '3h 55m',
      bestHole: 1,
      worstHole: 17,
    },
    {
      id: '4',
      courseName: 'Torrey Pines',
      date: '2024-12-28',
      totalScore: 88,
      par: 72,
      holesPlayed: 18,
      duration: '4h 30m',
      bestHole: 8,
      worstHole: 14,
    },
  ]);

  const [selectedPeriod, setSelectedPeriod] = useState('all');

  const getAverageScore = () => {
    const total = gameHistory.reduce((sum, game) => sum + game.totalScore, 0);
    return (total / gameHistory.length).toFixed(1);
  };

  const getBestScore = () => {
    return Math.min(...gameHistory.map(game => game.totalScore));
  };

  const getScoreTrend = () => {
    if (gameHistory.length < 2) return 0;
    const recent = gameHistory.slice(0, 3);
    const older = gameHistory.slice(3, 6);
    const recentAvg = recent.reduce((sum, game) => sum + game.totalScore, 0) / recent.length;
    const olderAvg = older.reduce((sum, game) => sum + game.totalScore, 0) / older.length;
    return recentAvg - olderAvg;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getScoreDifferenceColor = (score: number, par: number) => {
    const diff = score - par;
    if (diff <= 0) return '#22C55E';
    if (diff <= 5) return '#F59E0B';
    return '#EF4444';
  };

  const viewGameDetails = (game: GameHistory) => {
    Alert.alert(
      `${game.courseName}`,
      `Date: ${formatDate(game.date)}\nScore: ${game.totalScore} (${game.totalScore - game.par >= 0 ? '+' : ''}${game.totalScore - game.par})\nDuration: ${game.duration}\nBest Hole: ${game.bestHole}\nWorst Hole: ${game.worstHole}`,
      [{ text: 'OK' }]
    );
  };

  const deleteGame = (gameId: string) => {
    Alert.alert(
      'Delete Game',
      'Are you sure you want to delete this game from your history?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // Delete game logic here
            Alert.alert('Deleted', 'Game removed from history');
          },
        },
      ]
    );
  };

  const scoreTrend = getScoreTrend();

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#F0FDF4', '#DCFCE7']}
        style={styles.headerGradient}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Game History</Text>
          <View style={styles.periodSelector}>
            {['all', '2025', '2024'].map((period) => (
              <TouchableOpacity
                key={period}
                style={[
                  styles.periodButton,
                  selectedPeriod === period && styles.selectedPeriod,
                ]}
                onPress={() => setSelectedPeriod(period)}>
                <Text
                  style={[
                    styles.periodText,
                    selectedPeriod === period && styles.selectedPeriodText,
                  ]}>
                  {period.toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </LinearGradient>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Trophy size={20} color="#F59E0B" />
          <View style={styles.statInfo}>
            <Text style={styles.statValue}>{getBestScore()}</Text>
            <Text style={styles.statLabel}>Best Score</Text>
          </View>
        </View>

        <View style={styles.statCard}>
          <Target size={20} color="#22C55E" />
          <View style={styles.statInfo}>
            <Text style={styles.statValue}>{getAverageScore()}</Text>
            <Text style={styles.statLabel}>Average</Text>
          </View>
        </View>

        <View style={styles.statCard}>
          {scoreTrend <= 0 ? (
            <TrendingDown size={20} color="#22C55E" />
          ) : (
            <TrendingUp size={20} color="#EF4444" />
          )}
          <View style={styles.statInfo}>
            <Text
              style={[
                styles.statValue,
                { color: scoreTrend <= 0 ? '#22C55E' : '#EF4444' },
              ]}>
              {scoreTrend <= 0 ? '↓' : '↑'}{Math.abs(scoreTrend).toFixed(1)}
            </Text>
            <Text style={styles.statLabel}>Trend</Text>
          </View>
        </View>

        <View style={styles.statCard}>
          <Calendar size={20} color="#3B82F6" />
          <View style={styles.statInfo}>
            <Text style={styles.statValue}>{gameHistory.length}</Text>
            <Text style={styles.statLabel}>Games</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.historyContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Recent Games</Text>
        
        {gameHistory.map((game) => (
          <TouchableOpacity
            key={game.id}
            style={styles.gameCard}
            onPress={() => viewGameDetails(game)}
            activeOpacity={0.7}>
            <View style={styles.gameHeader}>
              <View style={styles.gameInfo}>
                <Text style={styles.courseName}>{game.courseName}</Text>
                <View style={styles.gameDetails}>
                  <Calendar size={12} color="#6B7280" />
                  <Text style={styles.gameDate}>{formatDate(game.date)}</Text>
                  <MapPin size={12} color="#6B7280" />
                  <Text style={styles.gameDuration}>{game.duration}</Text>
                </View>
              </View>
              
              <View style={styles.gameActions}>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => deleteGame(game.id)}>
                  <Trash2 size={16} color="#EF4444" />
                </TouchableOpacity>
                <ChevronRight size={20} color="#9CA3AF" />
              </View>
            </View>

            <View style={styles.scoreContainer}>
              <View style={styles.scoreItem}>
                <Text style={styles.scoreLabel}>Total Score</Text>
                <Text style={styles.scoreValue}>{game.totalScore}</Text>
              </View>
              
              <View style={styles.scoreItem}>
                <Text style={styles.scoreLabel}>To Par</Text>
                <Text
                  style={[
                    styles.scoreValue,
                    { color: getScoreDifferenceColor(game.totalScore, game.par) },
                  ]}>
                  {game.totalScore - game.par >= 0 ? '+' : ''}
                  {game.totalScore - game.par}
                </Text>
              </View>
              
              <View style={styles.scoreItem}>
                <Text style={styles.scoreLabel}>Holes</Text>
                <Text style={styles.scoreValue}>{game.holesPlayed}/18</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
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
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 16,
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 4,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  selectedPeriod: {
    backgroundColor: '#22C55E',
  },
  periodText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  selectedPeriodText: {
    color: '#FFFFFF',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statInfo: {
    marginTop: 6,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1F2937',
  },
  statLabel: {
    fontSize: 10,
    color: '#6B7280',
    fontWeight: '500',
  },
  historyContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
  gameCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  gameHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  gameInfo: {
    flex: 1,
  },
  courseName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  gameDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  gameDate: {
    fontSize: 12,
    color: '#6B7280',
    marginRight: 8,
  },
  gameDuration: {
    fontSize: 12,
    color: '#6B7280',
  },
  gameActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  deleteButton: {
    padding: 4,
  },
  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scoreItem: {
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  scoreValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1F2937',
  },
});
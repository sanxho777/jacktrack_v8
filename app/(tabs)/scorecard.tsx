import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Plus,
  Minus,
  Save,
  Trophy,
  Target,
  TrendingUp,
} from 'lucide-react-native';

interface HoleData {
  hole: number;
  par: number;
  yards: number;
  score: number;
}

export default function ScorecardScreen() {
  const [courseData] = useState<HoleData[]>([
    { hole: 1, par: 4, yards: 385, score: 0 },
    { hole: 2, par: 3, yards: 165, score: 0 },
    { hole: 3, par: 5, yards: 520, score: 0 },
    { hole: 4, par: 4, yards: 410, score: 0 },
    { hole: 5, par: 3, yards: 180, score: 0 },
    { hole: 6, par: 4, yards: 365, score: 0 },
    { hole: 7, par: 5, yards: 485, score: 0 },
    { hole: 8, par: 4, yards: 395, score: 0 },
    { hole: 9, par: 3, yards: 175, score: 0 },
    { hole: 10, par: 4, yards: 420, score: 0 },
    { hole: 11, par: 3, yards: 190, score: 0 },
    { hole: 12, par: 5, yards: 540, score: 0 },
    { hole: 13, par: 4, yards: 380, score: 0 },
    { hole: 14, par: 4, yards: 425, score: 0 },
    { hole: 15, par: 3, yards: 155, score: 0 },
    { hole: 16, par: 5, yards: 510, score: 0 },
    { hole: 17, par: 4, yards: 400, score: 0 },
    { hole: 18, par: 4, yards: 450, score: 0 },
  ]);

  const [scores, setScores] = useState<{ [key: number]: number }>(
    courseData.reduce((acc, hole) => ({ ...acc, [hole.hole]: hole.score }), {})
  );

  const [playerName, setPlayerName] = useState('Your Game');

  const updateScore = (hole: number, delta: number) => {
    setScores(prev => ({
      ...prev,
      [hole]: Math.max(0, (prev[hole] || 0) + delta),
    }));
  };

  const totalPar = courseData.reduce((sum, hole) => sum + hole.par, 0);
  const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);
  const scoreDifference = totalScore - totalPar;

  const saveScorecard = () => {
    Alert.alert(
      'Save Scorecard',
      `Save your round with total score ${totalScore} (${scoreDifference >= 0 ? '+' : ''}${scoreDifference})?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Save',
          onPress: () => {
            // Save scorecard logic here
            Alert.alert('Success', 'Scorecard saved to game history!');
          },
        },
      ]
    );
  };

  const getScoreColor = (score: number, par: number) => {
    const difference = score - par;
    if (difference <= -2) return '#059669'; // Eagle or better
    if (difference === -1) return '#16A34A'; // Birdie
    if (difference === 0) return '#374151'; // Par
    if (difference === 1) return '#F59E0B'; // Bogey
    return '#EF4444'; // Double bogey or worse
  };

  const getScoreText = (score: number, par: number) => {
    const difference = score - par;
    if (score === 0) return '-';
    if (difference <= -2) return 'Eagle';
    if (difference === -1) return 'Birdie';
    if (difference === 0) return 'Par';
    if (difference === 1) return 'Bogey';
    return '+' + difference;
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#F0FDF4', '#DCFCE7']}
        style={styles.headerGradient}>
        <View style={styles.header}>
          <View>
            <Text style={styles.courseName}>Pebble Beach Golf Links</Text>
            <TextInput
              style={styles.playerNameInput}
              value={playerName}
              onChangeText={setPlayerName}
              placeholder="Enter player name"
            />
          </View>
          <TouchableOpacity style={styles.saveButton} onPress={saveScorecard}>
            <Save size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <View style={styles.scoreOverview}>
        <View style={styles.scoreCard}>
          <Trophy size={24} color="#F59E0B" />
          <View style={styles.scoreDetails}>
            <Text style={styles.scoreLabel}>Total Score</Text>
            <Text style={styles.scoreValue}>{totalScore || '-'}</Text>
          </View>
        </View>

        <View style={styles.scoreCard}>
          <Target size={24} color="#22C55E" />
          <View style={styles.scoreDetails}>
            <Text style={styles.scoreLabel}>To Par</Text>
            <Text
              style={[
                styles.scoreValue,
                {
                  color:
                    scoreDifference === 0
                      ? '#374151'
                      : scoreDifference < 0
                      ? '#22C55E'
                      : '#EF4444',
                },
              ]}>
              {totalScore === 0
                ? '-'
                : scoreDifference >= 0
                ? `+${scoreDifference}`
                : scoreDifference}
            </Text>
          </View>
        </View>

        <View style={styles.scoreCard}>
          <TrendingUp size={24} color="#3B82F6" />
          <View style={styles.scoreDetails}>
            <Text style={styles.scoreLabel}>Holes Played</Text>
            <Text style={styles.scoreValue}>
              {Object.values(scores).filter(s => s > 0).length}/18
            </Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.scorecardContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.tableHeader}>
          <Text style={styles.headerText}>Hole</Text>
          <Text style={styles.headerText}>Par</Text>
          <Text style={styles.headerText}>Yards</Text>
          <Text style={styles.headerText}>Score</Text>
          <Text style={styles.headerText}>Result</Text>
        </View>

        {courseData.map((hole) => (
          <View key={hole.hole} style={styles.holeRow}>
            <View style={styles.holeNumber}>
              <Text style={styles.holeNumberText}>{hole.hole}</Text>
            </View>
            
            <Text style={styles.parText}>{hole.par}</Text>
            <Text style={styles.yardsText}>{hole.yards}</Text>
            
            <View style={styles.scoreContainer}>
              <TouchableOpacity
                style={styles.scoreButton}
                onPress={() => updateScore(hole.hole, -1)}>
                <Minus size={14} color="#6B7280" />
              </TouchableOpacity>
              
              <Text style={styles.scoreText}>{scores[hole.hole] || 0}</Text>
              
              <TouchableOpacity
                style={styles.scoreButton}
                onPress={() => updateScore(hole.hole, 1)}>
                <Plus size={14} color="#6B7280" />
              </TouchableOpacity>
            </View>
            
            <Text
              style={[
                styles.resultText,
                { color: getScoreColor(scores[hole.hole] || 0, hole.par) },
              ]}>
              {getScoreText(scores[hole.hole] || 0, hole.par)}
            </Text>
          </View>
        ))}

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>TOTAL</Text>
          <Text style={styles.totalPar}>{totalPar}</Text>
          <Text style={styles.totalYards}>
            {courseData.reduce((sum, hole) => sum + hole.yards, 0)}
          </Text>
          <Text style={styles.totalScore}>{totalScore}</Text>
          <Text
            style={[
              styles.totalDifference,
              {
                color:
                  scoreDifference === 0
                    ? '#374151'
                    : scoreDifference < 0
                    ? '#22C55E'
                    : '#EF4444',
              },
            ]}>
            {totalScore === 0
              ? '-'
              : scoreDifference >= 0
              ? `+${scoreDifference}`
              : scoreDifference}
          </Text>
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
  courseName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  playerNameInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    minWidth: 150,
  },
  saveButton: {
    backgroundColor: '#22C55E',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scoreOverview: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  scoreCard: {
    flex: 1,
    flexDirection: 'row',
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
  scoreDetails: {
    marginLeft: 8,
    flex: 1,
  },
  scoreLabel: {
    fontSize: 10,
    color: '#6B7280',
    fontWeight: '500',
  },
  scoreValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1F2937',
  },
  scorecardContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 16,
    paddingVertical: 16,
  },
  tableHeader: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: '#E5E7EB',
  },
  headerText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '700',
    color: '#374151',
    textAlign: 'center',
  },
  holeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  holeNumber: {
    flex: 1,
    alignItems: 'center',
  },
  holeNumberText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
  },
  parText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
  },
  yardsText: {
    flex: 1,
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  scoreContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreButton: {
    backgroundColor: '#F3F4F6',
    borderRadius: 6,
    padding: 4,
  },
  scoreText: {
    marginHorizontal: 12,
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    minWidth: 20,
    textAlign: 'center',
  },
  resultText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  totalRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 2,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
    marginTop: 8,
  },
  totalLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: '800',
    color: '#1F2937',
    textAlign: 'center',
  },
  totalPar: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
    textAlign: 'center',
  },
  totalYards: {
    flex: 1,
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  totalScore: {
    flex: 1,
    fontSize: 16,
    fontWeight: '800',
    color: '#1F2937',
    textAlign: 'center',
  },
  totalDifference: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
});
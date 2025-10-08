import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { colors } from '../../theme/colors';
import Header from '../../components/common/Header';
import { http } from '../../services/http';
import { Counselor, ReservationScreenProps } from '../../navigation/types';

// 각 상담사 항목을 렌더링하는 카드 컴포넌트
const CounselorCard = ({ item, onPress }: { item: Counselor; onPress: () => void }) => (
  <TouchableOpacity style={styles.cardContainer} onPress={onPress}>
    <Image source={{ uri: item.imageUrl }} style={styles.profileImage} />
    <View style={styles.infoContainer}>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.bio} numberOfLines={2}>{item.bio}</Text>
      <View style={styles.tagsContainer}>
        {item.tags.slice(0, 4).map((tag, index) => (
          <View key={index} style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
      </View>
      <View style={styles.detailButton}>
        <Text style={styles.detailButtonText}>자세히보기 →</Text>
      </View>
    </View>
  </TouchableOpacity>
);

export default function ReservationScreen({ navigation }: ReservationScreenProps) {
  const [counselors, setCounselors] = useState<Counselor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCounselors = async () => {
      try {
        const response = await http.get<Counselor[]>('/counselors');
        setCounselors(response.data);
      } catch (err) {
        setError('상담사 목록을 불러오는 데 실패했습니다.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCounselors();
  }, []);

  const handleCardPress = (counselorId: string) => {
    navigation.navigate('CounselorDetail', { counselorId });
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <Text>{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <Header title="상담사 목록" />
      <FlatList
        data={counselors}
        renderItem={({ item }) => (
          <CounselorCard item={item} onPress={() => handleCardPress(item.id)} />
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  cardContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  title: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
    marginBottom: 8,
  },
  bio: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 10,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  tag: {
    backgroundColor: colors.bg,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 6,
    marginBottom: 6,
  },
  tagText: {
    fontSize: 12,
    color: colors.textMuted,
  },
  detailButton: {
    alignSelf: 'flex-end',
    marginTop: 8,
  },
  detailButtonText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
});
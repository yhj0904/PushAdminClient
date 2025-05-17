// screens/PushListScreen.tsx
// 푸시 발송 목록을 조회하고 화면에 출력하는 메인 리스트 화면입니다.
// 항목 클릭 시 상세 조회 화면으로 이동하며 appId, noticeNo를 전달합니다.

import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { format } from 'date-fns';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import axios from '../services/axiosInstance';
import { PushMessage } from '../types/pushTypes';

// 라우터 타입 정의
type RootStackParamList = {
  PushDetail: {
    appId: string;
    noticeNo: number;
  };
  PushCreate: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function PushListScreen() {
  const navigation = useNavigation<NavigationProp>();

  const [pushList, setPushList] = useState<PushMessage[]>([]);
  const [loading, setLoading] = useState(true);

  // 목록 조회 API
  const fetchPushList = async () => {
    const appId = 'MOBILE'; //useAuthStore.getState().appId; 
    try {
      const res = await axios.get(`/api/push/history/${appId}`, {
        params: {
          page: 0,
          size: 10,
        },
      });
      setPushList(res.data.content); // Page 객체의 content 추출
    } catch (error) {
      Alert.alert('오류', '푸시 목록을 불러오지 못했습니다.');
      console.error('푸시 목록 조회 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  // 포커싱 시마다 목록 새로고침
  useFocusEffect(
    useCallback(() => {
      fetchPushList();
    }, [])
  );

  // 헤더 우측 "등록" 버튼 설정
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.navigate('PushCreate')}>
          <Text style={styles.registerBtn}>등록</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  // 리스트 항목 렌더링
  const renderItem = ({ item }: { item: PushMessage }) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('PushDetail', {
          appId: item.appId,
          noticeNo: item.noticeNo,
        })
      }
      style={styles.item}
    >
      <Text style={styles.title}>{item.noticeTitle}</Text>
      <Text style={styles.content}>{item.userNm} 님 발송</Text>
      <Text style={styles.date}>
        {format(new Date(item.noticeDt), 'yyyy-MM-dd HH:mm')}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
      <View style={styles.container}>
        <FlatList
          data={pushList}
          renderItem={renderItem}
          keyExtractor={(item) => item.noticeNo.toString()}
          ListEmptyComponent={<Text>발송된 푸시가 없습니다.</Text>}
        />
      </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  item: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  content: {
    marginTop: 4,
    color: '#555',
  },
  date: {
    marginTop: 6,
    fontSize: 12,
    color: '#999',
  },
  registerBtn: {
    marginRight: 16,
    fontSize: 15,
    fontWeight: '600',
    color: '#007AFF',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

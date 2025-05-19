// screens/PushDetailScreen.tsx
// 푸시 발송 상세 내용을 API로 조회하고 출력하는 화면입니다.
// 항목 클릭 시 전달받은 appId, noticeNo를 기반으로 /api/push/history/{appId}/{noticeNo} 호출

import { RouteProp, useRoute } from '@react-navigation/native';
import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import axios from '../services/axiosInstance';
import { PushDetail } from '../types/pushTypes';

// 전달받는 route 파라미터 타입 정의
type RootStackParamList = {
  PushDetail: {
    appId: string;
    noticeNo: number;
  };
};

type RouteProps = RouteProp<RootStackParamList, 'PushDetail'>;

export default function PushDetailScreen() {
  const route = useRoute<RouteProps>();
  const { appId, noticeNo } = route.params;

  const [detail, setDetail] = useState<PushDetail | null>(null);
  const [loading, setLoading] = useState(true);

  // 컴포넌트 마운트 시 상세 정보 요청
  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await axios.get(`/api/push/history/${appId}/${noticeNo}`);
        setDetail(res.data);
        console.log(res.data);
      } catch (err) {
        Alert.alert('오류', '푸시 상세 정보를 불러오지 못했습니다.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [appId, noticeNo]);

  if (loading || !detail) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>제목</Text>
      <Text style={styles.value}>{detail.noticeTitle}</Text>

      <Text style={styles.label}>내용</Text>
      <Text style={styles.value}>{detail.noticeBody}</Text>

      <Text style={styles.label}>발송 일시</Text>
      <Text style={styles.value}>
        {format(new Date(detail.noticeDt), 'yyyy-MM-dd HH:mm')}
      </Text>

      <Text style={styles.label}>발송 상태</Text>
      <Text style={styles.value}>{detail.pushState}</Text>

      <Text style={styles.label}>성공/실패</Text>
      <Text style={styles.value}>
        {detail.pushSuccessCnt} / {detail.pushFailCnt}
      </Text>

      <Text style={styles.label}>발송 대상자</Text>
      <FlatList
        data={detail.sendUserList}
        keyExtractor={(item) => item.userId}
        renderItem={({ item }) => (
          <View style={styles.userRow}>
            <Text>{item.userId}</Text>
            <Text>{item.successYn === 'Y' ? '✅ 성공' : `❌ 실패 (${item.failMsg})`}</Text>
          </View>
        )}
        ListEmptyComponent={<Text>대상자 없음</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 16,
    color: '#333',
  },
  value: {
    fontSize: 16,
    marginTop: 4,
    color: '#000',
  },
  userRow: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

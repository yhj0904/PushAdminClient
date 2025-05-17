// screens/PushCreateScreen.tsx
// 푸시 알림을 생성하고 발송하는 화면입니다.
// 사용자가 입력한 값을 기반으로 /api/push/send 로 POST 요청을 보냅니다.

import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { format } from 'date-fns';
import React, { useState } from 'react';
import {
  Alert,
  Button,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput
} from 'react-native';
import axios from '../services/axiosInstance';

type RootStackParamList = {
  PushList: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function PushCreateScreen() {
  const navigation = useNavigation<NavigationProp>();

  // 입력 상태값 정의
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeBody, setNoticeBody] = useState('');
  const [noticeImg, setNoticeImg] = useState('');
  const [noticeUrl, setNoticeUrl] = useState('');
  const [noticeAction, setNoticeAction] = useState('');
  const [sendUserList, setSendUserList] = useState('');
  const [userId, setUserId] = useState('');
  const [userNm, setUserNm] = useState('');
  const [userMobile, setUserMobile] = useState('');
  const [reservationDt, setReservationDt] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  //  발송 함수
  const handleSend = async () => {
    // 필수 항목 체크
    if (!noticeTitle.trim() || !noticeBody.trim()) {
      Alert.alert('입력 오류', '제목과 내용을 입력하세요.');
      return;
    }

    try {
      const payload = {
        appId: 'MOBILE',
        noticeTitle: "긴급 점검 안내",
        noticeBody: "내일 오전 3시에 시스템 점검이 예정되어 있습니다.",
        noticeImg: "https://cdn.example.com/image.jpg",
        noticeUrl: "https://example.com/notice",
        noticeAction: "open_notice_detail",
        userId: "nauri",
        userNm: "나우리",
        userMobile: "010-1234-5678",
        pushUse: 'Y',
        smsUse: 'N',
        webUse: 'Y',
        reservationDt: reservationDt.toISOString(),
        userNmAt: 'N',
        sendUserList: "nauri",
      };

      await axios.post('/api/push/send', payload);

      Alert.alert('성공', '푸시 알림이 발송되었습니다.');

      navigation.reset({
        index: 0,
        routes: [{ name: 'PushList' }],
      });
    } catch (error) {
      console.error('푸시 발송 실패:', error);
      Alert.alert('오류', '푸시 발송 중 문제가 발생했습니다.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>제목 *</Text>
      <TextInput
        style={styles.input}
        value={noticeTitle}
        onChangeText={setNoticeTitle}
        placeholder="제목을 입력하세요"
      />

      <Text style={styles.label}>내용 *</Text>
      <TextInput
        style={[styles.input, styles.textarea]}
        value={noticeBody}
        onChangeText={setNoticeBody}
        placeholder="내용을 입력하세요"
        multiline
      />

      <Text style={styles.label}>이미지 URL</Text>
      <TextInput
        style={styles.input}
        value={noticeImg}
        onChangeText={setNoticeImg}
        placeholder="https://..."
      />

      <Text style={styles.label}>링크 URL</Text>
      <TextInput
        style={styles.input}
        value={noticeUrl}
        onChangeText={setNoticeUrl}
        placeholder="https://..."
      />

      <Text style={styles.label}>액션 타입</Text>
      <TextInput
        style={styles.input}
        value={noticeAction}
        onChangeText={setNoticeAction}
        placeholder="예: open_notice_detail"
      />

      <Text style={styles.label}>예약 발송 시간</Text>
      <Pressable
        onPress={() => setShowDatePicker(true)}
        style={[styles.input, { justifyContent: 'center' }]}
      >
        <Text>{format(reservationDt, 'yyyy-MM-dd HH:mm')}</Text>
      </Pressable>

      {showDatePicker && (
          <DateTimePicker
            value={reservationDt}
            mode="datetime"
            display={Platform.OS === 'ios' ? 'inline' : 'default'}
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) setReservationDt(selectedDate);
            }}
          />
        )}
        
      <Text style={styles.label}>발송 대상자 ID (쉼표로 구분)</Text>
      <TextInput
        style={styles.input}
        value={sendUserList}
        onChangeText={setSendUserList}
        placeholder="예: user1,user2,user3"
      />

      <Text style={styles.label}>작성자 ID</Text>
      <TextInput
        style={styles.input}
        value={userId}
        onChangeText={setUserId}
        placeholder="admin01"
      />

      <Text style={styles.label}>작성자 이름</Text>
      <TextInput
        style={styles.input}
        value={userNm}
        onChangeText={setUserNm}
        placeholder="홍길동"
      />

      <Text style={styles.label}>작성자 휴대폰 번호</Text>
      <TextInput
        style={styles.input}
        value={userMobile}
        onChangeText={setUserMobile}
        placeholder="010-1234-5678"
      />

      <Button title="푸시 발송" onPress={handleSend} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
  },
  label: {
    fontWeight: 'bold',
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginTop: 4,
    borderRadius: 6,
    fontSize: 16,
  },  
  textarea: {
    height: 100,
    textAlignVertical: 'top',
  },
});

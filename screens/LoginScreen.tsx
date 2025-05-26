import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as LocalAuthentication from 'expo-local-authentication';
import React, { useState } from 'react';
import { Alert, Button, StyleSheet, TextInput, View } from 'react-native';
import axios from '../services/axiosInstance'; // JWT가 자동으로 붙는 axios 인스턴스
import { useAuthStore } from '../store/authStore'; // Zustand에서 accessToken 관리용
import { saveAccessToken } from '../utils/tokenUtil';

type RootStackParamList = {
  PushList: undefined;
  Register: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function LoginScreen() {
  // 아이디와 비밀번호 입력 상태 저장
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // 화면 이동을 위한 네비게이터
  const navigation = useNavigation<NavigationProp>();

  // Zustand에서 토큰 저장하는 함수 가져오기
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  // 로그인 버튼 클릭 시 호출
  const handleLogin = async () => {
    try {
      // 백엔드 로그인 API 호출 (axiosInstance 사용)
      const response = await axios.post('/login', {
        username,
        password,
      });

      // accessToken 받아옴
      const accessToken = response.headers['access'];
      console.info('accessToken:', accessToken);
      // 로컬에 저장 (재시작 시 사용)
      await saveAccessToken(accessToken);

      // Zustand 전역 상태에도 저장
      setAccessToken(accessToken);

      // 로그인 성공 → 푸시 목록 화면으로 이동
      navigation.reset({
        index: 0,
        routes: [{ name: 'PushList' }],
      });
    } catch (error) {
      Alert.alert('로그인 실패', '아이디 또는 비밀번호를 확인하세요.');
    }
  };

  // 생체 인증 함수
  const tryBiometricAuth = async () => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    console.log('하드웨어 있음?', hasHardware);
    console.log('등록됨?', isEnrolled);
  
    if (!hasHardware || !isEnrolled) {
      Alert.alert('생체 인증 불가', '기기에서 생체 인증을 지원하지 않거나 등록되어 있지 않습니다.');
      return;
    }
  
    const biometricResult = await LocalAuthentication.authenticateAsync({
      promptMessage: '생체 인증으로 로그인',
      disableDeviceFallback: true,
    });
  
    console.log('biometricResult:', biometricResult);
  
    if (biometricResult.success) {
      Alert.alert('✅ 인증 성공');
      handleLogin();
    } else {
      Alert.alert('❌ 인증 실패');
    }
  };
  
  return (
    <View style={styles.container}>
      <TextInput
        placeholder="아이디"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="비밀번호"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />
      <Button title="로그인" onPress={handleLogin} />
      <Button title="회원가입" onPress={() => navigation.navigate('Register')} />
      <Button title="생체 인증 로그인" onPress={tryBiometricAuth} />
    </View>
  );
}

// 입력 필드 및 레이아웃을 위한 기본 스타일
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 16,
    padding: 12,
    borderRadius: 6,
  },
});

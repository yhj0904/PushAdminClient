// screens/RegisterScreen.tsx
// 관리자 회원가입 화면 – 사용자 역할(role)을 포함해서 등록합니다.

import { Picker } from '@react-native-picker/picker'; // 역할 선택용 드롭다운
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
    Alert,
    Button,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import axios from '../services/axiosInstance';

type RootStackParamList = {
  Login: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function RegisterScreen() {
  const navigation = useNavigation<NavigationProp>();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'USER' | 'ADMIN'>('USER'); // 기본값: USER

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      Alert.alert('오류', '비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      await axios.post('/join', {
        username,
        password,
        role,
      });

      Alert.alert('회원가입 성공', '로그인 화면으로 이동합니다.');
      navigation.navigate('Login');
    } catch (error) {
      console.error(error);
      Alert.alert('회원가입 실패', '이미 존재하는 아이디일 수 있습니다.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>아이디</Text>
      <TextInput style={styles.input} value={username} onChangeText={setUsername} />

      <Text style={styles.label}>비밀번호</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Text style={styles.label}>비밀번호 확인</Text>
      <TextInput
        style={styles.input}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      <Text style={styles.label}>역할 (Role)</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={role}
          onValueChange={(value: 'ADMIN' | 'USER') => setRole(value)}
          style={Platform.OS === 'android' ? styles.pickerAndroid : undefined}
        >
          <Picker.Item label="관리자 (ADMIN)" value="ADMIN" />
          <Picker.Item label="일반 사용자 (USER)" value="USER" />
          
        </Picker>
      </View>

      <Button title="회원가입" onPress={handleRegister} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 16,
    padding: 12,
    borderRadius: 6,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    marginBottom: 16,
  },
  pickerAndroid: {
    height: 48,
    width: '100%',
  },
});

// navigations/AppNavigator.tsx
// 화면 이동을 정의하는 Stack Navigator 구성 파일입니다.

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

// 각 화면 import
import LoginScreen from '../screens/LoginScreen';
import PushCreateScreen from '../screens/PushCreateScreen';
import PushDetailScreen from '../screens/PushDetailScreen';
import PushListScreen from '../screens/PushListScreen'; // 푸시 목록 화면
import RegisterScreen from '../screens/RegisterScreen';


const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
        <Stack.Navigator initialRouteName="Login">
          {/* 로그인 화면 */}
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />

          {/* 푸시 목록 화면 */}
          <Stack.Screen name="PushList" component={PushListScreen} options={{ title: '푸시 발송 내역' }} />

          {/* 푸시 상세 화면 */}
          <Stack.Screen name="PushDetail" component={PushDetailScreen} options={{ title: '푸시 상세' }} />

          {/* 푸시 생성 화면 */}
          <Stack.Screen name="PushCreate" component={PushCreateScreen} options={{ title: '푸시 생성' }} />
          {/* 회원가입 화면 */}
          <Stack.Screen name="Register" component={RegisterScreen} options={{ title: '회원가입' }} />
        </Stack.Navigator>

  );
}

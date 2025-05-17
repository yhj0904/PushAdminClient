// utils/tokenUtil.ts
// JWT 토큰을 보안 저장소(SecureStore)에 안전하게 저장하고 불러오는 유틸 함수

import * as SecureStore from 'expo-secure-store';

// accessToken 저장
export async function saveAccessToken(token: string): Promise<void> {
  await SecureStore.setItemAsync('accessToken', token);
}

// accessToken 불러오기
export async function getAccessToken(): Promise<string | null> {
  return await SecureStore.getItemAsync('accessToken');
}

// accessToken 삭제
export async function deleteAccessToken(): Promise<void> {
  await SecureStore.deleteItemAsync('accessToken');
}

// store/authStore.ts
// 로그인 상태와 앱 ID를 전역에서 관리하기 위한 Zustand 저장소입니다.

import { create } from 'zustand';

// 상태 타입 정의
interface AuthState {
  accessToken: string | null;        // JWT Access Token
  appId: string;                     // 현재 선택된 앱 ID
  setAccessToken: (token: string) => void;
  clearAccessToken: () => void;
  setAppId: (id: string) => void;
}

// Zustand 훅 생성
export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  appId: 'PUSH_MGR', // 기본값으로 지정

  setAccessToken: (token) => set({ accessToken: token }),
  clearAccessToken: () => set({ accessToken: null }),

  setAppId: (id) => set({ appId: id }),
}));

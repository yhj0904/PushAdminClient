// services/axiosInstance.ts
// Access Token을 자동으로 Authorization 헤더에 추가해주는 axios 인스턴스입니다.

import axios from 'axios';
import { deleteAccessToken, getAccessToken, saveAccessToken } from '../utils/tokenUtil';


// axios 인스턴스 생성
const instance = axios.create({
  baseURL: 'http://192.168.10.205:8086', // Spring Boot API 주소로 수정
  withCredentials: false,  // 쿠키도 같이 보내도록 설정
});

const reissueApi = axios.create({
    baseURL: 'http://192.168.10.205:8086',
    withCredentials: true, // refreshToken 포함됨
  });

// 요청 인터셉터 → 헤더에 JWT 자동 삽입
instance.interceptors.request.use(async (config) => {
      // 로그인이나 회원가입 요청은 Authorization 헤더 생략
      if (
        config.url?.includes('/login') ||
        config.url?.includes('/register') ||
        config.url?.includes('/reissue')
      ) {
        return config;
      }
      
    const token = await getAccessToken();
    console.info('token:', token);
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
  
  // 401일 때 accessToken 재발급 시도
  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
  
      // accessToken 만료된 경우 한 번만 재시도
      if (
        error.response?.status === 401 &&
        !originalRequest._retry
      ) {
        originalRequest._retry = true;
  
        try {
          // refreshToken은 쿠키에 들어있고 자동 전송됨
          const res = await reissueApi.post('/reissue');
          const newToken = res.headers['access'];
          if (!newToken) throw new Error('재발급 실패');
          await saveAccessToken(newToken);
  
          // 헤더 다시 설정하고 재요청
          originalRequest.headers.Authorization = `Bearer ${newToken}`;

          return instance(originalRequest);

        } catch (e) {
          await deleteAccessToken();
          // 재발급 실패 → 로그인 화면으로 이동해야 함
          return Promise.reject(e);
        }
      }
  
      return Promise.reject(error);
    }
  );
  
  export default instance;
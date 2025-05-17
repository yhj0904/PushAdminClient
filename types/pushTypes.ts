// types/pushTypes.ts
export interface PushMessage {
  noticeNo: number;
  appId: string;
  noticeTitle: string;
  noticeDt: string;
  userId: string;
  userNm: string;
  pushUse: string;
  webUse: string;
  smsUse: string;
  totalCnt: number;
  pushSuccessCnt: number;
  pushFailCnt: number;
  pushState: string;
}

export interface PushDetail {
  noticeNo: number;
  appId: string;
  noticeTitle: string;
  noticeBody: string;
  noticeImg?: string;
  noticeUrl?: string;
  noticeAction?: string;
  noticeDt: string;
  userId: string;
  userNm: string;
  userMobile?: string;
  pushUse: string;
  webUse: string;
  smsUse: string;
  userNmAt: string;
  totalCnt: number;
  pushSuccessCnt: number;
  pushFailCnt: number;
  pushState: string;
  sendUserList: {
    userId: string;
    successYn: string;
    failMsg: string;
  }[];
}

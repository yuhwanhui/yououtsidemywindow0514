import { api } from '@/api/client'
import type { AlarmListResponse } from '@/types/alarm'

const MOCK: AlarmListResponse = {
  summary: [
    { label: '전체 알람 수', value: 47, detail: '금일 00:00 ~ 12:40', tone: 'info' },
    { label: '긴급 알람', value: 2, detail: '즉시 조치 필요', tone: 'critical' },
    { label: '처리 완료', value: 38, detail: '완료율 80.8%', tone: 'done' },
    { label: '미처리 알람', value: 7, detail: '담당자 확인 필요', tone: 'pending' },
  ],
  rows: [
    { time: '12:38:22', equipment: 'CAST-02', type: '긴급', category: '온도', message: '용탕온도 상한 초과', status: '조치중' },
    { time: '12:21:05', equipment: 'ASM-05', type: '경고', category: '하중', message: '압입하중 편차 발생', status: '미처리' },
    { time: '11:54:44', equipment: 'INSP-02', type: '경고', category: '치수', message: '현재 물체 치수 허용범위 이탈', status: '미처리' },
    { time: '11:18:12', equipment: 'MACH-11', type: '정보', category: '공구', message: '공구사용시간 교체 기준 80% 도달', status: '처리완료' },
    { time: '10:42:39', equipment: 'WASH-03', type: '점검', category: '농도', message: '세척농도 보정 작업 등록', status: '처리완료' },
  ],
}

function useMockAlarms(): boolean {
  const mock = import.meta.env.VITE_USE_MOCK_ALARMS
  const base = import.meta.env.VITE_API_BASE_URL
  return mock === 'true' || base === '' || base == null
}

export async function fetchAlarmList(): Promise<AlarmListResponse> {
  if (useMockAlarms()) {
    await new Promise((r) => setTimeout(r, 400))
    if (typeof structuredClone === 'function') return structuredClone(MOCK)
    return JSON.parse(JSON.stringify(MOCK)) as AlarmListResponse
  }
  const { data } = await api.get<AlarmListResponse>('/alarms')
  return data
}

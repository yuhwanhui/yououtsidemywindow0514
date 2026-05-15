import { useQuery } from '@tanstack/vue-query'
import { fetchAlarmList } from '@/api/alarmApi'

export function useAlarms() {
  return useQuery({
    queryKey: ['alarms', 'list'],
    queryFn: fetchAlarmList,
    refetchInterval: 60_000,
  })
}

<script setup lang="ts">
import {
  AlertTriangle,
  BarChart3,
  Bell,
  CalendarDays,
  Factory,
  LogOut,
  Wrench,
} from 'lucide-vue-next'
import { RouterLink } from 'vue-router'
import { useAppNav } from '@/composables/useAppNav'
import { useLogout } from '@/composables/useLogout'
import { useAlarms } from '@/composables/useAlarms'

const { navItems } = useAppNav()
const logout = useLogout()
const { data, isPending, isError, error, refetch, isFetching } = useAlarms()

const trendHours = [
  { time: '06', count: 5, percent: 26 },
  { time: '07', count: 8, percent: 42 },
  { time: '08', count: 12, percent: 63 },
  { time: '09', count: 16, percent: 84 },
  { time: '10', count: 13, percent: 68 },
  { time: '11', count: 19, percent: 100 },
  { time: '12', count: 15, percent: 79 },
  { time: '13', count: 9, percent: 47 },
]

const equipmentFrequency = [
  { label: 'CAST-02', count: 9, percent: 100, type: '주조기' },
  { label: 'INSP-02', count: 7, percent: 78, type: '검사기' },
  { label: 'ASM-05', count: 6, percent: 67, type: '조립기' },
  { label: 'MACH-11', count: 4, percent: 44, type: '가공기' },
  { label: 'WASH-03', count: 3, percent: 33, type: '세척기' },
]

const typeFrequency = [
  { label: '온도', count: 14, percent: 100 },
  { label: '치수', count: 11, percent: 79 },
  { label: '하중', count: 8, percent: 57 },
  { label: '진동', count: 7, percent: 50 },
  { label: '공구', count: 5, percent: 36 },
  { label: '농도', count: 2, percent: 14 },
]
</script>

<template>
  <main class="dashboard-shell">
    <aside class="dashboard-sidebar" aria-label="주요 메뉴">
      <RouterLink class="dashboard-brand" :to="{ name: 'dashboard' }">
        <span class="brand-symbol">U</span>
        <span>
          <strong>UECADA</strong>
          <small>우리들의 스카다</small>
        </span>
      </RouterLink>

      <nav class="dashboard-nav">
        <RouterLink v-for="item in navItems" :key="item.label" :to="item.to">
          <component :is="item.icon" :size="18" />
          <span>{{ item.label }}</span>
        </RouterLink>
      </nav>

      <div class="sidebar-status">
        <span>관리자</span>
        <strong>김관리</strong>
        <p>알림 현황, 발생 이력 및 추이, 조건별 빈도 분석</p>
      </div>
    </aside>

    <section class="dashboard-main">
      <header class="dashboard-header">
        <div class="dashboard-header-titles">
          <p class="dashboard-kicker">Alarm Analytics</p>
          <h1>알람 화면</h1>
        </div>
        <div class="header-actions">
          <span class="current-time">
            <CalendarDays :size="16" />
            2026-05-11 12:40
          </span>
          <RouterLink class="ghost-button" :to="{ name: 'equipment' }">
            <Wrench :size="16" />
            <span>설비별 화면</span>
          </RouterLink>
          <button type="button" class="icon-link" @click="logout">
            <LogOut :size="16" />
            <span>로그아웃</span>
          </button>
        </div>
      </header>

      <p v-if="isFetching && !isPending" class="dashboard-kicker" style="margin: 0 0 8px">
        최신 알람 동기화 중…
      </p>

      <div v-if="isPending" class="dashboard-panel" style="padding: 48px; text-align: center">
        <p class="panel-kicker">Loading</p>
        <h2>알람 데이터를 불러오는 중입니다</h2>
        <p style="color: #64748b; margin-top: 8px">잠시만 기다려 주세요.</p>
      </div>

      <div v-else-if="isError" class="dashboard-panel" style="padding: 48px; text-align: center">
        <p class="panel-kicker">Error</p>
        <h2>알람을 불러오지 못했습니다</h2>
        <p style="color: #64748b; margin-top: 8px">{{ error?.message ?? '알 수 없는 오류' }}</p>
        <button type="button" class="login-button" style="margin-top: 16px" @click="() => refetch()">
          다시 시도
        </button>
      </div>

      <template v-else-if="data">
        <section class="alarm-summary-grid" aria-label="알림 현황요약">
          <article v-for="item in data.summary" :key="item.label" :class="['alarm-summary-card', item.tone]">
            <span>{{ item.label }}</span>
            <strong>{{ item.value }}</strong>
            <p>{{ item.detail }}</p>
          </article>
        </section>

        <section class="alarm-trend-history-grid">
          <article class="dashboard-panel alarm-trend-panel">
            <div class="section-title-row">
              <div>
                <p class="panel-kicker">Alarm Trend</p>
                <h2>알람 발생 추이</h2>
              </div>
              <BarChart3 :size="22" />
            </div>

            <div class="alarm-trend-chart">
              <div v-for="item in trendHours" :key="item.time" class="alarm-trend-column">
                <i :style="{ height: `${item.percent}%` }"></i>
                <b>{{ item.count }}건</b>
                <span>{{ item.time }}시</span>
              </div>
            </div>
          </article>

          <article class="dashboard-panel alarm-history-panel-wide">
            <div class="section-title-row">
              <div>
                <p class="panel-kicker">Alarm History</p>
                <h2>알람 발생 이력</h2>
              </div>
              <AlertTriangle :size="22" />
            </div>

            <div v-if="data.rows.length === 0" class="alarm-history-table-wrap" style="padding: 32px; text-align: center">
              <p class="panel-kicker">Empty</p>
              <h2>표시할 알람이 없습니다</h2>
              <p style="color: #64748b; margin-top: 8px">필터를 변경하거나 나중에 다시 확인해 주세요.</p>
            </div>

            <div v-else class="alarm-history-table-wrap">
              <table class="alarm-history-table">
                <thead>
                  <tr>
                    <th>발생 시간</th>
                    <th>설비명</th>
                    <th>알람 유형</th>
                    <th>분류</th>
                    <th>내용</th>
                    <th>상태</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="row in data.rows" :key="`${row.time}-${row.equipment}`">
                    <td>{{ row.time }}</td>
                    <td><strong>{{ row.equipment }}</strong></td>
                    <td><span :class="['alarm-level', row.type]">{{ row.type }}</span></td>
                    <td>{{ row.category }}</td>
                    <td>{{ row.message }}</td>
                    <td><span :class="['alarm-status-badge', row.status]">{{ row.status }}</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </article>
        </section>

        <section class="alarm-frequency-grid">
          <article class="dashboard-panel">
            <div class="section-title-row">
              <div>
                <p class="panel-kicker">Equipment Frequency</p>
                <h2>설비별 알람 발생 횟수</h2>
              </div>
              <Factory :size="22" />
            </div>

            <div class="frequency-bar-list">
              <article v-for="item in equipmentFrequency" :key="item.label">
                <div>
                  <strong>{{ item.label }}</strong>
                  <span>{{ item.type }}</span>
                </div>
                <div class="frequency-meter">
                  <i :style="{ width: `${item.percent}%` }"></i>
                </div>
                <b>{{ item.count }}건</b>
              </article>
            </div>
          </article>

          <article class="dashboard-panel">
            <div class="section-title-row">
              <div>
                <p class="panel-kicker">Type Frequency</p>
                <h2>알람 유형별 발생 횟수</h2>
              </div>
              <Bell :size="22" />
            </div>

            <div class="frequency-bar-list type-frequency">
              <article v-for="item in typeFrequency" :key="item.label">
                <div>
                  <strong>{{ item.label }}</strong>
                  <span>알람 유형</span>
                </div>
                <div class="frequency-meter">
                  <i :style="{ width: `${item.percent}%` }"></i>
                </div>
                <b>{{ item.count }}건</b>
              </article>
            </div>
          </article>
        </section>
      </template>
    </section>
  </main>
</template>

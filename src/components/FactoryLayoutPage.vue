<script setup>
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import {
  AlertTriangle,
  CalendarDays,
  Check,
  ChevronDown,
  Factory,
  LogOut,
} from 'lucide-vue-next'
import { useAppNav } from '@/composables/useAppNav'
import { useLogout } from '@/composables/useLogout'

const { navItems } = useAppNav()
const logout = useLogout()

/** 라인 3개. 라인당: 주조 1 · 가공 3 · 세척 2 · 조립 2 · 검사 2 */
const lines = [
  {
    id: 'line-1',
    name: '라인 A',
    area: 'Line-A',
    status: '정상',
    oee: 91,
    uph: 60,
    equipment: 10,
    active: 10,
    alarm: 0,
    equipStatus: { run: 94, stop: 3, wait: 3, stopEnd: 97 },
    balance: 88,
    stations: [90, 92, 88, 91, 86, 89],
    upmh: 420,
    productivity: 94,
    upmhPercent: 88,
    uphPercent: 85,
    routeNote: '주조 → 가공(3) → 세척(2) → 조립(2) → 검사(2)',
  },
  {
    id: 'line-2',
    name: '라인 B',
    area: 'Line-B',
    status: '경고',
    oee: 84,
    uph: 60,
    equipment: 10,
    active: 10,
    alarm: 2,
    equipStatus: { run: 82, stop: 8, wait: 10, stopEnd: 90 },
    balance: 81,
    stations: [78, 82, 86, 80, 76, 83],
    upmh: 395,
    productivity: 86,
    upmhPercent: 78,
    uphPercent: 80,
    routeNote: '주조 → 가공(3) → 세척(2) → 조립(2) → 검사(2)',
  },
  {
    id: 'line-3',
    name: '라인 C',
    area: 'Line-C',
    status: '정상',
    oee: 88,
    uph: 60,
    equipment: 10,
    active: 10,
    alarm: 0,
    equipStatus: { run: 90, stop: 5, wait: 5, stopEnd: 95 },
    balance: 86,
    stations: [88, 90, 85, 87, 84, 86],
    upmh: 402,
    productivity: 90,
    upmhPercent: 81,
    uphPercent: 82,
    routeNote: '주조 → 가공(3) → 세척(2) → 조립(2) → 검사(2)',
  },
]

const equipmentNodes = [1, 2, 3].flatMap((n) => {
  const lineId = `line-${n}`
  const p = `L${n}`
  const castP = 17.8 + n * 0.1
  const rpm = 7050 - n * 80
  const line2Issues = n === 2

  return [
    {
      id: `${p}-CAST-01`,
      name: '주조기 1호',
      type: '주조기',
      lineId,
      status: '정상',
      main: `압력 ${castP.toFixed(1)}bar · 금형 ${210 + n}℃ · CT 60.0s`,
    },
    {
      id: `${p}-MACH-01`,
      name: '가공기 1호',
      type: '가공기',
      lineId,
      status: '정상',
      main: `스핀들 ${rpm + 120}rpm · 공구 ${40 + n * 6}h · CT 20.0s`,
    },
    {
      id: `${p}-MACH-02`,
      name: '가공기 2호',
      type: '가공기',
      lineId,
      status: line2Issues ? '주의' : '정상',
      main: line2Issues
        ? '진동 2.3mm/s · 공구 72h · CT 21.2s'
        : `스핀들 ${rpm}rpm · 공구 ${52 + n * 4}h · CT 20.2s`,
    },
    {
      id: `${p}-MACH-03`,
      name: '가공기 3호',
      type: '가공기',
      lineId,
      status: '정상',
      main: `스핀들 ${rpm - 100}rpm · 공구 ${48 + n * 3}h · CT 20.4s`,
    },
    {
      id: `${p}-WASH-01`,
      name: '세척기 1호',
      type: '세척기',
      lineId,
      status: '정상',
      main: `세척 농도 ${4.0 + n * 0.05}% · 세척 ${60 + n}℃ · CT 60.0s`,
    },
    {
      id: `${p}-WASH-02`,
      name: '세척기 2호',
      type: '세척기',
      lineId,
      status: line2Issues ? '경고' : '정상',
      main: line2Issues
        ? '농도 편차 · 필터 차압 상한 · CT 62.4s'
        : `세척 농도 ${4.1 + n * 0.04}% · 세척 ${61 + n}℃ · CT 60.2s`,
    },
    {
      id: `${p}-ASSY-01`,
      name: '조립기 1호',
      type: '조립기',
      lineId,
      status: '정상',
      main: `압력 ${(8.2 + n * 0.2).toFixed(1)}bar · 금형 ${44 + n}℃ · CT ${(51.5 + n * 0.3).toFixed(1)}s`,
    },
    {
      id: `${p}-ASSY-02`,
      name: '조립기 2호',
      type: '조립기',
      lineId,
      status: n === 1 ? '경고' : line2Issues ? '주의' : '정상',
      main:
        n === 1
          ? '압력 11.2bar · 금형 78℃ · CT 68.4s'
          : line2Issues
            ? '토크 상한 근접 · CT 65.1s'
            : `압력 ${(8.6 + n * 0.15).toFixed(1)}bar · 금형 ${46 + n}℃ · CT ${(52.2 + n * 0.2).toFixed(1)}s`,
    },
    {
      id: `${p}-INSP-01`,
      name: '검사기 1호',
      type: '검사기',
      lineId,
      status: '정상',
      main: `치수 목표 24.0${n}mm · 현재 24.0${n}mm · CT 30.0s`,
    },
    {
      id: `${p}-INSP-02`,
      name: '검사기 2호',
      type: '검사기',
      lineId,
      status: '정상',
      main: `치수 목표 18.5mm · 현재 18.5${n + 1}mm · CT 30.0s`,
    },
  ]
})

const selectedEquipmentId = ref('L1-CAST-01')
const selectedLineId = ref('line-1')

const selectedEquipment = computed(() =>
  equipmentNodes.find((node) => node.id === selectedEquipmentId.value),
)

const selectedLine = computed(() => lines.find((line) => line.id === selectedLineId.value))

const selectedEquipmentLine = computed(() => {
  const eq = selectedEquipment.value
  if (!eq) return null
  return lines.find((line) => line.id === eq.lineId) ?? null
})

const selectedEquipmentMetrics = computed(() => selectedEquipment.value?.main.split(' · ') ?? [])

const lineEquipments = (lineId) => equipmentNodes.filter((node) => node.lineId === lineId)

/** 주조 → 가공 → 세척 → 조립 → 검사 (가로 순서용 5단계) */
function stagesForLineId(lineId) {
  const eqs = lineEquipments(lineId)
  const cast = eqs.filter((e) => e.type === '주조기')
  const mach = eqs.filter((e) => e.type === '가공기').sort((a, b) => a.id.localeCompare(b.id))
  const wash = eqs.filter((e) => e.type === '세척기').sort((a, b) => a.id.localeCompare(b.id))
  const assy = eqs.filter((e) => e.type === '조립기').sort((a, b) => a.id.localeCompare(b.id))
  const insp = eqs.filter((e) => e.type === '검사기').sort((a, b) => a.id.localeCompare(b.id))
  return [
    { key: 'cast', label: '주조', badge: 'CAST', nodes: cast },
    { key: 'mach', label: '가공', badge: 'MACH', nodes: mach },
    { key: 'wash', label: '세척', badge: 'WASH', nodes: wash },
    { key: 'assy', label: '조립', badge: 'ASM', nodes: assy },
    { key: 'insp', label: '검사', badge: 'INSP', nodes: insp },
  ]
}

const layoutStages = computed(() => stagesForLineId(selectedLineId.value))

/** 공정 단계 요약 박스 테두리용 (가장 불량한 설비 상태) */
function worstStatusInNodes(nodes) {
  if (nodes.some((n) => n.status === '경고')) return '경고'
  if (nodes.some((n) => n.status === '주의')) return '주의'
  return '정상'
}

/** 라인 탭 클릭: 다른 라인이면 선택+상세 플로우 펼침, 동일 라인이면 상세 플로우 토글 */
const flowExpanded = ref(false)

function onLineTabClick(lineId) {
  if (selectedLineId.value === lineId) {
    flowExpanded.value = !flowExpanded.value
  } else {
    selectedLineId.value = lineId
    flowExpanded.value = true
    const eqs = lineEquipments(lineId)
    if (eqs.length && !eqs.some((e) => e.id === selectedEquipmentId.value)) {
      selectedEquipmentId.value = eqs[0].id
    }
  }
}

function collapseFlow() {
  flowExpanded.value = false
}

function displayEquipmentCode(id) {
  const m = id.match(/^L\d+-(.+)$/)
  return m ? m[1] : id
}

function pickEquipment(equipmentId) {
  const node = equipmentNodes.find((n) => n.id === equipmentId)
  if (node) {
    selectedLineId.value = node.lineId
    selectedEquipmentId.value = equipmentId
    flowExpanded.value = true
  }
}

function cardStatusClass(status) {
  if (status === '정상') return 'factory-simple-card--ok'
  if (status === '주의') return 'factory-simple-card--caution'
  return 'factory-simple-card--alert'
}
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
        <p>라인 A/B/C 3개 · 라인당 주조 1 · 가공 3 · 세척 2 · 조립 2 · 검사 2 (총 30대) · 주조→가공→세척→조립→검사</p>
      </div>
    </aside>

    <section class="dashboard-main">
      <header class="dashboard-header">
        <div class="dashboard-header-titles">
          <p class="dashboard-kicker">Factory Layout</p>
          <h1>공장 레이아웃</h1>
        </div>
        <div class="header-actions">
          <span class="current-time">
            <CalendarDays :size="16" />
            2026-05-11 12:40
          </span>
          <button type="button" class="icon-link" @click="logout">
            <LogOut :size="16" />
            <span>로그아웃</span>
          </button>
        </div>
      </header>

      <section class="dashboard-panel factory-page-panel">
        <div class="factory-line-toolbar factory-simple-toolbar">
          <div class="factory-status-legend" aria-label="설비 상태 범례">
            <span class="normal">정상</span>
            <span class="caution">주의</span>
            <span class="warn-strong">경고</span>
          </div>
        </div>

        <div class="factory-layout-workspace factory-layout-workspace--simple">
          <div class="factory-simple-canvas-wrap">
            <div class="factory-simple-line-tabs" role="tablist" aria-label="생산 라인 선택">
              <button
                v-for="line in lines"
                :key="line.id"
                type="button"
                role="tab"
                :aria-selected="selectedLineId === line.id"
                :aria-expanded="selectedLineId === line.id ? flowExpanded : false"
                :class="[
                  'factory-simple-line-tab',
                  line.status,
                  { 'factory-simple-line-tab--active': selectedLineId === line.id },
                  {
                    'factory-simple-line-tab--flow-open':
                      selectedLineId === line.id && flowExpanded,
                  },
                ]"
                @click="onLineTabClick(line.id)"
              >
                <span class="factory-simple-line-tab-area">{{ line.area }}</span>
                <strong>{{ line.name }}</strong>
                <span class="factory-simple-line-tab-oee">OEE {{ line.oee }}%</span>
                <span :class="['factory-simple-line-tab-state', 'line-state', line.status]">{{
                  line.status
                }}</span>
                <span
                  v-if="selectedLineId === line.id"
                  class="factory-simple-line-tab-hint"
                  aria-hidden="true"
                >
                  <ChevronDown
                    class="factory-simple-line-tab-chevron"
                    :class="{ 'factory-simple-line-tab-chevron--open': flowExpanded }"
                    :size="20"
                    :stroke-width="2.4"
                  />
                  {{ flowExpanded ? '상세 닫기' : '상세 공정' }}
                </span>
              </button>
            </div>

            <div v-if="selectedLine && !flowExpanded" class="factory-simple-meta">
              <span class="factory-simple-meta-hint">
                라인 카드를 누르면 설비 단위 상세 공정 흐름이 펼쳐집니다.
              </span>
            </div>

            <div class="factory-simple-board" :aria-label="`${selectedLine?.name ?? ''} 공정 배치`">
              <p class="factory-stage-lane-title">공정 순서</p>
              <div class="factory-stage-lane" aria-label="주조에서 검사까지 공정 요약">
                <template v-for="(stage, si) in layoutStages" :key="stage.key">
                  <div
                    class="factory-stage-summary"
                    :class="cardStatusClass(worstStatusInNodes(stage.nodes))"
                  >
                    <span class="factory-stage-summary-ko">{{ stage.label }}</span>
                    <span class="factory-stage-summary-en">{{ stage.badge }}</span>
                    <span class="factory-stage-summary-count">{{ stage.nodes.length }}대</span>
                    <span
                      :class="['factory-stage-summary-state', 'line-state', worstStatusInNodes(stage.nodes)]"
                    >
                      {{ worstStatusInNodes(stage.nodes) }}
                    </span>
                  </div>
                  <span
                    v-if="si < layoutStages.length - 1"
                    class="factory-stage-arrow"
                    aria-hidden="true"
                  >→</span>
                </template>
              </div>

              <Transition name="factory-flow-reveal">
                <div
                  v-if="flowExpanded && selectedLine"
                  class="factory-flow-detail"
                  aria-label="설비 단위 상세 공정 흐름"
                >
                  <div class="factory-flow-detail-head">
                    <h3 class="factory-flow-detail-title">
                      {{ selectedLine.name }} · 상세 공정 흐름
                    </h3>
                    <button type="button" class="factory-flow-detail-close" @click="collapseFlow">
                      접기
                    </button>
                  </div>
                  <div class="factory-flow-detail-scroll" aria-label="설비 단위 상세 공정 흐름">
                    <template v-for="(stage, si) in layoutStages" :key="'flow-' + stage.key">
                      <div class="factory-flow-stage-col">
                        <div class="factory-flow-stage-head">
                          <span class="factory-flow-stage-head-ko">{{ stage.label }}</span>
                          <span class="factory-flow-stage-head-en">{{ stage.badge }}</span>
                        </div>
                        <div class="factory-flow-stage-cards">
                          <template v-for="(node, ni) in stage.nodes" :key="node.id">
                            <button
                              type="button"
                              :class="[
                                'factory-simple-card',
                                cardStatusClass(node.status),
                                { 'factory-simple-card--selected': node.id === selectedEquipmentId },
                              ]"
                              @click="pickEquipment(node.id)"
                            >
                              <span class="factory-simple-card-icon" :class="cardStatusClass(node.status)">
                                <Check
                                  v-if="node.status === '정상'"
                                  :size="14"
                                  :stroke-width="3"
                                  class="factory-simple-card-icon-glyph"
                                />
                                <AlertTriangle
                                  v-else
                                  :size="14"
                                  :stroke-width="2.6"
                                  class="factory-simple-card-icon-glyph"
                                />
                              </span>
                              <strong class="factory-simple-card-name">{{ node.name }}</strong>
                              <span class="factory-simple-card-code">{{
                                displayEquipmentCode(node.id)
                              }}</span>
                            </button>
                            <span
                              v-if="ni < stage.nodes.length - 1"
                              class="factory-simple-connector factory-simple-connector--in-stage"
                              aria-hidden="true"
                            />
                          </template>
                        </div>
                      </div>
                      <span
                        v-if="si < layoutStages.length - 1"
                        class="factory-stage-arrow factory-stage-arrow--flow"
                        aria-hidden="true"
                      >→</span>
                    </template>
                  </div>
                </div>
              </Transition>
            </div>
          </div>

          <aside v-if="selectedEquipment" class="factory-detail-pane" aria-label="설비 상세 정보">
            <div class="factory-detail-head">
              <Factory :size="22" />
              <div>
                <p class="panel-kicker">설비 상세 정보</p>
                <h3>{{ selectedEquipment.name }}</h3>
              </div>
              <span :class="['line-state', selectedEquipment.status]">{{ selectedEquipment.status }}</span>
            </div>

            <dl class="factory-detail-list">
              <div>
                <dt>위치</dt>
                <dd>{{ selectedEquipmentLine?.name }} · {{ selectedEquipmentLine?.area }}</dd>
              </div>
              <div>
                <dt>설비 유형</dt>
                <dd>{{ selectedEquipment.type }}</dd>
              </div>
              <div>
                <dt>설비 ID</dt>
                <dd>{{ selectedEquipment.id }}</dd>
              </div>
            </dl>

            <div class="factory-detail-metrics">
              <article v-for="metric in selectedEquipmentMetrics" :key="metric">
                <span>{{ metric }}</span>
              </article>
            </div>

            <div class="factory-detail-alarm">
              <strong>최근 상태</strong>
              <p>{{ selectedEquipment.main }}</p>
            </div>
          </aside>
        </div>
      </section>
    </section>
  </main>
</template>

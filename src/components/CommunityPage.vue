<script setup>
import { computed, nextTick, onUnmounted, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import {
  CalendarDays,
  ChevronDown,
  LogOut,
  Megaphone,
  MessageSquare,
  Paperclip,
  Pin,
  Send,
  Users,
  X,
} from 'lucide-vue-next'
import { useAppNav } from '@/composables/useAppNav'
import { useLogout } from '@/composables/useLogout'

const { navItems } = useAppNav()
const logout = useLogout()

/** 라인별 그룹(요약) — 드롭다운 선택 시 상단에 표시 */
const lineGroups = [
  {
    lineKey: 'line-a',
    name: '라인 A · 주조',
    manager: '박주조',
    members: ['OP-1042', 'OP-1038', 'OP-1024', 'OP-1011'],
    task: 'CAST-02 온도 알람 확인',
  },
  {
    lineKey: 'line-b',
    name: '라인 B · 가공',
    manager: '이가공',
    members: ['OP-1130', 'OP-1125', 'OP-1104', 'MT-014'],
    task: 'MACH-11 공구 교체 준비',
  },
  {
    lineKey: 'line-c',
    name: '라인 C · 검사',
    manager: '한검사',
    members: ['OP-1187', 'OP-1171', 'QC-022', 'QC-018', 'OP-1008'],
    task: '치수 편차 샘플 재측정 · 압입하중 편차 확인',
  },
]

const lineScopeOptions = [
  { id: 'all', label: '전체 라인', targetLabel: null },
  { id: 'line-a', label: '라인 A', targetLabel: '라인 A' },
  { id: 'line-b', label: '라인 B', targetLabel: '라인 B' },
  { id: 'line-c', label: '라인 C', targetLabel: '라인 C' },
]

const notices = [
  {
    category: '공지',
    title: '금일 15:30 라인 B 공구 교체 작업 안내',
    author: '김관리',
    target: '라인 B',
    time: '12:20',
    pinned: true,
  },
  {
    category: '작업지시',
    title: 'CAST-02 용탕온도 알람 조치 결과 등록 요청',
    author: '김관리',
    target: '라인 A',
    time: '11:48',
    pinned: true,
  },
  {
    category: '품질공지',
    title: '검사기 치수 편차 발생 시 샘플링 기준 공유',
    author: '박품질',
    target: '라인 C',
    time: '10:35',
    pinned: false,
  },
  {
    category: '인수인계',
    title: '야간조 라인 C 압입하중 확인 포인트',
    author: '김관리',
    target: '라인 C',
    time: '09:12',
    pinned: false,
  },
  {
    category: '운영',
    title: '전 라인 금일 점검 체크리스트 제출 마감 16:00',
    author: '김관리',
    target: '전체',
    time: '08:30',
    pinned: false,
  },
  {
    category: '작업지시',
    title: '라인 A 금형 예열 스케줄 조정 안내',
    author: '김관리',
    target: '라인 A',
    time: '08:05',
    pinned: false,
  },
]

const chatMessages = [
  {
    user: '김관리',
    role: '관리자',
    line: '전체',
    time: '12:35',
    message: 'CAST-02 알람 조치 상황 공유 부탁드립니다.',
    mine: false,
  },
  {
    user: '박주조',
    role: '작업자',
    line: '라인 A',
    time: '12:36',
    message: '용탕온도 확인했고 센서값 재확인 중입니다.',
    mine: false,
  },
  {
    user: '김관리',
    role: '관리자',
    line: '전체',
    time: '12:38',
    message: '13시 전까지 금형온도도 같이 확인해서 결과 남겨주세요.',
    mine: true,
  },
  {
    user: '한검사',
    role: '작업자',
    line: '라인 C',
    time: '12:39',
    message: '검사 치수 편차 알람은 샘플 10개 추가 측정했습니다.',
    mine: false,
  },
  {
    user: '이가공',
    role: '작업자',
    line: '라인 B',
    time: '12:05',
    message: 'MACH-11 공구 교체 준비 완료했습니다.',
    mine: false,
  },
  {
    user: '이가공',
    role: '작업자',
    line: '라인 B',
    time: '11:42',
    message: '라인 B 가공 라인 스핀들 진동값 정상 범위입니다.',
    mine: false,
  },
  {
    user: '박주조',
    role: '작업자',
    line: '라인 A',
    time: '11:20',
    message: '주조 CT 편차 원인 분석 중입니다.',
    mine: false,
  },
]

const selectedLineScope = ref('all')
const lineDropdownOpen = ref(false)
const lineDropdownAnchorRef = ref(null)
/** Teleport된 드롭다운 패널 위치 (뷰포트 기준 fixed) */
const portalDropdownStyle = ref({})

const selectedScopeOption = computed(
  () => lineScopeOptions.find((o) => o.id === selectedLineScope.value) ?? lineScopeOptions[0],
)

const activeLineGroup = computed(() =>
  selectedLineScope.value === 'all'
    ? null
    : lineGroups.find((g) => g.lineKey === selectedLineScope.value) ?? null,
)

const filteredNotices = computed(() => {
  const opt = selectedScopeOption.value
  if (!opt.targetLabel) return notices
  return notices.filter(
    (n) => n.target === opt.targetLabel || n.target === '전체',
  )
})

const filteredChatMessages = computed(() => {
  const opt = selectedScopeOption.value
  if (!opt.targetLabel) return chatMessages
  const t = opt.targetLabel
  return chatMessages.filter((m) => m.line === '전체' || m.line === t)
})

function syncPortalDropdownPosition() {
  const anchor = lineDropdownAnchorRef.value
  if (!anchor) return
  const r = anchor.getBoundingClientRect()
  const margin = 10
  const vw = window.innerWidth
  const vh = window.innerHeight
  const panelMaxW = 520
  const width = Math.min(panelMaxW, Math.max(r.width, 300), vw - margin * 2)
  let left = r.left
  if (left + width > vw - margin) {
    left = Math.max(margin, vw - margin - width)
  }
  const top = r.bottom + 6
  const maxHeight = Math.max(220, Math.min(vh * 0.72, vh - top - margin))

  portalDropdownStyle.value = {
    position: 'fixed',
    top: `${top}px`,
    left: `${left}px`,
    width: `${width}px`,
    maxHeight: `${maxHeight}px`,
  }
}

function toggleLineDropdown(ev) {
  ev.stopPropagation()
  lineDropdownOpen.value = !lineDropdownOpen.value
}

function selectLineScope(id) {
  selectedLineScope.value = id
}

function closeLineDropdown() {
  lineDropdownOpen.value = false
}

function onEscapeKey(ev) {
  if (ev.key === 'Escape') closeLineDropdown()
}

function onScrollOrResize() {
  if (lineDropdownOpen.value) syncPortalDropdownPosition()
}

watch(lineDropdownOpen, async (open) => {
  if (open) {
    await nextTick()
    syncPortalDropdownPosition()
    document.addEventListener('keydown', onEscapeKey)
    window.addEventListener('resize', onScrollOrResize)
    document.addEventListener('scroll', onScrollOrResize, true)
  } else {
    document.removeEventListener('keydown', onEscapeKey)
    window.removeEventListener('resize', onScrollOrResize)
    document.removeEventListener('scroll', onScrollOrResize, true)
  }
})

onUnmounted(() => {
  document.removeEventListener('keydown', onEscapeKey)
  window.removeEventListener('resize', onScrollOrResize)
  document.removeEventListener('scroll', onScrollOrResize, true)
})
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
        <p>라인별 작업자 그룹, 관리자 게시판, 업무지시 채팅 관리</p>
      </div>
    </aside>

    <section class="dashboard-main community-dashboard-main">
      <header class="dashboard-header">
        <div class="dashboard-header-titles community-header-titles">
          <div class="community-header-title-block">
            <p class="dashboard-kicker">Community</p>
            <div class="community-title-row">
              <h1>커뮤니티</h1>
              <div ref="lineDropdownAnchorRef" class="community-line-dropdown">
                <button
                  type="button"
                  class="community-line-dropdown-trigger"
                  :aria-expanded="lineDropdownOpen"
                  aria-haspopup="dialog"
                  aria-controls="community-line-dropdown-portal-panel"
                  @click="toggleLineDropdown"
                >
                  <Users :size="18" />
                  <span class="community-line-dropdown-label">
                    <span class="community-line-dropdown-primary">라인별 그룹화</span>
                    <span class="community-line-dropdown-secondary">{{ selectedScopeOption.label }}</span>
                  </span>
                  <ChevronDown
                    class="community-line-dropdown-chevron"
                    :class="{ 'community-line-dropdown-chevron--open': lineDropdownOpen }"
                    :size="18"
                    :stroke-width="2.4"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="header-actions">
          <span class="current-time">
            <CalendarDays :size="16" />
            2026-05-11 12:40
          </span>
          <button class="primary-action" type="button">
            <Megaphone :size="17" />
            <span>알림 작성</span>
          </button>
          <button type="button" class="icon-link" @click="logout">
            <LogOut :size="16" />
            <span>로그아웃</span>
          </button>
        </div>
      </header>

      <!-- 드롭다운을 body로 포탈 렌더링 (overflow·z-index 이슈 회피, 트리거 기준 위치) -->
      <Teleport to="body">
        <div
          v-if="lineDropdownOpen"
          class="community-line-dropdown-portal"
          role="presentation"
        >
          <div
            class="community-line-dropdown-portal-backdrop"
            aria-hidden="true"
            @click="closeLineDropdown"
          />
          <div
            id="community-line-dropdown-portal-panel"
            class="community-line-overlay-panel community-line-dropdown-portal-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="community-line-overlay-title"
            :style="portalDropdownStyle"
            @click.stop
          >
            <header class="community-line-overlay-head">
              <div>
                <p class="community-line-overlay-kicker">라인 범위</p>
                <h2 id="community-line-overlay-title">라인별 그룹화</h2>
                <p class="community-line-overlay-desc">
                  게시판·채팅에 표시할 라인 범위를 선택합니다.
                </p>
              </div>
              <button
                type="button"
                class="community-line-overlay-close"
                aria-label="닫기"
                @click="closeLineDropdown"
              >
                <X :size="20" :stroke-width="2.2" />
              </button>
            </header>

            <section class="community-line-overlay-section" aria-label="표시 범위">
              <h3 class="community-line-overlay-section-title">표시 범위</h3>
              <ul
                id="community-line-scope-list"
                class="community-line-overlay-scope-list"
                role="listbox"
                :aria-label="'현재 선택: ' + selectedScopeOption.label"
              >
                <li v-for="opt in lineScopeOptions" :key="opt.id" role="none">
                  <button
                    type="button"
                    role="option"
                    class="community-line-dropdown-item"
                    :aria-selected="selectedLineScope === opt.id"
                    @click="selectLineScope(opt.id)"
                  >
                    {{ opt.label }}
                  </button>
                </li>
              </ul>
            </section>

            <footer class="community-line-overlay-footer">
              <button type="button" class="primary-action" @click="closeLineDropdown">
                확인
              </button>
            </footer>
          </div>
        </div>
      </Teleport>

      <section class="community-workspace" aria-label="커뮤니티 기능 영역">
        <div class="community-feature-pane community-feature-pane--full">
          <div
            v-if="activeLineGroup"
            class="community-line-context-bar"
            :aria-label="`${activeLineGroup.name} 요약`"
          >
            <div>
              <strong>{{ activeLineGroup.name }}</strong>
              <span>담당 {{ activeLineGroup.manager }} · {{ activeLineGroup.members.length }}명</span>
            </div>
            <p>{{ activeLineGroup.task }}</p>
          </div>

          <div class="community-board-chat-split" aria-label="게시판과 채팅">
            <article class="dashboard-panel board-panel community-feature-panel community-split-half">
              <div class="section-title-row">
                <div>
                  <p class="panel-kicker">Admin Board</p>
                  <h2>게시판</h2>
                  <p v-if="selectedScopeOption.targetLabel" class="community-scope-sub">
                    {{ selectedScopeOption.label }} 관련 글
                  </p>
                  <p v-else class="community-scope-sub">전체 라인</p>
                </div>
                <span class="section-note">관리자 작성</span>
              </div>

              <div class="notice-list simple">
                <template v-if="filteredNotices.length">
                  <article v-for="notice in filteredNotices" :key="notice.title + notice.time">
                    <div class="notice-icon">
                      <Pin v-if="notice.pinned" :size="17" />
                      <Megaphone v-else :size="17" />
                    </div>
                    <div>
                      <div class="notice-meta">
                        <span>{{ notice.category }}</span>
                        <span>{{ notice.target }}</span>
                        <time>{{ notice.time }}</time>
                      </div>
                      <strong>{{ notice.title }}</strong>
                      <p>{{ notice.author }}가 작업자들에게 전달</p>
                    </div>
                  </article>
                </template>
                <p v-else class="community-empty-inline">해당 라인에 표시할 게시글이 없습니다.</p>
              </div>
            </article>

            <article class="dashboard-panel chat-panel community-feature-panel community-split-half">
              <div class="section-title-row">
                <div>
                  <p class="panel-kicker">Work Chat</p>
                  <h2>채팅</h2>
                  <p v-if="selectedScopeOption.targetLabel" class="community-scope-sub">
                    {{ selectedScopeOption.label }} · 전체 공지 포함
                  </p>
                  <p v-else class="community-scope-sub">전체 라인</p>
                </div>
                <MessageSquare :size="22" />
              </div>

              <div class="chat-message-list">
                <template v-if="filteredChatMessages.length">
                  <article
                    v-for="message in filteredChatMessages"
                    :key="`${message.user}-${message.time}-${message.message.slice(0, 12)}`"
                    :class="{ mine: message.mine }"
                  >
                    <div class="chat-avatar">{{ message.user.slice(0, 1) }}</div>
                    <div class="chat-bubble">
                      <div class="chat-meta">
                        <strong>{{ message.user }}</strong>
                        <span>{{ message.role }} · {{ message.line }} · {{ message.time }}</span>
                      </div>
                      <p>{{ message.message }}</p>
                    </div>
                  </article>
                </template>
                <p v-else class="community-empty-inline community-empty-inline--chat">표시할 메시지가 없습니다.</p>
              </div>

              <div class="chat-input-row">
                <button type="button" title="첨부">
                  <Paperclip :size="17" />
                </button>
                <input type="text" value="구체적인 업무지시를 입력하세요" />
                <button type="button" title="전송">
                  <Send :size="17" />
                </button>
              </div>
            </article>
          </div>
        </div>
      </section>
    </section>
  </main>
</template>

import { reactive, computed } from 'vue'

const STORAGE_KEY = 'solo-life-game-v1'

export const ATTRS = [
  { key: 'forca', label: 'Força', icon: '💪' },
  { key: 'agilidade', label: 'Agilidade', icon: '⚡' },
  { key: 'vitalidade', label: 'Vitalidade', icon: '❤️' },
  { key: 'inteligencia', label: 'Inteligência', icon: '🧠' },
  { key: 'percepcao', label: 'Percepção', icon: '👁️' }
]

export const DIFFICULTIES = {
  facil: { key: 'facil', label: 'Fácil', rank: 'E', xp: 15, color: '#4ade80' },
  normal: { key: 'normal', label: 'Normal', rank: 'D', xp: 30, color: '#38bdf8' },
  dificil: { key: 'dificil', label: 'Difícil', rank: 'C', xp: 60, color: '#818cf8' },
  epico: { key: 'epico', label: 'Épico', rank: 'B', xp: 120, color: '#c084fc' },
  lendario: { key: 'lendario', label: 'Lendário', rank: 'A', xp: 250, color: '#f59e0b' }
}

export const RANKS = [
  { min: 1, rank: 'E', title: 'Caçador Novato', className: 'Novato', color: '#94a3b8' },
  { min: 10, rank: 'D', title: 'Caçador de Ferro', className: 'Guerreiro', color: '#4ade80' },
  { min: 20, rank: 'C', title: 'Caçador de Bronze', className: 'Assassino', color: '#38bdf8' },
  { min: 35, rank: 'B', title: 'Caçador de Prata', className: 'Mago', color: '#818cf8' },
  { min: 50, rank: 'A', title: 'Caçador de Ouro', className: 'Mestre', color: '#c084fc' },
  { min: 70, rank: 'S', title: 'Monarca das Sombras', className: 'Monarca', color: '#f59e0b' },
  { min: 100, rank: 'SS', title: 'Ser Transcendental', className: 'Transcendental', color: '#ef4444' }
]

const DEFAULT_DAILY = [
  { title: 'Corrida de 3 km', attribute: 'agilidade' },
  { title: '30 agachamentos', attribute: 'forca' },
  { title: '30 flexões', attribute: 'forca' },
  { title: '30 min de leitura', attribute: 'inteligencia' }
]

// usado para migrar saves antigos que ainda usam as diárias padrão anteriores
const DAILY_VERSION = 2
const OLD_DEFAULT_TITLES = ['100 flexões', '100 abdominais', '100 agachamentos', 'Corrida de 10 km']

function uid () {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36)
}

function todayKey () {
  const d = new Date()
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
}

function xpForLevel (level) {
  const n = level - 1
  return Math.floor(100 + 50 * n + 10 * n * n)
}

function rankForLevel (level) {
  let current = RANKS[0]
  for (const r of RANKS) {
    if (level >= r.min) current = r
  }
  return current
}

function makeQuest (data) {
  return {
    id: uid(),
    title: data.title,
    description: data.description || '',
    attribute: data.attribute || 'forca',
    type: data.type || 'custom', // daily | custom
    repeat: data.repeat !== undefined ? data.repeat : false, // repete todo dia
    difficulty: data.difficulty || 'normal',
    completed: false,
    completedAt: null,
    createdAt: Date.now()
  }
}

function defaultState () {
  return {
    player: {
      name: 'Caçador',
      title: RANKS[0].title,
      level: 1,
      xp: 0,
      totalXp: 0,
      statPoints: 0,
      stats: { forca: 10, agilidade: 10, vitalidade: 10, inteligencia: 10, percepcao: 10 }
    },
    quests: DEFAULT_DAILY.map(q => makeQuest({
      title: q.title,
      attribute: q.attribute,
      type: 'daily',
      repeat: true,
      difficulty: 'normal',
      description: 'Missão diária obrigatória do Sistema.'
    })),
    logs: [],
    streak: 0,
    lastActiveDay: todayKey(),
    lastDailyReset: todayKey(),
    penalty: { pending: false, amount: 0, reason: '' },
    settings: { penaltyEnabled: true }
  }
}

export const game = reactive({
  state: defaultState(),
  levelUpQueue: [],
  toasts: [],

  // ---------- lifecycle ----------
  init () {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        this.state = { ...defaultState(), ...parsed }
        this.state.penalty = { ...defaultState().penalty, ...(parsed.penalty || {}) }
        this.state.settings = { ...defaultState().settings, ...(parsed.settings || {}) }
      } catch (e) {
        console.warn('Falha ao carregar save, iniciando novo jogo.', e)
      }
    }
    this.migrateDaily()
    this.checkDailyReset()
    this.persist()
  },

  migrateDaily () {
    const s = this.state
    if (s.dailyVersion === DAILY_VERSION) return
    const oldDefaults = new Set(OLD_DEFAULT_TITLES)
    s.quests = s.quests.filter(q => !(q.type === 'daily' && oldDefaults.has(q.title)))
    DEFAULT_DAILY.forEach(d => {
      if (!s.quests.some(q => q.title === d.title)) {
        s.quests.push(makeQuest({
          title: d.title,
          attribute: d.attribute,
          type: 'daily',
          repeat: true,
          difficulty: 'normal',
          description: 'Missão diária obrigatória do Sistema.'
        }))
      }
    })
    s.dailyVersion = DAILY_VERSION
  },

  persist () {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state))
  },

  resetGame () {
    this.state = defaultState()
    this.persist()
    this.toast('Sistema reiniciado. Bem-vindo, novo Caçador.', 'info')
  },

  // ---------- computed-ish getters ----------
  get player () { return this.state.player },
  get xpNeeded () { return xpForLevel(this.state.player.level) },
  get xpProgress () {
    const need = this.xpNeeded
    return Math.min(100, Math.round((this.state.player.xp / need) * 100))
  },
  get rank () { return rankForLevel(this.state.player.level) },
  get dailyQuests () { return this.state.quests.filter(q => q.type === 'daily') },
  get customQuests () { return this.state.quests.filter(q => q.type === 'custom') },
  get dailyDone () { return this.dailyQuests.filter(q => q.completed).length },
  get dailyTotal () { return this.dailyQuests.length },

  // ---------- quests ----------
  addQuest (data) {
    const q = makeQuest(data)
    this.state.quests.push(q)
    this.log(`Nova missão registrada: "${q.title}"`)
    this.toast(`Nova missão: ${q.title}`, 'info')
    this.persist()
    return q
  },

  removeQuest (id) {
    const q = this.state.quests.find(x => x.id === id)
    if (!q) return
    this.state.quests = this.state.quests.filter(x => x.id !== id)
    this.log(`Missão removida: "${q.title}"`)
    this.persist()
  },

  completeQuest (id) {
    const q = this.state.quests.find(x => x.id === id)
    if (!q || q.completed) return
    const diff = DIFFICULTIES[q.difficulty] || DIFFICULTIES.normal
    const gain = diff.xp

    q.completed = true
    q.completedAt = Date.now()

    // atributo ganha um pequeno bônus por completar
    const bonus = Math.max(1, Math.round(diff.xp / 40))
    this.state.player.stats[q.attribute] = (this.state.player.stats[q.attribute] || 0) + bonus

    this.log(`Missão cumprida: "${q.title}" (+${gain} XP, +${bonus} ${attrLabel(q.attribute)})`)
    this.toast(`+${gain} XP  •  ${q.title}`, 'success')
    this.grantXp(gain)
    this.checkStreak()
    this.persist()
  },

  undoQuest (id) {
    const q = this.state.quests.find(x => x.id === id)
    if (!q || !q.completed) return
    const diff = DIFFICULTIES[q.difficulty] || DIFFICULTIES.normal
    q.completed = false
    q.completedAt = null
    this.state.player.xp = Math.max(0, this.state.player.xp - diff.xp)
    this.state.player.totalXp = Math.max(0, this.state.player.totalXp - diff.xp)
    this.log(`Missão revertida: "${q.title}"`)
    this.persist()
  },

  // ---------- progression ----------
  grantXp (amount) {
    const p = this.state.player
    p.xp += amount
    p.totalXp += amount
    let leveled = false
    while (p.xp >= xpForLevel(p.level)) {
      p.xp -= xpForLevel(p.level)
      p.level += 1
      p.statPoints += 3
      leveled = true
      this.levelUpQueue.push(p.level)
    }
    if (leveled) {
      const r = rankForLevel(p.level)
      p.title = r.title
      this.log(`SUBIU DE NÍVEL! Agora é nível ${p.level} — ${r.title}`, 'level')
    }
  },

  spendPoint (attr) {
    const p = this.state.player
    if (p.statPoints <= 0) return
    p.stats[attr] += 1
    p.statPoints -= 1
    this.persist()
  },

  // ---------- daily / penalty ----------
  checkDailyReset () {
    const today = todayKey()
    if (this.state.lastDailyReset === today) return

    const hadIncomplete = this.dailyQuests.some(q => !q.completed)
    if (hadIncomplete && this.state.settings.penaltyEnabled && this.dailyQuests.length > 0) {
      const loss = Math.min(this.state.player.xp, Math.round(xpForLevel(this.state.player.level) * 0.1))
      this.state.penalty = {
        pending: true,
        amount: loss,
        reason: 'Missões diárias não concluídas. Você foi lançado na Zona de Penalidade.'
      }
      this.state.player.xp -= loss
      this.state.player.statPoints = Math.max(0, this.state.player.statPoints)
      this.log('ZONA DE PENALIDADE: missões diárias falharam.', 'penalty')
      this.state.streak = 0
    }

    this.dailyQuests.forEach(q => { q.completed = false; q.completedAt = null })
    this.state.lastDailyReset = today
    this.state.lastActiveDay = today
    this.persist()
  },

  checkStreak () {
    const allDone = this.dailyQuests.length > 0 && this.dailyQuests.every(q => q.completed)
    if (allDone) {
      this.state.streak += 1
      this.log(`Sequência perfeita! ${this.state.streak} dia(s) sem falhas.`, 'level')
      this.persist()
    }
  },

  acknowledgePenalty () {
    this.state.penalty = { pending: false, amount: 0, reason: '' }
    this.persist()
  },

  // ---------- logs & toasts ----------
  log (message, kind = 'info') {
    this.state.logs.unshift({ id: uid(), message, kind, at: Date.now() })
    this.state.logs = this.state.logs.slice(0, 60)
  },

  toast (message, kind = 'info') {
    const id = uid()
    this.toasts.push({ id, message, kind })
    setTimeout(() => {
      this.toasts = this.toasts.filter(t => t.id !== id)
    }, 3200)
  }
})

function attrLabel (key) {
  const a = ATTRS.find(x => x.key === key)
  return a ? a.label : key
}

export { xpForLevel, rankForLevel }

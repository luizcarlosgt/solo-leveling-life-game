<script setup>
import { computed } from 'vue'
import { game } from '../stores/game.js'

const p = computed(() => game.state.player)
const rank = computed(() => game.rank)
const xpNeeded = computed(() => game.xpNeeded)
const xpProgress = computed(() => game.xpProgress)
const dailyDone = computed(() => game.dailyDone)
const dailyTotal = computed(() => game.dailyTotal)
</script>

<template>
  <div class="window player-panel">
    <div class="panel-title"><span class="dot"></span> Status do Caçador</div>

    <div class="body">
      <div class="avatar" :style="{ '--rank-color': rank.color }">
        <span class="rank-letter">{{ rank.rank }}</span>
        <span class="rank-ring"></span>
      </div>

      <div class="ident">
        <h2 class="name glow-text">{{ p.name }}</h2>
        <p class="title-line" :style="{ color: rank.color }">{{ p.title }}</p>
        <p class="class-line">Classe: <strong>{{ rank.className }}</strong></p>
      </div>

      <div class="level-badge">
        <span class="lvl-label">NÍVEL</span>
        <span class="lvl-value mono">{{ p.level }}</span>
      </div>
    </div>

    <div class="xp">
      <div class="xp-head">
        <span>EXPERIÊNCIA</span>
        <span class="mono">{{ p.xp }} / {{ xpNeeded }}</span>
      </div>
      <div class="bar">
        <div class="bar-fill" :style="{ width: xpProgress + '%' }"></div>
      </div>
    </div>

    <div class="mini-stats">
      <div class="mini">
        <span class="mini-val mono">{{ dailyDone }}/{{ dailyTotal }}</span>
        <span class="mini-lbl">Missões hoje</span>
      </div>
      <div class="mini">
        <span class="mini-val mono" :class="{ hot: p.statPoints > 0 }">{{ p.statPoints }}</span>
        <span class="mini-lbl">Pontos de atributo</span>
      </div>
      <div class="mini">
        <span class="mini-val mono">{{ game.state.streak }}🔥</span>
        <span class="mini-lbl">Sequência</span>
      </div>
      <div class="mini">
        <span class="mini-val mono">{{ p.totalXp }}</span>
        <span class="mini-lbl">XP total</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.player-panel { overflow: hidden; }

.body {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 18px 18px 12px;
}

.avatar {
  position: relative;
  width: 78px; height: 78px;
  border-radius: 16px;
  display: grid;
  place-items: center;
  background: radial-gradient(circle at 50% 30%, rgba(56, 189, 248, 0.22), rgba(5, 8, 16, 0.9));
  border: 1px solid var(--rank-color);
  box-shadow: 0 0 22px -4px var(--rank-color);
  flex-shrink: 0;
}

.rank-letter {
  font-family: 'Orbitron', sans-serif;
  font-size: 2.1rem;
  font-weight: 800;
  color: var(--rank-color);
  text-shadow: 0 0 16px var(--rank-color);
}

.rank-ring {
  position: absolute;
  inset: -5px;
  border-radius: 19px;
  border: 1px dashed var(--rank-color);
  opacity: 0.4;
  animation: spin 12s linear infinite;
}

.ident { flex: 1; min-width: 0; }
.name { font-size: 1.25rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.title-line { margin: 4px 0 2px; font-weight: 600; letter-spacing: 0.05em; font-size: 0.86rem; }
.class-line { margin: 0; color: var(--text-dim); font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.1em; }
.class-line strong { color: var(--text); }

.level-badge {
  display: flex; flex-direction: column; align-items: center;
  padding: 8px 14px;
  border-radius: 12px;
  background: rgba(56, 189, 248, 0.08);
  border: 1px solid var(--border);
  flex-shrink: 0;
}
.lvl-label { font-size: 0.6rem; letter-spacing: 0.22em; color: var(--text-dim); }
.lvl-value { font-family: 'Orbitron', sans-serif; font-size: 1.7rem; font-weight: 800; color: var(--accent); text-shadow: 0 0 14px var(--accent-glow); line-height: 1; }

.xp { padding: 4px 18px 16px; }
.xp-head { display: flex; justify-content: space-between; font-size: 0.68rem; letter-spacing: 0.16em; color: var(--text-dim); margin-bottom: 6px; }

.bar {
  height: 12px;
  border-radius: 99px;
  background: rgba(3, 7, 16, 0.9);
  border: 1px solid var(--border);
  overflow: hidden;
  position: relative;
}

.bar-fill {
  height: 100%;
  border-radius: 99px;
  background: linear-gradient(90deg, var(--accent-2), var(--accent));
  box-shadow: 0 0 16px var(--accent-glow);
  transition: width 0.5s cubic-bezier(0.22, 1, 0.36, 1);
  position: relative;
}
.bar-fill::after {
  content: '';
  position: absolute; inset: 0;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,.35), transparent);
  animation: sheen 2.4s infinite;
}

.mini-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border-top: 1px solid var(--border);
}
.mini { padding: 12px 8px; text-align: center; border-right: 1px solid var(--border); }
.mini:last-child { border-right: none; }
.mini-val { display: block; font-family: 'Orbitron', sans-serif; font-size: 1.05rem; font-weight: 700; color: var(--text); }
.mini-val.hot { color: var(--gold); text-shadow: 0 0 12px rgba(245,158,11,.6); animation: pulse 1.6s infinite; }
.mini-lbl { display: block; font-size: 0.6rem; letter-spacing: 0.08em; color: var(--text-dim); text-transform: uppercase; margin-top: 2px; }

@keyframes spin { to { transform: rotate(360deg); } }
@keyframes sheen { 0% { transform: translateX(-100%); } 100% { transform: translateX(200%); } }
</style>

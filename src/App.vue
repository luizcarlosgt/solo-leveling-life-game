<script setup>
import { onMounted, onUnmounted, computed } from 'vue'
import { game } from './stores/game.js'
import PlayerPanel from './components/PlayerPanel.vue'
import StatsPanel from './components/StatsPanel.vue'
import QuestList from './components/QuestList.vue'
import AddQuest from './components/AddQuest.vue'
import LogPanel from './components/LogPanel.vue'
import LevelUpModal from './components/LevelUpModal.vue'
import PenaltyModal from './components/PenaltyModal.vue'
import Toasts from './components/Toasts.vue'

const rank = computed(() => game.rank)
let timer = null

onMounted(() => {
  timer = setInterval(() => game.checkDailyReset(), 60000)
})

onUnmounted(() => clearInterval(timer))

function rename (e) {
  game.state.player.name = e.target.value || 'Caçador'
  game.persist()
}

function confirmReset () {
  if (confirm('Reiniciar todo o progresso? Isso apagará nível, atributos e missões.')) {
    game.resetGame()
  }
}
</script>

<template>
  <div class="app">
    <header class="topbar">
      <div class="brand">
        <span class="sigil">⚔</span>
        <div>
          <h1 class="glow-text">SISTEMA</h1>
          <p class="sub">Hunter Life Game</p>
        </div>
      </div>

      <div class="hunter-name">
        <label>Caçador</label>
        <input :value="game.state.player.name" @change="rename" maxlength="20" spellcheck="false" />
      </div>

      <div class="top-right">
        <div class="rank-pill" :style="{ '--c': rank.color }">
          <span class="r">{{ rank.rank }}</span>
          <span class="t">{{ rank.title }}</span>
        </div>
        <button class="btn ghost" @click="confirmReset" title="Reiniciar progresso">⟲</button>
      </div>
    </header>

    <main class="grid">
      <section class="col">
        <PlayerPanel />
        <StatsPanel />
      </section>

      <section class="col center">
        <QuestList />
        <AddQuest />
      </section>

      <section class="col">
        <LogPanel />
        <div class="window tip">
          <div class="panel-title"><span class="dot"></span> Como Jogar</div>
          <ul>
            <li>Conclua as <strong>missões diárias</strong> para ganhar XP e manter sua sequência.</li>
            <li>Registre <strong>suas próprias missões</strong> com níveis de dificuldade.</li>
            <li>Ao subir de nível você ganha <strong>pontos de atributo</strong> — invista em Força, Inteligência e mais.</li>
            <li>Missões diárias não concluídas ativam a <strong>Zona de Penalidade</strong> e você perde XP.</li>
            <li>Seu progresso é salvo automaticamente no navegador.</li>
          </ul>
        </div>
      </section>
    </main>

    <LevelUpModal />
    <PenaltyModal />
    <Toasts />
  </div>
</template>

<style scoped>
.app { position: relative; z-index: 1; max-width: 1320px; margin: 0 auto; padding: 22px 22px 60px; }

.topbar {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 14px 20px;
  margin-bottom: 22px;
  border: 1px solid var(--border);
  border-radius: 16px;
  background: linear-gradient(180deg, rgba(13, 20, 38, 0.9), rgba(8, 12, 24, 0.7));
  backdrop-filter: blur(8px);
  box-shadow: 0 0 30px -12px var(--accent-glow);
  flex-wrap: wrap;
}

.brand { display: flex; align-items: center; gap: 14px; }
.sigil {
  font-size: 1.7rem;
  filter: drop-shadow(0 0 10px var(--accent-glow));
}
.brand h1 { font-size: 1.3rem; line-height: 1; }
.sub { margin: 3px 0 0; font-size: 0.68rem; letter-spacing: 0.3em; color: var(--text-dim); text-transform: uppercase; }

.hunter-name { display: flex; flex-direction: column; gap: 3px; margin-left: auto; }
.hunter-name label { font-size: 0.6rem; letter-spacing: 0.24em; color: var(--text-dim); text-transform: uppercase; }
.hunter-name input {
  background: rgba(4, 8, 18, 0.8);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 6px 10px;
  color: var(--text);
  font-weight: 600;
  outline: none;
  width: 150px;
  transition: border-color 0.18s, box-shadow 0.18s;
}
.hunter-name input:focus { border-color: var(--border-strong); box-shadow: 0 0 12px rgba(56,189,248,.25); }

.top-right { display: flex; align-items: center; gap: 10px; }
.rank-pill {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 6px 16px;
  border-radius: 10px;
  border: 1px solid var(--c);
  background: color-mix(in srgb, var(--c) 12%, transparent);
  box-shadow: 0 0 20px -8px var(--c);
}
.rank-pill .r { font-family: 'Orbitron', sans-serif; font-weight: 800; color: var(--c); font-size: 1rem; line-height: 1; }
.rank-pill .t { font-size: 0.58rem; letter-spacing: 0.1em; color: var(--text-dim); text-transform: uppercase; margin-top: 2px; }

.grid {
  display: grid;
  grid-template-columns: 1.05fr 1.35fr 1fr;
  gap: 18px;
  align-items: start;
}

.col { display: flex; flex-direction: column; gap: 18px; min-width: 0; }

.tip ul { margin: 0; padding: 14px 18px 16px 30px; display: flex; flex-direction: column; gap: 9px; }
.tip li { font-size: 0.78rem; color: var(--text-dim); line-height: 1.5; }
.tip strong { color: var(--text); }

@media (max-width: 1080px) {
  .grid { grid-template-columns: 1fr 1fr; }
  .center { order: -1; grid-column: 1 / -1; }
}

@media (max-width: 720px) {
  .app { padding: 14px 12px 50px; }
  .grid { grid-template-columns: 1fr; }
  .center { grid-column: auto; }
  .topbar { gap: 12px; }
  .hunter-name { margin-left: 0; }
}
</style>

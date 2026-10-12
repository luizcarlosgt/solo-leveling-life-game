<script setup>
import { computed } from 'vue'
import { game, rankForLevel } from '../stores/game.js'
import Icon from './Icon.vue'

const level = computed(() => game.levelUpQueue[0] ?? null)
const rank = computed(() => (level.value ? rankForLevel(level.value) : null))

function dismiss () {
  game.levelUpQueue.shift()
}
</script>

<template>
  <Transition name="modal">
    <div v-if="level !== null" class="overlay">
      <div class="levelup window">
        <div class="rays"></div>
        <p class="sys">[ SISTEMA ]</p>
        <div class="up-ico"><Icon name="crown" size="2.4rem" /></div>
        <h2 class="big glow-text">LEVEL UP</h2>
        <div class="lvl-display">
          <span class="lbl">NÍVEL</span>
          <span class="num mono">{{ level }}</span>
        </div>
        <p v-if="rank" class="new-rank" :style="{ color: rank.color }">
          {{ rank.rank }}-Rank · {{ rank.title }}
        </p>
        <p class="msg">Você ficou mais forte, Caçador. Distribua seus pontos de atributo.</p>
        <button class="btn confirm" @click="dismiss"><Icon name="lightning" size="1.05em" /> Receber Poder</button>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: grid;
  place-items: center;
  background: radial-gradient(circle at 50% 50%, rgba(56, 189, 248, 0.14), rgba(2, 4, 10, 0.92));
  backdrop-filter: blur(4px);
}

.levelup {
  position: relative;
  width: min(420px, 90vw);
  padding: 34px 28px 30px;
  text-align: center;
  overflow: hidden;
  animation: pop 0.45s cubic-bezier(0.22, 1, 0.36, 1);
}

.rays {
  position: absolute;
  top: -50%; left: 50%;
  width: 200%; height: 200%;
  transform: translateX(-50%);
  background: conic-gradient(from 0deg, transparent 0deg, rgba(56,189,248,.14) 8deg, transparent 16deg,
    transparent 30deg, rgba(56,189,248,.14) 38deg, transparent 46deg,
    transparent 90deg, rgba(56,189,248,.14) 98deg, transparent 106deg,
    transparent 180deg, rgba(56,189,248,.14) 188deg, transparent 196deg,
    transparent 270deg, rgba(56,189,248,.14) 278deg, transparent 286deg);
  animation: spin 14s linear infinite;
  pointer-events: none;
}

.sys { position: relative; font-size: 0.7rem; letter-spacing: 0.4em; color: var(--accent); margin: 0 0 8px; }
.up-ico {
  position: relative;
  color: var(--accent);
  filter: drop-shadow(0 0 16px var(--accent-glow));
  margin-bottom: 6px;
  animation: bob 2.2s ease-in-out infinite;
}
@keyframes bob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
.big {
  position: relative;
  font-size: 2rem;
  font-weight: 800;
  background: linear-gradient(180deg, #fff, var(--accent));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  margin-bottom: 18px;
}

.lvl-display {
  position: relative;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 40px;
  border-radius: 14px;
  border: 1px solid var(--border-strong);
  background: rgba(56, 189, 248, 0.08);
  box-shadow: 0 0 30px -6px var(--accent-glow);
  margin-bottom: 16px;
}
.lbl { font-size: 0.6rem; letter-spacing: 0.3em; color: var(--text-dim); }
.num { font-family: 'Orbitron', sans-serif; font-size: 3rem; font-weight: 800; color: var(--accent); text-shadow: 0 0 22px var(--accent-glow); line-height: 1; }

.new-rank { position: relative; font-weight: 700; letter-spacing: 0.08em; margin: 0 0 10px; }
.msg { position: relative; color: var(--text-dim); font-size: 0.86rem; line-height: 1.6; margin: 0 0 22px; }
.confirm { position: relative; width: 100%; padding: 13px; }

.modal-enter-active, .modal-leave-active { transition: opacity 0.3s; }
.modal-enter-from, .modal-leave-to { opacity: 0; }

@keyframes spin { to { transform: translateX(-50%) rotate(360deg); } }
@keyframes pop { from { opacity: 0; transform: scale(0.88); } to { opacity: 1; transform: scale(1); } }
</style>

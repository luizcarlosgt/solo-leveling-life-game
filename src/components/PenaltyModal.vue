<script setup>
import { computed } from 'vue'
import { game } from '../stores/game.js'
import Icon from './Icon.vue'

const pending = computed(() => game.state.penalty.pending)
</script>

<template>
  <Transition name="modal">
    <div v-if="pending" class="overlay">
      <div class="penalty window">
        <p class="sys">[ ALERTA DO SISTEMA ]</p>
        <div class="alert-ico"><Icon name="skull" size="2.6rem" /></div>
        <h2 class="big">ZONA DE PENALIDADE</h2>
        <p class="reason">{{ game.state.penalty.reason }}</p>
        <div class="loss">
          <span class="lbl">XP PERDIDO</span>
          <span class="val mono">-{{ game.state.penalty.amount }} XP</span>
        </div>
        <p class="msg">Não falhe novamente. Complete todas as missões diárias e mantenha sua sequência.</p>
        <button class="btn danger confirm" @click="game.acknowledgePenalty()">Aceitar e Continuar</button>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  z-index: 60;
  display: grid;
  place-items: center;
  background: radial-gradient(circle at 50% 50%, rgba(239, 68, 68, 0.18), rgba(2, 4, 10, 0.94));
  backdrop-filter: blur(4px);
}

.penalty {
  width: min(420px, 90vw);
  padding: 32px 28px;
  text-align: center;
  border-color: rgba(239, 68, 68, 0.55);
  box-shadow: 0 0 40px -6px rgba(239, 68, 68, 0.5), 0 12px 40px rgba(0,0,0,.6);
  animation: shake 0.5s;
}
.penalty::before, .penalty::after { border-color: var(--danger); }

.sys { font-size: 0.7rem; letter-spacing: 0.4em; color: var(--danger); margin: 0 0 8px; }
.alert-ico {
  color: var(--danger);
  filter: drop-shadow(0 0 18px rgba(239, 68, 68, 0.8));
  margin-bottom: 6px;
  animation: pulse 1.4s infinite;
}
.big {
  font-size: 1.6rem;
  font-weight: 800;
  color: var(--danger);
  text-shadow: 0 0 18px rgba(239, 68, 68, 0.7);
  margin-bottom: 14px;
}
.reason { color: var(--text); font-size: 0.9rem; line-height: 1.6; margin: 0 0 18px; }

.loss {
  display: inline-flex;
  flex-direction: column;
  gap: 2px;
  padding: 12px 30px;
  border-radius: 12px;
  border: 1px solid rgba(239, 68, 68, 0.5);
  background: rgba(239, 68, 68, 0.08);
  margin-bottom: 18px;
}
.loss .lbl { font-size: 0.6rem; letter-spacing: 0.28em; color: var(--text-dim); }
.loss .val { font-family: 'Orbitron', sans-serif; font-size: 1.6rem; font-weight: 800; color: var(--danger); }

.msg { color: var(--text-dim); font-size: 0.82rem; line-height: 1.6; margin: 0 0 22px; }
.confirm { width: 100%; padding: 13px; }

.modal-enter-active, .modal-leave-active { transition: opacity 0.3s; }
.modal-enter-from, .modal-leave-to { opacity: 0; }

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-9px); }
  40% { transform: translateX(9px); }
  60% { transform: translateX(-6px); }
  80% { transform: translateX(6px); }
}
</style>

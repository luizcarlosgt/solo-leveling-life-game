<script setup>
import { computed } from 'vue'
import { game, ATTRS } from '../stores/game.js'
import Icon from './Icon.vue'

const p = computed(() => game.state.player)
const points = computed(() => p.value.statPoints)
</script>

<template>
  <div class="window stats-panel">
    <div class="panel-title">
      <span class="dot"></span> Atributos
      <span v-if="points > 0" class="points-badge">{{ points }} ponto{{ points > 1 ? 's' : '' }}</span>
    </div>

    <ul class="list">
      <li v-for="a in ATTRS" :key="a.key" class="stat">
        <span class="icon"><Icon :name="a.icon" size="1.15rem" /></span>
        <span class="lbl">{{ a.label }}</span>
        <span class="val mono">{{ p.stats[a.key] }}</span>
        <button
          class="plus"
          :disabled="points <= 0"
          :title="points > 0 ? 'Investir 1 ponto' : 'Sem pontos disponíveis'"
          @click="game.spendPoint(a.key)"
        ><Icon name="plus" size="1rem" /></button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.panel-title { justify-content: flex-start; }
.points-badge {
  margin-left: auto;
  font-family: 'Orbitron', sans-serif;
  font-size: 0.62rem;
  letter-spacing: 0.06em;
  color: #05070f;
  background: var(--gold);
  padding: 3px 9px;
  border-radius: 99px;
  box-shadow: 0 0 14px rgba(245, 158, 11, 0.6);
  animation: pulse 1.8s infinite;
}

.list { list-style: none; margin: 0; padding: 8px 10px 12px; }

.stat {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 10px;
  border-radius: 9px;
  transition: background 0.16s;
}
.stat:hover { background: rgba(56, 189, 248, 0.07); }

.icon { font-size: 1rem; width: 20px; text-align: center; }
.lbl { flex: 1; font-size: 0.84rem; letter-spacing: 0.04em; }
.val {
  font-family: 'Orbitron', sans-serif;
  font-weight: 700;
  font-size: 1rem;
  color: var(--accent);
  min-width: 34px;
  text-align: right;
}

.plus {
  width: 26px; height: 26px;
  border-radius: 7px;
  background: rgba(56, 189, 248, 0.12);
  border: 1px solid var(--border-strong);
  color: var(--accent);
  font-size: 1rem;
  font-weight: 700;
  line-height: 1;
  display: grid; place-items: center;
  transition: all 0.16s;
}
.plus:hover:not(:disabled) { background: var(--accent); color: #05070f; box-shadow: 0 0 16px var(--accent-glow); }
.plus:disabled { opacity: 0.25; cursor: not-allowed; }
</style>

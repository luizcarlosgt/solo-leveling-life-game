<script setup>
import { computed } from 'vue'
import { game } from '../stores/game.js'

const logs = computed(() => game.state.logs)

function time (ts) {
  return new Date(ts).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}
</script>

<template>
  <div class="window log-panel">
    <div class="panel-title"><span class="dot"></span> Registro do Sistema</div>
    <div class="feed">
      <p v-if="logs.length === 0" class="empty">Nenhuma atividade registrada ainda.</p>
      <div v-for="l in logs" :key="l.id" class="entry" :class="l.kind">
        <span class="time mono">{{ time(l.at) }}</span>
        <span class="msg">{{ l.message }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.log-panel { display: flex; flex-direction: column; min-height: 0; }
.feed { padding: 10px 14px 14px; overflow-y: auto; max-height: 240px; display: flex; flex-direction: column; gap: 2px; }
.empty { color: var(--text-dim); font-size: 0.8rem; text-align: center; padding: 18px 0; }

.entry {
  display: flex;
  gap: 10px;
  font-size: 0.76rem;
  padding: 6px 8px;
  border-radius: 7px;
  border-left: 2px solid transparent;
  line-height: 1.4;
}
.entry:hover { background: rgba(56, 189, 248, 0.05); }
.time { color: var(--text-dim); flex-shrink: 0; font-size: 0.7rem; padding-top: 1px; }
.msg { color: var(--text-dim); overflow-wrap: anywhere; }

.entry.success { border-left-color: var(--success); }
.entry.success .msg { color: #bbe7c9; }
.entry.level { border-left-color: var(--accent); }
.entry.level .msg { color: var(--accent); font-weight: 600; }
.entry.penalty { border-left-color: var(--danger); }
.entry.penalty .msg { color: #fca5a5; font-weight: 600; }
</style>

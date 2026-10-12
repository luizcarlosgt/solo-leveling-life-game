<script setup>
import { computed, ref } from 'vue'
import { game, DIFFICULTIES, ATTRS } from '../stores/game.js'

const tab = ref('daily')
const daily = computed(() => game.dailyQuests)
const custom = computed(() => game.customQuests)
const list = computed(() => (tab.value === 'daily' ? daily.value : custom.value))

function diffOf (q) { return DIFFICULTIES[q.difficulty] || DIFFICULTIES.normal }
function attrOf (key) { return ATTRS.find(a => a.key === key) || { icon: '◆', label: key } }
</script>

<template>
  <div class="window quest-panel">
    <div class="panel-title"><span class="dot"></span> Missões</div>

    <div class="tabs">
      <button class="tab" :class="{ active: tab === 'daily' }" @click="tab = 'daily'">
        Diárias <span class="count mono">{{ game.dailyDone }}/{{ game.dailyTotal }}</span>
      </button>
      <button class="tab" :class="{ active: tab === 'custom' }" @click="tab = 'custom'">
        Minhas Missões <span class="count mono">{{ custom.length }}</span>
      </button>
    </div>

    <div class="list">
      <p v-if="list.length === 0" class="empty">
        Nenhuma missão aqui. Registre uma nova missão para começar a subir de nível.
      </p>

      <TransitionGroup name="q" tag="div" class="items">
        <div
          v-for="q in list"
          :key="q.id"
          class="quest"
          :class="{ done: q.completed, [q.difficulty]: true }"
        >
          <button
            class="check"
            :style="{ '--c': diffOf(q).color }"
            :title="q.completed ? 'Desfazer' : 'Concluir missão'"
            @click="q.completed ? game.undoQuest(q.id) : game.completeQuest(q.id)"
          >
            <span class="tick">✓</span>
          </button>

          <div class="info">
            <div class="top">
              <span class="q-title">{{ q.title }}</span>
              <span class="rank-chip" :style="{ color: diffOf(q).color, borderColor: diffOf(q).color }">
                {{ diffOf(q).rank }}
              </span>
            </div>
            <p v-if="q.description" class="desc">{{ q.description }}</p>
            <div class="meta">
              <span class="tag">{{ attrOf(q.attribute).icon }} {{ attrOf(q.attribute).label }}</span>
              <span v-if="q.repeat" class="tag repeat">↻ diária</span>
              <span class="xp-tag">+{{ diffOf(q).xp }} XP</span>
            </div>
          </div>

          <button class="del" title="Remover missão" @click="game.removeQuest(q.id)">✕</button>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<style scoped>
.quest-panel { display: flex; flex-direction: column; min-height: 0; }

.tabs { display: flex; gap: 6px; padding: 12px 14px 0; }
.tab {
  flex: 1;
  padding: 9px 12px;
  border-radius: 9px 9px 0 0;
  background: transparent;
  border: 1px solid transparent;
  color: var(--text-dim);
  font-size: 0.74rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  font-weight: 600;
  transition: all 0.16s;
}
.tab:hover { color: var(--text); }
.tab.active {
  color: var(--accent);
  background: rgba(56, 189, 248, 0.08);
  border-color: var(--border);
  border-bottom-color: transparent;
}
.count { color: var(--text-dim); font-size: 0.7rem; }
.tab.active .count { color: var(--accent); }

.list { padding: 12px 14px 16px; overflow-y: auto; flex: 1; max-height: 460px; }

.empty { color: var(--text-dim); font-size: 0.84rem; text-align: center; padding: 30px 10px; line-height: 1.6; }

.items { display: flex; flex-direction: column; gap: 10px; }

.quest {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  border-radius: 11px;
  background: rgba(6, 11, 22, 0.75);
  border: 1px solid var(--border);
  transition: all 0.18s;
}
.quest:hover { border-color: var(--border-strong); transform: translateX(2px); }
.quest.done { opacity: 0.55; background: rgba(74, 222, 128, 0.05); border-color: rgba(74, 222, 128, 0.3); }
.quest.done .q-title { text-decoration: line-through; color: var(--text-dim); }

.check {
  width: 30px; height: 30px;
  flex-shrink: 0;
  border-radius: 8px;
  border: 2px solid var(--c, var(--accent));
  background: transparent;
  display: grid; place-items: center;
  transition: all 0.16s;
  margin-top: 2px;
}
.check .tick { color: var(--c, var(--accent)); font-size: 0.95rem; font-weight: 800; opacity: 0; transition: opacity 0.16s; }
.check:hover { background: color-mix(in srgb, var(--c) 20%, transparent); box-shadow: 0 0 14px -2px var(--c); }
.check:hover .tick { opacity: 0.6; }
.quest.done .check { background: var(--success); border-color: var(--success); box-shadow: 0 0 14px rgba(74,222,128,.5); }
.quest.done .check .tick { opacity: 1; color: #05160c; }

.info { flex: 1; min-width: 0; }
.top { display: flex; align-items: center; gap: 8px; }
.q-title { font-weight: 600; font-size: 0.92rem; flex: 1; overflow-wrap: anywhere; }
.rank-chip {
  font-family: 'Orbitron', sans-serif;
  font-size: 0.62rem;
  font-weight: 800;
  padding: 1px 7px;
  border: 1px solid;
  border-radius: 6px;
  flex-shrink: 0;
}
.desc { margin: 4px 0 0; font-size: 0.76rem; color: var(--text-dim); overflow-wrap: anywhere; }

.meta { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 7px; align-items: center; }
.tag { font-size: 0.68rem; color: var(--text-dim); letter-spacing: 0.04em; }
.tag.repeat { color: var(--accent-2); }
.xp-tag { font-size: 0.66rem; color: var(--success); font-weight: 700; letter-spacing: 0.05em; margin-left: auto; }

.del {
  background: transparent;
  color: var(--text-dim);
  font-size: 0.8rem;
  padding: 4px 6px;
  border-radius: 6px;
  flex-shrink: 0;
  transition: all 0.16s;
}
.del:hover { color: var(--danger); background: rgba(239, 68, 68, 0.12); }

.q-enter-active, .q-leave-active { transition: all 0.28s ease; }
.q-enter-from { opacity: 0; transform: translateY(-10px); }
.q-leave-to { opacity: 0; transform: translateX(30px); }
</style>

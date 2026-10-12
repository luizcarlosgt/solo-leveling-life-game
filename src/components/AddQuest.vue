<script setup>
import { ref } from 'vue'
import { game, DIFFICULTIES, ATTRS } from '../stores/game.js'
import Icon from './Icon.vue'

const form = ref({
  title: '',
  description: '',
  difficulty: 'normal',
  attribute: 'forca',
  repeat: false
})

const difficultyList = Object.values(DIFFICULTIES)
const attrList = ATTRS

function reset () {
  form.value = { title: '', description: '', difficulty: 'normal', attribute: 'forca', repeat: false }
}

function submit () {
  if (!form.value.title.trim()) return
  game.addQuest({ ...form.value, type: 'custom', title: form.value.title.trim() })
  reset()
}
</script>

<template>
  <div class="window add-panel">
    <div class="panel-title"><span class="dot"></span> Registrar Missão</div>    <form class="form" @submit.prevent="submit">
      <input v-model="form.title" class="input" placeholder="Ex.: Estudar 1h de programação" maxlength="60" />
      <textarea v-model="form.description" class="input" rows="2" placeholder="Descrição (opcional)" maxlength="120"></textarea>

      <div class="row">
        <select v-model="form.attribute" class="input">
          <option v-for="a in attrList" :key="a.key" :value="a.key">{{ a.label }}</option>
        </select>
        <select v-model="form.difficulty" class="input">
          <option v-for="d in difficultyList" :key="d.key" :value="d.key">
            {{ d.label }} · {{ d.xp }} XP
          </option>
        </select>
      </div>

      <label class="check">
        <input type="checkbox" v-model="form.repeat" />
        <span>Repetir todos os dias (missão diária)</span>
      </label>

      <button class="btn" type="submit" :disabled="!form.title.trim()">
        <Icon name="sword" size="1.05em" /> Aceitar Missão
      </button>
    </form>
  </div>
</template>

<style scoped>
.add-panel { padding-bottom: 16px; }
.form { padding: 16px; display: flex; flex-direction: column; gap: 10px; }

.input {
  width: 100%;
  background: rgba(4, 8, 18, 0.8);
  border: 1px solid var(--border);
  border-radius: 9px;
  padding: 10px 12px;
  color: var(--text);
  font-size: 0.9rem;
  outline: none;
  transition: border-color 0.18s, box-shadow 0.18s;
  resize: vertical;
}

.input:focus {
  border-color: var(--border-strong);
  box-shadow: 0 0 14px rgba(56, 189, 248, 0.25);
}

.input::placeholder { color: var(--text-dim); }

.row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }

.check {
  display: flex; align-items: center; gap: 8px;
  font-size: 0.82rem; color: var(--text-dim);
  cursor: pointer; user-select: none;
}
.check input { accent-color: var(--accent); width: 16px; height: 16px; }
</style>

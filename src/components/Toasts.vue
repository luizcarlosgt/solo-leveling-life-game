<script setup>
import { game } from '../stores/game.js'
import Icon from './Icon.vue'
</script>

<template>
  <div class="toasts">
    <TransitionGroup name="toast">
      <div v-for="t in game.toasts" :key="t.id" class="toast" :class="t.kind">
        <Icon :name="t.kind === 'success' ? 'check' : 'lightning'" size="1.05rem" class="mark" />
        <span>{{ t.message }}</span>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toasts {
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: 70;
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: flex-end;
}

.toast {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 11px 16px;
  border-radius: 10px;
  background: rgba(8, 14, 26, 0.95);
  border: 1px solid var(--border-strong);
  box-shadow: 0 0 22px -6px var(--accent-glow), 0 8px 24px rgba(0,0,0,.5);
  font-size: 0.84rem;
  font-weight: 600;
  max-width: 320px;
  backdrop-filter: blur(6px);
}
.toast.success { border-color: rgba(74, 222, 128, 0.6); box-shadow: 0 0 22px -6px rgba(74,222,128,.6), 0 8px 24px rgba(0,0,0,.5); }
.toast .mark { color: var(--accent); }
.toast.success .mark { color: var(--success); }

.toast-enter-active, .toast-leave-active { transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1); }
.toast-enter-from { opacity: 0; transform: translateX(40px) scale(0.9); }
.toast-leave-to { opacity: 0; transform: translateX(40px); }
</style>

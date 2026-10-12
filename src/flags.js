import { watchEffect } from 'vue'
import { game } from './stores/game.js'

// Definições de feature flags do app (exibidas no Flags Explorer / Toolbar).
export const FLAG_DEFINITIONS = {
  penalty_zone: {
    description: 'Ativa a Zona de Penalidade ao falhar as missões diárias.',
    origin: 'https://github.com/luizcarlosgt/solo-leveling-life-game',
    options: [
      { value: true, label: 'on' },
      { value: false, label: 'off' }
    ]
  },
  dark_theme: {
    description: 'Tema visual escuro do Sistema.',
    origin: 'https://github.com/luizcarlosgt/solo-leveling-life-game',
    options: [
      { value: true, label: 'on' },
      { value: false, label: 'off' }
    ]
  }
}

function flagValues () {
  return {
    penalty_zone: game.state.settings.penaltyEnabled,
    dark_theme: true
  }
}

// Evita breaking-fora do <script> com caracteres especiais (equivalente ao safeJsonStringify do SDK).
function safeJsonStringify (obj) {
  return JSON.stringify(obj)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
}

function makeScript (attr, json) {
  const s = document.createElement('script')
  s.type = 'application/json'
  s.setAttribute(attr, '')
  s.textContent = safeJsonStringify(json)
  return s
}

// Emite as flags no DOM; o Vercel Toolbar/Web Analytics observa via MutationObserver.
export function mountFlags () {
  const definitions = makeScript('data-flag-definitions', { definitions: FLAG_DEFINITIONS })
  const values = makeScript('data-flag-values', flagValues())

  document.head.appendChild(definitions)
  document.head.appendChild(values)

  watchEffect(() => {
    values.textContent = safeJsonStringify(flagValues())
  })
}
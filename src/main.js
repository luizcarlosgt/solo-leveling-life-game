import { createApp } from 'vue'
import App from './App.vue'
import './style.css'
import { game } from './stores/game.js'
import { inject } from '@vercel/analytics'

game.init()
inject({ autoTrack: true })

createApp(App).mount('#app')
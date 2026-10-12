import { createApp } from 'vue'
import App from './App.vue'
import './style.css'
import { game } from './stores/game.js'

game.init()

createApp(App).mount('#app')

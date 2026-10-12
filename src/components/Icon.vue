<script setup>
import { computed } from 'vue'
import { ICONS } from '../icons.js'

const props = defineProps({
  name: { type: String, required: true },
  size: { type: [String, Number], default: '1em' }
})

const svg = computed(() => ICONS[props.name] || '')
const fontSize = computed(() => (typeof props.size === 'number' ? props.size + 'px' : props.size))
</script>

<template>
  <span class="ico" :style="{ fontSize }" aria-hidden="true" v-html="svg"></span>
</template>

<style scoped>
.ico {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  flex-shrink: 0;
}
.ico :deep(svg) { width: 1em; height: 1em; display: block; }
</style>

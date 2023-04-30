<template>
  <canvas id="canvas"></canvas>

  <div>
    <Panel>
      <LabePair label="数量" :desc="state_ref.shape_count" />
      <LabePair label="模式" :desc="state_ref.active_action" />
      <OptionList :options="TOOL_PANEL_OPTS" v-model="activeOpt" />
    </Panel>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { main } from './app'
import { TOOL_PANEL_OPTS, activeOpt, state_ref } from './store'
import { LabePair, Panel, OptionList } from './components'
import { ShapeType } from './type';

const handleKeyDown = (ev: KeyboardEvent) => {
  let active_opt

  if (ev.key === 'r') {
    active_opt = TOOL_PANEL_OPTS.find(opt => {
      return opt.value === ShapeType.Rectangle
    })
  } else if (ev.key === 'c') {
    active_opt = TOOL_PANEL_OPTS.find(opt => {
      return opt.value === ShapeType.Circle
    })
  } else if (ev.key === 'a') {
    active_opt = TOOL_PANEL_OPTS.find(opt => {
      return opt.value === ShapeType.Select
    })
  }

  if (active_opt) {
    activeOpt.value = active_opt
  }
}
onMounted(() => {
  main()

  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})
</script>

<template>
  <canvas id="canvas" />

  <div>
    <Panel>
      <LabePair label="数量" :desc="state_ref.shape_count" />
      <LabePair label="模式" :desc="state_ref.active_action" />
      <OptionList :options="TOOL_PANEL_OPTS" v-model="activeOpt" />
      <Field type='range' label="border padding" v-model="border_padding" />
      <Field type="range" label="border size" v-model="border_size" />
      <Field type="color" label="rectangle strokeStyle" v-model="rectangle_style" />
      <Field type="color" label="grid style" v-model="grid_style" />
      <Field type="checkbox" label="grid visible" v-model="grid_visible" />
    </Panel>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { TOOL_PANEL_OPTS, activeOpt, state_ref } from './lib/store'
import { LabePair, Panel, OptionList, Field } from './components'
import { main } from './lib'
import { ShapeType } from './type';

const border_padding = ref(20)
const border_size = ref(10)
const rectangle_style = ref('#f7a400')
const grid_style = ref('#f7a400')
const grid_visible = ref(true)

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
    activeOpt.value = active_opt.value
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

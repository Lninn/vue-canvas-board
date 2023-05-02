<template>
  <canvas id="canvas" />

  <div>
    <Panel>
      <OptionList :options="USER_TOOL_OPTS" v-model="user_state.action" />
      <Field type='range' label="border box size" v-model="user_state.border_box_size" />
      <Field type='range' label="border box padding" v-model="user_state.border_box_padding" />
      <LabePair label="down point" :desc="point_string(user_state.down_point)" />
      <LabePair label="move point" :desc="point_string(user_state.move_point)" />
      <LabePair label="active rectangle" :desc="point_string(user_state.active_rectangle)" />
      <LabePair label="children" :desc="point_string(user_state.children)" />
      <Field type="color" label="down style" v-model="user_state.mouse_down_style" />
      <Field type="color" label="move style" v-model="user_state.mouse_move_style" />
      <button @click="log">print info</button>
    </Panel>
  </div>
</template>
<script setup lang="ts">
import { onMounted, toRaw } from 'vue';
import { OptionList, Panel, LabePair, Field } from './components'
import { main } from './lib';
import { USER_TOOL_OPTS, user_state } from './lib/scene'

const point_string = (payload: any) => {
  if (Array.isArray(payload)) return payload.length

  if (payload) {
    return JSON.stringify(payload, null, 2)
  } else {
    return ''
  }
}

const log = () => {
  console.log(toRaw(user_state.active_rectangle))
}

onMounted(() => {
  main()
})
</script>

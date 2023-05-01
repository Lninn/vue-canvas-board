<template>
  <canvas id="canvas" />

  <div>
    <Panel>
      <OptionList :options="USER_TOOL_OPTS" v-model="user_state.action" />
      <LabePair label="down point" :desc="point_string(user_state.down_point)" />
      <LabePair label="move point" :desc="point_string(user_state.move_point)" />
      <LabePair label="active rectangle" :desc="point_string(user_state.active_rectangle)" />
      <LabePair label="children" :desc="point_string(user_state.children)" />
      <Field type="color" label="down style" v-model="user_state.mouse_down_style" />
      <Field type="color" label="move style" v-model="user_state.mouse_move_style" />
    </Panel>
  </div>
</template>
<script setup lang="ts">
import { onMounted } from 'vue';
import { OptionList, Panel, LabePair, Field } from './components'
import { main } from './lib';
import { USER_TOOL_OPTS, user_state } from './lib/user'

const point_string = (payload: any) => {
  if (Array.isArray(payload)) return payload.length

  if (payload) {
    return JSON.stringify(payload, null, 2)
  } else {
    return ''
  }
}

onMounted(() => {
  main()
})
</script>

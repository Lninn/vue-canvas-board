<script lang="ts" setup>
import { AppState } from './type';

const { appState } = defineProps<{ appState: AppState }>()

const handleShapeSelect = (event: any) => {
  appState.shape = event.target.value
}
</script>

<template>
  <div class="canvas-status">
    <div>Operation</div>
    <div>{{ appState.cursor.operation }}</div>

    <div>Shape</div>
    <div>{{ appState.shape }}</div>
    <select :value="appState.shape" @change="handleShapeSelect">
      <option value="rectangle">rectangle</option>
      <option value="circle">circle</option>
    </select>
  </div>
</template>

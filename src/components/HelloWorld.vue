<script setup lang="ts">
import SomeComponent from './SomeComponent.vue'
import CanvasStatus from './CanvasStatus.vue'

import { AppState } from './type'
import { reactive } from 'vue';

const appState = reactive<AppState>({
  cursor: {
    operation: 'create',
  },
  shape: 'circle',
  activeToll: 'rectangle'
})
</script>

<template>
  <div class="wrap">
    <SomeComponent :appState="appState" />

    <CanvasStatus />
  </div>
</template>

<style lang="less">
.wrap {
  height: 100%;

  display: grid;
  grid-template-columns: 1fr 200px;

  .canvas-status {
    box-shadow: 10px 10px 10px 5px #000;
  }
}
</style>

<script setup lang="ts">
import SomeComponent from './SomeComponent.vue'
import CanvasStatus from './CanvasStatus.vue'

import { AppState } from './type'
import { ref } from 'vue';

const appState = ref<AppState>({
  cursor: {
    operation: 'create',
  },
})
</script>

<template>
  <div class="wrap">
    <SomeComponent :appState="appState" />

    <CanvasStatus :appState="appState" />
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

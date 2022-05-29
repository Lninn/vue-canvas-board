<script lang="ts" setup>
import { AppState } from './type';

defineProps<{ appState: AppState }>()
</script>

<template>
  <div class="canvas-status">
    <div>Operation</div>
    <div>{{ appState.cursor.operation }}</div>
  </div>
</template>

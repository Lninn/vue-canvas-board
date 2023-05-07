<template>
  <canvas id="canvas" />
</template>
<script setup lang="ts">
import { onMounted } from 'vue';
import { main } from './lib';

onMounted(() => {
  main()
})
</script>

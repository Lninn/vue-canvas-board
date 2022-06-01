<script lang="ts" setup>
import Button from './Button.vue';
</script>

<template>
  <div class="canvas-status">
    <Button>Select</Button>
    <Button>Rectangle</Button>
    <Button>Circle</Button>
  </div>
</template>

<style lang="less">
.canvas-status {
  display: flex;
  flex-direction: column;
}
</style>

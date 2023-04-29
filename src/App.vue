<template>
  <div class="tool">
    <div class="tool-inner">
      <div>{{ action_ref }}</div>
      <div>{{ moveInfo }}</div>
      <div>count {{ count_ref }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { action_ref, count_ref } from './player';
import { moveInfo } from './rectangle';
</script>

<style lang="less">
.tool {
  user-select: none;

  &-inner {
    position: absolute;
    top: 16px;
    right: 16px;
    display: flex;
    background-color: rgba(0, 0, 0, 0.65);
    padding: 8px 12px;
    color: #fff;

    display: flex;
    flex-direction: column;
  }

  &-content {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
}

.point {
  white-space: nowrap;
}

.rectangle {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.row {
  display: flex;
  gap: 8px;
}
</style>

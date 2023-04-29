<template>
  <div class="tool">
    <div class="tool-inner">
      <div>{{ action_ref }}</div>
      <div>{{ moveInfo }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { action_ref } from './player';
import { moveInfo } from './rectangle';
</script>

<style lang="less">
.tool {
  user-select: none;
  display: none;

  &-inner {
    position: absolute;
    bottom: 50%;
    transform: translateY(50%);
    left: 24px;
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

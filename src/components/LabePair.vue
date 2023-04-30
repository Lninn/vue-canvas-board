<template>
  <div class="xxx-label-pair">
    <div class="xxx-label-pair__label">{{ label }}</div>
    <div>{{ desc }}</div>
  </div>
</template>

<script lang="ts" setup>
interface Props {
  label: string
  desc: string | number
}
defineProps<Props>()
</script>

<style lang="less">
.xxx-label-pair {
  display: flex;
  gap: 8px;

  &__label {
    color: rgba(255, 255, 255, 0.65);
  }
}
</style>

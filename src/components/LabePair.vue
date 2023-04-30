<template>
  <div class="xxx-label-pair">
    <div>{{ label }}</div>
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
}
</style>

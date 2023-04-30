<script setup lang="ts">
import clsx from 'clsx'
export interface IXXXOption<T = string> {
  label: string
  value: T
}

interface IProps {
  opt: IXXXOption
  isActive: boolean
}

defineProps<IProps>()
const emit = defineEmits(['click'])
</script>

<template>
  <div
    :class="clsx('xxx-opt', { 'is-active': isActive, })"
    @click="emit('click', opt.value)"
  >
    {{ opt.label }}
  </div>
</template>

<style lang="less">
.xxx-opt {
  color: rgba(0, 0, 0, 0.65);
  background-color: #fff;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;

  &.is-active {
    color: #fff;
    background-color: rgba(0, 0, 0, 0.65);
  }
}
</style>

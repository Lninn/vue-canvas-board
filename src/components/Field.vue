<template>
  <div class="field">
    <span>{{ label }}</span>
    <input :value="modelValue" :type="type" @input="on_input" />
    <span class="field-value">{{ modelValue }}</span>
  </div>
</template>

<script lang="ts" setup>

interface IProps {
  type: 'range' | 'color'
  label: string
  modelValue: string
}
defineProps<IProps>()
const emit = defineEmits(['update:modelValue'])
const on_input = (e: Event) => {
  const el = e.target as HTMLInputElement
  if (el) emit('update:modelValue', el.value)
}
</script>

<style lang="less">
.field {
  display: flex;
  align-items: center;
  gap: 8px;

  &-value {
    min-width: 24px;
  }
}
</style>

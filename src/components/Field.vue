<template>
  <div class="xxx-field">
    <span>{{ label }}</span>
    <input :value="modelValue" :type="type" @input="on_input" />
    <span class="xxx-field-value">{{ modelValue }}</span>
  </div>
</template>

<script lang="ts" setup>
interface IProps {
  type: 'range' | 'color' | 'checkbox'
  label: string
  modelValue: string | number | boolean
}
const { type } = defineProps<IProps>()
const emit = defineEmits(['update:modelValue'])
const on_input = (e: Event) => {
  if (!e.target) return

  const el = e.target as HTMLInputElement

  if (type === 'range') {
    emit('update:modelValue', parseInt(el.value))
  } else if (type === 'color') {
    emit('update:modelValue', el.value)
  } else {
    emit('update:modelValue', el.checked)
  }
}
</script>

<style lang="less">
.xxx-field {
  display: flex;
  align-items: center;
  gap: 8px;

  &-value {
    min-width: 24px;
  }
}
</style>

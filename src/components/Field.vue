<template>
  <div class="xxx-field">
    <span>{{ label }}</span>
    <component :is="input_node"/>
    <span class="xxx-field-value">{{ modelValue }}</span>
  </div>
</template>

<script lang="ts" setup>
import { h } from 'vue'

interface IProps {
  type: 'range' | 'color' | 'checkbox'
  label: string
  modelValue: string | number | boolean
}
const { type, modelValue } = defineProps<IProps>()
const emit = defineEmits(['update:modelValue'])

const parse = (element: HTMLInputElement) => {
  if (type === 'range') {
    return parseInt(element.value)
  } else if (type === 'checkbox') {
    return element.checked
  } else {
    return element.value
  }
}

const onInput = (e: Event) => {
  if (!e.target) return
  const el = e.target as HTMLInputElement
  emit('update:modelValue', parse(el))
}

const props = Object.assign(
  {
    type,
    onInput,
  },
  type === 'checkbox' ? { checked: modelValue } : { value: modelValue }
)
const input_node = h(
  'input',
  props,
)
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

<template>
  <div class="xxx-opt-list">
    <Option
      v-for="opt in options"
      :opt="opt"
      :isActive="opt.value === modelValue"
      @click="emit('update:modelValue', $event)"
    />
	</div>
</template>

<script lang="ts" setup>
import Option, { IXXXOption } from './Option.vue'

interface IProps {
  options: IXXXOption[]
  modelValue: IXXXOption['value']
}

defineProps<IProps>()

const emit =defineEmits(['update:modelValue'])
</script>

<style>
.xxx-opt-list {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>

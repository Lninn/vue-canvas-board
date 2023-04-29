<template>
  <div class="tool">
    <div class="tool-inner">
      <div>{{ action_ref }}</div>
      <div>count {{ count_ref }}</div>
      <div>
        <select v-model="type">
          <option>rectangle</option>
          <option>circle</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import { action_ref, count_ref } from './scene';
import { INITIAL_SHAPE_TYPE, update_state } from './constant';
import { ShapeType } from './type'

const type = ref(INITIAL_SHAPE_TYPE)

watchEffect(() => {
  update_state({ shape_type: type.value as unknown as ShapeType })
})
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

select {
  font-size: 14px;
}
</style>

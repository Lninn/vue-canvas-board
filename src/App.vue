<template>
  <div class="tool">
    <div class="tool-inner">
      <div>count {{ count_ref }}</div>
      <div>
        <button @click="on_select('none')">Auo</button>
        <button @click="on_select('circle')">Circle</button>
        <button @click="on_select('rectangle')">Rectangle</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { count_ref } from './scene';
import { update_scene_state } from './store';
import { DrawAction, ShapeType } from './type'

const on_select = (k: string) => {
  if (k === 'none') {
    update_scene_state({ active_action: DrawAction.Auto, shape_type: ShapeType.None })
  } else if (k === 'circle') {
    update_scene_state({ active_action: DrawAction.Create, shape_type: ShapeType.Circle })
  } else if (k === 'rectangle') {
    update_scene_state({ active_action: DrawAction.Create, shape_type: ShapeType.Rectangle })
  }
}
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

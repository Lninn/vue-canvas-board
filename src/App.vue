<template>
  <div class="tool">
    <div class="tool-inner">
      <div class="tool-header">
        data board
      </div>
      <div class="tool-content">
        
        <div class="point-list">
          <div class="point">
            <span>down_point</span>
            <span>{{ point  }}</span>
          </div>
          <div class="point">
            <span>down_point</span>
            <span>{{ point  }}</span>
          </div>
          <div class="point">
            <span>down_point</span>
            <span>{{ point  }}</span>
          </div>
        </div>

        <div>
          <div>rectangle info</div>

          <div class="rectangle">
            <div class="row">
              <div class="cell">{{ point }}</div>
              <div class="cell">{{ point }}</div>
            </div>
            <div class="row">
              <div class="cell">{{ point }}</div>
              <div class="cell">{{ point }}</div>
            </div>
          </div>

        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const point = ref({ x: 100, y: 100 })
</script>

<style lang="less">
.tool {
  &-inner {
    position: absolute;
    bottom: 50%;
    transform: translateY(50%);
    right: 24px;
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

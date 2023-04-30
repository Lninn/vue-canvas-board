<template>
  <div class="xxx-panel">
    <div class="xxx-panel-content">
      <slot />
    </div>
  </div>
</template>

<style lang="less">
.xxx-panel {
  user-select: none;
  position: absolute;
  top: 16px;
  left: 16px;

  &-content {
    display: flex;
    flex-direction: column;
    gap: 8px;

    border-radius: 4px;
    padding: 8px 8px;
    color: #fff;
    background-color: rgba(0, 0, 0, 0.65);
  }
}
</style>

<template>
  <div class="button">
    <slot></slot>
  </div>
</template>

<style lang="less">
.button {
  display: inline-block;
  padding: 0.5rem 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}
</style>

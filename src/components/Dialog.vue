<template>
  <Teleport to="body">
    <div>
      <div class="modal">
        <div class="modal-content">
          <p>Hello from the modal!</p>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style lang="less">
.modal {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;

  pointer-events: none;

  display: flex;
  align-items: center;
  justify-content: flex-end;

  &-content {
    margin: 24px;
    padding: 0 8px;
    color: #fff;
    background-color: rgba(0, 0, 0, 0.65);
  }
}
</style>

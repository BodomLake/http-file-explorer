<script setup>
import './assets/iconfont.js';

</script>

<template>
  <div class="layout">
    <div class="layout-header"></div>
    <div class="layout-middle">
      <div class="layout-sidebar">
        <side-bar></side-bar>
      </div>
      <div class="layout-content">
        <MainWindow></MainWindow>
      </div>
    </div>
    <div class="layout-footer"></div>
  </div>

</template>

<style>
.layout {
  width: 100vw;
  height: 100vh;
}
.layout-middle {
  width: 100vw;
  height: 85vh;
  display: flex;
  flex-direction: row;
}
.layout-header {
  width: 100vw;
  height: 13vh;
}
.layout-sidebar {
  width: 20vw;
  height: 85vh;
  border: 1px solid black;
  overflow: auto;
}
.layout-content {
  width: 80vw;
  height: 85vh;
  border: 1px solid black;
  overflow: auto;
}
.layout-footer{
  width: 100vw;
  height: 2vh;
}
</style>

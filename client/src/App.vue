<script setup>
import './assets/iconfont.js';
</script>

<template>
  <div class="layout">
    <div class="layout-header">
      <Header></Header>
    </div>

    <div class="layout-middle">
      <div class="layout-sidebar">
        <SideBar class=" background"></SideBar>
        <!--<div class="background"></div>-->
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
  background-image: url("assets/iMac.jpg");
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
}

.background {
/*  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;*/
  height: 100%;
  width: 100%;
  background-image: url("assets/Beach.jpg");
  background-position: left top;
  background-size: cover;
  background-repeat: no-repeat;
  font-weight: 400;
  //background:rgba(255,255,255);
}

.layout-footer {
  width: 100vw;
  height: 2vh;
}
</style>

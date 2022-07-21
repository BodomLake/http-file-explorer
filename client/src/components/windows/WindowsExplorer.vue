<script>
import Header from "../windows/Header/Header.vue";
import SideBar from "../windows/SideBar/SideBar.vue";
import MainWindow from "../windows/MainWindow/MainWindow.vue";
import Navigator from "../windows/Navigator/Navigator.vue";
// 默认指向根路径（类Unix），或者ThisPC(Windows系统)
const defaultPath = '\\'
export default {
  name: 'WindowsExplorer',
  data() {
    return {
      currentPath: defaultPath,
      sideBarPath: 'C:\\'
    }
  },
  components: {
    'Navigator': Navigator,
    'SideBar': SideBar,
    'Header': Header,
    'MainWindow': MainWindow,
  },
}
</script>

<template>
  <div class="layout">
    <div class="layout-header">
      <Header></Header>
    </div>
    <div class="layout-nav">
      <Navigator></Navigator>
    </div>

    <div class="layout-middle">
      <div class="layout-sidebar background">
        <SideBar :currentPath="sideBarPath"></SideBar>
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
  height: 81vh;
  display: flex;
  flex-direction: row;
}

.layout-header {
  width: 100vw;
  height: 13vh;
}

.layout-nav {
  width: 100vw;
  height: 4vh;
}

.layout-sidebar {
  width: 20vw;
  height: 81vh;
  border: 1px solid black;
  overflow: auto;
  background-color: transparent !important;
}

.layout-content {
  width: 80vw;
  height: 81vh;
  border: 1px solid black;
  overflow: auto;
  background-image: url("../../assets/iMac.jpg");
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
  /*  width: 100%;*/
  background-image: url("../../assets/Beach.jpg");
  background-position: left top;
  background-size: cover;
  background-repeat: no-repeat;
  font-weight: 400;
  /*filter: contrast(1);*/
  /*filter: drop-shadow(16px 16px 20px blue);*/
}

.layout-footer {
  width: 100vw;
  height: 2vh;
}
</style>

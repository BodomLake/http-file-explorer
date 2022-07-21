<script>
import './assets/iconfont.js';
import WindowsExplorer from "./components/windows/WindowsExplorer.vue";
import Xfce from "./components/linux/Xfce.vue";
import Finder from "./components/macOS/Finder.vue";

export default {
  name: 'app',
  // 三种操作系统的文件浏览器，不同的客户端体验，根据实际操作系统的类型进行切换
  components: {
    Finder,
    Xfce,
    WindowsExplorer,
  },
  data() {
    return {
      system: 'Windows',
    }
  },
}
</script>

<template>
  <template v-if="system == 'Windows'">
    <WindowsExplorer></WindowsExplorer>
  </template>
  <template v-if="system == 'Linux'">
    <Xfce></Xfce>
  </template>
  <template v-if="system == 'MacOS'">
    <Finder></Finder>
  </template>
</template>

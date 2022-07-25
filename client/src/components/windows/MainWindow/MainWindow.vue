<template>
  <template v-if="currentPath == defaultPath">
    <ThisPC v-model:currentPath="currentPath"></ThisPC>
  </template>
  <template v-else>
    <Directory v-model:currentPath="currentPath"></Directory>
  </template>
</template>

<script>
import ThisPC from './ThisPC.vue'
import Directory from "./Directory.vue";
import emitter from "../../../bus.js";
// 默认指向根路径（类Unix），或者ThisPC(Windows系统)
const defaultPath = '\\'
export default {
  name: "MainWindow",
  components: {Directory, ThisPC},
  data() {
    return {
      // 当前路径
      defaultPath: defaultPath,
      // 默认显示ThisPC
      currentPath: '\\',
    }
  },
  mounted() {
    // 在这里 可以认为是 访问硬盘、文件夹（nodejs认为Windows的盘符也是 文件夹;
    // require('fs').statSync('C://').isDirectory() = true
    this.currentPath = window.localStorage.getItem('currentPath')
    this.currentPath = this.currentPath ? this.currentPath : '\\';
    emitter.on('visitDirectory', path => {
      this.currentPath = path
    })
    window.onpopstate = function (e) {
      console.log(e)
    }
    window.onhashchange = function (hash) {
      console.log(hash);
    }
  },
  watch: {
    currentPath: {
      handler: function (newPath, oldPath) {
        window.localStorage.setItem('currentPath', newPath)
      }
    }
  },
  methods: {}
}
</script>

<style scoped>
</style>

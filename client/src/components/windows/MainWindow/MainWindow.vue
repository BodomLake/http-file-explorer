<template>
  <template v-if="currentPath == defaultPath">
    <ThisPC @enterToDrive="enterToDrive"></ThisPC>
  </template>
  <template v-else>
    <Directory v-model:currentPath="currentPath"></Directory>
  </template>
</template>

<script>
import ThisPC from './ThisPC.vue'
import Directory from "./Directory.vue";
// 默认指向根路径（类Unix），或者ThisPC(Windows系统)
const defaultPath = '/'
export default {
  name: "MainWindow",
  components: {Directory, ThisPC},
  data() {
    return {
      // 当前路径
      defaultPath: defaultPath,
      currentPath: '/',
    }
  },
  watch: {
    'currentPath' : {
      immediate: true,
      handler: function (val, oldVal) {
        console.log(val)
      }
    }
  },
  methods: {
    enterToDrive(drivePath) {
      // console.log('drivePath', drivePath);
      this.currentPath = drivePath
    }
  }
}
</script>

<style scoped>
</style>

<template>
  <template v-if="currentPath == '\\' || currentPath == '/'">
    <ThisPC v-model:currentPath="currentPath"></ThisPC>
  </template>
  <template v-else>
    <Directory v-model:currentPath="currentPath"></Directory>
  </template>
</template>

<script>
import ThisPC from './ThisPC.vue'
import Directory from "./Directory.vue";
import {inject} from "vue";
export default {
  name: "MainWindow",
  setup(props) {
    let currentPath = inject('currentPath')
    console.log('MainWindow:currentPath显示为', currentPath.value);
    return {
      // 当前路径
      currentPath,
    }
  },
  components: {
    Directory, ThisPC
  }
  ,
  data() {
    return {
    }
  }
  ,
  mounted() {
  },
  methods: {}
}
</script>

<style scoped>
</style>

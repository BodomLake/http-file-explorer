<template>
  <div>Directory</div>
</template>

<script>
// 默认指向ThisPC中的C盘(Windows系统)
const defaultPath = 'C:/'
export default {
  name: "Directory",
  props: {
    currentPath: {
      type: String,
      default: '',
    }
  },
  data() {
    return {
      defaultPath: defaultPath,
    }
  },
  watch: {},
  methods: {
  }
}
</script>

<style scoped>
</style>

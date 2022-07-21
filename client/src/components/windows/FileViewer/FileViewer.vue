<template>

</template>

<script>
import emitter from "../../../bus.js";

export default {
  name: "FileViewer",
  data() {
    return {

    }
  },
  mounted() {
    emitter.on('visitFile', cb => {
      console.log('visitFile', cb)

    })
  }
}
</script>

<style scoped>

</style>

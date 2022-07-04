<template>
  <SplitPane @resize="handleResize" :min-percent='20' :default-percent='30' split="vertical">
    <template #paneL>
      <div class="panel-box">{{ ' ? ' }}</div>
    </template>
    <template #paneR>
      <div class="panel-box">{{ '?' }}</div>
    </template>
  </SplitPane>
</template>

<script setup>
import SplitPane from '../../SplitPane/index.vue'
const handleResize = () => {
  //todo
};
</script>
<!--
import SplitPane from '../SplitPane/index.vue'
export default {
  components:{
    SplitPane: SplitPane,
  },
  methods: {
    handleResize() {
      //todo
    }
  }
}
-->

<style scoped>
</style>

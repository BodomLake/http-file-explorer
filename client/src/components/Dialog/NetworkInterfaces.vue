<template>
  <SplitPane @resize="handleResize" :min-percent='20' :default-percent='30' split="vertical">
    <template #paneL>
      <div class="panel-box">{{' ? '}}</div>
    </template>
    <template #paneR>
      <div class="panel-box">{{ '?' }}</div>
    </template>
  </SplitPane>
</template>

<script setup>
const handleResize = () => {
  //todo
};
</script>

<style scoped>
</style>

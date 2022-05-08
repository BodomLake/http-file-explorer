<template>
  <div :class="split">
    <slot></slot>
  </div>
</template>

<script setup>
import {ref} from 'vue'

const props = defineProps({
  className: String,
  split: String
});
const percent = ref(50);

</script>

<style scoped>

</style>

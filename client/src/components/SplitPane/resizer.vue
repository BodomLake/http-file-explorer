<template>
  <div :class="classes"></div>
</template>

<script setup>
import { computed } from "vue";
const props = defineProps({
  split: {
    validator(value) {
      return ["vertical", "horizontal"].indexOf(value) >= 0;
    },
    required: true,
  },
  className: String,
});
const classes = computed(() => {
  const classes = ["splitter-pane-resizer", props.split, props.className];
  return classes.join(" ");
});
</script>

<style scoped>
.splitter-pane-resizer {
  position: relative;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  background: #d0dbfe;
  position: absolute;
  z-index: 1;
  -moz-background-clip: padding;
  -webkit-background-clip: padding;
  background-clip: padding-box;
}
.splitter-pane-resizer::after {
  content: "";
  position: absolute;
  left: -17px;
  top: 50%;
  width: 36px;
  height: 9px;
  z-index: 10;
  background: #246dff 50%
    url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAFCAYAAAB4ka1VAAAAGklEQVQImWP8////fwY8gIWBgYGRkAIamwAAClcGDv5uJvoAAAAASUVORK5CYII=)
    no-repeat;
}
.splitter-pane-resizer.horizontal::after {
  left: 50%;
  top: -3px;
}
.splitter-pane-resizer.vertical::after {
  transform: rotate(-90deg);
}
.splitter-pane-resizer.horizontal {
  height: 11px;
  margin: -5px 0;
  border-top: 5px solid rgba(255, 255, 255, 0);
  border-bottom: 5px solid rgba(255, 255, 255, 0);
  cursor: row-resize;
  width: 100%;
}

.splitter-pane-resizer.vertical {
  width: 11px;
  height: 100%;
  margin-left: -5px;
  border-left: 5px solid rgba(255, 255, 255, 0);
  border-right: 5px solid rgba(255, 255, 255, 0);
  cursor: col-resize;
}
</style>

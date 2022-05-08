<template>
  <div :style="{ cursor, userSelect }" class="vue-splitter-container clearfix"
       @mouseup="onMouseUp" @mousemove="onMouseMove">
    <pane class="splitter-pane splitter-paneL" :split="split" :style="{ [type]: percent + '%' }">
      <slot name="paneL"></slot>
    </pane>
    <resizer :className="className" :style="{ [resizeType]: percent + '%' }"
             :split="split" @mousedown.native="onMouseDown" @click.native="onClick"></resizer>
    <pane class="splitter-pane splitter-paneR" :split="split" :style="{ [type]: 100 - percent + '%' }">
      <slot name="paneR"></slot>
    </pane>
    <div class="vue-splitter-container-mask" v-if="active"></div>
  </div>
</template>

<script setup>
import Pane from "./pane.vue";
import Resizer from "./resizer.vue";

import {computed, reactive, ref, toRefs, watch} from "vue";

const props = defineProps({
  minPercent: {
    type: Number,
    default: 10,
  },
  defaultPercent: {
    type: Number,
    default: 50,
  },
  split: {
    validator(value) {
      return ["vertical", "horizontal"].indexOf(value) >= 0;
    },
    required: true,
  },
  className: String,
});

const data = reactive({
  active: false,
  hasMoved: false,
  height: null,
  percent: props.defaultPercent,
  type: props.split === "vertical" ? "width" : "height",
  resizeType: props.split === "vertical" ? "left" : "top",
});

const {active, hasMoved, height, percent, type, resizeType} = toRefs(data);

const emit = defineEmits(["resize"]);
const cursor = computed(() => {
  return active.value ? "none" : "";
});
const userSelect = computed(() => {
  console.log(active.value);
  console.log(props.split);
  return "col-resize";
  // return active.value ? (props.split === 'vertical' ? 'col-resize' : 'row-resize') : ''
});
const onClick = () => {
  if (!hasMoved.value) {
    percent.value = 50;
    emit("resize", percent.value);
  }
};
const onMouseDown = () => {
  active.value = true;
  hasMoved.value = false;
};
const onMouseUp = () => {
  active.value = false;
};
const onMouseMove = (e) => {
  if (e.buttons === 0 || e.which === 0) {
    active.value = false;
  }

  if (active.value) {
    let offset = 0;
    let target = e.currentTarget;
    if (props.split === "vertical") {
      while (target) {
        offset += target.offsetLeft;
        target = target.offsetParent;
      }
    } else {
      while (target) {
        offset += target.offsetTop;
        target = target.offsetParent;
      }
    }

    const currentPage = props.split === "vertical" ? e.pageX : e.pageY;
    const targetOffset =
        props.split === "vertical"
            ? e.currentTarget.offsetWidth
            : e.currentTarget.offsetHeight;
    const percent2 =
        Math.floor(((currentPage - offset) / targetOffset) * 10000) / 100;

    if (percent2 > props.minPercent && percent2 < 100 - props.minPercent) {
      percent.value = percent2;
    }

    emit("resize", percent.value);
    hasMoved.value = true;
  }
};
watch(() => props.defaultPercent, (newVal) => {
  percent.value = newVal
})
</script>

<style scoped>
.clearfix:after {
  visibility: hidden;
  display: block;
  font-size: 0;
  content: " ";
  clear: both;
  height: 0;
}

.vue-splitter-container {
  height: 100%;
  position: relative;
}

.vue-splitter-container-mask {
  z-index: 9999;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

.splitter-pane.vertical.splitter-paneL {
  position: absolute;
  left: 0px;
  height: 100%;
  padding-right: 3px;
}

.splitter-pane.vertical.splitter-paneR {
  position: absolute;
  right: 0px;
  height: 100%;
  padding-left: 3px;
}

.splitter-pane.horizontal.splitter-paneL {
  position: absolute;
  top: 0px;
  width: 100%;
}

.splitter-pane.horizontal.splitter-paneR {
  position: absolute;
  bottom: 0px;
  width: 100%;
  padding-top: 3px;
}
</style>

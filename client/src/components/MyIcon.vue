<template>
  <div class="my-icon">
    <svg class="icon svg-icon" aria-hidden="true">
      <use :xlink:href="'#' + className"></use>
    </svg>
  </div>
</template>
<script>
export default {
  name: "my-icon",
  beforeCreate() {
  },
  data() {
    return {
      src: ''
    };
  },
  props: {
    className: {
      type: String,
      default: '',
    }
  },
  mounted() {
  }
};
</script>
<style scoped>
.my-icon {
  display: inline;
  margin: 0.1rem;
  width: 0.25rem;
  height: 0.25rem;
}

.icon {
  width: 1.25em;
  height: 1.25em;
  vertical-align: -0.25rem;
  margin: 0px 0px 0px -0.4em;
  fill: currentColor;
  overflow: hidden;
}
</style>

<template>

  <a-row class="nav-bar">
    <a-col :span="1">
      <a-button>
        <MyIcon></MyIcon>
      </a-button>
    </a-col>
    <a-col :span="1">右

    </a-col>
    <a-col :span="3">
      <a-dropdown :trigger="['click']">
        <a class="ant-dropdown-link" @click.prevent>
          Click me
        </a>
        <template #overlay>
          <a-menu>
            <a-menu-item key="0">
              <a href="http://www.alipay.com/">1st menu item</a>
            </a-menu-item>
            <a-menu-item key="1">
              <a href="http://www.taobao.com/">2nd menu item</a>
            </a-menu-item>
            <a-menu-item key="2">
              3rd menu item
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </a-col>
    <a-col :span="1"></a-col>
    <a-col :span="8">col-10</a-col>
    <a-col :span="10">col-12</a-col>
  </a-row>
</template>

<script>

import MyIcon from "../../MyIcon.vue";
export default {
  name: "Navigator",
  components: {
    MyIcon
  },
  created() {
    window.document.onmousedown = function (ev) {
      console.log(ev);
      ev.preventDefault();
    }
  }
}
</script>

<style scoped>
.nav-bar {
  width: 100%;
  height: 100%;
  background-color: whitesmoke;
}
</style>

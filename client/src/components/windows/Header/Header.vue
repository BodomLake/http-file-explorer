<template>
  <div class="card-container">
    <a-tabs v-model:activeKey="activeKey" type="card" size="small">
      <a-tab-pane key="0">
        <template #tab>
          <my-icon class-name="icon-file"></my-icon>
          <span>File</span>
        </template>
        <!--<p>Content of Tab Pane 0</p>-->
      </a-tab-pane>
      <a-tab-pane key="1">
        <template #tab>
          <my-icon class-name="icon-Home"></my-icon>
          <span>Home</span>
        </template>
        <!--<p>Content of Tab Pane 1</p>-->
      </a-tab-pane>
      <a-tab-pane key="2">
        <template #tab>
          <my-icon class-name="icon-share"></my-icon>
          <span>Share</span>
        </template>
        <!--<p>Content of Tab Pane 2</p>-->

      </a-tab-pane>
      <a-tab-pane key="3">
        <template #tab>
          <my-icon class-name="icon-views"></my-icon>
          <span>View</span>
        </template>
        <!--<p>Content of Tab Pane 3</p>-->

      </a-tab-pane>
      <!--<template #leftExtra>-->
      <!--  <a-button class="tabs-extra-demo-button">File</a-button>-->
      <!--</template>-->
      <template #rightExtra>
        <a-button type="primary">
          Settings
        </a-button>
      </template>
    </a-tabs>
  </div>
</template>
<script>
import {defineComponent, ref} from 'vue';
import MyIcon from "../../MyIcon.vue";

export default defineComponent({
  setup() {
    return {
      activeKey: ref('2'),
    };
  },
  components: {
    MyIcon
  }

});
</script>
<style scoped>
.card-container > .ant-tabs-card .ant-tabs-content {
  height: 120px;
  margin-top: -16px;
}

.card-container > .ant-tabs-card .ant-tabs-content > .ant-tabs-tabpane {
  padding: 16px;
  background: #fff;
}

.card-container > .ant-tabs-card > .ant-tabs-nav::before {
  display: none;
}

.card-container > .ant-tabs-card .ant-tabs-tab,
[data-theme='compact'] .card-container > .ant-tabs-card .ant-tabs-tab {
  background: transparent;
  border-color: transparent;
}

.card-container > .ant-tabs-card .ant-tabs-tab-active,
[data-theme='compact'] .card-container > .ant-tabs-card .ant-tabs-tab-active {
  background: #fff;
  border-color: #fff;
}

#components-tabs-demo-card-top .code-box-demo {
  padding: 24px;
  overflow: hidden;
  background: #f5f5f5;
}

[data-theme='compact'] .card-container > .ant-tabs-card .ant-tabs-content {
  height: 120px;
  margin-top: -8px;
}

[data-theme='dark'] .card-container > .ant-tabs-card .ant-tabs-tab {
  background: transparent;
  border-color: transparent;
}

[data-theme='dark'] #components-tabs-demo-card-top .code-box-demo {
  background: #000;
}

[data-theme='dark'] .card-container > .ant-tabs-card .ant-tabs-content > .ant-tabs-tabpane {
  background: #141414;
}

[data-theme='dark'] .card-container > .ant-tabs-card .ant-tabs-tab-active {
  background: #141414;
  border-color: #141414;
}

.tabs-extra-demo-button {
  margin-right: 16px;
}

.ant-row-rtl .tabs-extra-demo-button {
  margin-right: 0;
  margin-left: 16px;
}
</style>

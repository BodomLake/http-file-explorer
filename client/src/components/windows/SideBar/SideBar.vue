<template>
  <a-tree :show-line="showLine" :show-icon="showIcon" :tree-data="treeData" :multiple="multiple"
          @select="onSelect" :fieldNames="fieldNames" class="sidebar"
          :default-expand-all="true" :auto-expand-parent="true" :load-data="loadDataAsync">
    <template #icon="{ dataRef ,key , selected }">
      <my-icon v-if="!dataRef.isFile" className="icon-folder"></my-icon>
      <my-icon v-if="dataRef.isFile && dataRef.type === ''" className="icon-file"></my-icon>
      <my-icon v-else :className="'icon-' + dataRef.type"></my-icon>
    </template>
    <template #title="{ dataRef }">
      <span class="text">{{ dataRef.name }}</span>
    </template>
    <template #switcherIcon="{ dataRef, switcherCls, defaultIcon }">
      <component :is="!dataRef.isLeaf ? defaultIcon : undefined" v-if="!dataRef.isFile"></component>
    </template>
  </a-tree>
</template>
<script>


import {defineComponent, inject, ref} from 'vue';
import {getReq} from "../../../utils/request";
import MyIcon from "../../MyIcon.vue";
import {convertToTreeData} from "../MainWindow/util.js";

export default defineComponent({

  setup(props) {
    const showLine = ref(true);
    const showIcon = ref(true);
    const multiple = ref(false);
    const treeData = ref([])
    // console.log(inject('currentPath').value)

    getReq("/system/getDir", {absPath: inject('userDirPath').value}).then((response) => {
      treeData.value = convertToTreeData(response.data)
    });
    const loadDataAsync = (treeNode) => {

      return new Promise(resolve => {
        console.log('loadDataAsync: treeNode', treeNode)
        let nextChildren = treeNode.dataRef.children
        if (nextChildren && nextChildren.length > 0 || treeNode.dataRef.isFile) {
          resolve();
          return;
        } else {
          getReq("/system/getDir", {absPath: treeNode.absPath}).then((res) => {
            let d = convertToTreeData(res.data)
            console.log('获得新的数据', d)
            nextChildren.push(...d)
            // 让 data 被 trig
            treeData.value = [...treeData.value];
            // 告诉<a-tree>数据处理结束了
            resolve()
          }).finally(() => {
            resolve()
          })
        }
      }).catch(e => {
        console.log('/system/getDir', e);
      })
    }

    return {
      showLine,
      showIcon,
      treeData,
      multiple,
      loadDataAsync
    }
  },
  data() {
    return {
      fieldNames: {
        children: "children",
        title: "name",
      },
    };
  },
  components: {
    MyIcon
  },
  mounted() {

  },
  methods: {
    onSelect(selectedKeys, info) {
      console.log('selected', selectedKeys, info);
      console.log('selected-node', info.node);
    },
  }

});
</script>
<style scoped>
.text {
  color: white;
}
</style>
<style>

.sidebar {
  max-height: 100%;
  overflow: auto;
  background-color: transparent !important;
}

span.ant-tree-switcher {
  background-color: transparent !important;
}
</style>

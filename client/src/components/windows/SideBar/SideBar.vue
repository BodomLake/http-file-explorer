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
    <!--<template-->
    <!--    #switcherIcon="{active, checked, expanded, loading, selected, halfChecked, title, key, children, dataRef, data, defaultIcon, switcherCls}">-->
    <!--  <component :is="dataRef.isFile ? null : defaultIcon" :class="switcherCls"/>-->
    <!--</template>-->
    <template #switcherIcon="{ dataRef, switcherCls, defaultIcon }">
      <component :is="!dataRef.isLeaf ? defaultIcon : undefined" v-if="!dataRef.isFile"></component>
      <!--<span v-else></span>-->
      <!--<down-outlined v-else :class="switcherCls" />-->
    </template>
  </a-tree>
</template>
<script>
function convertToTreeData(data) {
  let dirNum = 0;
  let fileNum = 0;
  // 文件夹的数量
  if (data.directories) {
    dirNum = data.directories.length;
  }
  // 文件的数量
  if (data.files) {
    fileNum = data.files.length;
  }
  // 如果 既没有 文件 也没有 文件夹，直接返回
  if (!data.files && !data.directories) {
    return [];
  }
  let len = dirNum + fileNum;
  let fileArray = new Array(len).fill("");

  // 循环每一个文件
  Array.from(data.files).forEach((item, idx, arr) => {
    fileArray[idx] = {
      name: item.name,
      // children: [],
      relPath: item.relPath,
      comment: item.comment,
      absPath: item.absPath,
      size: item.size,
      type: item.type ? item.type.toLowerCase() : item.type,
      isFile: true,
      isLeaf: false,
    };
  });

  // 循环每一个文件夹
  Array.from(data.directories).forEach((item, idx, arr) => {
    fileArray[idx + fileNum] = {
      name: item.name,
      children: [],
      relPath: item.relPath,
      comment: item.comment,
      absPath: item.absPath,
      tag: item.tag,
      isFile: false,
      isLeaf: false,
    };
    // 接着递归
    fileArray[idx + fileNum].children = convertToTreeData(item);
  });

  return fileArray.reverse();
}

import {defineComponent, ref} from 'vue';
import {getReq} from "../../../utils/request";
import MyIcon from "../../MyIcon.vue";

export default defineComponent({

  setup() {
    const showLine = ref(true);
    const showIcon = ref(true);
    const multiple = ref(false);
    const treeData = ref([])

    getReq("/system/getDir", {absPath: 'd://'}).then((response) => {
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
      })
    }

    return {
      showLine,
      showIcon,
      treeData,
      multiple,
      loadDataAsync
    };
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

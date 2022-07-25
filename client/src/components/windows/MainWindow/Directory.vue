<template>
  <div class="base-layout">
    <template v-if="dirLoading">
      <a-spin tip="文件夹正在读取中..."></a-spin>
    </template>
    <template v-if="viewMode == 'Extra Large Icons'">
      <!-- 外层盒子 -->
      <div v-for="(item, i) in itemList" class="extra-large-icons-box">
        <!-- 内层图标 -->
        <div class="extra-large-icons-icon">
          <div class="extra-large-icons-inner">
            <template v-if="!item.isFile">
              <svg class="extra-large-icon" aria-hidden="true">
                <use :xlink:href="'#' + 'icon-folder'"></use>
              </svg>
            </template>
            <template v-else>
              <svg class="extra-large-icon" aria-hidden="true">
                <use :xlink:href="'#' + 'icon-file'"></use>
              </svg>
            </template>
          </div>
        </div>
        <!-- 内层文本 -->
        <div class="extra-large-icons-text">
          {{ item.name }}
        </div>

      </div>
    </template>
    <template v-if="viewMode == 'Large Icons'">

    </template>
    <template v-if="viewMode == 'Medium Icons'">

    </template>
    <template v-if="viewMode == 'Small Icons'">

    </template>
    <template v-if="viewMode == 'List'">

    </template>
    <template v-if="viewMode == 'Details'">

    </template>
    <template v-if="viewMode == 'Tiles'">

    </template>
    <template v-if="viewMode == 'Content'">

    </template>
  </div>

</template>

<script>
// 默认指向ThisPC中的C盘(Windows系统)
import {getReq} from "../../../utils/request.js";
import {convertToTreeData} from "./util.js";
import "./extra-large-icons.css";
import "./large-icons.css";
import MyIcon from "../../MyIcon.vue";
import emitter from "../../../bus.js";

const defaultPath = 'C://'
const viewModes = ['Extra Large Icons', "Large Icons", 'Medium Icons', 'Small Icons', 'List', 'Details', 'Tiles', 'Content']
export default {
  name: "Directory",
  props: {
    currentPath: {
      type: String,
      default: '',
    }
  },
  data() {
    return {
      defaultPath: defaultPath,
      viewMode: viewModes[0],
      dirLoading: false,
      itemList: [],
    }
  },
  mounted() {
  },
  components: {
    'MyIcon': MyIcon
  },
  watch: {
    // 接受MainWindow指导的路径变化，一旦有变化就要发起请求！
    'currentPath': {
      immediate: true,
      handler: function (currentPath, oldPath) {
        console.log(currentPath)
        getReq("/system/getDir", {absPath: currentPath, depthLimit: 1}).then((response) => {
          let itemList = convertToTreeData(response.data)
          this.itemList = itemList;
          console.log(currentPath, response.data, itemList)
          emitter.emit('navBarPath', currentPath)
        });
      },
    }
  },
  methods: {},
}
</script>

<style scoped>
.base-layout {
  display: flex;
  width: 100%;
  height: 100%;
  min-height: 100%;
  flex-direction: row;
  flex-wrap: wrap;
  overflow-y: auto;
  overflow-x: hidden;
  align-content: flex-start;
  /*justify-content: space-around;*/
}

.base-layout::-webkit-scrollbar {
  width: 0px;
  height: 0px;
}


</style>

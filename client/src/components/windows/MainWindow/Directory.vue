<template>
  <div class="base-layout">
    <!-- 加载文件夹的提示 -->
    <template v-if="dirLoading">
      <div style="width: 100%; height: 100%">
        <a-spin tip="文件夹正在读取中..." size="large"></a-spin>
      </div>
    </template>

    <template v-if="viewMode == 'Extra Large Icons'">

      <!-- 外层盒子 -->
      <div v-for="(item, i) in itemList" class="extra-large-icons-box" @dblclick="dblClickItem(item)">

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

        <a-tooltip placement="bottom" :mouseEnterDelay=0.2 :mouseLeaveDelay=0.01>
          <template #title>
            <span>{{ item.name }}</span>
          </template>
          <!-- 内层文本 -->
          <div class="extra-large-icons-text">
            {{ item.name }}
          </div>
        </a-tooltip>

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
import "./css/extra-large-icons.css";
import "./css/large-icons.css";
import MyIcon from "../../MyIcon.vue";
import {inject, ref, watch} from "vue";

const defaultPath = 'C://'
const viewModes = ['Extra Large Icons', "Large Icons", 'Medium Icons', 'Small Icons', 'List', 'Details', 'Tiles', 'Content']
export default {
  name: "Directory",
  setup() {
    let currentPath = inject('currentPath')
    let itemList = ref([])
    let dirLoading = ref(false)
    // 接受MainWindow指导的路径变化，一旦有变化就要发起请求！
    watch(currentPath, (newPath, oldPath) => {
      if (currentPath != '/') {
        dirLoading.value = true
        getReq("/system/getDir", {absPath: decodeURI(currentPath.value), depthLimit: 1}).then((response) => {
          itemList.value = convertToTreeData(response.data)
        }).catch(err => {
          // currentPath.value = oldPath
          // 出错了，就返回上一个路由
          // TODO 给出提示，为什么没有找到对应路径的内容？网络故障、权限问题、文件损坏？
          // window.history.back()
          // window.location.hash = '/'
        }).finally(() => {
          dirLoading.value = false
        })
      }
      console.log("Directory.vue: watch 执行了", oldPath, '->', newPath)
    }, {immediate: true, deep: true})

    // 双击单个项目
    function dblClickItem(item) {
      console.log('点击文件夹', item)
      if (!item.isFile) {
        try {
          currentPath.value = item.absPath.replaceAll('\\', '/')
        } catch (e) {
          // 路径出错？
        } finally {
          //
        }
      } else {

      }
      // window.history.pushState(item, '', item.absPath)
    }

    return {
      currentPath,
      itemList,
      dirLoading,
      dblClickItem
    }
  },
  data() {
    return {
      defaultPath: defaultPath,
      viewMode: viewModes[0],
    }
  },
  mounted() {
  },
  components: {
    'MyIcon': MyIcon
  },
  watch: {},
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

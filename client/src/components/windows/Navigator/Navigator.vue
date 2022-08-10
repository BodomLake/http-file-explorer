<template>
  <div class="row-layout" style="border-top: 1px solid #d9d9d9;">
    <div name="history" class="row-layout" style="flex-basis: 12vw">
      <!-- 上一站 -->
      <div name="prev" class="box">
        <!--  可以考虑用visible控制tooltip -->
        <a-tooltip placement="bottom" :mouseEnterDelay=0.5 :mouseLeaveDelay=0.1>
          <template #title>
            <span>Back To "{{ prevDir }}" (Alt + Left Arrow)</span>
          </template>
          <a-button class="button-limit" type="text" @click="gotoPrevDir">
            <arrow-left-outlined/>
          </a-button>
        </a-tooltip>
      </div>

      <!-- 下一站 -->
      <div name="next" class="box">
        <a-tooltip placement="bottom" :mouseEnterDelay=1.0 :mouseLeaveDelay=0.1>
          <template #title>
            <span>Forward To "{{ nextDir }}" (Alt + Right Arrow)</span>
          </template>
          <a-button class="button-limit" type="text" @click="gotoNextDir">
            <arrow-right-outlined/>
          </a-button>
        </a-tooltip>
      </div>

      <!-- History 总历程 -->
      <div name="history" class="box">
        <a-tooltip placement="top" :mouseEnterDelay=0.5 :mouseLeaveDelay=0.1>
          <template #title>
            <span>Recent Location</span>
          </template>
          <a-dropdown :trigger="['click']">
            <a-button class="button-limit" type="text">
              <down-outlined/>
            </a-button>
            <template #overlay>
              <a-menu>
                <a-menu-item v-for="(path, pi) in historyPaths" :key="pi">
                  <a :href=" '/#/' + path.value.replaceAll('\\', '/')">
                    {{ path.label }}
                  </a>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </a-tooltip>
      </div>

      <!-- 溯回顶一的层的路由 -->
      <div name="upper" class="box">
        <a-tooltip placement="bottom" :mouseEnterDelay=0.5 :mouseLeaveDelay=0.1>
          <template #title>
            <span>Up To " {{ upperDir }} " (Alt + Up Arrow)</span>
          </template>
          <a-button class="button-limit" type="text" @click="gotoUpperDir">
            <arrow-up-outlined/>
          </a-button>
        </a-tooltip>
      </div>

    </div>

    <!-- 路径交互框；tabindex可以让div使能blur事件 -->
    <div name="path" class="row-layout" style="padding: 1px;" :tabindex=0>
      <!-- 路由导航模式 -->
      <template v-if="!editMode">
        <div class="address-border address-inner" @click="changeInputMode($event)">
          <div class="address-border address-inner">

            <!-- 桌面下面的所有元素 ThisPC -->
            <a-dropdown :trigger="['click']" @dbclick="getDesktopDir" class="nav-dropdown">
              <div class="button-limit"
                   style="padding-left: 8px; padding-right: 8px;display: flex;align-items: center">
                <right-outlined :style="{fontSize: '12px', color: '#000000'}"/>
              </div>
              <template #overlay>
                <a-menu>
                  <a-menu-item v-for="item in rootDir">
                    <a :href=" '/#/' + item.absPath.replaceAll('\\', '/')">
                      {{ item.name }}
                    </a>
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>

            <template v-for="(dir, di) in dirArr">

              <div class="nav-unit">
                <!-- 展示文本 -->
                <div class="nav-text" @click="gotoDir(dirArr, dir, di)">
                  <div>{{ dir == '/' || dir == '\\' ? 'ThisPC' : dir }}</div>
                  <!--{{ dir == '\\' ? 'ThisPC' : dir }}-->
                </div>
                <!-- 下拉文件菜单 -->
                <a-dropdown :trigger="['click']" class="nav-dropdown">
                  <div class="button-limit"
                       style="padding-left: 8px; padding-right: 8px;display: flex;align-items: center">
                    <right-outlined :style="{fontSize: '12px', color: '#000000'}"/>
                  </div>
                  <template #overlay>
                    <a-menu>
                      <a-menu-item v-for="item in dropDownDirMenu[di]" :data-index="di" :key="di">
                        <a :href=" '/#/' + item.absPath.replaceAll('\\', '/')">
                          {{ item.name }}
                        </a>
                      </a-menu-item>
                    </a-menu>
                  </template>
                </a-dropdown>
              </div>
            </template>
          </div>
        </div>
      </template>
      <!-- 进入编辑模式 -->
      <template v-else>
        <div class="address-border" style="position: relative;" :tabindex=1>
          <div span=24 style="position: absolute;height: 100%;width: 100%;left:0px;z-index: 2">
            <!-- 点击空白处，展示输入框 -->
            <a-input v-model:value="inputPath"
                     id="input" ref="input" @keydown.enter="visitTarget(inputPath)" style="height: 100%"
                     @focus="handleFocus" @click="handleClick($event)" @change="handleChange"
                     @blur="handleBlur($event)">
              <template #suffix>
                <a-tooltip title="Previous Location" placement="bottom" :mouseEnterDelay=0.5 :mouseLeaveDelay=0.1>
                  <!-- 下拉按钮 -->
                  <down-outlined @click="dropDown" :rotate="isDropDown ? 180 : 0"
                                 :style="{fontSize: '16px', color: '#08c'}"/>
                </a-tooltip>
              </template>
            </a-input>
          </div>
          <div style="position: absolute;height: 100%;width: 100%;left:0px;z-index: 1;visibility: hidden">
            <!-- 下拉框的实体，隐藏在输入框的下面 -->
            <a-select id="select" ref="select" :tabindex=2 :open="isDropDown" style="width: 100%;height: 100%"
                      @dropdownVisibleChange="dropdownVisibleChange" @select="selectOneOption"
                      @blur="handleBlur($event)">
              <template v-for="(h, hi) in inputHistory">
                <a-select-option :value="h.value" :data-index="hi">{{ h.label }}
                </a-select-option>
              </template>
            </a-select>
          </div>
        </div>
      </template>
    </div>

    <div name="refresh" class="box">
      <!--  可以考虑用visible控制tooltip -->
      <a-tooltip placement="bottom" :mouseEnterDelay=0.5 :mouseLeaveDelay=0.1>
        <template #title>
          <span>Refresh "File" (F5)</span>
        </template>
        <a-button class="button-limit" type="text">
          <redo-outlined/>
        </a-button>
      </a-tooltip>
    </div>

    <div name="search" class="row-layout" style="flex-basis: 10vw">

    </div>
  </div>
</template>

<script>

import {
  UpOutlined,
  DownOutlined,
  LeftOutlined,
  RightOutlined,
  ArrowDownOutlined,
  ArrowUpOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
  RedoOutlined,
} from '@ant-design/icons-vue';

import {getReq} from "../../../utils/request.js";
import {inject} from "vue";

const historyDemo = [
  {
    value: '\\',
    label: 'ThisPC',
  },
  {
    value: 'C:\\',
    label: 'C:\\',
  },
  {
    value: 'D:\\',
    label: 'D:\\',
  },
  {
    value: 'E:\\',
    label: 'E:\\',
  },
  {
    value: 'D:\\VS\\CS\\',
    label: 'D:\\V\\CS\\',
  },
  {
    value: 'D:/Qt/Tools/',
    label: 'D:\\Qt\\Tools\\',
  },
]

export default {
  name: "Navigator",
  components: {
    UpOutlined, DownOutlined, LeftOutlined, RightOutlined,
    ArrowDownOutlined, ArrowUpOutlined, ArrowLeftOutlined, ArrowRightOutlined,
    RedoOutlined
  },
  setup() {
    let currentPath = inject('currentPath')
    return {
      currentPath
    }
  },
  data() {
    return {
      // 下一个目录
      nextDir: '',
      // 前一个目录
      prevDir: '',
      // 上级目录
      upperDir: '',
      // 当前目录的各层级
      dirArr: ['/'],
      // 路由导航点击下拉，设计在dirArr没有变化的情况下，为每次点击请求更新
      dropDownDirMenu: [],
      // 面包屑导航箭头指向左侧文件夹下面所有的文件夹
      allDirectory: [
        {value: 'D:/VS', label: 'D:/VS'},
      ],
      // 历史路径(history),显示的时候显示元素的最后一层
      // 但凡是输入框点击或者输入的都记录到该数组中
      historyPaths: [
        {value: 'D:/VS', label: 'D:/VS'},
        {value: '/', label: 'This PC'},
        {value: 'D:/TencentQQ', label: 'D:/TencentQQ'},
        {value: 'D:/php', label: 'D:/php'}
      ],
      rootDir: [],
      editMode: false,
      // 输入框输入过的历史
      inputHistory: [
        ...historyDemo
      ],
      // 是否下拉的判据
      isDropDown: false,
      // 按钮被点击
      dropDownBtnClk: false,
      // 正在输入的路径
      inputPath: '\\',
      kvMap: [
        {k: 'This PC', v: '/'},
      ],
    }
  },
  mounted() {
    this.getDesktopDir();
  },
  watch: {
    // 以currentPath的变化为中心
    currentPath: {
      immediate: true,
      deep: false,
      handler: function (val, oldVal) {
        // TODO 要加入防抖或者节流？
        // let path = decodeURI(location.hash).split('#').slice(1)[0]
        if (val == '/') {
          this.dirArr = ['/']
        } else {
          this.dirArr = val.split('/').filter(item => item)
        }
        // 每次都重置输入框
        this.inputPath = val.replaceAll('/', '\\')
        this.refreshAllDropMenu(val, oldVal)
      },
    },
  },
  methods: {
    gotoDir(dirArr, dir, di) {
      console.log(dirArr)
      let path = dirArr.slice(0, di + 1).join('/') + '/'
      this.currentPath = path;
    },
    getDesktopDir() {
      getReq('/system/getDesktopDir').then(res => {
        this.rootDir = res.data.directories
      })
    },
    // 更新所有的文件夹下面的菜单
    refreshAllDropMenu(newPathArr, oldPathArr) {
      // 如果是空的项目，就说明没有请求过的；改动
      this.dropDownDirMenu = new Array(this.dirArr.length).fill(undefined)
      console.log('更新输入框的下拉菜单，refreshAllDropMenu', this.dirArr)
      if (this.currentPath != '/') {
        this.dirArr.forEach((dir, di, dirArr) => {
          let path = dirArr.slice(0, di + 1).join('/') + '/'
          // 可以说每一层路由都请求了
          getReq("/system/getDir", {absPath: path, depthLimit: 1}).then(response => {
            // console.log(response.data.directories)
            this.dropDownDirMenu[di] = response.data.directories.map(d => {
              d.absPath.replaceAll('\\', '/')
              return d;
            })
          })
        })
      } else {
        getReq("/system/getRootDir").then(response => {
          // console.log(response.data.directories)
          this.dropDownDirMenu[0] = []
          response.data.drives.forEach(d => {
            this.dropDownDirMenu[0].push({absPath: d.target, name: d.volumeName + ' ' + d.target})
          })
          response.data.folders.forEach(d => {
            d.path.replaceAll('\\', '/')
            this.dropDownDirMenu[0].push({absPath: d.path, name: d.name})
          })
        })
      }
    },
    /**
     * 首先判断这是不是文件夹，还是文件
     * 如果是文件：要设计出相应的下载通道或者说相应的解析方式(FileViewer.vue)（直接在页面上展示，比如pdf.js解析PDF文件的blob流），
     * 如果是无法用浏览器解析的文件或者体积过大的情况，就强制使用下载的手段/服务器解析；
     * 如果是文件夹：后端返回了正确的文件夹信息，那么给<Directory>、<ThisPC>组件数据，展示相应的文件夹内容；
     * 错误的情况：<a-message> error/warning 给出提示
     */
    visitTarget(path) {
      console.log('visitTarget接收到输入：', path)
      this.currentPath = path.replaceAll('\\', '/');
      // input 是要显示在界面能上的，为了能够和windows的文件浏览器的表现一致，所以用反人类的反斜杠做路径分隔符
      this.inputPath = path.replaceAll('/', '\\');
    },
    selectOneOption(value, option) {
      console.log(value, option)
      // 关掉下拉框
      this.isDropDown = false;
      // 否认点击下拉按钮
      this.dropDownBtnClk = false;
      // 访问文件夹/文件
      this.visitTarget(value)
    },
    handleChange(value) {
      console.log(`selected ${value}`);
    },
    handleBlur($event) {
      // 要实现blur函数不干扰下拉功能
      setTimeout(() => {
        if (!this.dropDownBtnClk) {
          this.editMode = false;
        }
        if (!this.dropDownBtnClk) {
          this.isDropDown = false;
        }
      }, 100)
    },
    handleFocus() {
      // console.log('focus/click');
    },
    handleClick($event) {
      $event.stopPropagation()
      this.dropDownBtnClk = false;
    },
    // 切换到输入模式
    changeInputMode($event) {
      if (Array.from($event.target.classList).includes('address-border')) {
        this.editMode = true;
        // 在视觉上要和Windows Explorer 保持一致

        this.inputPath = this.dirArr[0] + "\\" + this.dirArr.slice(1).join('\\')
        if (this.dirArr[0] == '/' || this.dirArr[0] == '\\') {
          this.inputPath = "\\"
        }
        this.selectAllText()
      }
    },
    selectAllText() {
      this.$nextTick(() => {
        document.getElementById('input').focus()
        document.getElementById('input').selectionEnd = this.inputPath.length
        document.getElementById('input').selectionStart = 0
      })
    },
    // inputHistory下拉框下拉的回调函数
    dropdownVisibleChange() {

    },
    dropDown() {
      this.isDropDown = !this.isDropDown;
      this.dropDownBtnClk = true;
    },
    gotoUpperDir() {
    },
    gotoPrevDir() {
    },
    gotoNextDir() {
    },
  },
}
</script>

<style scoped>
.row-layout {
  width: 100%;
  display: flex;
  flex-direction: row;
  min-height: 100%;
  height: 100%;
  max-height: 100%;
  align-items: center;
  vertical-align: middle;
  /*background-color: whitesmoke;*/
}

.box {
  /*height: 4vh;*/
  height: 100%;
}

.address-border {
  border: 1px solid #d9d9d9;
  width: 100%;
  text-align: left;
  height: 100%;
  display: flex;
  flex-direction: row;
  vertical-align: middle;
}

.address-inner {
  position: relative;
  /*padding-left: 1vw;*/
}

.address-inner:hover {
  border: 1px groove #1890ff;
  border-radius: 1px;
  /*box-shadow: 0px 0px 0.2px 0.1px #1890ff;*/
}

:deep(div.ant-breadcrumb) {
  vertical-align: middle;
  line-height: 200%;
}

.button-limit {
  min-height: 100%;
  max-height: 100%;
  height: 100%;
}

.nav-unit {
  display: flex;
}

.nav-text {
  padding-left: 4px;
  padding-right: 4px;
  cursor: pointer;
  height: 100%;
  display: flex;
  align-items: center
}

.nav-dropdown {
  box-sizing: content-box;
  cursor: pointer;
}

.nav-unit:hover {
  border: 1px groove lightskyblue;
  background-color: rgba(188, 229, 250, 0.5);
  box-sizing: content-box;
}

.nav-text:hover {
  border-right: 1px groove lightskyblue;
  background-color: rgba(188, 229, 250, 0.5);
  box-sizing: content-box;
}

.nav-dropdown:hover {
  border-left: 1px groove lightskyblue;
  background-color: rgba(188, 229, 250, 0.5);
}

ul.ant-dropdown-menu {
  overflow-y: auto;
  max-height: 80vh;
}
</style>

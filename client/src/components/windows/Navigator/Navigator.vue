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
          <a-button class="button-limit" type="text">
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
          <a-button class="button-limit" type="text">
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
                  <a :href=" '/#/' + path"> {{ '/#/' + path }}</a>
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
          <a-button class="button-limit" type="text">
            <arrow-up-outlined/>
          </a-button>
        </a-tooltip>
      </div>

    </div>

    <!-- tabindex可以让div使能blur事件 -->
    <div name="path" class="row-layout" style="padding: 1px;" :tabindex=0>

      <template v-if="!editMode">
        <div class="address-border address-inner" @click="changeInputMode($event)">
          <a-breadcrumb>
            <template v-for="(dir,di) in dirArr">
              <a-breadcrumb-item :href="dir" @click="gotoDir(dirArr,dir,di)">
                {{ dir }}
              </a-breadcrumb-item>
            </template>
            <template #separator>
              <a-dropdown :trigger="['click']">
                <a-button class="button-limit" type="text">
                  <right-outlined :style="{fontSize: '12px', color: '#000000'}"/>
                </a-button>
                <template #overlay>
                  <a-menu>
                    <a-menu-item v-for="(path, pi) in historyPaths" :key="pi">
                      <a :href=" '/#/' + path"> {{ '/#/' + path }}</a>
                    </a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
            </template>
          </a-breadcrumb>
        </div>
      </template>
      <!-- 进入编辑模式 -->
      <template v-else>
        <div class="address-border" style="position: relative;" :tabindex=1>
          <div span=24 style="position: absolute;height: 100%;width: 100%;left:0px;z-index: 2">
            <!-- 点击空白处，展示输入框 -->
            <a-input v-model:value="inputPath" id="input" ref="input" @keydown.enter="visitTarget(inputPath)"
                     style="height: 100%"
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
import emitter from "../../../bus.js";
import {getReq} from "../../../utils/request.js";

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
    label: 'D:\\VS\\CS\\',
  },
  {
    value: 'D:\\Qt\\Tools\\',
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
  data() {
    return {
      // 下一个目录
      nextDir: '',
      // 前一个目录
      prevDir: '',
      // 上级目录
      upperDir: '',
      // 当前目录的各层级
      // dirArr: ['D', 'VS', 'CS', 'ProjectTemplate1'],
      dirArr: ['\\'],
      // 历史路径(history),显示的时候显示元素的最后一层
      historyPaths: ['D:\\VS', 'D:\\TencentQQ', 'D:\\php'],
      editMode: false,
      // 输入框输入过的历史
      inputHistory: [
        ...historyDemo
      ],
      // 是否下拉的判据
      isDropDown: false,
      // 按钮被点击
      dropDownBtnClk: false,
      currentPath: '',
      // 正在输入的路径
      inputPath: '\\',
    }
  },
  mounted() {
    let that = this;
    window.onfocus = function () {
      window.document.title = 'HTTP-File-Explorer'
    }
    window.onblur = function () {
      console.log(that.currentDir, that.dirArr)
      window.document.title = that.currentDir;
    }
    emitter.on('visitCallBack', cb => {
      console.log('visitCallBack', cb)
      // 得到的回调结果显示正常，而且访问的还是文件夹，那么关闭编辑模式
      this.editMode = false;
    })
    emitter.on('navBarPath', path => {
      // this.currentPath = path;
      let paths = path.split('\\');
      if (paths.slice(-1)[0] == '') {
        this.dirArr = paths.slice(0, paths.length - 1)
      } else {
        this.dirArr = paths
      }
      console.log(path, paths, this.dirArr)
    })
  },
  computed: {
    currentDir() {
      return this.dirArr.slice(-1)[0]
    }
  },
  watch: {
    dirArr: {
      immediate: true,
      deep: false,
      handler: function (val, oldVal) {
        // 结尾不加路径分割符'\\'
        this.currentPath = val.join('\\')
        console.log('dirArr changed', val, oldVal, this.currentDir)
        window.document.title = val.slice(-1)[0]
        this.visitTarget(this.currentPath)
      },
    },
  },
  emits: ['update:currentPath'],
  methods: {
    gotoDir(dirArr, dir, di) {
      // 删掉被点击的目录后面的目录层级
      this.dirArr.splice(di + 1, dirArr.length - di - 1)
      console.log('gotoDir changed', this.dirArr)
      window.document.title = this.dirArr.slice(-1)[0]
    },

    /**
     * 首先判断这是不是文件夹，还是文件
     * 如果是文件：要设计出相应的下载通道或者说相应的解析方式（直接在页面上展示，比如pdf.js解析PDF文件的blob流），
     * 如果是无法用浏览器解析的文件或者体积过大的情况，就强制使用下载的手段/服务器解析；
     * 如果是文件夹：后端返回了正确的文件夹信息，那么给<Directory>、<ThisPC>组件数据，展示相应的文件夹内容；
     * 错误的情况：<a-message> error/warning 给出提示
     */
    visitTarget(path) {
      console.log(path)
      this.inputPath = path

      // 尝试发出请求到后端
      getReq('/system/isDirectory', {absPath: path}).then(response => {
        console.log(response.data)
        if (response.data.status == 200) {
          // 传输给 <Directory> 组件 或者 <ThisPC> 组件接受 信息
          if (response.data.isDirectory) {
            emitter.emit('visitDirectory', path)
          } else {
            // 传输给 解析相关文件的 <FileViewer>
            emitter.emit('visitFile', path)
          }
          // 退出编辑模式
          this.editMode = false;

        } else {
          console.error('读取错误', response.data.status)
          // 出错了，退回去，全选文本方便用户编辑
          this.selectAllText()
        }
      }).finally(() => {
      })

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
      // $event.preventDefault()
      // $event.stopPropagation()
      console.log('处理失焦的元素：', $event.target.tagName, this.dropDownBtnClk)
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
      console.log('focus/click');
    },
    handleClick($event) {
      $event.stopPropagation()
      this.dropDownBtnClk = false;
    },
    // 切换到输入模式
    changeInputMode($event) {
      // if($event.target)
      // console.log('切换到输入模式', $event.target)
      if (Array.from($event.target.classList).includes('address-border')) {
        this.editMode = true;
        // 盘符后面接 :/ 而不是 /，在视觉上要和Windows Explorer 保持一致
        this.inputPath = this.dirArr[0] + "\\" + this.dirArr.slice(1).join('\\')
        if(this.dirArr.length == 1 && this.dirArr[0] == '\\') {
          this.inputPath = '\\'
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
  padding-left: 1vw;
}

.address-inner:hover {
  border-color: #1890ff;
  border-radius: 1px;
  box-shadow: 0px 0px 0.5px 0.5px inset #1890ff;
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
</style>

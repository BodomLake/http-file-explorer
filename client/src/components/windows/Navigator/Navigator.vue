<template>

  <div class="row-layout" style="border-top: 1px solid #d9d9d9;">
    <div name="history" class="row-layout" style="flex-basis: 12vw">
      <!-- 上一站 -->
      <div name="prev" class="box">
        <!--  可以考虑用visible控制tooltip -->
        <a-tooltip placement="bottom" :mouseEnterDelay=0.5 :mouseLeaveDelay=0.1>
          <template #title>
            <span>Back To {{ prevDir }}</span>
          </template>
          <a-button class="button-limit" type="text">
            <arrow-left-outlined/>
          </a-button>
        </a-tooltip>
      </div>

      <!-- 下一站 -->
      <div name="next" class="box">
        <a-tooltip placement="bottom" :mouseEnterDelay=0.5 :mouseLeaveDelay=0.1>
          <template #title>
            <span>Forward To {{ nextDir }}</span>
          </template>
          <a-button class="button-limit" type="text">
            <arrow-right-outlined/>
          </a-button>
        </a-tooltip>
      </div>

      <!-- History 总历程 -->
      <div name="history" class="box">
        <a-tooltip placement="bottom" :mouseEnterDelay=0.5 :mouseLeaveDelay=0.1>
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
            <span>Up To {{ upperDir }}</span>
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
        <div class="address-border address-inner">
          <a-breadcrumb separator=">" style="">
            <template v-for="(dir,di) in dirArr">
              <a-breadcrumb-item :href="dir" @click="gotoDir(dirArr,dir,di)">
                {{ dir }}
              </a-breadcrumb-item>
            </template>
          </a-breadcrumb>
          <div style="min-height: 100%; width: 100%; background-color: navajowhite" @click="changeInputMode">

          </div>
        </div>
      </template>
      <!-- 进入编辑模式 -->
      <template v-else>
        <div class="address-border" style="position: relative;" :tabindex=1>
          <div span=24 style="position: absolute;height: 100%;width: 100%;left:0px;z-index: 2">
            <a-input v-model:value="inputPath" id="input" ref="input" @keydown.enter="visitDir(inputPath)"
                     @focus="handleFocus" @click="handleClick($event)" @change="handleChange" @blur="handleBlur($event)">
              <template #suffix>
                <a-tooltip title="Previous Location" placement="bottom" :mouseEnterDelay=0.5 :mouseLeaveDelay=0.1>
                  <down-outlined @click="dropDown"/>
                </a-tooltip>
              </template>
            </a-input>
          </div>
          <div style="position: absolute;height: 100%;width: 100%;left:0px;z-index: 1;">
            <a-select id="select" ref="select" :tabindex=2 :open="dropDownFlag" style="width: 100%;"
                      @dropdownVisibleChange="dropdownVisibleChange" @select="selectOneOption">
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

export default {
  name: "Navigator",
  components: {
    UpOutlined, DownOutlined, LeftOutlined, RightOutlined,
    ArrowDownOutlined, ArrowUpOutlined, ArrowLeftOutlined, ArrowRightOutlined, RedoOutlined
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
      dirArr: ['D', 'VS', 'CS', 'ProjectTemplate1'],
      // 历史路径(history),显示的时候显示元素的最后一层
      historyPaths: ['D/VS', 'D/TencentQQ', 'D/php'],
      editMode: false,
      // 输入框输入过的历史
      inputHistory: [
        {
          value: 'D:\\VS\\CS\\',
          label: 'D:\\VS\\CS\\',
        },
        {
          value: 'D:\\Qt\\Tools\\',
          label: 'D:\\Qt\\Tools\\',
        },
      ],
      dropDownFlag: false,
      // 按钮被点击
      dropDownClicked: false,
      currentPath: '',
      // 正在输入的路径
      inputPath: '',
    }
  },
  mounted() {
    let that = this;
    window.onfocus = function () {
      window.document.title = 'HTTP-File-Explorer'
    }
    window.onblur = function () {
      console.log(that.currentDir)
      window.document.title = that.currentDir;
    }
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
        this.currentPath = val.join('\\')
        console.log('dirArr changed', val)
        window.document.title = val.slice(-1)[0]
      },
    },

  },
  methods: {
    gotoDir(dirArr, dir, di) {
      console.log(dirArr, dir, di);
      console.log(dirArr.slice(0, di + 1).join('/'))
      // 删掉被点击的目录后面的目录层级
      this.dirArr.splice(di + 1, dirArr.length - di - 1)
      console.log('gotoDir changed', this.dirArr)
      window.document.title = this.dirArr.slice(-1)[0]
    },

    /**
     * 首先判断这是不是文件夹，还是文件
     * 如果是文件：要设计出相应的下载通道或者说相应的解析方式（直接在页面上展示，比如pdf.js解析PDF文件的blob流），
     * 如果是无法用浏览器解析的文件或者体积过大的情况，就强制使用下载的手段；
     * 如果是文件夹：后端返回了正确的文件夹信息，那么给<Directory>组件数据，展示相应的文件夹内容；
     * 错误的情况：<a-message> error/warning 给出提示
     */
    visitDir(path) {
      console.log(path)
      this.inputPath = path
      // 尝试发出请求到后端
      // getReq()
      // 退出编辑模式
      // this.editMode = false;
    },
    selectOneOption(value, option) {
      console.log(value, option)
      // 关掉下拉框
      this.dropDownFlag = false;
      // 否认点击下拉按钮
      this.dropDownClicked = false;
      // 访问文件夹/文件
      this.visitDir(value)
    },
    handleChange(value) {
      console.log(`selected ${value}`);
    },
    handleBlur($event) {
      // $event.preventDefault()
      // $event.stopPropagation()
      console.log('处理失焦的元素：', $event.target.tagName, this.dropDownClicked)
      // 要实现blur函数不干扰下拉功能
      setTimeout(()=>{
        if (!this.dropDownClicked) {
          this.editMode = false;
        }
        if (!this.dropDownClicked) {
          this.dropDownFlag = false;
        }
      }, 100)
    },
    handleFocus() {
      console.log('focus/click');
    },
    handleClick($event) {
      $event.stopPropagation()
      this.dropDownClicked = false;
    },
    // 切换到输入模式
    changeInputMode() {
      console.log('切换到输入模式')
      this.editMode = true;
      // 盘符后面接 :/ 而不是 /，在视觉上要和Windows Explorer 保持一致
      this.inputPath = this.dirArr[0] + ":\\" + this.dirArr.slice(1).join('\\')
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
      this.dropDownFlag = true;
      this.dropDownClicked = true;
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

.address-border:hover {
  border-color: #1890ff;
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

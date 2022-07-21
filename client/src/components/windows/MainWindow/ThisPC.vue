<template>
  <a-collapse v-model:activeKey="activeKey" style="opacity: 0.9">
    <a-collapse-panel key="0" header="This PC">
      <a-list item-layout="horizontal" :data-source="drivers">
        <template #renderItem="{ item, index }">
          <a-list-item class="driveItem" :style="{animationDelay: index * 100 +'ms'}" @dblclick="enterToDrive(item)">
            <a-list-item-meta>

              <template #avatar>
                <svg class="icon svg-icon" aria-hidden="true" style="width: 3rem;height: 3rem;margin: 0rem 1rem">
                  <use :xlink:href="'#' + 'icon-disk'"></use>
                </svg>
              </template>

              <template #title>
                <a-row>
                  <a-col :span="16" style="text-align: left">
                    {{ item.volumeName == '' ? fsTypeOption[parseInt(item.fstype)] : item.volumeName }}
                    {{ '(' + item.target + ')' }}
                  </a-col>
                  <a-col :span="8">
                    {{ item.fileSystem }}
                  </a-col>
                </a-row>
              </template>

              <template #description>
                <a-row style="height: 20px">
                  <a-col :span="16" class="memBar">
                    <a-col :span="24" class="usedMemBar" :style="{ width: item.pcent,}">

                    </a-col>
                  </a-col>
                  <a-col :span="8">
                    {{ convertToGBUnit(item.avail) }} GB free of {{ convertToGBUnit(item.size) }} GB
                  </a-col>
                </a-row>
              </template>

            </a-list-item-meta>
          </a-list-item>
        </template>
      </a-list>
    </a-collapse-panel>
    <a-collapse-panel key="1" header="System Information">
      <a-list item-layout="horizontal" :data-source="systemKeys" size="small">
        <template #renderItem="{ item }">
          <a-list-item>
            <a-list-item-meta>
              <template #title>
                <a-row>
                  <a-col :span="6"> {{ item }}</a-col>
                  <a-col :span="18">
                    <template v-if="typeof system[item] != 'object'">
                      {{ system[item] }}
                    </template>
                    <template v-else>
                      <a-button type="primary" @click="lookUp(item)">点击查看</a-button>
                    </template>
                  </a-col>
                </a-row>
              </template>
            </a-list-item-meta>
          </a-list-item>
        </template>
      </a-list>
    </a-collapse-panel>
    <a-collapse-panel key="2" header="NetWork Status">
      <template v-if="wifiLoading">
        <a-spin tip="Wifi情况正在获取中..." >
        </a-spin>
      </template>
      <template v-else>
        <a-list item-layout="horizontal" :data-source="wifis" size="small">
          <template #renderItem="{ item }">
            <a-list-item>
              <a-list-item-meta>
                <template #title>
                  <a-row>
                    <a-col :span="6"> {{ item.ssid }}</a-col>
                    <a-col :span="6"> {{ item.bssid }}</a-col>
                    <a-col :span="6"> {{ item.quality }}</a-col>
                    <a-col :span="6"> {{ item.frequency }}</a-col>
                  </a-row>
                </template>
              </a-list-item-meta>
            </a-list-item>
          </template>
        </a-list>
      </template>

    </a-collapse-panel>
  </a-collapse>

  <a-modal v-model:visible="showModal" :title="title" @ok="handleOk" width="80%">
    <!-- 按照组件名动态渲染模态框的内容 -->
    <component :is="title" :data="detail"></component>
  </a-modal>

</template>

<script>
import {getReq} from "../../../utils/request.js";
import Drive from "./Drive.js";
import CPUs from '../Dialog/CPUs-setup.vue'
import NetworkInterfaces from "../Dialog/NetworkInterfaces.vue";

export default {
  name: "ThisPC",
  components: {
    NetworkInterfaces,
    CPUs
  },
  props: {
    currentPath: {
      type: String,
      default: '',
    }
  },
  data() {
    return {
      system: {
        'k': 'v'
      },
      fsTypeOption: ['Unknown', 'No Root Directory', 'Removable Dick', 'Local Disk', 'Network Drive', 'Compat Disc', 'RAM Disk'],
      systemKeys: ['k'],
      drivers: [],
      activeKey: ['0', '2'],
      showModal: false,
      detail: {},
      title: 'OS信息',
      wifis: [],
      wifiLoading: false,

    }
  },
  mounted() {
    this.getDrives();
    this.getBasicSysInfo();
    this.wifiNetworks();

  },
  methods: {
    getDrives() {
      getReq('/system/getDrives').then((res) => {
        // console.table(res.data)
        let drivers = res.data;
        this.drivers = new Array(drivers.length).fill(new Drive())
        setTimeout(() => {
          this.drivers = drivers
          this.drivers.forEach((driver) => {
            this.getDrivesByDeviceId(driver.target, 'fileSystem');
            this.getDrivesByDeviceId(driver.target, 'volumeName');
          })
        }, 100)
      })
    },
    getDrivesByDeviceId(deviceId, attr) {
      getReq('/system/getDrivesByAttr', {deviceId, attr}).then((res) => {
        let data = res.data
        // console.log('/system/getDrivesByAttr', data)
        for (let i = 0; i < this.drivers.length; i++) {
          let drive = this.drivers[i]
          if (drive.target == data.id) {
            drive[data.attr] = data.value;
            break;
          }
        }
        // res.data.sp
        let drivers = res.data;
      })
    },
    getBasicSysInfo() {
      getReq('/system/getList').then((res) => {
        // console.log(res.data)
        this.system = res.data;
        this.systemKeys = Object.keys(res.data)
      })
    },
    wifiNetworks() {
      this.wifiLoading = true
      getReq('/system/wifiNetworks').then((res) => {
        // console.log('/system/wifiNetworks')
        // console.table(res.data)
        this.wifis = res.data;
        this.wifiLoading = false
      }).finally(() => {
        this.wifiLoading = false
      })
    },
    convertToGBUnit(num) {
      return Math.floor(num / 1024 / 1024 / 1024)
    },
    handleOk() {
      this.showModal = false
    },
    lookUp(item) {
      // console.log(item);
      this.showModal = true;
      this.title = item;
      this.detail = this.system[item];
    },
    // 进入硬盘
    enterToDrive(item, suffix){
      suffix = suffix || '//'
      console.log(item, item.target)
      // this.currentPath = item.target + suffix
      this.$emit('update:currentPath', item.target + suffix)
    }
  },
  // emits: ['update:currentPath'],
}
</script>

<style scoped>
.memBar {
  background-color: gainsboro;
  box-shadow: 1px 0px 0px 0px inset;
  /*border-bottom-left-radius: 2px;*/
  border-bottom-right-radius: 2px;
  /*border-top-left-radius: 2px;*/
  border-top-right-radius: 2px;
  text-align: left;
  border: 1px whitesmoke groove;
  height: 100%
}

.usedMemBar {
  height: 100%;
  background-color: skyblue;
  transition: width;
  transition-duration: 0.5s;
  transition-delay: 0.1s;
  /*border-bottom-left-radius: 2px;*/
  border-bottom-right-radius: 2px;
  /*border-top-left-radius: 2px;*/
  border-top-right-radius: 2px;
}

/* 效果过程 */
.fade-enter-active, .fade-leave-active {
  transition: all 0.3s ease-in-out;
}

/* 进场的瞬间与离场的效果添加 */
.fade-enter, .fade-leave-to {
  opacity: 0;
  transform: translateX(-20%);
}

.driveItem {
  position: relative;
  animation-name: scrollToStart;
  animation-duration: 0.5s;
  /* 动画向前填充模式保证动画结束后 @keyframes scrollToStart的100%节点的opacity覆盖 .driveItem的opacity */
  animation-fill-mode: forwards;
  opacity: 0;
}

/* 滑到起点 */
@keyframes scrollToStart {
  0% {
    left: 15%;
    opacity: 0;
  }
  100% {
    left: 0%;
    opacity: 1;
  }
}
</style>

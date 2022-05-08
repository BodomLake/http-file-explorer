<template>
  <a-collapse v-model:activeKey="activeKey" style="opacity: 0.8">
    <a-collapse-panel key="0" header="System Information">
      <a-list item-layout="horizontal" :data-source="systemKeys" size="small">
        <template #renderItem="{ item }">
          <a-list-item>
            <a-list-item-meta>
              <template #title>
                <a-row>
                  <a-col :span="6"> {{ item }}</a-col>
                  <a-col :span="18">
                    <tempalte v-if="typeof system[item] != 'object'">
                      {{ system[item] }}
                    </tempalte>
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

    <a-collapse-panel key="1" header="This PC">
      <a-list item-layout="horizontal" :data-source="drivers">
        <template #renderItem="{ item, index }">
          <a-list-item class="driveItem" :style="{animationDelay: index * 100 +'ms'}">
            <a-list-item-meta>

              <template #avatar>
                <!--<a-avatar src="https://joeschmoe.io/api/v1/random"/>-->
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
                    {{ getGBUnit(item.avail) }} GB free of {{ getGBUnit(item.size) }} GB
                  </a-col>
                </a-row>
              </template>

            </a-list-item-meta>
          </a-list-item>
        </template>
      </a-list>
    </a-collapse-panel>

  </a-collapse>
  <a-modal v-model:visible="showModal" :title="title" @ok="handleOk" width="80%">
    <!-- 按照组件名动态渲染模态框的内容 -->
    <component :is="title" :data="detail"></component>
  </a-modal>
</template>

<script>
import {getReq} from "../utils/request";
import Drive from "./Drive.js";
import CPUs from '../components/Dialog/CPUs.vue'
import NetworkInterfaces from "../components/Dialog/NetworkInterfaces.vue";

export default {
  name: "MainWindow",
  components: {
    NetworkInterfaces,
    CPUs
  },
  data() {
    return {
      system: {
        'k': 'v'
      },
      fsTypeOption: ['Unknown', 'No Root Directory', 'Removable Dick', 'Local Disk', 'Network Drive', 'Compat Disc', 'RAM Disk'],
      systemKeys: ['k'],
      drivers: [],
      activeKey: '0',
      showModal: false,
      detail: {},
      title: 'OS信息'
    }
  },
  mounted() {
    this.getDrives();
    this.getSystemInfo();
  },
  methods: {
    getDrives() {
      getReq('/getDrives').then((res) => {
        console.log(res.data)
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
      getReq('/getDrivesByAttr', {deviceId, attr}).then((res) => {
        let data = res.data
        console.log(data)
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
    getSystemInfo() {
      getReq('/getSystem').then((res) => {
        console.log(res.data)
        this.system = res.data;
        this.systemKeys = Object.keys(res.data)
      })
    },
    getGBUnit(num) {
      return Math.floor(num / 1024 / 1024 / 1024)
    },
    handleOk() {
      this.showModal = false
    },
    lookUp(item) {
      this.showModal = true;
      this.title = item;
      this.detail = this.system[item];
    }
  }
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

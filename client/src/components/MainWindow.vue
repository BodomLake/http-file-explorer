<template>
  <a-collapse v-model:activeKey="activeKey">
    <a-collapse-panel key="0" header="System Information">
      <a-list item-layout="horizontal" :data-source="systemKeys" size="small">
        <template #renderItem="{ item }">
          <a-list-item>
            <a-list-item-meta>
              <template #title>
                <a-row>
                  <a-col :span="6"> {{ item }}</a-col>
                  <a-col :span="18">
                    <tempalte v-if="typeof system[item] == 'string'">
                      {{ system[item] }}
                    </tempalte>
                    <template v-else>
                      <a-button type="primary">点击查看</a-button>
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
        <template #renderItem="{ item }">
          <a-list-item>
            <a-list-item-meta>
              <template #title>
                <a-row>
                  <a-col :span="16" style="text-align: left">
                    {{
                      item.volumeName == '' ? fsTypeOption[parseInt(item.fstype)] : item.volumeName + '(' + item.target + ')'
                    }}
                  </a-col>
                  <a-col :span="8">
                    {{ item.fileSystem }}
                  </a-col>
                </a-row>
                <a-row>
                  <a-col :span="16" style="text-align: left">
                    {{ item.pcent }}
                  </a-col>
                  <a-col :span="8">
                    {{ getGBUnit(item.avail) }} GB free of {{ getGBUnit(item.size) }} GB
                  </a-col>
                </a-row>
              </template>
              <template #avatar>
                <!--<a-avatar src="https://joeschmoe.io/api/v1/random"/>-->
                <!--<my-icon class-name="icon-file"></my-icon>-->
                <svg class="icon svg-icon" aria-hidden="true" style="width: 5rem;height: 5rem;margin-left: 2rem">
                  <use :xlink:href="'#' + 'icon-disk'"></use>
                </svg>
              </template>
            </a-list-item-meta>
          </a-list-item>
        </template>
      </a-list>
    </a-collapse-panel>

  </a-collapse>
</template>

<script>
import {getReq} from "../utils/request";

const fsTypeOption = ['Unknown', 'No Root Directory', 'Removable Dick', 'Local Disk', 'Network Drive', 'Compat Disc', 'RAM Disk']

class Drive {
  constructor(fstype, size, used, avail, pcent, target, volumeName, fileSystem) {
    /**
     * POSIX - File system type
     *
     * Win32 - Win32_LogicalDisk DriveType(as `String`!):
     * - "0": Unknown
     * - "1": No Root Directory
     * - "2": Removable Disk
     * - "3": Local Disk
     * - "4": Network Drive
     * - "5": Compact Disc
     * - "6": RAM Disk
     */
    this.fstype = fstype || '3'
    this.size = size || 0
    this.used = used || 0
    this.avail = avail || 0
    this.pcent = pcent || 0
    this.target = target || 'C:'
    this.volumeName = volumeName || ''
    this.fileSystem = fileSystem || ''
  }
}

export default {
  name: "MainWindow",
  // components: {MyIcon},
  data() {
    return {
      system: {
        'k': 'v'
      },
      fsTypeOption: ['Unknown', 'No Root Directory', 'Removable Dick', 'Local Disk', 'Network Drive', 'Compat Disc', 'RAM Disk'],
      systemKeys: ['k'],
      drivers: [
        new Drive()
      ],
      activeKey: '1',
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
        this.drivers = drivers
        this.drivers.forEach((driver) => {
          this.getDrivesByDeviceId(driver.target, 'fileSystem');
          this.getDrivesByDeviceId(driver.target, 'volumeName');
        })
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
    }
  }
}
</script>

<style scoped>

</style>

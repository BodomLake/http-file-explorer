<template>
  <a-table :columns="columns" :data-source="formattedData" size="small" :pagination="false"
           class="ant-table-striped"
           :row-class-name="(_record, index) => (index % 2 === 1 ? 'table-striped' : null)">
  </a-table>
</template>

<script setup>
import {reactive} from "vue";
import {Table as ATable} from "ant-design-vue/es";
// 设置props
const props = defineProps({
  data: {
    type: Array,
    default: []
  }
})
let formattedData = reactive(props.data)
// 改动reactive变量
formattedData = (formattedData).map((cpu, index) => {
  cpu.index = index + 1;
  cpu.times = (() => {
        return Object.keys(cpu.times).map(k => {
          return k.toUpperCase() + ' : ' + cpu.times[k]
        }).join(' | ')
      }
  )()
  return cpu
})
const columns = reactive(
    [
      {
        title: '#',
        dataIndex: 'index',
        width: 50,
        fixed: 'left',
      },
      {
        title: '内核名称',
        dataIndex: 'model',
        width: 400,
        align: 'center'
      },
      {
        title: '运行速度',
        dataIndex: 'speed',
        width: 100,
        align: 'center'
      },
      {
        title: '运行情况',
        dataIndex: 'times',
        fixed: 'right',
        align: 'center'
      }
    ]
)
</script>

<style scoped>
.ant-table-striped :deep(.table-striped) td {
  background-color: rgba(164, 181, 226, 0.3);
}
</style>

<!--
<template>
<a-list item-layout="horizontal" size="small">
    <a-list-item>
      <a-list-item-meta>
        <tempalte #title>
          <a-row>
            <a-col :span="1"> #编号 </a-col>
            <a-col :span="7"> 内核名称 </a-col>
            <a-col :span="2"> 处理速度</a-col>
            <a-col :span="14"> 具体 </a-col>
          </a-row>
        </tempalte>
      </a-list-item-meta>
    </a-list-item>
  </a-list>
  <a-list item-layout="horizontal" :data-source="cpus" size="small">
    <template #renderItem="{ item, index }">
      <a-list-item>
        <a-list-item-meta>
          <template #title>
            <a-row>
              <a-col :span="1">{{ index }}</a-col>
              <a-col :span="7"> {{ item.model }}</a-col>
              <a-col :span="2"> {{ item.speed }}</a-col>
              <a-col :span="14">
                {{ item.times }}
              </a-col>
            </a-row>
          </template>
        </a-list-item-meta>
      </a-list-item>
    </template>
  </a-list>
</template>
-->
<template>
  <a-table :columns="columns" :data-source="data" size="small" :pagination="false"
           class="ant-table-striped"
           :row-class-name="(_record, index) => (index % 2 === 1 ? 'table-striped' : null)">

  </a-table>

</template>

<script setup>
import {reactive, ref} from "vue";
// 设置props
const props = defineProps({
  data: {
    type: Array,
    default: []
  }
})
let prop_data = reactive(props.data)
// 改动reactive变量
prop_data = (prop_data).map((cpu, index) => {
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

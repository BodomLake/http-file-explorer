<template>
  <a-table :columns="columns" :data-source="formattedData" size="small" :pagination="false"
           class="ant-table-striped"
           :row-class-name="(_record, index) => (index % 2 === 1 ? 'table-striped' : null)">
  </a-table>
</template>

<script>
import {Table} from 'ant-design-vue'

export default {
  name: 'CPUs',
  props: {
    data: {
      type: Array,
      required: true,
      default: () => {
        return []
      }
    }
  },
  components: {
    'a-table': Table,
  },
  data() {
    return {
      columns: [
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
    }
  },
  computed: {
    formattedData() {
      return this.data.map((cpu, index) => {
        cpu.index = index + 1;
        cpu.times = (() => {
              return Object.keys(cpu.times).map(k => {
                return k.toUpperCase() + ' : ' + cpu.times[k]
              }).join(' | ')
            }
        )()
        return cpu
      })
    }
  }
}
</script>
<style scoped>
.ant-table-striped :deep(.table-striped) td {
  background-color: rgba(164, 181, 226, 0.3);
}
</style>

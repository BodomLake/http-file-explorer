import {defineStore} from "pinia";

// 对外部暴露一个 use 方法，该方法会导出我们定义的 state
const store1 = defineStore({
  // 每个 store 的 id 必须唯一
  id: 'counter',
  // state 表示数据源
  state: () => ({
    count: 0
  }),
  // getters 类似于 computed，可对 state 的值进行二次计算
  getters: {
    // double () {
    //   // getter 中的 this 指向👉 state
    //   return this.count * 2
    // },
    // 如果使用箭头函数会导致 this 指向有问题
    // 可以在函数的第一个参数中拿到 state
    double: (state) => {
      return state.count * 2
    }
  },
  // actions 用来修改 state
  actions: {
    increment() {
      // action 中的 this 指向👉 state
      this.count++
    },
  }
})
import {ref, computed} from "vue"

// 对外部暴露一个 use 方法，该方法会导出我们定义的 state
const store2 = defineStore('counter', function () {
  const count = ref(0)
  const double = computed(() => count.value * 2)

  function increment() {
    count.value++
  }

  return {
    count, double, increment
  }
})


// export {store1, store2}
// import {store1 as s1, store2 as s2} from "../store/demo";
// import * as store from "../store/demo";

// export default {store1, store2}
// import * as store from "../store/demo";

export const store = {store1, store2}
// import {store} from '../store/demo'




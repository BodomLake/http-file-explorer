<template>
  <div class="layout">
    <div class="layout-header">
      <Header></Header>
    </div>
    <div class="layout-nav">
      <Navigator></Navigator>
    </div>
    <div class="layout-middle">
      <div class="layout-sidebar background">
        <SideBar></SideBar>
      </div>
      <div class="layout-content">
        <MainWindow></MainWindow>
      </div>
    </div>
    <div class="layout-footer"></div>
  </div>
</template>
<script>
import Header from "../windows/Header/Header.vue";
import SideBar from "../windows/SideBar/SideBar.vue";
import MainWindow from "../windows/MainWindow/MainWindow.vue";
import Navigator from "../windows/Navigator/Navigator.vue";
import {provide, reactive, ref, watch} from "vue";
import {getPathFromHash} from './MainWindow/util.js'

export default {
  name: 'WindowsExplorer',
  setup(prop) {
    // 默认指向根路径（类Unix），或者ThisPC(Windows系统)
    let initPath = getPathFromHash()
    let currentPath = ref(initPath)
    // 需要后端处理，不仅仅是Desktop 还有 ThisPC 已经当前用户的收藏夹(User? Libraries Network RecycleBin )
    let userDirPath = ref('C:/Users/MACHENIKE/')
    let dirArr = reactive([])

    provide('currentPath', currentPath)
    // 如果需要全局改变currentPath，还需要定义一个方法来进行处理，类似于vuex的mutation
    provide('currentPathChange', (data) => {//此处可以接受参数，也可以不接受参数
      currentPath.value = data
    })
    provide('userDirPath', userDirPath)
    provide('userDirPathChange', (data) => {//此处可以接受参数，也可以不接受参数
      userDirPath.value = data
    })
    provide('dirArr', currentPath)
    // 如果需要全局改变currentPath，还需要定义一个方法来进行处理，类似于vuex的mutation
    provide('dirArr', (data) => {//此处可以接受参数，也可以不接受参数
      dirArr = data
    })
    watch(currentPath, (newPath, oldPath) => {
      window.localStorage.setItem('currentPath', newPath)
      // 取出最后一段
      // window.document.title = newPath
      window.location.hash = newPath == '/' ? newPath : '/' + newPath
      console.log("watch 执行了", oldPath, '->', newPath)
    }, {immediate: true, deep: true})
    return {
      currentPath,
      userDirPath,
      dirArr
    }
  },
  data() {
    return {}
  },
  mounted() {

    window.onpopstate = (e) => {
      // console.log('onpopstate', e)
    }
    // 处理location.hash的变化，可以是location.hash = ?的直接赋值，也可以是<a href="/#/?" />的跳转
    window.onhashchange = (hash) => {
      // console.log('onhashchange', hash)
      let path = '/'
      let dirArr = []
      try {
        // 按照分隔符拆分，然后去掉数组内所有空字符串的元素
        path = decodeURI(hash.newURL).split('#/').slice(1)[0]
        dirArr = path.split('/').filter(item => item)
        if (path == '') {
          path = '/'
          dirArr = ['/']
        }
        this.dirArr = dirArr;
        this.currentPath = path;
        this.setTitle();
      } catch (e) {
        this.currentPath = '/'
        this.dirArr = []
      } finally {
        console.log(hash.oldURL, hash.newURL, this.currentPath, this.dirArr)
      }
    }
    window.onblur = () => {
      // console.log(that.currentDir, that.dirArr)
      this.setTitle()
    }
/*    window.onfocus = () => {
      window.document.title = 'HTTP-File-Explorer-Win10'
    }*/
  },
  components: {
    'Navigator': Navigator,
    'SideBar': SideBar,
    'Header': Header,
    'MainWindow': MainWindow,
  },
  methods: {
    setTitle(){
      if (location.hash.split('#').slice(1)[0] == '/') {
        window.document.title = 'This PC';
      } else {
        window.document.title = location.hash.split('/')
            .filter(item => item).slice(-1)[0];
      }
    }
  }
}
</script>
<style>
.layout {
  width: 100vw;
  height: 100vh;
}

.layout-middle {
  width: 100vw;
  height: 81vh;
  display: flex;
  flex-direction: row;
}

.layout-header {
  width: 100vw;
  height: 13vh;
}

.layout-nav {
  width: 100vw;
  height: 4vh;
}

.layout-sidebar {
  width: 20vw;
  height: 81vh;
  border: 1px solid black;
  overflow: auto;
  background-color: transparent !important;
}

.layout-content {
  width: 80vw;
  height: 81vh;
  border: 1px solid black;
  overflow: auto;
  background-image: url("../../assets/iMac.jpg");
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
}

.background {
  /*  position: absolute;
    top: 0;
    left: 0;
    z-index: -1;*/
  height: 100%;
  /*  width: 100%;*/
  background-image: url("../../assets/Beach.jpg");
  background-position: left top;
  background-size: cover;
  background-repeat: no-repeat;
  font-weight: 400;
  /*filter: contrast(1);*/
  /*filter: drop-shadow(16px 16px 20px blue);*/
}

.layout-footer {
  width: 100vw;
  height: 2vh;
}
</style>

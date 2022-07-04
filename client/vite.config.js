import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
// 目前该插件导致无法在浏览器端debug的问题还没有完全修复，所以不启用；仍然使用手动按需导入UI组件
// import Components from 'unplugin-vue-components/vite'
// import {AntDesignVueResolver} from 'unplugin-vue-components/resolvers'
import legacy from '@vitejs/plugin-legacy'
import vueJsx from '@vitejs/plugin-vue-jsx'
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
/*
    Components({
      resolvers: [AntDesignVueResolver()],
      dirs: ['./src/components'], // 按需加载的文件夹
    }),
*/
    // options are passed on to @vue/babel-plugin-jsx
    vueJsx({
      optimize: true,
      isCustomElement: true,
      mergeProps: false,
    }),
    legacy({
      targets: ['defaults', 'not IE 11']
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
    // 忽略后缀名的配置选项, 添加 .vue 选项时要记得原本默认忽略的选项也要手动写入
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
  },
  server: {
    host: '127.0.0.1',
    port: 3100,
    strictPort: false,
    https: false,
    open: true,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:4000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
    },
    watch: true,
  },
  mode: 'development',
  build: {
    // sourcemap: true,
  }
})

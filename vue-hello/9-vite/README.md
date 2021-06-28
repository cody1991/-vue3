Vite，快的意思，全新的前端构建工具

理解为开箱即用的开发服务器 + 打包工具的集合，但是更加轻量，更加快

Vite 利用了浏览器原生的 ES 模块支持，和编译到原生的语言开发的工具（esbuild）提供一个快速且现代化的开发体验

# ES module

ES module 是 vite 的核心

主流浏览器 Edge、Firefox、Chrome、Safari、Opera 的较新版本都已经支持了 ES module

可以直接使用浏览器的 import export 的方式导入导出模块，不过前提是在 script 标签加上 type=module

比如

```html
<script type="module">
  import { name } from './foo.js';
</script>
```

```js
export const name = 'Nick';
```

会发起一个 http 请求，请求 http server 托管的 foo.js 文件，在里面我们使用 export 导出一个变量

## Vite 是如何使用 ES Module 的

我们初始化一个项目之后，审查元素是可以看到

```html
<script type="module" src="/src/main.js"></script>
```

我们看下这个文件内容

```js
import { createApp } from '/node_modules/.vite/vue.js?v=39627b65';
import App from '/src/App.vue';

createApp(App).mount('#app');
```

2.0 的时候创建应用需要代码通过 webpack 工具打包以后才可以在浏览器运行，而 vite 直接使用 ES Module 的能力，省去了打包过程，直接引入依赖文件

webpack 打包实现的编译很难做到按需加载，都是静态资源，不管模块代码是否被用到了，都会打包到 bundle 文件。随着业务代码的增加，打包的 bundle 文件越来越大。

为了减少 bundle 体积，开发者使用 import() 实现按需加载的形式，但是被引入的模块依然需要提前打包，后来使用 tree shaking 等方式去掉没有使用到的代码

但是都没有比 vite 更优雅的方式，可以在需要某个模块的时候动态引入，不需要提前打包

目前这种只是支持开发环境，但是已经大大提升了开发效率了

# vite.config.js 常用配置项

## plugins

插件配置，接收一个数组，在数组内执行需要的插件

比如 vite2.0 默认通过 @vitejs/plugin-vue 支持 vue

```js
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
});
```

插件分为社区和官方的类型

[官方插件](https://cn.vitejs.dev/plugins/)

[社区插件](https://github.com/vitejs/awesome-vite)

## base

开发和生产环境服务的公共基础路径，打包后在 /dist/index.html 体现，默认值是 / 我们设置成为 ./ 的话：

```js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()]
  base: './'
})
```

先看看改变前的代码：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite App</title>
    <script type="module" crossorigin src="/assets/index.70758696.js"></script>
    <link rel="modulepreload" href="/assets/vendor.4971e01e.js" />
    <link rel="stylesheet" href="/assets/index.ccce2ca3.css" />
  </head>
  <body>
    <div id="app"></div>
  </body>
</html>
```

在看下改变后的代码：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" href="./favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite App</title>
    <script type="module" crossorigin src="./assets/index.eae9607f.js"></script>
    <link rel="modulepreload" href="./assets/vendor.4971e01e.js" />
    <link rel="stylesheet" href="./assets/index.ccce2ca3.css" />
  </head>
  <body>
    <div id="app"></div>
  </body>
</html>
```

## resolve.alias

方便在组件内部引用文件，方便书写

```js
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: './',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '/src'),
    },
  },
});
```

```html
<script>
  import Hello from '@/components/Hello.vue';
  export default {
    components: { Hello },
  };
</script>
```

## resolve.extensions

可以列出需要省略的扩展名，不过官方建议不要省略 .vue

```js
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: './',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '/src'),
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'], // // 默认值
  },
});
```

## server

可以设置开发常用的选项

```js
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: './',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '/src'),
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'], // // 默认值
  },
  server: {
    host: '0.0.0.0',
    port: 7878,
    // 是否在开发环境下自动打开应用程序
    open: true,
    // 代理
    proxy: {
      '/api': {
        target: 'http://jsonplaceholder.typicode.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
```

基本和 webpack-dev-server 配置是一样的

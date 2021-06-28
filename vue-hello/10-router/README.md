先看实例，再看理论

```bash
yarn add vue-router@next
```

下载最新的路由插件

修改下代码

```js
// About.vue
<template>
  <div>About</div>
</template>
```

```js
// Home.vue
<template>
  <div>Home</div>
</template>
```

```js
// router.js
import { createRouter, createWebHashHistory } from 'vue-router';
import Home from './components/Home.vue';
import About from './components/About.vue';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
    },
    {
      path: '/about',
      name: 'About',
      component: About,
    },
  ],
});

export default router;
```

```js
// main.js
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

const app = createApp(App);
app.use(router);
app.mount('#app');
```

```js
<template>
  <router-view></router-view>
</template>
```

就能正常使用路由了

我们可以使用路由跳转

```html
<!-- Home.vue -->
<template>
  <div @click="linkTo">Go About</div>
</template>

<script>
  import { useRouter } from 'vue-router';
  export default {
    setup() {
      const router = useRouter();
      const linkTo = () => {
        router.push({
          path: '/about',
        });
      };
      return { linkTo };
    },
  };
</script>
```

useRouter() 生成路由实例 router

另外我们可以传参数之类的，和 2.0 基本一样，就不介绍了

beforeEach 和 afterEach 方法接收一个回调函数，回调函数内可以通过 router.currentRoute 拿到当前的路径参数，所以在这里可以监听到路由的变化

```js
router.afterEach(() => {
  console.log('path::', router.currentRoute.value);
});
```

# 路由器原理

根据 pathname 的变化，去匹配对应的页面，将其通过创建 DOM 节点的形式，插入到 `<div id="root"></div>` 根节点，达到无刷新页面切换的效果

## 哈希模式

浏览器地址后面的 `#` 大家很熟悉，它的变化是可以监听的，为我们提供了 hashchange 的事件，提供了下面的监听

- 点击 a 标签，改变了浏览器的地址
- 浏览器的前进后退行为
- window.location 方法，改变浏览器地址

实现一个简单的 hash 模式

```js
window.addEventListener('hashchange', hashChange);
function hashChange() {
  switch(location.hash) {
    case '#/page1':
      routeView.innerHTML = 'page1;
      break;
    case '#/page2':
      routeView.innerHTML = 'page2;
      break;
    default:
      routeView.innerHTML = 'page1;
      break;
  }
}
```

## 历史模式

history 模式会比 hash 模式稍麻烦一些，因为 history 模式依赖的是原生事件 popstate

MDN：

> history.pushState()或者 history.replaceState()不会触发 popstate 事件，只有做出浏览器动作，才会触发该事件，比如用户点击浏览器的回退按钮，或者在 js 代码中调用 history.back() 或者 history.forward() 方法

pushState 和 replaceState 都是 HTML5 的新 API，他们的作用很强大，可以做到改变浏览器地址却不刷新页面。这是实现改变地址栏却不刷新页面的重要方法

包括 a 标签的点击事件也是不会被 popstate 监听，我们需要想个办法解决这个问题，才能实现 history 模式

- 我们可以通过遍历页面上的所有 a 标签，阻止 a 标签的默认事件的同时，加上点击事件的回调函数
- 在回调函数内获取 a 标签的 href 属性值，再通过 pushState 去改变浏览器的 location.pathname 属性值
- 然后手动执行 popstate 事件的回调函数，去匹配相应的路由

```js
window.addEventListener('popstate', popChange);

// 默认执行一次 popstate 的回调函数，匹配一次页面组件
popChange();

const list = document.querySelectAll('a[href]');
list.forEach((node) =>
  node.addEventListener('click', function () {
    e.preventDefault(); //阻止a标签的默认事件
    const href = node.getAttribute('href');
    // 手动修改浏览器的地址栏
    history.pushState(null, '', href);
    // 通过 history.pushState 手动修改地址栏，
    // popstate 是监听不到地址栏的变化，所以此处需要手动执行回调函数 popChange
    popChange();
  })
);

function popChange() {
  switch(location.pathname) {
    case '/page1':
      routeView.innerHTML = 'page1;
      break;
    case '/page2':
      routeView.innerHTML = 'page2;
      break;
    default:
      routeView.innerHTML = 'page1;
      break;
  }
}
```

popstate 监听的是 HTTP 协议，需要通过 web 服务，启动端口去浏览网址

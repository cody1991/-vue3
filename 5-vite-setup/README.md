多了一个个的勾子函数，比如 watch computed

```js
// Vue2 options API
export default {
  name: 'App',
  watch: {},
  computed: {},
};
```

Vue3 里面新增 setup 方法，watch computed 属性都变成了 hook 函数，通过 vue 解构出来，比如

```js
// Vue3 Composition API
import { watch, computed } from 'vue';
export default {
  name: 'App',
  setup() {
    watch(
      () => {},
      () => {}
    );
    const a = computed(() => {});
  },
};
```

setup 的存在意义是能够使用新增的组合 API，这些 API 也只能在 setup 函数中使用

setup 调用时机是创建组件实例，初始化 props 后，生命周期的角度来看是在 beforeCreate 勾子前就被调用了。所以它也拿不到 this 上下文

生命周期对比（懒得写 table 了，感觉 md 这个特别难写）

```
Vue 3.0	Vue 2.0
beforeCreate	setup() => beforeCreate 和 created 之前就执行了，创建了 data 和 method
created	setup() => beforeCreate 和 created 之前就执行了，创建了 data 和 method
beforeMount	onBeforeMount => 组件挂载到节点之前执行的函数
mounted	onMounted => 组件挂载完成后执行的函数
beforeUpdate	onBeforeUpdate => 组件更新之前执行的函数
updated	onUpdated => 组件更新完成执行的函数
beforeDestroy	onBeforeUnmount => 组件卸载之前执行的函数
destroyed	onUnmounted => 组件卸载之后执行的函数
activated	onActivated => 被 keep-alive 缓存的组件激活的时候调用的
deactivated	onDeactivated => 被 keep-alive 缓存的组件停用的时候调用的
errorCaptured	onErrorCaptured => 补货到一个来自子孙组件异常时调用的
```

ref reactive 创建的变量，赋予了响应式的能力，在 setup 改变他们的值，模块也会相对应变化

setup 也可以返回一个函数，函数中也可以返回响应式的数据。比如没有 template，返回下面代码

```js
return () => h('h1', [count.value, state.foo]);
```

支持 props 和上下文 ctx 参数

ctx 有三个属性是暴露的

- attrs
- slots
- emit

如果使用 attrs 不能在 Options 使用 props，否则 attrs 取不到变量

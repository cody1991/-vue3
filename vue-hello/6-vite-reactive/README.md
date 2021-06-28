# reactive

参数必须是一个对象

reactive 包裹的对象，已经通过 Proxy 进行响应式赋能，所以我们可以通过如下形式修改值，会直接体现在 template 模板上

reactive 返回的代理后的对象，内部的二级三级属性，都会被赋予响应式的能力

# ref

ref 和 reactive 一样，同样是实现响应式数据的方法。在业务开发中，我们可以使用它来定义一些简单数据

```js
const count = ref(0);
```

可以通过 count.value = 1 类似这样的语法去修改。但是为什么它需要这样去修改变量，而 reactive 返回的对象可以直接修改如 state.count = 1 。

原因是 Vue 3.0 内部将 ref 悄悄的转化为 reactive，如上述代码会被这样转换：

```js
ref(0) => reactive({ value: 0 })
```

所以 count 相当于 reactive 返回的一个值，根据 reactive 修改值的方式，就可以理解为什么 ref 返回的值是通过 .value 的形式修改值了

还有一点需要注意，当 ref 作为渲染上下文的属性返回（即在 setup() 返回的对象中）并在模板中使用时，它会自动解套，无需在模板内额外书写 .value。之所以会自动解套，是因为 template 模板在被解析的时候，Vue 3.0 内部通过判断模板内的变量是否是 ref 类型。如果是，那就加上 .value，如果不是则为 reactive 创建的响应集代理数据

```js
console.log(count);
```

有个属性 `__v_isRef` 变量去判断，模板内的变量是否为 ref 类型

判断类型也可以通过 isRef 方法

```js
console.log(isRef(count)); // true
```

在 Vue 2.0 中，我们可以通过给元素添加 ref="xxx" 属性，然后在逻辑代码中通过 this.$refs.xxx 获取到对应的元素。

到了 Vue 3.0 后，setup 函数内没有 this 上下文，因此我们可以通过 ref 方法去获取，并且还需要在页面挂载以后才能拿到元素

```js
import { ref, onMounted } from 'vue';
export default {
  setup() {
    const shisanRef = ref(null);
    onMounted(() => {
      console.log(shisanRef.value);
    });
    return {
      shisanRef,
    };
  },
};
```

# computed

以勾子函数的形式出现，里面依赖的变量变化了才会触发执行

# readonly

数据只可读，不可修改，尝试修改的话会报错，并且无法修改

```
Set operation on key "name" failed: target is readonly.
```

# watchEffect

追踪响应式数据的变化，也在第一次渲染的时候立即执行

watchEffect 返回一个新的函数，可以执行这个函数，来停止监听行为

watchEffect 里面有个很重要的方法，用来清除副作用。接受一个函数，会在 watchEffect 监听的变量改变前调用一次

它的作用是什么？比如我们要监听查询里面的 search 变化，然后请求接口。接口是异步的，如果每当改变一次 search 就查询一次，search 改动很频繁，那么频繁请求接口也是不好的

我们这个时候可以在 onInvalidate 里面做点事情

```js
const stop = watchEffect((onInvalidate) => {
  console.log('监听search字段', otherState.search);
  // 3s 内如果没有修改的话，就发起后台请求
  timer = setTimeout(() => {
    console.log('模拟接口异步请求，3s后返回');
  }, 3000);
  onInvalidate(() => {
    console.log('执行 onInvalidate');
    console.log('清除');
    // 如果 3s 内发生了改变，清除定时器
    clearInterval(timer);
  });
});
```

# watch

和 watchEffect 比较，在于 watch 必须指定一个特定的变量，而且默认不会执行回调函数，等监听变量改变了，才会执行，也可以拿到前后数据的对比

```js
watch(
  () => {
    return otherState.search;
  },
  (newVal, oldVal) => {
    console.log(oldVal, '=>', newVal);
  }
);
```

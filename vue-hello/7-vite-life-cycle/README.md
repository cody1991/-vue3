生命周期调整比较简单，就不过多阐述了

# 提供/注入 (provide/inject)

有一个 祖先组件，在组件中你引入了一个 父亲组件，父亲组件 内又引入了一个 儿子组件，此时你想给 儿子组件 传递一个数据，但是你的数据源必须在 祖先组件 获取

祖先 想要传递数据给 儿子 的的话，正常情况下，需要先传递给 父亲 组件，然后 父亲 组件再将数据传给 儿子 组件

有了 provide/inject，便可以在 祖先组件 声明 provide，然后在 儿子组件 通过 inject 拿到数据

在祖先组件 options 写入

```js
provide: {
  name: 'codytang',
},
```

在 儿子组件 options 写入

```js
inject: ['name'],
```

就可以使用了

也可以使用 Vue3.0 新的写法，他们也是有 hook 的

```js
// 提供数据
provide('name2', 'codytang');
provide('info', {
  name: 'codytang',
  age: 29,
});
```

```js
// 获取数据
const name2 = inject('name', 'cody'); // 第二个参数是默认值
const info = inject('info');
return { name2, info };
```

我们需要修改传入的数据时，Vue 不建议我们直接在接收数据的页面修改数据源

我们可以在 App.vue 组件内通过 provide 传递一个修改数据的方法给 Child.vue，通过在 Child.vue 内调用该方法去改变值

```js
const changeName = () => {
  name3.value = 'codytang33';
};

provide('changeName', changeName);
```

```html
<button @click="changeName">Change Name</button>
```

```js
const changeName = inject('changeName');
return { changeName };
```

要控制好数据源，保持单一数据流

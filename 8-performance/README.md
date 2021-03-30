# 亮点

- 性能更好，比 2.0 快上 2.2 倍
- 支持 tree-shaking

# 虚拟 DOM 性能优化

## 静态标记

2.0 是全量对比模式，而在 3.0，新增了静态标记(patch flag)

在更新前的节点进行对比的时候，只会对比带有静态标记的节点

静态标记枚举定义了十几个类型，用以更加精确的定位到需要对比的节点类型

```html
<div>
  <p>老八食堂</p>
  <p>{{ message }}</p>
</div>
```

2.0 的 diff 算法会把每个标签比较一次，最后发现带有 {{message}} 的标签是需要被更新的

3.0 在创建虚拟 DOM 的时候，根据 DOM 内容是否发生变化，给予对应类型的静态标记，比如只给 {{message}} 静态标记 1，然后在 diff 算法比较的时候只比较这个标签，性能上明显好了很多

[Vue 模板转换工具](https://vue-next-template-explorer.netlify.app/)

我们可以输入上面那段代码进行转译，变成了

```js
import {
  createVNode as _createVNode,
  toDisplayString as _toDisplayString,
  openBlock as _openBlock,
  createBlock as _createBlock,
} from 'vue';

export function render(_ctx, _cache, $props, $setup, $data, $options) {
  return (
    _openBlock(),
    _createBlock('div', null, [
      _createVNode('p', null, '老八食堂'),
      _createVNode('p', null, _toDisplayString(_ctx.message), 1 /* TEXT */),
    ])
  );
}

// Check the console for the AST
```

第一个为写死静态的 p 标签，里面是静态文字
第二个 p 标签绑定了变量，所以打上了 1 标签，代表是 TEXT 文字

下面是静态标记的枚举值

```js
export const enum PatchFlags {
  TEXT = 1,// 动态的文本节点
  CLASS = 1 << 1,  // 2 动态的 class
  STYLE = 1 << 2,  // 4 动态的 style
  PROPS = 1 << 3,  // 8 动态属性，不包括类名和样式
  FULL_PROPS = 1 << 4,  // 16 动态 key，当 key 变化时需要完整的 diff 算法做比较
  HYDRATE_EVENTS = 1 << 5,  // 32 表示带有事件监听器的节点
  STABLE_FRAGMENT = 1 << 6,   // 64 一个不会改变子节点顺序的 Fragment
  KEYED_FRAGMENT = 1 << 7, // 128 带有 key 属性的 Fragment
  UNKEYED_FRAGMENT = 1 << 8, // 256 子节点没有 key 的 Fragment
  NEED_PATCH = 1 << 9,   // 512
  DYNAMIC_SLOTS = 1 << 10,  // 动态 solt
  HOISTED = -1,  // 特殊标志是负整数表示永远不会用作 diff
  BAIL = -2 // 一个特殊的标志，指代差异算法
}
```

## 静态提升

我们经常会把一些静态的变量提升出去定义，比如

```js
const PAGE_SIZE = 10
function getData () {
	$.get('/data', {
  	data: {
    	page: PAGE_SIZE
    },
    ...
  })
}
```

就不需要重新调用 getData 的时候再次定义 PAGE_SIZE 了

3.0 也做了类似的优化

刚刚那个例子我们选择 hoistStatic 的话，变成了下面这样：

```js
import {
  createVNode as _createVNode,
  toDisplayString as _toDisplayString,
  openBlock as _openBlock,
  createBlock as _createBlock,
} from 'vue';

const _hoisted_1 = /*#__PURE__*/ _createVNode(
  'p',
  null,
  '老八食堂',
  -1 /* HOISTED */
);

export function render(_ctx, _cache, $props, $setup, $data, $options) {
  return (
    _openBlock(),
    _createBlock('div', null, [
      _hoisted_1,
      _createVNode('p', null, _toDisplayString(_ctx.message), 1 /* TEXT */),
    ])
  );
}

// Check the console for the AST
```

老八食堂 这个被提到了 render 函数外面，每次渲染的时候只要取 `_hoisted_1` 就可以了

`_hoisted_1` 这个时候也打上了静态标记，但是为 -1，表示永远不会进行 diff

## cacheHandler

默认情况下 @click 事件被认为动态变量，所以视图更新的时候也会追踪变化。

但是大部分情况下视图渲染前后都是对应的同一个事件，基本不需要进行跟踪变化。

3.0 做出了对应的优化：事件监听缓存

```html
<div>
  <p>老八食堂</p>
  <p>{{ message }}</p>
  <p @click="handleClick">点我点我</p>
</div>
```

下面是还没开启 cacheHandler 的情况

```js
import {
  createVNode as _createVNode,
  toDisplayString as _toDisplayString,
  openBlock as _openBlock,
  createBlock as _createBlock,
} from 'vue';

const _hoisted_1 = /*#__PURE__*/ _createVNode(
  'p',
  null,
  '老八食堂',
  -1 /* HOISTED */
);

export function render(_ctx, _cache, $props, $setup, $data, $options) {
  return (
    _openBlock(),
    _createBlock('div', null, [
      _hoisted_1,
      _createVNode('p', null, _toDisplayString(_ctx.message), 1 /* TEXT */),
      _createVNode(
        'p',
        { onClick: _ctx.handleClick },
        '点我点我',
        8 /* PROPS */,
        ['onClick']
      ),
    ])
  );
}

// Check the console for the AST
```

事件静态标记为 8，代表动态属性，不包括类型和样式，所以也会监听它的变化，我们在 options 开启下 cacheHandler

```js
import {
  createVNode as _createVNode,
  toDisplayString as _toDisplayString,
  openBlock as _openBlock,
  createBlock as _createBlock,
} from 'vue';

const _hoisted_1 = /*#__PURE__*/ _createVNode(
  'p',
  null,
  '老八食堂',
  -1 /* HOISTED */
);

export function render(_ctx, _cache, $props, $setup, $data, $options) {
  return (
    _openBlock(),
    _createBlock('div', null, [
      _hoisted_1,
      _createVNode('p', null, _toDisplayString(_ctx.message), 1 /* TEXT */),
      _createVNode(
        'p',
        {
          onClick:
            _cache[1] ||
            (_cache[1] = (...args) =>
              _ctx.handleClick && _ctx.handleClick(...args)),
        },
        '点我点我'
      ),
    ])
  );
}

// Check the console for the AST
```

这个时候已经没有静态标记了，所以这个绑定了事件的标签不会再追踪变化

## SSR 服务端渲染

SSR 开发的时候 3.0 会把静态标签直接转化为文本

对比 react 先把 jsx 转成虚拟 DOM，再转成 HTML，3.0 这块做的很好

比如之前那段代码

```js
import { mergeProps as _mergeProps } from 'vue';
import {
  ssrRenderAttrs as _ssrRenderAttrs,
  ssrInterpolate as _ssrInterpolate,
} from '@vue/server-renderer';

export function ssrRender(
  _ctx,
  _push,
  _parent,
  _attrs,
  $props,
  $setup,
  $data,
  $options
) {
  const _cssVars = { style: { color: _ctx.color } };
  _push(
    `<div${_ssrRenderAttrs(
      _mergeProps(_attrs, _cssVars)
    )}><p>老八食堂</p><p>${_ssrInterpolate(
      _ctx.message
    )}</p><p>点我点我</p></div>`
  );
}

// Check the console for the AST
```

# Tree-shaking

没有应用到的代码，编译后自动剔除

摇树，摇动树干，枯叶掉了，新叶留着

枯叶就是指没用到的代码，新叶指被应用到的代码

2.0 无论有没有用到的功能都打包到了生产环境。主要还是因为 2.0 生成的实例是单例的，打包的时候无法检测各个方法是否被用到了

```js
import Vue from 'vue';
Vue.nextTick(() => {});
```

3.0 经过改良以后，引入了 tree-shaking，所有的方法都通过模块化的方式引入

```js
import { nextTick, onMounted } from 'vue';
nextTick(() => {});
```

这里 nextTick 使用了，但是 onMounted 没有，后续也不会出现在编译后的代码上

tree-shaking 做了两件事

- 编译阶段利用 ES 的模块化判断哪些模块已经加载
- 判断哪些模块和变量没有用到的或者引用的，删除掉它们

我们实际上在使用 2.0 的时候，比如没有使用 computed 前，和使用 computed 后，可以发现打出来的业务代码是有变大的，但是打包出来的 vendors 代码的大小是完全没有变化的

但是在 3.0 里面，如果添加了一个 computed 的话，会发现业务代码的体积，以及工具包 venders 的代码体积都变大了，也就说明了没有使用 computed 前，computed 的代码是没有被打包进去的

tree-shaking 的好处

- 减少了静态资源的总体积
- 也减少了编译无用代码的事件，加快了程序的执行时间

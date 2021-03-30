<template>
  <div>
    <p>{{ state }}</p>
    <p>{{ count }}</p>
    <p ref="codytang">codytang</p>
    <p>{{ text }}</p>
    <p @click="handleClick">{{ otherState.search }}</p>
  </div>
</template>

<script>
import {
  computed,
  onMounted,
  reactive,
  readonly,
  ref,
  watch,
  watchEffect,
} from 'vue';
export default {
  setup() {
    let timer = null;
    const state = reactive(['1', '2', '3']);
    const otherState = reactive({
      search: Date.now(),
    });
    const count = ref(0);
    const codytang = ref(null);
    const info = reactive({
      name: 'codytang',
      msg: 'hello',
    });
    const otherInfo = readonly({
      name: 'codytang',
      msg: 'hello',
    });

    onMounted(() => {
      console.log(codytang);
    });

    const text = computed(() => {
      console.log('computed text');
      return info.name + ' say ' + info.msg;
    });

    console.log(count);

    const handleClick = () => (otherState.search = Date.now());

    watch(
      () => {
        return otherState.search;
      },
      (newVal, oldVal) => {
        console.log(oldVal, '=>', newVal);
      }
    );

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

    setTimeout(() => {
      state.push('4');
      count.value = 3;
      info.name = 'cody';
      otherInfo.name = 'cody';
      // stop();
    }, 1000);

    return { state, count, codytang, text, otherInfo, otherState, handleClick };
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

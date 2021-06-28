<template>
  <div>{{ count }}{{ state.foo }} <Test :count="count" @add="add"></Test></div>
</template>

<script>
import Test from './components/Test.vue';
// import { ref, reactive, h } from 'vue';
import { ref, reactive } from 'vue';
export default {
  components: {
    Test,
  },
  setup() {
    const count = ref(0);
    const state = reactive({ foo: 'hello' });

    setTimeout(() => {
      count.value = 1;
      state.foo = 'world';
    }, 1000);

    const add = (num) => (count.value += num);

    return { count, state, add };
    // return () => h('h1', [count.value, state.foo]);
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

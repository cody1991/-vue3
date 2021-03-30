<template>
  <div>
    <p>life cycle</p>
    {{ name3 }}
    <Parent></Parent>
    <p>{{ state.count }}</p>
    <p v-if="state.show">
      <Test></Test>
    </p>
  </div>
</template>

<script>
import {
  onBeforeMount,
  onMounted,
  onBeforeUpdate,
  onUpdated,
  onBeforeUnmount,
  onUnmounted,
  onErrorCaptured,
  reactive,
  provide,
  ref,
} from 'vue';
import Test from './components/Test.vue';
import Parent from './components/Parent.vue';
export default {
  components: { Test, Parent },
  provide: {
    name: 'codytang',
  },
  setup() {
    const name3 = ref('codytang3');
    provide('name3', name3);

    provide('name2', 'codytang');
    provide('info', {
      name: 'codytang',
      age: 29,
    });
    provide('name', 'codytang');

    const state = reactive({ count: 0, show: true });

    setTimeout(() => {
      state.count = 1;
      state.show = false;
    }, 1000);

    const changeName = () => {
      name3.value = 'codytang33';
    };

    provide('changeName', changeName);

    onBeforeMount(() => console.log('onBeforeMount'));
    onMounted(() => console.log('onMounted'));
    onBeforeUpdate(() => console.log('onBeforeUpdate'));
    onUpdated(() => console.log('onUpdated'));
    onBeforeUnmount(() => console.log('onBeforeUnmount'));
    onUnmounted(() => console.log('onUnmounted'));
    onErrorCaptured(() => console.log('onErrorCaptured'));

    return { state, name3 };
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

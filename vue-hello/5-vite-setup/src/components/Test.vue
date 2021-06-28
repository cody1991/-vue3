<template>
  <div>
    {{ count }}

    <button @click="add">++</button>
  </div>
</template>

<script>
import { watchEffect } from 'vue';
export default {
  props: {
    count: Number,
    add: Function,
  },
  emits: ['add'],
  setup(props, ctx) {
    // watchEffect 和 watch 观察到数据的变化情况
    watchEffect(() => {
      console.log('props.count', props.count);
    });

    const add = () => ctx.emit('add', 50);

    return { add };
  },
};
</script>

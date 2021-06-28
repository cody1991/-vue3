<template>
  <div>
    <p>child {{ name }} {{ name2 }} {{ info }}</p>
    <button @click="changeName">Change Name</button>
  </div>
</template>

<script>
import { inject } from 'vue';
export default {
  setup() {
    const name2 = inject('name', 'cody'); // 第二个参数是默认值
    const info = inject('info');
    const changeName = inject('changeName');
    return { name2, info, changeName };
  },
  inject: ['name'],
};
</script>

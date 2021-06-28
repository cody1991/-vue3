<template>
  <div>test</div>
</template>

<script>
import { onBeforeUnmount, onUnmounted } from 'vue';
export default {
  setup() {
    onBeforeUnmount(() => console.log('child - onbeforeUnmount'));
    onUnmounted(() => console.log('child - onUnmounted'));
  },
};
</script>

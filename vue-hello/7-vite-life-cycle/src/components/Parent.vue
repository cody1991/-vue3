<template>
  <div>
    <p>parent</p>
    <p>
      <Child></Child>
    </p>
  </div>
</template>

<script>
import Child from './Child.vue';
export default {
  components: {
    Child,
  },
  setup() {},
};
</script>

<template>
  <div @click="linkTo">Go About</div>
</template>

<script>
import { useRouter, useRoute } from 'vue-router';
export default {
  setup() {
    const router = useRouter();
    const route = useRoute();
    const { id } = route.params;
    console.log('id', id);

    router.afterEach(() => {
      console.log('path::', router.currentRoute.value);
    });

    const linkTo = () => {
      router.push({
        path: '/about',
        query: {
          id: 1,
        },
      });
    };
    return { linkTo };
  },
};
</script>

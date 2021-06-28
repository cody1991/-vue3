const { createApp, ref, reactive } = Vue;
console.log(Vue);
const App = {
  setup() {
    const name = ref('codytang');
    const state = reactive({
      work: '前端开发',
    });
    return {
      name,
      state,
    };
  },
};

createApp(App).mount('#app');

<template>
  <div class="page-content">
    <Canvas />
  </div>
</template>

<script>
  import './Index.scss';
  import Canvas from '@Component/Canvas/Canvas.vue';


  export default {
    name: 'Index',
    components: {
      Canvas
    },
    data() {
      return {
        title: 'Index page !',
      };
    },
    mounted() {
      console.log(this.$store.state.homepage)
    },
    methods: {

    }
  };
</script>
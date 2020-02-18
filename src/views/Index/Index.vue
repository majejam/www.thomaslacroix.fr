<template>
  <div class="page-content">
    <Canvas fov="5000" />
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
    },
    methods: {

    },
    activated() {
      
      this.$store.commit("setHover", false);
    }
  };
</script>
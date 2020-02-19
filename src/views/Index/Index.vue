<template>
  <div class="page-content">
    <Canvas fov="5000" />
    <Homepage />
    <Links/>
  </div>
</template>

<script>
  import './Index.scss';
  import Canvas from '@Component/Canvas/Canvas.vue';
  import Links from '@Component/Links/Links.vue';
  import Homepage from '@Component/Homepage/Homepage.vue';


  export default {
    name: 'Index',
    components: {
      Canvas,
      Links,
      Homepage
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
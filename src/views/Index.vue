<template>
  <div class="page-content">
    <Canvas />
    <h2 class="page-title">
      {{ title }}
    </h2>
  </div>
</template>

<script>
  import './Index.scss';
  import Canvas from '@Component/Canvas/Canvas.vue';

  import Vue from 'vue'
  import PrismicVue from 'prismic-vue'
  import PrismicConfig from '../helpers/PRISMIC.js';
  import Prismic from "prismic-javascript"
  Vue.use(PrismicVue, {
    endpoint: 'https://thomaslacroix.cdn.prismic.io/api/v2',
  });

  export default {
    name: 'Index',
    components: {
      Canvas
    },
    data() {
      return {
        title: 'Index page !',
        projects: [],
        homepage: [],
      };
    },
    created() {
      this.getProjects()
      this.getHomepage()
      console.log(this.projects);
      console.log(this.homepage);
    },
    methods: {
      getProjects() {
        this.$prismic.client.query(
          this.$prismic.Predicates.at('document.type', 'projects'), {}
        ).then((response) => {
          response.results.forEach((element, index) => {
            this.projects.push(element.data);
          });
        }).catch((error) => {
          console.error('y a eu soucis là', error);
        })
      },
      getHomepage() {
        this.$prismic.client.query(
          this.$prismic.Predicates.at('document.type', 'homepage'), {}
        ).then((response) => {
          response.results.forEach((element, index) => {
            this.homepage.push(element.data);
          });
        }).catch((error) => {
          console.error('y a eu soucis là', error);
        })
      }
    }
  };
</script>
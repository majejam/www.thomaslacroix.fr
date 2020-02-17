<template>
  <div class="app">
    <Loader :data.sync="this.loader" statistics @ended="hasEnded"/>
    <keep-alive>
      <router-view />
    </keep-alive>
  </div>
</template>

<script>
  import Loader from '@Component/Loader/Loader.vue';

  import Vue from 'vue'
  import PrismicVue from 'prismic-vue'
  import PrismicConfig from '@/helpers/PRISMIC.js';
  import Prismic from "prismic-javascript"

  Vue.use(PrismicVue, {
    endpoint: 'https://thomaslacroix.cdn.prismic.io/api/v2',
  });

  export default {
    name: 'App',
    components: {
      Loader
    },
    data() {
      return {
        title: 'Welcome to my starter !',
        projects: [],
        homepage: [],
        loader: {
          value: 0,
          elements: 0,
        },
      };
    },
    created() {
      this.getProjects()
      this.getHomepage()
    },
    methods: {
      getProjects() {
        this.$prismic.client.query(
          this.$prismic.Predicates.at('document.type', 'projects'), {}
        ).then((response) => {
          this.loader.value = 0.5
          this.projects = response.results.map(x => x)

          this.getImagesLoaded()

        }).catch((error) => {
          console.error('y a eu soucis là', error);
        })
      },
      getHomepage() {
        this.$prismic.client.query(
          this.$prismic.Predicates.at('document.type', 'homepage'), {}
        ).then((response) => {
          this.homepage = response.results.map(x => x.data)
          this.$store.commit("setHomepage", this.homepage.pop());
        }).catch((error) => {
          console.error('y a eu soucis là', error);
        })
      },
      getImagesLoaded() {
        this.projects.forEach(element => {
          this.$store.commit("setProjects", element.data);
          let objImg = new Image();
          objImg.src = element.data.image.url
          objImg.onload = () => {
            this.loader.elements++
            this.loader.value = ((this.loader.elements / this.projects.length) / 2) + 0.5
          }
        });
      },
      hasEnded() {
        this.$store.commit("setLoaded", true);
      }
    }
  };
</script>
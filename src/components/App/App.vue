<template>
  <div class="app">
    <Loader :data.sync="this.loader" statistics @ended="hasEnded" />
    <Cursors />

    <transition name="appear" mode="out-in">
      <keep-alive>
        <router-view />
      </keep-alive>
    </transition>
  </div>
</template>

<script>
  import Loader from '@Component/Loader/Loader.vue';
  import Cursors from '@Component/Cursor/Cursor.vue';

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
      Loader,
      Cursors
    },
    watch: {
      'loaded.project':  function () { this.finishedCalls() },
      'loaded.tutorial':  function () { this.finishedCalls() },
      'loaded.homepage':  function () { this.finishedCalls() },
      'loaded.all':  function () { this.getImagesLoaded() },
    },
    data() {
      return {
        projects: [],
        homepage: [],
        tutorial: [],
        images: [],
        loader: {
          value: 0,
          elements: 0,
        },
        loaded: {
          all: false,
          project: false,
          tutorial: false,
          homepage: false,
        }
      };
    },
    created() {
      this.loader.value = 0.2
      this.getHomepage()
      this.getTutorial()
      this.getProjects()

    },
    methods: {
      getProjects() {
        this.$prismic.client.query(
          this.$prismic.Predicates.at('document.type', 'projects'), {}
        ).then((response) => {
          this.loader.value += 0.1
          this.projects = response.results.map(x => x)

          this.projects.forEach(element => {
            this.$store.commit("setProjects", element.data);
            this.images.push(element.data.image.url)
          });
          this.loaded.project = true

        }).catch((error) => {
          console.error('y a eu soucis là', error);
        })
      },
      getHomepage() {
        this.$prismic.client.query(
          this.$prismic.Predicates.at('document.type', 'homepage'), {}
        ).then((response) => {
          this.loader.value += 0.1
          this.homepage = response.results.map(x => x.data)
          this.$store.commit("setHomepage", this.homepage.pop());
          this.loaded.homepage = true
        }).catch((error) => {
          console.error('y a eu soucis là', error);
        })
      },
      getTutorial() {
        this.$prismic.client.query(
          this.$prismic.Predicates.at('document.type', 'tutorial'), {}
        ).then((response) => {
          this.loader.value += 0.1
          this.tutorial = response.results.map(x => x.data)
          this.tutorial.forEach(element => {
            this.images.push(element.tutorial.url)
            this.$store.commit("setTutorial", element.tutorial.url);
          });
          
          this.loaded.tutorial = true

        }).catch((error) => {
          console.error('y a eu soucis là', error);
        })
      },
      getImagesLoaded() {
        this.images.forEach(image => {
          let objImg = new Image();
          objImg.src = image
          objImg.onload = () => {
            this.loader.elements++
            this.loader.value = ((this.loader.elements / this.images.length) / 2) + 0.5 
          }
        });
      },
      finishedCalls() {
        if(this.loaded.tutorial && this.loaded.project && this.loaded.homepage) {
          this.loaded.all = true
        }
      }, 
      hasEnded() {
        this.$store.commit("setLoaded", true);
      },
    }
  };
</script>
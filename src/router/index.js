import Vue from 'vue';
import Router from 'vue-router';

import { SiteName, TitleSeparator, RouterMode } from '@Config';

import Index from '@View/Index/Index.vue';

import Projects from '@View/Projects/Projects.vue';

import NotFound from '@View/NotFound/NotFound.vue';

Vue.use(Router);

const router = new Router({
  mode: RouterMode,
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Index,
      props: true,
      meta: {
        title: 'Home',
      },
    },
    {
      path: '/projects',
      name: 'Projects',
      component: Projects,
      props: true,
      meta: {
        title: 'Projects',
      },
    },
    {
      path: '*',
      name: 'NotFound',
      component: NotFound,
      props: true,
      meta: {
        title: 'Uh oh',
      },
  },
  ],
});

router.beforeEach((to, from, next) => {
  document.title = to.meta.title + TitleSeparator + SiteName;
  next();
});

export default router;

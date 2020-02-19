const debug = process.env.NODE_ENV !== 'production';

const storeConfig = {
  modules: {},
  getters: {
    projects: state => {
      return state.projects
    },
    homepage: state => {
      return state.homepage
    },
    mobile: state => {
      return state.mobile
    }
  },
  state: {
    projects: [],
    homepage: [],
    tutorial: '',
    loaded: false,
    hovering: false,
    hold: false,
    holding: false,
    mobile: false,
  },
  mutations: {
    setProjects (state, payload) {
      state.projects.push(payload) 
    },
    setHomepage (state, payload) {
      state.homepage.push(payload)
    },
    setTutorial (state, payload) {
      state.tutorial = payload 
    },
    setLoaded (state, payload) {
      state.loaded = payload
    },
    setHover (state, payload) {
      state.hovering = payload
    },
    setHold (state, payload) {
      state.hold = payload
    },
    setHolding (state, payload) {
      state.holding = payload
    },
    setMobile (state, payload) {
      state.mobile = payload
    },
  },
  actions: {},
  strict: debug,
};

export default storeConfig;

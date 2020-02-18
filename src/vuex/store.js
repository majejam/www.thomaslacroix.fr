const debug = process.env.NODE_ENV !== 'production';

const storeConfig = {
  modules: {},
  getters: {
    projects: state => {
      return state.projects
    }
  },
  state: {
    projects: [],
    homepage: [],
    loaded: false,
    hovering: false,
    hold: false,
    holding: false,
  },
  mutations: {
    setProjects (state, payload) {
      state.projects.push(payload) 
    },
    setHomepage (state, payload) {
      state.homepage.push(payload)
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
  },
  actions: {},
  strict: debug,
};

export default storeConfig;

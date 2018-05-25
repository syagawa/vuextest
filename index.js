'use strict';

// import Vue from 'vue';
// import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    increment(state){
      state.count++;
    },
    decrement(state){
      state.count--;
    }
  }
});

const Counter = {
  template: `<div>{{ count }}</div>`,
  computed: {
    count(){
      return this.$store.state.count;
    }
  }
};

new Vue({
  el: "#app",
  store,
  components: {
    'counter': Counter
  },
  methods: {
    increment(){
      store.commit('increment');
    },
    decrement(){
      store.commit('decrement');
    }

  }
});
'use strict';

// import Vue from 'vue';
// import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    count: 0,
    todos: [
      {
        id: 1,
        text: "ABCD",
        done: false,
      },
      {
        id: 2,
        text: "ABCD",
        done: true,
      }
    ]
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

// mapState
const mapState = Vuex.mapState;
mapState({
  function(state){
    return state.count;
  },
  countAlias: "count",
  countPlusLocalState(state){
    return state.count + this.localCount;
  }
});

const Counter = {
  template: `<div>
              <div>count: {{ count }}</div>
              <div>done {{ doneTodosCount }}</div>
            </div>
            `,
  // computed: {
  //   count(){
  //     return this.$store.state.count;
  //   }
  // },

  // mapState
  computed: {
    ...mapState([
      'count'
    ]),
    doneTodosCount(){
      return this.$store.state.todos.filter(todo => todo.done).length;
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

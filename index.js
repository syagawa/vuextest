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
  getters: {
    doneTodos: function(state){
      return state.todos.filter(function(todo){
        return todo.done;
      });
    },
    doneTodosCount: function(state, getters){
      return getters.doneTodos.length;
    },
    getTodoById: function(state){
      return function(id){
        return state.todos.find(function(todo){
          return todo.id === id;
        })
      }
    }
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

// mapGetters
const mapGetters = Vuex.mapGetters;

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
    ...mapState({
      count: 'count'
    }),
    ...mapGetters({
      doneTodosCount: 'doneTodosCount'
    })
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

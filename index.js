'use strict';

// import Vue from 'vue';
// import Vuex from 'vuex';

const SOME_MUTATION = "SOME_MUTATION";

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
    increment(state, payload={amount: 1}){
      state.count += payload.amount;
    },
    decrement(state, payload={amount: 1}){
      state.count -= payload.amount;
    },
    [SOME_MUTATION](state){
      console.info(state);
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

const app = new Vue({
  el: "#app",
  store,
  data: {
    obj: {
      one: 1,
      two: 2,
      three: 3
    }
  },
  components: {
    'counter': Counter
  },
  methods: {
    increment(){
      store.commit('increment', {amount: Math.floor(Math.random() * 10) + 1});
    },
    decrement(){
      store.commit({
        type: 'decrement',
        amount: Math.floor(Math.random() * 10) + 1
      });
    },
    some(){
      store.commit("SOME_MUTATION");
    }
  }
});

app.$set(store.state, 'newProp', 123);

app.obj = { ...app.obj, four: 4};
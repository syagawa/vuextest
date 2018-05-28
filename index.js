'use strict';

// import Vue from 'vue';
// import Vuex from 'vuex';

const SOME_MUTATION = "SOME_MUTATION";

Vue.use(Vuex);


function getDataA(state){
  return new Promise(function(resolve, reject){
    console.info("A");
    resolve();
  });
}
function getDataB(state){
  return new Promise(function(resolve, reject){
    console.info("B");
    resolve();
  });
}

const testPlugin = function(store){
  store.subscribe(function(mutation, state){
    console.info("in plugin", mutation, state);
    if(mutation.type != "edited"){
      store.commit("edited");
    }
  });
};

const moduleA = {
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
    ],
    message: "hello hello hello"
  },
  getters: {
    doneTodos: function(state){
      return state.todos.filter(function(todo){
        return todo.done;
      });
    },
    doneTodosCount: function(state, getters, rootState){
      console.info(state);
      console.info(rootState);
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
    },
    gotDataA(state){
    },
    gotDataB(state){
    },
    updateMessage(state, payload={message: ""}){
      state.message = payload.message;
    }
  },
  actions: {
    incrementAsync({ commit }){
      return new Promise(function(resolve, reject){
        setTimeout(function(){
          commit('increment');
          resolve();
        }, 1000);
      });
    },
    async actA({commit}){
      commit("gotDataA", await getDataA());
    },
    async actB({dispatch, commit}){
      await dispatch("actA");
      commit('gotDataB', await getDataB());
    }

  }
};

const moduleB = {
  namespaced: true,
  state: {
    count: 123456,
    todos: [
      {
        id: 1,
        text: "ABCD",
        done: true,
      },
      {
        id: 2,
        text: "ABCD",
        done: true,
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
    doneTodosCount: function(state, getters, rootState){
      console.info(state);
      console.info(rootState);
      return getters.doneTodos.length;
    },
    getTodoById: function(state){
      return function(id){
        return state.todos.find(function(todo){
          return todo.id === id;
        })
      }
    }
  }
};

const store = new Vuex.Store({
  // strict: process.env.NODE_ENV !== 'production',
  strict: true,
  state: {
    edited: false
  },
  modules: {
    a: moduleA,
    b: moduleB
  },
  mutations: {
    edited(state){
      state.edited = true;
    }
  },
  plugins: [testPlugin]
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

// mapMutations
const mapMutations = Vuex.mapMutations;

//mapActions
const mapActions = Vuex.mapActions;

const Counter = {
  template: `<div>
              <div>count: {{ count }}</div>
              <div>done {{ doneTodosCount }}</div>
            </div>
            `,
  // mapState
  computed: {
    ...mapState({
      count: function(state){
        return state.a.count;
      }
    }),
    ...mapGetters('b/', {
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
  computed: {
    message: {
      get(){
        return this.$store.state.a.message;
      },
      set(value){
        console.info(value);
        this.$store.commit('updateMessage', {message: value});
      }
    }
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
    },
    ...mapMutations({
      add: 'increment'
    }),
    asyncAdd(){
      store.dispatch("incrementAsync").then(function(){
        console.info("added async!");
      });
    },
    actAB(){
      store.dispatch("actB").then(function(){
        console.info("comp actAB");
      });
    }
    // ,
    // updateMessage(e){
    //   store.commit('updateMessage', {message: e.target.value} );
    // }
  }
});

// app.$set(store.state, 'newProp', 123);

app.obj = { ...app.obj, four: 4};
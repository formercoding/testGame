import Vue from 'vue'
import Vuex from 'vuex'

import actions from './actions.js';
import getters from './getters.js';
import mutations from './mutations.js';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        count: 1
    },
    actions,
    getters,
    mutations,
});

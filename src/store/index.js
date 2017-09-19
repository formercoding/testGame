import Vue from 'vue'
import Vuex from 'vuex'

import actions from './actions.js';
import getters from './getters.js';
import mutations from './mutations.js';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        dialogVisible: false, // 选择弹窗状态
    },
    actions,
    getters,
    mutations: {
        changeDialog(state) {
            state.dialogVisible = !state.dialogVisible;
        }
    }
});

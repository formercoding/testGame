import Vue from 'vue'
import Vuex from 'vuex'

import actions from './actions.js';
import getters from './getters.js';
import mutations from './mutations.js';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        dialogVisible: false, // 选择弹窗状态
        gameBase: { // 游戏基础设置
            description: '', // 游戏简介做多500个字符
            image: '', // 游戏简介图片地址
            keyword: '', // 关键字
            name: '', // 游戏标题最多12个字符
            share: { // 分享的设置
                shareConfig: { // 分享设置
                    shareContent: '', // 分享描述
                    shareImage: '', // 分享图片地址
                    shareTitle: '', // 分享标题
                },
                shareType: 'flase' // 是否自定义分享
            }
        },
        gameQuestions: [ // 测试结果数组
            {
                _id: 0, // 问题序号
                question: { // 问题文字描述
                    image: '', // 问题图片地址
                    name: '', // 问题描述
                }, 
                options: [ // 问题选项数组
                    {
                        name: '', // 答案文字描述
                        target: {
                            type: 0,
                            issueOrResultId: 0
                        }
                    }, {
                        name: '', // 答案文字描述
                        target: {
                            type: 0,
                            issueOrResultId: 0
                        }
                    }
                ]
            }, {
                _id: 0, // 问题序号
                question: { // 问题文字描述
                    image: '', // 问题图片地址
                    name: '', // 问题描述
                }, 
                options: [ // 问题选项数组
                    {
                        name: '', // 答案文字描述
                        target: {
                            type: 0,
                            issueOrResultId: 0
                        }
                    }, {
                        name: '', // 答案文字描述
                        target: {
                            type: 0,
                            issueOrResultId: 0
                        }
                    }
                ]
            }
        ]

    },
    actions,
    getters,
    mutations: {
        /**
         * 跳转设置弹窗状态修改
         * @param {Object} state 
         * @param {Boolean} isShow 是否显示弹窗
         */
        changeDialog(state, isShow) {
            state.dialogVisible = isShow;
        },

        /**
         * 修改游戏基础设置首页的图片
         * @param {Object} state 
         * @param {String} url 图片地址 
         */
        changeIndexPic(state, url) {
            url = url || '';            
            state.gameBase.image = url;
        },

        /**
         * 修改游戏基础设置分享的图片
         * @param {Object} state 
         * @param {String} url 图片地址 
         */
        changeSharePic(state, url) {
            url = url || '';            
            state.gameBase.share.shareConfig.shareImage = url;
        },

        /**
         * 修改游戏问题设置的图片
         * @param {Object} state 
         * @param {Number} index 问题索引 
         * @param {String} url 图片地址 
         */
        changeQuestionsPic(state, payload) {
            payload.url = payload.url || '';
            state.gameQuestions[payload.index].question.image = payload.url;
        },

        
        /**
         * 修改游戏结果设置的图片
         * @param {Object} state 
         * @param {Number} index 问题索引 
         * @param {String} url 图片地址 
         */
        changeResultsPic(state, payload) {
            payload.url = payload.url || '';                        
            state.gameAnswer[payload.index].image = payload.url;
        },

        /**
         * 设置游戏基础设置
         * @param {Object} gameBase 设置对象
         */
        setGameBase(state, gameBase) {
            state.gameBase = gameBase;
            console.log(state.gameBase);
        },

        /**
         * 设置游戏问题
         * @param {Object} gameQuestions 设置对象数组
         */
        setGameQuestions(state, gameQuestions) {
            state.gameQuestions = gameQuestions;
            console.log(state.gameQuestions);
        },

        /**
         * 设置跳转弹窗状态
         * @param {Object} gameQuestions 设置对象数组
         */
        setDialogVisible(state, isShow) {
            state.dialogVisible = isShow;
        }



    }
});

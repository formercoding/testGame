import Vue from 'vue'
import Vuex from 'vuex'

import actions from './actions.js';
import getters from './getters.js';
import mutations from './mutations.js';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
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
        gameQuestions: [ // 测试问题数组
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
        ],
        gameResults: [ // 测试结果数组
            {
                _id: 0, // 测试结果序号
                content: '', // 测试结果描述
                image: '', // 测试结果图片地址
                name: '', // 测试结果标题
            }
        ]
    },
    actions,
    getters,
    mutations: {

        /**
         * 设置游戏基础设置
         * @param {Object} gameBase 设置对象
         */
        setGameBase(state, gameBase) {
            state.gameBase = gameBase;
        },

        /**
         * 设置游戏问题
         * @param {Array} gameQuestions 设置对象数组
         */
        setGameQuestions(state, gameQuestions) {
            state.gameQuestions = gameQuestions;
            console.log(state.gameQuestions);
        },
        
        /**
         * 设置游戏结果
         * @param {Array} gameResults 设置对象数组
         */
        setGameResults(state, gameResults) {
            state.gameResults = gameResults;
        }
    }
});

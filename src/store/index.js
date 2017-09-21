import Vue from 'vue'
import Vuex from 'vuex'

import actions from './actions.js';
import getters from './getters.js';
import mutations from './mutations.js';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        dialogData: { // 弹窗跳转状态信息
            targetType: '', // 跳转目标类型
            targetIndex: '', // 跳转目标序号
            isShow: false // 选择弹窗状态
        },
        curOption: { // 当前选择的选项
            index: -1, // 问题序号
            indexs: -1 // 选项序号
        },
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
         * 跳转设置
         * @param {Object} state 
         * @param {Boolean} curOption 当前选项索引
         */
        setCurOption(state, curOption) {
            state.curOption.index = curOption.index;
            state.curOption.indexs = curOption.indexs;
        },

        /**
         * 根据当前弹窗选择状态和选项状态跳转
         */
        setTarget(state) {
            let index = state.curOption.index,
                indexs = state.curOption.indexs,
                targetType = state.dialogData.targetType,
                targetIndex = state.dialogData.targetIndex;
                console.log(indexs, index);
            state.gameQuestions[index].options[indexs].target.type = targetType;
            state.gameQuestions[index].options[indexs].target.issueOrResultId = targetIndex;
        },

        /**
         * 跳转设置弹窗状态修改
         * @param {Object} state 
         * @param {Boolean} dialogData 弹窗数据
         */
        setDialogData(state, dialogData) {
            state.dialogData.isShow = dialogData.isShow;
            state.dialogData.targetIndex = dialogData.targetIndex || -1;
            state.dialogData.targetType = dialogData.targetType || -1;
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
            state.gameResults[payload.index].image = payload.url;
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
        },

        /**
         * 设置跳转弹窗状态
         * @param {Object} gameQuestions 设置对象数组
         */
        setDialogVisible(state, isShow) {
            state.dialogVisible = isShow;
        },

        /**
         * 设置跳转弹窗信息
         * @param {Object} state
         * @param {dialogData} dialogData
         */
        setDialogData(state, dialogData) {
            state.dialogData = dialogData;
        }



    }
});

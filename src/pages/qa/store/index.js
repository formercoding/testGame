import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        tabState: { // 页面的tab状态
            curTab: 1, // 当前tab页面
            curR: 0, // 当前设置的结果
            curQ: 0 // 当前设置的问题
        },
        gameBaseDefault: {}, // 游戏基础设置默认
        gameQuestionsDefault: {}, // 游戏问题设置默认
        gameResultsDefault: {},
        gameBase: { // 游戏基础设置
            title: "",
            keyword: '',
            image: "",
            description: "",
            shareTitle: "",
            shareImage: "",
            shareContent: "",
            shareType: 1
        },
        
        gameQuestions: [ // 测试问题数组
            {
                questionId: 0, // 问题序号
                question: { // 问题文字描述
                    image: '', // 问题图片地址
                    name: '', // 问题描述
                }, 
                options: [ // 问题选项数组
                    {
                        name: '', // 答案文字描述
                        type: 0,
                        issueOrResultId: 0
                    }, {
                        name: '', // 答案文字描述
                        type: 0,
                        issueOrResultId: 0
                    }
                ]
            }, {
                questionId: 0, // 问题序号
                question: { // 问题文字描述
                    image: '', // 问题图片地址
                    name: '', // 问题描述
                }, 
                options: [ // 问题选项数组
                    {
                        name: '', // 答案文字描述
                        type: 0,
                        issueOrResultId: 0
                    }, {
                        name: '', // 答案文字描述
                        type: 0,
                        issueOrResultId: 0
                    }
                ]
            }
        ],
        gameResults: [ // 测试结果数组
            {
                resultId: 0, // 测试结果序号
                content: '', // 测试结果描述
                image: '', // 测试结果图片地址
                name: '', // 测试结果标题
            }, {
                resultId: 0, // 测试结果序号
                content: '', // 测试结果描述
                image: '', // 测试结果图片地址
                name: '', // 测试结果标题
            }
        ]
    },
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
        },
        
        /**
         * 设置游戏结果
         * @param {Array} gameResults 设置对象数组
         */
        setGameResults(state, gameResults) {
            state.gameResults = gameResults;
        },

        /**
         * 设置curTab
         * @param {Array} index 切换的索引
         */
        setCurTab(state, index) {
            state.tabState.curTab = index;
        },

        /**
         * 设置curQ
         * @param {Array} index 切换的索引
         */
        setCurQ(state, index) {
            state.tabState.curQ = index;
        },

        /**
         * 设置curR
         * @param {Array} index 切换的索引
         */
        setCurR(state, index) {
            state.tabState.curR = index;
        },
    }
});

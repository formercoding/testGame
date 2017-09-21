<template>
    <div class="box">
        <div class="content">
            <!-- 手机预览组件 -->
            <div class="phone-wrap">
                <v-phone></v-phone>
            </div>
            <!-- 游戏设置模块 -->
            <div class="set-wrap">
                <ul class="tabs">
                    <li class="tab" 
                        :class="{active: curTab === 1}" 
                        @click="switchTab(1)">基础设置</li>
                    <li class="tab" 
                        :class="{active: curTab === 2}" 
                        @click="switchTab(2)">测试结果设置</li>
                    <li class="tab" 
                        :class="{active: curTab === 3}" 
                        @click="switchTab(3)">问题设置</li>
                </ul>
                <!-- 设置内容组件 -->
                <section id="scrollEle"
                         class="scrollbar" 
                         :style="{maxHeight: scrollH}"
                         ref="scrollbar">
                    <div class="sets">
                        <v-gamebase v-show="curTab === 1" @updateH="updateScroll"></v-gamebase>
                        <v-gameresult v-show="curTab === 2" @updateH="updateScroll"></v-gameresult>
                        <v-gameask v-show="curTab === 3" @updateH="updateScroll"></v-gameask>
                    </div>
                </section>
            </div>
        </div>
        <!-- 按钮切换tab模块 -->
        <div class="btns">
            <div class="next" v-show="curTab === 1">
                <button class="btn" 
                        type="button" 
                        @click="switchTab(2)">下一步</button>
            </div>
            <div class="bridge" v-show="curTab === 2">
                <button class="btn btn-prev" 
                        type="button" 
                        @click="switchTab(1)">上一步</button>
                <button class="btn btn-next" 
                        type="button" 
                        @click="switchTab(3)">下一步</button>
            </div>
            <div class="save" v-show="curTab === 3">
                <button class="btn" 
                        type="button">提交</button>
            </div>
        </div>
        <!-- 弹出框 -->
        <v-dialog></v-dialog>
        <!-- 弹出框集合 -->
        <!-- <v-dialogs></v-dialogs> -->
        
    </div>
</template>
<script>
// 自定义滚动条插件
import GeminiScrollbar from 'gemini-scrollbar';
import "gemini-scrollbar/gemini-scrollbar.css";

// 子组件
import vGamebase from './gamebase'
import vGameask from './gameask'
import vGameresult from './gameresult'
import vPhone from './phone'
import vDialog from './dialog'
import vDialogs from './dialogs'
export default {
    data() {
        return {
            curTab: 2, // 当前tab 1基础设置 2测试结果设置 3问题设置
        }
    },

    created() {
        let _this = this;

        // 游戏数据请求
        this.$http({
            method: 'post',
            url: '123.3.3.3'
        }).then(() => {
            console.log('success');
        }).catch(() => {
            // 设置游戏基础状态
            _this.$store.commit('setGameBase', {
                description: 'wulihang', // 游戏简介做多500个字符
                image: 'http://bbs.cguse.com/attachments/month_1004/1004241424c162021c314fa9c0.jpg', // 游戏简介图片地址
                keyword: '共享测试游戏', // 关键字
                name: '共享测试游戏', // 游戏标题最多12个字符
                share: { // 分享的设置
                    shareConfig: { // 分享设置
                        shareContent: '姜青铜', // 分享描述
                        shareImage: 'http://bbs.cguse.com/attachments/month_1004/1004241424c162021c314fa9c0.jpg', // 分享图片地址
                        shareTitle: '玩游戏啦', // 分享标题
                    },
                    shareType: 'true' // 是否自定义分享
                } 
            });
            // 设置游戏规则状态
            _this.$store.commit('setGameQuestions', [
                {
                    _id: 1, // 问题序号
                    question: { // 问题文字描述
                        image: 'http://bbs.cguse.com/attachments/month_1004/1004241424c162021c314fa9c0.jpg', // 问题图片地址
                        name: '你是不是傻', // 问题描述
                    }, 
                    options: [ // 问题选项数组
                        {
                            name: '是傻', // 答案文字描述
                            target: {
                                type: '',
                                issueOrResultId: ''
                            }
                        }, {
                            name: '不傻', // 答案文字描述
                            target: {
                                type: '',
                                issueOrResultId: ''
                            }
                        }
                    ]
                }, {
                    _id: 0, // 问题序号
                    question: { // 问题文字描述
                        image: 'http://bbs.cguse.com/attachments/month_1004/1004241424c162021c314fa9c0.jpg', // 问题图片地址
                        name: '你是傻逼嘛', // 问题描述
                    }, 
                    options: [ // 问题选项数组
                        {
                            name: '傻哦', // 答案文字描述
                            target: {
                                type: 0,
                                issueOrResultId: 0
                            }
                        }, {
                            name: '不傻哦', // 答案文字描述
                            target: {
                                type: 1,
                                issueOrResultId: 1
                            }
                        }
                    ]
                }
            ]);

            // 设置游戏结果
            _this.$store.commit('setGameResults', [
                {
                    _id: 0, // 测试结果序号
                    content: '姜青铜', // 测试结果描述
                    image: 'http://bbs.cguse.com/attachments/month_1004/1004241424c162021c314fa9c0.jpg', // 测试结果图片地址
                    name: '你是姜青铜', // 测试结果标题
                }, {
                    _id: 0, // 测试结果序号
                    content: '姜青铜', // 测试结果描述
                    image: 'http://bbs.cguse.com/attachments/month_1004/1004241424c162021c314fa9c0.jpg', // 测试结果图片地址
                    name: '你是姜青铜', // 测试结果标题
                }
            ])
        })
    },

    computed: {
        // gameBase from state
        gameBase() {
            return this.$store.state.gameBase;
        },

        // 滚动区域的高度
        scrollH() {
            let scrollH = 0;
            this.curTab === 3 ? scrollH = 810 : scrollH = 700;
            return scrollH + 'px';
        }
    },

    methods: {
        /**
         * 切换tab选项
         * @param {Number} index tab索引
         */
        switchTab(index) {
            let _this = this;

            // 切换tab
            this.curTab = index;

            // 更新滚动样式
            this.$nextTick(() => {
               _this.updateScroll();
            });
        },

        // 更新滚动条
        updateScroll() {
            // 更新滚动条
            this.scrollbar.update();
        }
    },

    mounted() {
        let _this = this;
        this.$nextTick(() => {
            // 初始化滚动条
            _this.scrollbar = new GeminiScrollbar({
                element: document.querySelector('section'),
            }).create();

            // 更新样式
            _this.updateScroll();

        });
    },

    components: {
        vPhone,
        vGameask,
        vGamebase,
        vGameresult,
        vDialog,
        vDialogs
    }
}
</script>
<style lang="less" scoped>

    /* 颜色 按钮基本样式 */
    @themeColor: #ff981a;
    .btn-base {
        padding: 0;
        color: #fff;
        background: #ff981a;
        border: none;
        border-radius: 3px;
        outline: none;
    }

    /* 包裹外盒 */
    .box {
        width: 1000px;
        margin: 20px auto;
        padding: 39px 16px;
        border-radius: 5px;
        background: #fff;
        box-shadow: 0 1px 5px 0 rgba(0, 0, 0, .1);

        .content {
            display: flex;
            padding: 50px 0 0 0;
            border-top: 1px solid #D8D8D8;
            border-bottom: 1px solid #D8D8D8;
            font-size: 0;

            /* 手机预览 */
            .phone-wrap {
                width: 360px;
                padding-left: 41px;
                background: pink;
                height: 676px;
            }

            /* 问题设置 */
            .set-wrap {
                width: 608px;
                padding: 0 49px 0 67px;
                overflow: hidden;

                /* tab */
                .tabs {
                    height: 36px;
                    border-bottom: 1px solid #d8d8d8;

                    .tab {
                        display: inline-block;
                        width: 164px;
                        text-align: center;
                        font-size: 14px;
                        color: #999;
                        line-height: 34px;
                        cursor: default;

                        &.active {
                            color: #ff981a;
                            border-bottom: 2px solid #ff9819;
                        }
                    }
                }

                /* 滚动样式 */
                .scrollbar {
                    margin: 8px 0;
                }

                /* 设置外盒 */
                .sets {
                    text-align: left;
                }
            }
        }

        /* 按钮样式 */
        .btns {
            text-align: left;
            font-size: 14px;
            line-height: 40px;

            .btn {
                .btn-base;
                width: 120px;
                height: 40px;
                margin-top: 20px;
            }

            /* 下一步 */
            .next {
                .btn {
                    margin-left: 523px;
                }
            }

            /* 上一步 下一步 */
            .bridge {
                font-size: 0;

                .btn-prev {
                    margin-left: 427px;
                }

                .btn-next {
                    margin-left: 20px;
                    color: #ccc;
                    border: 1px solid #ccc;
                    background: #fff;
                }

            }

            /* 保存 */
            .save {
                margin-left: 446px;
            }
        }
    }
</style>



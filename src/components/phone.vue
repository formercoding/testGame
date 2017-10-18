<template>
  <div class="phone">
        <!-- 切换页面tab -->
        <ul class="nav">
            <li class="tab" :class="{active: curTab === 0}" @click="changeTab(0)">
                加载页
                <span class="arrow"></span>
            </li>
            <li class="tab" :class="{active: curTab === 1}" @click="changeTab(1)">
                首页
                <span class="arrow"></span>
            </li>
            <li class="tab" :class="{active: curTab === 3}" @click="changeTab(3)">
                问题页
                <span class="arrow"></span>
            </li>
            <li class="tab" :class="{active: curTab === 2}" @click="changeTab(2)">
                结果页
                <span class="arrow"></span>
            </li>
        </ul>

        <!-- 预览手机 -->
        <div class="show">
            <div class="show-inner" :style="imgBg(images.I002)">

                <!-- 加载页 -->
                <div class="loading" v-show="curTab === 0">
                    <img class="pic" :src="theme.images.I010">
                    <div class="close">3</div>
                </div>

                <!-- 游戏首页 -->
                <div v-bar class="intro-wrap" v-show="curTab === 1">
                    <div class="intro">

                        <!-- 音乐图标 -->
                        <div class="music-wrap flex">
                            <div class="music icon" :style="musicBg"></div>
                        </div>

                        <div class="banner-wrap">
                            <h1 class="title" :style="colorTitle" v-show="gameBase.title">{{gameBase.title}}</h1>
                            <img class="banner" :src="gameBase.image" v-show="gameBase.image">
                        </div>

                        <div class="desc">
                            <p class="title" :style="txtStyle">{{gameBase.title}}</p>

                            <div class="gif-wrap" :style="txtStyle" v-show="gameBase.title">
                                <img class="gif" :src="images.I007" :style="gifLeft" >
                            </div>

                            <p class="txt" :style="txtStyle">{{gameBase.description}}</p>
                        </div>

                        <div class="start-wrap">
                            <img class="start" :src="images.I004">
                        </div>
                    </div>
                </div>

                <!-- 游戏问答页 -->
                <div class="question flex-col"
                     v-show="curTab === 3">

                    <!-- 音乐图标 -->
                    <div class="music-wrap flex">
                        <div class="music icon" :style="musicBg"></div>
                    </div>

                    <div class="item-wrap" v-bar>
                        <div class="item">
                            
                            <!-- 题目描述 -->
                            <div class="desc">
                                <div class="txt">
                                    {{`Q${curQuestionIndex+1}、${curQuestion.question.name}`}}
                                </div>
                                <img class="pic" :src="curQuestion.question.image" v-show="curQuestion.question.image">
                            </div>

                            <!-- 问题选项 -->
                            <div class="opts">
                                <div class="opt flex" 
                                        v-for="(opt, index) in curQuestion.options" 
                                        :key="opt.name">
                                    <div class="handler flex-mid-center"
                                        :style="handlerBg">
                                        <div class="order">{{optOrder(index)}}</div>
                                    </div>
                                    <div class="txt">
                                        {{opt.name}}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="footer flex">
                        <img class="pic" :src="images.I006" :style="border">
                        <img class="gif" :src="images.I007" :style="gifLeft">
                    </div>
                </div>

                <div class="end-wrap" 
                        v-show="curTab === 2" 
                        v-bar>
                    <div class="end">

                        <div class="share">
                            <img class="pic" :src="supplierUrl">
                            <div class="txt flex-col">
                                <span class="txt-top">更多精彩</span>
                                <span class="txt-bot">长按二维码</span>
                            </div>
                        </div>

                        <div class="desc">
                            <div class="msg" :style="color(txtColor.T002)">结果为：</div>

                            <h1 class="title" :style="color(txtColor.T001)">{{curResult.name}}</h1>

                            <img class="pic" :src="curResult.image" v-show="curResult.image">

                            <div class="split" :style="bgColor(txtColor.T002)"></div>

                            <div class="txt" :style="color(txtColor.T002)">{{curResult.content}}</div>
                        </div>

                        <a class="restart-wrap flex" >
                            <img class="restart" :src="images.I008">
                        </a>
                    </div>
                </div>
            </div>
        </div>

        <!-- 模板预览 -->
        <div class="preview">
            <qrcode :value="eventUrl" :size="78" class="qrcode"></qrcode>
            <div class="txt">模板预览</div>
        </div>
  </div>
</template>

<script>
import qrcode from 'qrcode.vue' // 二维码组件

export default {
    props: {
        theme: Object,
        supplierUrl: String,
        eventUrl: String
    },

    computed: {
        // tab状态
        curTab() {
            return this.$store.state.tabState.curTab;
        },

        // 当前游戏问题
        curQuestion() {
            let _this = this,
                curQuestionIndex = _this.$store.state.tabState.curQuestionIndex;
            
            return _this.$store.state.gameQuestions[curQuestionIndex];
        },

        // 当前游戏问题索引
        curQuestionIndex() {
            return this.$store.state.tabState.curQuestionIndex;
        },

        // 当前游戏结果
        curResult() {
            let _this =this,
                curResultIndex = this.$store.state.tabState.curResultIndex;
            return this.$store.state.gameResults[curResultIndex];
        },

        // 主题图片
        images() {
            return this.theme.images;
        },

        // 主题颜色
        txtColor() {
            return this.theme.texts;
        },

        gameBase() {
            return this.$store.state.gameBase;
        },

        // 标题颜色
        colorTitle() {
            return {
                color: this.txtColor.T001
            }
        },

        // 文字颜色
        colorTxt() {
            return {
                color: this.txtColor.T002
            }
        },

        // 底部加文字颜色样式
        txtStyle() {
            let _this = this;

            return {
                color: _this.txtColor.T002,
                borderBottom: `1px dashed ${_this.txtColor.T004}`
            }
        },

        // 音乐背景
        musicBg() {
            let _this = this,
                images = _this.theme.images;

            return this.isPlay ? {backgroundImage: `url(${images.I001})`} : 
            {backgroundImage: `url(${images.I003})`};
        },

        // 底部虚线
        border() {
            return {
                borderBottom: `1px dashed ${this.txtColor.T004}`
            }
        },

        // 选项背景
        handlerBg() {
            let _this = this;

            return {
                backgroundImage: `url(${_this.images.I005})`,
                color: _this.txtColor.T003
            }
        },

        // 动画的left
        gifLeft() {
            let _this = this,
                len = _this.$store.state.gameQuestions.length,
                curQ = _this.$store.state.tabState.curQ,
                pageW = 205,
                gifW = 17;

            let left = parseInt(205 * (curQ / len));

            // 控制动画不超出边界
            left = pageW - left > 17 ? left : pageW - left;

            return {
                left: `${left}px`
            }
        }
    },

    methods: {
        /**
         * 背景颜色
         * @param {String} color 颜色值 
         */
        bgColor(color) {
            return {
                backgroundColor: color
            }
        },

        /**
         * 文字颜色
         * @param {String} color 颜色值 
         */
        color(color) {
            return {
                color
            }
        },

         /**
         * 返回选项对应的ABCD
         * @param {Number} index 选项序号 
         * @return {String} ABCD
         */
        optOrder(index) {
            let txt = ['A', 'B', 'C', 'D'];
            return txt[index];
        },

        /**
         * 切换预览页面
         * @param {Number} index 切换的tab索引
         */
        changeTab(index) {
            this.$store.commit('setCurTab', index);
        },

        /**
         * 返回图片背景
         * @param {String} url 图片地址
         */
        imgBg(url) {
            return {
                backgroundImage: `url(${url})`
            }
        }
    },

    components: {
        qrcode
    }
}
</script>

<style lang="less" scoped>
    /* 主题颜色 */
    @color: #FF981A;
    
    .phone {
        /* 切换预览页面tab */
        display: flex;
        justify-content: space-between;
        position: relative;

        .nav {
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 61px;
            height: 146px;
            margin-top: 61px;
            font-size: 12px;
            border: 1px solid #D8D8D8;
            cursor: pointer;

            .tab {
                flex-grow: 0;
                flex-basis: 25%;
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;
                height: 30px;
                width: 51px;
                font-size: 12px;
                color: #4C4C4C;
                border-bottom: 1px solid #F3F3F3;

                /* 小箭头 */
                .arrow {
                    display: none;
                    position: absolute;
                    top: 12px;
                    right: -15px;
                    width: 14px;
                    height: 12px;
                    background: #fff;

                    &:before {
                        content: '';
                        position: absolute;
                        right: 0;;
                        top: 6px;
                        width: 12px;
                        height: 1px;
                        background: #d8d8d8;
                        transform: rotate(-30deg);
                        transform-origin: 12px 0;
                    }

                    &:after {
                        content: '';
                        position: absolute;
                        right: 0;
                        top: 6px;
                        width: 12px;
                        height: 1px;
                        background: #d8d8d8;
                        transform: rotate(30deg);
                        transform-origin: 12px 0;
                    }
                }

                &.active {
                    color: @color;
                    border-bottom: 2px solid @color;

                    .arrow {
                        display: block;
                    }
                }

                &:last-child {
                    border-bottom: 0;
                }
            }
        }

        /* 小手机 */
        .show {
            width: 245px;
            height: 500px;
            padding: 97px 20px 71px 20px;
            background: url('http://idouziimg-10006892.image.myqcloud.com/20171012140040_16981');
            background-repeat: no-repeat;
            overflow: hidden;

            .show-inner {
                width: 205px;
                overflow: hidden;
                background-repeat: repeat;
                background-size: contain;
                border-top: none; 
             
                /* 加载页 */
                .loading {
                    position: relative;
                    z-index: 20;

                    .pic {
                        width: 205px;
                        height: 330px;
                        z-index: 100;
                    }

                    .close {
                        position: absolute;
                        right: 12px;
                        top: 12px;
                        width: 17px;
                        height: 17px;
                        text-align: center;
                        line-height: 16px;
                        font-size: 12px;
                        color: #fff;
                        border-radius: 50%;
                        background: rgba(0, 0, 0, .1);
                    }
                }

                .intro-wrap {
                    height: 330px;

                    /* 游戏首页 */
                    .intro {
                        position: relative;
                        padding: 43px 15px 0 15px;
                        overflow-x: hidden;
                        background-repeat: repeat;
                        background-size: contain;  

                        /* banner */
                        .banner-wrap {
                            font-size: 0;
                            
                            .title {
                                word-wrap: break-word;
                                word-break: break-all;
                                text-align: center;
                                font-size: 14px;
                            }

                            .banner {
                                display: block;
                                width: 174px;
                                height: 98px;
                                margin-top: 11px;
                            }
                        }

                        /* 游戏说明 */
                        .desc {
                            margin-top: 22px;
                            text-align: justify;
                            font-size: 12px;
                            line-height: 24px;

                            .title {
                                word-wrap: break-word;
                                word-break: break-all;
                                text-align: left;
                            }

                            .gif-wrap {
                                height: 18px;
                                text-align: left;
                                font-size: 0;

                                .gif {
                                    height: 18px;
                                }
                            }

                            .txt {
                                display: inline;
                                padding-bottom: 3px;
                                word-wrap: break-word;
                                word-break: break-all;
                            }
                        }

                        .start-wrap {
                            padding: 28px 0;
                            text-align: center;

                            .start {
                                width: 100px;
                                margin: 0 auto;
                            }
                        }
                    }
                }

                /* 问答页 */
                .question {
                    justify-content: space-between;
                    position: relative;
                    height: 330px;
                    text-align: left;
                    font-size: 12px;
                    line-height: 16px;
                    overflow-x: hidden;
                    background-repeat: repeat;
                    background-size: contain;

                    .item-wrap {
                        height: 219px;
                        margin-top: 33px;
                        transition: transform 0.2s linear;

                        .item {
                            padding: 0 20px 0 20px;
                            text-align: justify;
                            
                            /* 问题描述 */
                            .desc {
                                width: 165px;
                                padding-bottom: 4px;
                                word-wrap: break-word;
                                word-break: break-all;

                                .pic {
                                    display: block;
                                    width: 165px;
                                    height: 93px;
                                    margin-top: 4px;
                                    font-size: 0;
                                }
                            }

                            /* 问题选项 */
                            .opts {
                                width: 165px;
                                
                                .opt {
                                    align-items: center;
                                    margin-top: 8px;
                                    font-size: .36rem;

                                    .handler {
                                        flex-shrink: 0;
                                        display: flex;
                                        align-items: center;
                                        justify-content: center;
                                        width: 27px;
                                        height: 27px;
                                        font-size: 16px;
                                        background-size: contain;
                                        background-position: center center;
                                        background-repeat: no-repeat;
                                    }
                                }

                                .txt {
                                    word-wrap: break-word;
                                    word-break: break-all;
                                    margin-left: 8px;
                                    word-wrap: break-word;
                                    word-break: break-all;
                                }
                            }
                        }
                    }

                    /* 底部背景 */
                    .footer {
                        flex-shrink: 0;
                        align-items: bottom;
                        position: relative;
                        height: 27px;
                        padding-top: 22px;
                        padding-bottom: 45px;
                        overflow: hidden;

                        .pic {
                            width: 100%;
                        }

                        .gif {
                            position: absolute;
                            z-index: 5;
                            bottom: 45px;
                            width: 27px;
                            height: 27px;
                            transition: left linear 2s;
                        }
                    }
                }

                /* 结果页 */
                .end-wrap {
                    height: 330px;
                }
                
                .end {
                    height: 330px;

                    /* 分享二维码 */
                    .share {
                        display: flex;
                        align-items: center;
                        width: 205px;
                        height: 44px;
                        background: #000;
                        opacity: .8;

                        .pic {
                            width: 30px;
                            height: 30px;
                            background: #f0f0f0;
                            margin-left: 30px;
                            font-size: 0;
                        } 

                        .txt {
                            align-items: flex-start;
                            justify-content: space-between;
                            margin-left: 8px;
                            font-size: 12px;
                            color: #fff;
                            line-height: 16px;
                        }
                    }

                    /* 答案描述 */
                    .desc {
                        padding: 13px 0px 22px 20px;

                        .msg {
                            text-align: center;
                            font-size: 12px;
                            line-height: 12px;
                        }

                        .title {
                            margin-top: 9px;
                            text-align: center;
                            font-size: 16px;
                            line-height: 24px;
                            word-wrap: break-word;
                            word-break: break-all;
                        }

                        .pic {
                            display: block;
                            width: 166px;
                            height: 93px;
                            margin-top: 11px;
                            font-size: 0;
                        }
                        
                        .split {
                            width: 16px;
                            height: 3px;
                            margin-top: 11px;
                        }

                        .txt {
                            margin-top: 5px;
                            text-align: justify;
                            font-size: 12px;
                            line-height: 16px;
                            word-wrap: break-word;
                            word-break: break-all;
                        }
                    }

                    /* 重新测试 */
                    .restart-wrap {
                        justify-content: center;
                        padding-left: 20px;
                        padding-bottom: 43px;

                        .restart {
                            width: 98px;
                            height: 24px;
                        }
                    }
                }
            }
        }

        /* 模板预览 */
        .preview {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            position: absolute;
            top: 521px;
            right: 0;
            width: 244px;

            .txt {
                display: inline-block;
                margin-top: 8px;
                font-size: 12px;
                color: #999;
            }
        }
    }

    /* 游戏公共背景 音乐 */
    @keyframes rotate { /* 旋转动画 */
        from {transform: rotate(0);}
        to {transform: rotate(-360deg);}
    }

    .music-wrap {
        position: absolute;
        top: 12px;
        right: 12px;
        z-index: 10;
        justify-content: flex-end;
        
        .music {
            width: 18px;
            height: 18px;
            background-size: contain;
            background-repeat: no-repeat;
            animation: rotate 10s linear infinite;
        }
    }
</style>
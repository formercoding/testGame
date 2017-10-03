<template>
  <div class="phone">
        <!-- 切换页面tab -->
        <div class="nav">
            <div class="tab" :class="{active: curTab === 0}" @click="changeTab(0)">
                加载页
                <span class="arrow"></span>
            </div>
            <div class="tab" :class="{active: curTab === 1}" @click="changeTab(1)">
                首页
                <span class="arrow"></span>
            </div>
            <div class="tab" :class="{active: curTab === 2}" @click="changeTab(2)">
                问题页
                <span class="arrow"></span>
            </div>
            <div class="tab" :class="{active: curTab === 3}" @click="changeTab(3)">
                结果页
                <span class="arrow"></span>
            </div>
        </div>
        <!-- 预览手机 -->
        <div class="show" :style="imgBg('./static/phone.png')">
                <!-- 加载页 -->
                <div class="loading" v-show="curTab === 0">
                    <img class="pic" :src="theme.images.I010">
                    <div class="close">3</div>
                </div>
                <!-- 游戏首页 -->
                <div v-bar class="intro-wrap" v-show="curTab === 1">
                    <div class="intro" :style="imgBg(images.I002)">
                        <!-- 音乐图标 -->
                        <div class="music-wrap flex">
                            <audio ref="audio"
                                v-if="false"
                                :src="theme.sounds.S001" 
                                loop="loop"
                                autoplay="autoplay">
                                亲 您的浏览器不支持html5的audio标签
                            </audio>
                            <div class="music icon" :style="musicBg"></div>
                        </div>
                        <div class="banner-wrap">
                            <h1 class="title" :style="colorTitle">{{gameBase.name}}</h1>
                            <img class="banner" :src="gameBase.image || 'http://bbs.cguse.com/attachments/month_1004/1004241424c162021c314fa9c0.jpg'">
                        </div>
                        <div class="desc">
                            <p class="title" :style="txtStyle">你是西游记中的谁</p>
                            <div class="gif-wrap" :style="txtStyle">
                                <img class="gif" :src="images.I007">
                            </div>
                            <p class="txt" :style="txtStyle">{{gameBase.description}}</p>
                        </div>
                        <div class="start-wrap">
                            <audio  ref="audio" 
                                    v-if="false"
                                    :src="theme.sounds.S002">
                                    亲 您的浏览器不支持html5的audio标签
                            </audio>
                            <img class="start" :src="images.I004">
                        </div>
                    </div>
                </div>
                <!-- 游戏问答页 -->
                <div class="question flex-col"
                     v-show="curTab === 2" 
                     :style="imgBg(images.I002)">
                    <!-- 音乐图标 -->
                    <div class="music-wrap flex">
                        <audio ref="audio"
                            v-if="false"
                            :src="theme.sounds.S001" 
                            loop="loop"
                            autoplay="autoplay">
                            亲 您的浏览器不支持html5的audio标签
                        </audio>
                        <div class="music icon" :style="musicBg"></div>
                    </div>
                    <div class="item-wrap flex" v-bar>
                        <div class="item">
                            <!-- 题目描述 -->
                            <div class="desc">
                                <div class="txt">
                                    {{curQuestion.question.name}}
                                </div>
                                <img class="pic" :src="curQuestion.question.image">
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
                        <img class="gif" :src="images.I007">
                    </div>
                </div>
                <div class="end">

                </div>
        </div>
  </div>
</template>
<script>
export default {
    data() {
        return {
            curTab: 0, // 当前tab
            theme: { // 游戏主题
                images: {
                    I001: './static/播放-min.png', // 音乐背景
                    I002: './static/bg01-min.png', // 页面背景图片
                    I003: './static/停止播放-min.png', // 音乐关闭后背景图标
                    I004: './static/首页-btn.gif', // 开始测试按钮图片
                    I005: './static/U_option-min.png', // 选项背景
                    I006: './static/BG3-min.png', // 问答页底部背景
                    I007: './static/wwew.gif', // 进度gif
                    I008: './static/btn-min.png', // 重新测试图片
                    I009: './static/btn-active.png', // 选项被选中
                    I010: './static/loading.png' // 背景图
                },
                texts: {
                    color: {
                        T001: '#000', // 标题颜色
                        T002: '#000', // 内容颜色
                        T003: '#fff', // 问题选项颜色
                        T004: '#4A4A4a' // 底部虚线颜色
                    }
                }
            },
            curQuestion: {
                question: { // 问题文字描述
                    image: 'http://bbs.cguse.com/attachments/month_1004/1004241424c162021c314fa9c0.jpg', // 问题图片地址
                    name: '你还记得最后唐僧取得经书回程时，那只驼他们过河的乌龟为何会发怒吗？会发怒吗？发怒吗？怒吗？吗？', // 问题描述
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
                            type: 0,
                            issueOrResultId: 0
                        }
                    }, {
                        name: '不傻哦', // 答案文字描述
                        target: {
                            type: 1,
                            issueOrResultId: 1
                        }
                    }, {
                        name: '不傻哦', // 答案文字描述
                        target: {
                            type: 1,
                            issueOrResultId: 0
                        }
                    }
                ] 
            }
        }
    },

    computed: {
        // 主题图片
        images() {
            return this.theme.images;
        },

        // 主题颜色
        txtColor() {
            return this.theme.texts.color;
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
            return {
                color: this.txtColor.T002,
                borderBottom: `1px dashed ${this.txtColor.T004}`
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
            return {
                backgroundImage: `url(${this.images.I005})`,
                color: this.txtColor.T003
            }
        }
    },

    methods: {

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
            this.curTab = index;
        },

        /**@argument
         * 返回图片背景
         * @param {String} url 图片地址
         */
        imgBg(url) {
            return {
                backgroundImage: `url(${url})`
            }
        }
    }
}
</script>
<style lang="less" scoped>
    .phone {
        /* 切换预览页面tab */
        display: flex;
        justify-content: space-between;

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
                flex-grow: 1;
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
                    right: -16px;
                    width: 17px;
                    height: 12px;
                    background: #fff;

                    &:before {
                        content: '';
                        position: absolute;
                        right: 0;;
                        top: 9px;
                        width: 12px;
                        height: 1px;
                        background: #d8d8d8;
                        transform: rotate(-30deg);
                    }

                    &:after {
                        content: '';
                        position: absolute;
                        right: 0;;
                        top: 3px;
                        width: 12px;
                        height: 1px;
                        background: #d8d8d8;
                        transform: rotate(30deg);
                    }
                }

                &.active {
                    color: #FF981A;
                    border-bottom: 2px solid #FF981A;

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
            width: 244px;
            height: 500px;
            padding: 96px 20px 71px 20px;
            background-repeat: no-repeat;
            overflow: hidden;

            /* 加载页 */
            .loading {
                position: relative;
                z-index: 20;

                .pic {
                    width: 100%;
                    height: 100%;
                    z-index: 100;
                }

                .close {
                    position: absolute;
                    right: 12px;
                    top: 12px;
                    width: 17px;
                    height: 17px;
                    text-align: center;
                    line-height: 18px;
                    font-size: 12px;
                    color: #fff;
                    border-radius: 50%;
                    background: rgba(0, 0, 0, .1);
                }
            }
            /* 游戏首页 */
            .intro {
                position: relative;
                width: 188px !important;
                height: 285px !important;
                padding: 43px 15px 0 15px;
                overflow-x: hidden;
                background-repeat: repeat;
                background-size: contain;  

                /* banner */
                .banner-wrap {
                    padding: 0 0 44px 0;
                    font-size: 0;
                    
                    .title {
                        font-size: 15px;
                    }

                    .banner {
                        display: block;
                        width: 100%;
                        margin-top: 22px;
                    }
                }

                /* 游戏说明 */
                .desc {
                    text-align: justify;
                    font-size: 12px;
                    line-height: 24px;

                    .title {
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
                    }
                }

                .start-wrap {
                    padding: 28px 0;
                    text-align: center;

                    .start {
                        width: 100px;
                    }
                }
            }

            /* 问答页 */
            .question {
                justify-content: space-between;
                height: 100%;
                text-align: left;
                font-size: 12px;
                line-height: 17px;
                overflow-x: hidden;
                background-repeat: no-repeat;

                .item-wrap {
                    margin-top: 33px;
                    transition: transform 0.2s linear;

                    .item {
                        width: 100%;
                        padding: 0 20px 0 20px;
                        
                        /* 问题描述 */
                        .desc {
                            padding-bottom: 4px;

                            .pic {
                                display: block;
                                width: 100%;
                                margin-top: 4px;
                                font-size: 0;
                            }
                        }

                        /* 问题选项 */
                        .opts {
                            .opt {
                                align-items: center;
                                margin-top: 8px;
                                font-size: .36rem;

                                .handler {
                                    width: 27px;
                                    height: 27px;
                                    font-size: 17px;
                                    background-size: contain;
                                    background-position: center center;
                                    background-repeat: no-repeat;
                                }
                            }

                            .txt {
                                margin-left: 8px;
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
                    margin: 10px 0 44px 0;
                    overflow: hidden;

                    .pic {
                        width: 100%;
                    }

                    .gif {
                        position: absolute;
                        left: 27px;
                        bottom: 0;
                        width: 27px;
                        height: 27px;
                    }
                }
            }
        }
    }
    /* 游戏公共背景 音乐 */
    @keyframes rotate { /* 旋转动画 */
        from {transform:rotate(0);}
        to {transform: rotate(-360deg);}
    }
    .music-wrap {
        position: absolute;
        top: 12px;
        right: 12px;
        z-index: 10;
        justify-content: flex-end;
        
        .music {
            width: 17px;
            height: 17px;
            background-size: contain;
            animation: rotate 10s linear infinite;
        }
    }

</style>


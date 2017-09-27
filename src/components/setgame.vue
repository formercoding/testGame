<template>
    <div class="setgame">
        <div class="top">
            <span class="level-1">新建运营套餐 &gt; </span>
            <span class="level-2">新建问答</span>
        </div>
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
                    <div v-bar id="scrollEle"
                            class="scrollbar"
                            ref="scrollbar">
                        <div class="sets" :style="{height: scrollH}">
                            <v-gamebase v-show="curTab === 1" 
                                        :validateKey.sync="validateKey"></v-gamebase>
                            <v-gameresult v-show="curTab === 2"></v-gameresult>
                            <v-gameask v-show="curTab === 3"></v-gameask>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 按钮切换tab模块 -->
            <div class="btns">
                <div class="left" v-show="curTab === 1">
                    <button class="btn" 
                            type="button" 
                            @click="submit">提交</button>
                    <button class="btn" 
                            type="button" 
                            @click="switchTab(2)">下一步</button>
                </div>
                <div class="left" v-show="curTab === 2">
                    <button class="btn" 
                            type="button" 
                            @click="switchTab(1)">上一步</button>
                    <button class="btn" 
                            type="button" 
                            @click="switchTab(3)">下一步</button>
                </div>
                <div class="left" v-show="curTab === 3">
                    <button class="btn" 
                            type="button" 
                            @click="switchTab(2)">上一步</button>
                    <button class="btn" 
                            type="button" 
                            @click="submit">提交</button>
                </div>
                <div class="right">
                    <button class="btn" 
                            type="button" 
                            @click="confirmDefault">恢复默认设置</button>
                </div>
            </div>
            <!-- 提示弹出框 恢复默认设置 -->
            <v-tipDialog 
                :isOpen.sync="isSetOpen" 
                @confirm="setDefault"
                title="恢复默认" 
                :txt="tipSetTxt">
            </v-tipDialog>
            <!-- 提示弹出框 表单未通过校验 -->
            <v-tipDialog 
                :isOpen.sync="isValidateOpen" 
                :single="true"
                title="提示"
                :txt="tipValidateTxt">
            </v-tipDialog>
            <el-dialog
                title="分享链接"
                :visible.sync="isPurchaseOpen"
                :modal-append-to-body="false"
                :before-close="closePurchaseDialog"
                class="before-purchase"
                size="tiny">
                    <div class="contents">
                        <div class="title">
                            <span class="tip">你离刷爆朋友圈就差最后一步</span>
                        </div>
                        <div class="pics">
                            <div class="left-pic">
                                <div class="txt">套餐购买</div>
                                <div class="qrcode">
                                    <v-qrcode :value="purchaseUrl" size="130"></v-qrcode>
                                </div>
                                <div class="pic-bottom">
                                    <div class="spans">
                                        <span>套餐价格：</span>
                                        <span class="cash">￥300</span>
                                    </div>
                                    <div class="spans">
                                        <span>使用期限：</span>
                                        <span>一个月</span>
                                    </div>
                                    <div class="spans">
                                        <span>套餐名称：</span>
                                        <span>西游记问答测试</span>
                                    </div>
                                </div>
                            </div>
                            <div class="right-pic">
                                <div class="txt">发布预览</div>
                                <div class="qrcode">
                                    <v-qrcode :value="previewUrl" size="130"></v-qrcode>
                                </div>
                                <div class="pic-bottom">
                                    <div class="spans">
                                        <span>试用倒计时：</span>
                                        <span class="rest-time">{{restTime}}</span>
                                    </div>
                                    <div class="time-tip">
                                        本链接预览在30分钟后失效
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
            </el-dialog>
        </div>
    </div>
</template>
<script>
// 子组件
import vGamebase from './gamebase'
import vGameask from './gameask'
import vGameresult from './gameresult'
import vPhone from './phone'
import vTipDialog from './tipdialog'
import vQrcode from 'qrcode.vue'
export default {
    data() {
        return {
            curTab: 1, // 当前tab 1基础设置 2测试结果设置 3问题设置
            validateKey: true, // 关键词验证是否通过
            tipValidateTxt: '游戏设置有误，请重新设置', // 表单验证提示文字类型
            tipSetTxt: '确认恢复全部默认设置吗?',  // 恢复默认设置提示文字类型
            isSetOpen: false, // 恢复默认设置弹出是否显示
            isValidateOpen: false, // 表单验证弹窗是否显示
            isPurchaseOpen: false, // 预览的链接弹窗
            restTime: '23:05:36', // 试用剩余时间
            purchaseUrl: 'www.idouzzi.com', // 购买链接
            previewUrl: 'www.idouzi.com' // 预览链接
        }
    },

    created() {
        // eventId
        console.log(this.$route.params.eventId)

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
                                type: -1,
                                issueOrResultId: -1
                            }
                        }, {
                            name: '不傻', // 答案文字描述
                            target: {
                                type: -1,
                                issueOrResultId: -1
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
                                type: -1,
                                issueOrResultId: -1
                            }
                        }, {
                            name: '不傻哦', // 答案文字描述
                            target: {
                                type: -1,
                                issueOrResultId: -1
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
            ]);

            // 存储默认值
            let state = _this.$store.state,
                gameBase = _this.cloneObj(_this.$store.state.gameBase),
                gameQuestions = _this.cloneObj(_this.$store.state.gameQuestions),
                gameResults = _this.cloneObj(_this.$store.state.gameResults);
            _this.$store.commit('setGameBaseDefault', gameBase)
            _this.$store.commit('setGameQuestionsDefault', gameQuestions);
            _this.$store.commit('setGameResultsDefault', gameResults);


            // 查找是否存在用户cookie 有则设置为cookie
            let cookie = document.cookie,
                userId = 'userId',
                cookieArr = cookie.split('; ');

                cookieArr.forEach((item) => {
                    let arr = item.split('='),
                        name = arr[0];

                    if(userId + 'gameBase' === name) {
                        _this.$store.commit('setGameBase', JSON.parse(unescape(arr[1])));
                    }

                    if(userId + 'gameQuestions' === name) {
                        _this.$store.commit('setGameQuestions', JSON.parse(unescape(arr[1])));
                    }

                    if(userId + 'gameResults' === name) {
                        _this.$store.commit('setGameResults', JSON.parse(unescape(arr[1])));
                    }

                })
        })
    },

    computed: {
        // 计算游戏基础设置状态
        gameBase() {
            return this.$store.state.gameBase;
        },

        // 计算游戏问答状态
        gameQuestions() {
            return this.$store.state.gameQuestions;
        },

        // 计算游戏结果状态
        gameResults() {
            return this.$store.state.gameResults;
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
         * 深拷贝
         * @param {Object || Array} obj 拷贝对象或数组
         * @return {Object || Array} newobj 拷贝对象或数组
         */
        cloneObj(obj){
            let str, 
                newobj = obj.constructor === Array ? [] : {};

            if(typeof obj !== 'object'){
                return;
            } else if(window.JSON){
                str = JSON.stringify(obj), //系列化对象
                newobj = JSON.parse(str); //还原
            } else {
                for(var i in obj){
                    newobj[i] = typeof obj[i] === 'object' ? 
                    cloneObj(obj[i]) : obj[i]; 
                }
            }
            
            return newobj;
        },


        /**
         * 切换tab选项
         * @param {Number} index tab索引
         */
        switchTab(index) {
            // 切换tab
            this.curTab = index;
        },

        submit() {
            let _this = this;

            // 其次对游戏逻辑进行校验
            if(!_this.normalValidate()) {
                _this.isValidateOpen = true;
                return false;
            }

            // 是否为试用用户判断
            if(true) {
                _this.isPurchaseOpen = true;
                return true;
            }
            
            _this.$http('url', {});

        },

        // 弹出确认恢复默认设置弹出
        confirmDefault() { 
            let _this = this;

            _this.isSetOpen = true;
        },

        // 关闭试用弹窗
        closePurchaseDialog() {
            this.isPurchaseOpen = false;
        },

        // 恢复默认值
        setDefault() {
            let _this = this,
                state = _this.$store.state,
                gameBase = _this.cloneObj(_this.$store.state.gameBaseDefault),
                gameQuestions = _this.cloneObj(_this.$store.state.gameQuestionsDefault),
                gameResults = _this.cloneObj(_this.$store.state.gameResultsDefault);
            _this.$store.commit('setGameBase', gameBase)
            _this.$store.commit('setGameQuestions', gameQuestions);
            _this.$store.commit('setGameResults', gameResults);
        },

        /**
         * 游戏的普通校验
         * 包括关键词 必填项目及字段长度限制
         * @return {Boolean} 校验是否通过
         */
        normalValidate() {
            let _this = this,
                gameBase = _this.gameBase,
                gameQuestions = _this.gameQuestions,
                gameResults = _this.gameResults;
            
            // 校验关键词
            if(!_this.validateKey) {
                _this.tipValidateTxt = '游戏关键词设置错误';
                return false;
            }

            // 游戏基础设置校验
            for(let key in gameBase) {
                switch (key) {
                    case 'name': {
                        if(gameBase[key].lenth > 12 || gameBase[key].trim() === '') {
                            _this.tipValidateTxt = '游戏名称填写错误';
                            return false;
                        }
                    }
                    case 'keyword': {
                        if(gameBase[key].lenth > 20 || gameBase[key].trim() === '') {
                            _this.tipValidateTxt = '游戏关键词设置错误';
                            return false;
                        }
                    }
                    case 'description': {
                        if(gameBase[key].lenth > 500 || gameBase[key].trim() === '') {
                            _this.tipValidateTxt = '游戏描述填写错误';
                            return false;
                        }
                    }
                }
            }

            let validate = true;
            // 游戏问答校验
            gameQuestions.every((gameQuestion) => {
                
                for(let key in gameQuestion) {
                    switch (key) {
                        case 'question': {
                            let question = gameQuestion[key];

                            if(question.name.length > 38 || question.name.trim() === '') {
                                validate = false;
                            }
                            break;
                        }
                        case 'options': {
                            let options = gameQuestion[key];

                            options.forEach((item) => {
                                if(item.name.length > 20 || item.name.trim() === '') {
                                    validate = false;
                                }

                                let target = item.target;
                                if(target.type === -1 || target.issueOrResultId === -1) {
                                    validate = false;
                                }
                            });
                            break;
                        }
                    }
                }

                // 跳出循环
                if(!validate) {
                    _this.tipValidateTxt = '游戏问题填写错误';
                    return false;
                }
            })

            // 终止函数
            if(!validate) {
                return false;
            }

            // 游戏答案校验
            gameResults.every((gameResult) => {
                let validate = true;

                for(let key in gameResult) {
                    switch (key) {
                        case 'name': {
                            let name = gameResult[key];
                            if(name.length > 10 || name.trim() === '') {
                                validate = false;
                            }
                            break;
                        }
                        case 'content': {
                            let content = name = gameResult[key];
                            if(content.length > 10 || content.trim() === '') {
                                validate = false;
                            }
                            break;
                        }
                    }
                }

                // 跳出循环
                if(!validate) {
                     _this.tipValidateTxt = '游戏结果设置有误';
                    return false;
                }
            });

            // 终止函数
            if(!validate) {
                return false;
            }

            return true;
        }
    },

    mounted() {
    },

    watch: {
        gameBase: {
            
            handler() {
                let date = new Date(),
                    key = 'userId' + 'gameBase';
                    
                // COOKIE保存时间 两天
                date.setTime(date.getTime() + 48*3600*1000);
                // 设置cookie cookie不允许带：； = 等  用escape处理
                document.cookie = key + '=' + escape(JSON.stringify(this.gameBase)) + "; expires=" + date.toGMTString();
            },
            deep: true
        },
        gameQuestions: {
            handler() {
                let date = new Date(),
                    key = 'userId' + 'gameQuestions';
                    
                // COOKIE保存时间 两天
                date.setTime(date.getTime() + 48*3600*1000);
                // 设置cookie cookie不允许带：； = 等  用escape处理
                document.cookie = key + '=' + escape(JSON.stringify(this.gameQuestions)) + "; expires=" + date.toGMTString();
            },
            deep: true
        },
        gameResults: {
            handler() {
                let date = new Date(),
                    key = 'userId' + 'gameResults';
                    
                // COOKIE保存时间 两天
                date.setTime(date.getTime() + 48*3600*1000);
                // 设置cookie cookie不允许带：； = 等  用escape处理
                document.cookie = key + '=' + escape(JSON.stringify(this.gameResults)) + "; expires=" + date.toGMTString();
            },
            deep: true
        }
    },

    components: {
        vPhone,
        vGameask,
        vGamebase,
        vGameresult,
        vTipDialog,
        vQrcode
    }
}
</script>
<style lang="less">

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

    .setgame {
        width: 1000px;
        margin: 0 auto;

        .top {
            text-align:left;
            font-size: 16px;
            color: #666;
            cursor: default;
            
            .level-1 {
                font-size: 16px;
                color: #FF981A;
            }
            
            .level-2 {
                font-size: 16px;
                color: #FF981A;
            }
        }

        /* 包裹外盒 */
        .box {
            margin-top: 16px;
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
                        font-size: 0;
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
                display: flex;
                justify-content: flex-end;
                font-size: 14px;
                line-height: 40px;

                .btn {
                    .btn-base;
                    width: 120px;
                    height: 40px;
                    margin-top: 20px;
                }

                .left {
                    width: 265px;
                    margin-right: 120px;
                    font-size: 0;

                    .btn {
                        font-size: 14px;

                        &:first-child {
                            margin-right: 20px;
                        }
                    }
                }

                .right {
                    width: 200px;

                    .btn {
                        height: 38px;
                        margin: 21px 0 0 0;
                        color: #FFC44E;
                        border: 1px solid #FFC44E;
                        background: #fff;
                    }
                }
                

            }

            /* 试用提示框 */
            .before-purchase {
                .el-dialog {
                    width: 600px;
                    font-size: 14px;
                    line-height: 20px;

                    .el-dialog__header {
                        width: 600px;
                        padding: 10px 20px;
                        background: #F8F8F8;
                        border-radius: 5px 5px 0 0;
                        box-shadow: inset 0 -1px 0 0 #E6E6E6;
                    }

                    .el-dialog__body {
                        padding: 28px 90px 57px 90px;
                        text-align: left;
                        color: #1A1A1A;

                        .contents {
                            display: flex;
                            flex-flow: column;

                            .title {
                                display: flex;
                                justify-content: center;
                                font-size: 28px;
                                line-height: 40px;

                                .tip {
                                    color: #1A1A1A;
                                }
                            }

                            .pics {
                                display: flex;
                                justify-content: space-between;
                                width: 100%;

                                .left-pic, .right-pic {
                                    text-align: center;
                                    font-size: 0;
                                    
                                    .txt {
                                        width: 130px;
                                        text-align: center;
                                        margin-top: 30px;
                                        font-size: 14px;
                                        color: #222;
                                    }

                                    .qrcode {
                                        margin-top: 10px;
                                        text-align: left;
                                    }

                                    .pic-bottom {
                                        margin-top: 10px;
                                        text-align: left;
                                        line-height: 28px;
                                        font-size: 14px;
                                        color: #666;

                                        .rest-time, .cash {
                                            color: #FF981A;
                                        }

                                        .time-tip {
                                            margin-left: -20px;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
</style>



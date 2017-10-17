<template>
    <div class="setgame">
        <!-- 顶部信息 -->
        <div class="top">
            <a class="level-1" :href="listLink">活动运营套餐列表 &gt; </a>
            <span class="level-2">新建问答测试</span>
        </div>
        <div class="box">
            <div class="content">

                <!-- 手机预览组件 -->
                <div class="phone-wrap">
                    <v-phone :theme="theme" :supplierUrl="supplierUrl" :eventUrl="eventUrl"></v-phone>
                </div>

                <!-- 游戏设置模块 -->
                <div class="set-wrap">
                    <ul class="tabs">
                        <li class="tab" 
                            :class="{active: curTab === 1 || curTab === 0}"
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
                        <div class="sets" :style="{maxHeight: scrollH, minHeight: scrollH}">

                            <!-- 游戏基础设置 -->
                            <v-gamebase v-show="showBase"
                                        :validateKey.sync="validateKey"></v-gamebase>
                            
                            <!-- 游戏问题设置 -->
                            <v-gameresult v-show="curTab === 2"></v-gameresult>

                            <!-- 游戏结果设置 -->
                            <v-gameask v-show="curTab === 3"></v-gameask>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 按钮切换tab模块 -->
            <div class="btns">

                <!-- 基础设置时显示 -->
                <div class="left" v-show="curTab === 1 || curTab === 0">
                    <button class="btn" 
                            type="button" 
                            @click="submit">提交</button>
                    <button class="btn" 
                            type="button" 
                            @click="switchTab(2)">下一步</button>
                </div>

                <!-- 结果设置时显示 -->
                <div class="left" v-show="curTab === 2">
                    <button class="btn" 
                            type="button" 
                            @click="switchTab(1)">上一步</button>
                    <button class="btn" 
                            type="button" 
                            @click="switchTab(3)">下一步</button>
                </div>

                <!-- 问题设置时显示 -->
                <div class="left" v-show="curTab === 3">
                    <button class="btn" 
                            type="button" 
                            @click="switchTab(2)">上一步</button>
                    <button class="btn" 
                            type="button" 
                            @click="submit">提交</button>
                </div>

                <!-- 恢复默认设置 -->
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

            <!-- 试用用户弹出 -->
            <el-dialog
                title="分享链接"
                :visible.sync="isPurchaseOpen"
                :modal-append-to-body="false"
                :before-close="closePurchaseDialog"
                class="before-purchase"
                size="tiny">

                    <!-- 分享内容 -->
                    <div class="contents">
                        <div class="title">
                            <span class="tip">你离刷爆朋友圈就差最后一步</span>
                        </div>
                        <div class="pics">
                            <div class="left-pic">
                                <div class="txt">套餐购买</div>
                                <div class="qrcode">
                                    <v-qrcode :value="isBuy.purchaseUrl" size="130"></v-qrcode>
                                </div>
                                <div class="pic-bottom">
                                    <div class="spans">
                                        <span>套餐价格：</span>
                                        <span class="cash">￥{{isBuy.total_fee}}</span>
                                    </div>
                                    <div class="spans">
                                        <span>使用期限：</span>
                                        <span>{{isBuy.effectiveTime}}个月</span>
                                    </div>
                                    <div class="spans">
                                        <span>套餐名称：</span>
                                        <span>{{isBuy.goodsName}}</span>
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
                                        <span class="rest-time">{{restTimeFormat}}</span>
                                    </div>
                                    <div class="time-tip">
                                        本预览链接在30分钟后失效
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

import Idouzi from '@idouzi/idouzi-tools'
import Tool from './../pages/index/assets/js/common.js'
import { Loading } from 'element-ui';
import qs from 'qs'
export default {
    data() {
        let eventId = Idouzi.getQueryValue('eventId'),
            themeId = Idouzi.getQueryValue('themeId');

        let validateKey = false;
        // 编辑活动进来的关键词校验为正确 
        if(eventId) {
            validateKey = true;
        }

        return {
            listLink: `index?themeId=${themeId}`,
            supplierUrl:  '', // 商家二维码预览链接
            eventUrl: '', // 模板二维码预览链接
            ajaxUrl: {
                getCreate: Tool.editUrl('/supplier/get-create-event-data'), // 新建获取数据接口
                getEdit: Tool.editUrl('/supplier/get-edit-event-data'), // 编辑获取数据接口
                paymentStatus: Tool.editUrl('/supplier/get-edit-event-data'), // 获取订单是否支付信息
                saveEdit: Tool.editUrl('/supplier/save-edit-event-data'), // 保存编辑数据
                saveCreate: Tool.editUrl('/supplier/save-create-event-data') // 保存新建数据
            },
            gameBaseDefault: {}, // 默认游戏基础设置
            gameQuestionsDefault: [], // 默认游戏问答设置
            gameResultsDefault: [], // 默认游戏结果设置
            validateKey: validateKey, // 关键词验证是否通过
            tipValidateTxt: '游戏设置有误，请重新设置', // 表单验证提示文字类型
            tipSetTxt: '确认恢复全部默认设置吗?',  // 恢复默认设置提示文字类型
            isSetOpen: false, // 恢复默认设置弹出是否显示
            isValidateOpen: false, // 表单验证弹窗是否显示
            isPurchaseOpen: false, // 预览的链接弹窗
            previewUrl: 'www.idouzi.com', // 预览链接
            buyStartTime: '', // 购买链接生成时间
            isBuy: {
                purchaseUrl: '', // 购买链接
                preview_url: '', // 预览链接
                effectiveTime: 1, // 活动有效时间 单位月
                restTime: 0, // 此次预览剩余时间
                total_fee: 0, // 套餐费用
                oid: '', // 订单ID 二维码的订单信息查询
                goodsName: '' // 商品名称
            }, 
            theme: { // 游戏主题
                images: {
                    I001: '', // 音乐背景
                    I002: '', // 页面背景图片
                    I003: '', // 音乐关闭后背景图标
                    I004: '', // 开始测试按钮图片
                    I005: '', // 选项背景
                    I006: '', // 问答页底部背景
                    I007: '', // 进度gif
                    I008: '', // 重新测试图片
                    I009: '', // 选项被选中
                    I010: '' // 背景图
                },
                texts: {
                    T001: '', // 标题颜色
                    T002: '', // 内容颜色
                    T003: '', // 问题选项颜色
                    T004: '' // 底部虚线颜色
                }
            }
        }
    },

    created() {
        let _this = this;

        // 游戏数据请求
        _this.getData();
    },

    computed: {
        // 基础设置的显示
        showBase() {
            if(this.curTab === 1 || this.curTab === 0) {
                return true;
            } else {
                return false;
            }
        },

        // tab状态
        curTab() {
            let curTab = this.$store.state.tabState.curTab;
            if(curTab) {
                
            }
            return this.$store.state.tabState.curTab;
        },

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
            this.curTab === 3 ? scrollH = 750 : scrollH = 700;
            return scrollH + 'px';
        },

        // 倒计时时间格式
        restTimeFormat() {
            let time = this.isBuy.restTime;

            //换算成秒 小数点向下舍入取整
            let second = Math.floor(time / 1000) % 60;

            //换算成分钟取去掉小时的余数（也就是分钟） 小数点向下舍入取整
            let minute = Math.floor(time / 1000 / 60) % 60;

            return `${minute}分${second}秒`;
        }
    },

    methods: {
        // 购买弹窗倒计时
        setTime() {
            let _this = this;

            // 随着弹窗退出计时
            if(!_this.isPurchaseOpen) {
                return false;
            }

            // 超过30分钟及时计时结束
            if(_this.isBuy.restTime === 0) {
                return false;
            }
            
            let timer = setTimeout(() => {
                
                _this.isBuy.restTime = _this.isBuy.restTime - 1000;
                _this.setTime();
                clearTimeout(timer);
                
            }, 1000);
        },
        /**
         * 游戏数据请求
         */
        getData() {
            let _this = this,
                from = Idouzi.getQueryValue('from'),
                eventId = Idouzi.getQueryValue('eventId'),
                themeId = Idouzi.getQueryValue('themeId');
            
            // 加载条
            let loading = Loading.service({fullscreen: true});

             // 来自新建
            if(from === 'create') {
                _this.$http({
                    url: _this.ajaxUrl.getCreate,
                    method: 'post',
                    params: {
                        themeId: themeId
                    }
                }).then((res) => {
                    let data = res.data;
                    
                    // 如果请求成功
                    if(data.return_code === 'SUCCESS') {
                        let msg = data.return_msg,
                            store = _this.$store;

                        if(_this.isBuy === false) {
                            _this.$message('您尚未购买此次活动');
                        }

                        // 二维码 商家 模板
                        _this.supplierUrl = msg.supplierUrl;
                        _this.eventUrl = msg.eventUrl;

                        // 关键字
                        if(!msg.gameBase.keyword) {
                            msg.gameBase.keyword = '';
                        }

                        // 存储默认数据 当点击恢复默认设置的时候替换
                        _this.gameBaseDefault = _this.cloneObj(msg.gameBase),
                        _this.gameQuestionsDefault = _this.cloneObj(msg.gameQuestions),
                        _this.gameResultsDefault = _this.cloneObj(msg.gameResults);

                        
                        let sessionFlag = false; // sessionStorge是否可用
                        if(sessionStorage.gameBase && sessionStorage.gameQuestions && sessionStorage.gameResults) {
                            let gameBase = JSON.parse(unescape(sessionStorage.gameBase)),
                                gameQuestions = JSON.parse(unescape(sessionStorage.gameQuestions)),
                                gameResults = JSON.parse(unescape(sessionStorage.gameResults));
                                
                            if(gameQuestions.length > 1 && gameResults.length > 1) {
                                sessionFlag = true;
                                // 从localStorge中获取设置
                                store.commit('setGameBase', gameBase);
                                store.commit('setGameQuestions', gameQuestions);
                                store.commit('setGameResults', gameResults);
                            }
                        }

                        // 游戏主题设置 小手机预览使用
                        _this.theme = msg.theme;

                        // 如果没有sessionStorge则将接口默认数据作为初始化数据
                        if(!sessionFlag) {

                            store.commit('setGameBase', msg.gameBase);
                            
                            // 游戏问题设置
                            store.commit('setGameQuestions', msg.gameQuestions);

                            // 游戏结果设置
                            store.commit('setGameResults', msg.gameResults);
                        }

                    // 获取数据的返回值不等于success
                    } else {
                        _this.$message({
                            message: data.return_msg,
                            duration: 2000
                        });
                    }

                    // 请求结束关闭加载条
                    loading.close();

                // 请求出现网络错误 或 请求错误   
                }).catch((error) => {

                    // 网络错误
                    if(error.response) {
                        _this.$message({
                            message: error.response.status + ':网络错误，请刷新重试',
                            duration: 2000
                        });

                    // 请求错误
                    } else { 
                        _this.$message({
                            message: '请求错误，请刷新重试',
                            duration: 2000
                        });
                    }

                    // 请求结束关闭加载条
                    loading.close();
                });

            // 来自编辑
            } else if(from === 'edit') {

                _this.$http({
                    url: _this.ajaxUrl.getEdit,
                    method: 'post',
                    params: {
                        eventId: eventId, // 编辑时需要带上活动ID
                        themeId: themeId
                    }
                }).then((res) => {
                    let data = res.data;

                    // 如果请求成功
                    if(res.data.return_code === 'SUCCESS') {
                        let msg = data.return_msg,
                            store = _this.$store;

                        // 二维码 商家 模板
                        _this.supplierUrl = msg.supplierUrl;
                        _this.eventUrl = msg.eventUrl;

                        // 关键字
                        if(!msg.gameDefault.gameBase.keyword) {
                            msg.gameDefault.gameBase.keyword = '';
                        }
                        
                        // 存储默认数据 用以恢复默认设置 
                        // 编辑则默认数据来自gameDefault
                        let gameDefault = msg.gameDefault;

                        _this.gameBaseDefault = _this.cloneObj(gameDefault.gameBase),
                        _this.gameQuestionsDefault = _this.cloneObj(gameDefault.gameQuestions),
                        _this.gameResultsDefault = _this.cloneObj(gameDefault.gameResults);
                        
                        // 游戏基础设置
                        store.commit('setGameBase', msg.gameBase);

                        // 游戏问题设置
                        store.commit('setGameQuestions', msg.gameQuestions);

                        // 游戏结果设置
                        store.commit('setGameResults', msg.gameResults);

                        // 游戏主题设置
                        _this.theme = msg.theme;

                    // 请求返回值不为success
                    } else {
                        _this.$message({
                            message: data.return_msg,
                            duration: 2000
                        });
                    }

                    // 请求结束关闭加载条
                    loading.close();

                // 请求出现网络错误 或 请求错误
                }).catch((error) => {

                    // 网络错误
                    if(error.response) {
                        _this.$message({
                            message: error.response.status + ':网络错误，请刷新重试',
                            duration: 2000
                        });

                    // 请求错误
                    } else { 
                        _this.$message({
                            message: '请求错误，请刷新重试',
                            duration: 2000
                        });
                    }

                    // 请求结束关闭加载条
                    loading.close();
                });
            }
        },

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
            this.$store.commit('setCurTab', index);
        },

        // 对订单进行轮询 获取订单是否支付
        getPayStatus() {
            let _this = this,
                themeId = Idouzi.getQueryValue('themeId'),
                from = Idouzi.getQueryValue('from');

            // 如果弹窗关闭 则终止轮询
            if(!_this.isPurchaseOpen) {
                return false;
            }

            // 支付超时 购买二维码出现时间超过30分钟
            if(_this.buyStartTime + 30 * 60 * 1000 < (new Date().getTime())) {

                // 显示超时 关闭弹窗 退出函数
                _this.$message('支付超时');
                _this.isPurchaseOpen = false;
                return false;
            }

            let time = setTimeout(()=>{

                // 轮询请求获取订单支付状态
                _this.$http({
                    url: _this.ajaxUrl.getCreate,
                    method: 'post',
                    params: {
                        oid: _this.isBuy.oid // 订单编号
                    }
                }).then((res) => {

                    // 判断是否支付成功，如果支付成功，直接保存，否则继续轮询
                    if(res.data.return_code === 'SUCCESS') {

                        // 关闭弹窗
                        _this.isPurchaseOpen = false;

                        // 提示成功
                        _this.$message('支付成功');

                        // 再次触发保存函数 此次不会再产生isBUy将顺利保存
                        _this.saveData();

                    // 若返回不成功则再调用本函数 进行订单轮询
                    } else {
                        _this.getPayStatus();
                    }

                // 请求错误 或 网络错误
                }).catch((error) => {

                    // 网络错误
                    if(error.response) {
                        _this.$message({
                            message: error.response.status + ':网络错误，请刷新重试',
                            duration: 2000
                        });

                    // 请求错误
                    } else { 
                        _this.$message({
                            message: '请求错误，请刷新重试',
                            duration: 2000
                        });
                    }
                });

                // 清除此次定时器
                clearTimeout(time);
            
            // 两秒一次请求
            }, 2000)
        },

        // 向服务器提交数据
        saveData() {
            let _this = this,
                url = '',
                eventId = Idouzi.getQueryValue('eventId'),
                themeId = Idouzi.getQueryValue('themeId'),
                from = Idouzi.getQueryValue('from');

            
            // 将要保存的数据
            let data = {
                themeId: themeId,
                gameBase: _this.gameBase
            }

            // 根据新建和编辑页面 设置不同的上传接口
            if(from === 'create') {

                // 新建 保存数据接口地址
                url = _this.ajaxUrl.saveCreate;

            } else if(from === 'edit') {

                // 编辑 保存数据接口地址
                url = _this.ajaxUrl.saveEdit;

                // 编辑需要带上活动ID
                data.eventId = eventId;
            }

            // 遍历问题添加questionId
            data.gameQuestions = _this.gameQuestions.map((item, index) => {
                item.questionId = index;
                return item;
            });

            // 遍历结果添加resultId
            data.gameResults = _this.gameResults.map((item, index) => {
                item.resultId = index;
                return item;
            });

            // 添加loading
            let loading = Loading.service({fullscreen: true});

            // 向后台发送将要保存的数据
            _this.$http({
                method: 'post',
                url: url,
                data: qs.stringify(data) // 利用qs序列化data数据

            }).then((res) => {

                let data = res.data;

                // 请求成功
                if(data.return_code === 'SUCCESS') {

                    /**
                     * isBuy为订单信息
                     * 判断是否已经购买
                     * 如果是新建游戏页面可能返回isBuy数据
                     * 新建游戏页面根据是否含有isBuy来确定订单是否已经购买
                     * 编辑游戏页面不会返回isBuy数据
                     */
                    
                    let isBuy = data.return_msg.isBuy;

                    // 新建游戏页面 未购买时
                    if(isBuy) {
                        // 订单数据提取
                        _this.isBuy = isBuy;

                        // 弹出购买弹窗
                        _this.isPurchaseOpen = true;
                        
                        // 设置预览剩余时间
                        _this.$set(_this.isBuy, 'restTime', 30 * 60 * 1000);

                        // 预览剩余时间倒计时
                        _this.setTime();

                        // 购买过期时间
                        _this.buyStartTime = new Date().getTime();

                        // 对订单进行情况进行轮询
                        _this.getPayStatus();  

                    // 当已经购买
                    } else {
                        _this.$message('保存成功');
                        loading.href = _this.listLink
                    }
                
                // 提交数据返回不是success
                } else {
                    if(data.return_msg) {
                        _this.tipValidateTxt = data.return_msg;
                        _this.isValidateOpen = true;
                    }
                }

                // 关闭loading
                loading.close();

            // 网络错误 或 请求错误
            }).catch((error) => {

                // 网络错误
                if(error.response) {
                    _this.$message({
                        message: error.response.status + ':网络错误，请刷新重试',
                        duration: 2000
                    });

                // 请求错误
                } else {
                    _this.$message({
                        message: '请求错误，请刷新重试',
                        duration: 2000
                    });
                }

                // 关闭弹窗
                loading.close();
            })
        },

        submit() {
            let _this = this;

            // 对游戏进行校验 validate返回值为校验是否通过 true通过 false有错误
            if(!_this.validate()) {
                // 弹窗提示错误 不予提交
                _this.isValidateOpen = true;
                return false;
            }

            // 校验通过 则提交数据
            _this.saveData();
        },

        // 恢复默认设置 弹窗
        confirmDefault() { 
            let _this = this;

            _this.isSetOpen = true;
        },

        // 关闭试用弹窗函数
        closePurchaseDialog() {
            this.isPurchaseOpen = false;
        },

        // 恢复默认设置
        setDefault() {
            let _this = this,
                state = _this.$store.state,

                // 深拷贝gameDefault数据
                gameBase = _this.cloneObj(_this.gameBaseDefault),
                gameQuestions = _this.cloneObj(_this.gameQuestionsDefault),
                gameResults = _this.cloneObj(_this.gameResultsDefault);

            // 将gameDefault数据赋予当前游戏设置
            _this.$store.commit('setGameBase', gameBase);
            _this.$store.commit('setGameQuestions', gameQuestions);
            _this.$store.commit('setGameResults', gameResults);

            // 关闭弹窗
            _this.isSetOpen = false;
            
        },

        /**
         * 校验游戏基础设置是否出错
         * @return {Boolean} true 代表校验通过 false代表检验错误
         */
        validateB() {
            let _this = this,
                isError = false, // 校验是否出错
                gameBase = this.gameBase;

            // 游戏基础设置校验
            for(let key in gameBase) {

                // 如果已经有错误 跳出key检索
                if(isError) {
                    break;
                }

                switch (key) {
                    // 标题
                    case 'title': {
                        if(gameBase[key].lenth > 12) {

                            isError = true;
                            _this.tipValidateTxt = '游戏名称长度超过12个字';
                            break;

                        } else if(gameBase[key].trim() === ''){

                            isError = true;
                            _this.tipValidateTxt = '游戏名称不能为空';
                            break;

                        }
                    }

                    // 关键字
                    case 'keyword': {
                        if(gameBase[key].lenth > 20) {

                            isError = true;
                            _this.tipValidateTxt = '游戏关键词长度超过20个字';
                            break;

                        } else if(gameBase[key].trim() === '') {

                            isError = true;
                            _this.tipValidateTxt = '游戏关键词不能为空';
                            break;
                        }
                    }
                    
                    // 游戏描述
                    case 'description': {

                        if(gameBase[key].lenth > 500) {

                            isError = true;
                            _this.tipValidateTxt = '游戏描述超过500个字';
                            break;

                        } else if(gameBase[key].trim() === '') {

                            isError = true;
                            _this.tipValidateTxt = '游戏描述不能为空';
                            break;
                        }
                    }

                    // 自定义标题
                    case 'shareTitle': {

                        // 如果设置了自定义分享
                        if (gameBase.shareType === 1) {

                            if(gameBase[key].lenth > 20) {

                                isError = true;
                                _this.tipValidateTxt = '自定义分享标题超过20个字';
                                break;

                            } else if(gameBase[key].trim() === '') {

                                isError = true;
                                _this.tipValidateTxt = '自定义分享标题不能为空';
                                break;
                            }
                        }

                        break;
                    }

                    // 自定义分享类型
                    case 'shareType': {

                        if(gameBase[key] !== 0 || gameBase[key] !== 1) {
                            _this.tipValidateTxt = '自定义分享类型错误';
                        }
                        break;
                    }

                    // 自定义分享描述
                    case 'shareContent': {

                        // 如果设置了自定义分享
                        if (gameBase.shareType === 1) {

                            if(gameBase[key].lenth > 30) {

                                isError = true;
                                _this.tipValidateTxt = '自定义分享标题超过30个字';
                                break;

                            } else if(gameBase[key].trim() === '') {

                                isError = true;
                                _this.tipValidateTxt = '自定义分享描述不能为空';
                                break;
                            }
                        }
                        
                        break;
                    }

                    // 自定义分享图片
                    case 'shareContent': {

                        // 如果设置了自定义分享
                        if (gameBase.shareType === 1) {

                            if(gameBase[key].trim() == '') {

                                isError = true;
                                _this.tipValidateTxt = '自定义分享图片不能为空';
                                break;
                            }
                        }
                        break;
                    }
                }
            }

            return !isError;
        },

        /**
         * 校验游戏问题设置是否出错
         * @return {Boolean} true 代表校验通过 false代表检验错误
         */
        validateQ() {
            let _this = this,
                isError = false, // 校验是否出错
                gameQuestions = this.gameQuestions;
            
            // 游戏问答校验
            gameQuestions.some((gameQuestion, index) => {
                
                for(let key in gameQuestion) {

                    // 如果已经有错误 跳出key检索
                    if(isError) {
                        break;
                    }

                    switch (key) {

                        // 问题描述
                        case 'question': {
                            let question = gameQuestion[key];

                            if(question.name.length > 30) {
                                
                                isError = true;
                                _this.tipValidateTxt = `游戏问题${index+1}问题长度超过30个字`;
                                break;
                            } else if(question.name.trim() === '') {

                                isError = true;
                                _this.tipValidateTxt = `游戏问题${index+1}问题不能为空`;
                            }
                            break;
                        }

                        // 问题选项
                        case 'options': {
                            let options = gameQuestion[key];

                            options.some((item, order) => {

                                if(item.name.length > 20) {
                                    
                                    isError = true;
                                    _this.tipValidateTxt = `游戏问题${index+1}选项${order+1}长度超过20个字`;
                                    return true;
                                } else if(item.name.trim() === '') {

                                    isError = true;
                                    _this.tipValidateTxt = `游戏问题${index+1}选项${order+1}不能为空`;
                                    return true;
                                }

                                if(item.type === -1 || item.issueOrResultId === -1) {

                                    isError = true;
                                    _this.tipValidateTxt = `游戏问题${index+1}的选项${order+1}没有设置跳转`;
                                    return true;
                                }
                            });
                            break;
                        }
                    }
                }

                return isError;
            })

            return !isError;
        },

        /**
         * 校验游戏答案设置是否出错
         * @return {Boolean} true 代表校验通过 false代表检验错误
         */
        validateR() {
            let _this = this,
                isError = false, // 校验是否出错
                gameResults = this.gameResults;

            // 游戏答案校验
            gameResults.some((gameResult, index) => {

                for(let key in gameResult) {

                    // 如果已经有错误 跳出key检索
                    if(isError) {
                        break;
                    }

                    switch (key) {
                        case 'title': {

                            let name = gameResult[key];
                            if(name.length > 10) {

                                isError = true;
                                _this.tipValidateTxt = `游戏答案${index+1}标题长度超过10个字`;
                                break;
                                
                            } else if(name.trim() === ''){

                                isError = true;
                                _this.tipValidateTxt = `游戏答案${index+1}标题不能为空`;
                            }
                            break;
                        }
                        case 'content': {
                            let content = name = gameResult[key];
                            if(content.length > 500) {

                                isError = true;
                                _this.tipValidateTxt = `游戏答案${index+1}描述长度超过500个字`;
                                break;

                            } else if(content.trim() === '') {

                                isError = true;
                                _this.tipValidateTxt = `游戏答案${index+1}描述不能为空`;
                            }
                            break;
                        }
                    }
                }

                return isError;
            });

            return !isError;
        },

        /**
         * 游戏逻辑校验
         * @return {Boolean} true校验通过 false校验失败
         */
        validateL() {
            let _this = this,
                isError = false,
                lenQ = _this.gameQuestions.length,
                lenR = _this.gameResults.length,
                trac = [], // 路径数组
                nodesQ = [], // 问题数组
                nodesR = []; // 结果数组

            // 建立数据
            let {loopNodes, tracNodes, nextNodes} = this.buildData();


            // 统计使用到的节点
            // 对子节点进行遍历 nodes为子节点数组
            nextNodes.forEach((nodes) => {
                
                // 对子节点数组进行遍历 node为单个子节点
                nodes.forEach((node) => {

                    // 添加到数组集合中
                    if(typeof(node) === 'number') {
                        nodesQ.push(node);
                    } else {
                        nodesR.push(node);
                    }
                });
            });

            // 1.是否有未被使用到的问题 问题一01不需要被使用
            for(let i = 1; i < lenQ; i++) {

                if(nodesQ.indexOf(i) === -1) {

                    isError = true;
                    _this.tipValidateTxt = `问题${i+1}未被使用`;
                    break;
                }
            }

            // 验证错误则退出函数
            if(isError) {
                return isError;
            }

            // 2.是否有未被使用的答案
            for(let i = 0; i < lenR; i++) {

                if(nodesR.indexOf(`R${i}`) === -1) {

                    isError = true;
                    _this.tipValidateTxt = `答案${i+1}未被使用`;
                    break;
                }
            }

            // 验证错误则退出函数
            if(isError) {
                return isError;
            }

            // 3.验证循环并提示
            // 对各个后代节点集合进行遍历 nodes为各个问题对应后代

            loopNodes.some((nodes, index) => {
                
                // 对单个后代集合进行遍历 node为该问题对应后代节点
                let one = nodes.some((node) => {
                    // 如果node === index则说明循环
                    if(node === index) {
                        
                        isError = true;

                        // 对对应的tracnode进行后序遍历
                        let items = tracNodes[index]; // 当前节点所有集合

                        let len = items.length,
                            target = index; // 当前寻找目标
                        

                            trac = [index]; // 存储循环路径
                        
                        for(let i = len - 1; i >= 0; i--) {
                            
                            // 当前层级
                            let level = items[i];

                            // 当前层级的遍历 item为层级中一项
                            level.some((item) => {
                                
                                // 遍历项 cur为当前项下的节点
                                let has = item[1].some((cur) => {

                                    if(cur === target) { // 找到循环点
                                        
                                        // 推入路径 同时保存上一层目标
                                        target = item[0].parentId;
                                        trac.unshift(target);

                                        return true;
                                    }
                                });
                                return has;
                            })
                        }

                        return isError;
                    }
                });
                return one;
            });

            // 提示文字
            trac = trac.map((node) => {
                if(typeof node === 'number') {
                    return node + 1;
                } else {
                    return `R${parseInt(node.slice(1))}`;
                }
            });

            if(trac.length > 0) {

                let tipValidateTxt = `请检查你所设置的问题是否存在循环路径${trac.join('=>')}`;

                _this.tipValidateTxt = tipValidateTxt;

            }
            return !isError;
        },

        /**
         * 建立校验数据
         * @return {Object} 返回的数据
         * nextNodes: nextNodes, 各个问题的子节点数组
         * loopNodes: loopNodes, 各个问题的后代节点数组，用以判断是否循环
         * tracNodes: tracNodes 各个问题的后代节点数组,包括层级及父id
         */
        buildData() {
            let _this = this,
                ques = _this.gameQuestions;

            let nextNodes = [], // 各个问题的子节点数组
                loopNodes = [], // 各个问题的后代节点数组，用以判断是否循环
                tracNodes = []; // 各个问题的后代节点数组,包括层级及父id

            // 对问题数据进行循环找出子节点
            ques.forEach((item, index) => {
                nextNodes[index] = [];
                
                let options = item.options;

                options.forEach((items, indexs) => {
                    if(items.type === 1) {
                        nextNodes[index].push(`R${items.issueOrResultId}`)
                    } else {
                        nextNodes[index].push(items.issueOrResultId);
                    }
                });
            });
            
            // 先进行拷贝一份loop数据
            loopNodes = _this.cloneObj(nextNodes);

            // 第一次格式化数据结构
            nextNodes.forEach((item, index) => {

                    tracNodes[index] = [];

                    // 第一次数据
                    let level = [];

                    // 第一个数据为flag
                    level[0] = [{parentId: index}];
                    
                    // 添加子节点到第二个元素中
                    level[0].push(item.slice(0));

                    // 将第一级数组添加到外层数组中
                    tracNodes[index].push(level);
            });

            // 再次遍历nextNodes 
            nextNodes.forEach((item, index) => {

                // 整个路径节点的遍历 curItem为各个问题数组
                tracNodes.forEach((curItem, itemLevel) => {

                    // 各个问题数组的遍历 level为问题中的各个层级
                    curItem.forEach((curLevel, level) => {
                        
                        // 层级中的各个子节点集合
                        curLevel.forEach((options) => {

                            if(options) {

                                options[1].forEach((option) => {

                                    if(option === index) {
                                        
                                        // 合并数组
                                        item.forEach((node) => {
                                            loopNodes[itemLevel].push(node);
                                        });

                                        // 去重
                                        loopNodes[itemLevel] = Array.from(new Set(loopNodes[itemLevel]));

                                        // 如果当前层级存在
                                        if(Array.isArray(curItem[level + 1])) {
                                            curItem[level + 1].push([{parentId: index}, item]);
                                        } else {
                                            curItem[level + 1] = [];
                                            curItem[level + 1].push([{parentId: index}, item]);
                                        }
                                    }
                                })
                            }
                        })
                    });
                })
            });

            return {
                nextNodes: nextNodes,
                loopNodes: loopNodes,
                tracNodes: tracNodes
            }
        },


        /**
         * 游戏的普通校验
         * 包括关键词 必填项目及字段长度限制
         * @return {Boolean} 校验是否通过 true代表通过 false代表验证未通过
         */
        validate() {
            let _this = this;

            // 校验关键词
            if(!_this.validateKey) {
                _this.tipValidateTxt = '游戏关键词设置错误';
                return false;
            }

            // 校验游戏基础设置
            if(!_this.validateB()) {
                return false;
            }
            
            // 校验游戏问题
            if(!_this.validateQ()) {
                
                return false;
            }

            // 校验游戏答案
            if(!_this.validateR()) {
                
                return false;
            }

            // 校验游戏逻辑
            if(!_this.validateL()) {
                return false;
            }

            return true;
        }
    },

    mounted() {
    },

    watch: { 
        // 监听数据变化 进行缓存cookie
        gameBase: {
            handler() {
                // 若来自编辑则不设置cookie
                if(Idouzi.getQueryValue('from') === 'edit') {
                    return false;
                }

                sessionStorage.gameBase = escape(JSON.stringify(this.gameBase));
            },
            deep: true
        },
        gameQuestions: {
            handler() {
                // 若来自编辑则不设置cookie
                if(Idouzi.getQueryValue('from') === 'edit') {
                    return false;
                }

                sessionStorage.gameQuestions = escape(JSON.stringify(this.gameQuestions));

            },
            deep: true
        },
        gameResults: {
            handler() {
                // 若来自编辑则不设置cookie
                if(Idouzi.getQueryValue('from') === 'edit') {
                    return false;
                }

                sessionStorage.gameResults = escape(JSON.stringify(this.gameResults));
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
    /* 主题颜色 */
    @color: #FF981A;
    
    /* 颜色 按钮基本样式 */
    .btn-base {
        padding: 0;
        color: #fff;
        background: @color;
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
            cursor: pointer;
            
            .level-1 {
                font-size: 16px;
                color: #666;
            }
            
            .level-2 {
                font-size: 16px;
                color: @color;
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
                    padding-left: 39px;
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
                            cursor: pointer;

                            &.active {
                                color: @color;
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
                                            color: @color;
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



<template>
    <div class="lists">

        <!-- 顶部信息 -->
        <div class="top">
            <a class="go-back" :href="goBackUrl">返回</a>
            <div class="cur">
                <div class="txt">问答测试游戏功能列表</div>
                <a :href="createLink" class="new-edit">
                    <span class="new-txt">新建游戏</span>
                </a>
            </div>
        </div>

        <!-- 表格内容 -->
        <div class="content">

            <!-- 列表头部 -->
            <ul class="list-top">
                <li class="item title">测试名称</li>
                <li class="item created-time">创建时间</li>
                <li class="item participants">参与人数</li>
                <li class="item share-persons">分享人数</li>
                <li class="item pv">PV</li>
                <li class="item uv">UV</li>
                <li class="item state">状态</li>
                <li class="item handle">操作</li>
            </ul>

            <!-- 活动列表 -->
            <div class="list-wrap" 
                 v-loading="loading"
                 element-loading-text="拼命加载中">
                <ul class="list" v-for="(list, index) in rows" :key="index">
                    <li :title="list.title" class="item title">
                        {{ list.title }}
                    </li>
                    <li :title="list.createdTime" class="item created-time">
                        {{ list.createdTime }}
                    </li>
                    <li :title="list.participants" class="item participants">
                        {{ list.participants }}
                    </li>
                    <li :title="list.sharePeoples" class="item share-persons">
                        {{ list.sharePeoples }}
                    </li>
                    <li :title="list.pv" class="item pv">
                        {{ list.pv }}
                    </li>
                    <li :title="list.uv" class="item uv">
                        {{ list.uv }}
                    </li>
                    <li :title="list.state" class="item state">
                        {{ list.state }}
                    </li>

                    <!-- 活动处理 -->
                    <li class="handle">

                        <!-- 开启或关闭活动 -->
                        <button class="btn open"
                              :disabled="list.state === '违规'" 
                              @click="handlerConfirm(index)">
                              {{ stateTxt(list.state) }}
                        </button>

                        <!-- 编辑活动 -->
                        <button class="btn edit" @click="edit(list.eventId)">编辑</button>

                        <!-- 分享活动 -->
                        <button class="btn share" @click="share(list.shareUrl)">分享</button>
                    </li>
                </ul>
            </div>

            <!-- pagination 数据大于十条达到分页标准才分页 -->
            <div class="pagination" v-if="total > 10">
                <el-pagination
                    layout="prev, pager, next"
                    :page-size="10"
                    @current-change="refreshList"
                    :total="total">
                </el-pagination>
            </div>

            <!-- 分享弹窗 -->
            <el-dialog
                title="分享链接"
                :visible.sync="isShareOpen"
                :modal-append-to-body="false"
                :url="shareUrl"
                class="share-dialog"
                size="tiny">
                    <div class="dialog-content">

                        <!-- 二维码 -->
                        <qrcode :value="shareUrl" size="152"></qrcode>
                        <span class="txt">扫码分享</span>

                        <!-- 复制链接 -->
                        <el-popover
                            ref="popover1"
                            placement="top"
                            width="50"
                            :hide-after="200"
                            @show="hideProver"
                            trigger="click">
                            已复制
                        </el-popover>
                        
                        <div class="copy-wrap">
                            <input class="url" 
                                id="url" 
                                :value="shareUrl" 
                                :title="shareUrl"
                                readonly>
                            <button class="copy-btn" data-clipboard-target="#url" v-popover:popover1>复制链接</button>     
                        </div>
                    </div>
            </el-dialog>
        </div>

        <!-- 提示弹出框 操作活动二次确认 -->
        <tipdialog 
            :isOpen.sync="isHandleOpen"
            title="提示"
            @confirm="changeState"
            class="confrimDialog"
            :txt="tipTxt">
        </tipdialog>
    </div>
</template>
<script>
import Idouzi from '@idouzi/idouzi-tools' // Idouzi工具包
import Tool from './../../common/common.js' // 公共JS
import qrcode from 'qrcode.vue' // 二维码预览
import Clipboard from 'clipboard' // 复制插件
import tipdialog from './../../components/TipDialog' // 弹窗文字提示
import qs from 'qs' // post数据序列化
import {Loading} from 'element-ui' // 饿了么loading

// 主題ID
let themeId = Idouzi.getQueryValue('themeId');

export default {
    data() {
        return {
            isHandleOpen: false, // 活动操作弹窗
            stateIndex: 0, // 当前操作活动索引
            tipTxt: '', // 操作提示
            loading: true, // 加载条状态
            shareUrl: '', // 分享的链接
            isShareOpen: false, // 弹窗开启状态
            createLink: `create?from=create&themeId=${themeId}`,  // 新建链接
            editLink: `create?from=edit&themeId=${themeId}`, // 编辑链接

            ajaxUrl: { 
                changeState: Tool.editUrl('/supplier/change-state'),
                list: Tool.editUrl('/supplier/event-list')
            },

            page: 0, // 当前页码
            total: 0, // 数据总条数

            rows: [{ // 活动list	
                createdTime: '数据大于十条达到分页标准才分页', // 活动创建时间
                eventId: 0, // 活动ID
                participants: 0, // 游戏参与人数
                pv: 0, // 游戏pv
                sharePeoples: 0, // 分享人数
                shareUrl: '数据大于十条达到分页标准才分页', // 活动链接url（分享）
                state: '开启', // 游戏状态（开启，关闭，违规）
                title: '数页', // 测试名称
                uv: 0 // 游戏uv
            }],

            csrf: ''
        }
    },

    computed: {
        goBackUrl() {
            let url = 'http://';
            switch(Idouzi.getEnv()) {
                case 'dev': {
                    url += 'new';
                    break;
                }
                case 'test': {
                    url += 'wx';
                    break;                
                }
                case 'prod': {
                    url += 'qq';
                    break;                
                }
                default: {
                    url += 'new';
                }
            }
            return `${url}.idouzi.com/supplier/index/functionPanel`;
        },
    },

    created() {
        let _this = this;

        // 实例化复制链接
        new Clipboard('.copy-btn');

        // 数据请求
        _this.refreshList(0);
    },

    methods: {
        /**
         * 改变活动状态二次确认
         * @param {Number} 当前操作的活动索引 index
         */
        handlerConfirm(index) {
            let _this = this,
                state = _this.rows[index].state;

            _this.stateIndex = index;

            if(state === '违规') {
                return false;
            } else {
                _this.tipTxt = `确认${_this.stateTxt(state)}活动`
            }

            _this.isHandleOpen = true;
        },

        // 关闭prover
        hideProver() {
            let _this = this;

            let timer = setTimeout(() => {
                document.querySelector('.el-popover').style.display = 'none';
                clearTimeout(timer);
            }, 1000);
        },
        
        /**
         * ajax请求错误提示
         * @param {Object} error 请求错误对象
         */
        showError(error) {
            // 网络错误
            if(error.response) {
                this.$message({
                    message: error.response.status + ':网络错误，请刷新重试',
                    duration: 2000
                });
            } else { // 请求错误
                this.$message({
                    message: '请求错误，请刷新重试',
                    duration: 2000
                });
            }
        },

        /**
         * 根据不同的状态返回不同的操作按钮文字
         * @param {String} state 活动状态
         * @return {String} 开启或关闭
         */
        stateTxt(state) {
            let txt;

            switch(state) {
                case '开启': {
                    txt = '关闭';
                    break;
                }
                case '关闭': {
                    txt = '开启';
                    break;
                }
                case '违规': {
                    txt = '违规';
                    break;
                }
                default: break;
            }

            return txt;
        },

        /**
         * 分页列表
         * @param {Number} curPage 当前分页
         */
        refreshList(curPage) {
            let _this = this;

            _this.loading = true;

            _this.$http({
                method: 'get',
                url: _this.ajaxUrl.list,
                params: {
                    themeId,
                    page: curPage,
                    rows: 10
                }
            }).then((res) => {
                let resData = res.data,
                    msg = resData.return_msg;

                if(resData.return_code === 'SUCCESS') {
                    _this.csrf = resData.headers._csrf;
                    _this.rows = msg.lists;
                    _this.totalPage = msg.totalPage;
                } else {
                    // 显示错误信息
                    _this.$message(msg);
                }

                _this.loading = false;
            }).catch((error) => {
                // 显示错误信息
                _this.showError(error);

                // 关闭加载条
                _this.loading = false;
            });
        },

        /**
         * 进入编辑页面
         * @param {String} eventId 活动ID
         */
        edit(eventId) {
            location.href = `${this.editLink}&eventId=${eventId}`;
        },

        /**
         * 开启分享弹窗
         * @param {String} url 活动链接
         */
        share(url) {
            let _this = this;

            _this.shareUrl = url;
            _this.isShareOpen = true;
        },

        // 更改活动状态
        changeState() {
            let _this = this,
                index = _this.stateIndex,
                eventId = _this.rows[index].eventId,
                state = _this.rows[index].state;
            
            // 状态为违规时无法操作 退出函数
            if(state === '违规') {
                return false;
            }

            if(state === '开启') {
                state = '关闭';
            } else if(state === '关闭') {
                state = '开启';
            }

            let data = {
                state,
                eventId
            }

            _this.$http({
                method: 'post',
                params: {
                    _csrf: _this.csrf
                },
                url: _this.ajaxUrl.changeState,
                data: qs.stringify(data),
                timeout: 10000
            }).then((res) => {
                let resData = res.data;

                // 请求成功 修改state状态
                if(resData.return_code === 'SUCCESS') {
                    _this.rows[index].state = data.state;
                } else {
                    // 显示错误信息
                    _this.$message(resData.return_msg);
                }
            }).catch((error) => {
                // 显示错误信息
                _this.showError(error);
            })
        }
    },

    components: {
        tipdialog,
        qrcode
    }
}
</script>

<style lang="less">
    /* 主题颜色 */
    @color: #FF981A;

    .lists {
        width: 1000px;
        margin: 10px auto;
        margin-top: 10px;

        /* 顶部信息 */
        .top {
            text-align: left;

            .go-back {
                font-size: 16px;
                color: #666;
                cursor: pointer;
            }

            .cur {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-top: 22px;

                .txt {
                    height: 18px;
                    padding-left: 10px;
                    font-size: 18px;
                    color: #666;
                    line-height: 18px;
                    border-left: 2px solid @color;
                }

                .new-edit {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    width: 86px;
                    height: 32px;
                    padding: 0 10px;
                    border-radius: 3px;
                    background: @color;
                    box-sizing: content-box;
                    cursor: pointer;

                    &:before {
                        content: '';
                        width: 20px;
                        height: 20px;
                        background: url('assets/image/new-edit.png');
                    }

                    .new-txt {
                        font-size: 14px;
                        color: #fff;
                        line-height: 32px;
                    }
                }
            }
        }

        /* 列表内容 */
        .content {
            width: 1000px;
            height: 720px;
            margin-top: 10px;
            font-size: 14px;
            border-radius: 5px;
            background: #fff;
            box-shadow: 0 1px 5px 0 rgba(0,0,0,0.10);

            /* 列表头部 */
            .list-top {
                display: flex;
                height: 42px;
                padding: 0 38px;
                text-align: center;
                line-height: 42px;
                color: #fff;
                border-radius: 5px 5px 0 0;
                background: #FFC44D;
            }

            /* 列表容器 */ 
            .list-wrap {
                min-height: 200px;
                
                /* loading */ 
                .el-loading-spinner {
                    .path {
                        stroke: @color;
                    }

                    .el-loading-text {
                        color: @color;
                    }
                }
            }
            
            /* 活动列表 */
            .list {
                display: flex;
                height: 43px;
                margin: 12px 20px 0 20px;
                padding: 0 16px;
                text-align: center;
                line-height: 43px;
                border: 1px solid #E6E6E6;
                border-radius: 5px;
                color: #666;

                &:hover {
                    border: 1px solid @color;
                }

                .state {
                    color: #333;
                }

                .handle {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;

                    .btn {
                        width: 52px;
                        height: 28px;
                        padding: 0;
                        background: #fff;
                        line-height: 28px;
                        border: 1px solid #ccc;
                        border-radius: 3px;
                        cursor: pointer;
                        outline: none;
                    }
                }
            }

            /* 列表字段宽度设置 */
            .list-top, .list {
                display: flex;
                justify-content: space-between;

                span {
                    text-align: center;
                }

                .title {
                    width: 126px;
                }
                
                .created-time {
                    width: 142px;
                }

                .participants {
                    width: 60px;
                }

                .share-persons {
                    width: 60px;
                }

                .pv {
                    width: 42px;
                }

                .uv {
                    width: 42px;
                }

                .state {
                    width: 28px;
                }

                .handle {
                    width: 190px;
                }
            }

            .list {
                & > .item {
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }
            }
        }

        /* 分页样式 */
        .pagination {
            margin-top: 30px;
            text-align: center;

            .el-pagination {
                button:hover {
                    color: @color;
                }
            }

            .el-pager {
                li:hover {
                    color: @color;
                }

                li.active {
                    color: #fff;
                    border-color: @color;
                    background-color: @color;
                }
            }
        }

        /* 分享弹窗 */
        .share-dialog {
            .el-dialog {
                width: 360px;
                font-size: 14px;
                line-height: 20px;
                border-radius: 5px;
                overflow: hidden;

                .el-dialog__header {
                    width: 360px;
                    padding: 10px 20px;
                    text-align: left;
                    background: #F8F8F8;

                    .el-dialog__title {
                        color: #1A1A1A;
                        font-size: 14px;
                    }

                    .el-dialog__headerbtn {
                        line-height: 20px;
                        font-size: 14px;
                        
                        i {
                            font-size: 14px;
                            color: #999;
                        }

                        &:hover i {
                            color: @color;
                        }
                    }
                }

                .el-dialog__body {
                    padding: 40px 20px;
                    text-align: left;
                    color: #1A1A1A;
                    
                    /* 分享内容 */
                    .dialog-content {
                        display: flex;
                        flex-flow: column;
                        align-items: center;

                        .el-popover {
                            min-width: 0;
                        }

                        .txt {
                            margin-top: 10px;
                            color: #999;
                        }

                        .copy-wrap {
                            display: flex;
                            align-items: center;
                            justify-content: flex-end;
                            width: 340px;
                            height: 32px;
                            margin-top: 26px;
                            padding: 0 10px;
                            background: #fff;
                            border: 1px solid #999;
                            border-radius: 3px;
                            font-size: 12px;

                            .url {
                                width: 252px;
                                overflow: hidden;
                                text-overflow: ellipsis;
                                font-size: 12px;
                                border: none;
                                outline: none;
                                background: #fff;
                            }

                            .split {
                                width: 1px;
                                height: 12px;
                                margin: 0 5px 0 10px;
                                background: @color;
                            }

                            .copy-btn {
                                flex-shrink: 0;
                                margin-left: 5px;
                                padding-left: 4px;
                                font-size: 12px;
                                color: @color;
                                border: none;
                                border-left: 1px solid @color;
                                background: #fff;
                                box-sizing: content-box;
                            }
                        }
                    }
                }
            }
        }
    }
</style>



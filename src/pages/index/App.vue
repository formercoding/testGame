<template>
    <div class="lists">

        <!-- 顶部信息 -->
        <div class="top">
            <a class="go-back" :href="goBackUrl">返回</a>
            <div class="cur">
                <div class="txt">问答测试游戏功能列表</div>
                <a :href="createLink" class="new-edit">
                    <span class="icon-new"></span>
                    <span class="new-txt">新建游戏</span>
                </a>
            </div>
        </div>

        <!-- 表格内容 -->
        <div class="content">

            <!-- 列表头部 -->
            <div class="list-top">
                <span class="title">测试名称</span>
                <span class="created-time">创建时间</span>
                <span class="participants">参与人数</span>
                <span class="share-persons">分享人数</span>
                <span class="pv">PV</span>
                <span class="uv">UV</span>
                <span class="state">状态</span>
                <span class="handle">操作</span>
            </div>

            <!-- 活动列表 -->
            <div class="list-wrap" 
                 v-loading="loading"
                 element-loading-text="拼命加载中">
                <div class="list" v-for="(list, index) in rows" :key="index">
                    <span :title="list.title" class="title">
                        {{ list.title }}
                    </span>
                    <span :title="list.createdTime" class="created-time">
                        {{ list.createdTime }}
                    </span>
                    <span :title="list.participants" class="participants">
                        {{ list.participants }}
                    </span>
                    <span :title="list.sharePeoples" class="share-persons">
                        {{ list.sharePeoples }}
                    </span>
                    <span :title="list.pv" class="pv">
                        {{ list.pv }}
                    </span>
                    <span :title="list.uv" class="uv">
                        {{ list.uv }}
                    </span>
                    <span :title="list.state" class="state">
                        {{ list.state }}
                    </span>

                    <!-- 活动处理 -->
                    <span class="handle">

                        <!-- 开启或关闭活动 -->
                        <span class="open"
                              :style="disabledSty(list.state)" 
                              @click="handlerConfirm(list.eventId, index)">
                              {{ stateTxt(list.state) }}
                        </span>

                        <!-- 编辑活动 -->
                        <span class="edit" @click="edit(list.eventId)">编辑</span>

                        <!-- 分享活动 -->
                        <span class="share" @click="share(list.shareUrl)">分享</span>
                    </span>
                </div>
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
                :visible.sync="isOpen"
                :modal-append-to-body="false"
                :url="shareUrl"
                class="share-dialog"
                size="tiny">
                    <div class="dialog-content">

                        <!-- 二维码 -->
                        <v-qrcode :value="shareUrl" size="152"></v-qrcode>
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
                            <span class="split"></span>
                            <span class="copy-btn" data-clipboard-target="#url" v-popover:popover1>复制链接</span>     
                        </div>
                    </div>
            </el-dialog>
        </div>

        <!-- 提示弹出框 操作活动二次确认 -->
        <v-tipDialog 
            :isOpen.sync="isHandleOpen" 
            title="提示"
            @confirm="changeState"
            class="confrimDialog"
            :txt="tipTxt">
        </v-tipDialog>
    </div>
</template>
<script>
import Idouzi from '@idouzi/idouzi-tools'
import Tool from './assets/js/common.js'
import vQrcode from 'qrcode.vue'
import Clipboard from 'clipboard'
import vTipDialog from './../../components/tipdialog'
import qs from 'qs'

// 主題ID
let themeId = Idouzi.getQueryValue('themeId');

export default {
    data() {

        return {
            isHandleOpen: false, // 活动操作弹窗
            stateId: '', // 当前操作活动ID
            stateIndex: 0, // 当前操作活动索引
            tipTxt: '', // 操作提示
            loading: true, // 加载条状态
            shareUrl: '', // 分享的链接
            isOpen: false, // 弹窗开启状态
            createLink: `create?from=create&themeId=${themeId}`,  // 新建链接
            editLink: `create?from=edit&themeId=${themeId}`, // 编辑链接

            ajaxUrl: { 
                changeState: Tool.editUrl('/supplier/change-state'),
                list: Tool.editUrl('/supplier/event-list')
            },

            page: 0, // 当前页码
            total: 0, // 数据总条数

            rows: [{ // 活动list	
                createdTime: '', // 活动创建时间
                eventId: 0, // 活动ID
                participants: 0, // 游戏参与人数
                pv: 0, // 游戏pv
                sharePeoples: 0, // 分享人数
                shareUrl: '', // 活动链接url（分享）
                state: '', // 游戏状态（开启，关闭，违规）
                title: '', // 测试名称
                uv: 0 // 游戏uv
            }],
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
        _this.$http({
            url: _this.ajaxUrl.list,
            method: 'post',
            timeout: 10 * 1000,
            params: {
                themeId,
                page: _this.page,
                rows: 10
            }
        }).then((res) => {
            let data = res.data;

            if(data.return_code === 'SUCCESS') {
                let msg = data.return_msg;

                _this.total = msg.totalPage;
                _this.rows = msg.lists;
            } 

            // 关闭加载条
            _this.loading = false;
        }).catch((error) => {
            // 显示错误信息
            _this.showError(error);

            // 关闭加载条
            _this.loading = false;
        });      
    },

    methods: {
        /**
         * 改变活动状态二次确认
         * @param {String} 当前操作的活动ID eventId 
         * @param {Number} 当前操作的活动索引 index
         */
        handlerConfirm(eventId, index) {
            let _this = this,
                state = _this.rows[index].state;

            _this.stateId = eventId;
            _this.stateIndex = index;


            if(state === "违规") {
                return false;
            } else {
                _this.tipTxt = `确认${_this.stateTxt(state)}活动`
            }

            _this.isHandleOpen = true;

        },

        // 关闭prover
        hideProver() {
            let _this = this;

            setTimeout(() => {
                document.querySelector('.el-popover').style.display = 'none';
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
         * 判断是否禁用样式
         * @param {Number} state 按钮状态 
         * @param {Object||Undefined} 按钮禁用样式
         */
        disabledSty(state) {
            if(state === '违规') {
                return {
                    cursor: 'text'
                }
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
                    txt = '违规'
                }
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
                method: 'post',
                url: _this.ajaxUrl.list,
                params: {
                    themeId: Idouzi.getQueryValue('themeId'),
                    page: curPage,
                    rows: 10
                }
            }).then((res) => {

                if(res.status === 200) {
                    
                    let msg = res.data.return_msg;
                    _this.rows = msg.lists;
                    _this.totalPage = msg.totalPage;
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
            window.location = `${this.editLink}&eventId=${eventId}`;
        },

        /**
         * 开启分享弹窗
         * @param {String} url 活动链接
         */
        share(url) {
            let _this = this;

            _this.shareUrl = url;
            _this.isOpen = true;
        },

        /**
         * 更改活动状态
         * @param {Number} eventId 活动ID
         * @param {Number} index 当前活动所在列表索引
         */
        changeState() {
            let _this = this,
                eventId = _this.stateId,
                index = _this.stateIndex,
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
                state: state,
                eventId: eventId
            }
            _this.$http({
                method: 'post',
                url: _this.ajaxUrl.changeState,
                data: qs.stringify(data),
                timeout: 10000
            }).then((res) => {

                let resData = res.data;
                // 请求成功 修改state状态
                if(resData.return_code === 'SUCCESS') {

                    _this.rows[index].state = data.state;
                } else {

                    _this.$message({
                        message: resData.return_msg,
                        duration: 2000
                    });
                }

            }).catch((error) => {
                
                // 显示错误信息
                _this.showError(error);
            })
        }
    },

    components: {
        vQrcode,
        vTipDialog
    }
  
}
</script>
<style lang="less">
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
                cursor: default;
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
                    border-left: 2px solid #FF981A
                }

                .new-edit {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    width: 86px;
                    height: 32px;
                    padding: 0 10px;
                    border-radius: 3px;
                    background: #FF981A;
                    box-sizing: content-box;
                    cursor: pointer;

                    .icon-new {
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
                        stroke: #FF981A;
                    }

                    .el-loading-text {
                        color: #FF981A;
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
                    border: 1px solid #FF981A;
                }

                .state {
                    color: #333;
                }

                .handle {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;

                    span {
                        width: 52px;
                        height: 28px;
                        line-height: 28px;
                        border: 1px solid #ccc;
                        border-radius: 3px;
                        cursor: pointer;
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
                span {
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
                    color: #FF981A;
                }
            }

            .el-pager {
                li:hover {
                    color: #FF981A;
                }

                li.active {
                    color: #fff;
                    border-color: #FF981A;
                    background-color: #FF981A;
                }
            }
        }

        /* 分享弹窗 */
        .share-dialog {
            .el-dialog {
                width: 360px;
                font-size: 14px;
                line-height: 20px;

                .el-dialog__header {
                    width: 360px;
                    padding: 10px 20px;
                    text-align: left;
                    background: #F8F8F8;
                    border-radius: 5px 5px 0 0;

                    .el-dialog__title {
                        color: #1A1A1A;
                        font-size: 14px;
                    }

                    .el-dialog__headerbtn {
                        &:hover {
                            i {
                                color: #999;
                            }
                        }

                        i {
                            font-size: 14px;
                            color: #999;
                        }
                    }
                }

                .el-dialog__body {
                    padding: 40px 20px 40px 20px;
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
                            background: #FFFFFF;
                            border: 1px solid #999999;
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
                                background: #FF981A;
                            }

                            .copy-btn {
                                flex-shrink: 0;
                                font-size: 12px;
                                color: #FF981A;
                                box-sizing: content-box;
                                cursor: pointer;
                            }
                        }
                        
                    }

                }
            }
        }
    }
</style>



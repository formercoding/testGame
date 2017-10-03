<template>
    <div class="lists">
        <div class="top">
            <router-link class="go-back" :to="{ name: 'edit', params: { eventId: 'new' }}">
                返回
            </router-link>
            <div class="cur">
                <div class="txt">问答测试游戏功能列表</div>
                <a :href="addNewLink" class="new-edit">
                    <span class="icon-new"></span>
                    <span class="new-txt">新建游戏</span>
                </a>
            </div>
        </div>
        <div class="content">
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
                <div class="list" v-for="(list, index) in rows">
                    <span class="title">{{list.title}}</span>
                    <span class="created-time">{{list.createdTime}}</span>
                    <span class="participants">{{list.participants}}</span>
                    <span class="share-persons">{{list.sharePeoples}}</span>
                    <span class="pv">{{list.pv}}</span>
                    <span class="uv">{{list.uv}}</span>
                    <span class="state">{{list.state}}</span>
                    <span class="handle">
                        <span class="open"
                              :style="disabledSty(list.state)" 
                              @click="changeState(list.shareUrl, index)">{{(stateTxt(list.state))}}</span>
                        <span class="edit" @click="edit(list.eventId)">编辑</span>
                        <span class="share" @click="share(list.shareUrl)">分享</span>
                    </span>
                </div>
            </div>
            <!-- pagination -->
            <div class="pagination" v-show="total > 10">
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
                :url = "shareUrl"
                class="share-dialog"
                size="tiny">
                    <div class="dialog-content">
                        <v-qrcode :value="shareUrl" size="152"></v-qrcode>
                        <span class="txt">扫码分享</span>
                        <div class="copy-wrap">
                            <input class="url" id="url" :value="shareUrl" readonly>
                            <span class="split"></span>
                            <span class="copy-btn" data-clipboard-target="#url">复制链接</span>
                        </div>
                    </div>
            </el-dialog>
        </div>
    </div>
</template>
<script>
import Idouzi from '@idouzi/idouzi-tools'
import Tool from './assets/js/common.js'
import vQrcode from 'qrcode.vue'
import Clipboard from 'clipboard'
export default {
    data() {
        let themeId = Idouzi.getQueryValue('themeId') || 100;
        return {
            loading: false,
            shareUrl: 'www.google.com', // 分享的链接
            isOpen: false, // 弹窗开启状态
            ajaxUrl: {
                changeState: 'www.wqw.qw',
                list: Tool.editUrl('/supplier/event-list')
            },
            page: 0,
            rows: [{ // list	
                createdTime: '2013-03-22 12:00', // 活动创建时间
                eventId: 999, // 活动ID
                participants: 22, // 游戏参与人数
                pv: 22, // 游戏pv
                sharePeoples: 22, // 分享人数
                shareUrl: 'www.google.com', // 活动链接url（分享）
                state: 0, // 游戏状态（开启，关闭，违规）
                title: '测试游戏', // 测试名称
                uv: 0 // 游戏uv
            }, { // list	
                createdTime: '2013-03-22 12:00', // 活动创建时间
                eventId: 999, // 活动ID
                participants: 22, // 游戏参与人数
                pv: 22, // 游戏pv
                sharePeoples: 22, // 分享人数
                shareUrl: 'www.baidu.com', // 活动链接url（分享）
                state: 0, // 游戏状态（开启，关闭，违规）
                title: '测试游戏', // 测试名称
                uv: 0 // 游戏uv
            }, { // list	
                createdTime: '2013-03-22 12:00', // 活动创建时间
                eventId: 999, // 活动ID
                participants: 22, // 游戏参与人数
                pv: 22, // 游戏pv
                sharePeoples: 22, // 分享人数
                shareUrl: 'www.baidu.com', // 活动链接url（分享）
                state: 0, // 游戏状态（开启，关闭，违规）
                title: '测试游戏', // 测试名称
                uv: 0 // 游戏uv
            }],
            total: 10, // 数据总条数
            addNewLink: `create.html?themeId=${themeId}`
        }
    },

    created() {
        let _this = this;
        // 复制链接
        new Clipboard('.copy-btn');

        // 数据请求
        _this.$http({
            url: _this.ajaxUrl.list,
            method: 'post',
            params: {
                page: _this.page,
                rows: 10
            }
        }).then((res) => {
            let data = res.data;

            if(data.return_code === 'SUCCESS') {
                let msg = data.return_msg;

                _this.rows = msg.lists;
            }
        }, (res) => {

        })      
    },

    methods: {
        /**
         * 判断是否禁用
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
         * 更新列表
         * @param {Number} curPage 当前分页
         */
        refreshList(curPage) {
            let _this = this;

                _this.loading = true;

                _this.$http({
                    method: 'post',
                    url: _this.ajaxUrl.list,
                    params: {
                        page: curPage,
                        rows: 10
                    }
                }).then((res) => {

                    if(res.status === 200) {
                        _this.loading = false;
                    }
                })
        },

        /**
         * 进入编辑页面
         * @param {String} eventId 活动ID
         */
        edit(eventId) {
            let themeId = Idouzi.getQueryValue('themeId') || 122;
            // this.$router.push({ name: 'edit', params: { eventId: eventId }});
            window.location = `${this.addNewLink}&eventId=${eventId}`;
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
        changeState(eventId, index) {
            let _this = this,
                state = _this.rows[index];
            
            switch(state) {
                case 0: {
                    _this.$http({
                        method: 'post',
                        url: _this.ajaxUrl.changeState,
                        params: {
                            state: state
                        },
                        timeout: 10000
                    }).then((res) => {
                        if(res.status === 200) {
                            _this.rows[index].state = 1;
                        }
                    });
                    break;
                }
                case 1: {
                    _this.$http({
                        method: 'post',
                        url: _this.ajaxUrl.changeState,
                        params: {
                            state: state
                        },
                        timeout: 10000
                    }).then((res) => {
                        
                        if(res.status === 200) {
                            _this.rows[index].state = 0;
                        }
                    })
                }
            }
        }
    },

    components: {
        vQrcode,
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

        .content {
            width: 1000px;
            height: 720px;
            margin-top: 10px;
            font-size: 14px;
            border-radius: 5px;
            background: #fff;
            box-shadow: 0 1px 5px 0 rgba(0,0,0,0.10);

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

            .list-top, .list {
                display: flex;
                justify-content: space-between;

                span {
                    text-align: center;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }

                .title {
                    width: 126px;
                }
                
                .created-time {
                    width: 127px;
                }

                .participants {
                    width: 55px;
                }

                .share-persons {
                    width: 55px;
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
        }

        /* 分页样式 */
        .pagination {
            margin-top: 30px;

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



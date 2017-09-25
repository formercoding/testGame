<template>
    <div class="lists">
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
            <div class="list" v-for="(list, index) in rows">
                <span class="title">{{list.title}}</span>
                <span class="created-time">{{list.createdTime}}</span>
                <span class="participants">{{list.participants}}</span>
                <span class="share-persons">{{list.sharePeoples}}</span>
                <span class="pv">{{list.pv}}</span>
                <span class="uv">{{list.uv}}</span>
                <span class="state">{{list.state}}</span>
                <span class="handle">
                    <span class="open" @click="changeState(list.shareUrl, index)">开启</span>
                    <span class="edit" @click="edit(list.eventId)">编辑</span>
                    <span class="share" @click="share(list.shareUrl)">分享</span>
                </span>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            ajaxUrl: {
                changeState: 'www.wqw.qw'
            },
            page: 1,
            rows: [{ // list	
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
            total: 222 // 数据总条数
        }
    },

    methods: {

        /**
         * 进入编辑页面
         * @param {Number} eventId 活动ID
         */
        edit(eventId) {
            this.$router.push({ name: 'edit', params: { eventId: eventId }});
        },

        /**
         * 开启分享弹窗
         * @param {String} url 活动链接
         */
        share(url) {
            

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
    }
  
}
</script>
<style lang="less">
    .lists {
        width: 1000px;
        margin: 0 auto;

        .content {
            width: 1000px;
            height: 720px;
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

                &:focus {
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
                        width: 50px;
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
                    text-overflow: ellipsis;
                }

                .title {
                    width: 126px;
                }
                
                .created-time {
                    width: 127px;
                }

                .participants {
                    width: 42px;
                }

                .share-persons {
                    width: 42px;
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
    }
</style>



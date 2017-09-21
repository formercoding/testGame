<template>
    <div class="dialog">
        <el-dialog
        title="跳转设置"
        size="tiny"
        :visible="dialogData.isShow"
        :before-close="close"
        :modal-append-to-body="false">
        <div class="content flex">
            <div class="ask-box flex-col">
                <span class="txt">问题</span>
                <section scrollbar
                         class="scroll1">
                    <ul class="asks">
                        <li v-for="(item, index) in gameQuestions" 
                            :key="index" 
                            :class="{active: dialogData.targetIndex === index && dialogData.targetType === 0}"
                            @click="setOptionTarget(0, index)"
                            class="flex item">
                            <span class="check-box">
                                <span class="check"></span>
                            </span>
                                {{'问题' + calculateIndex(index)}}
                            </span>
                        </li>
                    </ul>
                </section>
            </div>
            <div class="result-box flex-col">
                <span class="txt">测试结果</span>
                <section scrollbar class="scroll2">
                    <ul class="result">
                        <li v-for="(item, index) in gameResults" 
                            :key="index" 
                            :class="{active: dialogData.targetIndex === index && dialogData.targetType === 1}"
                            class="flex item"  
                            @click="setOptionTarget(1, index)">
                            <span class="check-box">
                                <span class="check"></span>
                            </span>
                            <span class="desc">{{resultsTxt(index)}}</span>
                        </li>
                    </ul>
                </section>
            </div>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="setTarget">确定</el-button>
        </span>
        </el-dialog>
    </div>
</template>
<script>
  import  Scrollbar from 'smooth-scrollbar'
  import  'smooth-scrollbar/dist/smooth-scrollbar.css'
  export default {
    data() {
        return {
        };
    },

    computed: {
        // 计算问题状态
        gameQuestions() {
            return this.$store.state.gameQuestions;
        },

        // 计算结果状态
        gameResults() {
            return this.$store.state.gameResults;
        },

        // 计算dialogData状态
        dialogData() {
            return this.$store.state.dialogData;
        }
    },

    mounted() {
        // 初始化滚动条
        this.$nextTick(() => {
            Scrollbar.init(document.querySelector('.scroll1'), {
                alwaysShowTracks: true, // 滚动条常显
                syncCallbacks:　true // 同步执行函数
            });
            Scrollbar.init(document.querySelector('.scroll2'), {
                alwaysShowTracks: true, // 滚动条常显
                syncCallbacks:　true // 同步执行函数
            });
        });
    },

    methods: {
        /**
         * 序号规则化两位显示
         * @param {Number} index 当前序号
         * @return {Number} 两位序号
         */
        calculateIndex(index) {
            return index < 9 ? '0' + (index + 1) : index + 1;
        },

        /**
         * 序号规则化两位显示
         * @param {Number} index 当前序号
         * @return {String} 
         */
        resultsTxt(index) {
            let calculateIndex =  index < 9 ? '0' + (index + 1) : index + 1;
            return calculateIndex + ' ' + this.gameResults[index].name;
        },

        /**
         * 修改跳转目标显示
         * @param {Number} 跳转类型 type(0 为问题 1为答案)
         * @param {Number} 跳转索引 index 
         */
        setOptionTarget(type, index) {
            let dialogData = {
                targetType: type,
                targetIndex: index,
                isShow: true
            }

            // 弹窗状态修改
            this.$store.commit('setDialogData', dialogData);            
        },

        //  修改跳转目标
        setTarget() {
            this.$store.commit('setTarget');
            // 弹窗状态修改
            this.$store.commit('setDialogData', {
                targetType: 0,
                targetIndex: 0,
                isShow: false
            });           
        },

        // 关闭弹窗
        close() {
            this.$store.commit('setDialogData', {
                targetType: 0,
                targetIndex: 0,
                isShow: false 
            });
        }
    }
  };
</script>
<style lang="less">
    .dialog {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;

        /* 弹出框 */
        .el-dialog {
            width: 425px;
            border-radius: 5px;
            background: #fff;

            /* 头部 */
            .el-dialog__header {
                width: 425px;
                height: 40px;
                padding: 10px 12px 10px 20px;
                line-height: 20px;
                text-align: left;
                background: #F8F8F8;

                /* 标题 */
                .el-dialog__title {
                    color: #1A1A1A;
                    font-size: 14px;
                }

                .el-dialog__headerbtn {
                    font-size: 12px;
                    line-height: 20px;

                    i {
                        color: #999;
                        &:hover {
                            color: #FF981A;
                        }
                    }
                }
            }

            .el-dialog__body {
                padding: 0;

                /* 内容区域 */
                .content {
                    padding: 0 40px;

                    /* 滚动区域 */
                    section {
                        display: inline-block;
                        padding: 10px;
                        height: 220px;
                        border: 1px solid #CCCCCC;
                        background: #FFFFFF;

                        .item {
                            align-items: center;
                            line-height: 26px;
                            color: #212121;
                            cursor: default;
                    
                            /* 勾选样式 */
                            .check-box {
                                position: relative;
                                width: 16px;
                                height: 16px;
                                margin-right: 6px;
                                border: 1px solid #ccc;
                                border-radius: 50%;
                                

                                .check {
                                    position: absolute;
                                    top: 3px;
                                    left: 5px;
                                    width: 3px;
                                    height: 6px;
                                    border: 1px solid transparent;
                                    border-bottom-color: #fff;
                                    border-right-color: #fff;
                                    transform: rotate(31deg);
                                }
                            }

                            .desc {
                                white-space: nowrap;
                                overflow: hidden;
                                text-overflow: ellipsis;
                            }
                        
                            &.active {
                                /* 勾选样式 */
                                .check-box {
                                    background: #64BE33;
                                }
                            }
                        }
                    }

                    /* 问题框 */
                    .ask-box {
                        width: 110px;
                        text-align: left;

                        .txt {
                            font-size: 14px;
                            color: #999;
                            line-height: 34px;
                        }
                    }

                    /* 答案框 */
                    .result-box {
                        width: 215px;
                        margin-left: 20px;
                        text-align: left;

                        .txt {
                            font-size: 14px;
                            color: #999;
                            line-height: 34px;
                        }
                    }
                }
            }

            /* 弹出框底部 */
            .el-dialog__footer {
                padding: 20px 40px;

                .dialog-footer {
                    .el-button--primary {
                        width: 80px;
                        height: 32px;
                        font-size: 12px;
                        background: #FF981A;
                        border-radius: 3px;
                        border: none;
                        outline: none;
                    }
                }
            }
            
        }
    }
</style>

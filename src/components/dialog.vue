<template>
    <el-dialog
        ref="mydialog"
        title="跳转设置"
        size="tiny"
        :visible="isOpen"
        :before-close="close"
        :lock-scroll="true"
        :modal-append-to-body="true">
        <div class="content flex">
            <div class="ask-box flex-col">
                <span class="txt">问题</span>
                <div class="scroll-wrap">
                    <div class="scroll" v-bar>
                        <ul class="asks">
                            <li v-for="(item, index) in 20" 
                                :key="index" 
                                :class="{active: targetIndex === index && targetType === 0}"
                                @click="setOptionTarget(0, index)"
                                class="flex item">
                                <span class="check-box">
                                    <span class="check"></span>
                                </span>
                                <span>
                                    {{'问题' + calculateIndex(index)}}
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="result-box flex-col">
                <span class="txt">测试结果</span>
                <div class="scroll-wrap">
                    <div v-bar="{preventParentScroll: true}" class="scroll" >
                        <ul class="result">
                            <li v-for="(item, index) in gameResults" 
                                :key="index" 
                                :class="{active: targetIndex === index && targetType === 1}"
                                class="flex item"  
                                @click="setOptionTarget(1, index)">
                                <span class="check-box">
                                    <span class="check"></span>
                                </span>
                                <span class="desc">{{resultsTxt(index)}}</span>
                            </li>
                        </ul>
                    </div>
                    
                </div>
            </div>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="confirm">确定</el-button>
        </span>
    </el-dialog>
</template>
<script>
export default {
    props: {
        isOpen: {
            type: Boolean,
            default: false
        },
        targetIndex: {
            type: Number,
            default: 0
        },
        targetType: {
            type: Number,
            default: 0
        }
    },

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
        }
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
            this.$emit('update:targetIndex', index);
            this.$emit('update:targetType', type);
        },

        //  确认事件
        confirm() {
            this.$emit('update:isOpen', false);
            this.$emit('confirm', this.targetType, this.targetIndex);
        },

        // 关闭弹窗
        close() {
            this.$emit('update:isOpen', false);
            this.$emit('confirm', this.targetType, this.targetIndex);
        }
    }
};
</script>
<style lang="less">
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
                        color: #999;
                    }
                }
            }
        }

        .el-dialog__body {
            padding: 0;

            /* 内容区域 */
            .content {
                padding: 0 40px;
                border-bottom: none;

                /* 滚动区域 */
                .scroll-wrap {
                    display: inline-block;
                    border: 1px solid #CCCCCC;
                    padding: 10px 0px 10px 10px;
                    background: #FFFFFF;

                    .scroll {
                        height: 220px;
                        
                        .item {
                            align-items: center;
                            line-height: 26px;
                            color: #212121;
                            font-size: 14px;
                            cursor: default;

                            &:first-child {
                                margin-top: -4px;
                            }
                    
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
</style>

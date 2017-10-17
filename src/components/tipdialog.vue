<template>
    <el-dialog
    :title="title"
    :visible.sync="isOpen"
    :modal-append-to-body="false"
    :before-close="close"
    class="tip-dialog"
    size="tiny">
        <span>{{txt}}</span>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="confirm">确 定</el-button>
            <el-button @click="close" v-show="!single">取 消</el-button>
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
        type: {
            type: Number,
            default: 0
        },
        single: {
            type: Boolean,
            default: false
        },
        title: {
            type: String,
            default: '操作提示'
        },
        txt: {
            type: String,
            default: '确认操作？'
        }
    },

    data() {
      return {
      }
    },

    computed: {
    },
    mounted() {
    },

    methods: {
        // 确认按钮
        confirm() {
            this.$emit('update:isOpen', false);
            this.$emit('confirm');
        },

        // 普通关闭按钮
        close() {
            this.$emit('update:isOpen', false);
        }
    }
};
</script>
<style lang="less">
.tip-dialog {
    .el-dialog {
        width: 360px;
        font-size: 14px;
        line-height: 20px;

        .el-dialog__header {
            width: 360px;
            padding: 10px 20px;
            background: #F8F8F8;
            border-radius: 5px 5px 0 0;
            
        }

        .el-dialog__title {
            font-size: 14px;
        }

        .el-dialog__headerbtn {
            font-size: 12px;
            line-height: 20px;

            &:hover {
                color: #bfcbd9;
            }
        }

        .el-dialog__body {
            height: 100px;
            padding: 20px 20px 0 20px;
            text-align: left;
            color: #1A1A1A;
        }

        .el-dialog__footer {
            padding: 0 20px 20px 0;
            text-align: right;
            border-radius: 0 0 5px 5px;


            .el-button {
                vertical-align: top;
                width: 80px;
                height: 32px;
                font-size: 12px;
                color: #999;
                border: 1px solid #ccc;
                border-radius: 3px;
                outline: none;

                &.el-button--primary {
                    color: #fff;
                    border: none;
                    background: #FF981A;
                }
            }
        }
    }
}
</style>



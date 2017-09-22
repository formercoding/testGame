<template>
    <el-dialog
    title="提示"
    :visible.sync="isOpen"
    :modal-append-to-body="false"
    :before-close="close"
    class="tip-dialog"
    size="tiny">
        <span>{{txt}}</span>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="confirm">确 定</el-button>
            <el-button @click="close">取 消</el-button>
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
        }
    },

    data() {
      return {
        txts: [
          '是否删除',
          '问题关联，是否删除'
        ]
      };
    },

    computed: {
      /**
       * 计算提示弹窗的状态
       */
      tipDialog() {
        return this.$store.state.tipDialog;
      },

      /**
       * 弹窗文案
       */
      txt() {
        return this.txts[this.type];
      }
    },
    mounted() {
    },

    methods: {
        // 确认按钮
        confirm() {
            this.$emit('confirm');
            this.$emit('update:isOpen', false);
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

        .el-dialog__body {
            height: 100px;
            padding: 20px 20px 0 20px;
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
                }
            }
        }
    }
}
</style>



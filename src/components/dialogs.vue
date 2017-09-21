<template>
    <div class="tipDialog" v-show="tipDialog.isShow">
      <el-dialog
        title="提示"
        :visible.sync="tipDialog.isShow"
        :modal-append-to-body="false"
        size="tiny"
        :before-close="handleClose">
        <span>{{txt}}</span>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="handleConfirm">确 定</el-button>
        </span>
      </el-dialog>
    </div>
</template>
<script>
export default {
    data() {
      return {
        txts: [
          '问题关联，是否删除',
          '问题不关联，是否删除'
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
        let type = this.tipDialog.txtType;
        return this.txts[type];
      }
    },

    methods: {
      handleClose(done) {
        console.log('close');
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
      }
    },

    handleConfirm() {
      let type = tipDialog.type;

      switch(type) {
        case 0: {
          this.$store.commit('setTipConfirm', true);
        }
        case 1: {

        }
      }
    }
};
</script>
<style lang="less" scoped>
  .tipDialog {

  }
</style>



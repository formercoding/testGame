<template>
<el-form :model="dynamicValidateForm.age" ref="dynamicValidateForm" label-width="100px" class="demo-dynamic">
  <input :value="dynamicValidateForm.age.myage">
  <input :value="dynamicValidateForm.age">
  <el-form-item
    prop="myage"
    label="邮箱"
    :rules="[
      { required: true, message: '请输入邮箱地址', trigger: 'blur' }
    ]"
  >
    <el-input v-model="dynamicValidateForm.age.name"></el-input>
    <input :value="dynamicValidateForm.name">
  </el-form-item>
  <!-- <el-form-item
    v-for="(domain, index) in dynamicValidateForm.domains"
    :label="'域名' + index"
    :key="domain.key"
    :prop="'domains.' + index + '.value'"
    :rules="{
      required: true, message: '域名不能为空', trigger: 'blur'
    }"
  >
    <el-input v-model="domain.value"></el-input><el-button @click.prevent="removeDomain(domain)">删除</el-button>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="submitForm('dynamicValidateForm')">提交</el-button>
    <el-button @click="addDomain">新增域名</el-button>
    <el-button @click="resetForm('dynamicValidateForm')">重置</el-button>
  </el-form-item> -->
</el-form>
</template>
 <script>
  export default {
    data() {
      return {
        tree: {
            name: 'A',
            children: [
                    {
                        name: 'B',
                        children: [
                            {
                                name: 'C'
                            }, {
                                name: 'D',
                                children: []
                            }
                        ]
                    }, {
                        name: 'F',
                        children: [
                            {
                                name: 'G',
                                children: [
                                    {
                                        name: 'y'
                                    }, {
                                        name: 'z'
                                    }
                                ]
                            }, {
                                name: 'C'
                            }
                        ]
                    }
            ]
            
        },
        // dynamicValidateForm: {
        //   domains: [{
        //     value: ''
        //   }],
        //   email: ''
        // },
        dynamicValidateForm: {
            name: 'luo',
            age: {
                name: 'luo',
                myage: 'sss'
            },
            arr: [1, 2, 3],
            gg: 'name'
        }
      };
    },
    created() {
        let path = [];
        let curPath = [];
        let paths = (tree) => {
            curPath.push(tree.name);

            if(!tree.children) {
                path.push(curPath.slice(0));
                curPath.pop();
                return true;
            } else {
                tree.children.forEach((item, index ) => {
                    paths(item);
                })
            }
            curPath.pop();
        }
        paths(this.tree);
        console.log(path);
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      removeDomain(item) {
        var index = this.dynamicValidateForm.domains.indexOf(item)
        if (index !== -1) {
          this.dynamicValidateForm.domains.splice(index, 1)
        }
      },
      addDomain() {
        this.dynamicValidateForm.domains.push({
          value: '',
          key: Date.now()
        });
      }
    }
  }
</script>
<style>
.demo-dynamic {
    margin-bottom: 50px;
}
</style>

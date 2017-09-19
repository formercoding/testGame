<template>
    <div class="gameask">
        <!-- 问题表单 -->
        <el-form v-for="(askData, index) in askForm" 
                 :model= "askData"
                 :key="index"
                 :rules="ruleAsk"
                 class="ask-form">
            <!-- 问题遍历 -->
            <div class="ask">
                <!-- 头部 -->
                <div class="header flex">
                    <span class="txt">测试结果 {{calculateIndex(index)}}</span>
                    <span class="sub" @click="sub(index)">-</span>
                    <span class="add" @click="add(index)">+</span>
                </div>
                <!-- 问题描述 -->
                <el-form-item class="title" prop="title">
                    <el-input type="textarea" 
                              :maxlength="38"
                              placeholder="请输入问题..."
                              v-model="askData.title" 
                              class="w-300" 
                              resize="none">
                    </el-input>
                    <span class="input-num">{{askData.title.length}}/38</span>
                    <!-- 描述图片 -->
                    <div class="flex desc-pic">
                        <div class="place-pic" v-show="askData.url !== ''">
                            <span class="close" @click="deletePic(index)"></span>
                        </div>
                        <div class="flex-col upload" v-show="askData.url === ''">
                            <div class="btn-wrap">
                                <v-uploadpic :data="calculatePic(index)" @uploadPic="changePic"></v-uploadpic>
                            </div>
                        </div>
                    </div>
                </el-form-item>
                <p class="suggest">图片建议尺寸：640&times;365px 图片支持格式：JPG、 JPEG、png</p>
                <!-- 问题选项 -->
                <span class="opt">问题答案</span>
                <el-form-item
                    class="option"
                    v-for="(opt, indexs) in askData.opts"
                    :key="indexs"
                    :prop="'opts.' + indexs + '.txt'"
                    :rules="{
                        required: true, message: '请输入选项描述', trigger: 'blur'
                    }"
                >
                    <!-- 选项描述 -->
                    <span class="key">A.</span>
                    <el-input v-model="opt.txt" 
                              :maxlength="20"
                              placeholder="不超过20个字" 
                              class="w-300">
                    </el-input>
                    <span class="input-num">{{opt.txt.length}}/20</span>
                    <!-- 选择跳转 -->
                    <span class="txt" targetType="opt.targetType" target="opt.target">跳转至</span>
                    <span class="target active" @click="targetChose(index, indexs)">选择</span>
                 </el-form-item>
                <!-- 增加选项 -->
                <div class="add-opt">
                    <button type="button" class="btn">增加答案</button>
                </div>
            </div>    
        </el-form>
    </div>
</template>
<script>
import vUploadpic from './uploadpic'
export default {
    data() {
        return {
            askForm: [{
                    title: '',
                    url: 'http://img3.redocn.com/20131025/Redocn_2013102514143640.jpg',
                    opts: [
                        {
                            txt: '1',
                            targetType: '',
                            target: '0'
                        }, {
                            txt: '',
                            targetType: '',
                            target: '0'
                        }
                    ]
                }, {
                    title: '',
                    url: '',
                    opts: [
                        {
                            txt: '',
                            targetType: '',
                            target: '0'
                        }, {
                            txt: '',
                            targetType: '',
                            target: '0'
                        }
                    ]
                }],
            ruleAsk: {
                title: [
                    { required: true, message: '请输入问题', trigger: 'blur' }
                ]
            }
        }
    },

    methods: {
        /**
         * 选择跳转目标
         * @param {Number} index 问题索引
         * @param {Number} indexs 选项索引
         */
        targetChose(index, indexs) {

        },



        /**
         * 计算题目索引
         * @param {Number} index 题目索引
         * @return 索引美化
         */
        calculateIndex(index) {
            return index < 9 ? '0' + (index + 1) : (index + 1);      
        },

        /**
         * 计算传递给上传组件的信息
         * @param {Number} index 数组索引
         * @return {Object} 数据对象
         */
        calculatePic(index) {
            return {
                txt: '上传图片',
                limit: 1000,
                param: index
            }
        },

        /**
         * 监听图片上传，修改对应图片地址
         * @param {Number} index 图片所在数组索引
         * @param {Number} url   图片新地址
         */
        changePic(index, url) {
            this.askForm[index].url = url;
        },

        /**
         * 预览图片删除
         * @param {String} index 图片所在数组索引
         */
        deletePic(index) {
            this.askForm[index].url = '';
        },

        /**
         * 增加问题结果
         * @param {Number} index 问题结果索引
         */
        add(index) {
            // 控制问题20以上
            if(this.askForm.length === 20) {
                return false;
            }

            this.askForm.splice(index + 1, 0, {
                title: '',
                url: 'http://img3.redocn.com/20131025/Redocn_2013102514143640.jpg',
                opts: [
                    {
                        txt: '1',
                        targetType: '',
                        target: '0'
                    }, {
                        txt: '',
                        targetType: '',
                        target: '0'
                    }
                ]
            });
        },

        /**
         * 减少问题结果
         * @param {Number} index 问题结果索引
         */
        sub(index) {
            // 防止全被删除
            if(this.askForm.length === 1) {
                return false;
            }

            this.askForm.splice(index, 1);
        }
    },

    components: {
        vUploadpic,
    }
}
</script>
<style lang="less">

    /* 按钮样式 背景居中 */
    .btn-base {
        padding: 0;
        color: #fff;
        background: #ff981a;
        border: none;
        border-radius: 3px;
        outline: none;
    }

    .back {
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center center;
    }

    .gameask {
        font-size: 14px;
        color: #666;
        
        /* 问题表单 */
        .ask-form {
            padding-top: 12px;

            &:last-child {
                .ask {
                    border-bottom: none;
                }
            }
            
            .ask {
                margin-right: 62px;
                padding: 20px 0;
                border-bottom: 1px solid #d8d8d8;

                /* 头部 */
                .header {
                    .txt {
                        width: 108px;
                    }

                    .sub {
                        width: 16px;
                        height: 16px;
                        margin-right: 20px;
                        text-align: center;
                        font-size: 24px;
                        color: #FF6A4D;
                        line-height: 12px;
                        border: 2px solid #FF6A4D;
                        cursor: default;                        
                    }

                    .add {
                        width: 16px;
                        height: 16px;
                        text-align: center;
                        font-size: 24px;
                        color:  #7ED321;
                        line-height: 15px;
                        border: 2px solid  #7ED321;
                        cursor: default;

                    }
                }

                /* 问题描述 */
                .title {
                    margin-left: 23px;
                    margin-top: 10px;
                    margin-bottom: 0;

                    .input-num {
                        position: relative;
                        top: 6px;
                        right: 48px;
                        display: inline-block;
                        width: 40px;
                        text-align: right;
                        font-size: 12px;
                        color: #ccc;
                    }

                    .w-300 {
                        position: relative;
                        width: 300px;
                        height: 60px;

                        &:after {
                            content: "*";
                            position: absolute;
                            top: 50%;
                            right: -18px;
                            margin-top: -3px;
                            font-size: 24px;
                            line-height: 16px;
                            color: #FF6A4D;
                        }
                    }

                    /* 问题描述图片 */
                    .desc-pic {
                        position: absolute;
                        top: 14px;
                        right: -13px;
                        font-size: 14px;
                        color: #666;

                        /* 描述图片预览 */
                        .place-pic {
                            position: relative;
                            width: 70px;
                            height: 40px;
                            margin-top: -4px;
                            margin-right: 20px;
                            border-radius: 3px;
                            background: url('../assets/image/logo.png');
                            background-repeat: no-repeat;
                            background-position: center center;
                            background-size: cover;

                            .close {
                                position: absolute;
                                top: -7px;
                                right: -6px;
                                width: 16px;
                                height: 16px;
                                cursor: default;
                                text-align: center;
                                background: url('../assets/image/close.png');
                            }
                        }

                        /* 图片上传 */
                        .upload {
                            font-size: 16px;
                            color: #666;
                            .btn-wrap {
                                width: 80px;
                                height: 32px;
                            }
                        }
                    }
                }

                /* 上传图片建议尺寸 */
                .suggest {
                    margin: 10px 0 0 23px;
                    font-size: 12px;
                    color: #999;
                    line-height: 36px;
                }

                /* 问题选项 */
                .option {
                    position: relative;
                    margin-bottom: 0;

                    .el-form-item__content {
                        display: flex;
                        align-items: center;
                        margin-top: 10px;
                        padding-bottom: 10px;

                        /* 选项序号 */
                        .key {
                            width: 23px;
                        }
                    
                        .w-300 {
                            width: 300px;
                            margin-right: 9px;
                        }
                        .el-input:after {
                            display: none;
                        }

                        .el-input__inner {
                            position: relative;
                            width: 300px;
                            margin-right: 9px;
                        }

                        .el-form-item__error {
                            top: 33px;
                            left: 23px;
                        }

                        .input-num {
                            position: absolute;
                            top: 0;
                            right: 117px;
                            font-size: 12px;
                            line-height: 34px;
                            color: #ccc;
                        }

                        .txt {
                            margin-right: 10px;
                            color: #bababa;
                        }

                        .target.active {
                            color: #FF981A;
                        }
                    }
                }
                
                /* 添加选项 */
                .add-opt {
                    margin-left: 23px;

                    .btn {
                        .btn-base;
                        width: 300px;
                        height: 32px;
                        margin: 10px 0 0 0;
                        color: #FF981A;
                        border: 1px solid #FF981A;
                        background: #fff;
                    }
                }
            }
        }
    }

</style>


<template>
    <div class="gameask">
        <!-- 问题表单 -->
        <el-form v-for="(askData, index) in gameQuestions" 
                 :model= "askData"
                 :key="index"
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
                <el-form-item class="title" prop="question.name"
                    :rules="{
                        required: true, message: '请输入选项描述', trigger: 'blur'
                    }">
                    <el-input type="textarea" 
                              :maxlength="38"
                              placeholder="请输入问题..."
                              v-model="askData.question.name"
                              @change="syncData"
                              class="w-300"
                              resize="none">
                    </el-input>
                    <span class="input-num">{{askData.question.name.length}}/38</span>
                    <!-- 描述图片 -->
                    <div class="flex desc-pic">
                        <div class="place-pic" v-show="askData.question.image !== ''">
                            <img :src="askData.question.image">
                            <span class="close" @click="deletePic(index)"></span>
                        </div>
                        <div class="flex-col upload" v-show="askData.question.image === ''">
                            <div class="btn-wrap">
                                <v-uploadpic :data="{pos: 'gameQuestions', flag: index}"></v-uploadpic>
                            </div>
                        </div>
                    </div>
                </el-form-item>
                <p class="suggest">图片建议尺寸：640&times;365px 图片支持格式：JPG、 JPEG、png</p>
                <!-- 问题选项 -->
                <span class="opt">问题答案</span>
                <el-form-item
                    class="option"
                    v-for="(option, indexs) in askData.options"
                    :key="indexs"
                    :prop="'options.' + indexs + '.name'"
                    :rules="{
                        required: true, message: '请输入选项描述', trigger: 'blur'
                    }">
                    <!-- 选项描述 -->
                    <span class="key">A.</span>
                    <el-input v-model="option.name" 
                              :maxlength="20"
                              placeholder="不超过20个字" 
                              @change="syncData"
                              class="w-300">
                    </el-input>
                    <span class="input-num">{{option.name.length}}/20</span>
                    <!-- 选择跳转 -->
                    <span class="txt">跳转至</span>
                    <span class="target" 
                          :class="{active: isTarget(option.target.type, option.target.issueOrResultId)}"
                          @click="targetChose(option.target.type, option.target.issueOrResultId)">
                          {{targetTxt(option.target.type, option.target.issueOrResultId)}}
                    </span>
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
        }
    },

    computed: {
        // 计算状态的问题设置
        gameQuestions() {
            return this.$store.state.gameQuestions;
        }
    },

    methods: {
        /**
         * 跳转文字
         * @param {Number} type 跳转类型
         * @param {Number} index 跳转索引
         */
        targetTxt(type, index) {
            if(type === '' || index === '') { 
                return '选择';
            } else {
                if(type === 0) {
                    return '问题' + index;
                } else {
                    return '答案' + index;
                }
            }
        },

        /**
         * 跳转文字
         * @param {Number} type 跳转类型
         * @param {Number} index 跳转索引
         */
        isTarget(type, index) {
            if(type === '' || index === '') { 
                return false;
            } else {
                return true;
            }
        },
        
        /**
         * 开启弹窗 同时设置跳转目标
         * @param {Number} type 跳转类型
         * @param {Number} index 跳转目标序号
         */
        targetChose(type, index) {
            // 开启弹窗
            this.$store.commit('setDialogVisible', true);

            let dialogData = {
                targetType: type,
                targetIndex: index
            }

            // 设置弹窗数据
            this.$store.commit('setDialogData', dialogData); 
            
        },

        // 将表单数据与vuex同步
        syncData() {
            this.$store.commit('setGameQuestions', this.gameQuestions);
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
            this.$store.commit('changeQuestionsPic', {index: index, url: ''});
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

                            img {
                                width: 70px;
                                height: 40px;
                            }

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

                        .target {
                            cursor: default;
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


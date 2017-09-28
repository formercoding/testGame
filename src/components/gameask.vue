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
                    <span class="sub" @click="delConfirm(index)">-</span>
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
                              @blur="syncData"
                              class="w-300"
                              resize="none">
                    </el-input>
                    <span class="input-num">{{askData.question.name.length}}/38</span>
                    <!-- 描述图片 -->
                    <div class="flex desc-pic">
                        <div class="place-pic" v-show="askData.question.image !== ''">
                            <img :src="askData.question.image">
                            <span class="close" @click="changePic(index, '')"></span>
                        </div>
                        <div class="flex-col upload" v-show="askData.question.image === ''">
                            <div class="btn-wrap">
                                <v-uploadpic :flag="index" @upload="changePic"></v-uploadpic>
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
                              @blur="syncData"
                              class="w-300">
                    </el-input>
                    <span class="input-num">{{option.name.length}}/20</span>
                    <!-- 选择跳转 -->
                    <span class="txt">跳转至</span>
                    <span class="target" 
                          :class="{active: isTarget(option.target.type, option.target.issueOrResultId)}"
                          @click="targetChose(index, indexs)">
                          {{targetTxt(option.target.type, option.target.issueOrResultId)}}
                    </span>
                 </el-form-item>
                <!-- 增加选项 -->
                <div class="add-opt">
                    <button type="button" class="btn" @click="addOption(index)">增加答案</button>
                </div>
                <!-- 选择弹出框 -->
                <v-dialog 
                    @confirm="setTarget"
                    :isOpen.sync="goDialog"
                    :targetType.sync="targetType"
                    :targetIndex.sync="targetIndex">
                </v-dialog>
                <!-- 提示弹出框 -->
                <v-tipDialog :isOpen.sync="tipDialog" @confirm="sub" :txt="tipTxt" title="操作提示"></v-tipdialog>
            </div>    
        </el-form>
    </div>
</template>
<script>
import vUploadpic from './uploadpic'
import vDialog from './dialog'
import vTipDialog from './tipdialog'
export default {
    data() {
        return {
            goDialog: false, // 跳转弹窗状态
            tipDialog: false, // 提示弹窗状态
            delIndex: 0, // 点击的删除索引
            goIndex: 0, // 跳转问题所在索引
            targetType: -1, // 跳转类型
            targetIndex: -1, // 跳转索引
            goIndexs: 0, // 跳转选项所在索引
            tipTxt: '确认删除?' // 提示文字
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
         * 修改图片地址
         * @param {Number} index 要改变的图片索引
         * @param {String} url 要改变的图片地址
         */
        changePic(index, url) {
            let _this = this,
                gameQuestions = _this.gameQuestions,
                question = gameQuestions[index].question;
            
            // 改变图片
            question.image = url;

            // 更新问题状态
            _this.syncData();
        },

        /**
         * 弹出确认 确认删除
         */
        delConfirm(index) {
            let _this = this,
                gameQuestions = _this.gameQuestions;

            _this.delIndex = index;
            _this.tipTxt = '确认删除？';

            // 验证关联性
            gameQuestions.forEach((question) => {
                question.options.forEach((option)=> {
                    let target = option.target;

                    // 验证是否关联
                    if(target.type === 0 && target.issueOrResultId === index) {
                        // 切换弹窗类型
                        _this.tipTxt = '该问题已被关联，确认删除？';
                    }
                })
            });

            // 开启弹窗
            _this.tipDialog = true;
        },

        /**
         * 弹出确认 修改跳转
         * @param {Number} type 跳转类型
         * @param {Number} index 跳转目标序号
         */
        setTarget() {
            let _this = this,
                curQuestion = _this.gameQuestions[_this.goIndex],
                curOption = curQuestion.options[_this.goIndexs],
                target = curOption.target;

            // 跳转目标修改
            target.type = _this.targetType;
            target.issueOrResultId = _this.targetIndex;

            // 同步gameQuestions数据至vuex
            _this.syncData();
        },

        /**
         * 跳转文字
         * @param {Number} type 跳转类型
         * @param {Number} index 跳转索引
         */
        targetTxt(type, index) {
            if(type === -1 || index === -1) { 
                return '选择';
            } else {
                index = index < 9 ? '0' + (index + 1) : (index + 1);
                if(type === 0) {
                    return '问题' + index;
                } else {
                    return '答案' + index;
                }
            }
        },

        /**
         * 跳转文字样式
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
         * @param {Number} index 问题索引
         * @param {Number} indexs 选项索引
         */
        targetChose(index, indexs) {
            let _this = this,
                target =  _this.gameQuestions[index].options[indexs].target;

            _this.goIndex = index;
            _this.goIndexs = indexs;

            _this.targetType = target.type;
            _this.targetIndex = target.issueOrResultId;

            // 弹出框
            _this.goDialog = true;
        },

        // 将表单数据与vuex同步
        syncData() {
            let _this = this;
            _this.$store.commit('setGameQuestions', _this.gameQuestions);
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
         * 增加问题结果
         * @param {Number} index 问题结果索引
         */
        add(index) {
            let _this = this,
                gameQuestions = _this.gameQuestions;

            // 控制问题20以上
            if(gameQuestions.length === 20) {
                return false;
            }

            // 在问题底下新增提问
            gameQuestions.splice(index + 1, 0, {
                _id: 0, // 问题序号
                question: { // 问题文字描述
                    image: '', // 问题图片地址
                    name: '1', // 问题描述
                }, 
                options: [ // 问题选项数组
                    {
                        name: '', // 答案文字描述
                        target: {
                            type: -1,
                            issueOrResultId: -1
                        }
                    }, {
                        name: '', // 答案文字描述
                        target: {
                            type: -1,
                            issueOrResultId: -1
                        }
                    }
                ]
            });

            // 问题的关联性更新
            gameQuestions.forEach((question) => {
                question.options.forEach((option)=> {
                    let target = option.target;

                    // 当选项的关联索引 <= 删除索引 关联性不变

                    // 当选项的关联索引 > 增加索引 关联结果后置一个单位
                    if(target.type === 0 && target.issueOrResultId > index) {

                        // 删除问题的关联目标
                        target.issueOrResultId = target.issueOrResultId + 1;
                    }
                })
            });

            // 同步vuex数据
            this.syncData();
        },

        /**
         * 增加问题选项
         * @param {Nubmer} index 一级索引
         * @param {Number} indexs 二级索引
         */
        addOption(index) {
            let _this = this;

            // 添加选项
            _this.gameQuestions[index].options.push({
                name: '', // 答案文字描述
                target: {
                    type: -1,
                    issueOrResultId: -1
                }
            });

            // 同步vuex数据
            _this.syncData();
        },

        // 确认问题删除
        sub() {
            let _this = this,
                gameQuestions = _this.gameQuestions;

            // goIndex重置 不然计算值中的targetIndex容易出错
            _this.goIndex = 0;
            _this.goIndexs = 0;            

            // 防止全被删除 至少保留两个
            if(gameQuestions.length === 2) { // 当前问题个数为2

                gameQuestions.splice(_this.delIndex, 1, {
                    _id: 0, // 问题序号
                    question: { // 问题文字描述
                        image: '', // 问题图片地址
                        name: '', // 问题描述
                    }, 
                    options: [ // 问题选项数组
                        {
                            name: '', // 答案文字描述
                            target: {
                                type: -1,
                                issueOrResultId: -1
                            }
                        }, {
                            name: '', // 答案文字描述
                            target: {
                                type: -1,
                                issueOrResultId: -1
                            }
                        }
                    ]
                });
                // 如果此时问题个数为2  则维持 其它 -> 自身 的关联性
                
            } else {// 如果此时问题个数大于2
                
                // 更新 问题关联性
                gameQuestions.forEach((question) => {
                    question.options.forEach((option)=> {
                        let target = option.target;

                        // 当选项的关联索引 = 删除索引 删除关联性
                        if(target.type === 0 && target.issueOrResultId === _this.delIndex) {

                            // 删除问题的关联目标
                            target.type = -1;
                            target.issueOrResultId = -1;
                        }
                        
                        // 当选项的关联索引 > 删除索引 将关联性提前一个位置
                        if(target.type === 0 && target.issueOrResultId > _this.delIndex) {

                            // 提前问题的关联目标
                            target.issueOrResultId = target.issueOrResultId - 1;
                        }

                        // 当选项的关联索引 < 删除索引 关联性不变
                    })
                });

                // 删除问题
                gameQuestions.splice(_this.delIndex, 1);
            }

            // 同步vuex数据
            _this.syncData();
        }
    },

    components: {
        vUploadpic,
        vDialog,
        vTipDialog
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
                width: 430px;
                margin-right: 62px;
                padding: 20px 0;
                border-bottom: 1px solid #d8d8d8;
                position: relative;

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
                        box-sizing: content-box;
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
                        box-sizing: content-box;
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


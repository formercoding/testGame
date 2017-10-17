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
                    <span class="txt">测试问题 {{calculateIndex(index)}}</span>
                    <span class="sub" @click="delConfirm(index)"></span>
                    <span class="add" @click="add(index)"></span>
                </div>
                <!-- 问题描述 -->
                <el-form-item class="title" prop="question.name"
                    :rules="{
                        required: true, message: '请输入选项描述', trigger: 'blur'
                    }">
                    <el-input type="textarea" 
                              :maxlength="30"
                              placeholder="请输入提问..."
                              v-model="askData.question.name"
                              @blur="syncData"
                              @focus="changeQ(index)"
                              class="w-300"
                              v-wordLimit
                              resize="none">
                    </el-input>
                    <span class="input-num">{{askData.question.name.length}}/30</span>
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
                    <span class="key">{{optionOrder(indexs)}}</span>
                    <el-input v-model="option.name" 
                              :maxlength="20"
                              placeholder="不超过20个字..." 
                              @blur="syncData"
                              v-wordLimit
                              @focus="changeQ(index)"
                              class="w-300">
                    </el-input>
                    <span class="input-num">{{option.name.length}}/20</span>
                    <!-- 选择跳转 -->
                    <span class="txt">跳转至</span>
                    <span class="target" 
                          :class="{active: isTarget(option.type, option.issueOrResultId)}"
                          @click="targetChose(index, indexs)">
                          {{targetTxt(option.type, option.issueOrResultId)}}
                    </span>
                 </el-form-item>
                <!-- 增加选项 -->
                <div class="add-opt">
                    <button type="button" class="btn" @click="addOption(index)">增加答案</button>
                    <button type="button" class="btn" @click="subOption(index)">减少答案</button>
                </div>
                <!-- 选择弹出框 -->
                <v-dialog 
                    @confirm="setTarget"
                    :isOpen.sync="goDialog"
                    :targetType.sync="targetType"
                    :goIndex="goIndex"
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
         * 改变当前问题
         * @param {Number} index 问题索引
         */
        changeQ(index) {
            this.$store.commit('setCurQ', index);
        },

        /**
         * 返回选项序号ABCD
         * @param {Number} index 选项索引
         */
        optionOrder(index) {
            let order = ['A','B', 'C', 'D']
            return `${order[index]}.`;
        },
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
            gameQuestions.forEach((question, qIndex) => {
                question.options.forEach((option, oIndex)=> {

                    // 验证是否关联
                    if(option.type === 0 && option.issueOrResultId === index) {
                        // 切换弹窗类型
                        _this.tipTxt = `该问题与问题${qIndex+1}的选项${oIndex+1}关联，确认删除？`;
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
                curOption = curQuestion.options[_this.goIndexs];

            // 跳转目标修改
            curOption.type = _this.targetType;
            curOption.issueOrResultId = _this.targetIndex;

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
            if(type === -1 || index === -1) { 
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
                option =  _this.gameQuestions[index].options[indexs];

            _this.goIndex = index;
            _this.goIndexs = indexs;

            _this.targetType = option.type;
            _this.targetIndex = option.issueOrResultId;

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
                _this.$message({
                    message: '问题最多为20个',
                    duration: 2000
                });
                return false;
            }

            // 在问题底下新增提问
            gameQuestions.splice(index + 1, 0, {
                _id: 0, // 问题序号
                question: { // 问题文字描述
                    image: '', // 问题图片地址
                    name: '', // 问题描述
                }, 
                options: [ // 问题选项数组
                    {
                        name: '', // 答案文字描述
                        type: -1,
                        issueOrResultId: -1
                    }, {
                        name: '', // 答案文字描述
                        type: -1,
                        issueOrResultId: -1
                    }
                ]
            });

            // 问题的关联性更新
            gameQuestions.forEach((question) => {
                question.options.forEach((option)=> {

                    // 当选项的关联索引 <= 删除索引 关联性不变

                    // 当选项的关联索引 > 增加索引 关联结果后置一个单位
                    if(option.type === 0 && option.issueOrResultId > index) {

                        // 删除问题的关联目标
                        option.issueOrResultId = option.issueOrResultId + 1;
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
            let _this = this,
                options = _this.gameQuestions[index].options;
            
            // 限制答案最多为四个
            if(options.length === 4) {
                _this.$message({
                    message: '问题选项最多为4个',
                    duration: 2000
                });
                return false;
            }

            // 添加选项
            options.push({
                name: '', // 答案文字描述
                type: -1,
                issueOrResultId: -1
            });

            // 同步vuex数据
            _this.syncData();
        },

        /**
         * 减少问题选项
         * @param {Nubmer} index 一级索引
         * @param {Number} indexs 二级索引
         */
        subOption(index) {
            let _this = this,
                options = _this.gameQuestions[index].options;
            
            // 限制答案最少为2个
            if(options.length === 2) {
                _this.$message({
                    message: '问题选项最少为2个',
                    duration: 2000
                });
                return false;
            }

            // 减少选项
            options.pop();

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
            if(gameQuestions.length <= 2) { // 当前问题个数为2

                gameQuestions.splice(_this.delIndex, 1, {
                    _id: 0, // 问题序号
                    question: { // 问题文字描述
                        image: '', // 问题图片地址
                        name: '', // 问题描述
                    }, 
                    options: [ // 问题选项数组
                        {
                            name: '', // 答案文字描述
                            type: -1,
                            issueOrResultId: -1
                        }, {
                            name: '', // 答案文字描述
                            type: -1,
                            issueOrResultId: -1
                        }
                    ]
                });
                // 如果此时问题个数为2  则维持 其它 -> 自身 的关联性
                
            } else {// 如果此时问题个数大于2
                
                // 更新 问题关联性
                gameQuestions.forEach((question) => {
                    question.options.forEach((option)=> {

                        // 当选项的关联索引 = 删除索引 删除关联性
                        if(option.type === 0 && option.issueOrResultId === _this.delIndex) {

                            // 删除问题的关联目标
                            option.type = -1;
                            option.issueOrResultId = -1;
                        }
                        
                        // 当选项的关联索引 > 删除索引 将关联性提前一个位置
                        if(option.type === 0 && option.issueOrResultId > _this.delIndex) {

                            // 提前问题的关联目标
                            option.issueOrResultId = option.issueOrResultId - 1;
                        }

                        // 当选项的关联索引 < 删除索引 关联性不变
                    })
                });

                // 设置当前问题索引为 0 默认值
                _this.changeQ(0);

                // 删除问题
                gameQuestions.splice(_this.delIndex, 1);

                
            }

            // 同步vuex数据
            _this.syncData();
        }
    },

    directives: {
        // 字数限制控制
        wordLimit: {
            inserted(el) {
                let input = el.querySelector('.el-input__inner')
                            || el.querySelector('.el-textarea__inner'),
                    limitEl = el.parentNode.querySelector('.input-num');

                // 隐藏字数限制提示
                hideWordLimit();

                // 监听表单聚焦事件显示字数限制提示
                input.addEventListener('focus', showChangeNum, false);
                // 表单修改事件显示字数
                input.addEventListener('input', showChangeNum, false);
                // 表单修改事件显示字数
                input.addEventListener('blur', hideWordLimit, false);

                // 改变字数限制字数
                function showChangeNum() {
                    limitEl.style.display = 'inline-block';
                }

                // 隐藏字数限制提示
                function hideWordLimit() {
                    limitEl.style.display = 'none';
                }
            }
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
    /* 主题颜色 */
    @color: #FF981A;
    
    /* 按钮样式 背景居中 */
    .btn-base {
        padding: 0;
        color: #fff;
        background: @color;
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
                        width: 20px;
                        height: 20px;
                        margin-right: 20px;
                        background: url('../pages/qa/assets/image/sub.png');    
                        cursor: pointer;               
                    }

                    .add {
                        width: 20px;
                        height: 20px;
                        background: url('../pages/qa/assets/image/add.png');
                        cursor: pointer;               
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
                                cursor: pointer;
                                text-align: center;
                                background: url('../pages/qa/assets/image/close.png');
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
                            padding-right: 40px;
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
                            flex-shrink: 0;
                            margin-right: 10px;
                            color: #bababa;
                        }

                        .target {
                            flex-shrink: 0;
                            cursor: pointer;
                        }
                        .target.active {
                            color: @color;
                        }
                    }
                }
                
                /* 添加选项 */
                .add-opt {
                    width: 323px;
                    text-align: right;
                    
                    .btn {
                        .btn-base;
                        height: 32px;
                        margin: 10px 0 0 20px;
                        padding: 0 16px;
                        color: #999999;
                        border: 1px solid #999999;
                        background: #fff;

                        &:hover {
                            color: @color;
                            border: 1px solid @color;
                        }
                    }
                }
            }
        }
    }

</style>


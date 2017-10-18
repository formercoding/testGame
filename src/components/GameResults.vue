<template>
    <div class="gameresult">
        <!-- 问题结果表单 -->
        <el-form v-for="(resultData, index) in gameResults"
                 :rules="ruleResult" 
                 :model="resultData" 
                 :key="index"
                 class="result-form">

            <!-- 结果遍历 -->
            <div class="result">

                <!-- 头部 -->
                <div class="header flex">
                    <span class="txt">测试结果 {{calculateIndex(index)}}</span>
                    <span class="sub" @click="delConfirm(index)"></span>
                    <span class="add" @click="add(index)"></span>
                </div>

                <!-- 题目 -->
                <el-form-item  prop="name" class="title">
                    <el-input v-model="resultData.name" 
                              :maxlength="10"
                              placeholder="标题不超过10个字..."
                              @blur="syncData"
                              v-wordLimit
                              @focus="changeR(index)"
                              class="w-300">
                    </el-input>
                    <span class="input-num">{{resultData.name.length}}/10</span>
                </el-form-item>

                <!-- 描述图片 -->
                <div class="flex desc-pic">
                    <div class="place-pic" v-show="resultData.image !== ''">
                        <img :src="resultData.image + '?imageMogr2/auto-orient/crop/!640x365'">
                        <span class="close" @click="changePic(index, '')"></span>
                    </div>

                    <div class="flex-col upload">
                        <div class="btn-wrap">
                            <uploadpic @upload="changePic" :flag="index"></uploadpic>
                        </div>
                        <span class="suggest">图片建议尺寸：640&times;365px</span>
                        <span class="suggest">图片支持格式：JPG、JPEG、png</span>
                    </div>
                </div>

                <!-- 结果描述 -->
                <el-form-item class="desc" prop="content">
                    <el-input type="textarea" 
                              :maxlength="500" 
                              v-model="resultData.content"
                              placeholder="文字描述..."
                              @blur="syncData"
                              v-wordLimit
                              @focus="changeR(index)"
                              class="w-370" 
                              resize="none">
                    </el-input>
                    <span class="input-num">{{resultData.content.length}}/500</span>
                </el-form-item>
            </div>
        </el-form>

        <!-- 提示弹出框 -->
        <tipdialog :isOpen.sync="tipDialog" @confirm="sub" :txt="tipTxt" title="操作提示"></tipdialog>
    </div>
</template>

<script>
import uploadpic from './UploadPic' // 图片上传组件
import tipdialog from './TipDialog' // 文字提示组件

export default {
    data() {
        return {
            // 验证规则
            ruleResult: {
                name: [
                    { required: true, message: '请输入标题', trigger: 'blur' }
                ],
                content: [
                    { required: true, message: '请输入文字描述', trigger: 'blur' }
                ]
            },
            tipDialog: false, // 提示弹窗状态
            delIndex: 0, // 点击的删除索引
            tipTxt: '是否删除？', // 提示弹窗文字
            picIndex: 0 // 当前选择图片索引
        }
    },

    computed: {
        // 计算游戏结果状态
        gameResults() {
            return this.$store.state.gameResults;
        },

        // 计算游戏问题状态
        gameQuestions() {
            return this.$store.state.gameQuestions;
        }
    },
    
    methods: {
        /**
         * 改变当前结果
         * @param {Number} index 结果索引
         */
        changeR(index) {
            this.$store.commit('setCurResultIndex', index);
        },

        /**
         * 修改图片地址
         * @param {Number} index 要改变的图片索引
         * @param {String} url 要改变的图片地址
         */
        changePic(index, url = '') {
            let _this = this,
                gameResults = _this.gameResults;
            
            // 改变图片
            gameResults[index].image = url;

            // 更新答案状态
            _this.syncData();
        },
        
        /**
         * 弹出确认 确认删除
         * @param {Number} index 要删除的答案索引
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
                    if(option.type === 1 && option.issueOrResultId === index) {
                        // 切换弹窗类型
                        _this.tipTxt = `该问题与问题${qIndex+1}的选项${oIndex+1}关联，是否确认删除？`;
                    }
                })
            });

            // 开启弹窗
            _this.tipDialog = true;
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
         * 增加问题结果
         * @param {Number} index 问题结果索引
         */
        add(index) {
            let _this = this,
                gameQuestions = _this.gameQuestions,
                gameResults = _this.gameResults;

            // 控制答案个数20
            if(gameResults.length === 10) {
                _this.$message({
                    message: '答案最多为10个',
                    duration: 2000
                });
                return false;
            }

            // 在选择答案下面新增答案
            gameResults.splice(index + 1, 0, {
                name: '',
                content: '',
                image: ''
            });

            // 问题的关联性更新
            gameQuestions.forEach((question) => {
                question.options.forEach((option)=> {
                    // 当选项的关联索引 <= 删除索引 关联性不变
                    // 当选项的关联索引 > 增加索引 关联结果后置一个单位
                    if(option.type === 1 && option.issueOrResultId > index) {
                        // 删除问题的关联目标
                        option.issueOrResultId = option.issueOrResultId + 1;
                    }
                })
            });

            // 更新问题
            _this.$store.commit('setGameQuestions', gameQuestions);

            // 更新vuex状态
            _this.syncData();
        },

        /**
         * 减少问题结果
         * @param {Number} index 问题结果索引
         */
        sub() {
            let _this = this,
                gameResults = _this.gameResults,
                gameQuestions = _this.gameQuestions;

            // 防止全被删除 至少保留2题
            if(gameResults.length === 2) {
                // 当前结果为2时替换题目
                gameResults.splice(_this.delIndex, 1, {
                    questionId: 0, // 测试结果序号
                    content: '', // 测试结果描述
                    image: '', // 测试结果图片地址
                    name: '', // 测试结果标题
                });
                // 此时结果个数为2，保留其关联性
            } else {
                // 当前结果个数大于2
                // 更新 问题关联性
                gameQuestions.forEach((question) => {
                    question.options.forEach((option)=> {
                        // 当选项的关联索引 = 删除索引 删除关联性
                        if(option.type === 1 && option.issueOrResultId === _this.delIndex) {
                            // 删除问题的关联目标
                            option.type = -1;
                            option.issueOrResultId = -1;
                        }
                        
                        // 当选项的关联索引 > 删除索引 将关联性提前一个位置
                        if(option.type === 1 && option.issueOrResultId > _this.delIndex) {
                            // 提前问题的关联目标
                            option.issueOrResultId = option.issueOrResultId - 1;
                        }

                        // 当选项的关联索引 < 删除索引 关联性不变
                    })
                });

                // 将当前答案设置为 0 默认值
                _this.changeR(0);
                
                // 删除问题
                gameResults.splice(_this.delIndex, 1);

                // 同时更新问题
                _this.$store.commit('setGameQuestions', gameQuestions);
                
            }

            // 更新游戏答案
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
        uploadpic,
        tipdialog
    }
}
</script>
<style lang="less">
    /* 主题颜色 */
    @color: #FF981A;
    
    /* 按钮样式 居中背景 */
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

    .gameresult {
        padding-top: 12px;
        font-size: 14px;
        color: #666;

        /* 结果表单遍历 */
        .result-form {
            /* 居中背景 */

            &:last-child {
                .result {
                    border-bottom: none;
                }
            }
            
            .result {
                margin-right: 62px;
                padding: 20px 0;
                border-bottom: 1px solid #d8d8d8;

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

                /* 结果标题 */
                .title {
                    margin-top: 10px;
                    margin-bottom: 0;

                    .input-num {
                        position: relative;
                        right: 45px;
                        display: inline-block;
                        width: 32px;
                        text-align: right;
                        font-size: 12px;
                        color: #ccc;
                        line-height: 30px;
                    }

                    .w-300 {
                        width: 300px;
                    }
                }
                
                /* 结果图片描述 */
                .desc-pic {
                    margin-top: 20px;
                    font-size: 14px;
                    color: #666;

                    /* 图片预览 */
                    .place-pic {
                        position: relative;
                        width: 140px;
                        height: 80px;
                        margin-right: 20px;
                        border-radius: 3px;

                        img {
                            width: 140px;
                            height: 80px;
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
                            margin-bottom: 10px;
                        }

                        .suggest {
                            font-size: 12px;
                            color: #999;
                            line-height: 17px;
                        }
                    }
                }

                /* 结果描述 */
                .desc {
                    margin-top: 10px;
                    margin-bottom: 0;

                    .input-num {
                        position: absolute;
                        right: 27px;
                        bottom: -26px;
                        font-size: 12px;
                        color: #ccc;
                    }

                    .w-370 {
                        position: relative;
                        width: 385px;
                        height: 140px;

                        &:after {
                            content: "*";
                            position: absolute;
                            top: -8px;
                            right: -17px;
                            font-size: 24px;
                            line-height: 40px;
                            color: #FF6A4D;
                        }
                    }
                }
            }
        }
    }
</style>


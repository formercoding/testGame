<template>
    <div class="gamebase">
        <!-- 基础设置表单 -->
        <el-form :model="gameBase" 
                 :rules="ruleBase" 
                 label-width="96px"
                 ref="form" 
                 class="base-form">

            <!-- 题目 -->
            <el-form-item label="题目" prop="title" class="title">
                <el-input v-model="gameBase.title"
                          :maxlength="12"
                          @blur="syncData"
                          v-wordLimit
                          class="w-300"                         
                          placeholder="请输入题目名称最多12字...">
                </el-input>

                <!-- 已输入字符数显示 -->
                <span class="input-num">{{gameBase.title.length}}/12</span>
            </el-form-item>

            <!-- 关键词 -->
            <el-form-item label="关键词" prop="keyword" class="keys">
                <el-input v-model="gameBase.keyword" 
                          :maxlength="20"
                          @blur="syncData"
                          v-wordLimit
                          placeholder="请输入关键词..."
                          class="w-300">
                </el-input>

                <span class="input-num">{{gameBase.keyword.length}}/20</span>
            </el-form-item>

            <!-- 文字描述 -->
            <el-form-item label="文字描述" class="desc" prop="description">
                <el-input type="textarea"
                          :maxlength="500"
                          @blur="syncData"
                          v-wordLimit                          
                          placeholder="请输入活动说明..."
                          v-model="gameBase.description" 
                          resize="none">
                </el-input>

                <span class="input-num">{{gameBase.description.length}}/500</span>
            </el-form-item>
        </el-form>

        <!-- 图片描述 -->
        <div class="flex desc-pic">
            <span class="label">图片描述</span>

            <!-- 图片展示 -->
            <div class="place-pic" v-show="hasIndexPic">
                <img :src="gameBase.image + '?imageMogr2/auto-orient/crop/!640x365'">
                <span class="close" @click="changePic(0, '')"></span>
            </div>

            <div class="flex-col upload">

                <!-- 上传图片组件 -->
                <div class="btn-wrap">
                    <uploadpic :flag="0" @upload="changePic"></uploadpic>
                </div>

                <!-- 图片建议尺寸 -->
                <span class="suggest">
                    图片建议尺寸：640&times;365px
                    <br>
                    图片支持格式：JPG、 JPEG、png
                </span>
            </div>
        </div>

        <!-- 分享设置 -->
        <div class="shareDefine flex">
            <span class="label">分享设置</span>

            <!-- 是否自定义分享选项 -->
            <el-radio-group v-model="gameBase.shareType" @blur="syncData">
                <el-radio class="radio" :label="0">默认设置</el-radio>
                <el-radio class="radio" :label="1">自定义设置</el-radio>
            </el-radio-group>
        </div>

        <!-- 分享设置 -->
        <div class="share" v-show="gameBase.shareType === 1">
            <div class="flex share-pic">
                <span class="label">分享图片</span>

                <!-- 图片展示 -->
                <img class="pic" 
                     :src="gameBase.shareImage + '?imageMogr2/auto-orient/crop/!200x200'" 
                     v-show="gameBase.shareImage">

                <!-- 图片上传组件 -->
                <div class="btn-wrap">
                    <uploadpic :flag="1" @upload="changePic"></uploadpic>
                </div>

                <!-- 图片建议尺寸 -->
                <div class="flex-col">
                    <span class="suggest">
                        图片尺寸：200&times;200px
                        <br>
                        图片格式：JPG、JPEG、png
                    </span>
                </div>
            </div>
            
            <!-- 分享设置表单 -->
            <el-form :model="gameBase" 
                     ref="shareForm" 
                     label-width="76px" 
                     class="share-form">

                <!-- 分享标题 -->
                <el-form-item label="分享标题" prop="shareTitle" class="title">
                    <el-input v-model="gameBase.shareTitle" 
                              class="w-260"
                              :maxlength="20"
                              v-wordLimit
                              placeholder="请输入分享标题最多20字..."
                              @blur="syncData">
                    </el-input>

                    <span class="input-num">{{gameBase.shareTitle.length}}/20</span>
                </el-form-item>

                <!-- 分享描述 -->
                <el-form-item label="分享描述"  class="desc" prop="shareContent">
                    <el-input type="textarea" 
                              v-model="gameBase.shareContent"
                              @blur="syncData"
                              v-wordLimit
                              placeholder="请输入分享描述最多30字..."
                              class="w-260"
                              resize="none"
                              :maxlength="30">
                    </el-input>

                    <span class="input-num">{{gameBase.shareContent.length}}/30</span>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
import uploadpic from './UploadPic'; // 图片上传组件
import Idouzi from '@idouzi/idouzi-tools' // IDOUZI工具包
import Tool from './../common/common.js' // 公共JS

export default {
    data() {
        return {
            ajaxUrl: {
                checkKeyword: Tool.editUrl('/supplier/check-keyword')
            },
            ruleBase: { // 基本设置校验
                title: [
                    { required: true, message: '请输入题目名称', trigger: 'blur' }
                ],
                keyword: [
                    { required: true, message: '请输入关键词', trigger: 'blur' },
                    { validator: this.checkKeyword, trigger: 'blur'}
                ]
            }
        }
    },

    computed: {
        // 设置gameBase为store gameBase
        gameBase() {
            return this.$store.state.gameBase;
        },

        // 是否存在首页图片
        hasIndexPic() {
            return this.gameBase.image !== '';
        },
    },

    methods: {
        /**
         * ajax请求错误提示
         * @param {Object} error 请求错误对象
         */
        showError(error) {
            // 网络错误
            if(error.response) {
                this.$message({
                    message: error.response.status + ':网络错误，请刷新重试',
                    duration: 2000
                });
            } else { // 请求错误
                this.$message({
                    message: '请求错误，请刷新重试',
                    duration: 2000
                });
            }
        },
        
        /**
         * 修改图片地址
         * @param {Number} index 要改变的图片索引
         * @param {String} url 要改变的图片地址
         */
        changePic(index, url = '') {
            let _this = this,
                gameBase = _this.gameBase;

            // 根据不同的按钮位置来改变不同位置的图片
            if(index === 0) {
                gameBase.image = url;
            } else if(index === 1) {
                let share = gameBase.share;
                gameBase.shareImage = url;
            }

            // 更新基础设置状态
            _this.syncData();
        },

        // 将表单数据与vuex同步
        syncData() {
            let _this = this;

            _this.$store.commit('setGameBase', _this.gameBase);
        },

        /**
         * 检查关键词是否正确
         * @param {Object} rule 当前校验规则
         * @param {String} value 当前校验对象值
         * @param {Function} callback  回调函数
         */
        checkKeyword(rule, value, callback) {
            let _this = this,
                gameBase = _this.gameBase;

            if (value) {
                // 请求校验
                _this.$http({
                    url: _this.ajaxUrl.checkKeyword,
                    methods: 'get',
                    params: {
                        keyword: value,
                    }
                }).then((res) => {
                    let resData = res.data;

                    // 验证是否通过
                    if(resData.return_code === 'SUCCESS') {
                        _this.$emit('update:validateKey', true);
                        callback();
                    } else {
                        _this.$emit('update:validateKey', false);
                        callback(new Error(resData.return_msg));
                    }
                }).catch(() => {
                    _this.$emit('update:validateKey', false);
                    callback(new Error('网络错误，请刷新后重试！'));
                });
            }
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
        uploadpic
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

    /* 基础设置模块 */
    .gamebase {
        padding-bottom: 28px;

        /* 基础设置表单 */
        .base-form {
            padding-top: 32px;
            font-size: 14px;
            color: #666;
            
            /* 标题 */
            .title {
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

            /* 关键词 */
            .keys {
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

                    .el-input__inner {
                        padding-right: 45px;
                    }
                }
            }

            /* 描述 */
            .desc {
                .input-num {
                    position: absolute;
                    right: 12px;
                    bottom: -26px;
                    font-size: 12px;
                    color: #ccc;
                }

                .el-textarea {
                    width: 384px;
                    height: 160px;
                }
            }
        }

        /* 描述图片 */
        .desc-pic {
            margin-bottom: 20px;
            font-size: 14px;
            color: #666;

            .label {
                width: 96px;
            }

            /* 图片预览 */
            .place-pic {
                position: relative;
                width: 140px;
                height: 80px;
                margin-right: 20px;
                border-radius: 3px;

                img {
                    display: block;
                    width: 100%;
                    height: 100%;
                }

                .close {
                    .back;
                    position: absolute;
                    top: -7px;
                    right: -6px;
                    width: 16px;
                    height: 16px;
                    cursor: pointer;
                    text-align: center;
                    font-size: 14px;
                    background: url('../pages/qa/assets/image/close.png');
                }
            }

            /* 图片上传 */
            .upload {
                font-size: 16px;
                color: #666;

                .btn {
                    display: inline-block;
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

        /* 自定义分享 */
        .shareDefine {
            margin-bottom: 10px;
            font-size: 14px;
            color: #666;

            .label {
                width: 96px;
            }

            .radio {
                width: 98px;
            }
        }

        /* 分享设置 */
        .share {
            width: 384px;
            margin-left: 96px;
            padding: 20px 5px 18px 10px;
            font-size: 14px;
            color: #666;
            border-radius: 5px;
            background: #f7f7f7;

            /* 分享图片 */
            .share-pic {
                .label {
                    width: 76px; 
                    text-align: center;
                    line-height: 32px;
                }

                img {
                    width: 40px;
                    height: 40px;
                    border: none;
                    border-radius: 3px;
                }

                .btn-wrap {
                    width: 80px;
                    height: 32px;
                    margin-left: 10px;
                }

                .suggest {
                    padding-left: 4px;
                    font-size: 12px;
                    color: #999;
                    line-height: 17px;
                }
            }

            /* 分享表单 */
            .share-form {
                margin-top: 18px;

                /* 分享标题 */
                .title {
                    position: relative;
                    
                    .el-form-item__label {
                        padding-right: 0;
                        text-align: center;
                    }

                    .w-260 {
                        width: 260px;

                        .el-input__inner {
                            padding-right: 45px;
                        }
                    }

                    .input-num {
                        position: absolute;
                        top: 0;
                        right: 40px;
                        line-height: 34px;
                        font-size: 12px;
                        color: #ccc;
                    }
                }

                /* 分享描述 */
                .desc {
                    position: relative;
                    margin: 20px 0 0 0;

                    .w-260 {
                        width: 260px;
                        height: 54px;
                    }

                    .el-form-item__label {
                        padding-right: 0;
                        text-align: center;
                    }

                    .input-num {
                        position: absolute;
                        bottom: -5px;
                        right: 40px;
                        line-height: 32px;
                        font-size: 12px;
                        color: #ccc;
                    }
                }
            }
        }
    }
</style>
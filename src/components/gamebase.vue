<template>
    <div class="gamebase">
        <!-- 基础设置表单 -->
        <el-form :model="gameBase" 
                 :rules="ruleBase" 
                 label-width="96px"
                 ref="baseform" 
                 class="base-form">
            <!-- 题目 -->
            <el-form-item label="题目" prop="name" class="title">
                <el-input v-model="gameBase.name" 
                          :maxlength="12"
                          @change="syncData"
                          placeholder="请输入题目名称最多12字..." 
                          class="w-300">
                </el-input>
                <span class="input-num">{{gameBase.name.length}}/12</span>
            </el-form-item>
            <!-- 关键词 -->
            <el-form-item label="关键词" prop="keyword" class="keys">
                <el-input v-model="gameBase.keyword" 
                          :maxlength="20"
                          @change="syncData"
                          placeholder="请输入关键词..." 
                          class="w-300">
                </el-input>
                <span class="input-num">{{gameBase.keyword.length}}/20</span>
            </el-form-item>
            <!-- 文字描述 -->
            <el-form-item label="文字描述" class="desc" prop="description">
                <el-input type="textarea"
                          :maxlength="150"
                          @change="syncData"
                          placeholder="请输入活动说明..."
                          v-model="gameBase.description" 
                          class="w-384"
                          resize="none">
                </el-input>
                <span class="input-num">{{gameBase.description.length}}/150</span>
            </el-form-item>
        </el-form>
        <!-- 图片描述 -->
        <div class="flex desc-pic">
            <span class="label">图片描述</span>
            <div class="place-pic" v-show="hasIndexPic">
                <img :src="gameBase.image">
                <span class="close" @click="deletePic"></span>
            </div>
            <div class="flex-col upload">
                <div class="btn-wrap">
                    <v-uploadpic :data="{pos: 'gameBase', flag: 'index'}"></v-uploadpic>
                </div>
                <span class="suggest">图片建议尺寸：640&times;365px</span>
                <span class="suggest">图片支持格式：JPG、 JPEG、png</span>
            </div>
        </div>
        <!-- 分享选择 -->
        <div class="shareDefine flex">
            <span class="label">分享设置</span>
            <el-radio-group v-model="gameBase.share.shareType" @change="syncData">
                <el-radio class="radio" label="false">默认设置</el-radio>
                <el-radio class="radio" label="true">自定义设置</el-radio>
            </el-radio-group>
        </div>
        <!-- 分享设置 -->
        <div class="share">
            <div class="flex share-pic">
                <span class="label">分享图片</span>
                <img class="pic" :src="shareConfig.shareImage">
                <div class="btn-wrap">
                    <v-uploadpic :data="{pos: 'gameBase', flag: 'share'}"></v-uploadpic>
                </div>
                <div class="flex-col">
                    <span class="suggest">图片尺寸：200&times;200px</span>
                    <span class="suggest">图片格式：JPG、JPEG、png</span>
                </div>
            </div>
            <!-- 分享设置表单 -->
            <el-form :model="shareConfig" 
                     ref="shareForm" 
                     label-width="76px" 
                     class="share-form">
                <!-- 分享标题 -->
                <el-form-item label="分享标题" prop="shareTitle" class="title">
                    <el-input v-model="shareConfig.shareTitle" class="w-260" @change="syncData"></el-input>
                </el-form-item>
                <!-- 分享描述 -->
                <el-form-item label="分享描述"  class="desc" prop="shareContent">
                    <el-input type="textarea" 
                              v-model="shareConfig.shareContent"
                              @change="syncData"
                              class="w-260"
                              resize="none"
                              >
                    </el-input>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>

import vUploadpic from './uploadpic';

export default {
    data() {
        return {
            ruleBase: { // 基本设置校验
                title: [
                    { required: true, message: '请输入题目名称', trigger: 'blur' }
                ],
                keys: [
                    { required: true, message: '请输入关键词', trigger: 'blur' }
                ]
            }
        }
    },

    computed: {
        // 设置gameBase为store gameBase
        gameBase() {
            return this.$store.state.gameBase;
        },

        // 设置shareconfig为shareConfig
        shareConfig() {
            return this.$store.state.gameBase.share.shareConfig;
        },

        // 是否存在首页图片
        hasIndexPic() {
            return this.gameBase.image !== '';
        }
    },

    methods: {
        // 将表单数据与vuex同步
        syncData() {
            this.$store.commit('setGameBase', this.gameBase);
        },

        // 删除预览图片
        deletePic() {
            this.$store.commit('changeIndexPic', '');
        }
    },

    components: {
        vUploadpic
    }
}
</script>
<style lang="less">
    /* 按钮样式 居中背景 */
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
                }

                .w-300 {
                    width: 300px;
                }
            }

            /* 描述 */
            .desc {
                .input-num {
                    position: absolute;
                    right: 21px;
                    bottom: -2px;
                    font-size: 12px;
                    color: #ccc; 
                }

                .w-384 {
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
                    cursor: default;
                    text-align: center;
                    font-size: 14px;
                    background: url('../assets/image/close.png');
                }
            }

            /* 图片上传 */
            .upload {
                font-size: 16px;
                color: #666;

                .btn {
                    // .btn-base;
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
                    .el-form-item__label {
                        padding-right: 0;
                        text-align: center;
                    }

                    .w-260 {
                        width: 260px;
                    }
                }

                /* 分享描述 */
                .desc {
                    margin: 20px 0 0 0;

                    .w-260 {
                        width: 260px;
                        height: 52px;
                    }

                    .el-form-item__label {
                        padding-right: 0;
                        text-align: center;
                    }
                }
            }
        }
    }
</style>
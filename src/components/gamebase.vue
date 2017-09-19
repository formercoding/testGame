<template>
    <div class="gamebase">
        <!-- 基础设置表单 -->
        <el-form :model="baseForm" 
                 :rules="ruleBase" 
                 label-width="96px"
                 ref="baseform" 
                 class="base-form">
            <!-- 题目 -->
            <el-form-item label="题目" prop="title" class="title">
                <el-input v-model="baseForm.title" 
                          :maxlength="12"
                          placeholder="请输入题目名称最多12字..." 
                          class="w-300">
                </el-input>
                <span class="input-num">{{baseForm.title.length}}/12</span>
            </el-form-item>
            <!-- 关键词 -->
            <el-form-item label="关键词" prop="keys" class="keys">
                <el-input v-model="baseForm.keys" 
                          :maxlength="20"
                          placeholder="请输入关键词..." 
                          class="w-300">
                </el-input>
                <span class="input-num">{{baseForm.keys.length}}/20</span>
            </el-form-item>
            <!-- 文字描述 -->
            <el-form-item label="文字描述" class="desc" prop="desc">
                <el-input type="textarea"
                          :maxlength="150"
                          placeholder="请输入活动说明..."
                          v-model="baseForm.desc" 
                          class="w-384"
                          resize="none">
                </el-input>
                <span class="input-num">{{baseForm.desc.length}}/150</span>
            </el-form-item>
        </el-form>
        <!-- 图片描述 -->
        <div class="flex desc-pic">
            <span class="label">图片描述</span>
            <div class="place-pic" v-show="hasIndexPic">
                <img :src="picUrl.index">
                <span class="close" @click="deletePic('index')"></span>
            </div>
            <div class="flex-col upload">
                <div class="btn-wrap">
                    <v-uploadpic :data="indexPic" @uploadPic="changePic"></v-uploadpic>
                </div>
                <span class="suggest">图片建议尺寸：640&times;365px</span>
                <span class="suggest">图片支持格式：JPG、 JPEG、png</span>
            </div>
        </div>
        <!-- 分享选择 -->
        <div class="shareDefine flex">
            <span class="label">分享设置</span>
            <el-radio class="radio" v-model="radio" label="1">默认设置</el-radio>
            <el-radio class="radio" v-model="radio" label="2">自定义设置</el-radio>
        </div>
        <!-- 分享设置 -->
        <div class="share">
            <div class="flex share-pic">
                <span class="label">分享图片</span>
                <img class="pic" :src="picUrl.share">
                <div class="btn-wrap">
                    <v-uploadpic :data="sharePic" @uploadPic="changePic"></v-uploadpic>
                </div>
                <div class="flex-col">
                    <span class="suggest">图片尺寸：200&times;200px</span>
                    <span class="suggest">图片格式：JPG、JPEG、png</span>
                </div>
            </div>
            <!-- 分享设置表单 -->
            <el-form :model="shareForm" 
                     ref="shareForm" 
                     label-width="76px" 
                     class="share-form">
                <!-- 分享标题 -->
                <el-form-item label="分享标题" prop="title" class="title">
                    <el-input v-model="shareForm.name" class="w-260"></el-input>
                </el-form-item>
                <!-- 分享描述 -->
                <el-form-item label="分享描述" class="desc" prop="desc">
                    <el-input type="textarea" 
                              v-model="shareForm.desc" 
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
            picUrl: {
                // 首页·图片·
                index: 'http://img.redocn.com/sheying/20151230/shanfengjingfushitufengjingsheyingtupian_5678440.jpg',
                // 分享图片
                share: 'http://img.redocn.com/sheying/20151230/shanfengjingfushitufengjingsheyingtupian_5678440.jpg'
            },
            indexPic: {
                param: 'index',
                txt: '选择图片',
                limit: 1000
            },
            sharePic: {
                param: 'share',
                txt: '选择图片',
                limit: 1000
            },
            radio: "1", // 是否设置分享自定义 1默认 2自定义
            baseForm: { // 基本描述表单信息
                title: '',
                keys: '',
                desc: ''
            },
            shareForm: { // 分享设置表单信息
                title: '',
                desc: ''
            },
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
        // 是否存在首页图片
        hasIndexPic() {
            return this.picUrl.index !== '';
        }
    },

    methods: {
        /**
         * 改变img的url地址
         * @param {String} name 图片字段名
         * @param {String} url  图片地址
         */
        changePic(name, url) {
            this.picUrl[name] = url;
        },

        /**
         * 预览图片删除
         * @param {String} name 图片字段名
         */
        deletePic(name) {
            this.picUrl[name] = '';
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
<template>
    <div class="gameresult">
        <!-- 问题结果表单 -->
        <el-form v-for="(resultData, index) in resultForm"
                 :rules="ruleResult" :model="resultData" 
                 :key="index"
                 class="result-form">
            <!-- 结果遍历 -->
            <div class="result">
                <!-- 头部 -->
                <div class="header flex">
                    <span class="txt">测试结果 {{calculateIndex(index)}}</span>
                    <span class="sub" @click="sub(index)">-</span>
                    <span class="add" @click="add(index)">+</span>
                </div>
                <!-- 题目 -->
                <el-form-item  prop="title" class="title">
                    <el-input v-model="resultData.title" 
                              :maxlength="10"
                              placeholder="标题不超过10个字..." 
                              class="w-300">
                    </el-input>
                    <span class="input-num">{{resultData.title.length}}/10</span>
                </el-form-item>
                <!-- 描述图片 -->
                <div class="flex desc-pic">
                    <div class="place-pic" v-show="resultData.url !== ''">
                        <img :src="resultData.url">
                        <span class="close" @click="deletePic(index)"></span>
                    </div>
                    <div class="flex-col upload">
                        <div class="btn-wrap">
                            <v-uploadpic :data="calculatePic(index)" @uploadPic="changePic"></v-uploadpic>
                        </div>
                        <span class="suggest">图片建议尺寸：640&times;365px</span>
                        <span class="suggest">图片支持格式：JPG、 JPEG、png</span>
                    </div>
                </div>
                <!-- 结果描述 -->
                <el-form-item class="desc" prop="desc">
                    <el-input type="textarea" 
                              :maxlength="150" 
                              v-model="resultData.desc"
                              placeholder="文字描述..."
                              class="w-370" 
                              resize="none">
                    </el-input>
                    <span class="input-num">{{resultData.desc.length}}/150</span>
                </el-form-item>
            </div>
        </el-form>
    </div>
</template>
<script>
import vUploadpic from './uploadpic'
export default {
    data() {
        return {
            resultForm: [{
                    title: '1',
                    desc: '',
                    url: 'http://img3.redocn.com/20131025/Redocn_2013102514143640.jpg'
                }, {
                    title: '',
                    desc: '',
                    url: 'http://img3.redocn.com/20131025/Redocn_2013102514143640.jpg'
                }, {
                    title: '',
                    desc: '',
                    url: 'http://img3.redocn.com/20131025/Redocn_2013102514143640.jpg'
                }, {
                    title: '',
                    desc: '',
                    url: 'http://img3.redocn.com/20131025/Redocn_2013102514143640.jpg'
                }],
            ruleResult: {
                title: [
                    { required: true, message: '请输入标题', trigger: 'blur' }
                ],
                desc: [
                    { required: true, message: '请输入文字描述', trigger: 'blur' }
                ]
            }
        }
    },

    methods: {
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
            this.resultForm[index].url = url;
        },

        /**
         * 预览图片删除
         * @param {String} index 图片所在数组索引
         */
        deletePic(index) {
            this.resultForm[index].url = '';
        },

        /**
         * 增加问题结果
         * @param {Number} index 问题结果索引
         */
        add(index) {
            // 控制问题20以上
            if(this.resultForm.length === 20) {
                return false;
            }

            this.resultForm.splice(index + 1, 0, {
                title: '',
                desc: '',
                url: ''
            });
        },

        /**
         * 减少问题结果
         * @param {Number} index 问题结果索引
         */
        sub(index) {
            // 防止全被删除
            if(this.resultForm.length === 1) {
                return false;
            }

            this.resultForm.splice(index, 1);
            
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
                        right: 53px;
                        bottom: -2px;
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

